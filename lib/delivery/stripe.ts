/**
 * ตัวเชื่อมกับ Stripe
 *
 * ⚠️ ไฟล์นี้เป็นของฝั่ง server เท่านั้น ห้าม client component import
 *
 * ทำไมต้องรองรับสองโหมดพร้อมกัน
 * sandbox กับ live ของ Stripe เป็นคนละโลก คนละกุญแจ คนละรหัสสินค้า
 * ถ้าใช้ตัวแปรชุดเดียวแล้วสลับค่าไปมาตอนทดสอบ จะมีจังหวะที่เว็บจริงถือกุญแจทดสอบอยู่
 * ซึ่งแปลว่าลูกค้าจริงจ่ายเงินแล้วระบบมองไม่เห็น เราจึงถือกุญแจทั้งสองชุดไว้พร้อมกัน
 * แล้วให้ตัว event ที่ Stripe ส่งมาเป็นคนบอกเองว่าอยู่โหมดไหน
 */
import Stripe from 'stripe';
import { optionalEnv, requireEnv } from './config';

/** ได้ client ที่ถือกุญแจตรงกับโหมดของ event */
export function stripeClient(livemode: boolean): Stripe {
  const key = livemode
    ? requireEnv('STRIPE_SECRET_KEY')
    : requireEnv('STRIPE_SECRET_KEY_TEST');
  return new Stripe(key);
}

/**
 * ตรวจลายเซ็นของ webhook
 *
 * ⚠️ ห้ามข้ามขั้นตอนนี้เด็ดขาด ถ้าไม่ตรวจลายเซ็น ใครก็ยิง request ปลอมมาที่
 * endpoint ของเราแล้วบอกว่า "จ่ายเงินแล้ว" เพื่อเอาหนังสือไปฟรีได้
 *
 * เราไม่รู้ล่วงหน้าว่า event มาจากโหมดไหน จึงลองกุญแจ live ก่อน ถ้าไม่ผ่านค่อยลอง test
 * การลองผิดไม่มีผลข้างเคียงใด ๆ เพราะเป็นแค่การคำนวณแฮชเทียบกัน
 */
export async function verifyWebhook(
  rawBody: string,
  signature: string,
): Promise<Stripe.Event> {
  const liveSecret = optionalEnv('STRIPE_WEBHOOK_SECRET');
  const testSecret = optionalEnv('STRIPE_WEBHOOK_SECRET_TEST');

  if (!liveSecret && !testSecret) {
    throw new Error(
      'ยังไม่ได้ตั้ง STRIPE_WEBHOOK_SECRET หรือ STRIPE_WEBHOOK_SECRET_TEST ที่ Vercel',
    );
  }

  // ไม่มี client ที่ผูกโหมดตอนนี้ ใช้ตัวไหนก็ได้เพราะ constructEvent ไม่แตะ API key
  const stripe = new Stripe(
    optionalEnv('STRIPE_SECRET_KEY') ?? optionalEnv('STRIPE_SECRET_KEY_TEST') ?? 'sk_placeholder',
  );

  const errors: string[] = [];
  for (const secret of [liveSecret, testSecret]) {
    if (!secret) continue;
    try {
      return await stripe.webhooks.constructEventAsync(rawBody, signature, secret);
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }
  throw new Error(`ลายเซ็น webhook ไม่ผ่านทั้งสองโหมด: ${errors.join(' | ')}`);
}

/**
 * ดึงรหัสราคาและจำนวนที่ลูกค้าสั่งจริงจาก Checkout Session
 *
 * ⚠️ ต้องอ่านจาก line_items เท่านั้น ห้ามเชื่อค่าที่ส่งมากับ URL หรือที่หน้าเว็บบอก
 * เพราะช่องปรับจำนวนอยู่บนหน้าจ่ายเงินของ Stripe ลูกค้าเปลี่ยนได้ถึงวินาทีสุดท้าย
 * แหล่งความจริงเดียวคือสิ่งที่ Stripe บันทึกว่าเก็บเงินไปเท่าไร
 */
export async function readSessionLineItem(
  stripe: Stripe,
  sessionId: string,
): Promise<{ priceId: string; quantity: number } | null> {
  const items = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 1 });
  const first = items.data[0];
  if (!first?.price?.id) return null;
  return { priceId: first.price.id, quantity: first.quantity ?? 1 };
}

/**
 * เงินเข้าจริงหรือยัง
 *
 * ⚠️ `status: 'complete'` ไม่ได้แปลว่าเงินเข้า มันแปลว่าลูกค้าเดินจนจบหน้าจ่ายเงินแล้วเท่านั้น
 * พร้อมเพย์เป็นวิธีจ่ายแบบลูกค้ากดยืนยันเอง มีโอกาสที่ Stripe เด้งลูกค้ากลับมาหน้าเว็บ
 * ก่อนที่เงินจะเข้าจริง ถ้าเราดูแค่ status แล้วปล่อยไฟล์ เท่ากับแจกฟรี
 * ตัวที่ต้องดูคือ payment_status
 *
 * `no_payment_required` คือเคสยอดเป็นศูนย์ เกิดได้ถ้าวันหลังออกโค้ดส่วนลด 100%
 * ต้องนับว่าจ่ายแล้วด้วย ไม่งั้นคนที่ได้โค้ดฟรีจะไม่ได้รับหนังสือ
 */
export function isPaid(session: Stripe.Checkout.Session): boolean {
  return session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
}
