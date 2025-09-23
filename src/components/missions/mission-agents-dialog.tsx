"use client";

import { useData } from '@/contexts/data-context';
import { Mission, Agent } from '@/lib/types';
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

interface MissionAgentsDialogProps {
  mission: Mission;
}

export function MissionAgentsDialog({ mission }: MissionAgentsDialogProps) {
  const { agents } = useData();

  const participatingAgents = agents.filter(agent => mission.agentIds.includes(agent.id));

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

  const exportToCsv = () => {
    const headers = ['Prénom', 'Nom', 'Matricule', 'Grade', 'Contact'];
    const csvRows = [
      headers.join(','),
      ...participatingAgents.map(agent => 
        [
          `"${agent.firstName}"`,
          `"${agent.lastName}"`,
          `"${agent.matricule}"`,
          `"${agent.grade}"`,
          `"${agent.contact}"`
        ].join(',')
      )
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = `agents_mission_${mission.title.replace(/\s+/g, '_')}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <Button onClick={exportToCsv}>
                <FileDown className="mr-2 h-4 w-4" />
                Exporter en CSV
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
