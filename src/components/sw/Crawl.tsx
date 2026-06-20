"use client";

/**
 * Crawl — the authentic Star Wars-style opening crawl intro overlay.
 *
 * Shows ONLY on a visitor's first visit (guarded by the localStorage key
 * "crawl-seen"). Returning visitors and users who prefer reduced motion render
 * nothing at all. The real crawl paragraphs are always present as valid DOM
 * text (good for SEO) — the motion is purely presentational.
 *
 * Sequence:
 *   1. CRAWL.intro — "A long time ago..." in calm saber blue, fade in/out.
 *   2. The title block (CRAWL.episode + CRAWL.title) appears large and recedes
 *      toward a vanishing point (scale down + fade).
 *   3. The gold crawl body — CRAWL.paragraphs in a 3D-perspective container,
 *      translating upward and shrinking toward the top horizon, masked at top.
 *
 * An always-visible, keyboard-focusable "Skip intro" button (and the natural
 * end of the crawl) fades the overlay out, persists "crawl-seen" and unmounts.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { CRAWL } from "@/data/content";
import { useReducedMotion } from "@/lib/useReducedMotion";

const STORAGE_KEY = "crawl-seen";

/** Saber blue used for the calm intro line (passed explicitly, not a theme). */
const INTRO_BLUE = "#4FC3F7";

/* Timing (ms). The crawl-body scroll itself is driven by CSS. */
const INTRO_IN = 1500;
const INTRO_HOLD = 2600;
const INTRO_OUT = 1200;
const TITLE_IN = 1600;
const TITLE_HOLD = 1600;
const TITLE_OUT = 1600;
const CRAWL_DURATION = 30000; // matches the CSS animation length
const EXIT_FADE = 900;

type Phase = "intro" | "title" | "crawl" | "exiting";

/**
 * Tiny scheduler that fires a callback after `delay` ms via setTimeout and
 * registers the handle for cleanup. requestAnimationFrame is reserved for
 * per-frame animation; here we only need discrete phase transitions, so
 * timeouts are the correct primitive — all are cleared on unmount.
 */
function useTimeouts() {
  const handles = useRef<number[]>([]);
  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    handles.current.push(id);
    return id;
  }, []);
  const clearAll = useCallback(() => {
    for (const id of handles.current) window.clearTimeout(id);
    handles.current = [];
  }, []);
  useEffect(() => clearAll, [clearAll]);
  return { schedule, clearAll };
}

