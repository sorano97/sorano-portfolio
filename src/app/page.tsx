"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CharacterDisplay } from "@/components/CharacterDisplay";
import { ConversationWindow } from "@/components/ConversationWindow";
import { Navigation } from "@/components/Navigation";
import { OpeningSequence } from "@/components/OpeningSequence";
import { SoundToggle } from "@/components/SoundToggle";
import { TransitionLink } from "@/components/TransitionLink";
import { assetPath } from "@/lib/assetPath";
import {
  characterQuestions,
  contacts,
  news,
  profile,
  randomMessages,
  works,
  type CharacterQuestionOption,
  type WorkCategory
} from "@/data/portfolio";

const TALK_EVENT_RATE = {
  message: 0.8,
  question: 0.2
};

const RARE_QUESTION_RATE = 0.03;

type CharacterTalkMode = "idle" | "message" | "question" | "response";

interface CharacterTalkState {
  mode: CharacterTalkMode;
  currentMessageId?: string;
  currentQuestionId?: string;
  currentText: string;
  selectedOptionIndex: number;
  options: CharacterQuestionOption[];
}

const openingLines = [
  "Hello!",
  "I'm sorano.",
  "I'm a student creator.",
  "I create software,\nhardware and designs.",
  'My dream is to spread\n"cute" to the world.',
  "Thanks for stopping by!"
];

const aboutLines = [
  "Welcome to ABOUT.",
  "I like making things that feel simple,\nsoft and a little playful.",
  "Software, hardware and design are\nall tools for sharing cute ideas."
];

function readLocalStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function consumeSkipTopOpening() {
  if (typeof window === "undefined") return false;

  try {
    const shouldSkip = window.sessionStorage.getItem("skipTopOpening") === "true";
    if (shouldSkip) {
      window.sessionStorage.removeItem("skipTopOpening");
    }
    return shouldSkip;
  } catch {
    return false;
  }
}

function shouldSkipTopOpening() {
  if (typeof window === "undefined") return false;

  try {
    return new URLSearchParams(window.location.search).get("skipOpening") === "1";
  } catch {
    return false;
  }
}

