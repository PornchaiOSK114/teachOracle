/**
 * บอกสถานะการชำระเงินของ session หนึ่ง ให้หน้าขอบคุณเอาไปถามซ้ำเรื่อย ๆ
 *
 * มีไว้เพราะพร้อมเพย์จ่ายแบบหน่วงเวลาได้ ตอน Stripe เด้งลูกค้ากลับมาหน้าเว็บ
 * เงินอาจยังไม่เข้า หน้าขอบคุณจึงต้องถามซ้ำจนกว่าจะเข้า แล้วค่อยโชว์ปุ่มดาวน์โหลด
 *
 * ตอบเฉพาะข้อมูลที่จำเป็นต่อการแสดงผล ไม่คืนอีเมลหรือรายละเอียดอื่นของออเดอร์
 * เพราะรหัส session อยู่ใน URL ซึ่งอาจติดไปกับประวัติเบราว์เซอร์หรือถูกแชร์โดยไม่ตั้งใจ
 */
import { NextResponse } from 'next/server';
import { getProductById, getPurchaseBySession } from '@/lib/delivery/db';
import { POST_PAYMENT_GRACE_MINUTES } from '@/lib/delivery/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export type StatusResponse = {
  /** waiting = ยังไม่เห็นออเดอร์หรือเงินยังไม่เข้า */
  state: 'waiting' | 'ready' | 'failed' | 'expired';
  orderRef?: string;
  bookTitle?: string;
  quantity?: number;
};

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get('session');
  if (!sessionId) {
    return NextResponse.json({ error: 'คำขอไม่ถูกต้อง' }, { status: 400 });
  }

  const purchase = await getPurchaseBySession(sessionId);

  /*
   * ยังไม่มีในฐานข้อมูล = webhook ยังมาไม่ถึง
   * ปกติช้ากว่าการเด้งกลับหน้าเว็บแค่ไม่กี่วินาที ให้ฝั่งหน้าเว็บถามซ้ำ
   */
  if (!purchase) {
    return NextResponse.json({ state: 'waiting' } satisfies StatusResponse);
  }

  if (purchase.status === 'failed') {
    return NextResponse.json({ state: 'failed' } satisfies StatusResponse);
  }

  if (purchase.status !== 'paid' || !purchase.paid_at) {
    return NextResponse.json({ state: 'waiting' } satisfies StatusResponse);
  }

  const ageMinutes = (Date.now() - new Date(purchase.paid_at).getTime()) / 60_000;
  if (ageMinutes > POST_PAYMENT_GRACE_MINUTES) {
    return NextResponse.json({ state: 'expired' } satisfies StatusResponse);
  }

  const product = await getProductById(purchase.product_id);
  return NextResponse.json({
    state: 'ready',
    orderRef: purchase.order_ref,
    bookTitle: product?.title,
    quantity: purchase.quantity,
  } satisfies StatusResponse);
}
