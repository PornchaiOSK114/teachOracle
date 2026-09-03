/**
 * อีเมลทั้งหมดของระบบส่งมอบ E-Book ส่งผ่าน Resend
 *
 * ⚠️ ไฟล์นี้เป็นของฝั่ง server เท่านั้น ห้าม client component import
 *
 * มีสองฉบับ
 *   1. อีเมลส่งลิงก์รับหนังสือ — ส่งครั้งเดียวตอนเงินเข้าจริง
 *   2. อีเมลรหัส 6 หลัก — ส่งทุกครั้งที่ลูกค้าขอดาวน์โหลด
 *
 * ข้อความในไฟล์นี้เป็นข้อความที่ลูกค้าอ่าน เขียนด้วยสำนวนของอาจารย์ตี๋
 * ใช้ "ผม" ไม่ใช้ emoji ถ้าจะแก้ถ้อยคำต้องคงสำนวนเดิมไว้
 */
import { Resend } from 'resend';
import { requireEnv, OTP, SUPPORT_EMAIL } from './config';
import { site } from '@/lib/site';

function client() {
  return new Resend(requireEnv('RESEND_API_KEY'));
}

type SendPayload = Parameters<InstanceType<typeof Resend>['emails']['send']>[0];

/**
 * ส่งอีเมลแล้วโยน error ถ้า Resend ปฏิเสธ
 *
 * ⚠️ หัวใจของฟังก์ชันนี้: `resend.emails.send()` **ไม่ throw เมื่อส่งไม่สำเร็จ**
 * มันคืน { data, error } กลับมาเฉย ๆ ถ้าเราไม่ตรวจ error ตรงนี้
 * อีเมลที่ส่งไม่ออกจะเงียบสนิท ลูกค้าจ่ายเงินแล้วไม่ได้อะไร และเราไม่รู้ตัว
 * (เจอมาแล้วตอนทดสอบ 3 ก.ย. 2569 — webhook ตอบ 200 สวยงามทั้งที่ไม่มีอีเมลออกไปเลย)
 *
 * โยน error ออกไปแล้วฝั่งเรียกจะตอบ 500 ให้ Stripe ส่ง event ซ้ำ = ได้โอกาสส่งใหม่
 */
async function sendOrThrow(payload: SendPayload, what: string) {
  const { data, error } = await client().emails.send(payload);
  if (error) {
    const detail = error.message ?? JSON.stringify(error);
    throw new Error(`Resend ส่ง${what}ไม่สำเร็จ: ${error.name ?? 'error'} — ${detail}`);
  }
  console.info('[mail] ส่งสำเร็จ', what, data?.id);
  return data;
}


/** ครอบข้อความให้อ่านง่ายบนอีเมล ไม่มีรูป ไม่มีไฟล์ภายนอก โหลดเร็วและไม่ตกไป spam ง่าย */
function wrapHtml(bodyHtml: string): string {
  return `<!doctype html><html lang="th"><body style="margin:0;padding:24px;background:#f6f7f9;">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px 26px;
            font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;
            font-size:15px;line-height:1.75;color:#1f2328;">
${bodyHtml}
<hr style="border:none;border-top:1px solid #e6e8eb;margin:26px 0 16px;">
<div style="font-size:13px;color:#6b7280;">
อาจารย์ตี๋ที่สอน Oracle<br>
<a href="${site.url}" style="color:#6b7280;">teedba.com</a>
</div>
</div></body></html>`;
}

type DeliveryInput = {
  to: string;
  orderRef: string;
  bookTitle: string;
  quantity: number;
  downloadLimit: number;
};

/**
 * อีเมลฉบับที่ลูกค้ารอ ส่งทันทีที่เงินเข้าจริง
 * ไม่แนบไฟล์โดยเจตนา เพราะถ้าแนบไฟล์ไปด้วย กติกา "ดาวน์โหลดได้ 5 ครั้ง" จะไม่มีความหมาย
 */
