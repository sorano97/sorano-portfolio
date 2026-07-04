"use client";

import { useCallback, useEffect, useState } from "react";

interface ConversationWindowProps {
  lines: string[];
  active: boolean;
  onComplete: () => void;
  soundTick?: () => void;
  className?: string;
}

export function ConversationWindow({
  lines,
  active,
  onComplete,
  soundTick,
  className
}: ConversationWindowProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const currentLine = lines[lineIndex] ?? "";
  const isComplete = charCount >= currentLine.length;

  const advance = useCallback(() => {
    if (!active) return;

    if (!isComplete) {
      setCharCount(currentLine.length);
      return;
    }

    if (lineIndex >= lines.length - 1) {
      onComplete();
      return;
    }

    setLineIndex((value) => value + 1);
    setCharCount(0);
  }, [active, currentLine.length, isComplete, lineIndex, lines.length, onComplete]);

  useEffect(() => {
    setLineIndex(0);
    setCharCount(0);
  }, [lines]);

  useEffect(() => {
    if (!active || isComplete) return;

    const timer = window.setTimeout(() => {
      setCharCount((value) => Math.min(value + 1, currentLine.length));
      const character = currentLine[charCount];
      if (character && character !== " " && character !== "\n") {
        soundTick?.();
      }
    }, 45);

    return () => window.clearTimeout(timer);
  }, [active, charCount, currentLine, isComplete, soundTick]);

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        advance();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, advance]);

  return (
    <button
      className={`pixel-panel block min-h-[190px] w-full px-8 py-7 text-left text-2xl leading-[1.7] max-md:min-h-[148px] max-md:px-5 max-md:py-5 max-md:text-lg ${className ?? ""}`}
      onClick={advance}
      type="button"
    >
      <span className="whitespace-pre-line">{currentLine.slice(0, charCount)}</span>
      {isComplete ? <span className="blink-caret" /> : null}
    </button>
  );
}
