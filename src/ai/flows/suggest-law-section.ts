'use server';

/**
 * @fileOverview Suggests a relevant law section based on an offense description.
 *
 * - suggestLawSection - A function that suggests a law section.
 * - SuggestLawSectionInput - The input type for the suggestLawSection function.
 * - SuggestLawSectionOutput - The return type for the suggestLawSection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SuggestLawSectionInputSchema = z.object({
  offenseDescription: z.string().describe('The description of the offense.'),
});
export type SuggestLawSectionInput = z.infer<typeof SuggestLawSectionInputSchema>;

export const SuggestLawSectionOutputSchema = z.object({
  section: z.string().describe('The suggested relevant law section.'),
});
export type SuggestLawSectionOutput = z.infer<typeof SuggestLawSectionOutputSchema>;

export async function suggestLawSection(input: SuggestLawSectionInput): Promise<SuggestLawSectionOutput> {
  return suggestLawSectionFlow(input);
}

const prompt = ai.definePrompt({
    name: 'suggestLawSectionPrompt',
    input: { schema: SuggestLawSectionInputSchema },
    output: { schema: SuggestLawSectionOutputSchema },
    prompt: `You are an expert in Indian law. Based on the following offense description, suggest the single most relevant section of the Indian Penal Code or other applicable Indian law. Provide only the section number and a brief title (e.g., "Section 302 of IPC - Punishment for Murder").

Offense Description:
{{{offenseDescription}}}
`,
});


const suggestLawSectionFlow = ai.defineFlow(
  {
    name: 'suggestLawSectionFlow',
    inputSchema: SuggestLawSectionInputSchema,
    outputSchema: SuggestLawSectionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
