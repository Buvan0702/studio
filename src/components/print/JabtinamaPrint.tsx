import { JabtinamaFormData } from "@/lib/types";

const Field = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="flex flex-col space-y-1 mb-4">
      <span className="font-semibold text-sm text-gray-700">{label}</span>
      <span className="px-2 py-1 border-b border-gray-400 min-h-[28px]">{value || ""}</span>
    </div>
  );
  
export default function JabtinamaPrint({ data }: { data: JabtinamaFormData }) {
  return (
    <div className="font-serif text-black p-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-wider">OFFENSE RECORD (Jabtinama)</h1>
      </div>
      
      <div className="border border-black p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="Record No." value={data.recordNo} />
            <Field label="Date of Offense" value={data.offenseDate ? new Date(data.offenseDate).toLocaleDateString('en-GB') : ''} />
            <Field label="Location of Offense" value={data.offenseLocation} />
        </div>

        <div className="mt-4">
          <p className="font-semibold text-sm text-gray-700">Details of Offense:</p>
          <div className="mt-1 p-2 border border-gray-400 min-h-[150px] whitespace-pre-wrap">
            {data.offenseDetails}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Field label="Suspect(s) Involved" value={data.suspectName} />
            <Field label="Victim(s) Involved" value={data.victimName} />
        </div>
        
        <div className="mt-4">
          <p className="font-semibold text-sm text-gray-700">Witnesses (Name, Address, Contact):</p>
          <div className="mt-1 p-2 border border-gray-400 min-h-[100px] whitespace-pre-wrap">
            {data.witnesses}
          </div>
        </div>
        
        <div className="mt-24">
            <div className="w-1/3">
                <div className="border-t border-black pt-2 text-center text-sm font-semibold">
                    Signature of Preparing Officer
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
