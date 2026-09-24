# รูปปกบทความจาก Publisher

การ์ดบทความอ่าน `cover` ใน frontmatter เดิม ใช้ Next Image ในกรอบ 16:9 แบบ contain
ไม่มีภาพใช้แถบสี/เลขลำดับ/หมวดเดิม มีผลร่วมกันใน /articles, หน้าแรก และบทความที่เกี่ยวข้อง

Publisher ส่ง MDX และรูป WebP 1200 × 675 ใน commit เดียวเมื่อเจ้าของอนุมัติและถึงเวลา:

- MDX: `content/articles/<slug>.mdx`
- ภาพ: `public/images/articles/<slug>.webp`
- frontmatter: `cover: "/images/articles/<slug>.webp"` (ไม่ใส่ public)

ตัวอย่างเป็น placeholder ของเอกสารเท่านั้น อย่าเติม cover ถ้ายังไม่มี asset
รักษา title/description/tldr/category/tags/date/draft และเนื้อหาเดิมทุกครั้ง
ไม่ต้องเพิ่ม featuredImage/thumbnail, ไม่ต้องเพิ่ม hero ในหน้าเนื้อหา
lib/content.ts ส่ง cover, Open Graph และ JSON-LD เดิมรองรับ path นี้อยู่แล้ว
ภาพเป็นตกแต่งติดชื่อบทความ จึงใช้ alt ว่าง ไม่อ่านข้อความเดิมซ้ำ

ตรวจ `node scripts/test-article-card.cjs`, `npx tsc --noEmit`, `npm run lint`, `npm run build`
รวมถึง desktop/mobile, theme, search/filter, fallback และ HTTP ของรูปในสภาพแวดล้อมทดสอบ
ภาพ/บทความตัวอย่างต้องอยู่นอก content production หรือเป็น fixture แยก ห้าม push main/deploy โดยไม่ได้อนุมัติ

## Release 24 กันยายน 2026

เจ้าของอนุมัติ deploy Featured Image และอัปเดต Next.js/eslint-config-next เป็น 16.3.6
เพิ่ม lockfile จาก checkout release ที่สะอาดเพื่อให้ production ติดตั้ง dependency ชุดที่ตรวจแล้ว
ไม่คัดลอก lockfile ค้างหรือบทความที่แก้ค้างจากโปรเจกต์ในเครื่อง

ผลก่อน deploy: npm audit ไม่พบช่องโหว่, ArticleCard SSR ผ่าน, production build/TypeScript ผ่าน 25 static pages
ตรวจปกใน fixture จริงผ่าน Image Optimization ได้ ภาพโหลดครบและ object-fit: contain ไม่มี overflow จอ desktop
ตรวจ search/theme ในเบราว์เซอร์แล้ว ไม่มีการนำ fixture หรือปกตัวอย่างขึ้น production
Desktop/mobile ของฟีเจอร์ผ่านการตรวจในรอบก่อนอัปเกรดด้วย

ปรับ ESLint เป็น native flat config ที่แพ็กเกจรองรับ; full lint ยังพบโค้ดเดิม 2 errors ใน Navbar/ThemeToggle
จาก react-hooks/set-state-in-effect และ 1 warning ใน lib/content.ts ไม่ปิดกฎหรือรื้อ component นอกงานเพื่อให้ตัวเลขผ่าน
ไฟล์ release ที่เปลี่ยนและทดสอบ ArticleCard ตรวจ targeted lint แยก
ตั้ง agentRules: false เพื่อไม่ให้ Next.js dev สร้างหรือเปลี่ยนไฟล์คำสั่ง Agent ของเจ้าของ

ตรวจ deployment success ของ commit นี้และ HTTP หน้าเว็บจริงก่อนรายงานเสร็จ
ไม่เติม cover ให้บทความเก่าโดยอัตโนมัติ การส่งปกจริงยังต้องมีภาพที่เลือกและ owner approval ใน Dashboard
ถ้า release กระทบหน้า Articles/หน้าแรก ให้ตรวจ deployment และ revert เฉพาะการเปลี่ยน UI ที่เกี่ยวข้อง
อย่าย้อน Next.js ไป 16.2.6 ที่มีช่องโหว่ หรือ reset งานบทความ/คิว
