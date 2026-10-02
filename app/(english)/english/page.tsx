import { languageAlternates } from '@/lib/i18n';
import Link from 'next/link';
import AssetImage from '@/components/AssetImage';
import ArticleCard from '@/components/ArticleCard';
import { getAllArticles } from '@/lib/content-en';
import { expertise, stats, courses, author } from '@/lib/site-en';
import BookResources from '@/components/BookResources';

export const metadata = { alternates: languageAlternates('/english') };
export default function HomePage() {
  const latest = getAllArticles().slice(0, 6);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero-copy an">
          <h1 className="h1-hero">
            Teaching from experience
            <br />
            Oracle Database
            <br />
            <span style={{ color: 'var(--accent)' }}>More than 20 years</span>
          </h1>
          <p className="lead" style={{ maxWidth: 540 }}>
            Practical knowledge with <strong style={{ color: 'var(--text)' }}>{author.name} (Tee)</strong>{' '}
            For DBAs, developers and data engineers
          </p>
          <div className="flex-wrap">
            <Link href="/english/articles" className="btn btn-primary">
              Read articles →
            </Link>
            <Link href="/english/courses" className="btn btn-secondary">
              Explore courses
            </Link>
          </div>

          <div className="stats">
            {stats.map((s, i) => (
              <div key={s.label} style={{ display: 'contents' }}>
                {i > 0 && <div className="stat-divider" aria-hidden="true" />}
                <div>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-art an">
          <div className="hero-figure">
            <div className="hero-photo">
              <AssetImage
                src="/images/profile.jpg"
                alt={`${author.name} (Tee) Oracle Database specialist`}
                placeholder="Portrait of Tee"
                sizes="(max-width: 768px) 90vw, 340px"
                priority
              />
            </div>
            <div className="hero-code" aria-hidden="true">
              <span className="prompt">SQL&gt;</span> <span className="kw">SELECT</span> knowledge
              <br />
              <span className="kw">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FROM&nbsp;&nbsp;&nbsp;</span>
              ajarnTee ;
            </div>
          </div>
        </div>
      </section>

      {/* ---------- แถบความเชี่ยวชาญ ---------- */}
      <section className="band">
        <div className="container" style={{ paddingBlock: 22 }}>
          <div className="chip-row">
            <span className="mono muted" style={{ fontSize: 13, marginRight: 6 }}>
              Expertise:
            </span>
            {expertise.map((ex) => (
              <span key={ex} className="chip">
                {ex}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Latest articles ---------- */}
      <section className="container section">
        <div className="section-head">
          <div>
            <h2 className="h2">Latest articles</h2>
            <p className="muted" style={{ margin: 0, fontSize: 15.5 }}>
              Oracle Database knowledge you can put to work
            </p>
          </div>
          <Link href="/english/articles" className="btn btn-secondary btn-sm">
            All articles →
          </Link>
        </div>

        {latest.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-card)',
            }}
          >
            <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 17 }}>
              The first article is coming soon
            </p>
            <p className="muted" style={{ margin: 0, fontSize: 15 }}>
              Follow via{' '}
              <a href={author.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>{' '}
              or <Link href="/english/feed.xml">RSS</Link>
            </p>
          </div>
        ) : (
          <div className="grid-cards">
            {latest.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} locale="en" />
            ))}
          </div>
        )}
      </section>

      {/* ---------- อบรม In-house ---------- */}
      <section className="band-top">
        <div className="container section">
          <div className="text-center mb-8">
            <h2 className="h2">In-house training for your team</h2>
            <p
              className="muted"
              style={{ margin: '0 auto', fontSize: 16, maxWidth: 600, lineHeight: 1.6 }}
            >
              Oracle Database courses tailored to your team and practical production problems. Course language: Thai.
            </p>
          </div>
          <div className="grid-mini">
            {courses.map((c) => (
              <Link key={c.code} href="/english/courses" className="course-mini">
                <span className="eyebrow">{c.code}</span>
                <strong style={{ fontSize: 16.5, lineHeight: 1.35, fontWeight: 600 }}>
                  {c.title}
                </strong>
                <span className="muted" style={{ fontSize: 13.5 }}>
                  {c.level} · {c.duration}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="container section">
        <div className="panel-dark">
          <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', margin: '0 0 14px' }}>
            Want to develop your team’s Oracle skills?
          </h2>
          <p style={{ margin: '0 auto 26px', fontSize: 16, maxWidth: 520, lineHeight: 1.6 }}>
            Get in touch about training or a technical question.
          </p>
          <Link href="/english/contact" className="btn btn-primary">
            Contact Tee
          </Link>
        </div>
      </section>
      <BookResources />
    </>
  );
}
