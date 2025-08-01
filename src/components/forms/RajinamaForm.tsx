"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  caseNo: z.string().min(1, "Case number is required."),
  resignationDate: z.string().min(1, "Date of resignation is required."),
  reason: z.string().min(1, "Reason for resignation is required."),
  officerSignature: z.string().min(1, "Officer's signature is required."),
  witnessSignature: z.string().min(1, "Witness's signature is required."),
});

export default function RajinamaForm({ caseId }: { caseId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        caseNo: caseId.substring(0, 8)
    },
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const formRef = doc(db, "cases", caseId, "forms", "Rajinama");
        const docSnap = await getDoc(formRef);
        if (docSnap.exists()) {
          form.reset(docSnap.data().formData);
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to fetch form data." });
      } finally {
        setIsFetching(false);
      }
    };
    fetchFormData();
  }, [caseId, form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const formRef = doc(db, "cases", caseId, "forms", "Rajinama");
      await setDoc(formRef, {
        caseId,
        formType: "Rajinama",
        formData: values,
        submittedAt: serverTimestamp(),
        finalized: false,
      }, { merge: true });

      const caseRef = doc(db, "cases", caseId);
      const caseSnap = await getDoc(caseRef);
      const submittedForms = caseSnap.data()?.submittedForms || [];
      if (!submittedForms.includes("Rajinama")) {
        await updateDoc(caseRef, {
          submittedForms: [...submittedForms, "Rajinama"],
        });
      }

      toast({ title: "Success", description: "Rajinama form saved successfully." });
      router.push(`/cases/${caseId}`);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Save Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="caseNo" render={({ field }) => (
            <FormItem><FormLabel>Case No.</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="resignationDate" render={({ field }) => (
            <FormItem><FormLabel>Date of Resignation</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="reason" render={({ field }) => (
            <FormItem><FormLabel>Reason for Resignation</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="officerSignature" render={({ field }) => (
                <FormItem><FormLabel>Officer Signature</FormLabel><FormControl><Input placeholder="Type name to sign" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="witnessSignature" render={({ field }) => (
                <FormItem><FormLabel>Witness Signature</FormLabel><FormControl><Input placeholder="Type name to sign" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Form
            </Button>
        </div>
      </form>
    </Form>
  );
}
