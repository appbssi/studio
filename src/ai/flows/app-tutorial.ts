'use server';

/**
 * @fileOverview Generates a tutorial for using the application.
 *
 * - getAppTutorial - A function that generates a tutorial for the application.
 * - AppTutorialOutput - The return type for the getAppTutorial function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AppTutorialOutputSchema = z.object({
  tutorial: z.string().describe('The application tutorial in Markdown format.'),
});
export type AppTutorialOutput = z.infer<typeof AppTutorialOutputSchema>;

export async function getAppTutorial(): Promise<AppTutorialOutput> {
  return appTutorialFlow();
}

const appTutorialPrompt = ai.definePrompt({
  name: 'appTutorialPrompt',
  output: {schema: AppTutorialOutputSchema},
  prompt: `Vous êtes un assistant IA chargé de rédiger des guides utilisateurs clairs et concis.

Générez un tutoriel pour une application de gestion de missions pour agents appelée "MissionControl".

L'application a les fonctionnalités suivantes :
- **Tableau de bord** : Affiche des statistiques clés comme le nombre total d'agents, les agents disponibles, les agents occupés et les missions actives. Permet d'imprimer des rapports.
- **Gestion des Agents** : Permet d'ajouter de nouveaux agents (avec prénom, nom, grade, matricule, contact, adresse), de voir la liste des agents disponibles, de les filtrer par grade et de les supprimer. Le statut (disponible/occupé) est géré automatiquement.
- **Gestion des Missions** : Permet de créer de nouvelles missions (avec titre, description, dates de début/fin) et d'y assigner des agents disponibles. On peut voir la liste des missions (planifiées, en cours, terminées) et marquer une mission comme "terminée".
- **Historique** : Affiche l'historique de toutes les missions terminées. On peut filtrer par agent pour voir son historique personnel. Il y a une fonctionnalité IA pour générer un résumé de la carrière d'un agent.

Le tutoriel doit être structuré, facile à suivre pour un nouvel utilisateur, et utiliser le format Markdown. Incluez des titres et des listes à puces pour la clarté.
`,
});

const appTutorialFlow = ai.defineFlow(
  {
    name: 'appTutorialFlow',
    outputSchema: AppTutorialOutputSchema,
  },
  async () => {
    const {output} = await appTutorialPrompt();
    return output!;
  }
);
