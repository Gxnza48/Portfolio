"use client";

/**
 * ThemeToggle — a lightsaber switch that toggles the Force side
 * (Jedi / light  ⇄  Sith / dark).
 *
 * Visual: a hilt with an ignited blade. The blade color reflects the active
 * side (blue in jedi, red in sith) over a white-hot core with bloom. Clicking
 * retracts the blade and re-ignites it in the new color (a quick "blade swap"),
 * then calls toggle(). Honors prefers-reduced-motion by swapping instantly.
 *
 * Prop-less, self-contained (styled-jsx). Theme tokens are not hardcoded here;
 * saber colors are intentional, explicit per the task spec.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme, type Side } from "@/lib/theme";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* Saber colors (hex) per task spec. */
const SABER: Record<Side, string> = {
  jedi: "#4FC3F7", // blue
  sith: "#E10600", // red
};
const CORE = "#FFFFFF";

/** Duration (seconds) of a single retract/extend phase. */
const PHASE = 0.18;

export default function ThemeToggle() {
  const { side, toggle } = useTheme();
  const reduced = useReducedMotion();

  /** Color currently painted on the blade (decoupled from `side` mid-swap). */
  const [bladeSide, setBladeSide] = useState<Side>(side);
  const [swapping, setSwapping] = useState(false);

  const blade = useAnimationControls();
  const timers = useRef<number[]>([]);

  const target: Side = side === "jedi" ? "sith" : "jedi";
  const bladeColor = SABER[bladeSide];

  // Keep the painted blade in sync if the side changes externally
  // (e.g. another control) while we are not mid-swap.
  useEffect(() => {
    if (!swapping) setBladeSide(side);
  }, [side, swapping]);

  // Clear any pending timeouts on unmount.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const handleClick = useCallback(() => {
    if (reduced) {
      // Instant swap, no animation.
      toggle();
      return;
    }
    if (swapping) return;
    setSwapping(true);

    // Retract → swap color → re-ignite.
    blade
      .start({
        scaleY: 0.04,
        opacity: 0.35,
        transition: { duration: PHASE, ease: "easeIn" },
      })
      .then(() => {
        toggle();
        setBladeSide(target);
        return blade.start({
          scaleY: 1,
          opacity: 1,
          transition: { duration: PHASE * 1.4, ease: [0.22, 1, 0.36, 1] },
        });
      })
      .then(() => {
        const id = window.setTimeout(() => setSwapping(false), 0);
        timers.current.push(id);
      });
  }, [reduced, swapping, blade, toggle, target]);

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
      <span className="tt-saber" aria-hidden="true">
        {/* Blade — animated retract/extend; reduced-motion renders it static. */}
        <motion.span
          className="tt-blade"
          initial={false}
          animate={reduced ? undefined : blade}
          style={{
            transformOrigin: "bottom center",
            ["--blade" as string]: bladeColor,
          }}
        >
          <span className="tt-blade-glow" />
          <span className="tt-blade-core" />
          <span className="tt-blade-tip" />
        </motion.span>

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
            box-shadow 0.2s ease, transform 0.12s ease;
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

        /* Saber assembly — vertical: blade on top, hilt below. */
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

        /* Hilt */
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
          color: var(--blade-meta, var(--c-muted));
        }
        .tt-label {
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo,
            Consolas, monospace;
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
        }
      `}</style>
    </button>
  );
}
