export type AgentStatus = 'available' | 'occupied';

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  matricule: string;
  contact: string;
  address: string;
  photoUrl: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  agentIds: string[];
  status: 'planned' | 'in-progress' | 'completed';
}
