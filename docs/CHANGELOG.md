# 📋 บันทึกการเปลี่ยนแปลง — อาจารย์ตี๋ที่สอน Oracle

บันทึกงานพัฒนาตามลำดับเวลา (ใหม่อยู่บนสุด)

---

## 2026-08-18 — เปิดขาย E-Book "Oracle 26ai SQL Tuning" บนหน้า /products

### สรุป

หน้า `/products` เปลี่ยนจาก empty state "กำลังจะมาเร็ว ๆ นี้" เป็นหน้าขายจริง
พร้อมหน้ารายละเอียดสินค้าใหม่ `/products/[slug]` และ carousel อ่านตัวอย่าง 15 หน้า

### ไฟล์ที่เพิ่ม

| ไฟล์ | ทำอะไร |
| :--- | :--- |
| `lib/assets.ts` | หาไฟล์รูปใต้ `/public` โดยลองนามสกุลให้เอง (`.png` → `.jpg` → `.jpeg` → `.webp`) — **server-only** เพราะใช้ `node:fs` |
| `components/SampleCarousel.tsx` | `'use client'` — carousel อ่านตัวอย่าง: scroll-snap, ปุ่ม ←/→, แถบ thumbnail, คีย์บอร์ด, ขยายเต็มจอ |
| `app/products/[slug]/page.tsx` | หน้ารายละเอียดสินค้า + `generateStaticParams` + JSON-LD `Product`/`Offer`/`BreadcrumbList` |
| `public/images/products/oracle-26-ai-sql-tuning/` | ปก 1 + สารบัญ 9 + ผู้เขียน 1 + ตัวอย่างเนื้อหา 5 = 16 ไฟล์ (1.93 MB) |

### ไฟล์ที่แก้

- `lib/site.ts` — เพิ่ม type `Product` / `ProductSection` / `ProductSample`, array `products`, ฟังก์ชัน `getProduct()`
  และตัด E-book ออกจาก `upcomingProducts` (เหลือ Online Course + Toolkit)
- `app/products/page.tsx` — เขียนใหม่เป็น 2 โซน: "พร้อมจำหน่าย" (การ์ดปกเล็ก) กับ "กำลังจะมา" (ยังติด SOON)
- `app/globals.css` — หมวด 17 (คลาสหน้าผลิตภัณฑ์ + carousel) แทรกไว้**ก่อน** บล็อก `prefers-reduced-motion`
- `app/sitemap.ts` — เพิ่ม `/products/[slug]` อัตโนมัติจาก `products`
- `app/llms.txt/route.ts` — เดิมเขียนว่า "ยังไม่เปิดขาย" เปลี่ยนเป็นรายการสินค้าจริงพร้อมราคา
- `.env.example`, `public/images/README.txt`

### การตัดสินใจที่ต้องรู้

**ปุ่มสั่งซื้ออ่านจาก `NEXT_PUBLIC_STRIPE_LINK_ORACLE26`** — ไม่ตั้งค่า = ปุ่ม disable + ขึ้น "เปิดสั่งซื้อเร็ว ๆ นี้"
และมีบรรทัดชี้ไป `/contact` ให้แทน · ใส่ค่าที่ Vercel แล้ว redeploy = ปุ่มทำงานทันที ไม่ต้องแก้โค้ด

**ราคาโผล่ใน JSON-LD `Offer` (790 THB, InStock)** — Google อาจแสดงราคาในผลค้นหา (เจ้าของเว็บยืนยันแล้ว)

**ปกเก็บเป็น `.jpg` แต่หน้าในเล่มเป็น `.png`** — ปกเป็นภาพถ่าย JPEG คุ้มกว่า (1003 KB → 201 KB)
ส่วนหน้าหนังสือเป็นตัวอักษรบนพื้นขาว ใช้ PNG palette 64 สี คมเท่าเดิมแต่เล็กลง ~70%
`lib/assets.ts` หานามสกุลให้เอง จึงปนกันได้โดยไม่ต้องแก้โค้ด

### Gotcha ใหม่ที่เจอ (สำคัญ)

