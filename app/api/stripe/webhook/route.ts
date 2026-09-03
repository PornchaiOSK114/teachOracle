/**
 * รับสัญญาณจาก Stripe เมื่อมีการชำระเงิน
 *
 * นี่คือจุดเดียวที่ตัดสินว่า "ลูกค้าจ่ายเงินแล้วจริง" ห้ามตัดสินจากที่อื่น
 * เอกสารของ Stripe เตือนไว้ตรง ๆ ว่าห้ามส่งของโดยอาศัยหน้า success page อย่างเดียว
 * เพราะลูกค้าอาจจ่ายเงินสำเร็จแล้วเน็ตหลุดก่อนหน้านั้นจะโหลด
 *
 * event ที่ดัก
 *   checkout.session.completed          จบหน้าจ่ายเงิน (เงินอาจยังไม่เข้า)
 *   checkout.session.async_payment_succeeded  เงินเข้าจริงทีหลัง — เคสหลักของพร้อมเพย์
 *   checkout.session.async_payment_failed     จ่ายไม่สำเร็จทีหลัง
 */
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import {
  getProductByStripePrice,
  getPurchaseBySession,
  insertPurchase,
  markDeliveryEmailSent,
  markPaid,
  markStatus,
} from '@/lib/delivery/db';
import { sendDeliveryEmail } from '@/lib/delivery/mail';
import { isPaid, readSessionLineItem, stripeClient, verifyWebhook } from '@/lib/delivery/stripe';

/** ต้องเป็น nodejs เพราะการตรวจลายเซ็นและฐานข้อมูลใช้ API ฝั่ง Node */
export const runtime = 'nodejs';
/** ห้าม cache เด็ดขาด ทุก request คือเหตุการณ์ใหม่ */
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'missing signature' }, { status: 400 });
  }

  /*
   * ต้องอ่านเป็นข้อความดิบเท่านั้น ห้ามใช้ request.json()
   * เพราะลายเซ็นคำนวณจากไบต์ต้นฉบับ ถ้าแปลงเป็น object แล้วแปลงกลับ
   * ช่องว่างหรือลำดับ key อาจเปลี่ยน แล้วลายเซ็นจะไม่ตรงทั้งที่ของแท้
   */
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = await verifyWebhook(rawBody, signature);
  } catch (err) {
    console.error('[stripe-webhook] ลายเซ็นไม่ผ่าน', err);
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        await handleSession(event.data.object as Stripe.Checkout.Session, event.livemode);
        break;

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await markStatus(session.id, 'failed');
        break;
      }

      default:
        // event อื่นไม่เกี่ยวกับเรา ตอบ 200 ไปเพื่อไม่ให้ Stripe ส่งซ้ำเรื่อย ๆ
        break;
    }
  } catch (err) {
    console.error('[stripe-webhook] จัดการ event ไม่สำเร็จ', event.type, err);
    /*
     * ตอบ 500 เพื่อให้ Stripe ลองส่งใหม่
     * ปลอดภัยเพราะทุกขั้นตอนด้านล่างกันการทำซ้ำไว้แล้ว
     */
    return NextResponse.json({ error: 'handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleSession(session: Stripe.Checkout.Session, livemode: boolean) {
  const email =
    session.customer_details?.email ?? session.customer_email ?? null;
  if (!email) {
    console.error('[stripe-webhook] ไม่มีอีเมลใน session', session.id);
    return;
  }

  const stripe = stripeClient(livemode);
  const lineItem = await readSessionLineItem(stripe, session.id);
  if (!lineItem) {
    console.error('[stripe-webhook] อ่าน line item ไม่ได้', session.id);
    return;
  }

  const product = await getProductByStripePrice(lineItem.priceId, livemode);
  if (!product) {
    console.error(
      '[stripe-webhook] ไม่รู้จักรหัสราคานี้',
      lineItem.priceId,
      livemode ? '(live)' : '(test)',
    );
    return;
  }

  const paid = isPaid(session);
  const existing = await getPurchaseBySession(session.id);

  /* ครั้งแรกที่เห็น session นี้ */
  if (!existing) {
    const created = await insertPurchase({
      stripeSessionId: session.id,
      livemode,
      productId: product.id,
      email,
      quantity: lineItem.quantity,
      amountTotal: session.amount_total ?? null,
      currency: session.currency ?? null,
      status: paid ? 'paid' : 'pending',
      paidAt: paid ? new Date() : null,
    });

    /*
     * created เป็น null แปลว่ามี webhook อีกตัวชิงบันทึกไปแล้วในเสี้ยววินาทีเดียวกัน
     * ปล่อยให้ตัวนั้นเป็นคนส่งอีเมล เราถอยออกมาเงียบ ๆ
     */
    if (!created) return;

    if (paid) {
      await sendDeliveryEmail({
        to: created.email,
        orderRef: created.order_ref,
        bookTitle: product.title,
        quantity: created.quantity,
        downloadLimit: created.download_limit,
      });
      await markDeliveryEmailSent(created.id);
    }
    return;
  }

  /* เคยเห็นแล้ว — เส้นทางนี้มาได้สองแบบ: พร้อมเพย์จ่ายช้า หรือ Stripe ส่ง event ซ้ำ */
  if (!paid) return;

  const updated = await markPaid(session.id, new Date());

  /*
   * updated เป็น null แปลว่าสถานะเป็น paid อยู่ก่อนแล้ว
   * ⚠️ ห้ามถือว่า "จ่ายแล้ว" เท่ากับ "ส่งอีเมลแล้ว"
   * ถ้ารอบก่อนอีเมลล้มกลางทาง เราตอบ 500 ให้ Stripe ส่งซ้ำ แล้วมาโผล่ตรงนี้
   * ตัวที่ตัดสินว่าต้องส่งหรือไม่คือ delivery_email_sent_at ไม่ใช่สถานะการจ่ายเงิน
   */
  const purchase = updated ?? existing;
  if (purchase.delivery_email_sent_at) return;

  await sendDeliveryEmail({
    to: purchase.email,
    orderRef: purchase.order_ref,
    bookTitle: product.title,
    quantity: purchase.quantity,
    downloadLimit: purchase.download_limit,
  });
  await markDeliveryEmailSent(purchase.id);
}
