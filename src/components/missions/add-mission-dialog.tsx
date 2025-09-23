"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useData } from '@/contexts/data-context';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Briefcase, PlusCircle } from 'lucide-react';
import { Agent } from '@/lib/types';

export function AddMissionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { addMission, agents, getAgentStatus } = useData();
  const { toast } = useToast();
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    agentIds: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMission(prev => ({ ...prev, [name]: value }));
  };

  const handleAgentSelectionChange = (agentId: string) => {
    setNewMission(prev => {
      const agentIds = prev.agentIds.includes(agentId)
        ? prev.agentIds.filter(id => id !== agentId)
        : [...prev.agentIds, agentId];
      return { ...prev, agentIds };
    });
  };

  const handleSubmit = () => {
    if (!newMission.title || !newMission.startDate || !newMission.endDate || newMission.agentIds.length === 0) {
        toast({
            variant: "destructive",
            title: "Erreur de validation",
            description: "Veuillez remplir tous les champs obligatoires et sélectionner au moins un agent.",
        });
        return;
    }
    if (new Date(newMission.startDate) > new Date(newMission.endDate)) {
        toast({
            variant: "destructive",
            title: "Erreur de date",
            description: "La date de début ne peut pas être après la date de fin.",
        });
        return;
    }
    addMission(newMission);
    toast({
      title: "Succès",
      description: `La mission "${newMission.title}" a été créée.`,
    });
    setNewMission({ title: '', description: '', startDate: '', endDate: '', agentIds: [] });
    setIsOpen(false);
  };
  
  const sortedAgents = useMemo(() => {
    return [...agents].sort((a, b) => {
      const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
      const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [agents]);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="super">
          <PlusCircle className="mr-2 h-4 w-4" />
          Créer une Mission
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase /> Assigner une Nouvelle Mission
          </DialogTitle>
          <DialogDescription>
            Définissez les détails et assignez des agents à la nouvelle mission.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Titre de la Mission *</Label>
              <Input id="title" name="title" value={newMission.title} onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={newMission.description} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Date de Début *</Label>
                <Input type="date" id="startDate" name="startDate" value={newMission.startDate} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="endDate">Date de Fin *</Label>
                <Input type="date" id="endDate" name="endDate" value={newMission.endDate} onChange={handleInputChange} />
              </div>
            </div>
            <div>
              <Label>Agents à Assigner *</Label>
              <ScrollArea className="h-40 w-full rounded-md border p-4 mt-2">
                {sortedAgents.map((agent: Agent) => {
                  const status = getAgentStatus(agent.id);
                  const isSelected = newMission.agentIds.includes(agent.id);
                  const isDisabled = status === 'occupied' && !isSelected;

                  return (
                    <div key={agent.id} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`agent-${agent.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleAgentSelectionChange(agent.id)}
                        disabled={isDisabled}
                      />
                      <label htmlFor={`agent-${agent.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {agent.firstName} {agent.lastName} ({agent.matricule})
                        {isDisabled && ' (Occupé)'}
                      </label>
                    </div>
                  )
                })}
                {agents.length === 0 && <p className='text-sm text-muted-foreground text-center py-4'>Aucun agent trouvé.</p>}
              </ScrollArea>
            </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Annuler</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit} variant="super">Créer la Mission</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
