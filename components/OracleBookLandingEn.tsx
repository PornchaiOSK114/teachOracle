import Link from "next/link";
import type { ReactNode } from "react";
import AssetImage from "./AssetImage";
import BookPreview from "./BookPreview";
import JsonLd from "./JsonLd";
import type { CarouselSlide } from "./SampleCarousel";
import { author, isPromoOpen, site, type Product } from "@/lib/site-en";
import styles from "./OracleBookLanding.module.css";

// Chapter names and scope are from the existing product description and public contents pages.
const chapters = [
  [
    "01",
    "How SQL works",
    "SQL processing architecture and the Cost-Based Optimizer",
    "Understand the SQL lifecycle, parsing and optimizer plan selection",
  ],
  [
    "02",
    "Learn to read plans",
    "Reading and interpreting execution plans",
    "See how the database accesses data and processes a statement",
  ],
  [
    "03",
    "Help the optimizer understand your data",
    "Optimizer statistics and histograms",
    "Understand statistics and data distribution",
  ],
  [
    "04",
    "Find application SQL",
    "Finding SQL submitted by applications",
    "SQL Trace, TRCSESS and TKPROF",
  ],
  [
    "05",
    "Choose suitable access paths",
    "Data access and indexes",
    "Understand data access and index choices",
  ],
  [
    "06",
    "Join and sort data",
    "Joins and sorting",
    "Analyze join methods and sorting steps",
  ],
  [
    "07",
    "Adjust how SQL is processed",
    "Optimizer hints, query transformation and materialized views",
    "Explore tools and approaches for changing execution plans",
  ],
  [
    "08",
    "Understand plan reuse",
    "Bind variables and adaptive execution",
    "Understand plan reuse and runtime adaptation",
  ],
  [
    "09",
    "Keep plans stable",
    "Stability through automation",
    "AWR/ASH, SQL Plan Management and Automatic Indexing",
  ],
  [
    "10",
    "Put it all into practice",
    "Four practical case-study workshops",
    "Apply the preceding chapters to SQL analysis and tuning",
  ],
] as const;

