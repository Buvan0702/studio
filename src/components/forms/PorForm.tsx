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
import { PorFormData } from "@/lib/types";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  reportNo: z.string().min(1, "Report number is required."),
  date: z.string().min(1, "Date is required."),
  month: z.string().min(1, "Month is required."),
  year: z.string().min(1, "Year is required."),
  district: z.string().min(1, "District is required."),
  policeStation: z.string().min(1, "Police station is required."),
  offenseType: z.string().min(1, "Type of offense is required."),
  offenseDate: z.string().min(1, "Date of offense is required."),
  offenseTime: z.string().min(1, "Time of offense is required."),
  complainantName: z.string().min(1, "Complainant name is required."),
  complainantAddress: z.string().min(1, "Complainant address is required."),
  accusedName: z.string().min(1, "Accused name is required."),
  accusedAddress: z.string().min(1, "Accused address is required."),
  narrative: z.string().min(1, "Narrative is required."),
});

export default function PorForm({ caseId }: { caseId: string }) {
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
        const formRef = doc(db, "cases", caseId, "forms", "POR");
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
      const formRef = doc(db, "cases", caseId, "forms", "POR");
      await setDoc(formRef, {
        caseId,
        formType: "POR",
        formData: values,
        submittedAt: serverTimestamp(),
        finalized: false,
      }, { merge: true });

      const caseRef = doc(db, "cases", caseId);
      const caseSnap = await getDoc(caseRef);
      const submittedForms = caseSnap.data()?.submittedForms || [];
      if (!submittedForms.includes("POR")) {
        await updateDoc(caseRef, {
          submittedForms: [...submittedForms, "POR"],
        });
      }

      toast({ title: "Success", description: "POR form saved successfully." });
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <FormField control={form.control} name="reportNo" render={({ field }) => (
            <FormItem className="sm:col-span-1"><FormLabel>Report No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="date" render={({ field }) => (
            <FormItem className="sm:col-span-1"><FormLabel>Date</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="month" render={({ field }) => (
            <FormItem className="sm:col-span-1"><FormLabel>Month</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="year" render={({ field }) => (
            <FormItem className="sm:col-span-1"><FormLabel>Year (YY)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="district" render={({ field }) => (
            <FormItem><FormLabel>District</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="policeStation" render={({ field }) => (
            <FormItem><FormLabel>Police Station</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField control={form.control} name="offenseType" render={({ field }) => (
            <FormItem className="sm:col-span-1"><FormLabel>Type of Offense</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="offenseDate" render={({ field }) => (
            <FormItem className="sm:col-span-1"><FormLabel>Date of Offense</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="offenseTime" render={({ field }) => (
            <FormItem className="sm:col-span-1"><FormLabel>Time of Offense</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="complainantName" render={({ field }) => (
            <FormItem><FormLabel>Complainant Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="complainantAddress" render={({ field }) => (
            <FormItem><FormLabel>Complainant Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="accusedName" render={({ field }) => (
            <FormItem><FormLabel>Accused Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="accusedAddress" render={({ field }) => (
            <FormItem><FormLabel>Accused Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="narrative" render={({ field }) => (
            <FormItem><FormLabel>Narrative of Offense</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
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
