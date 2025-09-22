"use client";

import { useState } from 'react';
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
import { PlusCircle, UserPlus } from 'lucide-react';

export function AddAgentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { addAgent } = useData();
  const { toast } = useToast();
  const [newAgent, setNewAgent] = useState({
    firstName: '',
    lastName: '',
    matricule: '',
    contact: '',
    address: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAgent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!newAgent.firstName || !newAgent.lastName || !newAgent.matricule) {
      toast({
        variant: "destructive",
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires (Prénom, Nom, Matricule).",
      });
      return;
    }
    addAgent(newAgent);
    toast({
      title: "Succès",
      description: `L'agent ${newAgent.firstName} ${newAgent.lastName} a été ajouté.`,
    });
    setNewAgent({ firstName: '', lastName: '', matricule: '', contact: '', address: '' });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus /> Enregistrer un Nouvel Agent
          </DialogTitle>
          <DialogDescription>
            Remplissez les détails ci-dessous pour ajouter un nouvel agent au système.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              Prénom *
            </Label>
            <Input id="firstName" name="firstName" value={newAgent.firstName} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Nom *
            </Label>
            <Input id="lastName" name="lastName" value={newAgent.lastName} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="matricule" className="text-right">
              Matricule *
            </Label>
            <Input id="matricule" name="matricule" value={newAgent.matricule} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              Contact
            </Label>
            <Input id="contact" name="contact" value={newAgent.contact} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Adresse
            </Label>
            <Input id="address" name="address" value={newAgent.address} onChange={handleInputChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Annuler</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>Enregistrer l'Agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
