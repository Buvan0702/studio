"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Case, FormType } from "@/lib/types";
import { AlertTriangle, FileCheck2, FileClock, Lock, FilePlus2 } from "lucide-react";
import AiSuggestion from "@/components/cases/AiSuggestion";
import FormCard from "@/components/cases/FormCard";
import { Skeleton } from "@/components/ui/skeleton";

const ALL_FORMS: FormType[] = ["POR", "Supurdinama", "Jabtinama", "Rajinama"];

export default function CasePage() {
  const params = useParams();
  const caseId = params.caseId as string;
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (caseId) {
      const fetchCaseData = async () => {
        setLoading(true);
        try {
          const caseRef = doc(db, "cases", caseId);
          const docSnap = await getDoc(caseRef);

          if (docSnap.exists()) {
            setCaseData({ id: docSnap.id, ...docSnap.data() } as Case);
          } else {
            setError("Case not found.");
          }
        } catch (err) {
          setError("Failed to fetch case data.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCaseData();
    }
  }, [caseId]);

  const getFormStatus = (formType: FormType, submittedForms: FormType[]) => {
    if (submittedForms.includes(formType)) {
      return { status: "Completed", icon: FileCheck2, color: "text-green-600", available: true };
    }
    
    switch (formType) {
      case "POR":
      case "Rajinama":
        return { status: "Available", icon: FilePlus2, color: "text-accent", available: true };
      case "Supurdinama":
        return submittedForms.includes("POR")
          ? { status: "Available", icon: FilePlus2, color: "text-accent", available: true }
          : { status: "Locked", icon: Lock, color: "text-muted-foreground", available: false, requirement: "Requires POR" };
      case "Jabtinama":
        return submittedForms.includes("Supurdinama")
          ? { status: "Available", icon: FilePlus2, color: "text-accent", available: true }
          : { status: "Locked", icon: Lock, color: "text-muted-foreground", available: false, requirement: "Requires Supurdinama" };
      default:
        return { status: "Locked", icon: Lock, color: "text-muted-foreground", available: false };
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <div className="mb-8">
            <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-5xl py-8 px-4 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-2xl font-semibold text-destructive">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  if (!caseData) {
    return null;
  }

  const submittedForms = caseData.submittedForms || [];

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Case #{caseId.substring(0, 8)}</h1>
        <p className="text-muted-foreground">
          Case opened on {new Date(caseData.createdAt.seconds * 1000).toLocaleDateString()}
        </p>
      </div>

      <div className="mb-8">
        <AiSuggestion submittedForms={submittedForms} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-primary mb-4">Case Forms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ALL_FORMS.map((formType) => {
            const { status, icon, color, available, requirement } = getFormStatus(formType, submittedForms);
            return (
              <FormCard
                key={formType}
                caseId={caseId}
                formType={formType}
                status={status}
                Icon={icon}
                iconColor={color}
                isAvailable={available}
                requirement={requirement}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
