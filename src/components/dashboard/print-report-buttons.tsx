"use client";

import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/data-context";
import { Printer } from "lucide-react";

export function PrintReportButtons() {
    const { agents, missions } = useData();

    const printAgentsReport = (status: 'available' | 'occupied') => {
        const filteredAgents = agents.filter(agent => agent.status === status);
        const printWindow = window.open('', '_blank');
        
        if (printWindow) {
          const missionTitles = filteredAgents.map(agent => {
            if (status === 'occupied' && agent.currentMissionId) {
              const mission = missions.find(m => m.id === agent.currentMissionId);
              return mission ? mission.title : 'N/A';
            }
            return '';
          });
    
          printWindow.document.write(`
            <html>
              <head>
                <title>Rapport des Agents ${status === 'available' ? 'Disponibles' : 'Occupés'}</title>
                <style>
                  body { font-family: 'Inter', sans-serif; margin: 20px; background-color: #1a1a1a; color: #f0f0f0; }
                  h1 { color: #30CED8; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #444; padding: 12px; text-align: left; }
                  th { background-color: #282C34; }
                  tr:nth-child(even) { background-color: #21252b; }
                </style>
              </head>
              <body>
                <h1>État des Agents ${status === 'available' ? 'Disponibles' : 'Occupés'}</h1>
                <p>Date du rapport: ${new Date().toLocaleDateString('fr-FR')}</p>
                <table>
                  <thead>
                    <tr>
                      <th>Matricule</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Contact</th>
                      ${status === 'occupied' ? '<th>Mission en cours</th>' : ''}
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredAgents.map((agent, index) => `
                      <tr>
                        <td>${agent.matricule}</td>
                        <td>${agent.lastName}</td>
                        <td>${agent.firstName}</td>
                        <td>${agent.contact}</td>
                        ${status === 'occupied' ? `<td>${missionTitles[index]}</td>` : ''}
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

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => printAgentsReport('available')}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimer Agents Disponibles
            </Button>
            <Button variant="secondary" onClick={() => printAgentsReport('occupied')}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimer Agents Occupés
            </Button>
        </div>
    )
}
