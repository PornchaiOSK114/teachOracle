import Link from "next/link";
import type { ReactNode } from "react";
import AssetImage from "./AssetImage";
import BookPreview from "./BookPreview";
import JsonLd from "./JsonLd";
import type { CarouselSlide } from "./SampleCarousel";
import { author, isPromoOpen, site, type Product } from "@/lib/site";
import styles from "./OracleBookLanding.module.css";

// Chapter names and scope are from the existing product description and public contents pages.
const chapters = [
  [
    "01",
    "SQL ทำงานอย่างไร",
    "สถาปัตยกรรมการประมวลผลคำสั่ง SQL และ Cost-Based Optimizer",
    "เข้าใจวงจรคำสั่ง การ parse และวิธีที่ optimizer เลือกแผน",
  ],
  [
    "02",
    "อ่านแผนให้เป็น",
    "การอ่านและตีความ Execution Plan",
    "รู้ว่าฐานข้อมูลเข้าถึงข้อมูลและประมวลผลคำสั่งอย่างไร",
  ],
  [
    "03",
    "ให้ optimizer เห็นข้อมูล",
    "Optimizer Statistics และ Histogram",
    "ทำความเข้าใจสถิติและการกระจายตัวของข้อมูล",
  ],
  [
    "04",
    "ตามหา SQL จากแอป",
    "การหา SQL ที่มาจากแอปพลิเคชัน",
    "SQL Trace, TRCSESS และ TKPROF",
  ],
  [
    "05",
    "เข้าถึงข้อมูลให้เหมาะ",
    "การเข้าถึงข้อมูลและดัชนี",
    "ทำความเข้าใจทางเลือกในการอ่านข้อมูลและใช้ index",
  ],
  [
    "06",
    "เชื่อมตารางและเรียงข้อมูล",
    "การเชื่อมโยงข้อมูลและการเรียงลำดับ",
    "วิเคราะห์วิธี join และขั้นตอนการ sort",
  ],
  [
    "07",
    "ปรับวิธีประมวลผล",
    "Optimizer Hints, Query Transformation และ Materialized View",
    "รู้จักเครื่องมือและแนวทางปรับแผนการทำงาน",
  ],
  [
    "08",
    "ใช้แผนอย่างเข้าใจ",
    "Bind Variables และ Adaptive Execution",
    "ทำความเข้าใจการใช้แผนซ้ำและการปรับแผนระหว่างทำงาน",
  ],
  [
    "09",
    "ดูแลแผนให้เสถียร",
    "ทำให้เสถียรด้วยระบบอัตโนมัติ",
    "AWR/ASH, SQL Plan Management และ Automatic Indexing",
  ],
  [
    "10",
    "ลงมือทำตั้งแต่ต้นจนจบ",
    "เวิร์กช็อปรวบยอด 4 เคสจริง",
    "นำความรู้จากบทก่อนหน้ามาฝึกวิเคราะห์และจูน SQL",
  ],
] as const;

const questions = [
  [
    "ต้องมีพื้นฐานแค่ไหน?",
    "เขียน SQL ได้ อ่าน SELECT ที่ join หลายตารางเข้าใจ และเคยใช้ SQL*Plus หรือ SQLcl มาบ้าง ส่วน optimizer, execution plan และ statistics ไม่ต้องรู้มาก่อน ผมจะพาไปทำความเข้าใจในเล่ม",
  ],
  [
    "หนังสือครอบคลุม Oracle รุ่นไหน?",
    "เนื้อหาครอบคลุมตั้งแต่ 19c ถึง 26ai ภาคผนวกแยกคำสั่งใหม่และเรื่อง Vector กับ JSON Relational Duality ไว้ให้ คำสั่งบางอย่างขึ้นกับเวอร์ชันและ edition ที่ใช้ ให้ดูข้อกำหนดของแต่ละบทก่อนรันแล็บ",
  ],
  [
    "สั่งซื้อแล้วได้ไฟล์อะไร?",
    "ได้รับ E-Book ภาษาไทยในรูปแบบ PDF และสคริปต์ติดตั้งสภาพแวดล้อมแล็บ (.zip) สำหรับรันตามเนื้อหาในหนังสือ",
  ],
  [
    "ดาวน์โหลดและกลับมาอ่านภายหลังอย่างไร?",
    "หลังชำระเงิน ระบบส่งลิงก์รับหนังสือไปที่อีเมลที่ใช้สั่งซื้อ หากกลับมาดาวน์โหลดภายหลัง ให้เข้าหน้าดาวน์โหลดและใช้อีเมลเดิมเพื่อรับรหัสยืนยัน หากไม่พบอีเมลให้ตรวจกล่อง Spam ก่อน",
  ],
  [
    "ไฟล์มีลายน้ำหรือจำกัดการดาวน์โหลดไหม?",
    "ไฟล์ PDF มีอีเมลที่ใช้สั่งซื้อกำกับทุกหน้า ยกเว้นหน้าปก และดาวน์โหลดได้ 5 ครั้ง ส่วนสคริปต์แล็บดาวน์โหลดได้ไม่จำกัด",
  ],
  [
    "อ่านอย่างเดียวได้ไหม?",
    "อ่านเพื่อทำความเข้าใจได้ครับ แต่ถ้าอยากเห็นว่าตัวเลขและแผนการทำงานเปลี่ยนอย่างไร ผมแนะนำให้ติดตั้งแล็บแล้วรันตามไปด้วยทุกบท ชุดติดตั้งแล็บมาพร้อมหนังสือ",
  ],
] as const;

