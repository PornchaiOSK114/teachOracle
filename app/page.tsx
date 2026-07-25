import Link from 'next/link';
import AssetImage from '@/components/AssetImage';
import ArticleCard from '@/components/ArticleCard';
import { getAllArticles } from '@/lib/content';
import { expertise, stats, courses, author } from '@/lib/site';

export default function HomePage() {
  const latest = getAllArticles().slice(0, 6);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero-copy an">
          <h1 className="h1-hero">
            สอนด้วยประสบการณ์
            <br />
            Oracle Database
            <br />
            <span style={{ color: 'var(--accent)' }}>มากกว่า 20 ปี</span>
          </h1>
          <p className="lead" style={{ maxWidth: 540 }}>
            ส่งต่อความรู้โดย <strong style={{ color: 'var(--text)' }}>{author.name} (อาจารย์ตี๋)</strong>{' '}
            สำหรับ DBA, Developer และ Data Engineer
          </p>
          <div className="flex-wrap">
            <Link href="/articles" className="btn btn-primary">
              อ่านบทความ →
            </Link>
            <Link href="/courses" className="btn btn-secondary">
              ดูคอร์สสอน
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
                alt={`${author.name} (อาจารย์ตี๋) ผู้เชี่ยวชาญ Oracle Database`}
                placeholder="รูปโปรไฟล์อาจารย์ตี๋"
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
              ความเชี่ยวชาญ:
            </span>
            {expertise.map((ex) => (
              <span key={ex} className="chip">
                {ex}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- บทความล่าสุด ---------- */}
      <section className="container section">
        <div className="section-head">
          <div>
            <h2 className="h2">บทความล่าสุด</h2>
            <p className="muted" style={{ margin: 0, fontSize: 15.5 }}>
              ความรู้ Oracle Database ที่นำไปใช้ได้จริง
            </p>
          </div>
          <Link href="/articles" className="btn btn-secondary btn-sm">
            ดูบทความทั้งหมด →
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
              บทความแรกกำลังจะมาเร็ว ๆ นี้
            </p>
            <p className="muted" style={{ margin: 0, fontSize: 15 }}>
              ติดตามได้ที่{' '}
              <a href={author.facebook} target="_blank" rel="noopener noreferrer">
                เพจ Facebook
              </a>{' '}
              หรือ <Link href="/feed.xml">RSS</Link>
            </p>
          </div>
        ) : (
          <div className="grid-cards">
            {latest.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ---------- อบรม In-house ---------- */}
      <section className="band-top">
        <div className="container section">
          <div className="text-center mb-8">
            <h2 className="h2">อบรม In-house สำหรับองค์กร</h2>
            <p
              className="muted"
              style={{ margin: '0 auto', fontSize: 16, maxWidth: 600, lineHeight: 1.6 }}
            >
              หลักสูตร Oracle Database ที่ออกแบบให้เหมาะกับทีมของคุณ สอนจากปัญหาจริงบนงาน Production
            </p>
          </div>
          <div className="grid-mini">
            {courses.map((c) => (
              <Link key={c.code} href="/courses" className="course-mini">
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
            อยากพัฒนาทักษะ Oracle ของทีม?
          </h2>
          <p style={{ margin: '0 auto 26px', fontSize: 16, maxWidth: 520, lineHeight: 1.6 }}>
            พูดคุยเรื่องหลักสูตร หรือฝากคำถามด้านเทคนิคได้เลย
          </p>
          <Link href="/contact" className="btn btn-primary">
            ติดต่ออาจารย์ตี๋
          </Link>
        </div>
      </section>
    </>
  );
}
