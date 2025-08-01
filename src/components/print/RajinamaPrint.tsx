"use client";

import { RajinamaFormData } from "@/lib/types";

export default function RajinamaPrint({ data }: { data: RajinamaFormData }) {
  return (
    <>
    <style jsx global>{`
        .line {
          display: inline-block;
          border-bottom: 1px solid #000;
          min-width: 100px;
          margin: 0 4px;
          padding: 0 4px;
        }
        .long-line {
          display: inline-block;
          border-bottom: 1px solid #000;
          min-width: 300px;
          margin: 0 4px;
          padding: 0 4px;
        }
    `}</style>
    <div style={{ width: '800px', margin: '40px auto', fontFamily: 'Arial, sans-serif', fontSize: '14px', position: 'relative' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
        Forest Department<br/>Resignation Declaration
      </div>

      <div style={{ margin: '20px 0' }}>
        Based on my/our investigation in the forest:
        <div style={{ margin: '8px 0' }}>(1) <span className="line">{data.declarant1Name}</span> Name <span className="line">{data.declarant1Caste}</span> Caste <span className="line">{data.declarant1Resident}</span> Resident of <span className="line"></span></div>
        <div style={{ margin: '8px 0' }}>(2) <span className="line">{data.declarant2Name}</span> Name <span className="line">{data.declarant2Caste}</span> Caste <span className="line">{data.declarant2Resident}</span> Resident of <span className="line"></span></div>
        <div style={{ margin: '8px 0' }}>(3) <span className="line">{data.declarant3Name}</span> Name <span className="line">{data.declarant3Caste}</span> Caste <span className="line">{data.declarant3Resident}</span> Resident of <span className="line"></span></div>
        <div style={{ margin: '8px 0' }}>(4) <span className="line">{data.declarant4Name}</span> Name <span className="line">{data.declarant4Caste}</span> Caste <span className="line">{data.declarant4Resident}</span> Resident of <span className="line"></span></div>
        <div style={{ margin: '8px 0' }}>(5) <span className="line">{data.declarant5Name}</span> Name <span className="line">{data.declarant5Caste}</span> Caste <span className="line">{data.declarant5Resident}</span> Resident of <span className="line"></span></div>

        <div style={{ margin: '8px 0' }}>Regarding forest-related suspect: <span className="long-line">{data.suspectInfo}</span></div>
        <div style={{ margin: '8px 0' }}>Is suspected of wrongdoing.</div>
      </div>

      <div style={{ margin: '20px 0' }}>
        We want the resignation of the above-named suspect (suspect in custody / under Indian Forest Act 1927, Section 68 etc.). Therefore, we / I declare this in writing.
        <br/>We do not want any financial compensation over ₹500. This form is not influenced or forced by any official.
        <br/>We will not object to legal proceedings later against this suspect.
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <div style={{ width: '45%' }}>
          <div>Date: <span className="line">{data.declarationDate ? new Date(data.declarationDate).toLocaleDateString() : ''}</span></div>
          <div>Year: 20<span className="line">{data.declarationYear}</span></div>
          <div>Signature of Declarant: <span className="line">{data.declarantSignature}</span></div>
        </div>
        <div style={{ width: '45%' }}>
          <div>Witness Signatures / Thumb Impressions:</div>
          <div>(1) <span className="line">{data.witness1}</span></div>
          <div>(2) <span className="line">{data.witness2}</span></div>
          <div>(3) <span className="line">{data.witness3}</span></div>
          <div>(4) <span className="line">{data.witness4}</span></div>
          <div>(5) <span className="line">{data.witness5}</span></div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <strong>Certificate of Verification:</strong>
        <br/>
        I certify that the above persons gave this resignation voluntarily before me.
        <br/><br/>
        Date: <span className="line">{data.verificationDate ? new Date(data.verificationDate).toLocaleDateString() : ''}</span> Year: 20<span className="line">{data.verificationYear}</span> Officer's Signature <span className="line">{data.verifyingOfficerSignature}</span>

        <ul style={{ marginLeft: '20px', marginTop: '20px' }}>
          <li>Strike out the statement not applicable to Chhattisgarh context.</li>
          <li>If the forest land is in question, write clearly in the note below.</li>
          <li>Include the name of the concerned government forest range.</li>
        </ul>
      </div>
    </div>
    </>
  );
}
