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
import { CalendarPlus } from 'lucide-react';
import { Mission } from '@/lib/types';

interface ExtendMissionDialogProps {
  mission: Mission;
}

export function ExtendMissionDialog({ mission }: ExtendMissionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { extendMission } = useData();
  const { toast } = useToast();
  const [newEndDate, setNewEndDate] = useState(mission.endDate);

  const handleSubmit = () => {
    if (new Date(newEndDate) < new Date(mission.endDate)) {
        toast({
            variant: "destructive",
            title: "Erreur de date",
            description: "La nouvelle date de fin ne peut pas être antérieure à la date de fin actuelle.",
        });
        return;
    }
    extendMission(mission.id, newEndDate);
    toast({
      title: "Succès",
      description: `La mission "${mission.title}" a été prolongée jusqu'au ${new Date(newEndDate).toLocaleDateString('fr-FR')}.`,
    });
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Prolonger
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus /> Prolonger la Mission
          </DialogTitle>
          <DialogDescription>
            Choisissez une nouvelle date de fin pour la mission "{mission.title}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="currentEndDate">Date de Fin Actuelle</Label>
              <Input id="currentEndDate" type="date" value={mission.endDate} readOnly disabled />
            </div>
            <div>
              <Label htmlFor="newEndDate">Nouvelle Date de Fin *</Label>
              <Input type="date" id="newEndDate" name="newEndDate" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} />
            </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
