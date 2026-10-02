import Link from 'next/link';
export default function NotFound() {
 return <section className="container section"><p className="eyebrow">ORA-01403: no data found</p><h1 className="h1-page">Page not found</h1><p>This page may have moved, or the address may be incorrect.</p><div className="flex-wrap"><Link className="btn btn-primary" href="/english">Home</Link><Link className="btn btn-secondary" href="/english/articles">Browse articles</Link></div></section>;
}
