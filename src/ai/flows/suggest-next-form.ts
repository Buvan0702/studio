'use server';

/**
 * @fileOverview Suggests the next logical form in the case workflow after a form submission.
 *
 * - suggestNextForm - A function that suggests the next form based on submitted forms.
 * - SuggestNextFormInput - The input type for the suggestNextForm function.
 * - SuggestNextFormOutput - The return type for the suggestNextForm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNextFormInputSchema = z.object({
  submittedForms: z.array(
    z.enum(['POR', 'Supurdinama', 'Jabtinama', 'Rajinama'])
  ).describe('An array of forms that have been submitted.'),
});
export type SuggestNextFormInput = z.infer<typeof SuggestNextFormInputSchema>;

const SuggestNextFormOutputSchema = z.object({
  nextForm: z.string().nullable().describe('The next form to be submitted.'),
});
export type SuggestNextFormOutput = z.infer<typeof SuggestNextFormOutputSchema>;

export async function suggestNextForm(input: SuggestNextFormInput): Promise<SuggestNextFormOutput> {
  return suggestNextFormFlow(input);
}

const suggestNextFormFlow = ai.defineFlow(
  {
    name: 'suggestNextFormFlow',
    inputSchema: SuggestNextFormInputSchema,
    outputSchema: SuggestNextFormOutputSchema,
  },
  async input => {
    const {submittedForms} = input;

    let nextForm: string | null = null;

    if (!submittedForms.includes('POR')) {
      nextForm = 'POR';
    } else if (!submittedForms.includes('Supurdinama')) {
      nextForm = 'Supurdinama';
    } else if (!submittedForms.includes('Jabtinama')) {
      nextForm = 'Jabtinama';
    } else {
      nextForm = 'Rajinama'; // Rajinama can always be submitted
    }

    // If all forms except Rajinama are submitted, don't suggest any specific form.
    if (submittedForms.includes('POR') &&
        submittedForms.includes('Supurdinama') &&
        submittedForms.includes('Jabtinama') &&
        !submittedForms.includes('Rajinama')) {
          nextForm = 'Rajinama';
    } else if (submittedForms.includes('POR') &&
              submittedForms.includes('Supurdinama') &&
              submittedForms.includes('Jabtinama') &&
              submittedForms.includes('Rajinama')) {
        nextForm = null;
    }

    return {nextForm};
  }
);