function pickWithoutRepeat<T extends { id: string }>(items: T[], lastId?: string) {
  const candidates = items.length > 1 ? items.filter((item) => item.id !== lastId) : items;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function Home() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [openingStage, setOpeningStage] = useState<"sequence" | "conversation" | "done">(() =>
    shouldSkipTopOpening() || consumeSkipTopOpening() ? "done" : "sequence"
  );
  const [hasSeenAbout, setHasSeenAbout] = useState(true);
  const [isAboutConversationActive, setIsAboutConversationActive] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<string | undefined>();
  const [lastQuestionId, setLastQuestionId] = useState<string | undefined>();
  const [characterTalk, setCharacterTalk] = useState<CharacterTalkState>({
    mode: "idle",
    currentText: "",
    selectedOptionIndex: 0,
    options: []
  });
  const audioRefs = useRef<Partial<Record<"start" | "type" | "select", HTMLAudioElement>>>({});

  useEffect(() => {
    document.body.classList.toggle("opening-locked", openingStage !== "done");
    return () => document.body.classList.remove("opening-locked");
  }, [openingStage]);

  useEffect(() => {
    if (openingStage === "sequence") return;

    try {
      window.history.replaceState(null, "", window.location.pathname);
    } catch {
      return;
    }
  }, [openingStage]);

  useEffect(() => {
    setHasSeenAbout(readLocalStorage("hasSeenAbout") === "true");
  }, []);

  const playSound = useCallback(
    (name: "start" | "type" | "select") => {
      if (!soundEnabled) return;

      try {
        const audio = audioRefs.current[name] ?? new Audio(assetPath(`/sounds/${name}.mp3`));
        audioRefs.current[name] = audio;
        audio.currentTime = 0;
        void audio.play().catch(() => undefined);
      } catch {
        return;
      }
    },
    [soundEnabled]
  );

  const showSite = openingStage === "done";
  const canStartCharacterTalk = showSite && !isAboutConversationActive && characterTalk.mode === "idle";

  const closeCharacterTalk = useCallback(() => {
    if (characterTalk.mode === "idle") return;

    if (characterTalk.currentMessageId) {
      setLastMessageId(characterTalk.currentMessageId);
    }
    if (characterTalk.currentQuestionId) {
      setLastQuestionId(characterTalk.currentQuestionId);
    }

    playSound("select");
    setCharacterTalk({
      mode: "idle",
      currentText: "",
      selectedOptionIndex: 0,
      options: []
    });
  }, [characterTalk, playSound]);

  const selectCharacterOption = useCallback(
    (optionIndex: number) => {
      setCharacterTalk((current) => {
        if (current.mode !== "question") return current;

        const option = current.options[optionIndex];
        if (!option) return current;

        playSound("select");
        return {
          ...current,
          mode: "response",
          currentText: option.response,
          selectedOptionIndex: optionIndex
        };
      });
    },
    [playSound]
  );

  const moveCharacterOption = useCallback((direction: 1 | -1) => {
    setCharacterTalk((current) => {
      if (current.mode !== "question" || current.options.length === 0) return current;

      return {
        ...current,
        selectedOptionIndex:
          (current.selectedOptionIndex + direction + current.options.length) % current.options.length
      };
    });
  }, []);

  const startCharacterTalk = useCallback(() => {
    if (!canStartCharacterTalk) return;

    if (Math.random() < TALK_EVENT_RATE.question) {
      const rareQuestions = characterQuestions.filter((question) => question.rare);
      const normalQuestions = characterQuestions.filter((question) => !question.rare);
      const availableRareQuestions = rareQuestions.filter((question) => question.id !== lastQuestionId);
      const shouldUseRare = availableRareQuestions.length > 0 && Math.random() < RARE_QUESTION_RATE;
      const pool = shouldUseRare ? availableRareQuestions : normalQuestions;
      const question = pickWithoutRepeat(pool, lastQuestionId);

      if (!question) return;

      playSound("select");
      setCharacterTalk({
        mode: "question",
        currentQuestionId: question.id,
        currentText: question.question,
        selectedOptionIndex: 0,
        options: question.options
      });
      return;
    }

    const message = pickWithoutRepeat(randomMessages, lastMessageId);
    if (!message) return;

    setCharacterTalk({
      mode: "message",
      currentMessageId: message.id,
      currentText: message.text,
      selectedOptionIndex: 0,
      options: []
    });
  }, [canStartCharacterTalk, lastMessageId, lastQuestionId, playSound]);

  return (
    <main className="relative min-h-screen min-w-[1280px] overflow-x-hidden font-best text-ink max-md:min-w-0">
      <SoundToggle enabled={soundEnabled} onToggle={() => setSoundEnabled((value) => !value)} />
      <CharacterDisplay
        canAnimate={showSite}
        canTalk={canStartCharacterTalk}
        onTalk={startCharacterTalk}
      />
      {characterTalk.mode !== "idle" ? (
        <CharacterTalkWindow
          onClose={closeCharacterTalk}
          onMoveOption={moveCharacterOption}
          onSelectOption={selectCharacterOption}
          state={characterTalk}
        />
      ) : null}
      {showSite ? <CharacterHeartBubble /> : null}
      {showSite ? <Navigation /> : null}

      <div className={showSite ? "snap-y snap-mandatory" : "h-screen overflow-hidden max-md:w-full"}>
        <TopSection />
        <AboutSection
          hasSeenAbout={hasSeenAbout}
          onAboutComplete={() => {
            setHasSeenAbout(true);
            setIsAboutConversationActive(false);
            writeLocalStorage("hasSeenAbout", "true");
          }}
          onConversationActiveChange={setIsAboutConversationActive}
          playSound={playSound}
        />
        <NewsSection />
        <WorksSection />
        <ContactSection />
      </div>

      <AnimatePresence>
        {openingStage === "sequence" ? (
          <OpeningSequence key="opening" onComplete={() => setOpeningStage("conversation")} playSound={playSound} />
        ) : null}

        {openingStage === "conversation" ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 flex min-w-[1280px] items-end justify-center bg-white/80 px-20 pb-20 font-best max-md:min-w-0 max-md:px-5 max-md:pb-6"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <div className="w-[780px] max-md:w-full">
              <ConversationWindow
                active
                lines={openingLines}
                onComplete={() => {
                  playSound("select");
                  setOpeningStage("done");
                }}
                soundTick={() => playSound("type")}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function CardDecoration({
  src,
  className
}: {
  src:
    | "/decorations/ribbon_pink_01.png"
    | "/decorations/ribbon_pink_02.png"
    | "/decorations/mark_heart_pink_02.png"
    | "/decorations/mark_heart_pink_03.png";
  className: string;
}) {
  return (
    <img
      alt=""
      aria-hidden
      className={`pointer-events-none absolute select-none [image-rendering:pixelated] ${className}`}
      src={assetPath(src)}
    />
  );
}

function CharacterHeartBubble() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let showTimer: number | null = null;
    let hideTimer: number | null = null;
    let cancelled = false;

    const schedule = () => {
      const delay = 18000 + Math.random() * 14000;
      showTimer = window.setTimeout(() => {
        if (cancelled) return;

        setVisible(true);
        hideTimer = window.setTimeout(() => {
          setVisible(false);
          if (!cancelled) schedule();
        }, 4200);
      }, delay);
    };

    schedule();

    return () => {
      cancelled = true;
      if (showTimer) window.clearTimeout(showTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.img
          alt=""
          animate={{ opacity: [0, 1, 1, 0], y: [-2, -12, -18, -24], scale: [0.92, 1, 1, 0.96] }}
          aria-hidden
          className="pointer-events-none fixed left-[calc(50%-215px)] top-[calc(75vh-430px)] z-30 w-[96px] [image-rendering:pixelated] max-md:left-[calc(50%-145px)] max-md:top-[calc(82svh-250px)] max-md:w-[70px]"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0, y: 0, scale: 0.92 }}
          src={assetPath("/decorations/fukidashi_heart_pink_white.png")}
          transition={{ duration: 4.2, ease: "easeOut", times: [0, 0.16, 0.82, 1] }}
        />
      ) : null}
    </AnimatePresence>
  );
}

