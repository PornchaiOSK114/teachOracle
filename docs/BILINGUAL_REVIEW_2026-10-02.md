> ผลตัดสินหลัง review: เจ้าของอนุมัติข้อแก้ไขทั้ง 5 และเลือก /english โดยคง /en กับ /en/lab สำหรับหนังสือ ดูสถานะปัจจุบันใน [BILINGUAL_SITE.md](BILINGUAL_SITE.md) และ [PROJECT_STATE.md](PROJECT_STATE.md)

# ผลตรวจ HANDOFF ภาษาอังกฤษของ teeDBA.com

ตรวจวันที่ 2026-10-02 (Asia/Bangkok) — สถานะ: ตรวจและเสนอแนวทาง รอเจ้าของอนุมัติตามข้อ 3 ของคำสั่ง ยังไม่รวมโค้ด ไม่ commit/push/deploy

## ข้อสรุป

รับแนวทางหลักของ Publisher ได้: ไทยใช้ URL เดิม อังกฤษอยู่ /en ใน repository และ deployment เดียวกัน แยก root layout ให้ HTML lang ถูกต้อง และแยกไฟล์บทความตามภาษา แต่ควรแก้รายการด้านล่างก่อนเผยแพร่

## แหล่งที่ตรวจและฐาน Git

- ต้นทาง: `C:\project_knowledge_business\04-Social Publisher Agent (Knowledge Business)\.work\teedba-english`
- ปลายทาง: `C:\โปรเจ็คเล่นสนุกของตี๋\Web Blog\อาจารย์ตี๋ที่สอน Oracle-blog`
- อ่าน AGENTS.md, docs/SETUP.md, docs/PROJECT_STATE.md ของเว็บ และ HANDOFF_WEBLOG_EN_2026-10-02.md / BILINGUAL_SITE.md ของต้นทาง
- ต้นทางอยู่ฐาน `a33fa35` บน `codex/bilingual-site`; งานอังกฤษยังเป็น tracked changes และ untracked files
- ปลายทางหลักอยู่ `cf2f557` และมีงานค้างด้านภาพปก บทความ CSS และ config ต้องรักษาไว้
- ตรวจ remote ด้วย `git -c http.sslBackend=openssl ls-remote origin refs/heads/main`: main เป็น `9240a02841c184692c9b44f92322e760cdd6fa23` ขณะตรวจ
- local origin/main ตรงกับ SHA ที่ตรวจจาก remote จึงอ่าน diff ของ commit นี้ได้ แม้ fetch ถูก filesystem permission ปฏิเสธการเขียน FETCH_HEAD; ไม่ได้แก้ Git permissions
- `9240a02` เพิ่ม cover ในบทความ NOARCHIVELOG และไฟล์ `public/images/articles/week01-03-wed-noarchivelog.webp`; ข้อความใน HANDOFF ที่บอกว่าบทความนี้ไม่มี cover จึงล้าสมัย

## แนวทางที่เห็นด้วยและผลกระทบ

1. `app/(thai)/` กับ `app/(english)/en/` เป็น route groups: ไทยยังคง `/`, `/articles/...`, `/products/...`; อังกฤษเป็น `/en`, `/en/articles/...`, `/en/products/...`
2. root layout แยกภาษาโดยใช้ SiteLayout ร่วม เหมาะกับ HTML lang ที่ส่งมาจาก server ไม่จำเป็นต้องย้ายไทยไป `/th`
3. สลับข้ามภาษาแล้วโหลดหน้าใหม่เป็นพฤติกรรม multiple root layouts ของ Next.js; state ในฟอร์มที่ยังไม่ส่งอาจหาย แม้คง query string ไว้แล้ว จึงต้องทดสอบเส้นทาง download/thank-you
4. content/articles เป็นไทย และ content/en/articles เป็นอังกฤษ ใช้ slug คู่กันและเก็บ translationSourceSha256 เพื่อตรวจว่าต้นฉบับเปลี่ยนหรือไม่
5. `/en` เดิมเป็นหน้าข้อมูลหนังสือ จะกลายเป็นหน้าแรกอังกฤษ; BookResources ยังคงอยู่ในหน้านี้ที่ `#errata` และ `/en/lab` ยังอยู่ ควรทำทางเข้า resources ให้เห็นชัด
6. ราคา ลิงก์ซื้อ ภาพ และข้อมูลสินค้าหลักใช้ lib/site.ts ร่วม; หน้าสินค้าอังกฤษต้องระบุว่าหนังสือเป็นภาษาไทยและยังไม่มี English edition
7. ไม่พบ diff ของ app/api หรือ lib/delivery ในชุดอังกฤษ ระบบตรวจสิทธิ์และส่งมอบยังใช้ระบบเดิม ทั้งนี้ไม่ใช่ผลทดสอบการซื้อจริง

อ้างอิง Next.js: https://nextjs.org/docs/app/api-reference/file-conventions/route-groups

