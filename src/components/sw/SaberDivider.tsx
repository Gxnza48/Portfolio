"use client";

/**
 * SaberDivider — a lightsaber section divider.
 *
 * A small metallic emitter hilt sits at the left; when the row scrolls into
 * view the blade *ignites*, extending rightward (scaleX 0 -> 1, origin left)
 * over ~0.5s ease-out, once. The blade is a thin white-hot core line wrapped in
 * a colored bloom (layered box-shadow + blur in the saber color), with a gentle
 * idle hum/flicker loop.
 *
 * Recreates the look with original CSS — no trademarked assets.
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { SaberColor } from "@/data/content";
import { useReducedMotion } from "@/lib/useReducedMotion";

const SABER_HEX: Record<SaberColor, string> = {
  blue: "#4FC3F7",
  green: "#6FE26F",
  red: "#E10600",
  purple: "#B86BFF",
};

const CORE = "var(--c-saber-core)";

export interface SaberDividerProps {
  readonly color: SaberColor;
  readonly label?: string;
}

export default function SaberDivider({ color, label }: SaberDividerProps) {
  const reduced = useReducedMotion();
  const hex = SABER_HEX[color];

  // Layered colored bloom around the white-hot core.
  const bloom = useMemo(
    () =>
      [
        `0 0 4px 1px ${CORE}`,
        `0 0 8px 2px ${hex}`,
        `0 0 18px 4px ${hex}`,
        `0 0 36px 8px ${hex}`,
      ].join(", "),
    [hex],
  );

  const ariaLabel = label ? `${label} section divider` : "section divider";

  return (
    <div
      role="separator"
      aria-label={ariaLabel}
      className="saber-row relative flex w-full items-center gap-3 py-8 select-none"
    >
      {/* Emitter hilt — metallic gray gradient rectangle */}
      <span aria-hidden="true" className="saber-hilt relative shrink-0">
        <span className="saber-hilt-tip" />
      </span>

      {/* Blade: ignites on view. Bloom layer + white-hot core line. */}
      <span aria-hidden="true" className="saber-blade-wrap relative flex-1">
        <motion.span
          className={`saber-blade ${reduced ? "" : "saber-flicker"}`}
          style={{ boxShadow: bloom, color: hex }}
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={reduced ? undefined : { scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="saber-tip" style={{ background: hex }} />
        </motion.span>
      </span>

      {label ? (
        <span className="saber-label shrink-0 font-mono text-[0.625rem] tracking-[0.25em] text-brand-muted uppercase sm:text-xs">
          {label}
        </span>
      ) : null}

      <style jsx>{`
        .saber-hilt {
          display: inline-block;
          width: 2.25rem;
          height: 0.875rem;
          border-radius: 3px;
          background: linear-gradient(
            180deg,
            #d7d9dd 0%,
            #9a9ea6 18%,
            #4b4e55 50%,
            #8a8d94 82%,
            #2e3036 100%
          );
          border: 1px solid var(--c-border);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.35),
            inset 0 -1px 0 rgba(0, 0, 0, 0.5),
            0 1px 3px rgba(0, 0, 0, 0.45);
        }
        @media (min-width: 640px) {
          .saber-hilt {
            width: 3rem;
            height: 1rem;
          }
        }
        /* Emitter mouth at the blade end of the hilt */
        .saber-hilt-tip {
          position: absolute;
          top: 50%;
          right: -2px;
          width: 4px;
          height: 70%;
          transform: translateY(-50%);
          border-radius: 1px;
          background: linear-gradient(180deg, #2b2d33, #66696f, #2b2d33);
        }

        .saber-blade-wrap {
          display: flex;
          align-items: center;
          /* keep room for the core's vertical glow */
          min-height: 1rem;
        }

        .saber-blade {
          position: relative;
          display: block;
          width: 100%;
          height: 2px;
          transform-origin: left center;
          border-radius: 2px;
          background: ${CORE};
          will-change: transform, opacity, box-shadow;
        }

        /* Rounded white-hot blade tip */
        .saber-tip {
          position: absolute;
          top: 50%;
          right: -3px;
          width: 6px;
          height: 6px;
          transform: translateY(-50%);
          border-radius: 999px;
          box-shadow: 0 0 6px 2px currentColor;
        }

        /* Idle hum/flicker — gentle, low-amplitude */
        .saber-flicker {
          animation: saber-hum 2.4s ease-in-out infinite;
        }
        @keyframes saber-hum {
          0%,
          100% {
            opacity: 1;
            filter: brightness(1);
          }
          47% {
            opacity: 0.94;
            filter: brightness(1.06);
          }
          53% {
            opacity: 0.99;
            filter: brightness(0.98);
          }
          71% {
            opacity: 0.92;
            filter: brightness(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .saber-flicker {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
