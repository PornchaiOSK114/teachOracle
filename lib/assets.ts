/**
 * ตัวช่วยหา "ไฟล์รูปจริง" ใต้ /public — ใช้ได้เฉพาะฝั่ง server เท่านั้น
 *
 * ⚠️ ไฟล์นี้ import `node:fs` → ห้าม client component ('use client') import จากที่นี่เด็ดขาด
 *    ไม่งั้น Turbopack จะพังด้วย `the chunking context does not support external modules`
 *    (ดู AGENTS.md ข้อ H — `tsc` จับบั๊กนี้ไม่ได้)
 *
 * วิธีใช้: ให้ page ฝั่ง server เรียกฟังก์ชันนี้ แล้วส่ง "ผลลัพธ์ที่เป็น string" ต่อให้ client component
 */
import fs from 'node:fs';
import path from 'node:path';

/** นามสกุลที่รองรับ เรียงตามลำดับที่จะลองหา */
const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'] as const;

const HAS_EXTENSION = /\.(png|jpe?g|webp|avif|gif|svg)$/i;

/**
 * รับ path แบบไม่ใส่นามสกุลก็ได้ เช่น `/images/products/x/cover`
 *  - เจอไฟล์ → คืน path พร้อมนามสกุลจริง เช่น `/images/products/x/cover.jpg`
 *  - ไม่เจอ  → คืน `null` (ให้ฝั่งเรียกตัดสินใจว่าจะซ่อนหรือขึ้น placeholder)
 *
 * ทำแบบนี้เพื่อให้เจ้าของเว็บวางไฟล์เป็น .png หรือ .jpg ก็ได้ โดยไม่ต้องแก้โค้ด
 */
export function resolveAsset(basePath: string): string | null {
  const clean = basePath.replace(/^\//, '');
  const candidates = HAS_EXTENSION.test(clean)
    ? [clean]
    : EXTENSIONS.map((ext) => `${clean}${ext}`);

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(process.cwd(), 'public', candidate))) {
      return `/${candidate}`;
    }
  }
  return null;
}

/** หาไฟล์รูปหลายใบพร้อมกัน — ใบไหนไม่มีไฟล์จะถูกตัดทิ้ง (ไม่ทำให้หน้าพัง) */
export function resolveAssets<T extends { file: string }>(
  dir: string,
  items: readonly T[],
): (T & { src: string })[] {
  return items
    .map((item) => {
      const src = resolveAsset(`${dir}/${item.file}`);
      return src ? { ...item, src } : null;
    })
    .filter((x): x is T & { src: string } => x !== null);
}
