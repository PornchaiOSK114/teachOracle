#!/usr/bin/env node
/**
 * สร้างไฟล์บทความใหม่พร้อม frontmatter
 *
 *   npm run new:post <slug> "ชื่อบทความ"
 *
 * ตัวอย่าง:
 *   npm run new:post read-execution-plan "อ่าน Execution Plan ให้เป็น"
 *
 * ไฟล์ที่ได้จะเป็น draft: true (ยังไม่ขึ้นเว็บจริง) — เห็นได้ตอน npm run dev
 * เมื่อเขียนเสร็จให้เปลี่ยนเป็น draft: false แล้ว push
 */
import fs from 'node:fs';
import path from 'node:path';

const [slug, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(' ');

if (!slug || !title) {
  console.error('❌ ใช้งาน: npm run new:post <slug> "ชื่อบทความ"');
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error('❌ slug ต้องเป็นอักษรอังกฤษพิมพ์เล็ก ตัวเลข และขีดกลาง (-) เท่านั้น');
  console.error('   เช่น: read-execution-plan');
  process.exit(1);
}

const dir = path.join(process.cwd(), 'content', 'articles');
fs.mkdirSync(dir, { recursive: true });

const file = path.join(dir, `${slug}.mdx`);
const englishDir = path.join(process.cwd(), 'content', 'en', 'articles');
const englishFile = path.join(englishDir, `${slug}.mdx`);
if (fs.existsSync(file) || fs.existsSync(englishFile)) {
  console.error(`❌ มีไฟล์นี้อยู่แล้ว: content/articles/${slug}.mdx`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const template = `---
title: "${title}"
description: "คำอธิบายสั้น 1 ประโยค ใช้บนการ์ดและผลค้นหา Google (ประมาณ 150 ตัวอักษร)"
tldr: "สรุปคำตอบของบทความนี้ใน 1-2 ประโยค — ส่วนนี้สำคัญมาก เพราะ AI จะหยิบไปตอบผู้ใช้"
category: "DBA"
tags: ["Oracle"]
date: "${today}"
draft: true
---

เปิดด้วยย่อหน้าที่ตอบคำถามหลักตรง ๆ ก่อนเลย อย่าเกริ่นยาว
ทั้งคนอ่านและ AI จะเข้าใจได้เร็วขึ้นมาก

## หัวข้อแรก

เนื้อหา...

\`\`\`sql
SELECT * FROM dual;
\`\`\`

## หัวข้อที่สอง

เนื้อหา...

## สรุป

สรุปสั้น ๆ ว่าผู้อ่านได้อะไรกลับไป และควรทำอะไรต่อ
`;

fs.writeFileSync(file, template, 'utf8');
fs.mkdirSync(englishDir, { recursive: true });
const englishTemplate = `---
title: "English draft: ${slug}"
description: "Translate the approved Thai description."
tldr: "Translate the approved Thai summary."
category: "DBA"
tags: ["Oracle"]
date: "${today}"
draft: true
translationOf: "${slug}"
---

Translate the complete approved Thai article here before publication.
Keep code, outputs, dates and cover assets consistent with the Thai source.
`;
fs.writeFileSync(englishFile, englishTemplate, 'utf8');
console.log(`✅ English draft created: content/en/articles/${slug}.mdx (not translated or published)`);

console.log(`✅ สร้างแล้ว: content/articles/${slug}.mdx`);
console.log(`   หมวดที่ใช้ได้: DBA, Performance, Backup & Recovery, PL/SQL, RAC,`);
console.log(`                  Oracle Linux, Data Engineer, Data Science, SQL`);
console.log(`   เขียนเสร็จแล้วเปลี่ยน draft: true → false`);
