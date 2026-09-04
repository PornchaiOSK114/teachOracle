/**
 * ใบผ่านชั่วคราวสำหรับดาวน์โหลด
 *
 * ⚠️ ไฟล์นี้เป็นของฝั่ง server เท่านั้น ห้าม client component import
 *
 * ปัญหาที่ต้องแก้: ระหว่าง "กรอกรหัสถูก" กับ "กดปุ่มดาวน์โหลด" เป็นคนละ request
 * เซิร์ฟเวอร์ไม่มีความจำระหว่างสองจังหวะนี้ ต้องมีอะไรสักอย่างพกติดตัวไปบอกว่า
 * คนนี้เพิ่งผ่านด่านรหัสมาแล้วจริง
 *
 * วิธีที่ใช้: ข้อความสั้น ๆ ที่เซ็นกำกับด้วย APP_SECRET เก็บใน cookie แบบ httpOnly
 * ปลอมไม่ได้เพราะไม่มีใครรู้ APP_SECRET และแก้ไม่ได้เพราะลายเซ็นจะไม่ตรงทันที
 *
 * ⚠️ อายุสั้นมากโดยเจตนา (15 นาที)
 * เจ้าของเว็บเลือกแบบ "กรอกรหัสทุกครั้งที่ดาวน์โหลด" ไม่เอาแบบจำเครื่องไว้ 30 วัน
 * ใบผ่านนี้จึงไม่ใช่การจำเครื่อง แต่เป็นแค่สะพานข้ามระหว่างสองจังหวะข้างต้น
 * ปิดเบราว์เซอร์แล้วกลับมาใหม่พรุ่งนี้ = ต้องขอรหัสใหม่
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { requireEnv } from './config';

/**
 * อายุใบผ่าน นับจากตอนกรอกรหัสถูก หรือตอนจ่ายเงินเสร็จ
 *
 * ขยายจาก 15 เป็น 30 นาทีเมื่อ 3 ก.ย. 2569 หลังเจอของจริง:
 * ลูกค้าเปิดหน้าไว้ อ่านนู่นนี่ กว่าจะกดโหลดก็เลยเวลา แล้วเจอหน้า error
 * และทุกครั้งที่โหลดสำเร็จ ฝั่ง route จะต่ออายุใบผ่านให้ใหม่ (เลื่อนออกไปเรื่อย ๆ)
 * ตราบใดที่ยังใช้งานอยู่จึงไม่มีทางหมดอายุคาหน้าจอ
 */
export const GRANT_TTL_MINUTES = 30;

export const GRANT_COOKIE = 'teedba_dl';

type GrantPayload = {
  /** อีเมลที่ผ่านการยืนยันแล้ว */
  email: string;
  /** หมดอายุเมื่อไหร่ (มิลลิวินาที) */
  exp: number;
};

function sign(data: string): string {
  return createHmac('sha256', requireEnv('APP_SECRET')).update(data).digest('base64url');
}

export function createGrant(email: string, ttlMinutes = GRANT_TTL_MINUTES): string {
  const payload: GrantPayload = {
    email: email.trim().toLowerCase(),
    exp: Date.now() + ttlMinutes * 60_000,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body)}`;
}

/** คืนอีเมลที่ยืนยันแล้ว หรือ null ถ้าใบผ่านปลอม แก้มา หรือหมดอายุ */
export function readGrant(token: string | undefined): string | null {
  if (!token) return null;

  const [body, signature] = token.split('.');
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as GrantPayload;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    if (typeof payload.email !== 'string' || payload.email.length === 0) return null;
    return payload.email;
  } catch {
    return null;
  }
}
