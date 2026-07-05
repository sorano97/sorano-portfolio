"use client";

import type { Locale } from "./LocaleProvider";

interface LanguageToggleProps {
  locale: Locale;
  onToggle: () => void;
  className?: string;
}

export function LanguageToggle({ locale, onToggle, className = "" }: LanguageToggleProps) {
  return (
    <button
      aria-pressed={locale === "ja"}
      className={`pixel-button px-5 py-3 text-sm max-md:px-3 max-md:py-2 max-md:text-[10px] ${className}`}
      onClick={onToggle}
      type="button"
    >
      {locale === "ja" ? "JAPANESE" : "ENGLISH"}
    </button>
  );
}
