"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getAgentMissionHistory } from '@/ai/flows/agent-mission-history';
import { Agent } from '@/lib/types';
import { Sparkles } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface AgentHistorySummaryProps {
  agent: Agent;
}

export function AgentHistorySummary({ agent }: AgentHistorySummaryProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');
    try {
      const result = await getAgentMissionHistory({ agentId: agent.id });
      setSummary(result.summary);
    } catch (e) {
      setError('Impossible de générer le résumé. Veuillez réessayer.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé IA de l'Agent</CardTitle>
        <CardDescription>
          Générez un résumé des accomplissements et de l'expertise de {agent.firstName} {agent.lastName} basés sur son historique de missions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="flex items-center justify-center">
                <LoadingSpinner text="Génération du résumé..." />
            </div>
        )}
        {error && <p className="text-destructive text-sm">{error}</p>}
        {summary && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateSummary} disabled={isLoading} className="w-full" variant="super">
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? 'Génération...' : 'Générer le Résumé'}
        </Button>
      </CardFooter>
    </Card>
  );
}
