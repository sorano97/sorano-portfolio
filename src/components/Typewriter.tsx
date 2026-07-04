"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  active?: boolean;
  speed?: number;
  className?: string;
  onDone?: () => void;
  soundTick?: () => void;
}

export function Typewriter({
  text,
  active = true,
  speed = 45,
  className,
  onDone,
  soundTick
}: TypewriterProps) {
  const [count, setCount] = useState(0);
  const normalized = useMemo(() => text, [text]);
  const hasFinished = useRef(false);

  useEffect(() => {
    setCount(0);
    hasFinished.current = false;
  }, [normalized]);

  useEffect(() => {
    if (!active || count >= normalized.length) {
      if (count >= normalized.length && !hasFinished.current) {
        hasFinished.current = true;
        onDone?.();
      }
      return;
    }

    const timer = window.setTimeout(() => {
      setCount((value) => Math.min(value + 1, normalized.length));
      if (normalized[count] && normalized[count] !== " " && normalized[count] !== "\n") {
        soundTick?.();
      }
    }, speed);

    return () => window.clearTimeout(timer);
  }, [active, count, normalized, onDone, soundTick, speed]);

  return <span className={className}>{normalized.slice(0, count)}</span>;
}
