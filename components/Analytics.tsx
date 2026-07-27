import Script from 'next/script';

/**
 * Cloudflare Web Analytics — สถิติการเข้าชม
 *
 * ทำไมต้องใส่สคริปต์เอง (ไม่ใช้ "automatic setup" ของ Cloudflare):
 * Cloudflare จะฉีดสคริปต์ให้อัตโนมัติได้เฉพาะเว็บที่วิ่งผ่าน proxy ของ Cloudflare (เมฆสีส้ม)
 * แต่ DNS ของเราตั้งเป็น "DNS only" ตามที่ Vercel กำหนด traffic จึงไม่ผ่าน Cloudflare
 * ⇒ ต้องติดตั้งแบบ JS Snippet เองที่นี่
 *
 * จุดเด่น: ไม่ใช้ cookie และไม่เก็บข้อมูลระบุตัวบุคคล
 * จึงไม่ต้องขึ้นแบนเนอร์ขอความยินยอมตาม PDPA
 *
 * token ไม่ใช่ความลับ (ปรากฏใน HTML ของทุกเว็บที่ใช้บริการนี้อยู่แล้ว)
 * แต่เก็บเป็น env var เพื่อให้เปลี่ยนได้โดยไม่ต้องแก้โค้ด และปิดได้ตอน dev
 */
export default function Analytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

  // ไม่ตั้ง token = ไม่โหลดสคริปต์ (เช่น ตอน npm run dev จะได้ไม่ปนสถิติจริง)
  if (!token) return null;

  return (
    <Script
      id="cf-web-analytics"
      strategy="afterInteractive"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
