"use client";

import { useState, useMemo } from 'react';
import { useData } from '@/contexts/data-context';
import { Input } from '@/components/ui/input';
import { AddAgentDialog } from '@/components/agents/add-agent-dialog';
import { Agent } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';

export default function AgentsPage() {
  const { agents } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAgents = useMemo(() => {
    if (!searchTerm) return agents;
    return agents.filter(agent =>
      agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agents, searchTerm]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestion des Agents</h1>
        <AddAgentDialog />
      </div>

      <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Matricule</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.length > 0 ? (
                filteredAgents.map(agent => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={agent.photoUrl} alt={`${agent.firstName} ${agent.lastName}`} data-ai-hint="person portrait" />
                          <AvatarFallback>{agent.firstName.charAt(0)}{agent.lastName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{agent.firstName} {agent.lastName}</p>
                          <p className="text-sm text-muted-foreground">ID: {agent.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{agent.matricule}</TableCell>
                    <TableCell>{agent.contact}</TableCell>
                    <TableCell>{agent.address}</TableCell>
                    <TableCell>
                      <Badge variant={agent.status === 'available' ? 'default' : 'secondary'} className={agent.status === 'available' ? 'bg-green-600/20 text-green-400 border-green-600/30' : 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30'}>
                        {agent.status === 'available' ? 'Disponible' : 'Occupé'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    Aucun agent trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
