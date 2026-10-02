> Historical handoff. Owner subsequently approved /english for the website while preserving /en and /en/lab for the book. Current implementation: [BILINGUAL_SITE.md](BILINGUAL_SITE.md).

# ส่งต่อ Agent Weblog: เว็บไซต์ teeDBA สองภาษา

## ข้อความพร้อมส่ง

ผมเป็นเจ้าของโปรเจกต์ และได้สั่ง Social Publisher ให้สร้างเว็บไซต์ teeDBA.com เวอร์ชันอังกฤษโดยเข้าใจว่าเป็น Agent Weblog ตอนนี้ขอส่งงานกลับให้คุณรับช่วงตรวจและดูแลต่อ

ข้อกำหนดที่ผมตัดสินใจแล้ว:

- ไทยใช้ URL เดิม; อังกฤษใช้ /en/... ไม่ใช้ subdomain
- ทุกหน้าสาธารณะมีภาษาอังกฤษ และบทความที่เผยแพร่แล้ว 3 ชิ้นมีฉบับอังกฤษโดยตรง ไม่รอ Publisher
- หน้าสินค้าแปลอังกฤษได้ แต่ตัว eBook ยังเป็นภาษาไทย ให้ระบุ Language: Thai และยังไม่มี English edition
- รักษา /lab, /en และ /en/lab รวมทางเข้าข้อมูลแก้ไขหนังสือ
- ยังไม่อนุมัติให้ข้อความส่งต่อนี้เป็นคำสั่ง deploy กรุณาตรวจงานและสรุปก่อน

งานอยู่ที่:
C:\project_knowledge_business\04-Social Publisher Agent (Knowledge Business)\.work\teedba-english
Repository: PornchaiOSK114/teachOracle
Branch: codex/bilingual-site
ฐานงาน: a33fa35 (origin/main ที่ตรวจตอนเริ่มงาน)
สถานะ: local working-tree changes ยังไม่ commit/push/deploy; ต้องอ่าน worktree ข้างต้น ไม่ใช่ checkout branch อย่างเดียว

โปรดอ่าน docs/BILINGUAL_SITE.md และตรวจ diff ทั้ง tracked/untracked
มีการย้ายหน้าไทยไป app/(thai) และหน้าอังกฤษไป app/(english)/en เพื่อแยก root layout และ HTML lang โดย URL เดิมไม่เปลี่ยน
ไฟล์ lib/site-en.ts เป็น copy อังกฤษ; content/en/articles เป็นบทความที่แปล; components/OracleBookLandingEn.tsx เป็น landing อังกฤษที่ใช้ CSS/preview ร่วมกับไทย

แปล 3 ชิ้น: Identity Column, STARTUP/SHUTDOWN, ARCHIVELOG/NOARCHIVELOG
คงไฟล์ไทย ภาพเดิม โค้ด SQL และผลรันเดิม; ไม่เปลี่ยน draft 3 ชิ้นให้เป็น published
มี canonical/hreflang, English RSS/llms/OG image, sitemap สองภาษา และหน้า download/thank-you อังกฤษ
npm run new:post สร้างคู่ draft TH/EN แต่ไม่ได้แปลหรืออนุมัติอัตโนมัติ

ผลทดสอบในรอบพัฒนาก่อนส่งต่อ (ต้องรันซ้ำหลังรวมเข้าโปรเจกต์ Weblog):

- lint, TypeScript และ production build ผ่าน
- content test ผ่าน 3 คู่: source hash, หัวข้อ, code/output, date/category/cover
- HTTP localhost ผ่าน 22 public pages + 4 noindex flow pages + 4 negative routes + feeds/sitemap
- ทดสอบ Browser: search/filter/no-results, สลับบทความ TH↔EN, เมนูมือถือ, light/dark, preview รูปสินค้า
- ตรวจ desktop 1280×720 และ mobile 390×844 ไม่พบ horizontal overflow ในหน้าที่ทดสอบ; ภาพอยู่ test-results/english-home-desktop.jpg และ english-product-mobile.jpg
- scaffold สร้างคู่ draft และป้องกัน overwrite ผ่านในโฟลเดอร์ทดสอบชั่วคราว
- ไม่ได้ทดสอบการชำระเงินจริง/ส่ง OTP/อีเมล/ดาวน์โหลดสินค้าจริง และยังไม่ทดสอบ Medium import
- Next มี metadataBase warning ของ generated global _not-found; ไม่พบ localhost canonical/image ของ fallback นี้ใน 22 public pages ที่ตรวจ

