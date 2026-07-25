import { ImageResponse } from 'next/og';

export const alt = 'อาจารย์ตี๋ที่สอน Oracle — Oracle Database Expert';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * รูป OG 1200×630 สำหรับแชร์บน Facebook / LINE / X
 *
 * หมายเหตุ: ฟอนต์เริ่มต้นของ next/og ไม่มีสระ/พยัญชนะไทย ถ้าไม่โหลดฟอนต์ไทยมาก่อน
 * ตัวอักษรไทยจะกลายเป็นกล่องว่าง — จึงดึง IBM Plex Sans Thai จาก Google Fonts
 * และถ้าดึงไม่สำเร็จ จะ fallback เป็นเวอร์ชันอักษรละตินแทน (ไม่ทำให้ build พัง)
 */
async function loadThaiFont(): Promise<ArrayBuffer | null> {
  try {
    const cssRes = await fetch(
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@700&display=swap',
      { headers: { 'User-Agent': 'Mozilla/5.0' } },
    );
    if (!cssRes.ok) return null;
    const css = await cssRes.text();
    const url = /src:\s*url\((https:\/\/[^)]+\.(?:woff2|ttf))\)/.exec(css)?.[1];
    if (!url) return null;
    const fontRes = await fetch(url);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const thaiFont = await loadThaiFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#12151b',
          backgroundImage:
            'radial-gradient(900px 500px at 85% -10%, rgba(224,113,95,0.28), transparent 60%)',
          color: '#e9ebef',
          fontFamily: thaiFont ? 'PlexThai' : 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#b0271a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            DB
          </div>
          <div style={{ fontSize: 26, color: '#b9c0cc', letterSpacing: '0.02em' }}>
            {thaiFont ? 'อาจารย์ตี๋ที่สอน Oracle' : 'AJARN TEE — Oracle Database'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            {thaiFont ? 'สอนด้วยประสบการณ์' : 'Teaching Oracle Database'}
          </div>
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.15, color: '#e0715f' }}>
            {thaiFont ? 'Oracle Database มากกว่า 20 ปี' : 'for more than 20 years'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 40, fontSize: 24, color: '#98a1ad' }}>
          <span>20+ {thaiFont ? 'ปีประสบการณ์' : 'years experience'}</span>
          <span>·</span>
          <span>Oracle Certified Professional</span>
          <span>·</span>
          <span>{thaiFont ? '6 หลักสูตร' : '6 courses'}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: thaiFont
        ? [{ name: 'PlexThai', data: thaiFont, weight: 700 as const, style: 'normal' as const }]
        : undefined,
    },
  );
}
