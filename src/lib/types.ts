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
  officerId: string;
  bookNo: string;
  pageNo: string;
  reportNo: string;
  date: string;
  month: string;
  year: string;
  accusedInfo: string;
  offenseType: string;
  placeOfOffense: string;
  dateOfOffense: string;
  seizedGoods: string;
  witnesses: string;
  sentToAssistant: string;
  sentToOfficer: string;
  place: string;
  signatureDate: string;
  area: string;
  forwardingOfficer: string;
};

export type SupurdinamaFormData = {
  custodianName: string;
  custodianCaste: string;
  custodianResident: string;
  custodianTehsil: string;
  custodianDistrict: string;
  officerName: string;
  handoverDate: string;
  handoverMonth: string;
  handoverYear: string;
  itemsList: string;
  declarationDate: string;
  declarationMonth: string;
  declarationYear: string;
  witness1: string;
  witness2: string;
  custodianSignature: string;
};

export type JabtinamaFormData = {
  dateTime: string;
  placeOfOffense: string;
  officerName: string;
  accusedName: string;
  confiscatedProperty: string;
  accusedCaste: string;
  witnessName: string;
  custodianName: string;
  speciesDescription: string;
  species: string;
  quantity: string;
  length: string;
  girth: string;
  rate: string;
  totalValue: string;
  accusedSignature: string;
  officerSignature: string;
  witness1: string;
  witness2: string;
  witness3: string;
  witness4: string;
};

export type RajinamaFormData = {
  declarant1Name: string;
  declarant1Caste: string;
  declarant1Resident: string;
  declarant2Name: string;
  declarant2Caste: string;
  declarant2Resident: string;
  declarant3Name: string;
  declarant3Caste: string;
  declarant3Resident: string;
  declarant4Name: string;
  declarant4Caste: string;
  declarant4Resident: string;
  declarant5Name: string;
  declarant5Caste: string;
  declarant5Resident: string;
  suspectInfo: string;
  declarationDate: string;
  declarationYear: string;
  declarantSignature: string;
  witness1: string;
  witness2: string;
  witness3: string;
  witness4: string;
  witness5: string;
  verificationDate: string;
  verificationYear: string;
  verifyingOfficerSignature: string;
};
