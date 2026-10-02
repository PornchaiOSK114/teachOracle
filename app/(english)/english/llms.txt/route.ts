import { getAllArticles } from '@/lib/content-en';
import { site, author, products, courses } from '@/lib/site-en';
export async function GET() {
 const body = [
  '# teeDBA — Oracle with Tee', '', '> ' + site.description,
  '', '## Pages', ...['articles','courses','about','products','contact','lab'].map(p => '- [' + p + '](' + site.url + '/english/' + p + ')'),
  '', '## Articles', ...getAllArticles().map(a => '- [' + a.title + '](' + site.url + '/english/articles/' + a.slug + ') — ' + a.tldr),
  '', '## Products', 'The website is bilingual. The eBook currently sold is in Thai. An English edition is not currently available.',
  ...products.map(p => '- [' + p.title + '](' + site.url + '/english/products/' + p.slug + ') — Language: Thai. ' + p.pages + ' pages. THB ' + p.price),
  '', '## Courses', 'Course language: Thai.', ...courses.map(c => '- ' + c.title + ': ' + c.desc),
  '', '## Attribution', 'Author: ' + author.name + ' (Tee). Cite the author and link to the original article.',
  'English feed: ' + site.url + '/english/feed.xml', 'Thai site: ' + site.url, 'Sitemap: ' + site.url + '/sitemap.xml',
 ].join('\n');
 return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