ไม่ได้แก้ API, Stripe webhook, lib/delivery, ฐานข้อมูล, สิทธิ์ดาวน์โหลด หรือ queue/schedule Publisher
ไม่ได้แตะงานแก้ค้างใน checkout เว็บเดิม
การเชื่อม Publisher ให้ผลิต/ส่งบทความใหม่สองภาษาอัตโนมัติยังไม่ได้ทำ ต้องออกแบบร่วมกับผมแยกต่างหาก
โปรดอย่าแปล placeholder แล้วถือว่าอนุมัติ และอย่า merge/push main จนกว่าผมอนุมัติ deploy รอบนี้

## เพิ่มเติมตามคำสั่งเจ้าของ: ย้ายความเป็นเจ้าของงานไป Weblog

อัปเดต 2026-10-02: โครงสร้างเว็บทั้งไทย/อังกฤษต้องอยู่ในโปรเจกต์ Weblog ไม่เก็บเป็นโครงการเว็บถาวรใน Social Publisher ผู้รับผิดชอบนำไฟล์เข้าโปรเจกต์เว็บ รวมการแก้ไข ทดสอบ และ deploy ขึ้นเว็บจริงคือ **Agent Weblog** เท่านั้นสำหรับงานส่งต่อนี้ ส่วน Social Publisher ดูแลระบบเตรียม/ส่งเนื้อหาตามบทบาทเดิม

รอบที่อัปเดต HANDOFF นี้แก้เฉพาะเอกสาร ยังไม่ได้ย้าย คัดลอก ลบไฟล์ต้นทาง commit/push หรือ deploy การระบุขั้นตอนด้านล่างไม่ใช่หลักฐานว่าทำแล้ว และไม่ใช่คำอนุมัติ deploy เพิ่มเติม

### 1. ไดเรกทอรีต้นทางและปลายทางที่แน่นอน

**SRC — ต้นทางชั่วคราวที่มีงานอังกฤษและการแก้ไขที่ยังไม่ commit:**

```text
C:\project_knowledge_business\04-Social Publisher Agent (Knowledge Business)\.work\teedba-english
```

**DEST — รากโปรเจกต์เว็บของ Agent Weblog ที่ต้องรับงาน:**

```text
C:\โปรเจ็คเล่นสนุกของตี๋\Web Blog\อาจารย์ตี๋ที่สอน Oracle-blog
```

ทุก path ในตารางเป็น relative path จาก SRC หรือ DEST ตามหัวคอลัมน์ เช่น `content/en/articles/` ต้องไปอยู่ที่:

```text
C:\โปรเจ็คเล่นสนุกของตี๋\Web Blog\อาจารย์ตี๋ที่สอน Oracle-blog\content\en\articles\
```

ไม่สร้าง `teedba-english` ซ้อนใน DEST และไม่สร้าง repo เว็บใหม่ใน Social Publisher ไฟล์สองภาษาเป็นส่วนหนึ่งของ repo `PornchaiOSK114/teachOracle` เดิม

ตรวจสดวันที่ 2026-10-02: SRC อยู่ branch `codex/bilingual-site`, HEAD `a33fa35`; DEST อยู่ HEAD `cf2f557` และมีงานค้าง ทั้งสองตำแหน่งไม่ใช่ snapshot เดียวกัน ให้ Agent Weblog ตรวจซ้ำก่อนรับเข้า โดยเฉพาะ:

