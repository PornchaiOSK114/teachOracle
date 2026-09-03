/**
 * เครื่องมือประทับ watermark ด้วยมือ — teedba.com/admin/stamp
 *
 * ใช้กับคนที่ไม่ได้ซื้อผ่าน Stripe เช่น แจกให้คนรีวิว ขายหน้างานอบรม หรือรับโอนตรง
 * ไม่ต้องแนบไฟล์ต้นฉบับทุกครั้ง เพราะเซิร์ฟเวอร์หยิบจาก Vercel Blob ให้เอง
 *
 * ด่านรหัสผ่านอยู่ที่ฝั่ง API ไม่ใช่ที่หน้านี้ หน้านี้เป็นแค่ฟอร์มเปล่า ๆ
 * ใครเปิดเจอก็ทำอะไรไม่ได้ถ้าไม่มีรหัส
 */
import type { Metadata } from 'next';
import { getProductById } from '@/lib/delivery/db';
import { products as siteProducts } from '@/lib/site';
import StampClient from './StampClient';

export const metadata: Metadata = {
  title: 'ประทับ watermark ด้วยมือ',
  robots: { index: false, follow: false },
};

/** ห้าม prerender ตอน build เพราะต้องอ่านฐานข้อมูลตอนใช้งานจริง */
export const dynamic = 'force-dynamic';

export default async function AdminStampPage() {
  /*
   * ดึงรายชื่อหนังสือจากฐานข้อมูล ไม่ใช่จาก lib/site.ts
   * เพราะฐานข้อมูลคือที่ที่บอกว่าไฟล์ไหนอยู่ตรงไหนใน Blob
   * ถ้าสองที่ไม่ตรงกัน อันที่ถูกคือฐานข้อมูล
   */
  const options: { id: string; title: string }[] = [];
  let dbError = '';

  try {
    for (const p of siteProducts) {
      const row = await getProductById(p.slug);
      if (row) options.push({ id: row.id, title: row.title });
    }
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }

  return (
    <section className="container-prose section" style={{ maxWidth: 620 }}>
      <h1 className="h1-page" style={{ margin: '0 0 10px' }}>
        ประทับ watermark ด้วยมือ
      </h1>
      <p className="muted" style={{ margin: '0 0 26px', lineHeight: 1.7 }}>
        สำหรับคนที่ไม่ได้ซื้อผ่านเว็บ เช่น แจกให้คนรีวิว ขายหน้างานอบรม หรือรับโอนตรง
        ไฟล์ที่ได้จะประทับเหมือนกับที่ลูกค้าซื้อผ่านเว็บทุกอย่าง
      </p>

      {dbError ? (
        <div className="dl-box">
          <p style={{ margin: '0 0 10px', lineHeight: 1.7 }}>
            เชื่อมต่อฐานข้อมูลไม่ได้ครับ ตรวจว่าตั้งค่า <code>DATABASE_URL</code> ที่ Vercel แล้ว
            และรัน <code>db/schema.sql</code> ใน Neon แล้ว
          </p>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            {dbError}
          </p>
        </div>
      ) : options.length === 0 ? (
        <div className="dl-box">
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            ยังไม่มีสินค้าในฐานข้อมูล ให้รัน <code>db/schema.sql</code> ใน Neon ก่อน
          </p>
        </div>
      ) : (
        <StampClient products={options} />
      )}

      <p className="muted" style={{ marginTop: 26, fontSize: 14, lineHeight: 1.75 }}>
        ถ้าลูกค้าที่ซื้อผ่านเว็บติดปัญหา อย่าใช้หน้านี้ครับ วิธีที่ถูกคือรีเซ็ตโควตา
        หรือแก้อีเมลของออเดอร์ให้เขาโหลดเองได้จากหน้ารับหนังสือตามปกติ
      </p>
    </section>
  );
}
