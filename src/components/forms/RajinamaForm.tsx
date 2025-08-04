"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  declarant1Name: z.string(),
  declarant1Caste: z.string(),
  declarant1Resident: z.string(),
  declarant2Name: z.string(),
  declarant2Caste: z.string(),
  declarant2Resident: z.string(),
  declarant3Name: z.string(),
  declarant3Caste: z.string(),
  declarant3Resident: z.string(),
  declarant4Name: z.string(),
  declarant4Caste: z.string(),
  declarant4Resident: z.string(),
  declarant5Name: z.string(),
  declarant5Caste: z.string(),
  declarant5Resident: z.string(),
  suspectInfo: z.string().min(1, "Suspect info is required."),
  declarationDate: z.string().min(1, "Declaration date is required."),
  declarationYear: z.string().min(1, "Declaration year is required."),
  declarantSignature: z.string().min(1, "Declarant signature is required."),
  witness1: z.string(),
  witness2: z.string(),
  witness3: z.string(),
  witness4: z.string(),
  witness5: z.string(),
  verificationDate: z.string().min(1, "Verification date is required."),
  verificationYear: z.string().min(1, "Verification year is required."),
  verifyingOfficerSignature: z.string().min(1, "Verifying officer signature is required."),
});

const defaultFormValues = {
  declarant1Name: '',
  declarant1Caste: '',
  declarant1Resident: '',
  declarant2Name: '',
  declarant2Caste: '',
  declarant2Resident: '',
  declarant3Name: '',
  declarant3Caste: '',
  declarant3Resident: '',
  declarant4Name: '',
  declarant4Caste: '',
  declarant4Resident: '',
  declarant5Name: '',
  declarant5Caste: '',
  declarant5Resident: '',
  suspectInfo: '',
  declarationDate: '',
  declarationYear: '',
  declarantSignature: '',
  witness1: '',
  witness2: '',
  witness3: '',
  witness4: '',
  witness5: '',
  verificationDate: '',
  verificationYear: '',
  verifyingOfficerSignature: '',
};

export default function RajinamaForm({ caseId }: { caseId: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const formRef = doc(db, "cases", caseId, "forms", "Rajinama");
        const docSnap = await getDoc(formRef);
        if (docSnap.exists()) {
          const data = docSnap.data().formData;
          form.reset({ ...defaultFormValues, ...data });
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
      await updateDoc(caseRef, {
          submittedForms: arrayUnion("Rajinama"),
      });

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
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i}>
            <h3 className="text-lg font-semibold text-primary mb-2">Declarant {i}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField control={form.control} name={`declarant${i}Name` as any} render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name={`declarant${i}Caste` as any} render={({ field }) => (
                <FormItem><FormLabel>Caste</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name={`declarant${i}Resident` as any} render={({ field }) => (
                <FormItem><FormLabel>Resident of</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>
        ))}
        
        <FormField control={form.control} name="suspectInfo" render={({ field }) => (
            <FormItem><FormLabel>Regarding forest-related suspect</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <h3 className="text-lg font-semibold text-primary">Declaration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="declarationDate" render={({ field }) => (
                <FormItem><FormLabel>Declaration Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="declarationYear" render={({ field }) => (
                <FormItem><FormLabel>Declaration Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <FormField control={form.control} name="declarantSignature" render={({ field }) => (
            <FormItem><FormLabel>Signature of Declarant</FormLabel><FormControl><Input placeholder="Type name to sign" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <h3 className="text-lg font-semibold text-primary">Witnesses</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5].map(i => (
          <FormField key={i} control={form.control} name={`witness${i}` as any} render={({ field }) => (
            <FormItem><FormLabel>Witness {i}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        ))}
        </div>

        <h3 className="text-lg font-semibold text-primary">Verification</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="verificationDate" render={({ field }) => (
                <FormItem><FormLabel>Verification Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="verificationYear" render={({ field }) => (
                <FormItem><FormLabel>Verification Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <FormField control={form.control} name="verifyingOfficerSignature" render={({ field }) => (
            <FormItem><FormLabel>Verifying Officer Signature</FormLabel><FormControl><Input placeholder="Type name to sign" {...field} /></FormControl><FormMessage /></FormItem>
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
