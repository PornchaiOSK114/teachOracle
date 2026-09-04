/**
 * ส่งไฟล์หนังสือที่ประทับ watermark แล้ว
 *
 * นี่คือประตูเดียวที่ไฟล์ออกจากระบบ ทุกอย่างที่ต้องตรวจต้องตรวจที่นี่
 *
 * เข้าได้สองทาง
 *   1. มีใบผ่านใน cookie (ผ่านด่านรหัส 6 หลักมาแล้ว) + ระบุว่าจะโหลดออเดอร์ไหน
 *   2. เพิ่งจ่ายเงินเสร็จภายใน 30 นาที ใช้รหัสอ้างอิงจาก Stripe แทนใบผ่าน
 *      ทางนี้มีเพื่อไม่ให้คนที่เพิ่งจ่ายเงินต้องไปเปิดกล่องอีเมลหารหัสในวินาทีนั้น
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  consumeDownload,
  getProductById,
  getPurchaseById,
  getPurchaseBySession,
  logDownload,
  refundDownload,
  type Purchase,
} from '@/lib/delivery/db';
import { getMasterPdf } from '@/lib/delivery/blob';
import { stampPdf, todayInBangkok } from '@/lib/delivery/watermark';
import { GRANT_COOKIE, GRANT_TTL_MINUTES, createGrant, readGrant } from '@/lib/delivery/grant';
import { POST_PAYMENT_GRACE_MINUTES } from '@/lib/delivery/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** เก็บแค่สามหลักแรกของเลข IP พอให้ดูออกว่าคนละที่กัน ไม่ต้องรู้ละเอียดกว่านั้น */
function ipPrefix(request: Request): string | null {
  const raw = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (!raw) return null;
  const parts = raw.split('.');
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.x` : raw.slice(0, 12);
}

function deny(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const purchaseParam = url.searchParams.get('purchase');
  const sessionParam = url.searchParams.get('session');

  let purchase: Purchase | null = null;
  /** อีเมลจากใบผ่าน — มีค่าเฉพาะทางที่ 1 ใช้ต่ออายุใบผ่านเมื่อโหลดสำเร็จ */
  let grantedEmail: string | null = null;

  if (sessionParam) {
    /* ทางที่ 2 — เพิ่งจ่ายเงินเสร็จ */
    purchase = await getPurchaseBySession(sessionParam);
    if (!purchase) return deny('ไม่พบคำสั่งซื้อนี้', 404);

    if (purchase.status !== 'paid' || !purchase.paid_at) {
      return deny('ยังยืนยันการชำระเงินไม่สำเร็จ กรุณารอสักครู่', 409);
    }

    const ageMinutes = (Date.now() - new Date(purchase.paid_at).getTime()) / 60_000;
    if (ageMinutes > POST_PAYMENT_GRACE_MINUTES) {
      return deny(
        'ลิงก์นี้หมดอายุแล้ว กรุณาไปที่หน้าดาวน์โหลดแล้วขอรหัสยืนยันทางอีเมล',
        403,
      );
    }
  } else if (purchaseParam) {
    /* ทางที่ 1 — ผ่านด่านรหัสมาแล้ว */
    const jar = await cookies();
    grantedEmail = readGrant(jar.get(GRANT_COOKIE)?.value);
    if (!grantedEmail) {
      return deny('การยืนยันหมดอายุแล้ว กรุณาขอรหัสใหม่', 401);
    }

    const id = Number(purchaseParam);
    if (!Number.isInteger(id) || id <= 0) return deny('คำขอไม่ถูกต้อง', 400);

    purchase = await getPurchaseById(id);
    if (!purchase) return deny('ไม่พบคำสั่งซื้อนี้', 404);

    /*
     * ⚠️ ด่านสำคัญที่สุดของทั้งไฟล์
     * ใบผ่านบอกแค่ว่า "คนนี้พิสูจน์แล้วว่าเป็นเจ้าของอีเมลนี้"
     * ไม่ได้แปลว่าเขามีสิทธิ์ในออเดอร์ที่ส่งเลขมา ต้องเทียบเจ้าของอีกชั้นเสมอ
     * ไม่งั้นใครก็ยืนยันอีเมลตัวเองแล้วเดาเลขออเดอร์ของคนอื่นเอาหนังสือไปได้
     */
    if (purchase.email !== grantedEmail) {
      return deny('คำสั่งซื้อนี้ไม่ใช่ของอีเมลที่ยืนยันไว้', 403);
    }

    if (purchase.status !== 'paid') {
      return deny('คำสั่งซื้อนี้ยังไม่พร้อมให้ดาวน์โหลด', 409);
    }
  } else {
    return deny('คำขอไม่ถูกต้อง', 400);
  }

  const product = await getProductById(purchase.product_id);
  if (!product) return deny('ไม่พบข้อมูลสินค้า', 500);

  /*
   * ตัดโควตาก่อนส่งไฟล์เสมอ
   * ถ้าส่งไฟล์ก่อนแล้วค่อยตัด คนที่กดรัว ๆ จะได้ไฟล์เกินโควตา
   * ผลข้างเคียงที่ยอมรับแล้ว: ถ้าเน็ตลูกค้าหลุดกลางทางเขาเสียโควตาไปหนึ่งครั้ง
   * เซิร์ฟเวอร์ไม่มีทางรู้ว่าโหลดจบจริงไหม ทางแก้คือให้เจ้าของเว็บรีเซ็ตให้เมื่อแจ้งมา
   */
  const used = await consumeDownload(purchase.id);
  if (used === null) {
    return deny(
      `ดาวน์โหลดครบ ${purchase.download_limit} ครั้งแล้ว ถ้ายังต้องการอีก ติดต่อ pornchai.krong@gmail.com ได้เลยครับ`,
      403,
    );
  }

  try {
    const master = await getMasterPdf(product.blob_pathname);
    const stamped = await stampPdf(master, {
      email: purchase.email,
      orderRef: purchase.order_ref,
      issuedOn: todayInBangkok(),
      skipFirstPage: product.watermark_skip_first_page,
    });

    await logDownload(purchase.id, ipPrefix(request), request.headers.get('user-agent'));

    const response = new NextResponse(stamped as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(stamped.byteLength),
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(product.file_name)}`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        /* ให้หน้าเว็บอ่านได้ว่าเหลือกี่ครั้ง โดยไม่ต้องเดาเอง */
        'X-Downloads-Left': String(Math.max(purchase.download_limit - used, 0)),
      },
    });

    /*
     * ต่ออายุใบผ่านทุกครั้งที่โหลดสำเร็จ
     * คนที่กำลังใช้งานอยู่จึงไม่มีวันโดนเตะออกกลางคัน ส่วนคนที่ปิดหน้าไปแล้ว
     * ใบผ่านก็ยังหมดอายุตามกำหนดเดิม ไม่ได้กลายเป็นการจำเครื่องถาวร
     */
    if (grantedEmail) {
      response.cookies.set(GRANT_COOKIE, createGrant(grantedEmail), {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: GRANT_TTL_MINUTES * 60,
      });
    }

    return response;
  } catch (err) {
    console.error('[download] สร้างไฟล์ไม่สำเร็จ', purchase.order_ref, err);
    /*
     * คืนโควตาที่เพิ่งตัดไป เพราะความล้มเหลวตรงนี้เป็นความผิดของฝั่งเราล้วน ๆ
     * (ดึงไฟล์จาก Blob ไม่ได้ หรือประทับ watermark ล้ม) ลูกค้าไม่ได้ไฟล์
     * จึงต้องไม่เสียสิทธิ์ไปด้วย — จุดนี้ปลอดภัยเพราะทำให้ล้มซ้ำ ๆ ตามใจไม่ได้
     * ต่างจากการคืนตอนเน็ตหลุด ซึ่งเซิร์ฟเวอร์แยกไม่ออกว่าได้ไฟล์ครบหรือยัง
     */
    await refundDownload(purchase.id);
    return deny(
      'สร้างไฟล์ไม่สำเร็จ ระบบคืนสิทธิ์ครั้งนี้ให้แล้ว ลองใหม่อีกครั้งได้ ' +
        'ถ้ายังไม่ได้ ติดต่อ pornchai.krong@gmail.com พร้อมแจ้งเลขที่คำสั่งซื้อ ' +
        purchase.order_ref,
      500,
    );
  }
}
