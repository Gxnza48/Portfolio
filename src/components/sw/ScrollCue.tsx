"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { HERO } from "@/data/content";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * ScrollCue — a subtle hero scroll affordance.
 *
 * Renders the real {@link HERO.scrollCue} label in small uppercase mono above an
 * animated downward chevron. The whole thing gently bobs (CSS keyframes) to
 * invite scrolling, and fades itself out once the user has scrolled past a
 * small threshold so it never lingers over content.
 *
 * Accessibility / motion:
 * - The readable cue text is always present in the DOM.
 * - The chevron is decorative (aria-hidden); the label carries the meaning.
 * - When `prefers-reduced-motion` is set, all looping motion is skipped and the
 *   cue is rendered in its final static state (no bob, no fade transition).
 */
export default function ScrollCue() {
  const reducedMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Fade out after the user scrolls a bit past the hero fold.
    const threshold = () => window.innerHeight * 0.4;

    const onScroll = () => {
      setHidden(window.scrollY > threshold());
    };

    // Sync initial state (e.g. restored scroll position on reload).
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`scroll-cue pointer-events-none flex flex-col items-center gap-2 text-center select-none ${
        hidden ? "scroll-cue--hidden" : ""
      }`}
      data-reduced={reducedMotion ? "true" : "false"}
    >
      <span
        className="text-[0.625rem] font-mono uppercase tracking-[0.32em] leading-none sm:text-xs"
        style={{ color: "var(--c-muted)" }}
      >
        {HERO.scrollCue}
      </span>

      <span
        className="scroll-cue__chevron flex h-5 w-5 items-center justify-center"
        style={{ color: "var(--c-primary)" }}
        aria-hidden="true"
      >
        <ChevronDown className="h-5 w-5" strokeWidth={1.75} />
      </span>

      <style jsx>{`
        .scroll-cue {
          opacity: 1;
          transition: opacity 600ms ease;
        }

        .scroll-cue--hidden {
          opacity: 0;
        }

        .scroll-cue__chevron {
          animation: scroll-cue-bob 2.1s ease-in-out infinite;
        }

        @keyframes scroll-cue-bob {
          0%,
          100% {
            transform: translateY(-3px);
            opacity: 0.55;
          }
          50% {
            transform: translateY(4px);
            opacity: 1;
          }
        }

        /* Reduced motion: static final state, no bob, no fade animation. */
        .scroll-cue[data-reduced="true"] {
          transition: none;
        }

        .scroll-cue[data-reduced="true"] .scroll-cue__chevron {
          animation: none;
          transform: none;
          opacity: 0.9;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-cue {
            transition: none;
          }
          .scroll-cue__chevron {
            animation: none;
            transform: none;
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
