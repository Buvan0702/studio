"use client";

import { JabtinamaFormData } from "@/lib/types";

export default function JabtinamaPrint({ data }: { data: JabtinamaFormData }) {
  return (
    <div style={{ width: '1000px', margin: '40px auto', fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
        Seizure Record - Forest Department under Section 52 of Forest Act 1927
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Date and Time</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Place of Offense</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Name and Designation of Officer</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Name of Accused or his Representative</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Details of Confiscated Property</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Caste of Accused</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Witness Name & Father’s Name</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Name of Custodian & Father’s Name</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Species Description</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Species</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Quantity</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Length</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Girth</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Rate</th>
          <th style={{ border: '1px solid black', padding: '4px', textAlign: 'center' }}>Total Value</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td style={{ border: '1px solid black', padding: '4px', height: '50px' }}>{data.dateTime ? new Date(data.dateTime).toLocaleString() : ''}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.placeOfOffense}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.officerName}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.accusedName}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.confiscatedProperty}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.accusedCaste}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.witnessName}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.custodianName}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.speciesDescription}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.species}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.quantity}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.length}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.girth}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.rate}</td>
          <td style={{ border: '1px solid black', padding: '4px' }}>{data.totalValue}</td>
        </tr>
        </tbody>
      </table>

      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '48%' }}>
          Signature of Accused: <span style={{ display: 'inline-block', borderBottom: '1px solid #000', minWidth: '150px' }}>{data.accusedSignature}</span>
        </div>
        <div style={{ width: '48%', textAlign: 'right' }}>
          Signature of Investigating Officer: <span style={{ display: 'inline-block', borderBottom: '1px solid #000', minWidth: '150px' }}>{data.officerSignature}</span>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <strong>Witness Signatures:</strong>
        <div>(1) <span style={{ display: 'inline-block', borderBottom: '1px solid #000', minWidth: '200px' }}>{data.witness1}</span></div>
        <div>(2) <span style={{ display: 'inline-block', borderBottom: '1px solid #000', minWidth: '200px' }}>{data.witness2}</span></div>
        <div>(3) <span style={{ display: 'inline-block', borderBottom: '1px solid #000', minWidth: '200px' }}>{data.witness3}</span></div>
        <div>(4) <span style={{ display: 'inline-block', borderBottom: '1px solid #000', minWidth: '200px' }}>{data.witness4}</span></div>
      </div>
    </div>
  );
}
