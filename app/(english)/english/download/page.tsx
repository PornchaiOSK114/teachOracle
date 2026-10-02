import { languageAlternates } from '@/lib/i18n';
/**
 * หน้ารับหนังสือ — teedba.com/download
 *
 * เป็นหน้ากลาง ไม่ใช่ลิงก์ลับต่อออเดอร์ ลูกค้าจำแค่ชื่อหน้านี้ก็พอ
 * ลบอีเมลทิ้งแล้วก็ยังกลับมาเองได้
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import DownloadClient from './DownloadClient';
import { site } from '@/lib/site-en';

export const metadata: Metadata = {
  title: 'Download your book',
  description:
    'Download your purchased Thai-language eBook. Use your purchase email to request a verification code.',
  alternates: languageAlternates('/english/download'),
  /* หน้านี้ไม่มีประโยชน์กับคนที่ยังไม่ได้ซื้อ และไม่ควรอยู่ในผลค้นหา */
  robots: { index: false, follow: false },
};

export default function DownloadPage() {
  return (
    <section className="container-prose section" style={{ maxWidth: 620 }}>
      <h1 className="h1-page" style={{ margin: '0 0 10px' }}>
        Download your book
      </h1>
      <p className="muted" style={{ margin: '0 0 26px', lineHeight: 1.7 }}>
        Enter your purchase email to receive a six-digit verification code. The eBook file is in Thai.
      </p>

      <DownloadClient />

      <p className="muted" style={{ marginTop: 28, fontSize: 14, lineHeight: 1.75 }}>
        Entered the wrong email at checkout, or need help? Contact {' '}
        <a href={`mailto:${'pornchai.krong@gmail.com'}`}>pornchai.krong@gmail.com</a> or{' '}
        <Link href="/english/contact">Contact</Link>
      </p>
      <p className="muted" style={{ marginTop: 10, fontSize: 14 }}>
        Not purchased yet? See  <Link href="/english/products">Products</Link> ·{' '}
        <a href={site.url}>{site.url.replace('https://', '')}</a>
      </p>
    </section>
  );
}
