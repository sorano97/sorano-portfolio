"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from "react";

interface TransitionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
}

export function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [filledBlocks, setFilledBlocks] = useState(0);
  const targetHref = href === "/" ? "/?skipOpening=1" : href;

  useEffect(() => {
    if (!loading) return;

    setFilledBlocks(0);
    const startedAt = window.performance.now();
    const timer = window.setInterval(() => {
      const elapsed = window.performance.now() - startedAt;
      setFilledBlocks(Math.min(8, Math.floor(elapsed / 100) + 1));
    }, 50);

    return () => window.clearInterval(timer);
  }, [loading]);

  return (
    <>
      <a
        href={targetHref}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

          event.preventDefault();
          if (href === "/") {
            try {
              window.sessionStorage.setItem("skipTopOpening", "true");
            } catch {
              // Navigation should continue even when sessionStorage is unavailable.
            }
          }
          setLoading(true);
          window.setTimeout(() => router.push(targetHref), 800);
        }}
        {...props}
      >
        {children}
      </a>
      <AnimatePresence>
        {loading ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-soft font-best text-ink"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="text-center">
              <p className="mb-5 text-3xl max-md:text-2xl">Open...</p>
              <p className="mb-4 text-xl max-md:text-base">Loading...</p>
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 8 }).map((_, index) => (
                  <span className={`h-5 w-5 border-2 border-line ${index < filledBlocks ? "bg-blush" : "bg-white"}`} key={index} />
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