export default function Crawl() {
  const reducedMotion = useReducedMotion();
  const { schedule, clearAll } = useTimeouts();

  // `null` until we have decided (client-only) whether to show at all.
  const [active, setActive] = useState<boolean | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");

  /* ---- Decide visibility on mount (client only) -------------------- */
  useEffect(() => {
    if (reducedMotion) {
      setActive(false);
      return;
    }
    let seen = false;
    try {
      seen = localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      /* localStorage unavailable — treat as unseen, fall through */
    }
    setActive(!seen);
  }, [reducedMotion]);

  /* ---- Lock body scroll while the overlay is active ---------------- */
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  /* ---- Finish: persist, fade out, unmount ------------------------- */
  const finish = useCallback(() => {
    clearAll();
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore persistence failures */
    }
    setPhase("exiting");
    schedule(() => setActive(false), EXIT_FADE);
  }, [clearAll, schedule]);

  /* ---- Drive the phase sequence with cleaned-up timeouts ----------- */
  useEffect(() => {
    if (active !== true) return;
    setPhase("intro");
    const introTotal = INTRO_IN + INTRO_HOLD + INTRO_OUT;
    const titleTotal = TITLE_IN + TITLE_HOLD + TITLE_OUT;

    schedule(() => setPhase("title"), introTotal);
    schedule(() => setPhase("crawl"), introTotal + titleTotal);
    schedule(finish, introTotal + titleTotal + CRAWL_DURATION);

    return clearAll;
    // `active` is the only trigger; helpers are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  /* ---- Allow Escape as an extra skip affordance ------------------- */
  useEffect(() => {
    if (active !== true) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, finish]);

  if (active !== true) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${CRAWL.episode} — ${CRAWL.title}`}
      data-phase={phase}
      className="crawl-overlay"
    >
      {/* Phase 1 — calm intro line */}
      <p className="crawl-intro" style={{ color: INTRO_BLUE }} aria-hidden={phase !== "intro"}>
        {CRAWL.intro}
      </p>

      {/* Phase 2 — title recedes toward vanishing point */}
      <div className="crawl-titleblock" aria-hidden={phase !== "title"}>
        <p className="crawl-episode">{CRAWL.episode}</p>
        <h2 className="crawl-title">{CRAWL.title}</h2>
      </div>

      {/* Phase 3 — gold perspective crawl. Real, readable paragraphs. */}
      <div className="crawl-stage" aria-hidden={phase !== "crawl"}>
        <div className="crawl-content">
          <p className="crawl-episode-body">{CRAWL.episode}</p>
          <h2 className="crawl-title-body">{CRAWL.title}</h2>
          {CRAWL.paragraphs.map((para, i) => (
            <p key={i} className="crawl-para">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Always-visible, keyboard-focusable skip control */}
      <button
        type="button"
        className="crawl-skip"
        onClick={finish}
        aria-label="Skip intro"
      >
        Skip intro
      </button>

      <style jsx>{`
        .crawl-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: #000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1;
          transition: opacity 900ms ease;
          /* subtle starfield wash so the black isn't dead flat */
          background-image:
            radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.5), transparent),
            radial-gradient(1px 1px at 70% 60%, rgba(255, 255, 255, 0.4), transparent),
            radial-gradient(1px 1px at 40% 80%, rgba(255, 255, 255, 0.35), transparent),
            radial-gradient(1px 1px at 85% 20%, rgba(255, 255, 255, 0.45), transparent);
        }
        .crawl-overlay[data-phase="exiting"] {
          opacity: 0;
          pointer-events: none;
        }

        /* ---- Phase 1: intro line ---- */
        .crawl-intro {
          position: absolute;
          max-width: min(90vw, 40rem);
          text-align: center;
          font-size: clamp(1.1rem, 4vw, 2rem);
          font-weight: 400;
          letter-spacing: 0.01em;
          opacity: 0;
        }
        .crawl-overlay[data-phase="intro"] .crawl-intro {
          animation: introFade 5300ms ease forwards;
        }
        @keyframes introFade {
          0% {
            opacity: 0;
          }
          28% {
            opacity: 1;
          }
          77% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        /* ---- Phase 2: title block receding ---- */
        .crawl-titleblock {
          position: absolute;
          text-align: center;
          color: var(--c-gold);
          opacity: 0;
          transform: scale(1.15);
          will-change: transform, opacity;
        }
        .crawl-overlay[data-phase="title"] .crawl-titleblock {
          animation: titleRecede 4800ms ease forwards;
        }
        .crawl-episode {
          font-family: var(--font-crawl);
          font-size: clamp(1rem, 3vw, 1.6rem);
          letter-spacing: 0.3em;
          margin: 0 0 0.8rem;
        }
        .crawl-title {
          font-family: var(--font-crawl);
          font-weight: 700;
          font-size: clamp(2rem, 9vw, 5.5rem);
          line-height: 1;
          letter-spacing: 0.04em;
          margin: 0;
        }
        @keyframes titleRecede {
          0% {
            opacity: 0;
            transform: scale(1.15);
          }
          33% {
            opacity: 1;
            transform: scale(1);
          }
          67% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.05);
          }
        }

        /* ---- Phase 3: the 3D gold crawl ---- */
        .crawl-stage {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          /* vanishing point near the top horizon */
          perspective: 400px;
          perspective-origin: 50% 0%;
          opacity: 0;
          -webkit-mask-image: linear-gradient(
            to top,
            rgba(0, 0, 0, 1) 30%,
            rgba(0, 0, 0, 0) 92%
          );
          mask-image: linear-gradient(
            to top,
            rgba(0, 0, 0, 1) 30%,
            rgba(0, 0, 0, 0) 92%
          );
        }
        .crawl-overlay[data-phase="crawl"] .crawl-stage {
          opacity: 1;
          transition: opacity 800ms ease;
        }
        .crawl-content {
          position: absolute;
          top: 100%;
          width: min(92vw, 46rem);
          color: var(--c-gold);
          font-family: var(--font-crawl);
          text-align: justify;
          font-weight: 600;
          font-size: clamp(1rem, 3.4vw, 1.9rem);
          line-height: 1.5;
          transform-origin: 50% 100%;
          transform: rotateX(25deg);
          will-change: transform;
        }
        .crawl-overlay[data-phase="crawl"] .crawl-content {
          animation: crawlScroll 30000ms linear forwards;
        }
        @keyframes crawlScroll {
          0% {
            transform: rotateX(25deg) translateY(0);
          }
          100% {
            transform: rotateX(25deg) translateY(-220%);
          }
        }
        .crawl-episode-body {
          text-align: center;
          letter-spacing: 0.3em;
          font-size: 0.7em;
          margin: 0 0 0.6em;
        }
        .crawl-title-body {
          text-align: center;
          font-weight: 700;
          font-size: 1.6em;
          line-height: 1.05;
          margin: 0 0 1.4em;
        }
        .crawl-para {
          margin: 0 0 1.4em;
        }

        /* ---- Skip control ---- */
        .crawl-skip {
          position: absolute;
          bottom: max(1.5rem, env(safe-area-inset-bottom));
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          padding: 0.6rem 1.4rem;
          font-size: 0.8rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--c-text);
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 999px;
          cursor: pointer;
          transition:
            background 200ms ease,
            border-color 200ms ease,
            color 200ms ease;
        }
        .crawl-skip:hover {
          background: var(--c-surface-high);
          border-color: var(--c-primary);
          color: var(--c-primary);
        }
        .crawl-skip:focus-visible {
          outline: 2px solid var(--c-holo);
          outline-offset: 3px;
        }
      `}</style>
    </div>
  );
}
