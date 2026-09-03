/**
 * หน้ารับหนังสือ — teedba.com/download
 *
 * เป็นหน้ากลาง ไม่ใช่ลิงก์ลับต่อออเดอร์ ลูกค้าจำแค่ชื่อหน้านี้ก็พอ
 * ลบอีเมลทิ้งแล้วก็ยังกลับมาเองได้
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import DownloadClient from './DownloadClient';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'รับหนังสือที่สั่งซื้อ',
  description:
    'หน้าดาวน์โหลดหนังสือสำหรับผู้ที่สั่งซื้อแล้ว กรอกอีเมลที่ใช้ตอนสั่งซื้อเพื่อรับรหัสยืนยัน',
  alternates: { canonical: '/download' },
  /* หน้านี้ไม่มีประโยชน์กับคนที่ยังไม่ได้ซื้อ และไม่ควรอยู่ในผลค้นหา */
  robots: { index: false, follow: false },
};

export default function DownloadPage() {
  return (
    <section className="container-prose section" style={{ maxWidth: 620 }}>
      <h1 className="h1-page" style={{ margin: '0 0 10px' }}>
        รับหนังสือที่สั่งซื้อ
      </h1>
      <p className="muted" style={{ margin: '0 0 26px', lineHeight: 1.7 }}>
        กรอกอีเมลที่คุณใช้ตอนสั่งซื้อ ผมจะส่งรหัส 6 หลักไปให้ เอารหัสมากรอกก็ดาวน์โหลดได้เลย
      </p>

      <DownloadClient />

      <p className="muted" style={{ marginTop: 28, fontSize: 14, lineHeight: 1.75 }}>
        กรอกอีเมลผิดตอนสั่งซื้อ หรือติดปัญหาอื่น ติดต่อ{' '}
        <a href={`mailto:${'pornchai.krong@gmail.com'}`}>pornchai.krong@gmail.com</a> หรือ{' '}
        <Link href="/contact">หน้าติดต่อ</Link> ได้เลยครับ
      </p>
      <p className="muted" style={{ marginTop: 10, fontSize: 14 }}>
        ยังไม่ได้ซื้อ ดูรายละเอียดหนังสือได้ที่ <Link href="/products">หน้าผลิตภัณฑ์</Link> ·{' '}
        <a href={site.url}>{site.url.replace('https://', '')}</a>
      </p>
    </section>
  );
}