function CharacterTalkWindow({
  state,
  onClose,
  onMoveOption,
  onSelectOption
}: {
  state: CharacterTalkState;
  onClose: () => void;
  onMoveOption: (direction: 1 | -1) => void;
  onSelectOption: (optionIndex: number) => void;
}) {
  const [charCount, setCharCount] = useState(0);
  const isMessage = state.mode === "message";
  const isResponse = state.mode === "response";
  const shouldType = isMessage;
  const shownText = shouldType ? state.currentText.slice(0, charCount) : state.currentText;
  const isTextComplete = !shouldType || charCount >= state.currentText.length;

  useEffect(() => {
    setCharCount(shouldType ? 0 : state.currentText.length);
  }, [shouldType, state.currentText]);

  useEffect(() => {
    if (!shouldType || charCount >= state.currentText.length) return;

    const timer = window.setTimeout(() => {
      setCharCount((value) => Math.min(value + 1, state.currentText.length));
    }, 45);

    return () => window.clearTimeout(timer);
  }, [charCount, shouldType, state.currentText]);

  useEffect(() => {
    if (!isMessage && !isResponse) return;

    const timer = window.setTimeout(onClose, 5000);
    return () => window.clearTimeout(timer);
  }, [isMessage, isResponse, onClose, state.currentText]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (state.mode === "question") {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          onMoveOption(-1);
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          onMoveOption(1);
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelectOption(state.selectedOptionIndex);
        }
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onMoveOption, onSelectOption, state.mode, state.selectedOptionIndex]);

  return (
    <div
      className="fixed z-40 w-[430px] max-w-[calc(100vw-80px)] font-best max-md:w-[calc(100vw-36px)]"
      style={{ left: "max(18px, calc(50% - 520px))", top: "max(92px, calc(75vh - 500px))" }}
    >
      <div
        className="pixel-panel min-h-[160px] px-7 py-6 text-left text-xl leading-[1.65] max-md:min-h-[130px] max-md:px-5 max-md:py-4 max-md:text-base"
        onClick={state.mode === "question" ? undefined : onClose}
        role={state.mode === "question" ? "dialog" : "button"}
      >
        <p className="whitespace-pre-line">{shownText}</p>

        {state.mode === "question" ? (
          <div className="mt-5 grid gap-3">
            {state.options.map((option, index) => {
              const selected = index === state.selectedOptionIndex;
              return (
                <button
                  className={`block w-full text-left text-xl max-md:text-base ${selected ? "text-rose" : "text-ink"}`}
                  key={option.label}
                  onClick={() => onSelectOption(index)}
                  type="button"
                >
                  <span className="inline-flex w-7 items-center">
                    {selected ? (
                      <span className="h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-rose" />
                    ) : null}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        ) : null}

        {isTextComplete && state.mode !== "question" ? <span className="blink-caret" /> : null}
      </div>
    </div>
  );
}

function TopSection() {
  return (
    <section className="section-shell" id="top">
      <div className="section-grid">
        <div className="pixel-panel relative px-9 py-8 max-md:px-5 max-md:py-5">
          <CardDecoration
            className="-left-9 -top-9 z-0 w-[116px] rotate-[-10deg] max-md:-left-5 max-md:-top-6 max-md:w-[74px]"
            src="/decorations/ribbon_pink_01.png"
          />
          <p className="mb-4 text-3xl max-md:text-2xl">sorano portfolio</p>
          <p className="text-xl leading-loose max-md:text-base">Software, hardware, design and pixel art.</p>
        </div>
        <div aria-hidden />
        <div className="pixel-panel px-9 py-8 max-md:px-5 max-md:py-5">
          <p className="mb-5 text-2xl max-md:mb-3 max-md:text-xl">WELCOME</p>
          <p className="text-lg leading-loose max-md:text-sm">Scroll to explore works, news and contact links.</p>
        </div>
      </div>
    </section>
  );
}

function AboutSection({
  hasSeenAbout,
  onAboutComplete,
  onConversationActiveChange,
  playSound
}: {
  hasSeenAbout: boolean;
  onAboutComplete: () => void;
  onConversationActiveChange: (active: boolean) => void;
  playSound: (name: "start" | "type" | "select") => void;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio > 0.55);
      },
      { threshold: [0, 0.55, 1] }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const active = !hasSeenAbout && isVisible;
    onConversationActiveChange(active);

    return () => onConversationActiveChange(false);
  }, [hasSeenAbout, isVisible, onConversationActiveChange]);

  return (
    <section className="section-shell" id="about" ref={sectionRef}>
      <div className="section-grid">
        <div>
          {hasSeenAbout ? (
            <div className="pixel-panel px-8 py-7 text-xl leading-loose max-md:px-5 max-md:py-5 max-md:text-base">
              <p>ABOUT</p>
              <p className="mt-5">I make small, cute things across software, hardware and design.</p>
            </div>
          ) : (
            <ConversationWindow
              active={isVisible}
              lines={aboutLines}
              onComplete={() => {
                playSound("select");
                onAboutComplete();
              }}
              soundTick={() => playSound("type")}
            />
          )}
        </div>
        <div aria-hidden />
        <ProfileCard />
      </div>
    </section>
  );
}

