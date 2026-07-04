import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen min-w-[1280px] items-center justify-center bg-soft px-10 font-best text-ink">
      <div className="pixel-panel w-[520px] px-12 py-10 text-center">
        <p className="mb-5 text-6xl">404</p>
        <p className="mb-10 text-2xl">Page not found...</p>
        <Link className="pixel-button inline-block px-8 py-4 text-xl" href="/">
          Back to TOP
        </Link>
      </div>
    </main>
  );
}
