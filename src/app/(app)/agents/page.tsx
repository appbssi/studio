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
import { Search, Trash2, Filter } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AgentsPage() {
  const { agents, deleteAgent, getAgentStatus, isLoaded } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');

  const uniqueGrades = useMemo(() => {
    const grades = new Set(agents.map(agent => agent.grade));
    return ['all', ...Array.from(grades)];
  }, [agents]);

  const filteredAgents = useMemo(() => {
    let availableAgents = agents.filter(agent => getAgentStatus(agent.id) === 'available');

    if (selectedGrade !== 'all') {
      availableAgents = availableAgents.filter(agent => agent.grade === selectedGrade);
    }
    
    if (!searchTerm) return availableAgents;

    return availableAgents.filter(agent =>
      agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agents, getAgentStatus, searchTerm, selectedGrade]);

  const handleDeleteAgent = (agentId: string, agentName: string) => {
    deleteAgent(agentId);
    toast({
      title: "Agent Supprimé",
      description: `L'agent ${agentName} a été supprimé.`,
    });
  }

  const renderTableBody = () => {
    if (!isLoaded) {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center h-24">
            Chargement des agents...
          </TableCell>
        </TableRow>
      );
    }
    if (filteredAgents.length > 0) {
      return filteredAgents.map(agent => (
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
          <TableCell>{agent.grade}</TableCell>
          <TableCell>{agent.matricule}</TableCell>
          <TableCell>{agent.contact}</TableCell>
          <TableCell>{agent.address}</TableCell>
          <TableCell>
            <Badge variant='default' className='bg-green-600/20 text-green-400 border-green-600/30'>
              Disponible
            </Badge>
          </TableCell>
          <TableCell className="text-right">
             <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                    <Trash2 className="h-4 w-4" />
                 </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression ?</AlertDialogTitle>
                      <AlertDialogDescription>
                          Cette action supprimera définitivement l'agent "{agent.firstName} {agent.lastName}".
                          Cette action est irréversible.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteAgent(agent.id, `${agent.firstName} ${agent.lastName}`)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableCell>
        </TableRow>
        )
      );
    } else {
      return (
        <TableRow>
          <TableCell colSpan={7} className="text-center h-24">
            Aucun agent disponible trouvé.
          </TableCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">LISTE AGENTS</h1>
        <AddAgentDialog />
      </div>

      <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
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
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
             <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trier par grade" />
              </SelectTrigger>
              <SelectContent>
                {uniqueGrades.map(grade => (
                  <SelectItem key={grade} value={grade}>
                    {grade === 'all' ? 'Tous les grades' : grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Matricule</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderTableBody()}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
