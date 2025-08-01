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
  custodianName: z.string().min(1, "Custodian name is required."),
  custodianCaste: z.string().min(1, "Caste is required."),
  custodianResident: z.string().min(1, "Resident is required."),
  custodianTehsil: z.string().min(1, "Tehsil is required."),
  custodianDistrict: z.string().min(1, "District is required."),
  officerName: z.string().min(1, "Officer's name is required."),
  handoverDate: z.string().min(1, "Handover date is required."),
  handoverMonth: z.string().min(1, "Handover month is required."),
  handoverYear: z.string().min(1, "Handover year is required."),
  itemsList: z.string().min(1, "List of items is required."),
  declarationDate: z.string().min(1, "Declaration date is required."),
  declarationMonth: z.string().min(1, "Declaration month is required."),
  declarationYear: z.string().min(1, "Declaration year is required."),
  witness1: z.string().min(1, "Witness 1 is required."),
  witness2: z.string().min(1, "Witness 2 is required."),
  custodianSignature: z.string().min(1, "Signature is required."),
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
        <h3 className="text-lg font-semibold text-primary">Custodian Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="custodianName" render={({ field }) => (
            <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="custodianCaste" render={({ field }) => (
            <FormItem><FormLabel>Caste</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="custodianResident" render={({ field }) => (
            <FormItem><FormLabel>Resident of</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="custodianTehsil" render={({ field }) => (
            <FormItem><FormLabel>Tehsil</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="custodianDistrict" render={({ field }) => (
            <FormItem><FormLabel>District</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <h3 className="text-lg font-semibold text-primary">Handover Details</h3>
        <FormField control={form.control} name="officerName" render={({ field }) => (
            <FormItem><FormLabel>Forest Officer Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField control={form.control} name="handoverDate" render={({ field }) => (
            <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="handoverMonth" render={({ field }) => (
            <FormItem><FormLabel>Month</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="handoverYear" render={({ field }) => (
            <FormItem><FormLabel>Year</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="itemsList" render={({ field }) => (
            <FormItem><FormLabel>Detailed List of Items</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <h3 className="text-lg font-semibold text-primary">Declaration & Witnesses</h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField control={form.control} name="declarationDate" render={({ field }) => (
            <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="declarationMonth" render={({ field }) => (
            <FormItem><FormLabel>Month</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="declarationYear" render={({ field }) => (
            <FormItem><FormLabel>Year</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="witness1" render={({ field }) => (
                <FormItem><FormLabel>Witness 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="witness2" render={({ field }) => (
                <FormItem><FormLabel>Witness 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
         <FormField control={form.control} name="custodianSignature" render={({ field }) => (
            <FormItem><FormLabel>Custodian Signature</FormLabel><FormControl><Input placeholder="Type name to sign" {...field} /></FormControl><FormMessage /></FormItem>
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