const questions = [
  [
    "What should I know beforehand?",
    "You should be able to write SQL, understand multi-table joins and have some experience with SQL*Plus or SQLcl. The book introduces the optimizer, execution plans and statistics.",
  ],
  [
    "Which Oracle versions does it cover?",
    "It covers 19c through 26ai, with appendices for newer SQL syntax, Vector and JSON Relational Duality. Some features depend on the version and edition. Check the requirements of each chapter before running the labs.",
  ],
  [
    "What files do I receive?",
    "A Thai-language PDF eBook and lab setup scripts (.zip). An English edition of the eBook is not currently available.",
  ],
  [
    "How do I download it again later?",
    "After payment, a download link is sent to your purchase email. To return later, use the download page and the same email to request a verification code. Check your spam folder if needed.",
  ],
  [
    "Is the PDF watermarked? Are downloads limited?",
    "Your purchase email is marked on every PDF page except the cover. You can download the PDF 5 times; lab script downloads are unlimited.",
  ],
  [
    "Can I just read the book?",
    "You can read for understanding. To see how the numbers and plans change, I recommend installing the included lab and running the examples in each chapter.",
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
      Buy Thai eBook <Icon kind="arrow" />
    </a>
  ) : (
    <button type="button" className={styles.primary} disabled>
      Ordering will open soon
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
  const url = `${site.url}/english/products/${product.slug}`;
  const promo = isPromoOpen(product.promo) ? product.promo : null;
  const intro = product.sections[0];
  const audience = product.sections.find(
    (section) =>
      section.kind === "bullets" && !section.heading && !section.deny,
  );
  const prerequisites = product.sections.find(
    (section) => section.heading === "Prerequisites",
  );
  const exclusions = product.sections.find(
    (section) => section.kind === "bullets" && section.deny,
  );

  return (
    <article className={styles.landing}>
      <nav className={styles.jumpNav} aria-label="Book page sections">
        <div className={styles.jumpInner}>
          <span className={styles.navTitle}>
            SQL Tuning <span>Language: Thai</span>
          </span>
          <div className={styles.jumpLinks}>
            <a href="#overview">Overview</a>
            <a href="#examples">Samples</a>
            <a href="#contents">Contents</a>
            <a href="#audience">Who it is for</a>
            <a href="#questions">Questions</a>
          </div>
          <a href="#purchase" className={styles.navBuy}>
            Buy Thai eBook <span aria-hidden="true">↗</span>
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
            <Link href="/english/products">Products</Link>
            <span aria-hidden="true"> / </span>E-Book
          </p>
          <span className={styles.badge}>{product.kind} · Language: Thai</span>
          <p className={styles.fileNote}>An English edition is not currently available. This page describes the Thai eBook.</p>
          <h1 id="book-title">
            <span>
              Oracle <em>26ai</em>
            </span>
            <br />
            SQL Tuning
          </h1>
          <p className={styles.heroSubtitle}>
            Make SQL faster{' '}
            <br className={styles.mobileBreak} />
            Step by step
          </p>
          <p className={styles.heroDescription}>
            Understand the principles, read execution plans and run the labs. Covering Oracle 19c through 26ai, for DBAs and developers who want a practical starting point for slow SQL.
          </p>
          <p className={styles.byline}>By {product.authorName}</p>
          <div className={styles.heroPrice}>
            <strong>฿{price}</strong>
            <span>PDF language: {product.language} with lab scripts</span>
          </div>
          <div className={styles.actions}>
            <BuyButton buyUrl={product.buyUrl} />
            <a className={styles.secondary} href="#examples">
              <Icon kind="book" /> Read sample pages
            </a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.coverHalo} />
          <div className={styles.bookMockup}>
            <div className={styles.bookCover}>
              <AssetImage
                src={cover}
                alt={`Book cover ${product.title}`}
                placeholder="Book cover"
                fit="contain"
                sizes="(max-width: 600px) 68vw, 360px"
                priority
              />
            </div>
          </div>
          <p className={styles.coverCaption}>
            Read the principles, then test them in the lab
          </p>
          <span className={styles.visualLabel}>19c → 26ai</span>
        </div>
      </section>

      <div
        className={`${styles.container} ${styles.facts}`}
        aria-label="Book at a glance"
      >
        {(
          [
            [
              "book",
              `${product.pages} pages`,
              `Language: ${product.language} in PDF format`,
            ],
            ["file", "10 chapters + 2 appendices", "A connected learning sequence"],
            [
              "plan",
              `${slides.length} sample pages`,
              "Look inside before deciding",
            ],
            ["lab", "4 workshops", "Practice bringing the analysis together"],
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
            <p>Opening soon</p>
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
          label="Start with the problem"
          title="SQL is slow. Where should you start?"
        >
          I wrote this for readers who see a slowdown and open the query, but are not yet sure what to investigate.
        </SectionHeading>
        <div className={styles.comparison}>
          <div className={`${styles.card} ${styles.problem}`}>
            <p className={styles.cardLabel}>Before tuning</p>
            <h3 id="problem-title">You see the slowdown, not the cause</h3>
            <ul className={styles.checkList}>
              {[
                "Reading SQL without finding the bottleneck",
                "Opening a plan without knowing what to inspect",
                "Wondering whether to add an index or rewrite the query",
                "Reading several topics without connecting them",
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
            <p className={styles.cardLabel}>What you will practice</p>
            <h3>Build a reasoned analysis</h3>
            <ul className={styles.checkList}>
              {[
                "Understand how the optimizer chooses a plan",
                "Read and interpret execution plans",
                "Examine statistics, indexes and joins before changing them",
                "Run the labs and observe the actual behavior",
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
            Read the background from the preface <span aria-hidden="true">+</span>
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
            label="How to learn with this book"
            title="Understand, then practice"
          >
            Do more than read. Install the included lab and run the examples as you work through each chapter.
          </SectionHeading>
          <div className={styles.steps}>
            {(
              [
                [
                  "01",
                  "book",
                  "Understand the principles",
                  "Begin with the SQL lifecycle and the optimizer to understand the basis for database decisions.",
                ],
                [
                  "02",
                  "plan",
                  "Read execution plans",
                  "Connect the plan with statistics, indexes and data access.",
                ],
                [
                  "03",
                  "lab",
                  "Practice in the lab",
                  "Run the examples, observe the results and combine your understanding in the workshops.",
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
            label="From chapter 1"
            title="See the SQL and its output"
          >
            The hard-parse and soft-parse example uses v$sql to inspect executions and plan loads.
          </SectionHeading>
          <div className={styles.codeGrid}>
            <div className={styles.codeWindow}>
              <div className={styles.windowBar}>
                <span aria-hidden="true">● ● ●</span> SQL from page 5
              </div>
              <pre>
                <code>{`SELECT sql_id, parse_calls, executions, loads, sql_text
FROM   v$sql
WHERE  sql_text LIKE '%LAB_BIND%'
AND    sql_text NOT LIKE '%v$sql%';`}</code>
              </pre>
              <p>Find statements in the shared pool marked with the LAB_BIND comment.</p>
            </div>
            <div className={styles.codeWindow}>
              <div className={styles.windowBar}>
                Output from page 6 <span>Three selected columns</span>
              </div>
              <div className={styles.resultTable}>
                <table>
                  <caption className={styles.srOnly}>
                    LAB_BIND output from page 6
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
                In this example, there are 3 executions and 1 load. The same page also compares statements using literal values.
              </p>
            </div>
          </div>
          <a href="#examples" className={styles.darkLink}>
            Open the original page and its explanation{" "}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section
        id="examples"
        className={`${styles.section} ${styles.container}`}
      >
        <SectionHeading label="Read before buying" title="Look inside the Thai-language book">
          Contents, author page and sample text:  {slides.length}{" "}
          pages. Choose a category and open a page to enlarge it. The book pages are in Thai.
        </SectionHeading>
        <BookPreview slides={slides} locale="en" />
      </section>

      <section
        id="contents"
        className={`${styles.section} ${styles.softSection}`}
      >
        <div className={styles.container}>
          <SectionHeading
            label="Inside the book"
            title="10 chapters that connect the ideas"
          >
            From SQL processing to reading plans, tuning statements, maintaining plan stability and practical workshops.
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
            <p className={styles.eyebrow}>2 appendices</p>
            <div>
              <h3>A / New SQL syntax</h3>
              <p>QUALIFY, GROUP BY ALL and VALUES</p>
            </div>
            <div>
              <h3>B / Vector and JSON</h3>
              <p>Vector and JSON Relational Duality</p>
            </div>
          </div>
          <p className={styles.licenseNote}>
            Some features and tools depend on your Oracle version, edition and licensing. Check the relevant chapter requirements before production use.
          </p>
          <a className={styles.textLink} href="#examples">
            Open the contents and sample pages <span aria-hidden="true">↑</span>
          </a>
        </div>
      </section>

      <section
        id="audience"
        className={`${styles.section} ${styles.container}`}
      >
        <SectionHeading label="Before you begin" title="Is this book for you?">
          This book focuses on statement-level SQL tuning for readers who can already write SQL and want to understand what happens behind it.
        </SectionHeading>
        <div className={styles.fitGrid}>
          <div className={styles.card}>
            <Icon kind="book" />
            <h3>Who it is for</h3>
            <ul className={styles.plainList}>
              {audience?.kind === "bullets" &&
                audience.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <h4>Prerequisites</h4>
            <ul className={styles.plainList}>
              {prerequisites?.kind === "bullets" &&
                prerequisites.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className={styles.fitNote}>
              No prior knowledge of the optimizer, execution plans or statistics is required. I explain those in the book.
            </p>
          </div>
          <div className={styles.card}>
            <Icon kind="plan" />
            <h3>What it does not cover</h3>
            <p>The scope is individual SQL statements. These topics are outside the book:</p>
            <ul className={styles.plainList}>
              {exclusions?.kind === "bullets" &&
                exclusions.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className={styles.scopeNote}>
              <strong>Know the scope</strong>
              <p>
                Problems at the instance, OS, storage or network level need investigation at those levels.
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
          <p className={styles.eyebrow}>What you receive</p>
          <h2 id="details-title">
            The book and the lab
            <br />
            Ready for hands-on practice
          </h2>
          <p>{product.deliverables.join(" + ")}</p>
          <p>Author {product.authorName}</p>
        </div>
        <div>
          <dl className={styles.specs}>
            <div>
              <dt>Format</dt>
              <dd>{product.kind}</dd>
            </div>
            <div>
              <dt>Page count</dt>
              <dd>{product.pages} pages</dd>
            </div>
            <div>
              <dt>Language: </dt>
              <dd>{product.language}</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>{price} THB</dd>
            </div>
          </dl>
          <p className={styles.fileNote}>{product.fileNote}</p>
          <Link href="/english/download" className={styles.textLink}>
            Already purchased? Download your book →
          </Link>
        </div>
      </section>

      <section
        id="questions"
        className={`${styles.section} ${styles.container}`}
      >
        <div className={styles.faqLayout}>
          <SectionHeading label="Frequently asked questions" title="Before ordering">
            More questions?  <Link href="/english/contact">Contact me</Link>
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
              Ready to start tuning SQL
              <br />
              step by step?
            </h2>
            <p>
              PDF language: {product.language} {product.pages} pages with lab scripts
            </p>
          </div>
          <div className={styles.purchaseActions}>
            <strong>฿{price}</strong>
            <BuyButton buyUrl={product.buyUrl} />
            <a href="#examples" className={styles.secondary}>
              Read a sample first
            </a>
            {!product.buyUrl && (
              <p>
                For ordering, visit  <Link href="/english/contact">Contact</Link>
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
              name: "Home",
              item: site.url + "/english",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Products",
              item: `${site.url}/english/products`,
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
