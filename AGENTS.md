# AGENTS.md — คู่มือสำหรับ AI Agent ที่มาทำงานต่อในโปรเจกต์นี้

อ่านไฟล์นี้ก่อนแตะโค้ดทุกครั้ง

## โปรเจกต์นี้คืออะไร

เว็บบล็อกส่วนตัว **"อาจารย์ตี๋ที่สอน Oracle"** — สร้าง personal branding ให้
พรชัย ครองธรรมชาติ (อาจารย์ตี๋) ในฐานะผู้เชี่ยวชาญ Oracle Database
เป้าหมายปลายทางคือรายได้จาก **คอร์สอบรม** และ **digital product** (E-book / Online Course)

กลุ่มผู้อ่าน: DBA, Data Engineer, Data Scientist, Database Developer, Programmer ในไทยและลาว

## กติกาสำคัญที่สุด — ห้ามกุข้อมูล

ข้อมูลที่ **ยืนยันแล้ว ใช้ได้จริง** (อยู่ใน `lib/site.ts`):

- ชื่อ-นามสกุล, ชื่อเล่น "อาจารย์ตี๋", ระดับ OCP, ประสบการณ์ 20+ ปี
- 6 หลักสูตรที่เปิดสอน (code, ชื่อ, ระดับ, จำนวนวัน, คำอธิบาย, tags)
- ผลงานเขียน 3 รายการ (คอลัมน์ Windows IT Pro, Pocket Book 2 เล่ม)
- โดเมน `teedba.com` (จดที่ Cloudflare) — ตั้งค่าเริ่มต้นไว้ใน `lib/site.ts`
- อีเมล `pornchai.krong@gmail.com`, Facebook `https://www.facebook.com/teeDBA`
- ผู้ดูแลงานอบรม: Thailand Training Center — `thailandtrainingcenter@gmail.com`, `089-408-6789`

**ห้ามเติมสิ่งเหล่านี้เองเด็ดขาด:** ตัวเลขสถิติ (จำนวนผู้เรียน, จำนวนองค์กร),
ชื่อองค์กรลูกค้า, คำรีวิว/testimonial, ราคาคอร์ส, วันที่จัดอบรม
→ ถ้าต้องใช้ ให้ถามเจ้าของเว็บก่อนเสมอ

## Tech Stack

| ส่วน | ใช้อะไร |
| :--- | :--- |
| Framework | Next.js 16 (App Router) + React 19 |
| ภาษา | TypeScript 5 (`strict`) |
| เนื้อหา | MDX ผ่าน `next-mdx-remote/rsc` (render ฝั่ง server) |
| Frontmatter | `gray-matter` · เวลาอ่าน `reading-time` |
| Markdown plugins | `remark-gfm`, `rehype-slug`, `rehype-highlight` |
| ฟอนต์ | `next/font/google` — IBM Plex Sans Thai (`subsets: ['thai','latin']`) + IBM Plex Mono |
| สไตล์ | CSS ธรรมดาใน `app/globals.css` (design tokens เป็น CSS variables) — **ไม่มี Tailwind** |
| ธีม | Light/Dark ผ่าน `data-theme` บน `<html>` + `localStorage` |
| Newsletter | MailerLite ผ่าน API route ฝั่งเซิร์ฟเวอร์ |
| Hosting | Vercel (auto-deploy จาก GitHub) |

⚠️ **Next 16 ต่างจากที่โมเดลส่วนใหญ่จำ** — ถ้าไม่แน่ใจ API ให้อ่าน `node_modules/next/dist/docs/`
ตัวอย่างที่ต่างชัด: `params` ใน dynamic route เป็น `Promise` ต้อง `await` ก่อนใช้

## โครงสร้างโปรเจกต์

