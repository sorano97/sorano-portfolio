"use client";

import { GlobalControls } from "@/components/GlobalControls";
import { useLocale } from "@/components/LocaleProvider";
import Link from "next/link";

export default function NotFound() {
  const { locale } = useLocale();
  const isJa = locale === "ja";

  return (
    <main className="flex min-h-screen min-w-[1280px] items-center justify-center bg-soft px-10 font-best text-ink max-md:min-w-0 max-md:px-5">
      <GlobalControls />
      <div className="pixel-panel w-[520px] px-12 py-10 text-center max-md:w-full max-md:px-6">
        <p className="mb-5 text-6xl max-md:text-5xl">404</p>
        <p className="mb-10 text-2xl max-md:text-xl">{isJa ? "ページが見つかりません..." : "Page not found..."}</p>
        <Link className="pixel-button inline-block px-8 py-4 text-xl max-md:text-base" href="/">
          {isJa ? "トップへ戻る" : "Back to TOP"}
        </Link>
      </div>
    </main>
  );
}
