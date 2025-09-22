import { Agent, Mission } from './types';

// This data is now used for seeding the database for the first time
// or for local testing if Firestore is not available. 
// The main data source is now Firestore.

export const initialAgents: Agent[] = [
  { id: '1', firstName: 'John', lastName: 'Shepard', matricule: 'N7-001', contact: 'jshepard@alliance.mil', address: 'SSV Normandy SR-2', photoUrl: 'https://picsum.photos/seed/jshepard/400/400', status: 'available' },
  { id: '2', firstName: 'Garrus', lastName: 'Vakarian', matricule: 'CSEC-002', contact: 'gvakarian@citadel.sec', address: 'Normandy Main Battery', photoUrl: 'https://picsum.photos/seed/garrus/400/400', status: 'available' },
  { id: '3', firstName: 'Tali\'Zorah', lastName: 'nar Rayya', matricule: 'QM-003', contact: 'tvasnormandy@fleet.mil', address: 'Normandy Engineering', photoUrl: 'https://picsum.photos/seed/tali/400/400', status: 'occupied', currentMissionId: '101' },
  { id: '4', firstName: 'Liara', lastName: 'T\'Soni', matricule: 'SI-004', contact: 'ltsoni@broker.net', address: 'Shadow Broker\'s Lair', photoUrl: 'https://picsum.photos/seed/liara/400/400', status: 'available' },
  { id: '5', firstName: 'Urdnot', lastName: 'Wrex', matricule: 'KGN-005', contact: 'uwrex@tuchanka.gov', address: 'Tuchanka', photoUrl: 'https://picsum.photos/seed/wrex/400/400', status: 'occupied', currentMissionId: '101' },
  { id: '6', firstName: 'Miranda', lastName: 'Lawson', matricule: 'CL-006', contact: 'mlawson@cerberus.net', address: 'Cerberus HQ', photoUrl: 'https://picsum.photos/seed/miranda/400/400', status: 'available' },
];

export const initialMissions: Mission[] = [
  { id: '101', title: 'Opération: Liberté', description: 'Reconnaissance sur la planète Eden Prime.', startDate: '2024-08-01', endDate: '2024-08-15', agentIds: ['3', '5'], status: 'in-progress' },
  { id: '102', title: 'Mission: Horizon', description: 'Enquête sur la disparition de la colonie Horizon.', startDate: '2024-07-20', endDate: '2024-07-30', agentIds: ['1', '2'], status: 'completed' },
  { id: '103', title: 'Projet: Suprématie', description: 'Infiltration d\'une base ennemie sur Ilos.', startDate: '2024-09-01', endDate: '2024-09-10', agentIds: ['4', '6'], status: 'planned' },
];
