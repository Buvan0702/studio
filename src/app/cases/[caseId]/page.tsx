"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Case, FormType } from "@/lib/types";
import { AlertTriangle, FileCheck2, FileClock, Lock, FilePlus2, Archive } from "lucide-react";
import AiSuggestion from "@/components/cases/AiSuggestion";
import FormCard from "@/components/cases/FormCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import CasesLayout from "../layout";


const ALL_FORMS: FormType[] = ["POR", "Supurdinama", "Jabtinama", "Rajinama"];

export default function CasePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const caseId = params.caseId as string;
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClosingCase, setIsClosingCase] = useState(false);

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

  const handleCloseCase = async () => {
    setIsClosingCase(true);
    try {
      const caseRef = doc(db, "cases", caseId);
      await updateDoc(caseRef, {
        status: "closed"
      });
      toast({
        title: "Case Closed",
        description: `Case #${caseId.substring(0, 8)} has been moved to closed cases.`,
      });
       setCaseData(prev => prev ? { ...prev, status: 'closed' } : null);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to close the case.",
      });
      console.error("Error closing case: ", error);
    } finally {
      setIsClosingCase(false);
    }
  };


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
      <CasesLayout>
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
      </CasesLayout>
    );
  }

  if (error) {
    return (
      <CasesLayout>
        <div className="container mx-auto max-w-5xl py-8 px-4 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-2xl font-semibold text-destructive">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </CasesLayout>
    );
  }
  
  if (!caseData) {
    return null;
  }

  const submittedForms = caseData.submittedForms || [];

  return (
    <CasesLayout>
      <div className="container mx-auto max-w-5xl py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Case #{caseId.substring(0, 8)}</h1>
            <p className="text-muted-foreground">
              Case opened on {new Date(caseData.createdAt.seconds * 1000).toLocaleDateString()}
            </p>
            {caseData.status === 'closed' && (
              <span className="mt-2 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                Closed
              </span>
            )}
          </div>
          {caseData.status === 'active' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Archive className="mr-2 h-4 w-4" /> Close Case
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to close this case?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will mark the case as closed and it will be moved to the archives.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCloseCase} disabled={isClosingCase}>
                    {isClosingCase ? 'Closing...' : 'Confirm'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        <div className="mb-8">
          <AiSuggestion submittedForms={submittedForms} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-primary mb-4">Case Forms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  isAvailable={available && caseData.status === 'active'}
                  requirement={requirement}
                />
              );
            })}
          </div>
        </div>
      </div>
    </CasesLayout>
  );
}
