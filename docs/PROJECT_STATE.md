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

## 2026-10-02 — English website release preparation

เจ้าของอนุมัติให้รับงาน Publisher และแก้ทั้ง 5 กลุ่มใน BILINGUAL_REVIEW_2026-10-02.md แล้วเลือก `/english/` สำหรับเว็บไซต์อังกฤษ คง `/en` และ `/en/lab` เป็นหน้าข้อมูลหนังสือเดิม

- รวมใน worktree `C:\โปรเจ็คเล่นสนุกของตี๋\Web Blog\teedba-english-20261002` บนฐาน GitHub main `9240a02`; original checkout ที่ cf2f557 และงานค้างยังไม่ถูกเปลี่ยน
- หน้าสาธารณะอังกฤษและบทความ 3 คู่พร้อมภาพปกล่าสุด; renderer และขั้นตอน download/thank-you ใช้ร่วมกัน แปล error ตามรหัสโดยไม่เปลี่ยนสิทธิ์
- Local verification: lint, TypeScript/build, behavior mocks, content hashes/code blocks, HTTP 22 paired pages + preserved /en, 4 private flows, 8 invalid routes, feeds/sitemap/OG ผ่าน
- Browser local: desktop 1280×720 และ mobile 390×844; search/filter/no-results, TH↔EN, mobile menu และ light/dark ผ่านในหน้าที่ตรวจ
- ใช้ Next.js globalNotFound สำหรับ fallback 404 สองภาษา; build ยังมี metadataBase warning ของ internal fallback แต่ HTTP ที่ตรวจไม่พบ localhost metadata ในหน้าสาธารณะและ unmatched 404
- ไม่ทดสอบเงินจริง ส่ง OTP/อีเมล หรือดาวน์โหลด PDF จริง; Stripe checkout/email locale และ Publisher automation ยังตามระบบเดิม
- GitHub/deployment/live verification: รอใส่หลักฐานหลังเผยแพร่ ไม่ถือ local build เป็นผล production

คู่มือโครงสร้างและดูแลต่อ: [BILINGUAL_SITE.md](BILINGUAL_SITE.md)
- Browser local เพิ่มเติม: public sample preview เปิด/เลื่อน/ปิดได้; หน้า product อังกฤษบนมือถือไม่ล้นแนวนอน และแสดงภาษา PDF ชัดเจน