**CSS Grid + carousel = เนื้อหาถูกทับ** — ต้นแบบแรกวาง carousel ไว้ในคอลัมน์ของ grid
สไลด์ที่กว้าง `100%` ดันคอลัมน์จนล้นไปทับข้อความข้าง ๆ
เพราะ grid item มี `min-width: auto` เป็นค่าเริ่มต้น จึงหดต่ำกว่า min-content ไม่ได้
⇒ ทุกชั้นของ carousel ต้องมี `min-width: 0` และปุ่มลูกศรย้ายมาอยู่ **ใต้รูป** แทนการลอยทับ

### การตรวจสอบ

- `tsc --noEmit` ผ่าน
- `next build` (Turbopack, production) ผ่าน — สำคัญเพราะเป็นตัวเดียวที่จับ gotcha ข้อ H (`node:fs` หลุดเข้า client bundle) ได้
- `next start` แล้วถ่ายภาพหน้าจอจริงด้วย Playwright: desktop / mobile 390px / dark mode — ไม่มีส่วนไหนทับกัน
- `/products/oracle-26-ai-sql-tuning` ถูก prerender เป็น static HTML และเข้า `sitemap.xml` แล้ว

### ยังไม่ได้ทำ (คุยกันไว้ว่าแยกงาน)

- หน้า `/lab` — ในคำนำหนังสือเขียนว่าดาวน์โหลดชุดแล็บได้ที่ `teedba.com/lab` แต่ route นี้ยังไม่มี (เจ้าของเว็บจะพิจารณาตัดออกจากหนังสือ เพราะแถมไฟล์ไปพร้อมเล่มอยู่แล้ว)
- หน้า/ส่วน "ข้อแก้ไขและอัปเดต" (errata)

## 2026-07-26 — ชุดเอกสารครบ + ความสามารถฝังวิดีโอ/เสียง

### โค้ดที่เพิ่ม (ทำก่อนเขียนเอกสาร เพื่อไม่ให้เอกสารโกหก)

`components/mdx/index.tsx` — component ที่เรียกใช้จากในไฟล์ `.mdx` ได้โดยตรง

| Component | ใช้ทำอะไร |
| :--- | :--- |
| `<YouTube id="..." />` | ฝังวิดีโอ YouTube (ใช้ `youtube-nocookie.com` ไม่วาง cookie) |
| `<Vimeo id="..." />` | ฝังวิดีโอ Vimeo (ใส่ `dnt=1`) |
| `<SoundCloud url="..." />` | ฝังเสียงจาก SoundCloud |
| `<Audio src="..." />` | ไฟล์เสียงของเราเองใน `public/audio/` |
| `<Figure src alt caption />` | รูปพร้อมคำบรรยายใต้ภาพ |
| `<Callout type="warning">` | กล่องเน้นข้อความ 3 แบบ (tip / warning / danger) |
| `<ExternalLink href="...">` | ลิงก์เปิดแท็บใหม่แบบปลอดภัย |

- เชื่อมเข้า `MDXRemote` ผ่าน prop `components`
- CSS เพิ่มใน `globals.css` หมวด 13b (embed) และ 13c (callout)
- วิดีโอทุกตัว `loading="lazy"` + ใช้ `aspect-ratio` จองพื้นที่ล่วงหน้า → **ไม่เกิด CLS**
- เลือกโดเมนแบบไม่วาง cookie ให้สอดคล้องกับที่เว็บนี้ไม่มีแบนเนอร์ขอความยินยอม

### เอกสารที่สร้าง/ขยาย

