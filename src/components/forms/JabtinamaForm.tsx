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
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  dateTime: z.string().min(1, "Date and Time are required."),
  placeOfOffense: z.string().min(1, "Place of Offense is required."),
  officerName: z.string().min(1, "Officer Name is required."),
  accusedName: z.string().min(1, "Accused Name is required."),
  confiscatedProperty: z.string().min(1, "Confiscated Property details are required."),
  accusedCaste: z.string().min(1, "Caste of Accused is required."),
  witnessName: z.string().min(1, "Witness Name & Father’s Name are required."),
  custodianName: z.string().min(1, "Custodian Name & Father’s Name are required."),
  speciesDescription: z.string(),
  species: z.string(),
  quantity: z.string(),
  length: z.string(),
  girth: z.string(),
  rate: z.string(),
  totalValue: z.string(),
  accusedSignature: z.string().min(1, "Accused Signature is required."),
  officerSignature: z.string().min(1, "Officer Signature is required."),
  witness1: z.string(),
  witness2: z.string(),
  witness3: z.string(),
  witness4: z.string(),
});

export default function JabtinamaForm({ caseId }: { caseId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTime: '',
      placeOfOffense: '',
      officerName: '',
      accusedName: '',
      confiscatedProperty: '',
      accusedCaste: '',
      witnessName: '',
      custodianName: '',
      speciesDescription: '',
      species: '',
      quantity: '',
      length: '',
      girth: '',
      rate: '',
      totalValue: '',
      accusedSignature: '',
      officerSignature: '',
      witness1: '',
      witness2: '',
      witness3: '',
      witness4: '',
    },
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
      await updateDoc(caseRef, {
        submittedForms: arrayUnion("Jabtinama"),
      });

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="dateTime" render={({ field }) => (
            <FormItem><FormLabel>Date and Time</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="placeOfOffense" render={({ field }) => (
            <FormItem><FormLabel>Place of Offense</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="officerName" render={({ field }) => (
            <FormItem><FormLabel>Name and Designation of Officer</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="accusedName" render={({ field }) => (
            <FormItem><FormLabel>Name of Accused or his Representative</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="confiscatedProperty" render={({ field }) => (
          <FormItem><FormLabel>Details of Confiscated Property</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="accusedCaste" render={({ field }) => (
            <FormItem><FormLabel>Caste of Accused</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="witnessName" render={({ field }) => (
            <FormItem><FormLabel>Witness Name & Father’s Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          </div>
          <FormField control={form.control} name="custodianName" render={({ field }) => (
            <FormItem><FormLabel>Name of Custodian & Father’s Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        
        <h3 className="text-lg font-semibold text-primary">Species Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="speciesDescription" render={({ field }) => (
              <FormItem><FormLabel>Species Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="species" render={({ field }) => (
              <FormItem><FormLabel>Species</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
         <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <FormField control={form.control} name="quantity" render={({ field }) => (
              <FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="length" render={({ field }) => (
              <FormItem><FormLabel>Length</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="girth" render={({ field }) => (
              <FormItem><FormLabel>Girth</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="rate" render={({ field }) => (
              <FormItem><FormLabel>Rate</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="totalValue" render={({ field }) => (
              <FormItem><FormLabel>Total Value</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <h3 className="text-lg font-semibold text-primary">Signatures</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="accusedSignature" render={({ field }) => (
                <FormItem><FormLabel>Signature of Accused</FormLabel><FormControl><Input placeholder="Type name to sign" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="officerSignature" render={({ field }) => (
                <FormItem><FormLabel>Signature of Investigating Officer</FormLabel><FormControl><Input placeholder="Type name to sign" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <h3 className="text-lg font-semibold text-primary">Witnesses</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="witness1" render={({ field }) => (
                <FormItem><FormLabel>Witness 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="witness2" render={({ field }) => (
                <FormItem><FormLabel>Witness 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="witness3" render={({ field }) => (
                <FormItem><FormLabel>Witness 3</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="witness4" render={({ field }) => (
                <FormItem><FormLabel>Witness 4</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
