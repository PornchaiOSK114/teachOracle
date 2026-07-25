import Link from 'next/link';
import type { Course } from '@/lib/site';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-card card-hover">
      <div className="course-head">
        <span className="eyebrow">{course.code}</span>
        <span className="course-level">{course.level}</span>
      </div>
      <h3 style={{ margin: '0 0 10px', fontSize: 20, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
        {course.title}
      </h3>
      <p
        className="muted"
        style={{ margin: '0 0 18px', fontSize: 14.5, lineHeight: 1.65, flex: 1 }}
      >
        {course.desc}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 18 }}>
        {course.tags.map((tag) => (
          <span key={tag} className="tag-mono">
            {tag}
          </span>
        ))}
      </div>
      <div className="course-foot">
        <span className="muted" style={{ fontSize: 13.5 }}>
          ⏱ {course.duration}
        </span>
        <Link href="/contact" className="btn btn-primary btn-sm">
          สอบถาม
        </Link>
      </div>
    </article>
  );
}
