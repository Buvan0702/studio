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
  receiptNo: z.string().min(1, "Receipt number is required."),
  custodyDate: z.string().min(1, "Date of custody is required."),
  custodyTime: z.string().min(1, "Time of custody is required."),
  suspectName: z.string().min(1, "Suspect's name is required."),
  officerName: z.string().min(1, "Officer's name is required."),
  reasonForCustody: z.string().min(1, "Reason for custody is required."),
  itemsSeized: z.string().min(1, "List of seized items is required."),
});

export default function SupurdinamaForm({ caseId }: { caseId: string }) {
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
        const formRef = doc(db, "cases", caseId, "forms", "Supurdinama");
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
      const formRef = doc(db, "cases", caseId, "forms", "Supurdinama");
      await setDoc(formRef, {
        caseId,
        formType: "Supurdinama",
        formData: values,
        submittedAt: serverTimestamp(),
        finalized: false,
      }, { merge: true });

      const caseRef = doc(db, "cases", caseId);
      const caseSnap = await getDoc(caseRef);
      const submittedForms = caseSnap.data()?.submittedForms || [];
      if (!submittedForms.includes("Supurdinama")) {
        await updateDoc(caseRef, {
          submittedForms: [...submittedForms, "Supurdinama"],
        });
      }

      toast({ title: "Success", description: "Supurdinama form saved successfully." });
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
          <FormField control={form.control} name="receiptNo" render={({ field }) => (
            <FormItem><FormLabel>Receipt No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="custodyDate" render={({ field }) => (
            <FormItem><FormLabel>Date of Custody</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="custodyTime" render={({ field }) => (
            <FormItem><FormLabel>Time of Custody</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="suspectName" render={({ field }) => (
                <FormItem><FormLabel>Suspect Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="officerName" render={({ field }) => (
                <FormItem><FormLabel>Arresting Officer Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <FormField control={form.control} name="reasonForCustody" render={({ field }) => (
            <FormItem><FormLabel>Reason for Custody</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="itemsSeized" render={({ field }) => (
            <FormItem><FormLabel>Items Seized from Suspect</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
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
