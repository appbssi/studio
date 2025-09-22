"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Agent, Mission } from '@/lib/types';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  writeBatch,
  query,
  where,
  deleteDoc
} from 'firebase/firestore';

interface DataContextProps {
  agents: Agent[];
  missions: Mission[];
  addAgent: (agentData: Omit<Agent, 'id' | 'status' | 'photoUrl'>) => Promise<void>;
  addMission: (missionData: Omit<Mission, 'id' | 'status'>) => Promise<void>;
  completeMission: (missionId: string) => Promise<void>;
  deleteAgent: (agentId: string) => Promise<void>;
  getAgentById: (agentId: string) => Agent | undefined;
  getMissionById: (missionId: string) => Mission | undefined;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agentsCollection = collection(db, 'agents');
        const agentsSnapshot = await getDocs(agentsCollection);
        const agentsList = agentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
        setAgents(agentsList);

        const missionsCollection = collection(db, 'missions');
        const missionsSnapshot = await getDocs(missionsCollection);
        const missionsList = missionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mission));
        setMissions(missionsList);

      } catch (error) {
        console.error("Failed to load data from Firestore", error);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, []);
  
  const addAgent = async (agentData: Omit<Agent, 'id' | 'status' | 'photoUrl'>) => {
    const id = Date.now().toString(); // Temporary for photo URL
    const newAgentData = {
      ...agentData,
      status: 'available' as const,
      photoUrl: `https://picsum.photos/seed/${id}/400/400`,
    };
    const docRef = await addDoc(collection(db, 'agents'), newAgentData);
    const newAgent: Agent = { id: docRef.id, ...newAgentData };
    setAgents(prev => [...prev, newAgent]);
  };

  const addMission = async (missionData: Omit<Mission, 'id' | 'status'>) => {
    const newMissionData = {
      ...missionData,
      status: 'planned' as const,
    };
    const docRef = await addDoc(collection(db, 'missions'), newMissionData);
    const newMission: Mission = { id: docRef.id, ...newMissionData };
    setMissions(prev => [...prev, newMission]);

    const batch = writeBatch(db);
    newMission.agentIds.forEach(agentId => {
      const agentRef = doc(db, 'agents', agentId);
      batch.update(agentRef, { status: 'occupied', currentMissionId: newMission.id });
    });
    await batch.commit();

    setAgents(prev =>
      prev.map(agent =>
        newMission.agentIds.includes(agent.id)
          ? { ...agent, status: 'occupied', currentMissionId: newMission.id }
          : agent
      )
    );
  };
  
  const completeMission = async (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    const missionRef = doc(db, 'missions', missionId);
    await updateDoc(missionRef, { status: 'completed' });

    setMissions(prev =>
      prev.map(m =>
        m.id === missionId ? { ...m, status: 'completed' } : m
      )
    );

    const batch = writeBatch(db);
    mission.agentIds.forEach(agentId => {
        const agentRef = doc(db, 'agents', agentId);
        batch.update(agentRef, { status: 'available', currentMissionId: undefined });
    });
    await batch.commit();

    setAgents(prev =>
      prev.map(agent =>
        mission.agentIds.includes(agent.id)
          ? { ...agent, status: 'available', currentMissionId: undefined }
          : agent
      )
    );
  };

  const deleteAgent = async (agentId: string) => {
    // Note: This is a simplified deletion. In a real-world scenario, you'd want to handle
    // what happens if the agent is on an active mission. For this app, we'll assume
    // you can only delete agents who are not on active missions or handle it client-side.
    
    // First, remove the agent from any missions they are assigned to
    const updatedMissions = missions.map(m => ({
        ...m,
        agentIds: m.agentIds.filter(id => id !== agentId)
    }));
    
    const batch = writeBatch(db);
    missions.forEach(mission => {
        if(mission.agentIds.includes(agentId)) {
            const missionRef = doc(db, 'missions', mission.id);
            batch.update(missionRef, {
                agentIds: mission.agentIds.filter(id => id !== agentId)
            });
        }
    })
    await batch.commit();
    setMissions(updatedMissions);

    // Then, delete the agent document
    await deleteDoc(doc(db, "agents", agentId));
    setAgents(prev => prev.filter(a => a.id !== agentId));
  };

  const getAgentById = (agentId: string) => agents.find(a => a.id === agentId);
  const getMissionById = (missionId: string) => missions.find(m => m.id === missionId);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ agents, missions, addAgent, addMission, completeMission, deleteAgent, getAgentById, getMissionById }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