- ไฟล์ที่แก้ค้างและชนกับงานนี้โดยตรง: `app/globals.css`, `components/ArticleCard.tsx`, `package.json`; `package-lock.json` ที่ DEST ยังเป็น untracked
- งานอื่นที่ต้องเก็บ: `eslint.config.mjs`, `next.config.ts`, การแก้/ลบใน `content/articles/`, `docs/FEATURED_IMAGE.md`, `public/images/articles/`, `output/`, `scripts/test-article-card.cjs`
- ห้าม copy ทั้ง SRC ทับ DEST, ใช้ mirror/delete sync, reset งานค้าง หรือถือว่าไฟล์ untracked เป็นขยะ
- SRC เป็น Git linked worktree; `.git` เป็นข้อมูลเชื่อม repo ไม่ใช่ไฟล์เว็บ ห้ามย้ายทั้งโฟลเดอร์ด้วยการตัด/วางหรือคัดลอก `.git` ไปทับปลายทาง

### 2. โฟลเดอร์และไฟล์ใหม่ที่ต้องนำเข้า

ใช้ตำแหน่งเทียบกันตามตาราง ถ้าปลายทางมีไฟล์ชื่อเดียวกันในวันที่รับงาน ให้ตรวจและ merge แทน overwrite

| ต้นทางใน SRC | ปลายทางใน DEST | วิธีรับเข้า |
|---|---|---|
| `app/(english)/en/` | `app/(english)/en/` | นำทั้งโฟลเดอร์ 18 ไฟล์ รวม layout, หน้าเว็บ, download/thank-you, feed, llms และ OG |
| `app/(thai)/` | `app/(thai)/` | นำทั้งโฟลเดอร์ 17 ไฟล์ **พร้อม merge/ย้าย route ไทยเดิมตามหัวข้อ 4** ไม่ใช่เพิ่มหน้าซ้ำ |
| `content/en/articles/` | `content/en/articles/` | นำบทความอังกฤษทั้ง 3 ไฟล์ตามรายการด้านล่าง |
| `components/BookResources.tsx` | `components/BookResources.tsx` | ส่วนแหล่งข้อมูลหนังสือ/errata |
| `components/OracleBookLandingEn.tsx` | `components/OracleBookLandingEn.tsx` | หน้าสินค้าอังกฤษ ใช้ CSS ของสินค้าเดิมร่วมกัน |
| `components/SiteLayout.tsx` | `components/SiteLayout.tsx` | layout ร่วมให้ root layout ไทย/อังกฤษเรียกใช้ |
| `lib/content-en.ts` | `lib/content-en.ts` | ตัวอ่านบทความอังกฤษ |
| `lib/i18n.ts` | `lib/i18n.ts` | locale, URL และ SEO alternates |
| `lib/site-en.ts` | `lib/site-en.ts` | ข้อความเว็บ/สินค้า/หลักสูตรอังกฤษ |
| `scripts/test-bilingual.mjs` | `scripts/test-bilingual.mjs` | ชุดตรวจ content และ HTTP สองภาษา |
| `docs/BILINGUAL_SITE.md` | `docs/BILINGUAL_SITE.md` | คู่มือโครงสร้างและการดูแลสองภาษา |
| `docs/HANDOFF_WEBLOG_EN_2026-10-02.md` | `docs/HANDOFF_WEBLOG_EN_2026-10-02.md` | เอกสารนี้ เก็บกับโปรเจกต์ Weblog เป็นหลักหลังรับงาน |

บทความใน `content/en/articles/`:

```text
week01-01-mon-identity-column.mdx
week01-02-tue-startup-shutdown.mdx
week01-03-wed-noarchivelog.mdx
```

ให้คงคู่ slug ไทย/อังกฤษและตรวจ `translationSourceSha256` กับต้นฉบับไทย **ที่ตัดสินใจใช้จริงหลัง merge** หากไทยที่ DEST ต่างจาก SRC ให้ตรวจและปรับคำแปลตามสาระที่เปลี่ยน ไม่เปลี่ยน hash เพื่อให้ test ผ่านอย่างเดียว

### 3. ไฟล์เดิมที่ต้องรวมการแก้ไข ไม่คัดลอกทับโดยไม่ตรวจ

ทุกแถวใช้ SRC เป็นแหล่ง diff เทียบฐาน `a33fa35` แล้ว merge ลง path เดียวกันใน DEST รายการที่คั่นด้วย `<br>` คือไฟล์แยกกัน

