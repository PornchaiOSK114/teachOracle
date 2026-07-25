# 📋 บันทึกการเปลี่ยนแปลง — อาจารย์ตี๋ที่สอน Oracle

บันทึกงานพัฒนาตามลำดับเวลา (ใหม่อยู่บนสุด)

---

## 2026-07-25 — เพิ่ม Favicon

ทำ favicon จาก **brand mark บนแถบเมนู** (กรอบสี่เหลี่ยมมุมมนสีขาว + ไอคอนฐานข้อมูลทรงกระบอกสีแดงอิฐ)
ใช้ path เดียวกับ `<svg>` ใน `components/Navbar.tsx` เป๊ะ ๆ

| ไฟล์ | ขนาด | ใช้กับ |
| :--- | :--- | :--- |
| `app/icon.svg` | เวกเตอร์ | เบราว์เซอร์สมัยใหม่ (คมทุกความละเอียด) |
| `app/favicon.ico` | 16 · 32 · 48 · 64 · 128 · 256 | เบราว์เซอร์เก่า, bookmark, ผลค้นหา Google |
| `app/apple-icon.png` | 180×180 | ไอคอนบนหน้าจอโฮม iOS/iPadOS |

Next.js App Router ตรวจเจอไฟล์ตามชื่อเหล่านี้เอง แล้วใส่ `<link rel="icon">` /
`<link rel="apple-touch-icon">` ให้ทุกหน้าอัตโนมัติ — ไม่ต้องเขียนใน `layout.tsx`

**รายละเอียดที่ปรับเป็นพิเศษ**

- แต่ละขนาดใน `.ico` **เรนเดอร์แยกกัน** ไม่ได้ย่อจากรูปเดียว เพราะถ้าย่อจาก 256 → 16
  ทรงกระบอก 3 ชั้นจะเบลอติดกันจนอ่านไม่ออก
  ที่ 16px จึงขยายไอคอนเป็น 80% ของกรอบ (จาก 60%) และลดความหนาเส้นสัมพัทธ์ลง
- `apple-icon.png` ทำเป็น full-bleed ไม่มีมุมมน/พื้นโปร่ง เพราะ iOS ตัดมุมและใส่พื้นให้เอง
  ถ้าปล่อยโปร่งไว้จะกลายเป็นพื้นดำ
- ไม่ได้ใช้ `next/og` สร้างไอคอน เพราะ WASM renderer ทำ build worker ตายในแซนด์บ็อกซ์
  (ตรวจสอบไม่ได้) — ใช้สคริปต์ PIL เรนเดอร์เป็นไฟล์จริงแทน ตรวจผลได้ทันที

**ผลการตรวจ:** `next build` ผ่าน 17/17 หน้า · ทุกหน้ามี `<link>` ครบทั้ง 3 แบบ ·
ไฟล์ `.ico` ที่ build ออกมามีครบ 6 เฟรม

---

## 2026-07-25 — สร้างเว็บครั้งแรก (initial build)

สร้างเว็บใหม่ทั้งหมด โดยใช้ **สถาปัตยกรรมเดียวกับ `kruteekidcode-blog`**
(ตาม `docs/AGENT_PLAYBOOK.md` ของ repo นั้น) แต่ใช้ **ดีไซน์จากแพ็ก `ClaudeDesign/`**

### สิ่งที่ทำ

**โครงและ stack**

- Next.js 16 (App Router) + React 19 + TypeScript strict
- MDX ผ่าน `next-mdx-remote/rsc` — เนื้อหาเป็นไฟล์ `.mdx` ไม่มี DB/CMS
- ฟอนต์ IBM Plex Sans Thai (`subsets: ['thai','latin']`) + IBM Plex Mono ผ่าน `next/font/google`
- CSS ธรรมดา ไม่มี Tailwind

**Design system** — port ค่าจาก `ClaudeDesign/design-tokens.css` เข้า `app/globals.css`

- accent แดงอิฐ Oracle `#b23a2b` · แถบเมนู `#b0271a`
- Light / Dark ผ่าน `data-theme` บน `<html>` + สคริปต์ใน `<head>` set ค่าก่อน paint (กันจอกระพริบ)
- radius 11 / 16 / 22 / 999 · spacing ฐาน 4px · เงาใช้ตัวแปรเดียว `--shadow`
- mobile-first, ใช้ `clamp()` แทน media query หลายชั้น — มี media query จุดเดียวที่ `860px`

