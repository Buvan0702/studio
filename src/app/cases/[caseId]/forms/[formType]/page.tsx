"use client";

import { useParams } from "next/navigation";
import PorForm from "@/components/forms/PorForm";
import SupurdinamaForm from "@/components/forms/SupurdinamaForm";
import JabtinamaForm from "@/components/forms/JabtinamaForm";
import RajinamaForm from "@/components/forms/RajinamaForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function FormPage() {
  const params = useParams();
  const caseId = params.caseId as string;
  const formType = params.formType as string;

  const renderForm = () => {
    switch (formType) {
      case "POR":
        return <PorForm caseId={caseId} />;
      case "Supurdinama":
        return <SupurdinamaForm caseId={caseId} />;
      case "Jabtinama":
        return <JabtinamaForm caseId={caseId} />;
      case "Rajinama":
        return <RajinamaForm caseId={caseId} />;
      default:
        return <p>Form not found.</p>;
    }
  };

  return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">{formType} Form</CardTitle>
            <CardDescription>
              Fill out the details for Case #{caseId.substring(0, 8)}. All fields are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderForm()}
          </CardContent>
        </Card>
      </div>
  );
}
