'use client';
import Link from 'next/link';
export default function ErrorPage({ reset }: { reset: () => void }) {
 return <section className="mx-auto max-w-2xl px-6 py-24 text-center"><p className="section-kicker justify-center">LET’S TRY THAT AGAIN</p><h1 className="my-5 text-4xl font-semibold tracking-tight">A small interruption.</h1><p className="mb-8 text-sm leading-7 text-ink-500">We couldn’t load this page right now. Please try again in a moment. If you’re setting up the store, check that your database is available and the schema has been applied.</p><div className="flex justify-center gap-6"><button onClick={reset} className="primary-button">Try again</button><Link href="/" className="text-link">Back to home →</Link></div></section>
}
