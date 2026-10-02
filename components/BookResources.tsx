import Link from 'next/link';
export default function BookResources() {
 return <section className="container section" id="book-resources"><h2 className="h2-sm">Book resources</h2><p><Link href="/en">Corrections and updates</Link> · <Link href="/en/lab">Lab setup and scripts</Link></p></section>;
}
