import { PorFormData } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

const Field = ({ label, value }: { label: string; value: string | undefined }) => (
  <div className="flex items-baseline">
    <span className="font-semibold text-sm">{label}:</span>
    <span className="ml-2 flex-1 border-b border-dotted border-black text-sm pb-1">{value || ""}</span>
  </div>
);

export default function PorPrint({ data }: { data: PorFormData }) {
  return (
    <div className="font-sans text-black">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold underline">PRELIMINARY OFFENSE REPORT (POR)</h1>
        <h2 className="text-lg font-semibold">CONFIDENTIAL</h2>
      </div>

      <div className="border border-black p-4 space-y-4 text-sm">
        <div className="grid grid-cols-3 gap-x-8 gap-y-4">
          <div className="col-span-1">
            <Field label="1. Report No" value={data.reportNo} />
          </div>
          <div className="col-span-2 grid grid-cols-3 gap-x-4">
            <Field label="Date" value={data.date} />
            <Field label="Month" value={data.month} />
            <Field label="Year" value={`20${data.year}`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8">
            <Field label="2. District" value={data.district} />
            <Field label="3. Police Station" value={data.policeStation} />
        </div>

        <div className="grid grid-cols-3 gap-x-8">
            <Field label="4. Type of Offense" value={data.offenseType} />
            <Field label="5. Date of Offense" value={data.offenseDate ? new Date(data.offenseDate).toLocaleDateString('en-GB') : ''} />
            <Field label="6. Time of Offense" value={data.offenseTime} />
        </div>

        <Separator className="my-4 bg-black"/>
        
        <div>
            <p className="font-semibold mb-2">7. Complainant Information:</p>
            <div className="space-y-4 ml-4">
                <Field label="Name" value={data.complainantName} />
                <Field label="Address" value={data.complainantAddress} />
            </div>
        </div>

        <div>
            <p className="font-semibold mb-2">8. Accused Information:</p>
            <div className="space-y-4 ml-4">
                <Field label="Name" value={data.accusedName} />
                <Field label="Address" value={data.accusedAddress} />
            </div>
        </div>

        <Separator className="my-4 bg-black"/>
        
        <div>
          <p className="font-semibold mb-2">9. Narrative of Offense:</p>
          <div className="border border-gray-400 p-2 min-h-[200px] whitespace-pre-wrap text-sm">
            {data.narrative}
          </div>
        </div>

        <div className="pt-24 grid grid-cols-2 gap-x-16">
            <div className="border-t border-black text-center pt-2">
                <p>Reporting Officer's Signature</p>
            </div>
            <div className="border-t border-black text-center pt-2">
                <p>Supervisor's Signature</p>
            </div>
        </div>

      </div>
    </div>
  );
}
