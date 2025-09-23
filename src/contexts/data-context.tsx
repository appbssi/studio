"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Agent, Mission } from '@/lib/types';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  writeBatch,
  deleteDoc,
  deleteField,
  onSnapshot,
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
    const agentsCollection = collection(db, 'agents');
    const missionsCollection = collection(db, 'missions');

    const unsubscribeAgents = onSnapshot(agentsCollection, (snapshot) => {
      const agentsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
      setAgents(agentsList);
      if(!isLoaded) setIsLoaded(true);
    }, (error) => {
      console.error("Failed to load agents from Firestore", error);
      setIsLoaded(true);
    });

    const unsubscribeMissions = onSnapshot(missionsCollection, (snapshot) => {
      const missionsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mission));
      setMissions(missionsList);
      if(!isLoaded) setIsLoaded(true);
    }, (error) => {
      console.error("Failed to load missions from Firestore", error);
      setIsLoaded(true);
    });

    // Cleanup function to unsubscribe from listeners on component unmount
    return () => {
      unsubscribeAgents();
      unsubscribeMissions();
    };
  }, []);
  
  const addAgent = async (agentData: Omit<Agent, 'id' | 'status' | 'photoUrl'>) => {
    const id = Date.now().toString(); // Temporary for photo URL
    const newAgentData = {
      ...agentData,
      status: 'available' as const,
      photoUrl: `https://picsum.photos/seed/${id}/400/400`,
    };
    await addDoc(collection(db, 'agents'), newAgentData);
  };

  const addMission = async (missionData: Omit<Mission, 'id' | 'status'>) => {
    const newMissionData = {
      ...missionData,
      status: 'planned' as const,
    };
    const docRef = await addDoc(collection(db, 'missions'), newMissionData);
    
    const batch = writeBatch(db);
    missionData.agentIds.forEach(agentId => {
      const agentRef = doc(db, 'agents', agentId);
      batch.update(agentRef, { status: 'occupied', currentMissionId: docRef.id });
    });
    await batch.commit();
  };
  
  const completeMission = async (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    const missionRef = doc(db, 'missions', missionId);
    await updateDoc(missionRef, { status: 'completed' });

    const batch = writeBatch(db);
    mission.agentIds.forEach(agentId => {
        const agentRef = doc(db, 'agents', agentId);
        batch.update(agentRef, { status: 'available', currentMissionId: deleteField() });
    });
    await batch.commit();
  };

  const deleteAgent = async (agentId: string) => {
    // First, remove the agent from any missions they are assigned to
    const batch = writeBatch(db);
    const updatedMissions = missions.map(mission => {
        if (mission.agentIds.includes(agentId)) {
            const updatedAgentIds = mission.agentIds.filter(id => id !== agentId);
            const missionRef = doc(db, 'missions', mission.id);
            batch.update(missionRef, { agentIds: updatedAgentIds });
            return { ...mission, agentIds: updatedAgentIds };
        }
        return mission;
    });
    await batch.commit();

    // Then, delete the agent document
    await deleteDoc(doc(db, "agents", agentId));
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
