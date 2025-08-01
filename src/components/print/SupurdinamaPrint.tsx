import { SupurdinamaFormData } from "@/lib/types";

const Field = ({ label, value }: { label: string; value:string | undefined }) => (
  <div className="mb-4">
    <p className="text-sm font-semibold text-gray-600">{label}</p>
    <p className="border-b border-black pb-1 mt-1">{value || ""}</p>
  </div>
);

export default function SupurdinamaPrint({ data }: { data: SupurdinamaFormData }) {
  return (
    <div className="font-sans text-black p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">CUSTODY RECEIPT (Supurdinama)</h1>
        <p className="text-sm">This document acknowledges receipt of a person into custody.</p>
      </div>

      <div className="border-2 border-black p-6">
        <div className="grid grid-cols-3 gap-8 mb-6">
          <Field label="Receipt No." value={data.receiptNo} />
          <Field label="Date of Custody" value={data.custodyDate ? new Date(data.custodyDate).toLocaleDateString('en-GB') : ''} />
          <Field label="Time of Custody" value={data.custodyTime} />
        </div>

        <Field label="Name of Person Taken into Custody (Suspect)" value={data.suspectName} />
        <Field label="Name of Arresting Officer" value={data.officerName} />
        <Field label="Reason for Custody" value={data.reasonForCustody} />

        <div>
          <p className="text-sm font-semibold text-gray-600">Items Seized from Person:</p>
          <div className="border border-gray-400 p-2 mt-1 min-h-[150px] whitespace-pre-wrap">
            {data.itemsSeized}
          </div>
        </div>

        <div className="mt-16">
          <p className="text-sm">I hereby acknowledge that I have been taken into custody and that the items listed above were seized from my person.</p>
        </div>

        <div className="grid grid-cols-2 gap-16 mt-24">
          <div className="border-t border-black pt-2">
            <p className="text-center font-semibold">Signature of Suspect</p>
          </div>
          <div className="border-t border-black pt-2">
            <p className="text-center font-semibold">Signature of Officer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
