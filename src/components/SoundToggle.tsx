"use client";

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      aria-pressed={enabled}
      className="pixel-button fixed right-8 top-8 z-50 px-5 py-3 text-sm"
      onClick={onToggle}
      type="button"
    >
      SOUND {enabled ? "ON" : "OFF"}
    </button>
  );
}