function ProfileCard() {
  return (
    <div className="pixel-panel relative px-9 py-8 max-md:px-5 max-md:py-5">
      <CardDecoration
        className="-right-10 -top-10 z-0 w-[112px] rotate-[10deg] max-md:-right-5 max-md:-top-7 max-md:w-[76px]"
        src="/decorations/ribbon_pink_01.png"
      />
      <p className="mb-8 text-3xl max-md:mb-5 max-md:text-2xl">PROFILE</p>
      <InfoRow label="Name" value={profile.name} />
      <InfoRow label="Role" value={profile.role} />
      <div className="mb-7">
        <p className="mb-3 text-sm uppercase tracking-[0.18em] text-rose">Focus</p>
        <div className="flex flex-wrap gap-3">
          {profile.focus.map((item) => (
            <span className="border-2 border-line bg-soft px-3 py-2 text-sm" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <InfoRow label="Dream" value={profile.dream} />
      <TransitionLink className="pixel-button mt-2 block w-full px-6 py-4 text-center text-xl max-md:text-base" href="/about">
        MORE...
      </TransitionLink>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-7">
      <p className="mb-2 text-sm uppercase tracking-[0.18em] text-rose">{label}</p>
      <p className="text-xl max-md:text-base">{value}</p>
    </div>
  );
}

function ProfileModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-white/90 px-8 py-8 font-best text-ink max-md:px-4 max-md:py-4"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="pixel-panel relative flex max-h-[calc(100svh-64px)] w-[760px] max-w-full flex-col overflow-hidden bg-white"
        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
        initial={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="border-b-[3px] border-line px-8 py-6 text-center max-md:px-5 max-md:py-5">
          <p className="text-3xl max-md:text-xl">CHARACTER PROFILE</p>
        </div>

        <div className="overflow-y-auto px-8 py-7 max-md:px-5 max-md:py-5">
          <ProfileDivider />
          <div className="grid place-items-center py-5">
            <p className="mb-4 text-xl text-rose max-md:text-base">Character</p>
            <ProfileBlinkCharacter />
          </div>

          <ProfileField label="Name">{profile.name}</ProfileField>
          <ProfileField label="Role">{profile.role}</ProfileField>
          <ProfileField label="About Me">{profile.about}</ProfileField>
          <ProfileField label="Dream">{profile.dream.replace(" to ", "\nto ")}</ProfileField>

          <ProfileDivider />
          <ProfileBlockTitle>Skills</ProfileBlockTitle>
          <div className="grid gap-4 py-4">
            {profile.skills.map((skill) => (
              <div className="grid grid-cols-[150px_1fr] items-center gap-4 max-md:grid-cols-1 max-md:gap-2" key={skill.name}>
                <p>{skill.name}</p>
                <p className="text-rose">
                  {"■".repeat(skill.level)}
                  <span className="text-ink">{"□".repeat(Math.max(0, 5 - skill.level))}</span>
                </p>
              </div>
            ))}
          </div>

          <ProfileDivider />
          <ProfileBlockTitle>Favorite</ProfileBlockTitle>
          <div className="grid grid-cols-2 gap-3 py-4 max-md:grid-cols-1">
            {profile.favorites.map((favorite) => (
              <p key={favorite}>{favorite}</p>
            ))}
          </div>

          <ProfileDivider />
          <ProfileBlockTitle>Tools</ProfileBlockTitle>
          <div className="flex flex-wrap gap-3 py-4">
            {profile.tools.map((tool) => (
              <span className="border-2 border-line bg-soft px-3 py-2 text-sm" key={tool}>
                {tool}
              </span>
            ))}
          </div>

          <ProfileDivider />
          <button className="pixel-button mt-5 w-full px-8 py-4 text-xl max-md:text-base" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProfileBlinkCharacter() {
  const frames = useMemo(
    () => [assetPath("/character/1.png"), assetPath("/character/half.png"), assetPath("/character/closed.png")],
    []
  );
  const [src, setSrc] = useState(frames[0]);

  useEffect(() => {
    frames.forEach((frame) => {
      const image = new window.Image();
      image.src = frame;
    });
  }, [frames]);

  useEffect(() => {
    let blinkTimer: number | null = null;
    let frameTimer: number | null = null;
    let cancelled = false;
    const sequence = [frames[1], frames[2], frames[1], frames[0]];

    const schedule = () => {
      blinkTimer = window.setTimeout(
        () => {
          let index = 0;
          const next = () => {
            if (cancelled) return;
            setSrc(sequence[index]);
            index += 1;
            if (index < sequence.length) {
              frameTimer = window.setTimeout(next, 90);
            } else {
              schedule();
            }
          };
          next();
        },
        3500 + Math.random() * 3500
      );
    };

    schedule();
    return () => {
      cancelled = true;
      if (blinkTimer) window.clearTimeout(blinkTimer);
      if (frameTimer) window.clearTimeout(frameTimer);
    };
  }, [frames]);

  return (
    <div className="relative h-[220px] w-[220px] max-md:h-[168px] max-md:w-[168px]">
      {frames.map((frame) => (
        <img
          alt={frame === src ? "sorano pixel character" : ""}
          aria-hidden={frame === src ? undefined : true}
          className={`absolute inset-0 h-full w-full object-contain [image-rendering:pixelated] ${
            frame === src ? "block" : "hidden"
          }`}
          key={frame}
          src={frame}
        />
      ))}
    </div>
  );
}

function ProfileDivider() {
  return <div className="my-4 border-t-[3px] border-line" />;
}

function ProfileBlockTitle({ children }: { children: ReactNode }) {
  return <p className="pt-2 text-xl text-rose max-md:text-base">{children}</p>;
}

function ProfileField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <ProfileDivider />
      <div className="py-3">
        <p className="mb-3 text-sm uppercase tracking-[0.18em] text-rose">{label}</p>
        <p className="whitespace-pre-line text-xl leading-relaxed max-md:text-base">{children}</p>
      </div>
    </>
  );
}

function NewsSection() {
  return (
    <section className="section-shell" id="news">
      <div className="section-grid">
        <div className="space-y-5">
          {news.map((item, index) => {
            const content = (
              <>
                {index === 1 ? (
                  <CardDecoration
                    className="-left-6 -top-7 z-0 w-[64px] rotate-[-13deg] max-md:-left-4 max-md:-top-5 max-md:w-[44px]"
                    src="/decorations/ribbon_pink_02.png"
                  />
                ) : null}
                <div className="mb-3 flex items-start justify-between gap-4">
                  <p className="text-sm text-rose max-md:text-xs">{item.date}</p>
                  {item.url ? <span>↗</span> : null}
                </div>
                <p className="mb-3 text-2xl max-md:text-lg">{item.title}</p>
                <p className="text-base leading-relaxed max-md:text-sm">{item.body}</p>
              </>
            );

            return item.url ? (
              <a
                className="pixel-panel relative block px-7 py-6 transition hover:-translate-y-1 hover:border-[4px] hover:shadow-lift max-md:px-5 max-md:py-4"
                href={item.url}
                key={item.id}
                rel="noopener noreferrer"
                target="_blank"
              >
                {content}
              </a>
            ) : (
              <article className="pixel-panel relative px-7 py-6 max-md:px-5 max-md:py-4" key={item.id}>
                {content}
              </article>
            );
          })}
        </div>
        <div aria-hidden />
        <div className="pixel-panel relative px-9 py-8 max-md:px-5 max-md:py-5">
          <CardDecoration
            className="-right-8 -top-9 z-0 w-[80px] rotate-[15deg] max-md:-right-4 max-md:-top-6 max-md:w-[58px]"
            src="/decorations/mark_heart_pink_03.png"
          />
          <p className="mb-5 text-3xl max-md:mb-3 max-md:text-2xl">NEWS</p>
          <p className="text-xl leading-loose max-md:text-base">Updates are listed from newest to oldest.</p>
          <TransitionLink className="pixel-button mt-6 block px-6 py-4 text-center text-xl max-md:text-base" href="/news">
            VIEW ALL
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}

function WorksSection() {
  const categories: WorkCategory[] = useMemo(() => ["Art & Design", "Software & Hardware"], []);

  return (
    <section className="section-shell" id="works">
      <div className="grid min-h-[calc(100vh-220px)] grid-cols-[1fr_420px_1fr] gap-12 max-md:block max-md:min-h-0">
        {categories.map((category, index) => (
          <div className={`${index === 1 ? "col-start-3" : ""} max-md:mb-8`} key={category}>
            <p className="mb-5 text-2xl max-md:mb-4 max-md:text-xl">{category}</p>
            <div className="grid gap-5 max-md:gap-4">
              {works
                .filter((work) => work.category === category)
                .map((work) => (
                  <WorkCard key={work.id} work={work} />
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-14 left-1/2 z-10 -translate-x-1/2 max-md:static max-md:mt-4 max-md:translate-x-0 max-md:text-center">
        <TransitionLink className="pixel-button inline-block px-8 py-4 text-xl max-md:text-base" href="/works">
          VIEW ALL
        </TransitionLink>
      </div>
    </section>
  );
}

function WorkCard({ work }: { work: (typeof works)[number] }) {
  const decoration =
    work.id === "pixel-room"
      ? {
          className: "-left-4 -top-5 z-0 w-[58px] rotate-[-10deg] max-md:-left-3 max-md:-top-4 max-md:w-[42px]",
          src: "/decorations/ribbon_pink_02.png" as const
        }
      : work.id === "tiny-device"
        ? {
            className: "-right-5 -top-6 z-0 w-[54px] rotate-[12deg] max-md:-right-3 max-md:-top-4 max-md:w-[42px]",
            src: "/decorations/mark_heart_pink_03.png" as const
          }
        : null;

  const inner = (
    <>
      {decoration ? <CardDecoration className={decoration.className} src={decoration.src} /> : null}
      <div className="grid grid-cols-[104px_1fr] gap-5 max-md:grid-cols-[82px_1fr] max-md:gap-3">
        <div className="flex aspect-square items-center justify-center border-[3px] border-line bg-soft text-center text-xs max-md:border-2 max-md:text-[10px]">
          {work.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="" className="h-full w-full object-cover [image-rendering:pixelated]" src={work.thumbnail} />
          ) : (
            <span>NO IMAGE</span>
          )}
        </div>
        <div>
          <div className="mb-2 flex items-start justify-between gap-3">
            <p className="text-xl max-md:text-base">{work.title}</p>
            {work.url ? <span>↗</span> : null}
          </div>
          <p className="mb-3 text-sm leading-relaxed max-md:text-xs">{work.description}</p>
          <div className="flex flex-wrap gap-2">
            {work.tags.map((tag) => (
              <span className="border-2 border-blush bg-white px-2 py-1 text-xs max-md:px-1.5 max-md:text-[10px]" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const className =
    "pixel-panel relative block px-5 py-5 transition hover:-translate-y-1 hover:border-[4px] hover:shadow-lift max-md:px-4 max-md:py-4";

  return work.url ? (
    <a className={`${className} cursor-pointer`} href={work.url} rel="noopener noreferrer" target="_blank">
      {inner}
    </a>
  ) : (
    <article className={className}>{inner}</article>
  );
}

function ContactSection() {
  return (
    <section className="section-shell" id="contact">
      <div className="section-grid">
        <div className="pixel-panel relative px-9 py-8 max-md:px-5 max-md:py-5">
          <CardDecoration
            className="-left-8 -top-9 z-0 w-[102px] rotate-[-9deg] max-md:-left-5 max-md:-top-6 max-md:w-[70px]"
            src="/decorations/ribbon_pink_02.png"
          />
          <p className="mb-5 text-3xl max-md:mb-3 max-md:text-2xl">CONTACT</p>
          <p className="text-xl leading-loose max-md:text-base">Please use the available links below.</p>
          <TransitionLink className="pixel-button mt-6 block px-6 py-4 text-center text-xl max-md:text-base" href="/contact">
            MORE...
          </TransitionLink>
        </div>
        <div aria-hidden />
        <div className="grid gap-5 max-md:gap-3">
          {contacts.map((contact) => {
            const href = contact.label === "Mail" && contact.href ? `mailto:${contact.href}` : contact.href;
            return contact.enabled && href ? (
              <a
                className="pixel-button block px-8 py-5 text-center text-2xl max-md:px-5 max-md:py-4 max-md:text-lg"
                href={href}
                key={contact.label}
                rel="noopener noreferrer"
                target="_blank"
              >
                {contact.label}
              </a>
            ) : (
              <button className="pixel-button px-8 py-5 text-center text-2xl max-md:px-5 max-md:py-4 max-md:text-lg" disabled key={contact.label} type="button">
                {contact.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
