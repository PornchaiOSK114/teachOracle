-- ============================================================================
-- teedba.com — ระบบส่งมอบ E-Book หลังชำระเงิน
-- โครงฐานข้อมูล Neon / PostgreSQL
--
-- วิธีรัน: Vercel › Storage › เลือกฐานข้อมูล Neon › แท็บ Query (หรือเปิด Neon
--          Console แล้วใช้ SQL Editor) วางทั้งไฟล์นี้แล้วกดรัน
--
-- ไฟล์นี้รันซ้ำได้ปลอดภัย (idempotent) รันสองรอบก็ไม่พัง ไม่ลบข้อมูลเดิม
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. product — สินค้าที่ขาย
--    ตอนนี้มีแถวเดียว แต่วางโครงเผื่อเล่มอื่นในอนาคตไว้แล้ว
--    เพิ่มสินค้าใหม่ = insert อีกหนึ่งแถว ไม่ต้องแก้โค้ด
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product (
  id                        text        PRIMARY KEY,   -- slug ตรงกับ lib/site.ts
  title                     text        NOT NULL,
  file_name                 text        NOT NULL,      -- ชื่อไฟล์ที่ลูกค้าเห็นตอนโหลด
  blob_pathname             text        NOT NULL,      -- ชื่อไฟล์ใน Vercel Blob
  order_ref_prefix          text        NOT NULL,      -- คำนำหน้าเลขออเดอร์ เช่น 26AI

  -- ราคาใน Stripe แยกสองโหมด เพราะ sandbox กับ live เป็นคนละโลก
  stripe_price_id           text        UNIQUE,        -- โหมด live
  stripe_price_id_test      text        UNIQUE,        -- โหมด sandbox

  download_limit            int         NOT NULL DEFAULT 5,
  watermark_skip_first_page boolean     NOT NULL DEFAULT true,
  active                    boolean     NOT NULL DEFAULT true,
  created_at                timestamptz NOT NULL DEFAULT now()
);


-- ----------------------------------------------------------------------------
-- 2. purchase — การซื้อหนึ่งครั้ง
--    (ไม่ใช้ชื่อ order เพราะเป็นคำสงวนของ SQL)
--
--    stripe_session_id เป็น UNIQUE คือหัวใจของการกัน webhook ยิงซ้ำ
--    Stripe รับประกันแค่ว่าจะส่ง event อย่างน้อยหนึ่งครั้ง ไม่ได้รับประกันว่า
--    ครั้งเดียว ถ้าไม่มี UNIQUE ตรงนี้ ลูกค้าจะได้อีเมลซ้ำและได้โควตาซ้ำ
-- ----------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS purchase_ref_seq START 1;

