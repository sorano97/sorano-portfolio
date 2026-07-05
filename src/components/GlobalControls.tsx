"use client";

import { useEffect, useState } from "react";
import { LanguageToggle } from "./LanguageToggle";
import { useLocale } from "./LocaleProvider";
import { SoundToggle } from "./SoundToggle";
import { ThemeToggle } from "./ThemeToggle";

interface GlobalControlsProps {
  soundEnabled?: boolean;
  onSoundToggle?: () => void;
  onSoundReady?: (enabled: boolean) => void;
}

function readTheme() {
  try {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }
  } catch {
    // fall through
  }
  return "light";
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  try {
    window.localStorage.setItem("theme", theme);
  } catch {
    // ignore persistence errors
  }
}

function readSound() {
  try {
    const storedSound = window.localStorage.getItem("sound");
    if (storedSound === "on" || storedSound === "off") {
      return storedSound === "on";
    }
  } catch {
    // fall through
  }
  return false;
}

function writeSound(enabled: boolean) {
  try {
    window.localStorage.setItem("sound", enabled ? "on" : "off");
  } catch {
    // ignore persistence errors
  }
}

export function GlobalControls({ soundEnabled, onSoundToggle, onSoundReady }: GlobalControlsProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [internalSound, setInternalSound] = useState(false);
  const { locale, setLocale } = useLocale();
  const controlledSound = typeof soundEnabled === "boolean";
  const activeSound = controlledSound ? soundEnabled : internalSound;

  useEffect(() => {
    const theme = readTheme();
    setDarkMode(theme === "dark");
    applyTheme(theme);
    const sound = readSound();
    setInternalSound(sound);
    onSoundReady?.(sound);
  }, [onSoundReady]);

  const toggleTheme = () => {
    setDarkMode((current) => {
      const next = !current;
      applyTheme(next ? "dark" : "light");
      return next;
    });
  };

  const toggleSound = () => {
    if (onSoundToggle) {
      onSoundToggle();
      if (!controlledSound) {
        setInternalSound((current) => {
          const next = !current;
          writeSound(next);
          return next;
        });
      }
      return;
    }

    setInternalSound((current) => {
      const next = !current;
      writeSound(next);
      return next;
    });
  };

  useEffect(() => {
    if (!controlledSound) return;
    writeSound(activeSound);
  }, [activeSound, controlledSound]);

  return (
    <div className="fixed right-8 top-8 z-50 flex gap-2 max-md:right-3 max-md:top-3">
      <SoundToggle enabled={activeSound} onToggle={toggleSound} />
      <LanguageToggle locale={locale} onToggle={() => setLocale(locale === "ja" ? "en" : "ja")} />
      <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
    </div>
  );
}
