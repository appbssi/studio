"use client";

import { useMemo } from 'react';
import { useData } from '@/contexts/data-context';
import { Mission } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Printer, FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';

interface MissionAgentsDialogProps {
  mission: Mission;
}

export function MissionAgentsDialog({ mission }: MissionAgentsDialogProps) {
  const { agents } = useData();

  const participatingAgents = useMemo(() => {
    return agents
      .filter(agent => mission.agentIds.includes(agent.id))
      .sort((a, b) => {
        const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
        const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
  }, [agents, mission.agentIds]);

  const printAgentsList = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Agents pour la mission: ${mission.title}</title>
            <style>
              body { font-family: 'Inter', sans-serif; margin: 20px; background-color: #1a1a1a; color: #f0f0f0; }
              h1, h2 { color: #30CED8; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #444; padding: 12px; text-align: left; }
              th { background-color: #282C34; }
              tr:nth-child(even) { background-color: #21252b; }
            </style>
          </head>
          <body>
            <h1>Mission: ${mission.title}</h1>
            <h2>Liste des Agents Participants</h2>
            <p>Date du rapport: ${new Date().toLocaleDateString('fr-FR')}</p>
            <table>
              <thead>
                <tr>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Matricule</th>
                  <th>Grade</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                ${participatingAgents.map(agent => `
                  <tr>
                    <td>${agent.firstName}</td>
                    <td>${agent.lastName}</td>
                    <td>${agent.matricule}</td>
                    <td>${agent.grade}</td>
                    <td>${agent.contact}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const exportToXlsx = () => {
    const dataToExport = participatingAgents.map(agent => ({
      'Prénom': agent.firstName,
      'Nom': agent.lastName,
      'Matricule': agent.matricule,
      'Grade': agent.grade,
      'Contact': agent.contact,
      'Adresse': agent.address
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Agents');
    
    const fileName = `agents_mission_${mission.title.replace(/\s+/g, '_')}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          Voir Agents
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agents pour la mission "{mission.title}"</DialogTitle>
          <DialogDescription>
            Voici la liste des agents assignés à cette mission.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            {participatingAgents.length > 0 ? (
                participatingAgents.map(agent => (
                    <div key={agent.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                        <Avatar>
                            <AvatarImage src={agent.photoUrl} alt={`${agent.firstName} ${agent.lastName}`} />
                            <AvatarFallback>{agent.firstName[0]}{agent.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{agent.firstName} {agent.lastName}</p>
                            <p className="text-sm text-muted-foreground">{agent.grade} - {agent.matricule}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-muted-foreground text-center">Aucun agent n'est assigné à cette mission.</p>
            )}
        </div>
        <div className="flex justify-end gap-2">
            <Button onClick={printAgentsList} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
            </Button>
            <Button onClick={exportToXlsx}>
                <FileDown className="mr-2 h-4 w-4" />
                Exporter en XLSX
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
