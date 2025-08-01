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
  recordNo: z.string().min(1, "Record number is required."),
  offenseDate: z.string().min(1, "Date of offense is required."),
  offenseLocation: z.string().min(1, "Location of offense is required."),
  offenseDetails: z.string().min(1, "Details of offense are required."),
  suspectName: z.string().min(1, "Suspect's name is required."),
  victimName: z.string().min(1, "Victim's name is required."),
  witnesses: z.string().min(1, "List of witnesses is required."),
});

export default function JabtinamaForm({ caseId }: { caseId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const formRef = doc(db, "cases", caseId, "forms", "Jabtinama");
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
      const formRef = doc(db, "cases", caseId, "forms", "Jabtinama");
      await setDoc(formRef, {
        caseId,
        formType: "Jabtinama",
        formData: values,
        submittedAt: serverTimestamp(),
        finalized: false,
      }, { merge: true });

      const caseRef = doc(db, "cases", caseId);
      const caseSnap = await getDoc(caseRef);
      const submittedForms = caseSnap.data()?.submittedForms || [];
      if (!submittedForms.includes("Jabtinama")) {
        await updateDoc(caseRef, {
          submittedForms: [...submittedForms, "Jabtinama"],
        });
      }

      toast({ title: "Success", description: "Jabtinama form saved successfully." });
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField control={form.control} name="recordNo" render={({ field }) => (
            <FormItem><FormLabel>Record No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="offenseDate" render={({ field }) => (
            <FormItem><FormLabel>Date of Offense</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="offenseLocation" render={({ field }) => (
            <FormItem><FormLabel>Location of Offense</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="suspectName" render={({ field }) => (
                <FormItem><FormLabel>Suspect(s) Name(s)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="victimName" render={({ field }) => (
                <FormItem><FormLabel>Victim(s) Name(s)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <FormField control={form.control} name="offenseDetails" render={({ field }) => (
            <FormItem><FormLabel>Details of the Offense</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="witnesses" render={({ field }) => (
            <FormItem><FormLabel>Witnesses</FormLabel><FormControl><Textarea rows={3} placeholder="Name, Address, Contact..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />

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
