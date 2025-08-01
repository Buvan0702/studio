"use client";

import { SupurdinamaFormData } from "@/lib/types";

export default function SupurdinamaPrint({ data }: { data: SupurdinamaFormData }) {
  return (
    <>
    <style jsx global>{`
        .line {
          display: inline-block;
          border-bottom: 1px solid #000;
          min-width: 120px;
          margin: 0 5px;
          padding: 0 4px;
        }
        .long-line {
          display: inline-block;
          border-bottom: 1px solid #000;
          min-width: 300px;
          margin: 0 5px;
          padding: 0 4px;
        }
    `}</style>
    <div style={{ width: '800px', margin: '40px auto', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px', marginBottom: '20px' }}>
        (Part Three)<br/>Forest Department<br/>Custody Receipt
      </div>

      <div style={{ margin: '20px 0' }}>
        I, <span className="line">{data.custodianName}</span> caste <span className="line">{data.custodianCaste}</span> resident of <span className="line">{data.custodianResident}</span> Tehsil <span className="line">{data.custodianTehsil}</span> District <span className="line">{data.custodianDistrict}</span> declare:
        <div style={{ margin: '8px 0' }}>
          That the forest officer <span className="line">{data.officerName}</span> has handed me the following listed items today, dated <span className="line">{data.handoverDate ? new Date(data.handoverDate).toLocaleDateString() : ''}</span> month <span className="line">{data.handoverMonth}</span> year 20<span className="line">{data.handoverYear}</span>.
        </div>
        <div style={{ margin: '8px 0' }}>
          As per Section 52 of Indian Forest Act, 1927, I acknowledge receiving the items.
        </div>
        <div style={{ margin: '8px 0' }}>
          I assure that I will take proper care of them and produce them whenever demanded by the forest department or present in court.
        </div>
      </div>

      <div style={{ margin: '20px 0' }}>
        <strong>Detailed List of Items:</strong>
        <div style={{ borderBottom: '1px solid #000', minHeight: '80px', padding: '4px' }}>
          {data.itemsList}
        </div>
      </div>

      <div style={{ margin: '20px 0' }}>
        <div style={{ margin: '8px 0' }}>Date: <span className="line">{data.declarationDate ? new Date(data.declarationDate).toLocaleDateString() : ''}</span> Month: <span className="line">{data.declarationMonth}</span> Year: 20<span className="line">{data.declarationYear}</span></div>
        <div style={{ margin: '8px 0' }}>Name of Witness on whose behalf custody was given:</div>
        <div style={{ margin: '8px 0' }}>(1) <span className="line">{data.witness1}</span></div>
        <div style={{ margin: '8px 0' }}>(2) <span className="line">{data.witness2}</span></div>
      </div>

      <div style={{ marginTop: '40px' }}>
        Signature or Thumb Impression of Custodian: <span className="long-line">{data.custodianSignature}</span>
      </div>
    </div>
    </>
  );
}
