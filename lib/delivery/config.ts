/**
 * ค่าตั้งต้นและตัวแปรลับของระบบส่งมอบ E-Book
 *
 * ⚠️ ไฟล์นี้เป็นของฝั่ง server เท่านั้น ห้าม client component ('use client') import
 *    เพราะมันอ่านค่าลับจาก environment variable
 *
 * หลักการ: อ่านค่า "ตอนถูกเรียกใช้" ไม่ใช่ "ตอนโหลดไฟล์"
 * ถ้าอ่านตอนโหลดไฟล์แล้วค่ายังไม่ถูกตั้ง `next build` จะพังทันที
 * ซึ่งจะทำให้ deploy ไม่ผ่านทั้งที่หน้าเว็บอื่นไม่เกี่ยวข้องเลย
 */

/** อ่านค่าที่จำเป็น ไม่มี = โยน error พร้อมบอกชื่อตัวแปรให้ชัด */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `ยังไม่ได้ตั้งค่า environment variable "${name}" ที่ Vercel — ดู docs/DELIVERY_PLAN.md §7`,
    );
  }
  return value;
}

/** อ่านค่าที่ไม่บังคับ */
export function optionalEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

/* ============================================================
   กติกาของรหัส 6 หลัก (ตกลงกับเจ้าของเว็บแล้ว ดู DELIVERY_PLAN.md ข้อ 16)
   ============================================================ */
export const OTP = {
  /** ความยาวรหัส */
  LENGTH: 6,
  /** อายุของรหัส */
  TTL_MINUTES: 10,
  /** ขอรหัสใหม่ได้เร็วสุดทุกกี่วินาที */
  RESEND_COOLDOWN_SECONDS: 60,
  /** ขอรหัสได้กี่ครั้งต่อชั่วโมงต่อหนึ่งอีเมล — กันคนใช้ระบบเราไปสแปมคนอื่น */
  MAX_SENDS_PER_HOUR: 5,
  /** กรอกผิดได้กี่ครั้งก่อนถูกล็อก */
  MAX_ATTEMPTS: 5,
  /** ล็อกนานกี่นาทีเมื่อกรอกผิดครบ */
  LOCK_MINUTES: 15,
} as const;

/**
 * ช่วงเวลาที่ยกเว้นไม่ต้องกรอกรหัส นับจากเวลาที่จ่ายเงินสำเร็จ
 * เหตุผล: คนที่เพิ่งจ่ายเงินเสร็จพิสูจน์ตัวเองไปแล้วด้วยการจ่ายเงิน
 * การบังคับให้เขาไปเปิดกล่องอีเมลหารหัสในวินาทีนั้นคือจังหวะที่ลูกค้าหงุดหงิดที่สุด
 */
export const POST_PAYMENT_GRACE_MINUTES = 30;

/** ที่อยู่ผู้รับเมื่อลูกค้ากด reply — ใช้อีเมลจริงของเจ้าของเว็บ ไม่ใช่ no-reply */
export const SUPPORT_EMAIL = 'pornchai.krong@gmail.com';

/** ชื่อหน้าที่ลูกค้าต้องจำ */
export const DOWNLOAD_PATH = '/download';
