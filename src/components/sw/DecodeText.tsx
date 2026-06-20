"use client";

/**
 * DecodeText — "Aurebesh / Jedi writing decodes into Latin text".
 *
 * The visible layer renders the supplied `text` as a field of alien-looking
 * geometric glyphs that resolve left-to-right into the real characters (a
 * decrypt / scramble effect). The host element always carries the readable
 * `text` via aria-label, while the animated glyph layer is aria-hidden so that
 * assistive tech and crawlers only ever encounter the real string.
 *
 * No font file is used — the alien feel comes purely from a fixed pool of
 * box-drawing, geometric and Greek unicode symbols, honouring the project's
 * legal constraint (recreate the LOOK, never embed trademarked fonts).
 *
 * Motion is driven by a single requestAnimationFrame loop (never setInterval).
 * When the user prefers reduced motion, the plain real text is rendered
 * immediately with no scramble.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type FocusEvent,
  type MouseEvent,
} from "react";

import { useReducedMotion } from "@/lib/useReducedMotion";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

/**
 * Fixed pool of geometric / box-drawing / circuit-like / Greek glyphs.
 * These evoke Aurebesh's angular, technical look without any font asset.
 */
const GLYPH_POOL =
  "ΔΘΛΞΠΣΦΨΩ┃┏┓┗┛┣┫┳┻╋▰▱◆◇◈◉◊○●◐◑◒◓◧◨◩◪◫⬡⬢⬣⌁⌐¬⎔⏚⏛░▒▓▚▞╱╲╳⟁⟐⟡⟢⟣⟤⟥".split(
    "",
  );

const DEFAULT_DURATION_MS = 900;

export type DecodeTrigger = "hover" | "view" | "mount";

export interface DecodeTextProps {
  readonly text: string;
  readonly as?: ElementType;
  readonly className?: string;
  readonly trigger?: DecodeTrigger;
  readonly durationMs?: number;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function randomGlyph(): string {
  return GLYPH_POOL[(Math.random() * GLYPH_POOL.length) | 0];
}

/**
 * Builds the display string for a given progress [0..1].
 * Characters before the reveal frontier are real; the rest are randomized,
 * except whitespace which is always preserved (keeps word shapes legible).
 */
function buildFrame(text: string, progress: number): string {
  const chars = Array.from(text);
  const revealCount = Math.floor(progress * chars.length);
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === " " || ch === "\n" || ch === "\t") {
      out += ch;
    } else if (i < revealCount) {
      out += ch;
    } else {
      out += randomGlyph();
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function DecodeText({
  text,
  as,
  className,
  trigger = "view",
  durationMs = DEFAULT_DURATION_MS,
}: DecodeTextProps) {
  const Host = (as ?? "span") as ElementType;
  const reducedMotion = useReducedMotion();

  const hostRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const hasRunRef = useRef(false);

  // Display starts fully scrambled so SSR/first paint never flashes the real
  // text under animated triggers; reduced-motion short-circuits below.
  const [display, setDisplay] = useState<string>(() => buildFrame(text, 0));

  const cancelLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startRef.current = null;
  }, []);

  /** Runs the decrypt animation from scrambled -> real text. */
  const decode = useCallback(() => {
    cancelLoop();
    const duration = Math.max(1, durationMs);

    const step = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(1, elapsed / duration);
      setDisplay(buildFrame(text, progress));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
        rafRef.current = null;
        startRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [cancelLoop, durationMs, text]);

  /** Re-scrambles to the fully encrypted state (used on hover-out). */
  const scramble = useCallback(() => {
    cancelLoop();
    setDisplay(buildFrame(text, 0));
  }, [cancelLoop, text]);

  /* Reduced motion: always show plain real text, no animation. */
  useEffect(() => {
    if (reducedMotion) {
      cancelLoop();
      setDisplay(text);
    }
  }, [reducedMotion, text, cancelLoop]);

  /* Mount trigger: decode once after mount. */
  useEffect(() => {
    if (reducedMotion || trigger !== "mount" || hasRunRef.current) return;
    hasRunRef.current = true;
    decode();
    return cancelLoop;
  }, [reducedMotion, trigger, decode, cancelLoop]);

  /* View trigger: decode once when scrolled into view. */
  useEffect(() => {
    if (reducedMotion || trigger !== "view") return;
    const el = hostRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      // Fallback: no IO support -> just decode.
      decode();
      return cancelLoop;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasRunRef.current) {
            hasRunRef.current = true;
            decode();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelLoop();
    };
  }, [reducedMotion, trigger, decode, cancelLoop]);

  /* Cleanup any in-flight rAF on unmount. */
  useEffect(() => cancelLoop, [cancelLoop]);

  /* Hover/focus handlers (only wired for the "hover" trigger). */
  const isHover = trigger === "hover" && !reducedMotion;

  const handleEnter = useCallback(
    (_e: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
      if (isHover) decode();
    },
    [isHover, decode],
  );

  const handleLeave = useCallback(
    (_e: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
      if (isHover) scramble();
    },
    [isHover, scramble],
  );

  const rendered = reducedMotion ? text : display;

  return (
    <Host
      ref={hostRef}
      className={`decode-text${className ? ` ${className}` : ""}`}
      aria-label={text}
      onMouseEnter={isHover ? handleEnter : undefined}
      onMouseLeave={isHover ? handleLeave : undefined}
      onFocus={isHover ? handleEnter : undefined}
      onBlur={isHover ? handleLeave : undefined}
      tabIndex={isHover ? 0 : undefined}
    >
      <span aria-hidden="true" className="decode-text__glyphs">
        {rendered}
      </span>

      <style jsx>{`
        .decode-text {
          display: inline-block;
          outline: none;
        }
        .decode-text:focus-visible {
          outline: 2px solid var(--c-holo, #4fc3f7);
          outline-offset: 2px;
          border-radius: 2px;
        }
        .decode-text__glyphs {
          display: inline-block;
          white-space: pre-wrap;
          font-variant-ligatures: none;
          letter-spacing: 0.02em;
          /* Subtle holo tint while characters are still encrypted. */
          text-shadow: 0 0 0.35em
            color-mix(in srgb, var(--c-holo, #4fc3f7) 28%, transparent);
        }
      `}</style>
    </Host>
  );
}
