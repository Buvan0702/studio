"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintWrapperProps {
  children: React.ReactNode;
  formType: string;
  caseId: string;
}

export default function PrintWrapper({ children, formType, caseId }: PrintWrapperProps) {
  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="container mx-auto py-8 print-hidden">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-4">
          <div>
            <h1 className="text-xl font-bold text-primary">Print Preview: {formType}</h1>
            <p className="text-muted-foreground">Case #{caseId.substring(0, 8)}</p>
          </div>
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print Form
          </Button>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="bg-white p-8 md:p-12 shadow-lg" id="printable-area">
          {children}
        </div>
      </div>
    </div>
  );
}
