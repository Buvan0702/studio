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
  bookNo: z.string().min(1, "Book No. is required."),
  pageNo: z.string().min(1, "Page No. is required."),
  reportNo: z.string().min(1, "Report number is required."),
  date: z.string().min(1, "Date is required."),
  month: z.string().min(1, "Month is required."),
  year: z.string().min(1, "Year is required."),
  accusedInfo: z.string().min(1, "Accused info is required."),
  offenseType: z.string().min(1, "Type of offense is required."),
  placeOfOffense: z.string().min(1, "Place of offense is required."),
  dateOfOffense: z.string().min(1, "Date of offense is required."),
  seizedGoods: z.string().min(1, "Seized goods are required."),
  witnesses: z.string().min(1, "Witnesses are required."),
  sentToAssistant: z.string(),
  sentToOfficer: z.string(),
  place: z.string().min(1, "Place is required."),
  signatureDate: z.string().min(1, "Signature date is required."),
  area: z.string().min(1, "Area is required."),
  forwardingOfficer: z.string(),
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="bookNo" render={({ field }) => (
            <FormItem><FormLabel>Book No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="pageNo" render={({ field }) => (
            <FormItem><FormLabel>Page No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <FormField control={form.control} name="reportNo" render={({ field }) => (
            <FormItem><FormLabel>Report No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="date" render={({ field }) => (
            <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="month" render={({ field }) => (
            <FormItem><FormLabel>Month</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="year" render={({ field }) => (
            <FormItem><FormLabel>Year (YYYY)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="accusedInfo" render={({ field }) => (
            <FormItem><FormLabel>Name of accused, father's name, caste and address</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="offenseType" render={({ field }) => (
            <FormItem><FormLabel>Type of offense and relevant section</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="placeOfOffense" render={({ field }) => (
            <FormItem><FormLabel>Place of offense</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="dateOfOffense" render={({ field }) => (
            <FormItem><FormLabel>Date of offense</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="seizedGoods" render={({ field }) => (
            <FormItem><FormLabel>Seized goods and action taken</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="witnesses" render={({ field }) => (
            <FormItem><FormLabel>Names of witnesses</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="sentToAssistant" render={({ field }) => (
            <FormItem><FormLabel>Second part sent to Assistant (Range)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="sentToOfficer" render={({ field }) => (
            <FormItem><FormLabel>Third part sent to Officer (Division)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField control={form.control} name="place" render={({ field }) => (
            <FormItem><FormLabel>Place</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="signatureDate" render={({ field }) => (
            <FormItem><FormLabel>Signature Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="area" render={({ field }) => (
            <FormItem><FormLabel>Area</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="forwardingOfficer" render={({ field }) => (
            <FormItem><FormLabel>Forwarding Officer (For Column 3)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
