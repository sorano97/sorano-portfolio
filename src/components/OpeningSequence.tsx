"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Typewriter } from "./Typewriter";

interface OpeningSequenceProps {
  onComplete: () => void;
  playSound: (name: "start" | "type" | "select") => void;
}

type OpeningStep = "start" | "welcome" | "loading" | "wait" | "name";

export function OpeningSequence({ onComplete, playSound }: OpeningSequenceProps) {
  const [step, setStep] = useState<OpeningStep>("start");

  useEffect(() => {
    if (step !== "loading") return;

    const timer = window.setTimeout(() => setStep("wait"), 2000);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step !== "wait") return;

    const timer = window.setTimeout(() => setStep("name"), 1300);
    return () => window.clearTimeout(timer);
  }, [step]);

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-40 flex min-w-[1280px] items-center justify-center bg-soft font-best text-ink"
        exit={{ opacity: 0 }}
        initial={{ opacity: 1 }}
      >
        {step === "start" ? (
          <div className="text-center">
            <h1 className="mb-14 text-6xl">sorano portfolio</h1>
            <button
              className="pixel-button px-14 py-5 text-3xl"
              onClick={() => {
                playSound("start");
                setStep("welcome");
              }}
              type="button"
            >
              START
            </button>
          </div>
        ) : null}

        {step === "welcome" ? (
          <p className="text-4xl">
            <Typewriter
              active
              onDone={() => window.setTimeout(() => setStep("loading"), 650)}
              soundTick={() => playSound("type")}
              text="Welcome to my portfolio!!"
            />
          </p>
        ) : null}

        {step === "loading" ? (
          <div className="w-[520px] text-center">
            <p className="mb-8 text-4xl">Loading...</p>
            <div className="h-8 border-[3px] border-line bg-white p-1">
              <motion.div
                animate={{ width: "100%" }}
                className="h-full bg-blush"
                initial={{ width: "0%" }}
                transition={{ duration: 2, ease: "linear" }}
              />
            </div>
          </div>
        ) : null}

        {step === "wait" ? <p className="animate-pulse text-4xl">Please wait...</p> : null}

        {step === "name" ? (
          <p className="text-4xl">
            <Typewriter
              active
              onDone={() => window.setTimeout(onComplete, 650)}
              soundTick={() => playSound("type")}
              text="I'm sorano"
            />
          </p>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}
