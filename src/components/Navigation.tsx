"use client";

import { motion } from "framer-motion";
import { useLocale } from "./LocaleProvider";
import { TransitionLink } from "./TransitionLink";

const items = [
  { href: "/about", label: "ABOUT" },
  { href: "/news", label: "NEWS" },
  { href: "/works", label: "WORKS" },
  { href: "/contact", label: "CONTACT" }
];

export function Navigation() {
  const { locale } = useLocale();
  const labels =
    locale === "ja"
      ? { about: "紹介", news: "ニュース", works: "作品", contact: "連絡先" }
      : { about: "ABOUT", news: "NEWS", works: "WORKS", contact: "CONTACT" };

  return (
    <motion.nav
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-0 top-0 z-30 flex w-full min-w-[1280px] justify-center border-b-[3px] border-line bg-surface/90 px-10 py-5 font-best backdrop-blur max-md:min-w-0 max-md:overflow-x-auto max-md:px-4 max-md:py-3"
      initial={{ y: -90, opacity: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      <div className="flex gap-9 text-xl max-md:gap-5 max-md:text-sm">
        {items.map((item) => (
          <TransitionLink className="transition hover:text-rose" href={item.href} key={item.href}>
            {item.href === "/about"
              ? labels.about
              : item.href === "/news"
                ? labels.news
                : item.href === "/works"
                  ? labels.works
                  : labels.contact}
          </TransitionLink>
        ))}
      </div>
    </motion.nav>
  );
}
