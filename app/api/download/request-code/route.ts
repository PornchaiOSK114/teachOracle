/**
 * ขั้นที่ 1 ของหน้าดาวน์โหลด — ลูกค้ากรอกอีเมล ระบบส่งรหัส 6 หลักไปให้
 */
import { NextResponse } from 'next/server';
import { listPurchasesByEmail, normalizeEmail } from '@/lib/delivery/db';
import { sendOtpEmail } from '@/lib/delivery/mail';
import { issueOtp } from '@/lib/delivery/otp';
import { OTP } from '@/lib/delivery/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: string;
  try {
    const body = (await request.json()) as { email?: unknown };
    email = normalizeEmail(String(body.email ?? ''));
  } catch {
    return NextResponse.json({ error: 'รูปแบบคำขอไม่ถูกต้อง' }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'กรุณากรอกอีเมลให้ถูกต้อง' }, { status: 400 });
  }

  /*
   * บอกตรง ๆ เมื่อไม่พบคำสั่งซื้อ
   *
   * ตำราความปลอดภัยมักแนะนำให้ตอบกำกวมเพื่อไม่ให้คนภายนอกรู้ว่าอีเมลไหนซื้อของ
   * แต่ที่นี่เลือกอีกทาง เพราะปัญหาที่เกิดจริงบ่อยกว่ามากคือลูกค้ากรอกอีเมลผิด
   * ตอนซื้อ แล้วมางงว่าทำไมไม่ได้รหัส การบอกตรง ๆ ทำให้เขารู้ตัวทันทีและติดต่อมาได้
   * ส่วนข้อมูลที่รั่วคือ "อีเมลนี้เคยซื้อหนังสือเล่มนี้" ซึ่งความเสียหายต่ำมาก
   */
  const purchases = await listPurchasesByEmail(email);
  if (purchases.length === 0) {
    return NextResponse.json(
      {
        error:
          'ไม่พบคำสั่งซื้อของอีเมลนี้ ถ้าคิดว่ากรอกอีเมลผิดตอนสั่งซื้อ ติดต่อ pornchai.krong@gmail.com ได้เลยครับ',
      },
      { status: 404 },
    );
  }

  const issued = await issueOtp(email);
  if (!issued.ok) {
    const minutes = Math.ceil(issued.retryAfterSeconds / 60);
    const message =
      issued.reason === 'locked'
        ? `กรอกรหัสผิดหลายครั้งเกินไป ลองใหม่ในอีก ${minutes} นาที`
        : issued.reason === 'cooldown'
          ? `เพิ่งส่งรหัสไปเมื่อสักครู่ รออีก ${issued.retryAfterSeconds} วินาทีแล้วกดใหม่`
          : `ขอรหัสบ่อยเกินไป ลองใหม่ในอีก ${minutes} นาที`;
    return NextResponse.json({ error: message }, { status: 429 });
  }

  try {
    await sendOtpEmail(email, issued.code);
  } catch (err) {
    console.error('[request-code] ส่งอีเมลไม่สำเร็จ', err);
    return NextResponse.json(
      { error: 'ส่งอีเมลไม่สำเร็จ ลองใหม่อีกครั้ง ถ้ายังไม่ได้ติดต่อ pornchai.krong@gmail.com' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, ttlMinutes: OTP.TTL_MINUTES });
}
