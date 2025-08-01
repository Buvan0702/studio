import type { Timestamp } from "firebase/firestore";

export type Case = {
  id: string;
  officerId: string;
  createdAt: Timestamp;
  status: "active" | "closed";
  submittedForms: FormType[];
};

export type FormType = "POR" | "Supurdinama" | "Jabtinama" | "Rajinama";

export type Form<T> = {
  id: string;
  caseId: string;
  formType: FormType;
  formData: T;
  submittedAt: Timestamp;
  finalized: boolean;
};

// Define specific form data types
export type PorFormData = {
  reportNo: string;
  date: string;
  month: string;
  year: string;
  district: string;
  policeStation: string;
  offenseType: string;
  offenseDate: string;
  offenseTime: string;
  complainantName: string;
  complainantAddress: string;
  accusedName: string;
  accusedAddress: string;
  narrative: string;
};

export type SupurdinamaFormData = {
  receiptNo: string;
  custodyDate: string;
  custodyTime: string;
  suspectName: string;
  officerName: string;
  reasonForCustody: string;
  itemsSeized: string;
};

export type JabtinamaFormData = {
  recordNo: string;
  offenseDate: string;
  offenseLocation: string;
  offenseDetails: string;
  suspectName: string;
  victimName: string;
  witnesses: string;
};

export type RajinamaFormData = {
  caseNo: string;
  resignationDate: string;
  reason: string;
  officerSignature: string;
  witnessSignature: string;
};
