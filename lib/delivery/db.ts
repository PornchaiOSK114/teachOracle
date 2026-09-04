/**
 * การเชื่อมต่อและคำสั่งฐานข้อมูลทั้งหมดของระบบส่งมอบ E-Book
 *
 * ⚠️ ไฟล์นี้เป็นของฝั่ง server เท่านั้น ห้าม client component import
 *
 * ใช้ Neon ผ่าน HTTP (แพ็กเกจ @neondatabase/serverless) ไม่ใช่ TCP
 * เหตุผล: ฟังก์ชันบน Vercel เกิดใหม่ตายเร็ว การเปิด connection pool แบบเดิม
 * จะทำให้ connection ค้างเต็มโควตาอย่างรวดเร็ว การคุยผ่าน HTTP ไม่มีปัญหานี้
 *
 * โครงตารางอยู่ที่ db/schema.sql — แก้ที่นั่นแล้วรันใน Neon เอง ไม่มี migration tool
 */
import { neon } from '@neondatabase/serverless';
import { requireEnv, OTP } from './config';

function db() {
  return neon(requireEnv('DATABASE_URL'));
}

/** ทำให้อีเมลเป็นรูปแบบเดียวกันเสมอ ไม่งั้น A@x.com กับ a@x.com จะกลายเป็นคนละคน */
export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/* ============================================================
   สินค้า
   ============================================================ */

export type Product = {
  id: string;
  title: string;
  file_name: string;
  blob_pathname: string;
  order_ref_prefix: string;
  download_limit: number;
  watermark_skip_first_page: boolean;
};

export async function getProductById(id: string): Promise<Product | null> {
  const rows = (await db()`
    SELECT id, title, file_name, blob_pathname, order_ref_prefix,
           download_limit, watermark_skip_first_page
    FROM product WHERE id = ${id} AND active = true
  `) as Product[];
  return rows[0] ?? null;
}

/**
 * หาสินค้าจากรหัสราคาของ Stripe
 * ต้องแยกตามโหมด เพราะ sandbox กับ live เป็นคนละโลก รหัสราคาคนละชุด
 */
export async function getProductByStripePrice(
  priceId: string,
  livemode: boolean,
): Promise<Product | null> {
  const rows = livemode
    ? ((await db()`
        SELECT id, title, file_name, blob_pathname, order_ref_prefix,
               download_limit, watermark_skip_first_page
        FROM product WHERE stripe_price_id = ${priceId} AND active = true
      `) as Product[])
    : ((await db()`
        SELECT id, title, file_name, blob_pathname, order_ref_prefix,
               download_limit, watermark_skip_first_page
        FROM product WHERE stripe_price_id_test = ${priceId} AND active = true
      `) as Product[]);
  return rows[0] ?? null;
}

/* ============================================================
   การซื้อ
   ============================================================ */

export type PurchaseStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type Purchase = {
  id: number;
  order_ref: string;
  stripe_session_id: string;
  livemode: boolean;
  product_id: string;
  email: string;
  quantity: number;
  amount_total: number | null;
  currency: string | null;
  status: PurchaseStatus;
  downloads_used: number;
  download_limit: number;
  paid_at: string | null;
  /** เวลาที่ส่งอีเมลส่งมอบสำเร็จจริง — null = ยังไม่เคยส่งสำเร็จ */
  delivery_email_sent_at: string | null;
  created_at: string;
};

/**
 * บันทึกออเดอร์ใหม่
 *
 * ⚠️ หัวใจของการกัน webhook ยิงซ้ำอยู่ที่ ON CONFLICT บรรทัดล่าง
 * Stripe รับประกันแค่ว่าจะส่ง event "อย่างน้อยหนึ่งครั้ง" ไม่ได้รับประกันว่าครั้งเดียว
 * ถ้าไม่กันตรงนี้ ลูกค้าจะได้อีเมลซ้ำและเกิดออเดอร์ซ้ำ
 *
 * คืน null เมื่อออเดอร์นี้ถูกบันทึกไปแล้ว = ฝั่งเรียกจะได้รู้ว่าไม่ต้องส่งอีเมลซ้ำ
 */
