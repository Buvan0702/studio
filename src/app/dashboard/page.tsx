"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Case } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, ChevronRight, Archive, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CaseCard = ({ caseItem }: { caseItem: Case }) => {
  const router = useRouter();
  return (
    <Card 
      key={caseItem.id} 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => router.push(`/cases/${caseItem.id}`)}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-accent/20 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg text-primary">Case #{caseItem.id.substring(0, 8)}</CardTitle>
            <CardDescription>
              Created on: {caseItem.createdAt ? new Date(caseItem.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
            </CardDescription>
          </div>
        </div>
        <ChevronRight className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
    </Card>
  );
};

const DashboardSkeleton = () => (
  <div className="container mx-auto py-8 px-4">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-10 w-36" />
    </div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-52" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader>
        </Card>
      ))}
    </div>
  </div>
);


export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCase, setIsCreatingCase] = useState(false);

  const fetchCases = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const casesRef = collection(db, "cases");
      const q = query(casesRef, where("officerId", "==", user.uid), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const userCases = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Case));
      setCases(userCases);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchCases();
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router, fetchCases]);

  const handleNewCase = async () => {
    if (!user) return;
    setIsCreatingCase(true);
    try {
      const newCaseRef = await addDoc(collection(db, "cases"), {
        officerId: user.uid,
        createdAt: serverTimestamp(),
        status: "active",
        submittedForms: [],
      });
      router.push(`/cases/${newCaseRef.id}`);
    } catch (error) {
      console.error("Error creating new case:", error);
    } finally {
      setIsCreatingCase(false);
    }
  };
  
  if (authLoading || isLoading) {
    return <DashboardSkeleton />;
  }
  
  const activeCases = cases.filter(c => c.status === 'active');
  const closedCases = cases.filter(c => c.status === 'closed');

  const renderContent = (caseList: Case[], type: 'active' | 'closed') => {
    if (caseList.length > 0) {
      return caseList.map((caseItem) => <CaseCard key={caseItem.id} caseItem={caseItem} />);
    }

    if (type === 'active') {
      return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-medium text-primary">No active cases</h3>
          <p className="text-muted-foreground mt-2">Start a new case to begin.</p>
        </div>
      );
    } else {
       return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Archive className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="text-xl font-medium text-primary mt-4">No closed cases</h3>
          <p className="text-muted-foreground mt-2">Closed cases will appear here.</p>
        </div>
      );
    }
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Case Dashboard</h1>
            <p className="text-muted-foreground">Manage your active and past cases.</p>
          </div>
          <Button onClick={handleNewCase} disabled={isCreatingCase}>
            <PlusCircle className="mr-2 h-5 w-5" />
            {isCreatingCase ? "Creating Case..." : "Start New Case"}
          </Button>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Ongoing ({activeCases.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({closedCases.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
             <div className="space-y-4 mt-4">
              {renderContent(activeCases, 'active')}
            </div>
          </TabsContent>
          <TabsContent value="closed">
            <div className="space-y-4 mt-4">
              {renderContent(closedCases, 'closed')}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
