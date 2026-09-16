# ครูตี๋ที่สอน Oracle — teeDBA.com

เอกสารหลักชุดใหม่ที่เจ้าของยืนยัน 2026-09-16 · Codex ดูแลทั้ง teeDBA.com และ KruTeeKidCode.com

เว็บความรู้ Oracle สำหรับ DBA/Developer/Data Engineer พร้อมหน้าหลักสูตร หน้าสินค้า และระบบส่งมอบ e-book ผ่าน Stripe/Neon/Resend/Vercel Blob

## เริ่มอ่าน
- [กติกาของ Codex และผู้ร่วมพัฒนา](AGENTS.md)
- [Setup และ workflow](docs/SETUP.md)
- [สถานะระบบและงานค้าง](docs/PROJECT_STATE.md)
- [คู่มือเขียนเนื้อหา](WRITING_GUIDE.md)
- [ประวัติการเปลี่ยนแปลง](docs/CHANGELOG.md)

## โครงสร้าง
- app/: หน้าเว็บและ API
- components/: UI ที่ใช้ซ้ำ
- content/: บทความ MDX
- lib/: อ่านเนื้อหาและตรรกะ รวมระบบส่งมอบใน lib/delivery/
- public/: รูปและไฟล์สาธารณะ
- scripts/: ตัวช่วยสร้างบทความ
- db/schema.sql: โครงฐานข้อมูลส่งมอบ
- docs/apps-script/: ต้นฉบับสคริปต์ส่งมือบน Google Sheet

## คำสั่ง
รันในราก repo: npm run dev, npm run build, npm run start, npm run lint, npx tsc --noEmit
สร้างบทความ: npm run new:post <slug> "ชื่อบทความ"

บทความเก็บเป็นไฟล์ ส่วนออเดอร์และสิทธิ์ดาวน์โหลดใช้ Neon ไม่ใช่ระบบที่ไม่มีฐานข้อมูลทั้งหมด

การมีโค้ดไม่ได้ยืนยันสถานะ production อ่านข้อจำกัดใน PROJECT_STATE ก่อนรายงาน