**7 หน้า + ระบบ**

| Route | เนื้อหา |
| :--- | :--- |
| `/` | hero + สถิติ + แถบความเชี่ยวชาญ + บทความล่าสุด 6 + 6 หลักสูตร + CTA |
| `/articles` | รายการบทความ + ค้นหา + กรองหมวด (แสดงเฉพาะหมวดที่มีบทความจริง) |
| `/articles/[slug]` | อ่านบทความ MDX + TL;DR + สารบัญอัตโนมัติ + บทความที่เกี่ยวข้อง |
| `/courses` | 6 หลักสูตรจริง + CTA ติดต่อ TTC |
| `/about` | โปรไฟล์ + timeline + ผลงานเขียน 3 + ช่องโลโก้ลูกค้า 25 |
| `/products` | empty state "เร็ว ๆ นี้" + ฟอร์ม MailerLite |
| `/contact` | ช่องทางอาจารย์ตี๋ (อีเมล, Facebook) + ช่องทาง TTC |
| ระบบ | `not-found`, `sitemap.xml`, `robots.txt`, `feed.xml`, `opengraph-image`, `llms.txt` |

**SEO / GEO / AIO**

- metadata + canonical + OG/Twitter ต่อหน้า
- JSON-LD: `WebSite`, `Person`, `BlogPosting`, `Course` ×6, `BreadcrumbList`,
  `ProfilePage`, `ContactPage`, `CollectionPage`
- `robots.ts` อนุญาต AI crawler ชัดเจน (GPTBot, ClaudeBot, PerplexityBot, Google-Extended ฯลฯ)
- `/llms.txt` สร้างอัตโนมัติจาก `lib/site.ts` + บทความจริง
- ทุกบทความบังคับมีช่อง `tldr` ในหัวไฟล์ → แสดงเป็นกล่อง TL;DR ต้นหน้า
- `opengraph-image.tsx` โหลดฟอนต์ไทยจาก Google Fonts (ฟอนต์เริ่มต้นของ `next/og` ไม่มีสระไทย)
  พร้อม fallback เป็นอักษรละตินถ้าโหลดไม่สำเร็จ — build ไม่พังแน่นอน

**Newsletter**

- `app/api/subscribe/route.ts` → MailerLite ฝั่งเซิร์ฟเวอร์ (API key เป็น secret)
- มีข้อความยินยอมตาม **PDPA** ใต้ฟอร์ม
- ถ้ายังไม่ตั้ง `MAILERLITE_API_KEY` จะตอบ 503 พร้อมข้อความไทยตรงไปตรงมา
  ไม่แกล้งทำเป็นสมัครสำเร็จ

**ระบบรูปภาพ**

- `components/AssetImage.tsx` ตรวจว่ามีไฟล์ใน `public/` จริงหรือยัง
  มี → `<Image>` ของ Next (AVIF/WebP + srcset), ไม่มี → กล่อง placeholder
- เจ้าของเว็บแค่วางไฟล์ตามชื่อใน `public/images/README.txt` แล้วรูปขึ้นเอง

### บั๊กที่เจอตอนตรวจ และวิธีแก้

**`node:fs` หลุดเข้า client bundle → build พัง**

`components/ArticleCard.tsx` เคย `import { formatDateThai } from '@/lib/content'`
ซึ่งเป็น *value import* — และ `ArticleCard` ถูกใช้ใน `ArticleList.tsx` (`'use client'`)
Turbopack จึงพยายามยัด `lib/content.ts` (ที่ใช้ `node:fs`) เข้า client bundle แล้วพังด้วย
`the chunking context does not support external modules (request: node:fs)`

> ⚠️ `tsc --noEmit` **จับบั๊กนี้ไม่ได้** เพราะ type ถูกต้องทุกอย่าง — เจอตอน `next build` เท่านั้น

**แก้โดยแยกไฟล์ตามขอบเขต server/client**

