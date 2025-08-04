'use server';

/**
 * @fileOverview Suggests a relevant law section based on an offense description.
 *
 * - suggestLawSection - A function that suggests a law section.
 */

import {ai} from '@/ai/genkit';
import {
  SuggestLawSectionInput,
  SuggestLawSectionInputSchema,
  SuggestLawSectionOutput,
  SuggestLawSectionOutputSchema,
} from '@/lib/types';

export async function suggestLawSection(input: SuggestLawSectionInput): Promise<SuggestLawSectionOutput> {
  return suggestLawSectionFlow(input);
}

const prompt = ai.definePrompt({
    name: 'suggestLawSectionPrompt',
    input: { schema: SuggestLawSectionInputSchema },
    output: { schema: SuggestLawSectionOutputSchema },
    prompt: `You are an expert in Indian law. Your task is to suggest the single most relevant section of the Indian Penal Code or other applicable Indian law based on the provided offense description.

- If the description is detailed enough to suggest a specific law section, provide only the section number and a brief title (e.g., "Section 302 of IPC - Punishment for Murder").
- If the description is too short, vague, or does not describe a recognizable offense, respond with the exact phrase: "No suggestion available. Please provide a more detailed description."

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