export async function insertPurchase(input: {
  stripeSessionId: string;
  livemode: boolean;
  productId: string;
  email: string;
  quantity: number;
  amountTotal: number | null;
  currency: string | null;
  status: PurchaseStatus;
  paidAt: Date | null;
}): Promise<Purchase | null> {
  const rows = (await db()`
    INSERT INTO purchase (
      order_ref, stripe_session_id, livemode, product_id, email,
      quantity, amount_total, currency, status, download_limit, paid_at
    )
    SELECT
      p.order_ref_prefix || '-' || lpad(nextval('purchase_ref_seq')::text, 6, '0'),
      ${input.stripeSessionId}, ${input.livemode}, p.id, ${normalizeEmail(input.email)},
      ${input.quantity}, ${input.amountTotal}, ${input.currency}, ${input.status},
      p.download_limit, ${input.paidAt ? input.paidAt.toISOString() : null}
    FROM product p WHERE p.id = ${input.productId}
    ON CONFLICT (stripe_session_id) DO NOTHING
    RETURNING id, order_ref, stripe_session_id, livemode, product_id, email,
              quantity, amount_total, currency, status, downloads_used,
              download_limit, paid_at, delivery_email_sent_at, created_at
  `) as Purchase[];
  return rows[0] ?? null;
}

export async function getPurchaseBySession(sessionId: string): Promise<Purchase | null> {
  const rows = (await db()`
    SELECT id, order_ref, stripe_session_id, livemode, product_id, email,
           quantity, amount_total, currency, status, downloads_used,
           download_limit, paid_at, delivery_email_sent_at, created_at
    FROM purchase WHERE stripe_session_id = ${sessionId}
  `) as Purchase[];
  return rows[0] ?? null;
}

export async function getPurchaseById(id: number): Promise<Purchase | null> {
  const rows = (await db()`
    SELECT id, order_ref, stripe_session_id, livemode, product_id, email,
           quantity, amount_total, currency, status, downloads_used,
           download_limit, paid_at, delivery_email_sent_at, created_at
    FROM purchase WHERE id = ${id}
  `) as Purchase[];
  return rows[0] ?? null;
}

/** รายการที่อีเมลนี้ซื้อไว้ ใช้แสดงในหน้า /download */
export async function listPurchasesByEmail(email: string): Promise<Purchase[]> {
  return (await db()`
    SELECT id, order_ref, stripe_session_id, livemode, product_id, email,
           quantity, amount_total, currency, status, downloads_used,
           download_limit, paid_at, delivery_email_sent_at, created_at
    FROM purchase
    WHERE email = ${normalizeEmail(email)} AND status IN ('paid', 'pending')
    ORDER BY created_at DESC
  `) as Purchase[];
}

/**
 * เปลี่ยนสถานะเป็นจ่ายแล้ว
 * ใช้ตอน webhook แจ้งว่าเงินเข้าจริง (เคสพร้อมเพย์จ่ายช้าจะมาทางนี้)
 * คืน true ถ้าเพิ่งเปลี่ยนจริง คืน false ถ้าเป็น paid อยู่ก่อนแล้ว
 * ฝั่งเรียกจะได้รู้ว่าควรส่งอีเมลหรือไม่ ไม่งั้นจะส่งซ้ำ
 */
export async function markPaid(sessionId: string, paidAt: Date): Promise<Purchase | null> {
  const rows = (await db()`
    UPDATE purchase
    SET status = 'paid', paid_at = ${paidAt.toISOString()}, updated_at = now()
    WHERE stripe_session_id = ${sessionId} AND status <> 'paid'
    RETURNING id, order_ref, stripe_session_id, livemode, product_id, email,
              quantity, amount_total, currency, status, downloads_used,
              download_limit, paid_at, delivery_email_sent_at, created_at
  `) as Purchase[];
  return rows[0] ?? null;
}

export async function markStatus(
  sessionId: string,
  status: PurchaseStatus,
): Promise<void> {
  await db()`
    UPDATE purchase SET status = ${status}, updated_at = now()
    WHERE stripe_session_id = ${sessionId}
  `;
}

/**
 * ตัดโควตาดาวน์โหลดหนึ่งครั้ง
 *
 * ⚠️ ต้องเป็นคำสั่งเดียวจบแบบนี้เท่านั้น ห้ามอ่านค่ามาแล้วค่อยเขียนกลับ
 * ถ้าลูกค้ากดปุ่มรัว ๆ หรือเปิดสองแท็บพร้อมกัน วิธีอ่านแล้วเขียนจะนับพลาด
 * และเขาจะโหลดได้เกินโควตา
 *
 * คืน downloads_used ใหม่เมื่อตัดสำเร็จ คืน null เมื่อโควตาหมดหรือออเดอร์ใช้ไม่ได้
 */
