วางไฟล์รูปตามชื่อด้านล่างนี้ แล้วรูปจะขึ้นบนเว็บเองโดยไม่ต้องแก้โค้ด
(ถ้ายังไม่มีไฟล์ เว็บจะแสดงกล่อง placeholder แทน ไม่พัง)

  profile.jpg                    รูปอาจารย์ตี๋ (แนะนำ 800x800 px ขึ้นไป, สี่เหลี่ยมจัตุรัส)
  books/windows-it-pro.jpg       ปกนิตยสาร Windows IT Pro
  books/apps-yodhit.jpg          ปกหนังสือ "Apps ยอดฮิต ติดใจ"
  books/brand-social.jpg         ปกหนังสือ "สร้างแบรนด์ทำเงินด้วยโซเชียลมีเดีย"
  customers/org-01.png ... org-25.png   โลโก้ลูกค้า (แนะนำ PNG พื้นหลังโปร่ง)

รองรับ .jpg / .png / .webp — ถ้าเปลี่ยนนามสกุล ให้แก้ path ใน lib/site.ts ด้วย

--- ผลิตภัณฑ์ (E-Book) ---
  products/oracle-26-ai-sql-tuning/cover.jpg           ปกหนังสือ (แนะนำ 1024x1400 px)
  products/oracle-26-ai-sql-tuning/toc-01..09.png      หน้าสารบัญ
  products/oracle-26-ai-sql-tuning/author.png          หน้าเกี่ยวกับผู้เขียน
  products/oracle-26-ai-sql-tuning/sample-01..05.png   ตัวอย่างเนื้อหาในเล่ม

รูปชุดนี้ระบบหานามสกุลให้เอง (.png / .jpg / .jpeg / .webp) — เปลี่ยนนามสกุลได้โดยไม่ต้องแก้โค้ด
ถ้าจะเพิ่ม/ลดจำนวนรูป ให้แก้รายการ `samples` ของสินค้าใน lib/site.ts
