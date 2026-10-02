import ArticlePage, { articleMetadata } from '@/components/ArticlePage';
import { getArticleSlugs } from '@/lib/content';
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getArticleSlugs('en').map(slug => ({ slug })); }
export function generateMetadata(props: Props) { return articleMetadata({ ...props, locale: 'en' }); }
export default function Page(props: Props) { return <ArticlePage {...props} locale="en" />; }
