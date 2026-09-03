/**
 * รหัส 6 หลักสำหรับยืนยันว่าคนที่กำลังจะดาวน์โหลดคือเจ้าของอีเมลจริง
 *
 * ⚠️ ไฟล์นี้เป็นของฝั่ง server เท่านั้น ห้าม client component import
 *    (ใช้ node:crypto ถ้าหลุดเข้า client bundle จะพังตอน build)
 *
 * ทำไมต้องมีชั้นนี้ทั้งที่ลิงก์ส่งไปทางอีเมลอยู่แล้ว
 * เพราะเจ้าของเว็บกำหนดไว้ว่า "คนอื่นได้ลิงก์ไปก็ต้องโหลดไม่ได้"
 * ลิงก์อย่างเดียวกันไม่ได้ เพราะลิงก์ถูกส่งต่อได้ แต่กล่องอีเมลส่งต่อไม่ได้
 */
import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { requireEnv, OTP } from './config';
import {
  bumpOtpAttempts,
  checkOtpThrottle,
  clearThrottle,
  consumeOtp,
  getActiveOtp,
  lockEmail,
  normalizeEmail,
  recordOtpSent,
  storeOtp,
} from './db';

/**
 * เก็บรหัสลงฐานข้อมูลแบบแฮช ไม่เก็บตัวเลขตรง ๆ
 * ถ้าวันหนึ่งฐานข้อมูลรั่ว คนที่ได้ข้อมูลไปก็เอารหัสไปใช้ไม่ได้
 * ผูกกับอีเมลด้วย เพื่อไม่ให้เอาแฮชของอีเมลหนึ่งไปใช้กับอีกอีเมลได้
 */
function hashCode(email: string, code: string): string {
  return createHmac('sha256', requireEnv('APP_SECRET'))
    .update(`${normalizeEmail(email)}:${code}`)
    .digest('hex');
}

/** สุ่มรหัสด้วยตัวสุ่มเชิงรหัสลับ ไม่ใช่ Math.random ซึ่งเดาต่อได้ */
function generateCode(): string {
  const max = 10 ** OTP.LENGTH;
  return String(randomInt(0, max)).padStart(OTP.LENGTH, '0');
}

export type IssueResult =
  | { ok: true; code: string }
  | { ok: false; reason: 'locked' | 'cooldown' | 'hourly'; retryAfterSeconds: number };

/**
 * ออกรหัสใหม่ให้อีเมลนี้ ถ้ายังไม่ติดข้อจำกัด
 * คืนตัวรหัสกลับไปให้ฝั่งเรียกเอาไปส่งอีเมล — ห้ามเก็บ log ห้ามส่งกลับไปทาง response
 */
export async function issueOtp(emailRaw: string): Promise<IssueResult> {
  const email = normalizeEmail(emailRaw);

  const throttle = await checkOtpThrottle(email);
  if (!throttle.ok) {
    return { ok: false, reason: throttle.reason, retryAfterSeconds: throttle.retryAfterSeconds };
  }

  const code = generateCode();
  await storeOtp(email, hashCode(email, code), OTP.TTL_MINUTES);
  await recordOtpSent(email);

  return { ok: true, code };
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'no_code' | 'expired' | 'wrong' | 'locked'; attemptsLeft?: number };

/**
 * ตรวจรหัสที่ลูกค้ากรอกมา
 *
 * ใช้ timingSafeEqual แทนการเทียบด้วย === เพราะการเทียบสตริงธรรมดา
 * จะหยุดทันทีที่เจอตัวอักษรต่างกัน ทำให้เวลาที่ใช้บอกใบ้ได้ว่าเดาถูกไปกี่ตัวแล้ว
 * ในทางปฏิบัติกับรหัส 6 หลักที่มีลิมิตการเดาอยู่แล้วโอกาสถูกโจมตีต่ำมาก
 * แต่ต้นทุนของการทำให้ถูกต้องคือศูนย์ จึงไม่มีเหตุผลจะไม่ทำ
 */
export async function verifyOtp(emailRaw: string, codeRaw: string): Promise<VerifyResult> {
  const email = normalizeEmail(emailRaw);
  const code = codeRaw.trim();

  const throttle = await checkOtpThrottle(email);
  if (!throttle.ok && throttle.reason === 'locked') {
    return { ok: false, reason: 'locked' };
  }

  const row = await getActiveOtp(email);
  if (!row) return { ok: false, reason: 'no_code' };

  if (new Date(row.expires_at).getTime() <= Date.now()) {
    return { ok: false, reason: 'expired' };
  }

  const expected = Buffer.from(row.code_hash, 'hex');
  const actual = Buffer.from(hashCode(email, code), 'hex');
  const match = expected.length === actual.length && timingSafeEqual(expected, actual);

  if (!match) {
    const attempts = await bumpOtpAttempts(row.id);
    if (attempts >= OTP.MAX_ATTEMPTS) {
      await consumeOtp(row.id);
      await lockEmail(email, OTP.LOCK_MINUTES);
      return { ok: false, reason: 'locked' };
    }
    return { ok: false, reason: 'wrong', attemptsLeft: OTP.MAX_ATTEMPTS - attempts };
  }

  await consumeOtp(row.id);
  await clearThrottle(email);
  return { ok: true };
}
