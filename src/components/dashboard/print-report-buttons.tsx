"use client";

import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/data-context";
import { Printer } from "lucide-react";
import { Agent } from "@/lib/types";

export function PrintReportButtons() {
    const { agents, getAgentStatus } = useData();
    
    const sortAgents = (agentList: Agent[]) => {
      return [...agentList].sort((a, b) => {
        const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
        const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    };

    const printAgentsReport = (status: 'available') => {
        const filteredAgents = agents.filter(agent => getAgentStatus(agent.id) === status);
        const sortedAgents = sortAgents(filteredAgents);
        const printWindow = window.open('', '_blank');
        
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Rapport des Agents Disponibles</title>
                <style>
                  body { font-family: 'Inter', sans-serif; margin: 20px; background-color: #1a1a1a; color: #f0f0f0; text-align: center; }
                  h1 { color: #30CED8; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #444; padding: 12px; text-align: center; }
                  th { background-color: #282C34; }
                  tr:nth-child(even) { background-color: #21252b; }
                </style>
              </head>
              <body>
                <h1>État des Agents Disponibles</h1>
                <p>Date du rapport: ${new Date().toLocaleDateString('fr-FR')}</p>
                <table>
                  <thead>
                    <tr>
                      <th>Matricule</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sortedAgents.map((agent) => `
                      <tr>
                        <td>${agent.matricule}</td>
                        <td>${agent.lastName}</td>
                        <td>${agent.firstName}</td>
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

    const printAllAgentsReport = () => {
        const sortedAgents = sortAgents(agents);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Rapport de Tous les Agents</title>
                <style>
                  body { font-family: 'Inter', sans-serif; margin: 20px; background-color: #1a1a1a; color: #f0f0f0; text-align: center; }
                  h1 { color: #30CED8; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                  th, td { border: 1px solid #444; padding: 12px; text-align: center; }
                  th { background-color: #282C34; }
                  tr:nth-child(even) { background-color: #21252b; }
                </style>
              </head>
              <body>
                <h1>Rapport de Tous les Agents</h1>
                <p>Date du rapport: ${new Date().toLocaleDateString('fr-FR')}</p>
                <table>
                  <thead>
                    <tr>
                      <th>Matricule</th>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Contact</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sortedAgents.map((agent) => `
                      <tr>
                        <td>${agent.matricule}</td>
                        <td>${agent.lastName}</td>
                        <td>${agent.firstName}</td>
                        <td>${agent.contact}</td>
                        <td>${getAgentStatus(agent.id) === 'available' ? 'Disponible' : 'Occupé'}</td>
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
            <Button onClick={() => printAgentsReport('available')} variant="super">
                <Printer className="mr-2 h-4 w-4" />
                AGENTS DISPONIBLE
            </Button>
            <Button onClick={printAllAgentsReport} variant="super">
                <Printer className="mr-2 h-4 w-4" />
                AGENTS ENREGISTRES
            </Button>
        </div>
    )
}
