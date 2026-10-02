import { ImageResponse } from 'next/og';
const size = { width: 1200, height: 630 };
export function GET() {
 return new ImageResponse(<div style={{ display: 'flex', width: '100%', height: '100%', background: '#12151b', color: '#e9ebef', padding: 80, flexDirection: 'column', justifyContent: 'space-between' }}>
  <div style={{ fontSize: 32 }}>teeDBA · Oracle with Tee</div>
  <div style={{ fontSize: 68, lineHeight: 1.15 }}>Practical Oracle Database knowledge</div>
  <div style={{ fontSize: 27, color: '#e0715f' }}>20+ years of experience · Oracle Certified Professional</div>
 </div>, size);
}