```text
app/
├── layout.tsx              ฟอนต์, metadata, theme no-flash script, JSON-LD (WebSite + Person)
├── globals.css             🎨 design system ทั้งหมด (tokens + คลาส)
├── page.tsx                🏠 หน้าแรก
├── not-found.tsx           404 ภาษาไทย
├── opengraph-image.tsx     รูป OG 1200×630 (โหลดฟอนต์ไทยจาก Google Fonts, มี fallback)
├── icon.svg                favicon แบบเวกเตอร์ (brand mark: กรอบขาวมน + ไอคอน DB แดงอิฐ)
├── favicon.ico             favicon 6 ขนาด (16/32/48/64/128/256) ปรับความหนาเส้นแยกรายขนาด
├── apple-icon.png          180×180 สำหรับ iOS (full-bleed ไม่มีพื้นโปร่ง)
├── robots.ts               เปิดทาง search engine + AI crawler
├── sitemap.ts
├── feed.xml/route.ts       RSS
├── llms.txt/route.ts       สรุปเว็บให้ LLM อ่าน (AIO) — สร้างจากข้อมูลจริงอัตโนมัติ
├── api/subscribe/route.ts  📮 newsletter → MailerLite
├── articles/
│   ├── page.tsx            รายการบทความ (server) → ส่งให้ ArticleList
│   └── [slug]/page.tsx     อ่านบทความ (MDX + TOC + JSON-LD + related)
├── courses/page.tsx  about/page.tsx  products/page.tsx  contact/page.tsx
components/
├── Navbar.tsx  ThemeToggle.tsx   'use client'
├── Footer.tsx  JsonLd.tsx  ArticleCard.tsx  CourseCard.tsx
├── ArticleList.tsx         'use client' — ค้นหา + กรองหมวด (useMemo)
├── NewsletterForm.tsx      'use client' — ฟอร์มรับข่าว + PDPA consent
├── AssetImage.tsx          server — มีไฟล์รูป→<Image>, ไม่มี→placeholder
├── Analytics.tsx           server — Cloudflare beacon (โหลดเมื่อมี env CF token)
└── mdx/index.tsx           component ที่เรียกจากในไฟล์ .mdx ได้
                            (YouTube, Vimeo, SoundCloud, Audio, Figure, Callout, ExternalLink)
                            ⚠️ เพิ่ม component ใหม่ต้องอัปเดต WRITING_GUIDE.md ด้วย
lib/
├── site.ts                 📌 ข้อมูลจริงทั้งหมดอยู่ที่นี่ที่เดียว
└── content.ts              อ่าน MDX, draft, related-by-tag, วันที่ พ.ศ., TOC
content/articles/*.mdx      เนื้อหาบทความ (ไม่มี DB/CMS)
scripts/new-post.mjs        npm run new:post <slug> "ชื่อ"
public/images/              รูป (ดู public/images/README.txt)
docs/                       CHANGELOG
```

## ระบบเขียนบทความ

```mdx
---
title: "ชื่อบทความ"
description: "คำอธิบายสั้น (การ์ด + ผลค้นหา Google)"
tldr: "สรุปคำตอบ 1-2 ประโยค — สำคัญมากต่อ GEO/AIO"
category: "Performance"   # DBA | Performance | Backup & Recovery | PL/SQL | RAC | Oracle Linux | Data Engineer | Data Science | SQL
tags: ["SQL", "Tuning"]
date: "2026-07-25"        # YYYY-MM-DD เท่านั้น (มี validation ใน lib/content.ts)
cover: "/images/blog/x.jpg"  # ไม่บังคับ
draft: true               # true = ซ่อนบน production, เห็นตอน npm run dev
---
```

- `npm run new:post <slug> "ชื่อ"` — สร้างไฟล์พร้อม frontmatter (draft)
- `npm run dev` เห็น draft · `npm run build` ซ่อน draft

## SEO / GEO / AIO — คงไว้ทุกครั้ง ห้ามลด

- **SEO:** metadata ต่อหน้า, canonical, OG/Twitter, sitemap, robots, RSS, URL อ่านง่าย, heading เป็นลำดับ, `lang="th"`
- **JSON-LD:** `WebSite` + `Person` (layout), `BlogPosting` + `BreadcrumbList` (บทความ),
  `Course` × 6 (หน้าคอร์ส), `ProfilePage` (about), `ContactPage`, `CollectionPage` (รายการบทความ)
- **GEO/AIO:** ทุกบทความมี **TL;DR ต้นหน้า**, เนื้อหาเป็น HTML semantic ไม่ซ่อนหลัง JS,
  `robots.ts` อนุญาต AI crawler (GPTBot, ClaudeBot, PerplexityBot ฯลฯ), มี `/llms.txt`

## Responsive

