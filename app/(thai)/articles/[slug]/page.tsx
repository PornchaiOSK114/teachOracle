import ArticlePage, { articleMetadata } from '@/components/ArticlePage';
import { getArticleSlugs } from '@/lib/content';
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getArticleSlugs('th').map(slug => ({ slug })); }
export function generateMetadata(props: Props) { return articleMetadata({ ...props, locale: 'th' }); }
export default function Page(props: Props) { return <ArticlePage {...props} locale="th" />; }