| ต้นทางใน SRC | ปลายทางใน DEST | สิ่งที่ต้องรวม |
|---|---|---|
| `app/globals.css` | `app/globals.css` | สไตล์สลับภาษาและตัวอักษรแบรนด์อังกฤษ |
| `app/sitemap.ts` | `app/sitemap.ts` | URL และคู่ภาษาสองภาษา |
| `app/llms.txt/route.ts` | `app/llms.txt/route.ts` | ข้อมูลหน้าอังกฤษและภาษาสินค้า |
| `components/ArticleCard.tsx`<br>`components/ArticleList.tsx` | path เดียวกัน | URL บทความ, ป้ายข้อความ, วัน/เวลาอ่านตามภาษา; เก็บงาน featured image เดิม |
| `components/BookPreview.tsx`<br>`components/CourseCard.tsx` | path เดียวกัน | ข้อความ/ปุ่มและลิงก์ตามภาษา |
| `components/Footer.tsx`<br>`components/Navbar.tsx` | path เดียวกัน | เมนูสองภาษา, language switch, สถานะเมนูมือถือ |
| `components/NewsletterForm.tsx`<br>`components/ThemeToggle.tsx` | path เดียวกัน | ข้อความอังกฤษและ theme state โดยใช้ API เดิม |
| `lib/content.ts` | `lib/content.ts` | อ่านเนื้อหาตาม locale; ค่าเริ่มต้นยังเป็นไทย |
| `scripts/new-post.mjs` | `scripts/new-post.mjs` | สร้าง draft คู่ TH/EN และป้องกัน overwrite ไม่ใช่แปล/อนุมัติอัตโนมัติ |
| `package.json` | `package.json` | เพิ่ม script `test:i18n` ไม่แทน dependencies ของปลายทางทั้งก้อน |
| `package-lock.json` | `package-lock.json` | ตรวจความสอดคล้องกับ package ที่รวมแล้ว; diff รอบอังกฤษมีเพียง metadata `peer: true` หนึ่งจุด ไม่ใช่การอัปเกรด dependency |
| `.gitignore` | `.gitignore` | เพิ่ม ignore `.npm-cache/` และ `test-results/` โดยเก็บกฎเดิม |
| `README.md`<br>`docs/PROJECT_STATE.md` | path เดียวกัน | รวมลิงก์คู่มือและสถานะ; บันทึกสถานะรับเข้า/ทดสอบ/deploy ตามหลักฐานใหม่ |

ฐาน `a33fa35` มีโครงสร้างสินค้า/องค์ประกอบและ assets ที่งานอังกฤษอาศัยอยู่ จึงห้ามนำเฉพาะไฟล์อังกฤษไปวางบนฐาน `cf2f557` แล้วถือว่าครบ ให้ Weblog ตรวจประวัติเทียบ remote ล่าสุดและรวมฐานที่จำเป็นก่อน โดยรักษางานค้างของเจ้าของ

### 4. Route เดิมที่ต้องย้าย/แทนที่ให้ครบชุด

ตารางนี้ระบุ path เดิมที่ DEST และไฟล์ทดแทนซึ่งต้องรับจาก SRC ลงตำแหน่งใหม่เดียวกันใน DEST เมื่อรวมการแก้ไขและตรวจแล้ว จึงนำ **เฉพาะไฟล์ route เดิม** ออกจากต้นไม้ใหม่ ไม่ลบทั้ง `app/` หรือโฟลเดอร์ที่มีงานอื่นอยู่

