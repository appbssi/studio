"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Agent, Mission } from '@/lib/types';
import { initialAgents, initialMissions } from '@/lib/initial-data';

interface DataContextProps {
  agents: Agent[];
  missions: Mission[];
  addAgent: (agentData: Omit<Agent, 'id' | 'status' | 'photoUrl'>) => void;
  addMission: (missionData: Omit<Mission, 'id' | 'status'>) => void;
  completeMission: (missionId: string) => void;
  getAgentById: (agentId: string) => Agent | undefined;
  getMissionById: (missionId: string) => Mission | undefined;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedAgents = localStorage.getItem('agents');
      const savedMissions = localStorage.getItem('missions');

      if (savedAgents && savedAgents !== '[]') {
        setAgents(JSON.parse(savedAgents));
      } else {
        setAgents(initialAgents);
      }

      if (savedMissions && savedMissions !== '[]') {
        setMissions(JSON.parse(savedMissions));
      } else {
        setMissions(initialMissions);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setAgents(initialAgents);
      setMissions(initialMissions);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('agents', JSON.stringify(agents));
    }
  }, [agents, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('missions', JSON.stringify(missions));
    }
  }, [missions, isLoaded]);

  const addAgent = (agentData: Omit<Agent, 'id' | 'status' | 'photoUrl'>) => {
    const id = Date.now().toString();
    const newAgent: Agent = {
      id,
      ...agentData,
      status: 'available',
      photoUrl: `https://picsum.photos/seed/${id}/400/400`,
    };
    setAgents(prev => [...prev, newAgent]);
  };

  const addMission = (missionData: Omit<Mission, 'id' | 'status'>) => {
    const id = Date.now().toString();
    const newMission: Mission = {
      id,
      ...missionData,
      status: 'planned'
    };
    setMissions(prev => [...prev, newMission]);
    setAgents(prev =>
      prev.map(agent =>
        newMission.agentIds.includes(agent.id)
          ? { ...agent, status: 'occupied', currentMissionId: newMission.id }
          : agent
      )
    );
  };
  
  const completeMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    setMissions(prev =>
      prev.map(m =>
        m.id === missionId ? { ...m, status: 'completed' } : m
      )
    );

    setAgents(prev =>
      prev.map(agent =>
        mission.agentIds.includes(agent.id)
          ? { ...agent, status: 'available', currentMissionId: undefined }
          : agent
      )
    );
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
    <DataContext.Provider value={{ agents, missions, addAgent, addMission, completeMission, getAgentById, getMissionById }}>
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
