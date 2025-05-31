// This is an AI-powered symptom analyzer that provides potential causes and suggested specialists based on user-inputted symptoms.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {gemini15Flash} from '@genkit-ai/googleai';

/**
 * @fileOverview An AI Symptom Analyzer agent.
 *
 * - analyzeSymptoms - A function that handles the symptom analysis process.
 * - AnalyzeSymptomsInput - The input type for the analyzeSymptoms function.
 * - AnalyzeSymptomsOutput - The return type for the analyzeSymptoms function.
 */

const AnalyzeSymptomsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms that the user is experiencing.'),
});
export type AnalyzeSymptomsInput = z.infer<typeof AnalyzeSymptomsInputSchema>;

const AnalyzeSymptomsOutputSchema = z.object({
  potentialCauses: z
    .string()
    .describe('The potential causes of the symptoms.'),
  suggestedSpecialists: z
    .string()
    .describe('The specialists that the user should see.'),
});
export type AnalyzeSymptomsOutput = z.infer<typeof AnalyzeSymptomsOutputSchema>;

export async function analyzeSymptoms(
  input: AnalyzeSymptomsInput
): Promise<AnalyzeSymptomsOutput> {
  return analyzeSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSymptomsPrompt',
  input: {schema: AnalyzeSymptomsInputSchema},
  output: {schema: AnalyzeSymptomsOutputSchema},
  model: gemini15Flash,
  prompt: `You are an AI health assistant that provides potential causes and suggested specialists based on the user's symptoms.

  Symptoms: {{{symptoms}}}

  Respond with potential causes and suggested specialists.`,
});

const analyzeSymptomsFlow = ai.defineFlow(
  {
    name: 'analyzeSymptomsFlow',
    inputSchema: AnalyzeSymptomsInputSchema,
    outputSchema: AnalyzeSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