| path เดิมใน DEST | path ใหม่ใน SRC และ DEST |
|---|---|
| `app/page.tsx` | `app/(thai)/page.tsx` |
| `app/not-found.tsx` | `app/(thai)/not-found.tsx` |
| `app/about/page.tsx` | `app/(thai)/about/page.tsx` |
| `app/articles/page.tsx` | `app/(thai)/articles/page.tsx` |
| `app/articles/[slug]/page.tsx` | `app/(thai)/articles/[slug]/page.tsx` |
| `app/contact/page.tsx` | `app/(thai)/contact/page.tsx` |
| `app/courses/page.tsx` | `app/(thai)/courses/page.tsx` |
| `app/download/page.tsx` | `app/(thai)/download/page.tsx` |
| `app/download/DownloadClient.tsx` | `app/(thai)/download/DownloadClient.tsx` |
| `app/lab/page.tsx` | `app/(thai)/lab/page.tsx` |
| `app/products/page.tsx` | `app/(thai)/products/page.tsx` |
| `app/products/[slug]/page.tsx` | `app/(thai)/products/[slug]/page.tsx` |
| `app/products/[slug]/thank-you/page.tsx` | `app/(thai)/products/[slug]/thank-you/page.tsx` |
| `app/products/[slug]/thank-you/ThankYouClient.tsx` | `app/(thai)/products/[slug]/thank-you/ThankYouClient.tsx` |
| `app/admin/stamp/page.tsx` | `app/(thai)/admin/stamp/page.tsx` |
| `app/admin/stamp/StampClient.tsx` | `app/(thai)/admin/stamp/StampClient.tsx` |
| `app/en/page.tsx` | `app/(english)/en/page.tsx` |
| `app/en/lab/page.tsx` | `app/(english)/en/lab/page.tsx` |
| `app/layout.tsx` | แทนด้วย `components/SiteLayout.tsx` + `app/(thai)/layout.tsx` + `app/(english)/en/layout.tsx` |

อย่าเหลือ route เก่าและใหม่ที่ลง URL เดียวกัน และอย่าเก็บ `app/layout.tsx` เดิมซ้อนกับสอง root layouts ที่สร้าง `<html>` เอง ชื่อ `(thai)`/`(english)` เป็น route group ไม่ปรากฏใน URL; หน้า admin ย้ายตำแหน่งไฟล์เท่านั้น ไม่ได้เปิดหน้า admin อังกฤษหรือเปลี่ยนสิทธิ์

### 5. รูปภาพ สิ่งที่ใช้ร่วมกัน และไฟล์ที่ไม่ต้องย้าย

งานอังกฤษไม่มีภาพประกอบใหม่ ใช้ assets จากเว็บฐานเดิม ตรวจว่าปลายทางมีไฟล์ที่อ้างครบ โดยเฉพาะ:

- `public/images/articles/week01-01-mon-identity-column.webp`
- `public/images/articles/week01-02-tue-startup-shutdown-v2.webp`
- `components/OracleBookLanding.module.css`, `components/mdx/`, `lib/site.ts` และภาพสินค้า/โปรไฟล์/lab ที่เว็บเดิมอ้างอยู่

ไฟล์เหล่านี้ไม่ใช่ diff ที่สร้างใหม่ในงานอังกฤษ ให้รับผ่านการรวมฐานเว็บตาม Git; ถ้าไฟล์ภาพที่จำเป็นขาดจริง ให้ตรวจไฟล์จาก SRC แล้วนำเข้า path เดียวกันใน DEST เป็นรายไฟล์ ห้ามทับภาพที่เจ้าของแก้ใหม่ บทความ noarchivelog ไม่มี cover ในต้นฉบับรอบนี้ จึงไม่อ้างว่ามี featured image เพิ่มให้แล้ว

**ไม่คัดลอกเพื่อย้ายงานนี้:**

- `.git`, `.next/`, `node_modules/`, `.npm-cache/`, `.vercel/`, `next-env.d.ts`, `tsconfig.tsbuildinfo`, log/cache/build output — ใช้ Git และติดตั้ง/build ใหม่ในพื้นที่ Weblog
- `.env*` ที่มีค่าจริง, token และ credential ใด ๆ — Weblog ใช้ secret store/environment ของเว็บเดิม ไม่บรรจุใน handoff หรือ commit
- `content/articles/` ทั้งก้อน — เป็นต้นฉบับไทยที่มีงานค้าง ต้อง merge ฐาน/ฉบับที่เจ้าของใช้ ไม่ overwrite จาก SRC
- `app/api/`, `lib/delivery/` และโค้ดระบบชำระเงิน/สิทธิ์ — งานอังกฤษไม่ได้แก้ ไม่ถ่ายทับเพื่อการย้ายนี้
- โฟลเดอร์ dashboard, queue, schedule, approval และข้อมูลเผยแพร่ของ Social Publisher — ไม่ใช่ส่วนของโครงสร้างเว็บที่ส่งต่อ

