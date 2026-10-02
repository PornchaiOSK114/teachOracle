import * as th from './site';
export type { Product } from './site';
export { expertise, customerLogoSlots, categories, ALL_CATEGORY, isPromoOpen, labKitEn, labLinks, errataEn } from './site';
export const site = { ...th.site, name: 'teeDBA — Oracle with Tee', shortName: 'Tee', locale: 'en_US', lang: 'en', description: 'Practical Oracle Database knowledge, SQL tuning and hands-on learning with Pornchai Krongthammachart (Tee), Oracle Certified Professional with more than 20 years of experience.', tagline: 'Practical Oracle Database teaching, built on 20+ years of experience' };
export const author = { ...th.author, name: th.author.nameEn, nickname: 'Tee', jobTitle: 'Oracle Database instructor and consultant', facebookLabel: 'teeDBA — Oracle with Tee', initials: 'Tee' };
export const trainingPartner = { ...th.trainingPartner, note: 'Ask about course details, public training dates, quotations and in-house training for your team.' };
export const stats = [{ num: '20+', label: 'years of experience' }, { num: 'OCP', label: 'Certified Professional' }, { num: '6', label: 'courses available' }];
const courseCopy: Record<string, readonly [string, string, string]> = {
 'DBA-101': ['Intermediate–advanced', '5 days', 'Database administration from architecture, storage and user security to day-to-day operations.'],
 'SQL-101': ['Beginner', '3 days', 'SQL fundamentals: SELECT, JOIN and subqueries, plus practical use of SQL*Plus.'],
 'PLSQL-201': ['Intermediate', '4 days', 'Database programming with procedures, functions, packages, triggers and exception handling.'],
 'TUNE-301': ['Advanced', '4 days', 'Investigate and improve SQL performance using execution plans, index strategies, statistics and optimizer hints.'],
 'RMAN-201': ['Intermediate–advanced', '3 days', 'Plan and practice backup and recovery with RMAN, including recovery scenarios.'],
 'LINUX-101': ['Intermediate', '3 days', 'Linux skills for DBAs: packages, storage, kernel parameters and preparing a server for Oracle.'],
};
export const courses = th.courses.map(course => {
 const copy = courseCopy[course.code];
 if (!copy) throw new Error('Add approved English course copy for ' + course.code);
 return { ...course, level: copy[0], duration: copy[1], desc: copy[2] };
});
export const timeline = [
 { title: 'Oracle Certified Professional (OCP)', desc: 'Professional certification in Oracle Database.' },
 { title: 'Oracle Database instructor for organizations — 20+ years', desc: 'Teaching teams how to apply Oracle knowledge in production environments.' },
 { title: 'Windows IT Pro magazine — DATABASE columnist', desc: 'Writing database articles for a wider technical audience.' },
 { title: 'Best-selling pocket-book author', desc: 'Books about technology and building a brand.' },
];
export const books = th.books.map((book, i) => ({ ...book, type: i === 0 ? 'Magazine column' : 'Pocket Book · Best Seller', title: ['Windows IT Pro — DATABASE column', 'Popular Apps (Thai edition)', 'Building a Brand with Social Media (Thai edition)'][i] }));
const sections: th.ProductSection[] = [
 { kind: 'paragraphs', items: [
  "When I looked for a Thai-language book about SQL tuning on Oracle 26ai, I couldn't find one. More broadly, Thai-language material explaining Oracle Database is hard to come by.",
  "I don't think that's because knowledgeable people are lacking. Writing a book takes a great deal of time, and people with the experience to write one are often too busy. I nearly decided against writing it for the same reason.",
  "Many Thai DBAs and developers end up piecing things together from the English Oracle documentation. They can read it, but connecting the topics into a coherent picture can take months.",
 ] },
 { kind: 'paragraphs', heading: 'Who I wrote this for', items: ["A system that used to be fast suddenly slows down. You open the query, but you're not sure where to start. That's the situation this book addresses."] },
 { kind: 'bullets', heading: '', items: ['DBAs and developers already working with Oracle.', 'Readers who have studied databases and want to understand practical work.'] },
 { kind: 'bullets', heading: 'Prerequisites', items: ['Ability to write SQL and understand SELECT statements joining several tables.', 'Some experience with SQL*Plus or SQLcl.'] },
 { kind: 'note', text: "You don't need prior knowledge of the optimizer, execution plans or statistics. I explain those in the book." },
 { kind: 'paragraphs', heading: 'Scope', items: ['The focus is tuning individual SQL statements. It does not cover the following areas:'] },
 { kind: 'bullets', heading: '', deny: true, items: ['Instance tuning, including instance-level SGA/PGA configuration.', 'System tuning: OS, storage and network.', 'PL/SQL tuning.'] },
 { kind: 'paragraphs', heading: 'How to use the book', items: ["Don't just read: install the included lab and run the examples as you work through each chapter."] },
 { kind: 'note', heading: 'Contents', text: '10 chapters and 2 appendices: SQL processing and the Cost-Based Optimizer; execution plans; statistics and histograms; finding application SQL with SQL Trace, TRCSESS and TKPROF; access paths and indexes; joins and sorting; hints, query transformations and materialized views; bind variables and adaptive execution; AWR/ASH, SQL Plan Management and Automatic Indexing; four workshops; QUALIFY, GROUP BY ALL and VALUES; Vector and JSON Relational Duality.' },
];
export const products: readonly th.Product[] = th.products.map((product) => {
 if (product.slug !== 'oracle-26-ai-sql-tuning') throw new Error('Add approved English product copy for ' + product.slug + ' in lib/site-en.ts before release.');
 return ({
 ...product,
 subtitle: 'A step-by-step approach to faster SQL — understand the principles, from Oracle 19c to 26ai.',
 kind: 'E-Book (PDF)', authorName: author.name + ' (Tee)', language: 'Thai',
 deliverables: ['173-page PDF in Thai', 'Lab setup scripts (.zip)'],
 fileNote: 'The PDF is marked with your purchase email on every page except the cover. You can download it 5 times. Lab script downloads are unlimited.',
 cardDesc: 'Step-by-step SQL tuning, covering Oracle 19c through 26ai. Written in Thai.',
 metaDesc: 'Thai-language, 173-page Oracle SQL tuning eBook covering 19c to 26ai: execution plans, statistics, indexes, joins, hints and SQL Plan Management, with four practical workshops. An English edition is not currently available.',
 sections,
 samples: product.samples.map((sample, i) => ({ ...sample,
  group: i < 9 ? 'Contents' : i === 9 ? 'About the author' : 'Sample pages',
  alt: i < 9 ? 'Thai table of contents — page ' + (i + 1) : i === 9 ? 'About the author (Thai)' : 'Thai sample page ' + (i - 9),
 })),
 // The existing promotion is expired. Do not silently translate or revive a future commercial offer.
 promo: undefined,
});
});
export function getProduct(slug: string) { return products.find((p) => p.slug === slug); }
export const upcomingProducts = [
 { icon: '🎥', title: 'Online Course: Oracle DBA fundamentals in practice', desc: 'Self-paced video lessons with step-by-step labs. Course language: Thai.' },
 { icon: '🧰', title: 'Toolkit: DBA scripts', desc: 'Scripts for database health checks and everyday work. Product documentation language: Thai.' },
];
