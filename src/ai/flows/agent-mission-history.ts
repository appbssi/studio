'use server';

/**
 * @fileOverview Generates a summary of an agent's completed mission history.
 *
 * - getAgentMissionHistory - A function that retrieves and summarizes the mission history for an agent.
 * - AgentMissionHistoryInput - The input type for the getAgentMissionHistory function.
 * - AgentMissionHistoryOutput - The return type for the getAgentMissionHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AgentMissionHistoryInputSchema = z.object({
  agentId: z.string().describe('The ID of the agent to retrieve mission history for.'),
});
export type AgentMissionHistoryInput = z.infer<typeof AgentMissionHistoryInputSchema>;

const AgentMissionHistoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the agent mission history.'),
});
export type AgentMissionHistoryOutput = z.infer<typeof AgentMissionHistoryOutputSchema>;

export async function getAgentMissionHistory(input: AgentMissionHistoryInput): Promise<AgentMissionHistoryOutput> {
  return agentMissionHistoryFlow(input);
}

const agentMissionHistoryPrompt = ai.definePrompt({
  name: 'agentMissionHistoryPrompt',
  input: {schema: AgentMissionHistoryInputSchema},
  output: {schema: AgentMissionHistoryOutputSchema},
  prompt: `You are an AI assistant that summarizes the mission history of agents.

  Given the agent's ID, summarize their completed missions, highlighting key accomplishments and areas of expertise.

  Agent ID: {{{agentId}}}`,
});

const agentMissionHistoryFlow = ai.defineFlow(
  {
    name: 'agentMissionHistoryFlow',
    inputSchema: AgentMissionHistoryInputSchema,
    outputSchema: AgentMissionHistoryOutputSchema,
  },
  async input => {
    const {output} = await agentMissionHistoryPrompt(input);
    return output!;
  }
);
