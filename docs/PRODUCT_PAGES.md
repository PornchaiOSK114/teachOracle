# หน้าสินค้า — teeDBA.com
อัปเดต 2026-09-16 · [กติกาหลัก](../AGENTS.md) · [Setup](SETUP.md)

หน้าร้านอ่าน products จาก lib/site.ts; /products รวมสินค้า และ /products/[slug] แสดงชื่อ ปก ราคา ตัวอย่าง รายละเอียด และปุ่มสั่งซื้อ
ระบบส่งมอบอ่านตาราง product ใน Neon ซึ่งต้องตรงกับ slug และ Stripe price id จึงไม่ใช่เพิ่ม object หน้าร้านอย่างเดียวแล้วขายได้ครบเส้นทาง
lib/assets.ts ตรวจภาพฝั่ง server แล้วส่ง path ให้ UI ห้าม import เข้า client; SampleCarousel ใช้รูปที่ resolve แล้ว
รักษา min-width: 0 ในส่วน carousel และตรวจ mobile/desktop เมื่อแก้ layout
ไม่มี buyUrl: ปุ่มปิด; มี buyUrl: ปุ่ม "สั่งซื้อ" เปิด Payment Link
metadata และ JSON-LD Product/Offer ต้องตรงกับข้อมูลจริง
โปรโมชันประเมิน endsAt ฝั่ง server และหน้าตั้ง revalidate 900 วินาที จึงไม่รับรองเปลี่ยนตรงวินาที
ใช้ [PRODUCT_TEMPLATE.md](PRODUCT_TEMPLATE.md) เตรียมข้อมูลเพิ่มสินค้า และ [SETUP.md](SETUP.md) ตั้งค่าบริการ/เผยแพร่
