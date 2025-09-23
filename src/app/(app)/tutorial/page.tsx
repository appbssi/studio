"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getAppTutorial } from '@/ai/flows/app-tutorial';
import { Sparkles, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function TutorialPage() {
  const [tutorial, setTutorial] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateTutorial = async () => {
    setIsLoading(true);
    setError('');
    setTutorial('');
    try {
      const result = await getAppTutorial();
      setTutorial(result.tutorial);
    } catch (e) {
      setError('Impossible de générer le tutoriel. Veuillez réessayer.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3"><BookOpen className="h-8 w-8" />Tutoriel de l'Application</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Guide d'Utilisation Généré par IA</CardTitle>
          <CardDescription>
            Cliquez sur le bouton ci-dessous pour que l'IA génère un guide étape par étape sur comment utiliser l'application MissionControl.
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          {isLoading && (
              <div className="flex items-center justify-center space-x-2 py-8">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-accent"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:0.2s]"></div>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-accent [animation-delay:0.4s]"></div>
                  <span className="text-sm text-muted-foreground">L'IA rédige le tutoriel...</span>
              </div>
          )}
          {error && <p className="text-destructive text-sm">{error}</p>}
          {tutorial && <ReactMarkdown>{tutorial}</ReactMarkdown>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateTutorial} disabled={isLoading} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? 'Génération en cours...' : 'Générer le Tutoriel'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
