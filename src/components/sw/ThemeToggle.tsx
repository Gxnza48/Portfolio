"use client";

/**
 * ThemeToggle — a lightsaber switch that toggles the Force side
 * (Jedi / light  ⇄  Sith / dark).
 *
 * The blade color reflects the active side (blue in jedi, red in sith) over a
 * white-hot core with bloom. Clicking toggles the theme with a brief CSS
 * "ignition" pulse (skipped under reduced motion). Pure CSS — no animation
 * library — so it is SSR-safe and has no compile/runtime hazards.
 *
 * Prop-less, self-contained. Saber colors are explicit per the task spec.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme, type Side } from "@/lib/theme";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* Saber colors (hex) per task spec. */
const SABER: Record<Side, string> = {
  jedi: "#4FC3F7", // blue
  sith: "#E10600", // red
};
const CORE = "#FFFFFF";

export default function ThemeToggle() {
  const { side, toggle } = useTheme();
  const reduced = useReducedMotion();
  const [igniting, setIgniting] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const handleClick = useCallback(() => {
    toggle();
    if (reduced) return;
    setIgniting(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setIgniting(false), 440);
  }, [toggle, reduced]);

  const label =
    side === "jedi"
      ? "Switch to Sith (dark side)"
      : "Switch to Jedi (light side)";
  const sideLabel = side === "jedi" ? "JEDI" : "SITH";
  const Icon = side === "jedi" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={side === "sith"}
      className="tt-root group"
    >
      <span
        className="tt-saber"
        aria-hidden="true"
        style={{ ["--blade" as string]: SABER[side] }}
      >
        {/* Blade — color transitions on side change; ignition pulse on click. */}
        <span className={igniting ? "tt-blade tt-blade--ignite" : "tt-blade"}>
          <span className="tt-blade-glow" />
          <span className="tt-blade-core" />
          <span className="tt-blade-tip" />
        </span>

        {/* Hilt */}
        <span className="tt-hilt">
          <span className="tt-hilt-emitter" />
          <span className="tt-hilt-grip" />
          <span className="tt-hilt-button" />
          <span className="tt-hilt-pommel" />
        </span>
      </span>

      <span className="tt-meta">
        <Icon className="tt-icon" size={14} strokeWidth={2} aria-hidden="true" />
        <span className="tt-label">{sideLabel}</span>
      </span>

      <style jsx>{`
        .tt-root {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.4rem 0.7rem 0.4rem 0.55rem;
          border-radius: 9999px;
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          color: var(--c-text);
          cursor: pointer;
          line-height: 1;
          -webkit-tap-highlight-color: transparent;
          transition: border-color 0.2s ease, background 0.2s ease,
            transform 0.12s ease;
        }
        .tt-root:hover {
          background: var(--c-surface-high);
          border-color: var(--c-primary-soft);
        }
        .tt-root:active {
          transform: scale(0.97);
        }
        .tt-root:focus-visible {
          outline: 2px solid var(--c-primary);
          outline-offset: 3px;
        }

        .tt-saber {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          width: 14px;
          height: 30px;
        }

        .tt-blade {
          position: relative;
          width: 5px;
          height: 16px;
          display: block;
          border-radius: 3px 3px 1px 1px;
          background: var(--blade);
          transform-origin: bottom center;
          transition: background-color 0.4s ease;
        }
        .tt-blade--ignite {
          animation: tt-ignite 0.44s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes tt-ignite {
          0% {
            transform: scaleY(0.06);
            opacity: 0.4;
          }
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        .tt-blade-core {
          position: absolute;
          inset: 0;
          margin: 0 auto;
          width: 2px;
          border-radius: 2px;
          background: ${CORE};
          box-shadow: 0 0 4px ${CORE};
        }
        .tt-blade-glow {
          position: absolute;
          inset: -3px -4px;
          border-radius: 6px;
          background: radial-gradient(
            ellipse at center,
            var(--blade) 0%,
            color-mix(in srgb, var(--blade) 55%, transparent) 45%,
            transparent 75%
          );
          filter: blur(2px);
          opacity: 0.9;
        }
        .tt-blade-tip {
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: ${CORE};
          box-shadow: 0 0 6px var(--blade), 0 0 10px var(--blade);
        }

        .tt-hilt {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 8px;
        }
        .tt-hilt-emitter {
          width: 7px;
          height: 3px;
          border-radius: 1px 1px 0 0;
          background: linear-gradient(#d9dde3, #8a9099);
        }
        .tt-hilt-grip {
          width: 6px;
          height: 8px;
          background: repeating-linear-gradient(
            #3b3f46 0 1px,
            #6b7079 1px 2px
          );
          border-radius: 1px;
        }
        .tt-hilt-button {
          position: absolute;
          top: 4px;
          right: -2px;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: var(--c-primary, #4fc3f7);
          box-shadow: 0 0 3px var(--c-primary, #4fc3f7);
        }
        .tt-hilt-pommel {
          width: 7px;
          height: 3px;
          border-radius: 0 0 2px 2px;
          background: linear-gradient(#8a9099, #5a5f66);
        }

        .tt-meta {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }
        .tt-icon {
          color: var(--c-muted);
        }
        .tt-label {
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
            monospace;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: var(--c-text);
        }

        @media (prefers-reduced-motion: reduce) {
          .tt-root,
          .tt-root:active {
            transition: none;
            transform: none;
          }
          .tt-blade,
          .tt-blade--ignite {
            transition: none;
            animation: none;
          }
        }
      `}</style>
    </button>
  );
}
