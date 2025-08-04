"use client";

import { PorFormData } from "@/lib/types";

const Column = ({ data, part, col3 = false }: { data: PorFormData, part: string, col3?: boolean }) => {
    const reportDate = data.date ? new Date(data.date) : null;
    const dateStr = reportDate ? reportDate.toLocaleDateString() : '';
    const monthStr = reportDate ? reportDate.toLocaleString('default', { month: 'long' }) : '';
    const yearStr = reportDate ? reportDate.getFullYear().toString().substring(2) : '';

    return (
    <div style={{
      position: 'absolute',
      top: 0,
      width: '33.33%',
      height: '100%',
      borderRight: col3 ? 'none' : '1px solid black',
      padding: '10px',
      boxSizing: 'border-box',
      left: col3 ? '66.66%' : (part === 'col1' ? '0' : '33.33%')
    }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '5px' }}>(Part One)</div>
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '5px' }}>Forest Department, Chhattisgarh</div>
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '5px' }}>Preliminary Offense Report</div>

      <div style={{ margin: '6px 0' }}>Book No. <span className="underline">{data.bookNo}</span> Page No. <span className="underline">{data.pageNo}</span></div>
      <div style={{ margin: '6px 0' }}>1. Report No. <span className="underline">{data.reportNo}</span> Date <span className="underline">{dateStr}</span> Month <span className="underline">{monthStr}</span> Year 20<span className="underline">{yearStr}</span></div>
      <div style={{ margin: '6px 0' }}>2. Name of accused, father's name, caste and address</div>
      <div className="field-line" style={{height: '36px'}}>{data.accusedInfo}</div>
      <div style={{ margin: '6px 0' }}>3. Type of offense and relevant section</div>
      <div className="field-line">{data.offenseType}</div>
      <div style={{ margin: '6px 0' }}>4. Place of offense</div>
      <div className="field-line">{data.placeOfOffense}</div>
      <div style={{ margin: '6px 0' }}>5. Date of offense</div>
      <div className="field-line">{data.dateOfOffense ? new Date(data.dateOfOffense).toLocaleDateString() : ''}</div>
      <div style={{ margin: '6px 0' }}>6. Seized goods and action taken</div>
      <div className="field-line" style={{height: '36px'}}>{data.seizedGoods}</div>
      <div style={{ margin: '6px 0' }}>7. Names of witnesses</div>
      <div className="field-line" style={{height: '36px'}}>{data.witnesses}</div>

      <div style={{ position: 'absolute', bottom: '80px', width: '90%' }}>
        {!col3 && <div>Second part sent to Assistant <span className="underline">{data.sentToAssistant}</span> (Range sent to)</div>}
        <div>Third part sent to Officer <span className="underline">{data.sentToOfficer}</span> (Division sent to)</div>
        <div>Place: <span className="underline">{data.place}</span>   Signature of Forest Guard</div>
        <div>Date: <span className="underline">{data.signatureDate ? new Date(data.signatureDate).toLocaleDateString() : ''}</span>   Area: <span className="underline">{data.area}</span></div>
        {col3 && <>
          <div>4.4.3. Sent to Forest Circle</div>
          <div>Forwarding Officer: <span className="underline">{data.forwardingOfficer}</span></div>
        </>}
      </div>

      <div style={{ position: 'absolute', bottom: '10px', fontSize: '11px', width: '100%', textAlign: 'left' }}>
        Note: This report must be sent to the senior officer within 48 hours of detection of the offense.
      </div>
    </div>
    )
};


export default function PorPrint({ data }: { data: PorFormData }) {
  return (
    <>
    <style jsx global>{`
        .field-line {
          margin: 6px 0;
          border-bottom: 1px dotted #000;
          min-height: 14px;
          padding-left: 4px;
        }
        .underline {
            display: inline-block;
            border-bottom: 1px dotted #000;
            padding: 0 4px;
        }
    `}</style>
    <div style={{
        position: 'relative',
        width: '1100px',
        height: '780px',
        margin: '20px auto',
        border: '1px solid black',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
    }}>
        <Column data={data} part="col1" />
        <Column data={data} part="col2" />
        <Column data={data} part="col3" col3={true} />
    </div>
    </>
  );
}
