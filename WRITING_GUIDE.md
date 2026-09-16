# คู่มือเขียนบทความ — teeDBA.com
อัปเดต 2026-09-16 · [กติกาหลัก](AGENTS.md) · [Setup](docs/SETUP.md)

## เนื้อหา
เขียนสำหรับ DBA, Developer และ Data Engineer ใช้ข้อมูลจริง ตัวอย่างที่ตรวจได้ และสำนวนอาจารย์ตี๋
สร้างด้วย npm run new:post <slug> "ชื่อบทความ" แล้วแก้ content/articles/<slug>.mdx

```yaml
---
title: "ชื่อบทความ"
description: "คำอธิบายบนการ์ดและผลค้นหา"
tldr: "คำตอบหลักของบทความ"
category: "DBA"
tags: ["Oracle"]
date: "2026-09-16"
cover: "/images/blog/example.jpg"
draft: true
---
```

ชื่อรูปเป็นตัวอย่าง ต้องวางรูปจริงหรือเอา cover ออก เขียนเนื้อหาด้วย Markdown เริ่มหัวข้อย่อย H2 เพราะหน้าบทความมี H1 ให้แล้ว
ใช้ code fence ระบุภาษา เช่น sql/bash; หมายเหตุภายใน MDX ใช้ {/* ... */} ไม่ใช้ HTML comment
components/mdx/index.tsx มี YouTube, Vimeo, SoundCloud, Audio, Figure, Callout และ ExternalLink ให้ตรวจ props จากโค้ดก่อนใช้ และอัปเดตคู่มือนี้หากเพิ่ม component
lib/content.ts ตรวจ title/date, คำนวณเวลาอ่าน, สร้างสารบัญจาก H2 และเลือก related articles ตามแท็ก
draft: true เห็นตอน npm run dev และถูกกรองจากรายการ/การอ่านฝั่ง production ในโค้ดปัจจุบัน แต่ไม่ใช่ที่เก็บข้อมูลลับเพราะ repository เป็น public

## ก่อนเผยแพร่
ตรวจข้อความจริง ลิงก์ รูป โค้ด TL;DR และการแสดงผล แล้วเปลี่ยน draft เป็น false เมื่อต้องการเผยแพร่
ตรวจ TypeScript/build และหน้าเว็บตามการแก้ไข; stage เฉพาะไฟล์บทความและรูปที่เกี่ยวข้อง ตรวจ diff ก่อน commit
การนำขึ้น GitHub และ deploy เป็นไปตาม AGENTS.md และ SETUP ไม่ใช้ git add แบบกวาดทุกไฟล์
