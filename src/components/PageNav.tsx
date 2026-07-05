"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleProvider";
import { TransitionLink } from "./TransitionLink";

const items = [
  { href: "/about", label: "ABOUT" },
  { href: "/news", label: "NEWS" },
  { href: "/works", label: "WORKS" },
  { href: "/contact", label: "CONTACT" }
];

export function PageNav() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const currentPath = pathname === "/" ? pathname : pathname.replace(/\/$/, "");
  const labels =
    locale === "ja"
      ? { top: "トップ", about: "紹介", news: "ニュース", works: "作品", contact: "連絡先" }
      : { top: "TOP", about: "ABOUT", news: "NEWS", works: "WORKS", contact: "CONTACT" };

  return (
    <nav className="fixed left-0 top-0 z-40 flex w-full justify-center border-b-[3px] border-line bg-surface/90 px-8 py-4 font-best backdrop-blur max-md:overflow-x-auto max-md:px-4 max-md:py-3">
      <div className="flex items-center gap-4 text-base max-md:gap-2 max-md:text-xs">
        <TransitionLink className="px-3 py-2 transition hover:text-rose max-md:px-2" href="/">
          {labels.top}
        </TransitionLink>
        {items.map((item) => {
          const active = currentPath === item.href;
          const label = item.href === "/about" ? labels.about : item.href === "/news" ? labels.news : item.href === "/works" ? labels.works : labels.contact;
          return (
            <TransitionLink
              className={`px-3 py-2 transition hover:text-rose max-md:px-2 ${active ? "text-rose" : "text-ink"}`}
              href={item.href}
              key={item.href}
            >
              {label}
            </TransitionLink>
          );
        })}
      </div>
    </nav>
  );
}