## จุดที่เสนอให้แก้ก่อน deploy

### 1. รวมบนฐานเว็บล่าสุดและรักษางานค้าง

เริ่ม integration จาก main ที่ตรวจล่าสุดใน worktree ภายใต้ Web Blog รับเฉพาะ diff ที่เกี่ยวข้อง ห้าม copy ทั้งต้นทางทับปลายทางหลัก ให้คง landing page ใหม่และภาพปก NOARCHIVELOG ล่าสุด ตรวจเนื้อหาไทยที่ใช้จริงก่อนปรับ cover/hash ในฉบับอังกฤษ ไม่เปลี่ยน hash เพียงเพื่อให้ test ผ่าน

### 2. ปุ่มสลับภาษาและ SEO ต้องตรวจคู่ภาษาที่เผยแพร่จริง

`lib/i18n.ts` languageAlternates สร้าง th/en ให้ทุก path; `components/Navbar.tsx` สร้าง switchHref ด้วยการเติม/ตัด /en โดยไม่ตรวจว่ามีหน้าคู่จริง ส่วน sitemap ตรวจคู่บทความแล้ว จึงมีพฤติกรรมไม่สอดคล้องกัน

เมื่อ Publisher ส่งบทความไทยใหม่ที่ยังไม่มีอังกฤษ หน้าไทยจะประกาศ hreflang และแสดงปุ่ม EN ไปยังหน้า 404 เพราะการเชื่อม Publisher สองภาษายังไม่อยู่ในงานนี้ นอกจากนี้ navbar บน /admin/stamp ยังสร้าง /en/admin/stamp ที่ไม่มีอยู่

ข้อเสนอ: ใช้ข้อมูลคู่ภาษาที่มีและเผยแพร่จริงสำหรับ switch/hreflang/sitemap ให้ตรงกัน ถ้ายังไม่มีคำแปล ให้แสดงสถานะว่า English translation is not available yet โดยไม่สร้างลิงก์บทความปลอม หน้า admin ไม่ต้องมีตัวสลับภาษา

บทความ 3 ชิ้นในรอบนี้ต้องมีอังกฤษครบ แต่แยกการทดสอบความครบของชุดย้ายงานออกจากการทดสอบความปลอดภัยเมื่ออนาคตมีบทความเพียงภาษาเดียว เพื่อไม่ไปขัดขวาง Publisher เดิมโดยไม่ได้ตกลง

อ้างอิง Google: https://developers.google.com/search/docs/specialty/international/localized-versions

### 3. จัดการหน้า 404 และ metadata ของอังกฤษให้ครบ

ทดสอบบน build เดิมที่ต้นทางด้วย GET `/en/missing-review-page` และ `/missing-review-page`: ได้ 404 จริง แต่ HTML เป็น `<html>` ไม่มี lang และมี `http://localhost:3000` ใน metadata; `/en/missing-review-page` ไม่ได้ใช้ข้อความ Browse articles ของ English NotFound ที่เขียนไว้

ข้อเสนอ: รองรับ unmatched routes ของทั้งสองภาษาอย่างตั้งใจ ให้หน้า 404 มีภาษา ลิงก์กลับ และ noindex ที่ถูกต้อง ไม่มี metadata ของ localhost พร้อมทดสอบ URL ผิดทั้งระดับหน้าและ slug

พบรายละเอียดเพิ่มเติมใน `app/(english)/en/articles/[slug]/page.tsx`: breadcrumb Home ยังชี้ site.url ฝั่งไทย และ JSON-LD fallback image ยังใช้ `/opengraph-image` ฝั่งไทย ควรแก้ให้ใช้ /en และ /en/opengraph-image ตามภาษา รวม breadcrumb ของ landing อังกฤษ

### 4. รักษาสาเหตุข้อผิดพลาดในหน้าดาวน์โหลดอังกฤษ

`app/(english)/en/download/DownloadClient.tsx` แทนข้อผิดพลาด request-code ทั้งหมดด้วย “Could not request a code. Please try again.” และ verify ทั้งหมดด้วย “Invalid or expired code...” ทำให้กรณีไม่พบออเดอร์, cooldown, rate limit และล็อกรหัสสูญเสียคำแนะนำที่หน้าไทยมีอยู่

ข้อเสนอ: แปลข้อความตามสาเหตุจริงและเวลาที่ต้องรอ หากต้องเพิ่ม machine-readable error code ใน API ให้เพิ่มแบบ backward-compatible โดยคงข้อความไทย สถานะ HTTP กฎสิทธิ์ โควตา และการส่งเมลเดิม ทดสอบด้วย response จำลอง ไม่ส่ง OTP จริงเพื่อทดสอบ UI

### 5. ลดโค้ดซ้ำในส่วนที่ต้องรักษาพฤติกรรมเดียวกัน