export async function sendDeliveryEmail(input: DeliveryInput) {
  const downloadUrl = `${site.url}/download`;
  const labUrl = `${site.url}/lab`;

  const text = [
    'ขอบคุณที่สั่งซื้อครับ',
    '',
    `หนังสือ: ${input.bookTitle}`,
    `เลขที่คำสั่งซื้อ: ${input.orderRef}`,
    `จำนวน: ${input.quantity} สิทธิ์`,
    '',
    'ดาวน์โหลดหนังสือได้ที่',
    downloadUrl,
    '',
    `เปิดหน้านั้นแล้วกรอกอีเมลนี้ ระบบจะส่งรหัส 6 หลักตามไปให้ เอารหัสมากรอกก็โหลดได้เลย`,
    'ที่ต้องมีรหัสเพราะไฟล์ผูกกับอีเมลของคุณคนเดียว ใครได้ลิงก์ไปแต่เปิดอีเมลคุณไม่ได้ ก็โหลดไม่ได้',
    '',
    `ไฟล์ PDF ที่ได้จะมีอีเมลของคุณกำกับไว้ทุกหน้า และดาวน์โหลดได้ ${input.downloadLimit} ครั้ง`,
    'ถ้าโหลดครบแล้วยังต้องการอีก ตอบอีเมลฉบับนี้กลับมาได้ ผมเพิ่มให้',
    '',
    `ชุดติดตั้งแล็บอยู่ที่ ${labUrl} โหลดได้ไม่จำกัด ไม่ต้องใช้รหัส`,
    '',
    'ติดปัญหาตรงไหนตอบอีเมลฉบับนี้กลับมาได้เลยครับ',
  ].join('\n');

  const html = wrapHtml(`
<p style="margin:0 0 18px;">ขอบคุณที่สั่งซื้อครับ</p>
<table style="border-collapse:collapse;margin:0 0 22px;font-size:14px;">
  <tr><td style="padding:3px 16px 3px 0;color:#6b7280;">หนังสือ</td><td style="padding:3px 0;"><strong>${input.bookTitle}</strong></td></tr>
  <tr><td style="padding:3px 16px 3px 0;color:#6b7280;">เลขที่คำสั่งซื้อ</td><td style="padding:3px 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${input.orderRef}</td></tr>
  <tr><td style="padding:3px 16px 3px 0;color:#6b7280;">จำนวน</td><td style="padding:3px 0;">${input.quantity} สิทธิ์</td></tr>
</table>
<p style="margin:0 0 20px;">
  <a href="${downloadUrl}" style="display:inline-block;background:#1f2328;color:#ffffff;
     text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">ไปหน้าดาวน์โหลด</a>
</p>
<p style="margin:0 0 14px;">เปิดหน้านั้นแล้วกรอกอีเมลนี้ ระบบจะส่งรหัส 6 หลักตามไปให้ เอารหัสมากรอกก็โหลดได้เลย
ที่ต้องมีรหัสเพราะไฟล์ผูกกับอีเมลของคุณคนเดียว ใครได้ลิงก์ไปแต่เปิดอีเมลคุณไม่ได้ ก็โหลดไม่ได้</p>
<p style="margin:0 0 14px;">ไฟล์ PDF ที่ได้จะมีอีเมลของคุณกำกับไว้ทุกหน้า และดาวน์โหลดได้ ${input.downloadLimit} ครั้ง
ถ้าโหลดครบแล้วยังต้องการอีก ตอบอีเมลฉบับนี้กลับมาได้ ผมเพิ่มให้</p>
<p style="margin:0 0 14px;">ชุดติดตั้งแล็บอยู่ที่ <a href="${labUrl}" style="color:#1f2328;">${labUrl}</a>
โหลดได้ไม่จำกัด ไม่ต้องใช้รหัส</p>
<p style="margin:0;">ติดปัญหาตรงไหนตอบอีเมลฉบับนี้กลับมาได้เลยครับ</p>`);

  return sendOrThrow(
    {
      from: requireEnv('RESEND_FROM'),
      to: input.to,
      replyTo: SUPPORT_EMAIL,
      subject: `${input.bookTitle} พร้อมให้ดาวน์โหลดแล้วครับ (${input.orderRef})`,
      text,
      html,
    },
    'อีเมลส่งมอบหนังสือ',
  );
}

/** อีเมลรหัส 6 หลัก ต้องถึงเร็วและอ่านง่าย เพราะลูกค้ากำลังรออยู่หน้าจอ */
export async function sendOtpEmail(to: string, code: string) {
  const text = [
    'รหัสสำหรับดาวน์โหลดหนังสือของคุณคือ',
    '',
    code,
    '',
    `รหัสนี้ใช้ได้ ${OTP.TTL_MINUTES} นาที และใช้ได้ครั้งเดียว`,
    '',
    'ถ้าคุณไม่ได้เป็นคนขอรหัสนี้ ไม่ต้องทำอะไรครับ รหัสจะหมดอายุไปเอง',
    'และไม่มีใครเข้าถึงหนังสือของคุณได้ถ้าไม่มีรหัส',
  ].join('\n');

  const html = wrapHtml(`
<p style="margin:0 0 16px;">รหัสสำหรับดาวน์โหลดหนังสือของคุณคือ</p>
<p style="margin:0 0 18px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
   font-size:32px;letter-spacing:8px;font-weight:700;">${code}</p>
<p style="margin:0 0 14px;">รหัสนี้ใช้ได้ ${OTP.TTL_MINUTES} นาที และใช้ได้ครั้งเดียว</p>
<p style="margin:0;color:#6b7280;font-size:14px;">ถ้าคุณไม่ได้เป็นคนขอรหัสนี้ ไม่ต้องทำอะไรครับ
รหัสจะหมดอายุไปเอง และไม่มีใครเข้าถึงหนังสือของคุณได้ถ้าไม่มีรหัส</p>`);

  return sendOrThrow(
    {
      from: requireEnv('RESEND_FROM'),
      to,
      replyTo: SUPPORT_EMAIL,
      subject: `รหัสดาวน์โหลด ${code}`,
      text,
      html,
    },
    'อีเมลรหัส 6 หลัก',
  );
}
