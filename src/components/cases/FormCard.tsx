"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { FormType } from "@/lib/types";

interface FormCardProps {
  caseId: string;
  formType: FormType;
  status: "Completed" | "Available" | "Locked";
  Icon: LucideIcon;
  iconColor: string;
  isAvailable: boolean;
  requirement?: string;
}

export default function FormCard({
  caseId,
  formType,
  status,
  Icon,
  iconColor,
  isAvailable,
  requirement,
}: FormCardProps) {
  const getBadgeVariant = () => {
    switch (status) {
      case "Completed":
        return "default";
      case "Available":
        return "secondary";
      case "Locked":
        return "outline";
    }
  };

  return (
    <Card className={cn(
      "flex flex-col justify-between transition-all",
      !isAvailable ? "bg-muted/50" : "hover:shadow-lg hover:-translate-y-1"
    )}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <Icon className={cn("h-8 w-8", iconColor)} />
          <Badge variant={getBadgeVariant()} className={cn(status === 'Completed' && 'bg-green-600 text-white')}>{status}</Badge>
        </div>
        <CardTitle className="pt-4 text-xl text-primary">{formType}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {requirement && (
          <p className="text-sm text-destructive">{requirement}</p>
        )}
      </CardContent>
      <CardFooter>
        {status === 'Completed' ? (
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <Button asChild variant="outline" className="flex-1" disabled={!isAvailable}>
              <Link href={`/cases/${caseId}/forms/${formType}`}>Edit</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href={`/cases/${caseId}/print/${formType}`} target="_blank">Print</Link>
            </Button>
          </div>
        ) : (
          <Button asChild className="w-full" disabled={!isAvailable}>
            <Link href={`/cases/${caseId}/forms/${formType}`}>
              {status === 'Locked' ? 'Locked' : 'Start Form'}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
