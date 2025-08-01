import { RajinamaFormData } from "@/lib/types";

export default function RajinamaPrint({ data }: { data: RajinamaFormData }) {
  return (
    <div className="font-sans text-black">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">RESIGNATION FORM (Rajinama)</h1>
      </div>
      
      <div className="space-y-10 text-base">
        <div className="flex items-center">
          <span className="font-semibold">Date:</span>
          <span className="ml-4 flex-1 border-b border-dotted border-black pb-1">
            {data.resignationDate ? new Date(data.resignationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric'}) : ""}
          </span>
        </div>
        
        <div className="flex items-center">
          <span className="font-semibold">Case No:</span>
          <span className="ml-4 flex-1 border-b border-dotted border-black pb-1">{data.caseNo}</span>
        </div>
        
        <div>
          <p className="font-semibold mb-2">Reason for Resignation:</p>
          <div className="p-2 border border-black min-h-[300px] whitespace-pre-wrap">
            {data.reason}
          </div>
        </div>
        
        <p>I, the undersigned, do hereby submit my resignation from the aforementioned matter, under no duress or coercion.</p>

        <div className="grid grid-cols-2 gap-x-20 pt-20">
          <div>
            <div className="border-t-2 border-black pt-2 text-center">
              <p className="font-semibold">{data.officerSignature || "__________________________"}</p>
              <p className="text-sm">(Officer's Signature)</p>
            </div>
          </div>
          <div>
            <div className="border-t-2 border-black pt-2 text-center">
                <p className="font-semibold">{data.witnessSignature || "__________________________"}</p>
                <p className="text-sm">(Witness's Signature)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