export async function consumeDownload(purchaseId: number): Promise<number | null> {
  const rows = (await db()`
    UPDATE purchase
    SET downloads_used = downloads_used + 1, updated_at = now()
    WHERE id = ${purchaseId}
      AND status = 'paid'
      AND downloads_used < download_limit
    RETURNING downloads_used
  `) as { downloads_used: number }[];
  return rows[0]?.downloads_used ?? null;
}

/**
 * บันทึกว่าอีเมลส่งมอบออกไปสำเร็จแล้ว
 *
 * มีไว้เพื่อให้การส่งซ้ำของ Stripe มีความหมาย ถ้ารอบแรกอีเมลล้ม (Resend ล่ม
 * โดเมนยังไม่ยืนยัน โควตาหมด) เราตอบ 500 ให้ Stripe ส่ง event ซ้ำ
 * แล้วรอบถัดไปจะเห็นว่าช่องนี้ยังว่างอยู่ จึงส่งอีเมลใหม่แทนที่จะเงียบไป
 */
export async function markDeliveryEmailSent(purchaseId: number): Promise<void> {
  await db()`
    UPDATE purchase SET delivery_email_sent_at = now(), updated_at = now()
    WHERE id = ${purchaseId}
  `;
}

/**
 * คืนโควตาที่ตัดไปแล้วหนึ่งครั้ง
 *
 * ใช้เฉพาะกรณีที่ "ตัดโควตาไปแล้วแต่ลูกค้าไม่ได้ไฟล์เพราะความผิดของฝั่งเรา"
 * เช่น ดึงไฟล์จาก Blob ไม่ได้ หรือประทับ watermark ล้ม
 * ลูกค้าไม่ควรเสียสิทธิ์เพราะระบบเราพังเอง
 *
 * ⚠️ ห้ามเรียกจากที่อื่น โดยเฉพาะห้ามเรียกตอนลูกค้ากดยกเลิกหรือเน็ตหลุด
 * เพราะเซิร์ฟเวอร์ไม่มีทางรู้ว่าไฟล์ถึงปลายทางครบหรือยัง
 * ถ้าคืนให้ทุกกรณี คนที่ตั้งใจจะโกงก็แค่ตัดการเชื่อมต่อทุกครั้งแล้วโหลดได้ไม่จำกัด
 */
export async function refundDownload(purchaseId: number): Promise<void> {
  await db()`
    UPDATE purchase
    SET downloads_used = GREATEST(downloads_used - 1, 0), updated_at = now()
    WHERE id = ${purchaseId}
  `;
}

export async function logDownload(
  purchaseId: number,
  ipPrefix: string | null,
  userAgent: string | null,
): Promise<void> {
  await db()`
    INSERT INTO download_log (purchase_id, ip_prefix, user_agent)
    VALUES (${purchaseId}, ${ipPrefix}, ${userAgent})
  `;
}

/* ============================================================
   รหัส 6 หลัก
   ============================================================ */

/**
 * ตรวจว่าอีเมลนี้ขอรหัสได้หรือยัง
 *
 * กันสองเรื่องพร้อมกัน
 *   1. คนเดารหัสมั่ว — ถูกล็อกเมื่อกรอกผิดครบตามที่ตั้งไว้
 *   2. คนเอาอีเมลคนอื่นมากรอกรัว ๆ จนระบบเราไปส่งเมลกวนเขา
 *      ข้อนี้สำคัญกว่าที่คิด เพราะถ้าปล่อยไว้ Resend จะมองว่าเราเป็นผู้ส่งสแปม
 *      แล้วอีเมลทั้งหมดของเราจะเริ่มตกไปอยู่ใน junk รวมถึงอีเมลส่งหนังสือด้วย
 */