- `lib/format.ts` — `formatDateThai`, `slugifyHeading` (ฟังก์ชันบริสุทธิ์ ไม่แตะ fs)
- `lib/types.ts` — `Article`, `ArticleMeta` (type อย่างเดียว)
- `lib/content.ts` — คงงานที่ต้องใช้ fs ไว้ แล้ว re-export ของจากสองไฟล์บนเพื่อความสะดวกฝั่ง server

### ผลการตรวจ (verification)

| รายการ | ผล |
| :--- | :--- |
| `tsc --noEmit` บนซอร์สจริง | ✅ ผ่าน ไม่มี error |
| `next build` (Turbopack) | ✅ Compiled successfully · prerender 14/14 หน้า |
| JSON-LD หน้าแรก | ✅ `WebSite`, `Person` |
| JSON-LD หน้าคอร์ส | ✅ `BreadcrumbList` + `Course` ครบ 6 |
| JSON-LD หน้าบทความ | ✅ `BlogPosting` (มี `abstract`, `timeRequired`, `wordCount`) + `BreadcrumbList` |
| `robots.txt` | ✅ อนุญาต AI crawler 13 ตัว + Sitemap + Host |
| `sitemap.xml` | ✅ ทุกหน้า + บทความ พร้อม lastmod/priority |
| `feed.xml` | ✅ RSS 2.0 ถูกต้อง มี `dc:creator` |
| `llms.txt` | ✅ สร้างจากข้อมูลจริง (ผู้เขียน, 6 หลักสูตร, รายการบทความ) |
| ข้อความไทย render ฝั่ง server | ✅ อยู่ใน HTML จริง ไม่ซ่อนหลัง JS (สำคัญต่อ GEO/AIO) |
| สารบัญบทความ | ✅ ลิงก์ `#anchor` ตรงกับ `id` ของ H2 ทุกตัว |
| MDX pipeline | ✅ ตาราง, blockquote, code highlight (hljs), วันที่ พ.ศ. |

**สองอย่างที่ตรวจในแซนด์บ็อกซ์ไม่ได้ (ข้อจำกัดสภาพแวดล้อม ไม่ใช่บั๊กโค้ด)**

1. **`next/font/google`** — proxy ของแซนด์บ็อกซ์บล็อก `fonts.googleapis.com` (HTTP 403)
   จึงทดสอบ build โดย stub ฟอนต์ออกชั่วคราว บน Vercel จะโหลดได้ปกติ
2. **`opengraph-image.tsx`** — `next/og` (WASM renderer) ทำให้ worker ตาย `SIGBUS`
   ทดสอบแล้วว่าแม้เป็น OG image ธรรมดาที่สุดก็ SIGBUS เหมือนกัน ⇒ เป็นข้อจำกัดหน่วยความจำ/mmap
   ของแซนด์บ็อกซ์ ไม่ใช่โค้ด (repo อ้างอิง `kruteekidcode-blog` ใช้ Next เวอร์ชันเดียวกัน
   และ deploy บน Vercel ได้ปกติ)

   👉 **หลัง deploy ให้เปิด `<URL>/opengraph-image` ดูสักครั้งเพื่อยืนยัน**

### สิ่งที่ **ยังไม่มี** (รอข้อมูลจากเจ้าของเว็บ)

- **บทความจริง** — มีแต่ไฟล์ตัวอย่าง `_template-execution-plan.mdx` ที่ตั้ง `draft: true`
  ไว้สาธิตโครง (ไม่ขึ้นเว็บจริง) ลบทิ้งได้เมื่อเขียนบทความเองแล้ว
- **รูปภาพทั้งหมด** — รูปที่อัปโหลดตอนออกแบบใน Claude Design ไม่ได้ถูก export มาด้วย
  (ไฟล์ prototype 900KB มีแต่ฟอนต์ woff2 41 ไฟล์ + JS ไม่มีรูปเลย)
  ตอนนี้จึงเป็น placeholder ทั้งหมด
- **ชื่อองค์กรลูกค้า 25 ราย** — ยังไม่ได้รับการยืนยัน จึงใส่แค่ช่องเปล่าโดยไม่ระบุชื่อใด ๆ
- **โดเมนจริง** — ใช้ URL ของ Vercel ไปก่อน ตั้ง `NEXT_PUBLIC_SITE_URL` ทับเมื่อจดโดเมนแล้ว
