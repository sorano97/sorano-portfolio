"use client";

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
  className?: string;
}

export function ThemeToggle({ darkMode, onToggle, className = "" }: ThemeToggleProps) {
  return (
    <button
      aria-pressed={darkMode}
      className={`pixel-button px-5 py-3 text-sm max-md:px-3 max-md:py-2 max-md:text-[10px] ${className}`}
      onClick={onToggle}
      type="button"
    >
      THEME {darkMode ? "ON" : "OFF"}
    </button>
  );
}
