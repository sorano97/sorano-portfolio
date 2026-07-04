"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const rotationFrames = [
  "/character/1.png",
  "/character/2.png",
  "/character/3.png",
  "/character/4.png",
  "/character/5.png",
  "/character/6.png",
  "/character/7.png",
  "/character/8.png"
];

const blinkFrames = ["/character/half.png", "/character/closed.png", "/character/half.png", "/character/1.png"];

interface CharacterDisplayProps {
  canAnimate: boolean;
  canTalk?: boolean;
  onTalk?: () => void;
}

export function CharacterDisplay({ canAnimate, canTalk = false, onTalk }: CharacterDisplayProps) {
  const [src, setSrc] = useState(rotationFrames[0]);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastY = useRef(0);
  const frameIndex = useRef(0);
  const scrollRemainder = useRef(0);
  const stopTimer = useRef<number | null>(null);
  const returnTimer = useRef<number | null>(null);
  const isScrollingRef = useRef(false);
  const lastDirection = useRef<1 | -1>(1);

  const preloadImages = useMemo(() => [...rotationFrames, "/character/half.png", "/character/closed.png"], []);

  useEffect(() => {
    preloadImages.forEach((imageSrc) => {
      const image = new window.Image();
      image.src = imageSrc;
    });
  }, [preloadImages]);

  useEffect(() => {
    if (!canAnimate) {
      setSrc(rotationFrames[0]);
      return;
    }

    lastY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY.current;
      lastY.current = currentY;

      if (delta === 0) return;

      setIsScrolling(true);
      isScrollingRef.current = true;
      scrollRemainder.current += Math.abs(delta);

      if (returnTimer.current) {
        window.clearTimeout(returnTimer.current);
        returnTimer.current = null;
      }

      const direction = delta > 0 ? 1 : -1;
      lastDirection.current = direction;

      if (scrollRemainder.current >= 100) {
        const steps = Math.floor(scrollRemainder.current / 100);
        scrollRemainder.current %= 100;
        frameIndex.current = (frameIndex.current + direction * steps + rotationFrames.length * 10) % rotationFrames.length;
        setSrc(rotationFrames[frameIndex.current]);
      }

      if (stopTimer.current) {
        window.clearTimeout(stopTimer.current);
      }

      stopTimer.current = window.setTimeout(() => {
        scrollRemainder.current = 0;

        const rotateToFront = () => {
          if (frameIndex.current === 0) {
            setIsScrolling(false);
            isScrollingRef.current = false;
            returnTimer.current = null;
            setSrc(rotationFrames[0]);
            return;
          }

          frameIndex.current =
            (frameIndex.current + lastDirection.current + rotationFrames.length) % rotationFrames.length;
          setSrc(rotationFrames[frameIndex.current]);
          returnTimer.current = window.setTimeout(rotateToFront, 95);
        };

        rotateToFront();
      }, 1500);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (stopTimer.current) {
        window.clearTimeout(stopTimer.current);
      }
      if (returnTimer.current) {
        window.clearTimeout(returnTimer.current);
      }
    };
  }, [canAnimate]);

  useEffect(() => {
    if (!canAnimate || isScrolling) return;

    let blinkTimer: number | null = null;
    let frameTimer: number | null = null;
    let cancelled = false;

    const scheduleBlink = () => {
      const delay = 4000 + Math.random() * 4000;
      blinkTimer = window.setTimeout(() => {
        if (cancelled || isScrollingRef.current || frameIndex.current !== 0) {
          scheduleBlink();
          return;
        }

        let index = 0;

        const showFrame = () => {
          if (cancelled || isScrollingRef.current) {
            setSrc(rotationFrames[frameIndex.current]);
            scheduleBlink();
            return;
          }

          setSrc(blinkFrames[index]);
          index += 1;

          if (index < blinkFrames.length) {
            frameTimer = window.setTimeout(showFrame, 90);
          } else {
            scheduleBlink();
          }
        };

        showFrame();
      }, delay);
    };

    scheduleBlink();

    return () => {
      cancelled = true;
      if (blinkTimer) window.clearTimeout(blinkTimer);
      if (frameTimer) window.clearTimeout(frameTimer);
    };
  }, [canAnimate, isScrolling]);

  return (
    <button
      aria-label="Talk to sorano"
      className={`fixed left-1/2 top-[75vh] z-20 h-[470px] w-[420px] -translate-x-1/2 -translate-y-full border-0 bg-transparent p-0 ${
        canTalk ? "cursor-pointer" : "pointer-events-none"
      }`}
      disabled={!canTalk}
      onClick={onTalk}
      type="button"
    >
      {preloadImages.map((imageSrc) => (
        <img
          alt={imageSrc === src ? "sorano pixel character" : ""}
          aria-hidden={imageSrc === src ? undefined : true}
          className={`absolute inset-0 h-full w-full object-contain [image-rendering:pixelated] ${
            imageSrc === src ? "block" : "hidden"
          }`}
          key={imageSrc}
          src={imageSrc}
        />
      ))}
    </button>
  );
}
