/**
 * ขั้นที่ 2 ของหน้าดาวน์โหลด — ลูกค้ากรอกรหัส 6 หลัก
 * ถูกแล้วจะได้ใบผ่านชั่วคราวเก็บใน cookie และเห็นรายการที่ตัวเองซื้อ
 */
import { NextResponse } from 'next/server';
import { getProductById, listPurchasesByEmail, normalizeEmail } from '@/lib/delivery/db';
import { verifyOtp } from '@/lib/delivery/otp';
import { GRANT_COOKIE, GRANT_TTL_MINUTES, createGrant } from '@/lib/delivery/grant';
import { OTP } from '@/lib/delivery/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export type PurchaseView = {
  id: number;
  orderRef: string;
  bookTitle: string;
  quantity: number;
  status: 'paid' | 'pending';
  downloadsUsed: number;
  downloadLimit: number;
  purchasedAt: string;
};

export async function POST(request: Request) {
  let email: string;
  let code: string;
  try {
    const body = (await request.json()) as { email?: unknown; code?: unknown };
    email = normalizeEmail(String(body.email ?? ''));
    code = String(body.code ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'รูปแบบคำขอไม่ถูกต้อง' }, { status: 400 });
  }

  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: 'กรุณากรอกรหัส 6 หลัก' }, { status: 400 });
  }

  const result = await verifyOtp(email, code);
  if (!result.ok) {
    const message =
      result.reason === 'locked'
        ? `กรอกรหัสผิดครบ ${OTP.MAX_ATTEMPTS} ครั้งแล้ว ระบบล็อกไว้ ${OTP.LOCK_MINUTES} นาที`
        : result.reason === 'expired'
          ? 'รหัสหมดอายุแล้ว กดขอรหัสใหม่ได้เลย'
          : result.reason === 'no_code'
            ? 'ยังไม่ได้ขอรหัส หรือรหัสถูกใช้ไปแล้ว กดขอรหัสใหม่'
            : `รหัสไม่ถูกต้อง เหลืออีก ${result.attemptsLeft} ครั้ง`;
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const purchases = await listPurchasesByEmail(email);
  const items: PurchaseView[] = [];
  for (const p of purchases) {
    const product = await getProductById(p.product_id);
    items.push({
      id: p.id,
      orderRef: p.order_ref,
      bookTitle: product?.title ?? p.product_id,
      quantity: p.quantity,
      status: p.status === 'paid' ? 'paid' : 'pending',
      downloadsUsed: p.downloads_used,
      downloadLimit: p.download_limit,
      purchasedAt: p.created_at,
    });
  }

  const response = NextResponse.json({ ok: true, items });
  response.cookies.set(GRANT_COOKIE, createGrant(email), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: GRANT_TTL_MINUTES * 60,
  });
  return response;
}
