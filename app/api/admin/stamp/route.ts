/**
 * ประทับ watermark ด้วยมือ สำหรับคนที่ไม่ได้ซื้อผ่าน Stripe
 *
 * ใช้กับเคสอย่างแจกให้คนรีวิว ขายหน้างานอบรมรับเงินสด หรือใครโอนตรงมาหาเจ้าของเว็บ
 * ไม่ได้มีไว้แก้ปัญหาลูกค้าที่ซื้อผ่าน Stripe แล้วติดขัด เคสนั้นวิธีที่ถูกคือ
 * รีเซ็ตโควตาหรือแก้อีเมลให้เขาโหลดเองได้ ไม่ใช่ส่งไฟล์ให้ด้วยมือ
 *
 * ⚠️ ใช้โค้ดประทับตัวเดียวกับระบบอัตโนมัติโดยเจตนา
 * ถ้าแยกเป็นอีกชุด วันหนึ่งเปลี่ยนดีไซน์ watermark แล้วลืมแก้อีกที่
 * ลูกค้าสองกลุ่มจะได้ไฟล์หน้าตาไม่เหมือนกัน แล้วเวลาสืบว่าไฟล์รั่วจากใครจะสับสน
 */
import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { getProductById, normalizeEmail } from '@/lib/delivery/db';
import { getMasterPdf } from '@/lib/delivery/blob';
import { stampPdf, todayInBangkok } from '@/lib/delivery/watermark';
import { requireEnv } from '@/lib/delivery/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * เทียบรหัสผ่านแบบไม่บอกใบ้ด้วยเวลา
 * แฮชความยาวก่อนเทียบ เพราะ timingSafeEqual โยน error ถ้าความยาวไม่เท่ากัน
 * ซึ่งตัวการโยน error เองก็บอกใบ้ความยาวรหัสผ่านที่ถูกต้องได้
 */
function passwordMatches(given: string): boolean {
  const expected = requireEnv('ADMIN_PASSWORD');
  const a = Buffer.from(given.padEnd(128).slice(0, 128));
  const b = Buffer.from(expected.padEnd(128).slice(0, 128));
  return timingSafeEqual(a, b) && given.length === expected.length;
}

/** เลขอ้างอิงสำหรับไฟล์ที่ประทับด้วยมือ ให้ดูออกว่าไม่ได้มาจากการซื้อผ่านเว็บ */
function manualRef(prefix: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let tail = '';
  for (let i = 0; i < 5; i += 1) {
    tail += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-M${tail}`;
}

export async function POST(request: Request) {
  let password = '';
  let email = '';
  let productId = '';
  let orderRef = '';

  try {
    const body = (await request.json()) as Record<string, unknown>;
    password = String(body.password ?? '');
    email = normalizeEmail(String(body.email ?? ''));
    productId = String(body.productId ?? '');
    orderRef = String(body.orderRef ?? '').trim();
  } catch {
    return NextResponse.json({ error: 'รูปแบบคำขอไม่ถูกต้อง' }, { status: 400 });
  }

  if (!passwordMatches(password)) {
    /*
     * หน่วงเวลาเล็กน้อยเมื่อรหัสผิด ลดความเร็วของการเดารหัสแบบยิงรัว
     * ฟังก์ชันบน Vercel เกิดใหม่ทุกครั้ง จึงนับจำนวนครั้งข้าม request ไม่ได้
     * ด่านจริงคือความยาวของรหัสผ่าน ตั้งให้ยาวและไม่ซ้ำกับที่ใช้ที่อื่น
     */
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return NextResponse.json({ error: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'กรุณากรอกอีเมลให้ถูกต้อง' }, { status: 400 });
  }

  const product = await getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: `ไม่พบสินค้ารหัส "${productId}"` }, { status: 404 });
  }

  const ref = orderRef || manualRef(product.order_ref_prefix);

  try {
    const master = await getMasterPdf(product.blob_pathname);
    const stamped = await stampPdf(master, {
      email,
      orderRef: ref,
      issuedOn: todayInBangkok(),
      skipFirstPage: product.watermark_skip_first_page,
    });

    /* บันทึกไว้ใน log ของ Vercel เผื่อวันหลังต้องย้อนดูว่าเคยประทับให้ใครไปบ้าง */
    console.info('[admin-stamp] ประทับด้วยมือ', { ref, email, product: product.id });

    return new NextResponse(stamped as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(stamped.byteLength),
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(product.file_name)}`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        /* ส่งเลขอ้างอิงกลับไปให้หน้าเว็บแสดง จะได้จดไว้ได้ */
        'X-Order-Ref': ref,
      },
    });
  } catch (err) {
    console.error('[admin-stamp] สร้างไฟล์ไม่สำเร็จ', err);
    return NextResponse.json(
      { error: 'สร้างไฟล์ไม่สำเร็จ ตรวจว่าอัปโหลดไฟล์ขึ้น Vercel Blob แล้วและเป็นแบบ private' },
      { status: 500 },
    );
  }
}
