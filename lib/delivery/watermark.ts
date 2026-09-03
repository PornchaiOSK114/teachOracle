/**
 * ประทับอีเมลผู้ซื้อลงบน PDF ก่อนส่งมอบ
 *
 * ⚠️ ไฟล์นี้เป็นของฝั่ง server เท่านั้น ห้าม client component import
 *
 * สิ่งที่ฟังก์ชันนี้ทำได้จริงและทำไม่ได้ (เขียนไว้กันเข้าใจผิดในอนาคต):
 *   ทำได้   — บอกได้ว่าไฟล์ที่หลุดออกไปมาจากออเดอร์ไหน และเตือนสติคนที่คิดจะแจกต่อ
 *   ทำไม่ได้ — กันการแจกต่อ ใครได้ไฟล์ไปแล้วส่งต่อได้เสมอ และลายน้ำแบบมองเห็น
 *              ลบออกได้ด้วยเครื่องมือทั่วไป อย่าเข้าใจผิดว่านี่คือ DRM
 *
 * ค่าตำแหน่งด้านล่างไม่ได้เดา วัดจากไฟล์จริงของ Oracle 26ai SQL Tuning มาแล้ว
 * หน้าเนื้อหาทุกหน้ามีขอบบนว่างอย่างน้อย 47 pt และหมึกซ้ายสุดอยู่ที่ 41.5–42.5 pt
 * ตำแหน่งที่เลือกจึงไม่ทับเนื้อหาและตรงแนวกับบล็อกข้อความพอดี
 *
 * ประทับครบ 173 หน้าใช้เวลาราว 0.3 วินาที ไฟล์โตขึ้นราว 0.05 MB
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export type StampOptions = {
  /** อีเมลผู้ซื้อ ใช้เป็นตัวลายน้ำหลัก */
  email: string;
  /** เลขออเดอร์ เช่น 26AI-000142 */
  orderRef: string;
  /** วันที่ออกไฟล์ รูปแบบ YYYY-MM-DD ใช้เฉพาะในเมทาดาทา */
  issuedOn: string;
  /**
   * ข้ามหน้าแรกไหม
   * หน้าปกของเล่มนี้เป็นภาพเต็มหน้า ถ้าประทับทับจะไปเปื้อนงานออกแบบ
   * และหน้าปกคือหน้าที่ลูกค้าถ่ายรูปลงโซเชียลอวดว่าซื้อแล้ว ซึ่งเป็นการตลาดฟรี
   */
  skipFirstPage: boolean;
};

/** ระยะจากขอบซ้าย ตรงแนวกับบล็อกข้อความของเล่ม */
const MARGIN_LEFT = 42;
/** ระยะจากขอบบน อยู่ในเขตขอบว่าง ไม่ทับบรรทัดแรก */
const FROM_TOP = 26;
const FONT_SIZE = 7;
/** เทา 55% อ่านออกเมื่อตั้งใจดู แต่ไม่รบกวนสายตาตอนอ่านเนื้อหา */
const GREY = rgb(0.55, 0.55, 0.55);

/**
 * ตัวอักษรที่ Helvetica แบบ WinAnsi วาดไม่ได้จะทำให้ pdf-lib โยน error
 * อีเมลปกติเป็น ASCII อยู่แล้ว แต่ถ้าลูกค้ากรอกอีเมลที่มีอักษรนอกช่วงนี้
 * (โดเมนภาษาไทยหรืออีโมจิ) เราต้องไม่ปล่อยให้ทั้งคำสั่งซื้อล้มเพราะเรื่องนี้
 * จึงแทนตัวที่วาดไม่ได้ด้วย "?" แทนการโยน error ทิ้ง
 */
function toDrawableAscii(text: string): string {
  return text.replace(/[^\x20-\x7E]/g, '?');
}

/**
 * ประทับลายน้ำแล้วคืนไฟล์ใหม่
 * ไม่แตะไฟล์ต้นฉบับ ไม่เขียนลงดิสก์ ทำงานในหน่วยความจำล้วน
 */
export async function stampPdf(
  masterBytes: Uint8Array | ArrayBuffer,
  options: StampOptions,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(masterBytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const label = toDrawableAscii(`${options.email}  |  ${options.orderRef}`);

  pdf.getPages().forEach((page, index) => {
    if (options.skipFirstPage && index === 0) return;
    const { height } = page.getSize();
    page.drawText(label, {
      x: MARGIN_LEFT,
      y: height - FROM_TOP,
      size: FONT_SIZE,
      font,
      color: GREY,
    });
  });

  /*
   * ลายน้ำชั้นที่สอง ฝังในเมทาดาทาของไฟล์ มองไม่เห็นตอนอ่าน
   * เผื่อกรณีมีคนครอปมุมซ้ายบนทิ้งเพื่อลบลายน้ำที่มองเห็น
   * ต้นทุนแทบเป็นศูนย์ แต่ทำให้การลบร่องรอยยากขึ้นอีกชั้น
   */
  pdf.setSubject(`Licensed to ${options.email}`);
  pdf.setKeywords([
    `order:${options.orderRef}`,
    `licensee:${options.email}`,
    `issued:${options.issuedOn}`,
  ]);
  pdf.setProducer('teedba.com');

  return pdf.save();
}

/** วันที่แบบ YYYY-MM-DD ตามเวลาไทย ใช้กับ issuedOn */
export function todayInBangkok(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}