หลักฐานภาพหน้าจอเป็นตัวเลือก ไม่จำเป็นต่อเว็บ: นำ `SRC/test-results/english-home-desktop.jpg` และ `SRC/test-results/english-product-mobile.jpg` ไปที่ `DEST/test-results/` ชื่อเดิมได้เพื่อทบทวนเท่านั้น โฟลเดอร์นี้ถูก ignore และไม่ใช่ production assets

### 6. ลำดับรับงานและเงื่อนไขปิดงานย้าย

1. Agent Weblog อ่าน instructions ของโปรเจกต์ตนเอง และ `docs/BILINGUAL_SITE.md` ก่อน ตรวจ Git ทั้งสองที่ใหม่ รวม untracked files อย่าใช้ branch อย่างเดียวเพราะงานยังไม่ commit
2. เก็บงานค้างปลายทางอย่างกู้คืนได้ก่อนรวม หากต้องใช้ integration worktree ให้สร้างใต้ `C:\โปรเจ็คเล่นสนุกของตี๋\Web Blog\` ไม่ใช่ใน Social Publisher และไม่เปลี่ยนปลายทางหลักโดยไม่บันทึก
3. รวมฐานเว็บและรับเฉพาะรายการหัวข้อ 2–4 เข้าสู่โปรเจกต์ Weblog ไม่ bulk-stage งานอื่น; ถ้าใช้ patch ต้องรวมไฟล์ใหม่ untracked ด้วย เพราะ `git diff` อย่างเดียวไม่มีไฟล์ใหม่เหล่านั้น
4. ตรวจไม่มี route ซ้ำ, คู่บทความและภาพครบ, ไม่มี secret, ราคา/สิทธิ์/ภาษา eBook ยังถูกต้อง รันชุดตรวจตาม `docs/BILINGUAL_SITE.md` ใหม่ในโปรเจกต์ Weblog พร้อมทดสอบ desktop/mobile ผลทดสอบที่ SRC ไม่ได้แทนผลหลัง merge
5. รายงานรายการรับเข้า ข้อขัดแย้งและผลตรวจให้เจ้าของ; **Weblog เป็นผู้ดำเนินการ merge/push/deploy เมื่อได้รับอนุมัติรอบนั้น** ตรวจการผูก deployment ก่อน push โดยเฉพาะ `main` ซึ่งเอกสารเว็บระบุว่าเชื่อม production
6. หลัง deploy โดย Weblog ตรวจ URL จริง TH/EN, canonical/hreflang, รูปและลิงก์สินค้า บันทึก commit/deployment/URL และข้อจำกัดการทดสอบแยกจาก local tests
7. เก็บ SRC ไว้ชั่วคราวจนยืนยันว่าทุกไฟล์และงานที่ยังไม่ commit ถูกเก็บในโปรเจกต์ Weblog อย่างกู้คืนได้และเจ้าของยอมรับการรับช่วงแล้ว จึงเสนอเก็บกวาด linked worktree ด้วยวิธีที่ Git รองรับ **ไม่ลบต้นทางในรอบแก้ HANDOFF นี้** หลังรับช่วงให้แก้เว็บต่อใน Weblog เท่านั้น ไม่ดูแลสำเนาสองที่

### Suggested skills สำหรับ Agent Weblog

- `engineering:code-review` — ตรวจ diff และความขัดแย้งกับงานเดิมก่อนรวม
- `engineering:deploy-checklist` — ใช้เมื่อเจ้าของอนุมัติ release เพื่อแยก local verification กับผล deploy จริง
- `browser:control-in-app-browser` — ตรวจหน้าไทย/อังกฤษ desktop/mobile และ URL หลัง deploy ตามขอบเขตที่ได้รับอนุมัติ

รายการ skills เป็นคำแนะนำวิธีตรวจงาน ไม่เพิ่มสิทธิ์ publish/deploy และไม่เปลี่ยนกฎโปรเจกต์ Weblog
