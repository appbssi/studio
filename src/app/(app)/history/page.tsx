"use client";

import { useState, useMemo } from 'react';
import { useData } from '@/contexts/data-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AgentHistorySummary } from '@/components/history/agent-history-summary';

type SortByType = 'date' | 'title';

export default function HistoryPage() {
  const { agents, missions } = useData();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortByType>('date');
  
  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  const completedMissions = useMemo(() => {
    let filtered = missions.filter(mission => mission.status === 'completed');

    if (selectedAgentId) {
      filtered = filtered.filter(mission => mission.agentIds.includes(selectedAgentId));
    }
    
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      return a.title.localeCompare(b.title);
    });
  }, [missions, selectedAgentId, sortBy]);

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end.getTime() - start.getTime();
    return Math.ceil(durationMs / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Historique des Missions</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Filtres et Options</CardTitle>
                    <CardDescription>
                        Affinez la vue de l'historique des missions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label className="mb-2 block">Sélectionner un Agent</Label>
                        <Select onValueChange={(value) => setSelectedAgentId(value === 'all' ? null : value)} value={selectedAgentId || 'all'}>
                            <SelectTrigger>
                            <SelectValue placeholder="-- Voir pour tous les agents --" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="all">Tous les agents</SelectItem>
                            {agents.map(agent => (
                                <SelectItem key={agent.id} value={agent.id}>
                                {agent.firstName} {agent.lastName} ({agent.matricule})
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label className="mb-2 block">Trier par</Label>
                        <RadioGroup defaultValue="date" value={sortBy} onValueChange={(value: SortByType) => setSortBy(value)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="date" id="r1" />
                                <Label htmlFor="r1">Date de mission</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="title" id="r2" />
                                <Label htmlFor="r2">Nom de mission</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>

            {selectedAgent && <AgentHistorySummary agent={selectedAgent} />}
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
                <CardTitle>Missions Terminées</CardTitle>
                <CardDescription>
                    {selectedAgent 
                        ? `Historique des missions terminées pour ${selectedAgent.firstName} ${selectedAgent.lastName}.` 
                        : "Historique de toutes les missions terminées."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Mission</TableHead>
                        <TableHead>Période</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Participants</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {completedMissions.length > 0 ? (
                        completedMissions.map(mission => (
                        <TableRow key={mission.id}>
                            <TableCell>
                                <p className="font-medium">{mission.title}</p>
                                <p className="text-sm text-muted-foreground truncate max-w-xs">{mission.description}</p>
                            </TableCell>
                            <TableCell>{new Date(mission.startDate).toLocaleDateString('fr-FR')}</TableCell>
                            <TableCell>{calculateDuration(mission.startDate, mission.endDate)} jour(s)</TableCell>
                            <TableCell>
                            <div className="flex flex-col">
                                {mission.agentIds.map(agentId => {
                                    const agent = agents.find(a => a.id === agentId);
                                    return agent ? (
                                    <span key={agentId} className="text-sm">{agent.firstName} {agent.lastName}</span>
                                    ) : null;
                                })}
                            </div>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            Aucune mission terminée à afficher.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