| ไฟล์ | สถานะ | เนื้อหา |
| :--- | :--- | :--- |
| `WRITING_GUIDE.md` | 🆕 ใหม่ | คู่มือเขียนบทความ 14 หัวข้อ — frontmatter, Markdown, โค้ด SQL, ตาราง, รูป, ลิงก์, ฝังวิดีโอ/เสียง, callout, **เทคนิคเขียนให้ติด Google/AI 6 ข้อ**, checklist ก่อนเผยแพร่, ตารางแก้ปัญหา |
| `README.md` | ขยาย | เพิ่มแผนผัง directory แบบมีคำอธิบายรายไฟล์, ชุดสีทั้ง light/dark, ตารางคำสั่ง, สรุปฟีเจอร์ 3 กลุ่ม, ตาราง env, ข้อมูลโครงสร้างพื้นฐาน |
| `docs/AGENT_PLAYBOOK.md` | 🆕 ใหม่ | สูตรสร้างเว็บซ้ำ — **gotchas 11 ข้อจากปัญหาจริง** พร้อมคำสั่ง verification ที่ใช้ได้จริง |
| `docs/ANALYTICS.md` | ขยาย | เพิ่มหมวด 3–4: วิธีอ่านตัวเลข Cloudflare + Search Console และ**เทคนิคใช้ Queries เลือกหัวข้อบทความถัดไป** |
| `AGENTS.md` | ขยาย | เพิ่มรายการ MDX components + ตารางว่าเอกสารไหนอ่านเมื่อไหร่ |
| `content/articles/_template-execution-plan.mdx` | ปรับ | ทำเป็นตัวอย่างเต็มที่ใช้ทุกฟีเจอร์ (ตาราง 4 คอลัมน์, callout 2 แบบ, โค้ด SQL 2 ก้อน) + คอมเมนต์ตัวอย่างการใช้ component ทุกตัว |

### ผลการตรวจ

| รายการ | ผล |
| :--- | :--- |
| `tsc --noEmit` | ✅ ผ่าน |
| `next build` | ✅ prerender 16/16 หน้า |
| `<Callout>` 2 แบบ render เป็น HTML | ✅ พบคลาส `callout-tip` และ `callout-warning` |
| ตาราง Markdown 4 คอลัมน์ | ✅ พบ `<th>` 4 อัน |
| code highlight | ✅ พบคลาส `hljs` |
| คอมเมนต์ MDX `{/* */}` ไม่หลุดออกหน้าเว็บ | ✅ ตรวจแล้วไม่มี |
| ไม่มี component ที่ render ไม่ออก | ✅ ไม่พบ `<Callout` หรือ `<YouTube` ดิบใน HTML |

---

## 2026-07-26 — ติดตั้งระบบสถิติ: Cloudflare Web Analytics + Google Search Console

รายละเอียดเต็มอยู่ที่ [`docs/ANALYTICS.md`](./ANALYTICS.md)

### Cloudflare Web Analytics

- `components/Analytics.tsx` — โหลด beacon ผ่าน `next/script` (`strategy="afterInteractive"`)
- เรียกใช้ใน `app/layout.tsx` ท้าย `<body>`
- token เก็บใน env `NEXT_PUBLIC_CF_BEACON_TOKEN` ตั้งบน Vercel **เฉพาะ Production**
  (กันยอดจาก preview / `npm run dev` ปนสถิติจริง) — ไม่ตั้ง = ไม่โหลดสคริปต์

> ⚠️ **กับดักที่เกือบพลาด:** ตอนสร้าง site Cloudflare ตั้งเป็น "Automatic setup" ให้เอง
> ซึ่งฉีดสคริปต์ผ่าน **proxy** เท่านั้น แต่ DNS เราเป็น **DNS only** ตามที่ Vercel กำหนด
> ⇒ จะไม่มีข้อมูลเข้าเลยทั้งที่หน้าเว็บดูปกติ
> ต้องเข้า Manage site เปลี่ยนเป็น **"Enable with JS Snippet installation"** แล้วใส่สคริปต์เอง

เลือก Cloudflare เพราะ **ไม่ใช้ cookie** จึงไม่ต้องทำแบนเนอร์ขอความยินยอมตาม PDPA
และเบากว่า GA4 ซึ่งสอดคล้องกับที่ออกแบบเว็บมาให้ JS น้อยที่สุด

### Google Search Console

- สร้าง **Domain property** `sc-domain:teedba.com` (ครอบคลุมทุก subdomain + http/https)
- ยืนยันด้วย TXT record ที่ Cloudflare:
  `google-site-verification=7SNtCMPbot8RrG68bpwidGhXBG-G7HZFyKycz9X4Y8A` → **Ownership verified**
- ส่ง `https://teedba.com/sitemap.xml` → สถานะ **Success · Discovered pages 6**

