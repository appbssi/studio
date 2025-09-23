"use client";

import { useState, useMemo } from 'react';
import { useData } from '@/contexts/data-context';
import { Input } from '@/components/ui/input';
import { AddMissionDialog } from '@/components/missions/add-mission-dialog';
import { ExtendMissionDialog } from '@/components/missions/extend-mission-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"
import { MissionAgentsDialog } from '@/components/missions/mission-agents-dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function MissionsPage() {
  const { missions, agents, completeMission: completeMissionAction, isLoaded } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredMissions = useMemo(() => {
    let filtered = [...missions];

    if (searchTerm) {
      filtered = filtered.filter(mission =>
        mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [missions, searchTerm]);
  
  const handleCompleteMission = (missionId: string) => {
    completeMissionAction(missionId);
    toast({
      title: "Mission terminée",
      description: "Le statut de la mission et des agents a été mis à jour.",
    });
  };

  const getStatusBadge = (status: 'planned' | 'in-progress' | 'completed') => {
    switch(status) {
        case 'planned': return <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">Planifiée</Badge>;
        case 'in-progress': return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">En cours</Badge>;
        case 'completed': return <Badge className="bg-green-600/20 text-green-400 border-green-600/30">Terminée</Badge>;
    }
  }

  const renderTableBody = () => {
    if (!isLoaded) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center h-24">
            <LoadingSpinner text="Chargement des missions..." />
          </TableCell>
        </TableRow>
      );
    }
    if (filteredMissions.length > 0) {
      return filteredMissions.map(mission => (
        <TableRow key={mission.id}>
          <TableCell>
            <p className="font-medium">{mission.title}</p>
            <p className="text-sm text-muted-foreground truncate max-w-xs">{mission.description}</p>
          </TableCell>
          <TableCell>{getStatusBadge(mission.status)}</TableCell>
          <TableCell>
            {new Date(mission.startDate).toLocaleDateString('fr-FR')} - {new Date(mission.endDate).toLocaleDateString('fr-FR')}
          </TableCell>
          <TableCell className="text-right space-x-2">
            <MissionAgentsDialog mission={mission} />
            {mission.status !== 'completed' && (
              <>
                <ExtendMissionDialog mission={mission} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">Terminer</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                      <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la fin de la mission ?</AlertDialogTitle>
                          <AlertDialogDescription>
                              Cette action marquera la mission "{mission.title}" comme terminée.
                              Le statut des agents assignés sera mis à jour à "Disponible". Cette action est irréversible.
                          </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleCompleteMission(mission.id)}>Confirmer</AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </TableCell>
        </TableRow>
      ));
    } else {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center h-24">
            Aucune mission trouvée.
          </TableCell>
        </TableRow>
      );
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">MISSIONS</h1>
        <AddMissionDialog />
      </div>

      <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
        <div className="flex items-center justify-between mb-4 gap-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Rechercher une mission..."
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
                <TableHead>Titre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Période</TableHead>
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
