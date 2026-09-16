# Setup — teeDBA.com
อัปเดต 2026-09-16 · กติกาหลัก: [AGENTS.md](../AGENTS.md)

## เตรียมเครื่องและตรวจงาน

1. เปิด terminal ในราก repository ที่ต้องการ ตรวจ git status และ git diff ก่อนเปลี่ยนไฟล์
2. ใช้ Node.js/npm ที่เข้ากับ package.json และ Next.js ที่ติดตั้ง ตรวจ node --version และ npm --version
3. เมื่อต้องติดตั้ง ใช้ npm ci ถ้ามี lockfile ที่ตกลงใช้และตรงกับ package.json; หากต้องสร้าง/เปลี่ยน lockfile ให้ตรวจ diff แยก อย่ารวมไฟล์ค้างเข้ากับงานอื่น
4. เปิดตัวอย่างด้วย npm run dev หากเปิดสองเว็บพร้อมกัน ใช้ npm run dev -- --port 3001 กับเว็บที่สอง
5. งานโค้ดตรวจ npx tsc --noEmit, npm run lint และ npm run build ตามส่วนที่แก้ หากสิ่งแวดล้อมบล็อกให้รายงานเหตุผลจริง ห้ามสรุปว่า build ผ่านจากผลเก่า
6. งานเอกสารอย่างเดียวตรวจรายการไฟล์ diff ลิงก์และความสอดคล้อง ไม่ต้องเชื่อมต่อบริการรับเงินจริงเพื่อพิสูจน์เอกสาร

## GitHub และเผยแพร่

- ตรวจ git remote และ HEAD ของ main บน GitHub ก่อนอัปเดต ไม่ force push และไม่รวมการแก้ไขค้างนอกงาน
- stage เฉพาะชื่อไฟล์ ตรวจ staged diff หรือสร้าง commit ผ่าน connector บน base ที่ตรวจแล้ว
- เผยแพร่เมื่อมีคำอนุญาตสำหรับงานนั้นแล้วตาม AGENTS.md ไม่ต้องขอซ้ำ
- ก่อนอัปเดต main ตรวจว่าไม่มีการเปลี่ยนโค้ด/บทความปนกับงานเอกสาร; main อาจเรียก Vercel auto-deploy
- รายงาน commit จริง แยก GitHub updated ออกจาก deployment READY และจากการทดสอบหน้าเว็บ
- ไม่จำเป็นต้องใช้ .bat หากเครื่องมือ GitHub/Git ที่ได้รับอนุญาตทำได้

## ค่าระบบ

ตั้งค่าลับผ่าน .env.local ในเครื่องหรือ Environment Variables บน Vercel ห้าม commit ค่า:
- DATABASE_URL: Neon; schema อยู่ที่ db/schema.sql ตรวจ schema/ข้อมูลจริงก่อนรัน SQL
- RESEND_API_KEY, RESEND_FROM: อีเมลส่งมอบ/OTP; จากประวัติระบบใช้โดเมน mail.teedba.com ให้ตรวจ verified domain ปัจจุบัน
- STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET และคู่ *_TEST: แยก live/test และจับคู่กับ price id ใน product
- APP_SECRET: HMAC OTP/grant; เปลี่ยนแล้ว grant/รหัสเดิมจะตรวจไม่ผ่าน
- ADMIN_PASSWORD: หน้าประทับด้วยมือ และ Script Properties ของ Apps Script ต้องใช้ค่าที่ตรงกัน
- Vercel Blob: store แบบ private รองรับ OIDC ผ่าน BLOB_STORE_ID ตามการเชื่อมต่อจริง หรือ credential ที่ SDK รองรับ ไม่ถือว่าต้องมี BLOB_READ_WRITE_TOKEN ทุก deployment
- NEXT_PUBLIC_STRIPE_LINK_ORACLE26: URL สาธารณะของ Payment Link ไม่ใช่ secret
- MAILERLITE_API_KEY / MAILERLITE_GROUP_ID: newsletter
- NEXT_PUBLIC_CF_BEACON_TOKEN: Cloudflare Analytics
- NEXT_PUBLIC_SITE_URL และตัวแปร lab/alumni: ตรวจการอ่านจริงใน lib/site.ts ก่อนตั้งค่า

.env.example เป็นรายการช่วยตั้งค่าเดิม ต้องเทียบกับโค้ดและคู่มือนี้ก่อนใช้งาน ไม่ใช่หลักฐานว่า production ตั้งค่าครบแล้ว

## เส้นทางระบบส่งมอบที่มีโค้ด

หน้าสินค้า → Stripe → webhook ตรวจ signature/payment_status → Neon purchase → Resend ส่งลิงก์
หน้าขอบคุณถามสถานะทุก 5 วินาที สูงสุด 60 ครั้ง; หลัง paid มีทางโหลดด้วย session ภายใน 30 นาที
กลับมาภายหลัง → /download → รหัส 6 หลัก → grant cookie 30 นาที → ตรวจเจ้าของออเดอร์/โควตา → Blob private → watermark → PDF
OTP อายุ 10 นาที ขอใหม่เว้น 60 วินาที จำกัด 5 ครั้ง/ชั่วโมง กรอกผิดครบ 5 ครั้งล็อก 15 นาที ตาม lib/delivery/config.ts
download_limit ค่าเริ่มต้น 5 ต่อออเดอร์; ดูฐานข้อมูลจริงก่อนแจ้งจำนวนกับลูกค้า

## ส่งมือผ่าน Google Sheet

แหล่งโค้ด: docs/apps-script/Code.gs; WebApp.gs และ Form.html สำหรับเส้นทางฟอร์มที่เกี่ยวข้อง
1. ตรวจโค้ดที่ติดตั้งจริงบน Apps Script ก่อนเทียบกับ repo
2. เมื่อต้องอัปเดต ให้เจ้าของวางโค้ดและตั้ง Script Property ADMIN_PASSWORD โดยไม่ส่งรหัสในแชตหรือ commit
3. ตรวจ trigger/setupOnce ก่อนใช้; เจ้าของตรวจเงินจริงแล้วพิมพ์ OK
4. สคริปต์ขอ PDF จาก /api/admin/stamp แนบ PDF ที่ประทับแล้วกับ lab ZIP ส่งทาง Gmail และเขียนสถานะ/เลขอ้างอิงลงชีต
5. ทดสอบส่งถึงเจ้าของเมื่อได้รับอนุญาตให้ส่งอีเมล ตรวจลายน้ำและสถานะ หากประทับไม่ได้ต้องไม่ส่ง PDF ดิบ

เกณฑ์ทดสอบ checkout: sandbox ก่อน; live purchase ต้องมีเจ้าของดำเนินการชำระเงินจริง ตรวจ webhook, purchase, delivery_email_sent_at, inbox, สิทธิ์ดาวน์โหลด และลายน้ำ
ผล sandbox ใน handoff เก่าไม่ยืนยันผล production ปัจจุบัน
