"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "./TransitionLink";

const items = [
  { href: "/about", label: "ABOUT" },
  { href: "/news", label: "NEWS" },
  { href: "/works", label: "WORKS" },
  { href: "/contact", label: "CONTACT" }
];

export function PageNav() {
  const pathname = usePathname();
  const currentPath = pathname === "/" ? pathname : pathname.replace(/\/$/, "");

  return (
    <nav className="fixed left-0 top-0 z-40 flex w-full justify-center border-b-[3px] border-line bg-white/90 px-8 py-4 font-best backdrop-blur max-md:overflow-x-auto max-md:px-4 max-md:py-3">
      <div className="flex items-center gap-4 text-base max-md:gap-2 max-md:text-xs">
        <TransitionLink className="px-3 py-2 transition hover:text-rose max-md:px-2" href="/">
          TOP
        </TransitionLink>
        {items.map((item) => {
          const active = currentPath === item.href;
          return (
            <TransitionLink
              className={`px-3 py-2 transition hover:text-rose max-md:px-2 ${active ? "text-rose" : "text-ink"}`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </TransitionLink>
          );
        })}
      </div>
    </nav>
  );
}
