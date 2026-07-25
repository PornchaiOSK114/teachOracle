/**
 * ฟังก์ชันช่วยจัดรูปแบบข้อความ — "บริสุทธิ์" ไม่แตะระบบไฟล์
 *
 * ⚠️ ห้ามย้ายฟังก์ชันเหล่านี้กลับไปไว้ใน lib/content.ts เด็ดขาด
 * เพราะ client component (เช่น ArticleCard) เรียกใช้ ถ้าอยู่ไฟล์เดียวกับ `node:fs`
 * Next จะพยายามยัด fs เข้า client bundle แล้ว build พัง
 */

const THAI_MONTHS = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

/** '2026-07-12' -> '12 ก.ค. 2569' (พ.ศ.) */
export function formatDateThai(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${THAI_MONTHS[m - 1]} ${y + 543}`;
}

/** เลียนแบบวิธี slug ของ github-slugger ที่ rehype-slug ใช้ (รองรับอักษรไทย) */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[!"#$%&'()*+,./:;<=>?@[\]^`{|}~\\]/g, '')
    .replace(/\s+/g, '-');
}
