"use client";

import { motion } from "framer-motion";

const items = ["ABOUT", "NEWS", "WORKS", "CONTACT"];

export function Navigation() {
  return (
    <motion.nav
      animate={{ y: 0, opacity: 1 }}
      className="fixed left-0 top-0 z-30 flex w-full min-w-[1280px] justify-center border-b-[3px] border-line bg-white/90 px-10 py-5 font-best backdrop-blur"
      initial={{ y: -90, opacity: 0 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      <div className="flex gap-9 text-xl">
        {items.map((item) => (
          <a className="transition hover:text-rose" href={`#${item.toLowerCase()}`} key={item}>
            {item}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