function Icon({
  kind,
}: {
  kind: "book" | "plan" | "lab" | "file" | "check" | "arrow";
}) {
  const paths: Record<typeof kind, ReactNode> = {
    book: (
      <>
        <path d="M12 5v15M12 5C8 2 3 3 3 3v16s5-1 9 2c4-3 9-2 9-2V3s-5-1-9 2Z" />
      </>
    ),
    plan: (
      <>
        <path d="M4 20V10h4v10M10 20V4h4v16M16 20v-7h4v7" />
      </>
    ),
    lab: (
      <>
        <path d="M9 3h6M10 3v7L4 20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1L14 10V3M8 15h8" />
      </>
    ),
    file: (
      <>
        <path d="M14 3H5v18h14V8l-5-5ZM14 3v5h5M8 12h8M8 16h6" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    arrow: (
      <>
        <path d="M4 12h16m-6-6 6 6-6 6" />
      </>
    ),
  };
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[kind]}
    </svg>
  );
}

function SectionHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className={styles.sectionHeading}>
      <p className={styles.eyebrow}>{label}</p>
      <h2>{title}</h2>
      {children && <p className={styles.lead}>{children}</p>}
    </div>
  );
}

function BuyButton({ buyUrl }: { buyUrl: string }) {
  return buyUrl ? (
    <a
      className={styles.primary}
      href={buyUrl}
      target="_blank"
      rel="noopener nofollow"
    >
      สั่งซื้อ <Icon kind="arrow" />
    </a>
  ) : (
    <button type="button" className={styles.primary} disabled>
      เปิดสั่งซื้อเร็ว ๆ นี้
    </button>
  );
}

