# อาจารย์ตี๋ที่สอน Oracle — เว็บบล็อก

เว็บบล็อกส่วนตัวของ **พรชัย ครองธรรมชาติ (อาจารย์ตี๋)** ผู้เชี่ยวชาญ Oracle Database ระดับ OCP
สร้างด้วย Next.js 16 + MDX · ไม่มีฐานข้อมูล ไม่มี CMS — เขียนบทความเป็นไฟล์ `.mdx` แล้ว push ขึ้น GitHub

---

## เริ่มใช้งาน

```bash
npm install
npm run dev          # เปิด http://localhost:3000 (เห็นบทความ draft ด้วย)
```

คำสั่งอื่น

```bash
npm run build        # build เว็บจริง (ซ่อน draft)
npm run typecheck    # ตรวจ TypeScript
npm run lint
```

---

## เขียนบทความใหม่ (ทำบ่อยที่สุด)

```bash
npm run new:post read-execution-plan "อ่าน Execution Plan ให้เป็น"
```

จะได้ไฟล์ `content/articles/read-execution-plan.mdx` พร้อมหัวไฟล์ให้แล้ว
เปิดขึ้นมาเขียนเนื้อหาต่อได้เลย

### หัวไฟล์ (frontmatter) แต่ละช่องคืออะไร

| ช่อง | ความหมาย |
| :--- | :--- |
| `title` | ชื่อบทความ |
| `description` | คำอธิบายสั้น ~150 ตัวอักษร — โผล่บนการ์ดและผลค้นหา Google |
| `tldr` | **สรุปคำตอบ 1–2 ประโยค** ขึ้นต้นบทความ · สำคัญมาก เพราะ AI (ChatGPT/Claude/Perplexity) จะหยิบส่วนนี้ไปตอบผู้ใช้แล้วอ้างอิงกลับมาที่เว็บเรา |
| `category` | เลือก 1 หมวดจาก: DBA · Performance · Backup & Recovery · PL/SQL · RAC · Oracle Linux · Data Engineer · Data Science · SQL |
| `tags` | คำค้น ใช้จับคู่ "บทความที่เกี่ยวข้อง" |
| `date` | `YYYY-MM-DD` เท่านั้น (ระบบเช็คให้) |
| `cover` | รูปปก (ไม่ใส่ก็ได้ — จะใช้แบนเนอร์ตัวเลขแทน) |
| `draft` | `true` = ยังไม่ขึ้นเว็บจริง · เขียนเสร็จเปลี่ยนเป็น `false` |

> เคล็ดลับให้ติดอันดับดี: ย่อหน้าแรกให้ **ตอบคำถามตรง ๆ** อย่าเกริ่นยาว
> แล้วแบ่งเนื้อหาด้วยหัวข้อ `##` ให้ชัด (ระบบจะสร้างสารบัญให้อัตโนมัติ)

---

## ใส่รูปภาพ

วางไฟล์ตามชื่อด้านล่างใน `public/images/` แล้วรูปจะขึ้นเอง **ไม่ต้องแก้โค้ด**
(ยังไม่มีไฟล์ = แสดงกล่อง placeholder ไม่พัง)

```
public/images/
├── profile.jpg                     รูปอาจารย์ตี๋ (แนะนำ 800×800 ขึ้นไป)
├── books/windows-it-pro.jpg        ปกนิตยสาร Windows IT Pro
├── books/apps-yodhit.jpg           ปก "Apps ยอดฮิต ติดใจ"
├── books/brand-social.jpg          ปก "สร้างแบรนด์ทำเงินด้วยโซเชียลมีเดีย"
└── customers/org-01.png … org-25.png   โลโก้ลูกค้า (PNG พื้นหลังโปร่ง)
```

---

## แก้ข้อมูลบนเว็บ

ข้อมูลคงที่ทั้งหมดอยู่ที่ **`lib/site.ts` ไฟล์เดียว** — หลักสูตร, ผลงานเขียน, ช่องทางติดต่อ,
ความเชี่ยวชาญ, ตัวเลขบนหน้าแรก แก้ที่นี่แล้วเปลี่ยนทั้งเว็บ

สี/ฟอนต์/ระยะห่าง อยู่ที่ `app/globals.css` บล็อก `:root` และ `[data-theme="dark"]`

---

## ตั้งค่าฟอร์มรับข่าว (MailerLite)

ฟอร์มหน้า `/products` ต่อกับ MailerLite ผ่าน API ฝั่งเซิร์ฟเวอร์ (API key ไม่รั่วออกหน้าเว็บ)

ตั้ง environment variables บน **Vercel › Settings › Environment Variables**

| ตัวแปร | จำเป็น | เอามาจากไหน |
| :--- | :--- | :--- |
| `MAILERLITE_API_KEY` | ✅ | MailerLite › Integrations › API |
| `MAILERLITE_GROUP_ID` | – | ถ้าอยากให้ผู้สมัครเข้ากลุ่มที่กำหนด |
| `NEXT_PUBLIC_SITE_URL` | ✅ (เมื่อมีโดเมน) | URL จริงของเว็บ เช่น `https://ajarntee.com` |

ถ้ายังไม่ตั้ง `MAILERLITE_API_KEY` ฟอร์มจะแจ้งผู้ใช้ตรง ๆ ว่าระบบยังไม่พร้อม
(ไม่แกล้งทำเป็นสมัครสำเร็จ)

แนะนำเปิด **double opt-in** ใน MailerLite ให้ตรงกับข้อความ "กรุณาตรวจอีเมลเพื่อยืนยัน" ที่ฟอร์มแสดง

---

## นำขึ้นเว็บ (Deploy)

GitHub → Vercel auto-deploy — push ขึ้น `main` แล้ว Vercel build ให้เอง

```bash
git add -A
git commit -m "เพิ่มบทความใหม่"
git push origin main
```

รอสักครู่แล้วเปิดเว็บดูได้เลย

---

## เอกสารเพิ่มเติม

- `AGENTS.md` — คู่มือสำหรับ AI agent ที่มาทำงานต่อ (สถาปัตยกรรม, กติกา, gotchas)
- `docs/CHANGELOG.md` — บันทึกการเปลี่ยนแปลง
- `ClaudeDesign/` — ไฟล์ดีไซน์ต้นฉบับ (ไม่ขึ้น repo)
