'use server';

/**
 * @fileOverview Provides AI-driven health advice based on user input and pre-vetted guidelines.
 *
 * - aiHealthAdvisor - A function that provides health advice.
 * - AIHealthAdvisorInput - The input type for the aiHealthAdvisor function.
 * - AIHealthAdvisorOutput - The return type for the aiHealthAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {gemini15Flash} from '@genkit-ai/googleai';

const AIHealthAdvisorInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A description of the symptoms the user is experiencing.'),
  medicalHistory: z
    .string()
    .optional()
    .describe('Optional: The users medical history.'),
  age: z.number().describe('The age of the user.'),
});
export type AIHealthAdvisorInput = z.infer<typeof AIHealthAdvisorInputSchema>;

const AIHealthAdvisorOutputSchema = z.object({
  advice: z.string().describe('AI-driven health advice based on user input.'),
  suggestions: z.string().describe('Suggestions for next steps.'),
  disclaimer: z
    .string()
    .describe(
      'A disclaimer that this advice is not a substitute for professional medical advice.'
    ),
});
export type AIHealthAdvisorOutput = z.infer<typeof AIHealthAdvisorOutputSchema>;

export async function aiHealthAdvisor(
  input: AIHealthAdvisorInput
): Promise<AIHealthAdvisorOutput> {
  return aiHealthAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiHealthAdvisorPrompt',
  input: {schema: AIHealthAdvisorInputSchema},
  output: {schema: AIHealthAdvisorOutputSchema},
  model: gemini15Flash,
  prompt: `You are an AI health advisor. A user will provide you with their symptoms, age, and medical history (if available). Provide them with immediate advice and suggestions based on pre-vetted guidelines.

  Symptoms: {{{symptoms}}}
  Medical History: {{{medicalHistory}}}
  Age: {{{age}}}

  Provide the advice and suggestions in a clear and concise manner. Always include a disclaimer that this advice is not a substitute for professional medical advice.
  `,
});

const aiHealthAdvisorFlow = ai.defineFlow(
  {
    name: 'aiHealthAdvisorFlow',
    inputSchema: AIHealthAdvisorInputSchema,
    outputSchema: AIHealthAdvisorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