export default function OracleBookLanding({
  product,
  cover,
  slides,
}: {
  product: Product;
  cover: string;
  slides: CarouselSlide[];
}) {
  const price = new Intl.NumberFormat("th-TH").format(product.price);
  const url = `${site.url}/products/${product.slug}`;
  const promo = isPromoOpen(product.promo) ? product.promo : null;
  const intro = product.sections[0];
  const audience = product.sections.find(
    (section) =>
      section.kind === "bullets" && !section.heading && !section.deny,
  );
  const prerequisites = product.sections.find(
    (section) => section.heading === "พื้นฐานที่ต้องมี",
  );
  const exclusions = product.sections.find(
    (section) => section.kind === "bullets" && section.deny,
  );

  return (
    <article className={styles.landing}>
      <nav className={styles.jumpNav} aria-label="หัวข้อในหน้าหนังสือ">
        <div className={styles.jumpInner}>
          <span className={styles.navTitle}>
            SQL Tuning <span>ภาษาไทย</span>
          </span>
          <div className={styles.jumpLinks}>
            <a href="#overview">ภาพรวม</a>
            <a href="#examples">ตัวอย่าง</a>
            <a href="#contents">สารบัญ</a>
            <a href="#audience">เหมาะกับใคร</a>
            <a href="#questions">คำถาม</a>
          </div>
          <a href="#purchase" className={styles.navBuy}>
            สั่งซื้อ <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      <section
        id="overview"
        className={`${styles.container} ${styles.hero}`}
        aria-labelledby="book-title"
      >
        <div className={styles.heroCopy}>
          <p className={styles.breadcrumb}>
            <Link href="/products">ผลิตภัณฑ์</Link>
            <span aria-hidden="true"> / </span>E-Book
          </p>
          <span className={styles.badge}>{product.kind}</span>
          <h1 id="book-title">
            <span>
              Oracle <em>26ai</em>
            </span>
            <br />
            SQL Tuning
          </h1>
          <p className={styles.heroSubtitle}>
            จูน SQL ให้เร็วขึ้น
            <br className={styles.mobileBreak} />
            อย่างเป็นขั้นตอน
          </p>
          <p className={styles.heroDescription}>
            เข้าใจหลักการ อ่านแผนการทำงาน และลงมือรันแล็บตามไปด้วย
            ครอบคลุมตั้งแต่ Oracle 19c ถึง 26ai สำหรับ DBA และ Developer
            ที่อยากรู้ว่าจะเริ่มแก้ SQL ช้าตรงไหน
          </p>
          <p className={styles.byline}>โดย {product.authorName}</p>
          <div className={styles.heroPrice}>
            <strong>฿{price}</strong>
            <span>PDF ภาษา{product.language} พร้อมสคริปต์แล็บ</span>
          </div>
          <div className={styles.actions}>
            <BuyButton buyUrl={product.buyUrl} />
            <a className={styles.secondary} href="#examples">
              <Icon kind="book" /> อ่านตัวอย่าง
            </a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.coverHalo} />
          <div className={styles.bookMockup}>
            <div className={styles.bookCover}>
              <AssetImage
                src={cover}
                alt={`ปกหนังสือ ${product.title}`}
                placeholder="ปกหนังสือ"
                fit="contain"
                sizes="(max-width: 600px) 68vw, 360px"
                priority
              />
            </div>
          </div>
          <p className={styles.coverCaption}>
            อ่านหลักการ แล้วลองพิสูจน์ด้วยแล็บ
          </p>
          <span className={styles.visualLabel}>19c → 26ai</span>
        </div>
      </section>

      <div
        className={`${styles.container} ${styles.facts}`}
        aria-label="หนังสือเล่มนี้ในภาพรวม"
      >
        {(
          [
            [
              "book",
              `${product.pages} หน้า`,
              `ภาษา${product.language} ในรูปแบบ PDF`,
            ],
            ["file", "10 บท + 2 ภาคผนวก", "เรียงเนื้อหาให้เรียนต่อกันได้"],
            [
              "plan",
              `${slides.length} หน้าตัวอย่าง`,
              "เปิดดูเนื้อหาก่อนตัดสินใจ",
            ],
            ["lab", "4 เวิร์กช็อป", "ฝึกวิเคราะห์แบบรวบยอด"],
          ] as const
        ).map(([icon, title, note]) => (
          <div className={styles.fact} key={title}>
            <Icon kind={icon} />
            <div>
              <strong>{title}</strong>
              <span>{note}</span>
            </div>
          </div>
        ))}
      </div>

      {promo && (
        <aside className={`${styles.container} ${styles.promo}`}>
          <h2>{promo.label}</h2>
          <p>
            <strong>
              ฿{new Intl.NumberFormat("th-TH").format(promo.price)}
            </strong>{" "}
            {promo.deadlineLabel}
          </p>
          <p>{promo.deliverNote}</p>
          <ol>
            {promo.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>{promo.warning}</p>
          {promo.orderUrl ? (
            <a
              className={styles.primary}
              href={promo.orderUrl}
              target="_blank"
              rel="noopener nofollow"
            >
              {promo.buttonLabel}
            </a>
          ) : (
            <p>กำลังเปิดรับเร็ว ๆ นี้</p>
          )}
          <p>
            <a href={promo.fallbackUrl} target="_blank" rel="noopener nofollow">
              {promo.fallbackLabel}
            </a>
          </p>
          <p>{promo.codeHint}</p>
        </aside>
      )}

      <section
        className={`${styles.section} ${styles.container}`}
        aria-labelledby="problem-title"
      >
        <SectionHeading
          label="เริ่มจากปัญหาที่เจอ"
          title="SQL ช้า แล้วควรเริ่มดูตรงไหน?"
        >
          ผมเขียนเล่มนี้ให้คนที่เจอระบบช้าลง เปิด query แล้ว
          แต่ยังไม่รู้ว่าจะเริ่มแก้จากอะไร
        </SectionHeading>
        <div className={styles.comparison}>
          <div className={`${styles.card} ${styles.problem}`}>
            <p className={styles.cardLabel}>ก่อนเริ่มจูน</p>
            <h3 id="problem-title">รู้ว่าช้า แต่ยังหาสาเหตุไม่เจอ</h3>
            <ul className={styles.checkList}>
              {[
                "อ่านคำสั่ง SQL แล้ว ยังไม่เห็นว่าติดตรงไหน",
                "เปิด Execution Plan แล้ว ไม่รู้จะดูอะไร",
                "ลังเลว่าจะสร้าง index หรือแก้คำสั่งก่อน",
                "อ่านเอกสารหลายเรื่อง แต่ยังต่อภาพไม่ครบ",
              ].map((text) => (
                <li key={text}>
                  <span aria-hidden="true">−</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.compareArrow} aria-hidden="true">
            <Icon kind="arrow" />
          </div>
          <div className={`${styles.card} ${styles.outcome}`}>
            <p className={styles.cardLabel}>สิ่งที่จะได้ฝึกในเล่ม</p>
            <h3>ค่อย ๆ วิเคราะห์อย่างมีเหตุผล</h3>
            <ul className={styles.checkList}>
              {[
                "เข้าใจว่า optimizer เลือกแผนอย่างไร",
                "อ่านและตีความ Execution Plan",
                "พิจารณาสถิติ ดัชนี และวิธี join ก่อนปรับ",
                "ลงมือรันแล็บ แล้วดูสิ่งที่เกิดขึ้นจริง",
              ].map((text) => (
                <li key={text}>
                  <Icon kind="check" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <details className={styles.preface}>
          <summary>
            อ่านที่มาของหนังสือจากคำนำ <span aria-hidden="true">+</span>
          </summary>
          <div>
            {intro?.kind === "paragraphs" &&
              intro.items.map((text) => <p key={text}>{text}</p>)}
          </div>
        </details>
      </section>

      <section className={`${styles.section} ${styles.softSection}`}>
        <div className={styles.container}>
          <SectionHeading
            label="วิธีเรียนกับเล่มนี้"
            title="เข้าใจหลักการ แล้วลงมือทำ"
          >
            อย่าอ่านอย่างเดียวครับ ติดตั้งแล็บแล้วรันตามไปด้วยทุกบท
            ชุดติดตั้งมาพร้อมกับหนังสือ
          </SectionHeading>
          <div className={styles.steps}>
            {(
              [
                [
                  "01",
                  "book",
                  "เข้าใจหลักการ",
                  "เริ่มจากวงจรคำสั่ง SQL และ optimizer เพื่อรู้ว่าฐานข้อมูลตัดสินใจจากอะไร",
                ],
                [
                  "02",
                  "plan",
                  "อ่าน Execution Plan",
                  "ดูแผนการทำงานของคำสั่ง แล้วเชื่อมกับสถิติ ดัชนี และการเข้าถึงข้อมูล",
                ],
                [
                  "03",
                  "lab",
                  "ลงมือทำกับแล็บ",
                  "รันคำสั่งตามในเล่ม สังเกตผล และฝึกนำความรู้มารวมกันในเวิร์กช็อป",
                ],
              ] as const
            ).map(([number, icon, title, copy]) => (
              <div className={styles.step} key={number}>
                <span className={styles.stepNumber}>{number}</span>
                <Icon kind={icon} />
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={styles.container}>
          <SectionHeading
            label="ตัวอย่างจากบทที่ 1"
            title="เห็นทั้งคำสั่งและผลรัน"
          >
            ตัวอย่าง Hard Parse กับ Soft Parse ในเล่ม ใช้ v$sql
            ดูว่าคำสั่งถูกเรียกกี่ครั้ง และมีการโหลดแผนกี่ครั้ง
          </SectionHeading>
          <div className={styles.codeGrid}>
            <div className={styles.codeWindow}>
              <div className={styles.windowBar}>
                <span aria-hidden="true">● ● ●</span> SQL จากหน้า 5
              </div>
              <pre>
                <code>{`SELECT sql_id, parse_calls, executions, loads, sql_text
FROM   v$sql
WHERE  sql_text LIKE '%LAB_BIND%'
AND    sql_text NOT LIKE '%v$sql%';`}</code>
              </pre>
              <p>ดูคำสั่งใน Shared Pool ที่มีคอมเมนต์ LAB_BIND กำกับไว้</p>
            </div>
            <div className={styles.codeWindow}>
              <div className={styles.windowBar}>
                ผลรันจากหน้า 6 <span>คัดเฉพาะ 3 คอลัมน์</span>
              </div>
              <div className={styles.resultTable}>
                <table>
                  <caption className={styles.srOnly}>
                    ผลรัน LAB_BIND จากหนังสือหน้า 6
                  </caption>
                  <thead>
                    <tr>
                      <th>PARSE_CALLS</th>
                      <th>EXECUTIONS</th>
                      <th>LOADS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>3</td>
                      <td>3</td>
                      <td className={styles.highlightCell}>1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                ในตัวอย่างนี้ เรียกคำสั่ง 3 ครั้ง แต่ LOADS เท่ากับ 1
                หน้าเดียวกันยังเปรียบเทียบกับคำสั่งที่ใช้ค่าตรง ๆ ให้ดูด้วย
              </p>
            </div>
          </div>
          <a href="#examples" className={styles.darkLink}>
            เปิดอ่านหน้าต้นฉบับและคำอธิบายในเล่ม{" "}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section
        id="examples"
        className={`${styles.section} ${styles.container}`}
      >
        <SectionHeading label="ลองอ่านก่อนซื้อ" title="เปิดดูหน้าจริงในเล่ม">
          สารบัญ หน้าเกี่ยวกับผู้เขียน และตัวอย่างเนื้อหา รวม {slides.length}{" "}
          หน้า เลือกหมวดแล้วกดที่หน้าเพื่ออ่านภาพขนาดใหญ่
        </SectionHeading>
        <BookPreview slides={slides} />
      </section>

      <section
        id="contents"
        className={`${styles.section} ${styles.softSection}`}
      >
        <div className={styles.container}>
          <SectionHeading
            label="เนื้อหาในเล่ม"
            title="10 บทที่ต่อกันเป็นภาพเดียว"
          >
            ตั้งแต่ SQL ทำงานอย่างไร ไปจนถึงการอ่านแผน ปรับคำสั่ง
            ดูแลแผนให้เสถียร และเวิร์กช็อปรวบยอด
          </SectionHeading>
          <div className={styles.chapterGrid}>
            {chapters.map(([number, title, fullTitle, copy]) => (
              <div key={number} className={styles.chapter}>
                <span className={styles.chapterNumber}>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p className={styles.chapterTitle}>{fullTitle}</p>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.appendices}>
            <p className={styles.eyebrow}>2 ภาคผนวก</p>
            <div>
              <h3>ก / คำสั่งใหม่</h3>
              <p>QUALIFY, GROUP BY ALL และ VALUES</p>
            </div>
            <div>
              <h3>ข / Vector และ JSON</h3>
              <p>Vector และ JSON Relational Duality</p>
            </div>
          </div>
          <p className={styles.licenseNote}>
            ฟีเจอร์และเครื่องมือบางอย่างขึ้นกับเวอร์ชัน edition
            และสิทธิ์การใช้งาน Oracle
            ให้ตรวจข้อกำหนดในบทที่เกี่ยวข้องก่อนใช้กับระบบจริง
          </p>
          <a className={styles.textLink} href="#examples">
            เปิดดูสารบัญและหน้าตัวอย่าง <span aria-hidden="true">↑</span>
          </a>
        </div>
      </section>

      <section
        id="audience"
        className={`${styles.section} ${styles.container}`}
      >
        <SectionHeading label="ก่อนเริ่มอ่าน" title="เล่มนี้เหมาะกับคุณไหม?">
          เล่มนี้เน้นการจูนที่ระดับคำสั่ง SQL สำหรับคนที่เขียน SQL ได้แล้ว
          และอยากเข้าใจการทำงานเบื้องหลัง
        </SectionHeading>
        <div className={styles.fitGrid}>
          <div className={styles.card}>
            <Icon kind="book" />
            <h3>เล่มนี้เขียนให้ใคร</h3>
            <ul className={styles.plainList}>
              {audience?.kind === "bullets" &&
                audience.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <h4>พื้นฐานที่ต้องมี</h4>
            <ul className={styles.plainList}>
              {prerequisites?.kind === "bullets" &&
                prerequisites.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className={styles.fitNote}>
              ส่วน optimizer, execution plan และ statistics ไม่ต้องรู้มาก่อน
              เดี๋ยวผมสอนให้
            </p>
          </div>
          <div className={styles.card}>
            <Icon kind="plan" />
            <h3>เล่มนี้ไม่ครอบคลุมอะไร</h3>
            <p>ขอบเขตอยู่ที่คำสั่ง SQL เรื่องต่อไปนี้ไม่ได้อยู่ในเล่ม</p>
            <ul className={styles.plainList}>
              {exclusions?.kind === "bullets" &&
                exclusions.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className={styles.scopeNote}>
              <strong>รู้ขอบเขตก่อนเริ่ม</strong>
              <p>
                ถ้าปัญหาอยู่ที่ instance, OS, storage หรือ network
                ต้องวิเคราะห์ในระดับนั้นเพิ่มเติม
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`${styles.container} ${styles.detailsSection}`}
        aria-labelledby="details-title"
      >
        <div>
          <p className={styles.eyebrow}>ไฟล์ที่ได้รับ</p>
          <h2 id="details-title">
            หนังสือและแล็บ
            <br />
            พร้อมให้ลงมือทำ
          </h2>
          <p>{product.deliverables.join(" + ")}</p>
          <p>ผู้เขียน {product.authorName}</p>
        </div>
        <div>
          <dl className={styles.specs}>
            <div>
              <dt>รูปแบบ</dt>
              <dd>{product.kind}</dd>
            </div>
            <div>
              <dt>จำนวนหน้า</dt>
              <dd>{product.pages} หน้า</dd>
            </div>
            <div>
              <dt>ภาษา</dt>
              <dd>{product.language}</dd>
            </div>
            <div>
              <dt>ราคา</dt>
              <dd>{price} บาท</dd>
            </div>
          </dl>
          <p className={styles.fileNote}>{product.fileNote}</p>
          <Link href="/download" className={styles.textLink}>
            ซื้อแล้ว? กลับมาดาวน์โหลดหนังสือ →
          </Link>
        </div>
      </section>

      <section
        id="questions"
        className={`${styles.section} ${styles.container}`}
      >
        <div className={styles.faqLayout}>
          <SectionHeading label="คำถามที่พบบ่อย" title="รู้ก่อนสั่งซื้อ">
            หากยังมีคำถาม <Link href="/contact">ติดต่อผมได้ครับ</Link>
          </SectionHeading>
          <div className={styles.faqList}>
            {questions.map(([question, answer]) => (
              <details key={question} className={styles.faq}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        id="purchase"
        className={`${styles.darkSection} ${styles.purchase}`}
      >
        <div className={`${styles.container} ${styles.purchaseInner}`}>
          <div>
            <p className={styles.eyebrow}>Oracle 26ai SQL Tuning</p>
            <h2>
              พร้อมเริ่มจูน SQL
              <br />
              อย่างเป็นขั้นตอนหรือยัง
            </h2>
            <p>
              PDF ภาษา{product.language} {product.pages} หน้า พร้อมสคริปต์แล็บ
            </p>
          </div>
          <div className={styles.purchaseActions}>
            <strong>฿{price}</strong>
            <BuyButton buyUrl={product.buyUrl} />
            <a href="#examples" className={styles.secondary}>
              อ่านตัวอย่างก่อน
            </a>
            {!product.buyUrl && (
              <p>
                ระหว่างนี้สั่งซื้อได้ที่ <Link href="/contact">หน้าติดต่อ</Link>
              </p>
            )}
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.metaDesc,
          url,
          image: cover.startsWith("/") ? `${site.url}${cover}` : cover,
          inLanguage: "th",
          brand: { "@type": "Brand", name: site.name },
          author: { "@type": "Person", name: author.name },
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: product.currency,
            availability: product.buyUrl
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
            url: product.buyUrl || url,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "หน้าแรก",
              item: site.url,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "ผลิตภัณฑ์",
              item: `${site.url}/products`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: product.title,
              item: url,
            },
          ],
        }}
      />
    </article>
  );
}
