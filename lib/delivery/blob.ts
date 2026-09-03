/**
 * หยิบไฟล์ต้นฉบับจาก Vercel Blob
 *
 * ⚠️ ไฟล์นี้เป็นของฝั่ง server เท่านั้น ห้าม client component import
 *
 * หลักการที่ห้ามละเมิด: ไฟล์ต้นฉบับที่ยังไม่ประทับ watermark ต้องไม่มี URL สาธารณะ
 * และต้องไม่ถูกส่งออกจากเซิร์ฟเวอร์ในสภาพที่ยังไม่ประทับ ไม่ว่ากรณีใด
 * ฟังก์ชันในไฟล์นี้จึงคืนค่าเป็น "ไบต์ในหน่วยความจำ" เท่านั้น ไม่เคยคืน URL
 *
 * ไฟล์ใน Blob ต้องอัปโหลดแบบ private ถ้าเผลออัปโหลดเป็น public
 * URL ของมันจะเปิดได้โดยไม่ต้องใช้กุญแจ ซึ่งทำให้ระบบทั้งหมดนี้ไร้ความหมาย
 */
import { get } from '@vercel/blob';

/**
 * เก็บไฟล์ต้นฉบับไว้ในหน่วยความจำของฟังก์ชันที่ยังไม่ถูกเก็บคืน
 *
 * ฟังก์ชันบน Vercel ถูกใช้ซ้ำได้ถ้ามีคนเรียกติด ๆ กัน การจำไว้แบบนี้ทำให้
 * การดาวน์โหลดครั้งถัด ๆ ไปไม่ต้องวิ่งไปหยิบไฟล์เดิมซ้ำ ประหยัดทั้งเวลาและปริมาณข้อมูล
 * ไฟล์แค่ 1.7 MB จึงไม่มีปัญหาเรื่องหน่วยความจำ
 *
 * ถ้าเปลี่ยนไฟล์หนังสือใหม่ ของเก่าอาจค้างอยู่ไม่กี่นาทีจนฟังก์ชันถูกเก็บคืน
 * ซึ่งยอมรับได้ เพราะการเปลี่ยนไฟล์หนังสือเกิดขึ้นนาน ๆ ครั้ง
 */
const cache = new Map<string, Uint8Array>();

export async function getMasterPdf(pathname: string): Promise<Uint8Array> {
  const cached = cache.get(pathname);
  if (cached) return cached;

  const result = await get(pathname, { access: 'private' });
  if (!result || result.statusCode !== 200) {
    throw new Error(
      `หาไฟล์ "${pathname}" ใน Vercel Blob ไม่เจอ — ตรวจว่าอัปโหลดแล้วและเป็นแบบ private`,
    );
  }

  const bytes = new Uint8Array(await new Response(result.stream).arrayBuffer());
  cache.set(pathname, bytes);
  return bytes;
}