export async function checkOtpThrottle(
  email: string,
): Promise<{ ok: true } | { ok: false; reason: 'locked' | 'cooldown' | 'hourly'; retryAfterSeconds: number }> {
  const e = normalizeEmail(email);
  const rows = (await db()`
    SELECT email, otp_sent_count, window_started_at, last_sent_at, locked_until
    FROM email_throttle WHERE email = ${e}
  `) as {
    otp_sent_count: number;
    window_started_at: string;
    last_sent_at: string | null;
    locked_until: string | null;
  }[];

  const row = rows[0];
  if (!row) return { ok: true };

  const now = Date.now();

  if (row.locked_until && new Date(row.locked_until).getTime() > now) {
    return {
      ok: false,
      reason: 'locked',
      retryAfterSeconds: Math.ceil((new Date(row.locked_until).getTime() - now) / 1000),
    };
  }

  if (row.last_sent_at) {
    const since = (now - new Date(row.last_sent_at).getTime()) / 1000;
    if (since < OTP.RESEND_COOLDOWN_SECONDS) {
      return {
        ok: false,
        reason: 'cooldown',
        retryAfterSeconds: Math.ceil(OTP.RESEND_COOLDOWN_SECONDS - since),
      };
    }
  }

  const windowAgeMs = now - new Date(row.window_started_at).getTime();
  const withinWindow = windowAgeMs < 60 * 60 * 1000;
  if (withinWindow && row.otp_sent_count >= OTP.MAX_SENDS_PER_HOUR) {
    return {
      ok: false,
      reason: 'hourly',
      retryAfterSeconds: Math.ceil((60 * 60 * 1000 - windowAgeMs) / 1000),
    };
  }

  return { ok: true };
}

/** บันทึกว่าเพิ่งส่งรหัสไป และเลื่อนหน้าต่างนับหนึ่งชั่วโมงถ้าหมดรอบแล้ว */
export async function recordOtpSent(email: string): Promise<void> {
  const e = normalizeEmail(email);
  await db()`
    INSERT INTO email_throttle (email, otp_sent_count, window_started_at, last_sent_at)
    VALUES (${e}, 1, now(), now())
    ON CONFLICT (email) DO UPDATE SET
      otp_sent_count = CASE
        WHEN email_throttle.window_started_at < now() - interval '1 hour' THEN 1
        ELSE email_throttle.otp_sent_count + 1
      END,
      window_started_at = CASE
        WHEN email_throttle.window_started_at < now() - interval '1 hour' THEN now()
        ELSE email_throttle.window_started_at
      END,
      last_sent_at = now()
  `;
}

export async function lockEmail(email: string, minutes: number): Promise<void> {
  const e = normalizeEmail(email);
  await db()`
    INSERT INTO email_throttle (email, locked_until)
    VALUES (${e}, now() + (${minutes} || ' minutes')::interval)
    ON CONFLICT (email) DO UPDATE
      SET locked_until = now() + (${minutes} || ' minutes')::interval
  `;
}

/** ยกเลิกรหัสเก่าทั้งหมดของอีเมลนี้ แล้วบันทึกรหัสใหม่ */
export async function storeOtp(
  email: string,
  codeHash: string,
  ttlMinutes: number,
): Promise<void> {
  const e = normalizeEmail(email);
  await db()`
    UPDATE otp SET consumed_at = now()
    WHERE email = ${e} AND consumed_at IS NULL
  `;
  await db()`
    INSERT INTO otp (email, code_hash, expires_at)
    VALUES (${e}, ${codeHash}, now() + (${ttlMinutes} || ' minutes')::interval)
  `;
}

export type OtpRow = {
  id: number;
  code_hash: string;
  expires_at: string;
  attempts: number;
};

/** รหัสล่าสุดที่ยังไม่ถูกใช้และยังไม่หมดอายุ */
export async function getActiveOtp(email: string): Promise<OtpRow | null> {
  const rows = (await db()`
    SELECT id, code_hash, expires_at, attempts
    FROM otp
    WHERE email = ${normalizeEmail(email)}
      AND consumed_at IS NULL
      AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1
  `) as OtpRow[];
  return rows[0] ?? null;
}

export async function bumpOtpAttempts(otpId: number): Promise<number> {
  const rows = (await db()`
    UPDATE otp SET attempts = attempts + 1 WHERE id = ${otpId} RETURNING attempts
  `) as { attempts: number }[];
  return rows[0]?.attempts ?? 0;
}

export async function consumeOtp(otpId: number): Promise<void> {
  await db()`UPDATE otp SET consumed_at = now() WHERE id = ${otpId}`;
}

/** ล้างการล็อกและตัวนับ ใช้หลังกรอกรหัสถูก */
export async function clearThrottle(email: string): Promise<void> {
  await db()`
    UPDATE email_throttle SET locked_until = NULL WHERE email = ${normalizeEmail(email)}
  `;
}
