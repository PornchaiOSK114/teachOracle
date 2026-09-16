# สถานะโปรเจ็กต์ — teeDBA.com
ตรวจจากไฟล์ในเครื่อง 2026-09-16; ไม่ใช่ผลทดสอบ production
กติกา: [AGENTS.md](../AGENTS.md) · ขั้นตอน: [SETUP.md](SETUP.md)

## สิ่งที่มีแล้ว
Next.js/React/TypeScript, บทความ MDX, หน้าหลักสูตร/โปรไฟล์/ติดต่อ, หน้าสินค้า, lab ไทย/อังกฤษ และระบบ e-book:
Stripe webhook, Neon, Resend, Blob private, OTP/grant, watermark, download quota และ API stamp สำหรับ Apps Script
ข้อมูลหน้าร้านอยู่ lib/site.ts; ตารางส่งมอบคือ product, purchase, download_log, otp, email_throttle
ระบบซื้อสำเร็จไม่ได้รับประกันอีเมลถึง inbox ต้องตรวจหลักฐานการส่งจริง

## ต้องตรวจสถานะภายนอกใหม่
- เวอร์ชัน Apps Script และ ADMIN_PASSWORD ที่ตั้งจริง: handoff 2026-09-05 เคยระบุว่ายังไม่ได้อัปเดต แต่ยังไม่ตรวจซ้ำ
- การซื้อ live พร้อมเพย์ครบเส้นทาง: handoff เดิมยังไม่เคยพิสูจน์ ไม่สรุปว่าไม่มีการซื้อเกิดขึ้นหลังจากนั้น
- คืนเงินอัตโนมัติ: webhook ที่ตรวจยังไม่มี charge.refunded handler; Google Sheet สรุปยอดอัตโนมัติยังเป็นแผน
- ตรวจ errata แยกภาษา: พบ errataEn ใน lib/site.ts จึงไม่เหมารวมว่าไม่มี errata ทุกส่วน

## งานเดิมที่ค้างและต้องรักษา
ก่อนงานเอกสาร: บทความ _example-thai-charset.mdx ถูกแก้, ora-01555-snapshot-too-old.mdx ถูกลบ และ package-lock.json เป็น untracked
อย่ารวมเข้า commit เอกสารหรือคืนไฟล์โดยไม่ได้รับคำสั่ง
Snapshot .agent-handoff/current เดิมเลิกใช้หลังปรับเอกสารชุดนี้; สำเนาก่อนลบเก็บไว้นอก repository
