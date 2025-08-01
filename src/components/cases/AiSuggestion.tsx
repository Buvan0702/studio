"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, Loader2 } from "lucide-react";
import { suggestNextForm } from "@/ai/flows/suggest-next-form";
import type { FormType } from "@/lib/types";

interface AiSuggestionProps {
  submittedForms: FormType[];
}

export default function AiSuggestion({ submittedForms }: AiSuggestionProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSuggestion = async () => {
      try {
        setLoading(true);
        const result = await suggestNextForm({ submittedForms });
        setSuggestion(result.nextForm);
      } catch (error) {
        console.error("AI suggestion error:", error);
        setSuggestion("Error fetching suggestion.");
      } finally {
        setLoading(false);
      }
    };
    getSuggestion();
  }, [submittedForms]);

  return (
    <Alert className="bg-primary/5 border-primary/20">
      <Lightbulb className="h-5 w-5 text-primary" />
      <AlertTitle className="text-primary font-semibold">AI Assistant</AlertTitle>
      <AlertDescription className="text-primary/90">
        {loading ? (
          <span className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing case workflow...
          </span>
        ) : suggestion ? (
          `Based on the current progress, the recommended next step is to file the ${suggestion} form.`
        ) : (
          "All mandatory forms have been submitted. You can file another Rajinama if needed."
        )}
      </AlertDescription>
    </Alert>
  );
}