CREATE TABLE IF NOT EXISTS purchase (
  id                bigserial   PRIMARY KEY,
  order_ref         text        NOT NULL UNIQUE,  -- เลขที่ประทับบน PDF เช่น 26AI-000142
  stripe_session_id text        NOT NULL UNIQUE,  -- กัน webhook ซ้ำ
  livemode          boolean     NOT NULL,         -- true = เงินจริง, false = sandbox
  product_id        text        NOT NULL REFERENCES product(id),

  email             text        NOT NULL,         -- เก็บแบบตัวพิมพ์เล็กเสมอ
  quantity          int         NOT NULL DEFAULT 1,
  amount_total      int,                          -- หน่วยสตางค์ ตามที่ Stripe ส่งมา
  currency          text,

  -- pending  = จบ checkout แล้วแต่เงินยังไม่เข้า (เคสพร้อมเพย์จ่ายช้า)
  -- paid     = เงินเข้าจริงแล้ว ดาวน์โหลดได้
  -- failed   = จ่ายไม่สำเร็จ
  -- refunded = คืนเงินแล้ว ตัดสิทธิ์ดาวน์โหลด
  status            text        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','paid','failed','refunded')),

  downloads_used    int         NOT NULL DEFAULT 0,
  download_limit    int         NOT NULL DEFAULT 5,

  paid_at           timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- เวลาที่ส่งอีเมลส่งมอบสำเร็จ (เพิ่มภายหลัง 3 ก.ย. 2569)
-- null = ยังไม่เคยส่งสำเร็จ ใช้ให้ Stripe ส่ง event ซ้ำแล้วเราส่งอีเมลใหม่ได้
ALTER TABLE purchase ADD COLUMN IF NOT EXISTS delivery_email_sent_at timestamptz;

-- ค้นด้วยอีเมลตอนลูกค้าเข้าหน้า /download
CREATE INDEX IF NOT EXISTS purchase_email_idx  ON purchase (email);
CREATE INDEX IF NOT EXISTS purchase_status_idx ON purchase (status);


-- ----------------------------------------------------------------------------
-- 3. download_log — บันทึกทุกครั้งที่กดโหลด
--    ใช้ตอบคำถามลูกค้าว่า "ผมโหลดไปกี่ครั้งแล้ว" และเป็นหลักฐานว่านับถูก
--    เก็บ ip แค่สามหลักแรก (เช่น 203.150.x) พอให้ดูออกว่าคนละที่กัน
--    ไม่เก็บ IP เต็มเพราะไม่จำเป็นต้องรู้ถึงขนาดนั้น
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS download_log (
  id          bigserial   PRIMARY KEY,
  purchase_id bigint      NOT NULL REFERENCES purchase(id) ON DELETE CASCADE,
  at          timestamptz NOT NULL DEFAULT now(),
  ip_prefix   text,
  user_agent  text
);

CREATE INDEX IF NOT EXISTS download_log_purchase_idx ON download_log (purchase_id, at DESC);


-- ----------------------------------------------------------------------------
-- 4. otp — รหัส 6 หลัก
--    เก็บเป็นค่าที่ผ่านการแฮชแล้ว ไม่เก็บตัวเลขตรง ๆ
--    ถ้าวันหนึ่งฐานข้อมูลรั่ว คนที่ได้ไปก็เอารหัสไปใช้ไม่ได้
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS otp (
  id          bigserial   PRIMARY KEY,
  email       text        NOT NULL,
  code_hash   text        NOT NULL,
  expires_at  timestamptz NOT NULL,
  attempts    int         NOT NULL DEFAULT 0,
  consumed_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS otp_email_idx ON otp (email, created_at DESC);


-- ----------------------------------------------------------------------------
-- 5. email_throttle — กันคนยิงรัว
--    สองหน้าที่: กันคนเดารหัสมั่ว และกันคนเอาอีเมลคนอื่นมากรอกรัว ๆ
--    จนระบบเรากลายเป็นเครื่องมือสแปมส่งเมลไปกวนเขา
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS email_throttle (
  email             text        PRIMARY KEY,
  otp_sent_count    int         NOT NULL DEFAULT 0,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  last_sent_at      timestamptz,
  locked_until      timestamptz
);


-- ----------------------------------------------------------------------------
-- 6. ข้อมูลตั้งต้นของสินค้าเล่มแรก
--    ค่า stripe_price_id เป็นของจริงจากบัญชี Teedba โหมด live
--    ส่วน stripe_price_id_test เว้นว่างไว้ก่อน ค่อยเติมตอนสร้าง sandbox
-- ----------------------------------------------------------------------------
INSERT INTO product (
  id,
  title,
  file_name,
  blob_pathname,
  order_ref_prefix,
  stripe_price_id,
  download_limit,
  watermark_skip_first_page
) VALUES (
  'oracle-26-ai-sql-tuning',
  'Oracle 26ai SQL Tuning',
  'Oracle 26ai SQL Tuning.pdf',
  'Oracle 26 ai SQL Tuning.pdf',
  '26AI',
  'price_1U8BQ0JIEtTO5GP1xAEIX7ce',
  5,
  true
)
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- ตรวจผล — รันแล้วควรเห็นตาราง 5 ตัว และสินค้า 1 แถว
-- ============================================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT id, title, order_ref_prefix, download_limit, active FROM product;
