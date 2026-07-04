"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Typewriter } from "./Typewriter";

interface OpeningSequenceProps {
  onComplete: () => void;
  playSound: (name: "start" | "type" | "select") => void;
}

type OpeningStep = "start" | "welcome" | "loading" | "name";

export function OpeningSequence({ onComplete, playSound }: OpeningSequenceProps) {
  const [step, setStep] = useState<OpeningStep>("start");

  useEffect(() => {
    if (step !== "loading") return;

    const timer = window.setTimeout(() => setStep("name"), 2000);
    return () => window.clearTimeout(timer);
  }, [step]);

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-40 flex min-w-[1280px] items-center justify-center bg-surface px-5 font-best text-ink max-md:min-w-0"
        exit={{ opacity: 0 }}
        initial={{ opacity: 1 }}
      >
        {step === "start" ? (
          <div className="text-center">
            <h1 className="mb-14 text-6xl max-md:mb-10 max-md:text-4xl">sorano portfolio</h1>
            <button
              className="pixel-button px-14 py-5 text-3xl max-md:px-10 max-md:py-4 max-md:text-2xl"
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
          <p className="text-4xl max-md:text-2xl">
            <Typewriter
              active
              onDone={() => window.setTimeout(() => setStep("loading"), 650)}
              soundTick={() => playSound("type")}
              text="Welcome to my portfolio!!"
            />
          </p>
        ) : null}

        {step === "loading" ? (
          <p className="text-4xl max-md:text-2xl">Open...</p>
        ) : null}

        {step === "name" ? (
          <p className="text-4xl max-md:text-2xl">
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
