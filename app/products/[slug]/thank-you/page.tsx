/**
 * หน้าขอบคุณหลังชำระเงิน — ปลายทางที่ Stripe เด้งลูกค้ากลับมา
 *
 * ⚠️ หน้านี้ห้ามตัดสินใจเองว่าจ่ายเงินแล้วหรือยัง ต้องถามฐานข้อมูลซึ่งรู้จาก webhook เท่านั้น
 *    (เอกสาร Stripe เตือนไว้ตรง ๆ ว่าห้ามส่งของโดยอาศัยหน้า success page อย่างเดียว)
 *
 * URL ที่ตั้งไว้ใน Stripe จะเป็นแบบนี้
 *   https://teedba.com/products/oracle-26-ai-sql-tuning/thank-you?session_id={CHECKOUT_SESSION_ID}
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct, products } from '@/lib/site';
import ThankYouClient from './ThankYouClient';

export const metadata: Metadata = {
  title: 'ขอบคุณสำหรับการสั่งซื้อ',
  /* หน้านี้ไม่ควรอยู่ในผลค้นหา และไม่มีประโยชน์กับคนที่ยังไม่ได้ซื้อ */
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

/** ⚠️ Next 16: ทั้ง params และ searchParams เป็น Promise ต้อง await ก่อนใช้ */
export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { slug } = await params;
  const { session_id: sessionId } = await searchParams;

  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <section className="container-prose section" style={{ maxWidth: 620 }}>
      <p className="crumb muted">
        <Link href="/products">ผลิตภัณฑ์</Link> <span aria-hidden="true">/</span>{' '}
        <Link href={`/products/${product.slug}`}>{product.title}</Link>{' '}
        <span aria-hidden="true">/</span> ขอบคุณ
      </p>

      <h1 className="h1-page" style={{ margin: '0 0 10px' }}>
        ขอบคุณที่สั่งซื้อครับ
      </h1>
      <p className="muted" style={{ margin: '0 0 26px', lineHeight: 1.7 }}>
        {product.title}
      </p>

      {sessionId ? (
        <ThankYouClient sessionId={sessionId} />
      ) : (
        <div className="dl-box">
          <p style={{ margin: '0 0 18px', lineHeight: 1.7 }}>
            หน้านี้เปิดตรงไม่ได้ครับ ถ้าคุณสั่งซื้อแล้ว ไปดาวน์โหลดที่หน้ารับหนังสือได้เลย
          </p>
          <Link className="btn btn-primary dl-submit" href="/download">
            ไปหน้ารับหนังสือ
          </Link>
        </div>
      )}

      <p className="muted" style={{ marginTop: 28, fontSize: 14, lineHeight: 1.75 }}>
        ติดปัญหาตรงไหน ติดต่อ <a href="mailto:pornchai.krong@gmail.com">pornchai.krong@gmail.com</a>{' '}
        หรือ <Link href="/contact">หน้าติดต่อ</Link> ได้เลยครับ
      </p>
    </section>
  );
}
