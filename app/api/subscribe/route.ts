import { NextResponse } from 'next/server';

/**
 * รับสมัครรับข่าว → ส่งต่อ MailerLite ฝั่งเซิร์ฟเวอร์
 *
 * ทำไมต้องผ่าน route นี้แทนที่จะยิงจากเบราว์เซอร์ตรง ๆ:
 *  1. API key เป็นความลับ ไม่รั่วออกหน้าเว็บ (ห้ามใช้ NEXT_PUBLIC_*)
 *  2. ไม่ติดปัญหา CORS
 *  3. อ่านผลลัพธ์จริงจาก MailerLite มาแสดงข้อความไทยที่ถูกต้องได้
 *
 * ตั้ง env บน Vercel › Settings › Environment Variables:
 *   MAILERLITE_API_KEY  (จำเป็น)
 *   MAILERLITE_GROUP_ID (ไม่บังคับ)
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ message: 'ข้อมูลไม่ถูกต้อง' }, { status: 400 });
  }

  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ message: 'กรุณากรอกอีเมลให้ถูกต้อง' }, { status: 400 });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    // ยังไม่ได้ตั้ง env — บอกตรง ๆ ว่าระบบยังไม่พร้อม ดีกว่าแกล้งทำเป็นสำเร็จ
    console.error('[subscribe] ยังไม่ได้ตั้งค่า MAILERLITE_API_KEY');
    return NextResponse.json(
      { message: 'ระบบรับข่าวยังไม่พร้อมใช้งาน กรุณาติดต่อทางอีเมลหรือเพจ Facebook ไปก่อน' },
      { status: 503 },
    );
  }

  const groupId = process.env.MAILERLITE_GROUP_ID;

  try {
    const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        ...(groupId ? { groups: [groupId] } : {}),
      }),
    });

    if (res.ok || res.status === 201 || res.status === 200) {
      return NextResponse.json({
        message: 'ขอบคุณครับ! กรุณาตรวจอีเมลเพื่อยืนยันการสมัคร',
      });
    }

    if (res.status === 422) {
      return NextResponse.json(
        { message: 'อีเมลนี้สมัครไว้แล้ว หรือรูปแบบอีเมลไม่ถูกต้อง' },
        { status: 422 },
      );
    }

    const detail = await res.text();
    console.error('[subscribe] MailerLite ตอบกลับผิดพลาด', res.status, detail);
    return NextResponse.json(
      { message: 'สมัครไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' },
      { status: 502 },
    );
  } catch (err) {
    console.error('[subscribe] เชื่อมต่อ MailerLite ไม่ได้', err);
    return NextResponse.json(
      { message: 'เชื่อมต่อระบบรับข่าวไม่ได้ กรุณาลองใหม่อีกครั้ง' },
      { status: 502 },
    );
  }
}