แยก root layout และไฟล์เนื้อหาได้ แต่ DownloadClient, ThankYouClient และ article renderer ถูกคัดลอกเป็นไทย/อังกฤษทั้งชุด การแก้พฤติกรรมครั้งถัดไปอาจตกหล่นภาษาใดภาษาหนึ่ง

ข้อเสนอ: ใช้ component/logic ร่วมและส่ง locale/copy เข้าไปในส่วนเหล่านี้ โดยคงเนื้อหา MDX แยกไฟล์ ส่วนข้อความหลักสูตรใน lib/site-en.ts ควรผูกกับ course.code แทน courseCopy[i] เพื่อไม่สลับคำอธิบายหรือ crash เมื่อรายการไทยเพิ่ม/เปลี่ยนลำดับ

## ขอบเขตที่เสนอสำหรับการอนุมัติ

- รับโครงสร้าง /en และบทความอังกฤษ 3 ชิ้นจาก HANDOFF พร้อมแก้ 5 กลุ่มข้างต้น
- ภาษาไทยคง URL และพฤติกรรมเดิม รักษา landing page และภาพล่าสุดจาก main รวมทั้ง /lab, /en/lab และทางเข้า errata
- หน้าเว็บสาธารณะและหน้า download/thank-you มีภาษาอังกฤษ แต่ตัว PDF ยังไทย
- ภาษาในระบบอีเมลและ Stripe ภายนอกยังตามระบบเดิม: ในชุดนี้ lib/site-en.ts ใช้ buyUrl เดียวกับไทย และไม่ได้ส่ง locale ให้ mail/checkout จึงยังไม่รับประกันว่าจะกลับหน้า thank-you อังกฤษโดยอัตโนมัติ ต้องบันทึกข้อจำกัดนี้ให้ชัด
- ไม่รวมการเชื่อม queue/approval/การสร้างคำแปลอัตโนมัติใน Publisher
- หลังเจ้าของอนุมัติแนวทางนี้ ให้ดำเนินการรวมงาน ทดสอบ เอกสาร GitHub และ deploy ตามข้อ 3–5 ของคำสั่งเดิม โดยไม่ขอสิทธิ์เดิมซ้ำเมื่อยังอยู่ในขอบเขตที่อนุมัติ

## ผลตรวจในรอบ review นี้

- อ่าน diff และไฟล์ใหม่ของ routing, layout, content loader, locale/SEO, UI, purchase/download views, scaffold และบทความอังกฤษทั้ง 3
- รัน `npm run lint`: ผ่าน
- รัน `node node_modules/typescript/bin/tsc --noEmit --incremental false`: ผ่าน
- รัน `node scripts/test-bilingual.mjs`: ผ่านบทความ 3 คู่บนฐานต้นทาง a33fa35 เท่านั้น ยังไม่รวมภาพปกที่ main เพิ่มภายหลัง
- เริ่ม Next production server จาก `.next` ที่ Publisher เตรียมไว้ พอร์ต 3117 แล้วรัน HTTP test: ผ่าน 22 public pages, 4 noindex flow pages, 4 negative routes, feed/sitemap และข้อความภาษา eBook
- ทดสอบ URL ผิดเพิ่ม: ยืนยันปัญหา global 404 ข้างต้น
- ไม่ได้ build ใหม่ในรอบ review นี้ และไม่ได้รันทดสอบ desktop/mobile ด้วย browser ใหม่ จึงไม่ถือผลเก่าของ Publisher เป็นผลหลัง integration
- ไม่จ่ายเงินจริง ไม่เรียก API ส่ง OTP ไม่ส่งอีเมล ไม่ดาวน์โหลดสินค้าจริง ไม่แก้ queue/approval/schedule
- ยังไม่ได้ตรวจ deployment ปัจจุบันของ Vercel จึงไม่อ้างว่า remote main ที่ตรวจคือ SHA ที่ production ให้บริการอยู่

## เกณฑ์ก่อนปิดงานหลังอนุมัติ

1. บันทึกไฟล์รับเข้าและวิธีรักษางานเดิม แยกงานนอกขอบเขตออกจาก commit
2. รัน lint/TypeScript/build และ tests ใหม่บนโค้ดรวม รวม absent translation, unmatched 404, draft protection, ภาษา error states และ metadata
3. ตรวจ browser desktop/mobile: หน้าไทย/อังกฤษ, navigation, search/filter, theme, language switch, รูปปก และ preview สินค้า
4. ยืนยัน repository/deployment binding ก่อน push main; stage เฉพาะ path ที่ตรวจแล้ว
5. บันทึก commit, deployment ID/status และผล GET/browser ของ production แยกกัน พร้อมข้อจำกัดการซื้อ/อีเมลที่ยังไม่ได้ทดสอบ
6. อัปเดต BILINGUAL_SITE.md และ PROJECT_STATE.md ให้ตรงกับงานที่ส่งจริง คงต้นทาง HANDOFF ไว้จนรับงานอย่างกู้คืนได้แล้ว
