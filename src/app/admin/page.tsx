
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { collection, query, getDocs, orderBy, Query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Case } from "@/lib/types";
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { FileText, ChevronRight, Archive, Loader2, Shield } from "lucide-react";
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
          <div className="bg-blue-100 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-primary">Case #{caseItem.id.substring(0, 8)}</CardTitle>
            <CardDescription>
              Created on: {caseItem.createdAt ? new Date(caseItem.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
            </CardDescription>
             <CardDescription>
              Officer ID: {caseItem.officerId.substring(0,8)}
            </CardDescription>
          </div>
        </div>
        <ChevronRight className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
    </Card>
  );
};

const AdminDashboardSkeleton = () => (
  <div className="container mx-auto py-8 px-4">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-9 w-48" />
    </div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
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


export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllCases = useCallback(async () => {
    if (!user || user.role !== 'admin') {
        setIsLoading(false);
        return;
    };
    setIsLoading(true);
    try {
      const casesRef = collection(db, "cases");
      const q: Query = query(casesRef, orderBy("createdAt", "desc"));
      
      const querySnapshot = await getDocs(q);
      const allCases = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Case));
      setCases(allCases);
    } catch (error) {
      console.error("Error fetching all cases:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'admin') {
        fetchAllCases();
      } else {
        // Redirect non-admin users
        router.push('/dashboard');
      }
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router, fetchAllCases]);

  
  if (authLoading || isLoading) {
    return <AdminDashboardSkeleton />;
  }
  
  const activeCases = cases.filter(c => c.status === 'active');
  const closedCases = cases.filter(c => c.status === 'closed');

  const renderContent = (caseList: Case[]) => {
    if (caseList.length > 0) {
      return caseList.map((caseItem) => <CaseCard key={caseItem.id} caseItem={caseItem} />);
    }
    return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Archive className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="text-xl font-medium text-primary mt-4">No Cases Found</h3>
        </div>
      );
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
                <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
                <p className="text-muted-foreground">View all cases across the system.</p>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">All Ongoing ({activeCases.length})</TabsTrigger>
            <TabsTrigger value="closed">All Closed ({closedCases.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
             <div className="space-y-4 mt-4">
              {renderContent(activeCases)}
            </div>
          </TabsContent>
          <TabsContent value="closed">
            <div className="space-y-4 mt-4">
              {renderContent(closedCases)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
