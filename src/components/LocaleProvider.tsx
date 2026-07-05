"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "en" | "ja";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readLocale() {
  try {
    const stored = window.localStorage.getItem("locale");
    if (stored === "en" || stored === "ja") return stored;
    const cookieMatch = document.cookie.match(/(?:^|;\s*)locale=(en|ja)(?:;|$)/);
    if (cookieMatch?.[1] === "en" || cookieMatch?.[1] === "ja") return cookieMatch[1];
  } catch {
    // fall through
  }

  return window.navigator.language.toLowerCase().startsWith("ja") ? "ja" : "en";
}

function writeLocale(locale: Locale) {
  try {
    window.localStorage.setItem("locale", locale);
    document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = locale === "ja" ? "ja" : "en";
  } catch {
    // ignore persistence errors
  }
}

export function LocaleProvider({ children, initialLocale = "en" }: { children: ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const initial = readLocale();
    setLocaleState(initial);
    writeLocale(initial);
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale: (next) => {
        setLocaleState(next);
        writeLocale(next);
      }
    }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return value;
}