- Mobile-first + `clamp()` แทน media query หลายชั้น
- กริดใช้ `repeat(auto-fill, minmax(...))` — ไม่ต้องเขียน breakpoint
- media query มีจุดเดียวที่ `min-width: 860px` (สลับเมนู hamburger ↔ เมนูเต็ม)
- ปุ่ม/ลิงก์สูงอย่างน้อย 44px · `hover` ห่อด้วย `@media (hover: hover)`
- เคารพ `prefers-reduced-motion` · `env(safe-area-inset-*)` ที่ header/footer

## Deploy

โค้ดอยู่บนเครื่อง Windows ของผู้ใช้ **git credentials อยู่บนเครื่องผู้ใช้เท่านั้น**
— agent/sandbox push เองไม่ได้

1. แก้โค้ดในโฟลเดอร์ที่ mount
2. type-check ให้ผ่านก่อน (วิธี `/tmp` ดูหัวข้อ Gotchas)
3. สร้าง `.bat` (CRLF, `chcp 65001`) รัน `git add -A && git commit && git push origin main`
4. เปิด File Explorer (computer-use) → double-click ไฟล์ `.bat` (terminal เป็น tier "click" พิมพ์ไม่ได้)
5. Vercel build อัตโนมัติ → ยืนยันด้วย Vercel MCP จนสถานะ **READY** → `web_fetch` หน้าเว็บจริง

## Gotchas (เจอจริง)

**A. รัน `next build` ในแซนด์บ็อกซ์ Linux ไม่ได้** — SWC binary ไม่ตรง
⇒ ใช้ `tsc --noEmit` เป็น gate แล้วให้ Vercel (Linux) เป็นตัว build จริง

**B. ไฟล์ที่เพิ่งเขียนบน mount อาจอ่านเป็น NUL bytes** ⇒ คัดลอกไป `/tmp` + strip NUL ก่อน type-check:

```bash
rm -rf /tmp/tc && mkdir -p /tmp/tc && \
tar --exclude=node_modules --exclude=.next --exclude=.git --exclude=ClaudeDesign -cf - . | (cd /tmp/tc && tar xf -) && \
cd /tmp/tc && find . -name "*.ts*" -exec sed -i 's/\x00//g' {} \; && \
ln -s <MOUNT>/node_modules node_modules && npx tsc --noEmit
```

**C. push จากแซนด์บ็อกซ์ไม่ได้** (ไม่มีสิทธิ์ `.git` + ไม่มี cred) ⇒ ใช้ `.bat` + File Explorer

**D. `git commit` ผ่าน .bat แล้วเจอ `index.lock`** ⇒ ใส่ `if exist ".git\index.lock" del /f ".git\index.lock"` ต้นสคริปต์

**E. ฟอนต์ไทย** ต้องมี `subsets: ['thai','latin']` ไม่งั้นภาษาไทยจะเป็นฟอนต์ระบบสุ่มตามเครื่องผู้อ่าน

**F. ตัวอักษรไทยใน `next/og`** ฟอนต์เริ่มต้นไม่มีสระไทย → ต้องโหลดฟอนต์ไทยมาก่อน
(`app/opengraph-image.tsx` ทำไว้แล้ว พร้อม fallback เป็นอักษรละตินถ้าโหลดไม่สำเร็จ)

**G. รูปที่ยังไม่มีไฟล์** ใช้ `<AssetImage>` เสมอ — ตรวจ `fs.existsSync` ให้ ถ้าไม่มีไฟล์จะขึ้น
placeholder แทนที่จะเป็นรูปแตก (เป็น server component ห้ามเรียกจาก client component)

**H. โค้ดที่แตะ `node:fs` ห้ามหลุดเข้า client bundle** — `import type` ถูกลบทิ้งตอน compile จึงปลอดภัย
แต่ *value import* ไม่ปลอดภัย ถ้า client component เผลอ import ฟังก์ชันจากไฟล์ที่มี `fs`
Turbopack จะพังด้วย `the chunking context does not support external modules (request: node:fs)`
⚠️ `tsc` จับบั๊กนี้ไม่ได้ ต้องรัน `next build` ถึงจะเจอ
⇒ ฟังก์ชันบริสุทธิ์ไว้ `lib/format.ts` · type ไว้ `lib/types.ts` · งานที่ใช้ fs ไว้ `lib/content.ts`

