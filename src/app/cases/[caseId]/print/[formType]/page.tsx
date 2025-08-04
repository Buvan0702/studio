import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import PrintWrapper from "@/components/print/PrintWrapper";
import PorPrint from "@/components/print/PorPrint";
import SupurdinamaPrint from "@/components/print/SupurdinamaPrint";
import JabtinamaPrint from "@/components/print/JabtinamaPrint";
import RajinamaPrint from "@/components/print/RajinamaPrint";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default async function PrintPage({ params }: { params: { caseId: string; formType: string } }) {
  const { caseId, formType } = params;

  const formRef = doc(db, "cases", caseId, "forms", formType);
  const formSnap = await getDoc(formRef);

  if (!formSnap.exists()) {
    return (
        <div className="container mx-auto py-8">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Form data not found. Please complete the form before printing.</AlertDescription>
            </Alert>
        </div>
    )
  }

  const formData = formSnap.data().formData;

  const renderPrintComponent = () => {
    switch (formType) {
      case "POR":
        return <PorPrint data={formData} />;
      case "Supurdinama":
        return <SupurdinamaPrint data={formData} />;
      case "Jabtinama":
        return <JabtinamaPrint data={formData} />;
      case "Rajinama":
        return <RajinamaPrint data={formData} />;
      default:
        notFound();
    }
  };

  return (
      <PrintWrapper formType={formType} caseId={caseId}>
        {renderPrintComponent()}
      </PrintWrapper>
  );
}
