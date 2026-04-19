import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto mt-20 w-[95%] max-w-2xl rounded-2xl glass p-10 text-center">
      <h1 className="font-[var(--font-poppins)] text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-foreground/70">The page you requested does not exist.</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 text-white">Back home</Link>
    </section>
  );
}