**I. Favicon** สร้างจากสคริปต์ PIL (ดู `docs/CHANGELOG.md`) ไม่ได้ใช้ `next/og`
เพราะ `next/og` ทำ worker ตาย SIGBUS ในแซนด์บ็อกซ์ จึงตรวจสอบไม่ได้
ถ้าจะแก้ไอคอน ให้แก้ `app/icon.svg` แล้ว re-render ไฟล์ `.ico`/`.png` ให้ตรงกัน

**J. Carousel/สไลด์ที่กว้าง 100% ในคอลัมน์ของ CSS Grid จะล้นไปทับเนื้อหาข้าง ๆ**
เพราะ grid item มี `min-width: auto` เป็นค่าเริ่มต้น จึงหดต่ำกว่า min-content ไม่ได้
⇒ ใส่ `min-width: 0` ให้ทุกชั้น (คอลัมน์ → stage → track → slide) และอย่าวางปุ่มลูกศรลอยทับรูป
⚠️ `tsc` และ `next build` จับบั๊กนี้ไม่ได้ ต้องเปิดดูหน้าจริงเท่านั้น

**K. รูปที่เจ้าของเว็บส่งมาอาจเป็นคนละนามสกุลกัน** (ปกเป็น `.jpg` หน้าในเล่มเป็น `.png`)
⇒ ใช้ `resolveAsset()` ใน `lib/assets.ts` ที่ลองนามสกุลให้เอง แทนการ hardcode
⚠️ `lib/assets.ts` ใช้ `node:fs` → ห้าม client component import เข้าไป (ดูข้อ H)
ให้ page ฝั่ง server resolve แล้วส่ง string ต่อเป็น prop

## เอกสารในโปรเจ็ค — อ่านอันไหนเมื่อไหร่

| ไฟล์ | เนื้อหา |
| :--- | :--- |
| `AGENTS.md` (ไฟล์นี้) | สถาปัตยกรรม กติกา gotchas — **อ่านก่อนแตะโค้ดเสมอ** |
| `README.md` | โครงสร้างโปรเจ็ค ชุดสี คำสั่ง ฟีเจอร์ |
| `WRITING_GUIDE.md` | คู่มือเขียนบทความสำหรับเจ้าของเว็บ (ไม่ใช่ agent) |
| `docs/AGENT_PLAYBOOK.md` | สูตรสร้างเว็บแบบนี้ซ้ำ + gotchas ฉบับเต็มพร้อมคำสั่ง |
| `docs/ANALYTICS.md` | Cloudflare Analytics + Search Console (ตั้งค่า + วิธีอ่าน) |
| `docs/PRODUCT_PAGES.md` | ระบบหน้าผลิตภัณฑ์ `/products` + `/products/[slug]` ทำงานยังไง |
| `docs/PRODUCT_TEMPLATE.md` | แบบฟอร์มกรอกช่องว่างสำหรับเพิ่มสินค้าใหม่ (สำหรับเจ้าของเว็บ) |
| `docs/ALUMNI_PREORDER.md` | โปรพรีออเดอร์ราคาศิษย์เก่า 490 (Google Form + Apps Script ส่งไฟล์) |
| `docs/CHANGELOG.md` | ประวัติการเปลี่ยนแปลงและเหตุผล |

**เมื่อแก้อะไรที่กระทบผู้ใช้ ให้อัปเดตเอกสารที่เกี่ยวข้องด้วยเสมอ**
โดยเฉพาะ: เพิ่ม MDX component → `WRITING_GUIDE.md` · เจอ gotcha ใหม่ → `AGENT_PLAYBOOK.md`

## Design source of truth

`ClaudeDesign/` (อยู่ใน `.gitignore` ไม่ขึ้น repo):

- `อาจารย์ตี๋ Oracle.dc.html` — ต้นแบบ 7 หน้า
- `design-tokens.css` — ค่าสี light/dark (ถูก port เข้า `app/globals.css` แล้ว)
- `README-DEV-HANDOFF.md` — เอกสารดีไซน์ฉบับเต็ม

**เวลารับดีไซน์ใหม่: port สไตล์ อย่ารื้อสถาปัตยกรรม**
