"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Agent, Mission, AgentStatus } from '@/lib/types';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  writeBatch,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

interface DataContextProps {
  agents: Agent[];
  missions: Mission[];
  isLoaded: boolean;
  addAgent: (agentData: Omit<Agent, 'id' | 'photoUrl'>) => Promise<void>;
  updateAgent: (agentId: string, agentData: Omit<Agent, 'id' | 'photoUrl'>) => Promise<void>;
  addMission: (missionData: Omit<Mission, 'id' | 'status'>) => Promise<void>;
  completeMission: (missionId: string) => Promise<void>;
  extendMission: (missionId: string, newEndDate: string) => Promise<void>;
  deleteAgent: (agentId: string) => Promise<void>;
  getAgentById: (agentId: string) => Agent | undefined;
  getMissionById: (missionId: string) => Mission | undefined;
  getAgentStatus: (agentId: string) => AgentStatus;
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

    return () => {
      unsubscribeAgents();
      unsubscribeMissions();
    };
  }, [isLoaded]);
  
  const addAgent = async (agentData: Omit<Agent, 'id' | 'photoUrl'>) => {
    const id = Date.now().toString();
    const newAgentData = {
      ...agentData,
      photoUrl: `https://picsum.photos/seed/${id}/400/400`,
    };
    await addDoc(collection(db, 'agents'), newAgentData);
  };

  const updateAgent = async (agentId: string, agentData: Omit<Agent, 'id' | 'photoUrl'>) => {
    const agentRef = doc(db, 'agents', agentId);
    await updateDoc(agentRef, agentData);
  };

  const addMission = async (missionData: Omit<Mission, 'id' | 'status'>) => {
    const newMissionData = {
      ...missionData,
      status: 'planned' as const,
    };
    await addDoc(collection(db, 'missions'), newMissionData);
  };
  
  const completeMission = async (missionId: string) => {
    const missionRef = doc(db, 'missions', missionId);
    await updateDoc(missionRef, { status: 'completed' });
  };

  const extendMission = async (missionId: string, newEndDate: string) => {
    const missionRef = doc(db, 'missions', missionId);
    await updateDoc(missionRef, { endDate: newEndDate });
  };

  const deleteAgent = async (agentId: string) => {
    const batch = writeBatch(db);
    missions.forEach(mission => {
        if (mission.agentIds.includes(agentId)) {
            const updatedAgentIds = mission.agentIds.filter(id => id !== agentId);
            const missionRef = doc(db, 'missions', mission.id);
            batch.update(missionRef, { agentIds: updatedAgentIds });
        }
    });
    await batch.commit();

    await deleteDoc(doc(db, "agents", agentId));
  };

  const getAgentById = (agentId: string) => agents.find(a => a.id === agentId);
  const getMissionById = (missionId: string) => missions.find(m => m.id === missionId);

  const getAgentStatus = useCallback((agentId: string): AgentStatus => {
    const isOccupied = missions.some(mission => 
        mission.agentIds.includes(agentId) && 
        (mission.status === 'planned' || mission.status === 'in-progress')
    );
    return isOccupied ? 'occupied' : 'available';
  }, [missions]);

  return (
    <DataContext.Provider value={{ agents, missions, isLoaded, addAgent, updateAgent, addMission, completeMission, extendMission, deleteAgent, getAgentById, getMissionById, getAgentStatus }}>
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
