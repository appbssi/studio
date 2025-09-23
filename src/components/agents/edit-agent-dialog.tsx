"use client";

import { useState, useEffect } from 'react';
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
import { useData } from '@/contexts/data-context';
import { useToast } from '@/hooks/use-toast';
import { Edit } from 'lucide-react';
import { Agent } from '@/lib/types';

interface EditAgentDialogProps {
  agent: Agent;
}

export function EditAgentDialog({ agent }: EditAgentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { updateAgent, agents } = useData();
  const { toast } = useToast();
  const [editedAgent, setEditedAgent] = useState<Agent>(agent);

  useEffect(() => {
    setEditedAgent(agent);
  }, [agent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedAgent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!editedAgent.firstName || !editedAgent.lastName || !editedAgent.matricule || !editedAgent.grade) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires (Prénom, Nom, Grade, Matricule).",
      });
      return;
    }
    
    // Check if matricule is used by another agent
    if (agents.some(a => a.matricule === editedAgent.matricule && a.id !== editedAgent.id)) {
      toast({
        variant: "destructive",
        title: "Erreur de Matricule",
        description: "Ce matricule est déjà utilisé par un autre agent. Veuillez en choisir un autre.",
      });
      return;
    }

    updateAgent(editedAgent.id, editedAgent);
    toast({
      title: "Succès",
      description: `L'agent ${editedAgent.firstName} ${editedAgent.lastName} a été mis à jour.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit /> Modifier l'Agent
          </DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de l'agent.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              Prénom *
            </Label>
            <Input id="firstName" name="firstName" value={editedAgent.firstName} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Nom *
            </Label>
            <Input id="lastName" name="lastName" value={editedAgent.lastName} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="grade" className="text-right">
              Grade *
            </Label>
            <Input id="grade" name="grade" value={editedAgent.grade} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="matricule" className="text-right">
              Matricule *
            </Label>
            <Input id="matricule" name="matricule" value={editedAgent.matricule} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              Contact
            </Label>
            <Input id="contact" name="contact" value={editedAgent.contact} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Adresse
            </Label>
            <Input id="address" name="address" value={editedAgent.address} onChange={handleInputChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Annuler</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit} variant="super">Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
