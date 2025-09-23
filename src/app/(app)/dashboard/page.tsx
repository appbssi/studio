"use client";

import { useData } from '@/contexts/data-context';
import { StatCard } from '@/components/dashboard/stat-card';
import { PrintReportButtons } from '@/components/dashboard/print-report-buttons';
import { Users, UserCheck, UserX, Briefcase, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const { agents, missions, getAgentStatus } = useData();

  const totalAgents = agents.length;
  const availableAgents = agents.filter(agent => getAgentStatus(agent.id) === 'available').length;
  const occupiedAgents = totalAgents - availableAgents;
  const activeMissions = missions.filter(mission => mission.status === 'in-progress' || mission.status === 'planned').length;
  const completedMissions = missions.filter(mission => mission.status === 'completed').length;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">BASE DE DONNEE BSSI</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Agents (Total)" value={totalAgents} icon={Users} color="text-primary" />
        <StatCard title="Agents Disponibles" value={availableAgents} icon={UserCheck} color="text-green-400" />
        <StatCard title="Agents Occupés" value={occupiedAgents} icon={UserX} color="text-yellow-400" />
        <StatCard title="Missions Actives" value={activeMissions} icon={Briefcase} color="text-blue-400" />
        {/* <StatCard title="Missions Terminées" value={completedMissions} icon={CheckCircle} color="text-purple-400" /> */}
      </div>

      <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
         <h2 className="text-xl font-semibold mb-4">Rapports</h2>
         <p className="text-muted-foreground mb-4">
            Générez des rapports sur l'état actuel de vos agents.
         </p>
         <PrintReportButtons />
      </div>
    </div>
  );
}