> Google เสนอยืนยันอัตโนมัติโดยขอสิทธิ์ OAuth เข้าถึงบัญชี Cloudflare DNS
> **เลือกไม่ใช้** ใส่ TXT record เองแทน เพื่อไม่ต้องให้สิทธิ์ข้ามบัญชีโดยไม่จำเป็น

> ⚠️ ห้ามลบ TXT record นี้ ไม่งั้นเสียสิทธิ์การยืนยันและข้อมูลหายทั้งหมด

**หมายเหตุ:** ตอนเพิ่งส่ง sitemap สถานะจะขึ้น "Couldn't fetch" อยู่ครู่หนึ่ง
เป็นเรื่องปกติ (Google ยังไม่ได้ดึงจริง) รีเฟรชอีกครั้งแล้วขึ้น Success

---

## 2026-07-26 — เชื่อมโดเมน teedba.com + อัปเดตลิงก์ Facebook

### โค้ดที่แก้

| ไฟล์ | เดิม | ใหม่ |
| :--- | :--- | :--- |
| `lib/site.ts` → `site.url` | `https://ajarntee-oracle.vercel.app` | `https://teedba.com` |
| `lib/site.ts` → `author.facebook` | `.../teachoracle` | `https://www.facebook.com/teeDBA` |
| `.env.example`, `AGENTS.md` | — | อัปเดตตามค่าใหม่ |

การเปลี่ยน `site.url` ที่จุดเดียวมีผลกับ canonical, Open Graph, Twitter Card,
`sitemap.xml`, `feed.xml`, `llms.txt` และ JSON-LD ทุกก้อนพร้อมกัน

### Vercel (โครงการ `teach-oracle`)

- เพิ่ม `teedba.com` → Production
- เพิ่ม `www.teedba.com` → **308 Permanent Redirect** ไปที่ `teedba.com`

> ⚠️ Vercel ติ๊ก "Redirect apex domains to www (recommended)" มาให้เป็นค่าเริ่มต้น — **เอาออก**
> เพราะเว็บนี้ใช้ apex (`teedba.com`) เป็น canonical ตามชื่อแบรนด์ ถ้าปล่อยไว้
> canonical ในโค้ดจะชี้ไปยัง URL ที่ถูก redirect ซึ่งเสีย SEO
>
> เลือก **308 (ถาวร)** แทน 307 (ชั่วคราว) เพื่อบอก Google ชัดเจนว่าตัวจริงคือ apex

### Cloudflare DNS (teedba.com)

| Type | Name | Content | Proxy |
| :--- | :--- | :--- | :--- |
| CNAME | `teedba.com` (@) | `f35c3a5e8d745821.vercel-dns-017.com` | **DNS only** |
| CNAME | `www` | `f35c3a5e8d745821.vercel-dns-017.com` | **DNS only** |

> ⚠️ Proxy ต้องเป็น **DNS only** (เมฆสีเทา) ตามที่ Vercel ระบุ Cloudflare จะขึ้นแบนเนอร์
> ชวนให้เปิด proxy — **อย่าเปิด** เพราะจะชนกับ SSL/CDN ของ Vercel
>
> ค่า `f35c3a5e8d745821...` เป็นค่าเฉพาะของโครงการนี้ ถ้าย้ายโครงการต้องดูค่าใหม่จาก
> Vercel › Settings › Domains › View DNS configuration

### ผลการตรวจ

| รายการ | ผล |
| :--- | :--- |
| `https://teedba.com` | ✅ เปิดได้ SSL ถูกต้อง เนื้อหาครบ |
| `https://www.teedba.com` | ✅ redirect มาที่ `teedba.com` |
| `https://teedba.com/opengraph-image` | ✅ **รูป OG ขึ้นสมบูรณ์ ฟอนต์ไทยครบ ไม่มีกล่องว่าง** |

**ปิดประเด็นค้างจากรอบก่อน:** `next/og` ที่ทำ build worker ตาย `SIGBUS` ในแซนด์บ็อกซ์
ทำงานได้ปกติบน Vercel ตามที่คาดไว้ — ยืนยันด้วยตาแล้วว่าเป็นข้อจำกัดสภาพแวดล้อม ไม่ใช่บั๊กโค้ด

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
