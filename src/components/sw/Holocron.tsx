"use client";

/**
 * Holocron — a glowing geometric "knowledge-object" rendered with pure CSS 3D
 * (no WebGL). A Jedi holocron is a blue translucent cube; a Sith holocron is a
 * red triangular pyramid. Purely decorative: the wrapper is aria-hidden.
 *
 * - transform-style: preserve-3d, slow Y rotation + slight X wobble.
 * - Inner core glow + soft drop shadow for dimensionality.
 * - Respects prefers-reduced-motion: stays static (still glowing).
 * - Colors follow the active Force side via useTheme(), with the variant
 *   providing the canonical Jedi-blue / Sith-red bias.
 */

import { useMemo } from "react";
import { useTheme } from "@/lib/theme";
import { useReducedMotion } from "@/lib/useReducedMotion";

export interface HolocronProps {
  readonly variant?: "cube" | "pyramid";
  readonly className?: string;
}

/* Canonical saber hues used for the per-variant glow bias. */
const SABER_BLUE = "#4FC3F7";
const SABER_RED = "#E10600";

export default function Holocron({
  variant = "cube",
  className,
}: HolocronProps) {
  const { side } = useTheme();
  const reduced = useReducedMotion();

  /**
   * Glow color: the variant sets the canonical hue (Jedi cube = blue,
   * Sith pyramid = red). When the active Force side disagrees with the
   * variant's canonical side we lean on the theme primary so the accent
   * still reads as part of the current palette — but the variant always
   * wins its signature color to stay true to the lore.
   */
  const glow = useMemo(() => {
    if (variant === "cube") {
      // Jedi holocron — cyan/blue. Use the hologram token, fall to saber blue.
      return {
        edge: "var(--c-holo, " + SABER_BLUE + ")",
        glow: SABER_BLUE,
        core: "var(--c-saber-core, #ffffff)",
      };
    }
    // Sith holocron — red. Theme primary is red on the sith side.
    return {
      edge: "var(--c-primary, " + SABER_RED + ")",
      glow: SABER_RED,
      core: "var(--c-saber-core, #ffffff)",
    };
  }, [variant]);

  const isCube = variant === "cube";

  const label = isCube ? "Jedi holocron" : "Sith holocron";

  return (
    <div
      aria-hidden="true"
      data-side={side}
      data-variant={variant}
      className={["holocron", reduced ? "is-static" : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
      title={label}
    >
      <div className="stage">
        <div className="object">
          {isCube ? <Cube /> : <Pyramid />}
          <span className="core" aria-hidden="true" />
        </div>
      </div>

      <style jsx>{`
        .holocron {
          /* tokens drive every color so it tracks the active Force side */
          --hc-edge: ${glow.edge};
          --hc-glow: ${glow.glow};
          --hc-core: ${glow.core};
          --hc-size: clamp(72px, 14vw, 132px);

          position: relative;
          display: inline-grid;
          place-items: center;
          width: var(--hc-size);
          height: var(--hc-size);
          perspective: 720px;
          /* soft grounded drop shadow */
          filter: drop-shadow(0 18px 26px color-mix(in srgb, var(--hc-glow) 28%, transparent));
        }

        .stage {
          position: relative;
          width: 60%;
          height: 60%;
          transform-style: preserve-3d;
          transform: rotateX(-22deg);
        }

        .object {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          animation: hc-spin 14s linear infinite;
          will-change: transform;
        }

        .is-static .object {
          animation: none;
          transform: rotateY(28deg) rotateX(6deg);
        }

        /* ---- shared face look ---- */
        .holocron :global(.face) {
          position: absolute;
          background:
            radial-gradient(
              120% 120% at 50% 18%,
              color-mix(in srgb, var(--hc-glow) 36%, transparent) 0%,
              color-mix(in srgb, var(--hc-glow) 10%, transparent) 46%,
              transparent 78%
            );
          border: 1px solid color-mix(in srgb, var(--hc-edge) 80%, transparent);
          box-shadow:
            inset 0 0 18px color-mix(in srgb, var(--hc-glow) 45%, transparent),
            0 0 14px color-mix(in srgb, var(--hc-edge) 55%, transparent);
          backface-visibility: visible;
        }

        /* ---- cube ---- */
        .holocron :global(.cube) {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
        }
        .holocron :global(.cube .face) {
          width: 100%;
          height: 100%;
        }
        .holocron :global(.cube .f-front) {
          transform: translateZ(calc(var(--hc-size) * 0.3));
        }
        .holocron :global(.cube .f-back) {
          transform: rotateY(180deg) translateZ(calc(var(--hc-size) * 0.3));
        }
        .holocron :global(.cube .f-right) {
          transform: rotateY(90deg) translateZ(calc(var(--hc-size) * 0.3));
        }
        .holocron :global(.cube .f-left) {
          transform: rotateY(-90deg) translateZ(calc(var(--hc-size) * 0.3));
        }
        .holocron :global(.cube .f-top) {
          transform: rotateX(90deg) translateZ(calc(var(--hc-size) * 0.3));
        }
        .holocron :global(.cube .f-bottom) {
          transform: rotateX(-90deg) translateZ(calc(var(--hc-size) * 0.3));
        }

        /* ---- pyramid (4 triangular faces) ---- */
        .holocron :global(.pyramid) {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          /* nudge apex toward center of stage */
          transform: translateY(calc(var(--hc-size) * -0.06));
        }
        .holocron :global(.pyramid .face) {
          left: 0;
          bottom: 0;
          width: 100%;
          height: calc(var(--hc-size) * 0.62);
          transform-origin: bottom center;
          /* triangle silhouette */
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          border: none;
          box-shadow:
            inset 0 -8px 22px color-mix(in srgb, var(--hc-glow) 48%, transparent),
            0 0 16px color-mix(in srgb, var(--hc-edge) 50%, transparent);
          /* draw glowing edges with an extra outline gradient */
          background:
            linear-gradient(
              to top,
              color-mix(in srgb, var(--hc-glow) 40%, transparent),
              color-mix(in srgb, var(--hc-glow) 6%, transparent) 70%,
              transparent
            );
        }
        /* faint edge stroke on each triangular face via pseudo */
        .holocron :global(.pyramid .face)::before {
          content: "";
          position: absolute;
          inset: 0;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          background: linear-gradient(
            to top,
            color-mix(in srgb, var(--hc-edge) 60%, transparent),
            transparent 14%
          );
          mix-blend-mode: screen;
          opacity: 0.6;
        }
        .holocron :global(.pyramid .p-1) {
          transform: rotateY(0deg) translateZ(calc(var(--hc-size) * 0.18))
            rotateX(28deg);
        }
        .holocron :global(.pyramid .p-2) {
          transform: rotateY(90deg) translateZ(calc(var(--hc-size) * 0.18))
            rotateX(28deg);
        }
        .holocron :global(.pyramid .p-3) {
          transform: rotateY(180deg) translateZ(calc(var(--hc-size) * 0.18))
            rotateX(28deg);
        }
        .holocron :global(.pyramid .p-4) {
          transform: rotateY(270deg) translateZ(calc(var(--hc-size) * 0.18))
            rotateX(28deg);
        }

        /* ---- inner core glow ---- */
        .holocron :global(.core) {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 46%;
          height: 46%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            var(--hc-core) 0%,
            color-mix(in srgb, var(--hc-glow) 85%, var(--hc-core)) 24%,
            color-mix(in srgb, var(--hc-glow) 60%, transparent) 55%,
            transparent 78%
          );
          filter: blur(1px);
          animation: hc-pulse 3.4s ease-in-out infinite;
          will-change: opacity, transform;
        }
        .is-static :global(.core) {
          animation: none;
        }

        @keyframes hc-spin {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(8deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(0deg);
          }
        }

        @keyframes hc-pulse {
          0%,
          100% {
            opacity: 0.78;
            transform: translate(-50%, -50%) scale(0.92);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.08);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .object {
            animation: none;
            transform: rotateY(28deg) rotateX(6deg);
          }
          .holocron :global(.core) {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function Cube() {
  return (
    <div className="cube" aria-hidden="true">
      <span className="face f-front" />
      <span className="face f-back" />
      <span className="face f-right" />
      <span className="face f-left" />
      <span className="face f-top" />
      <span className="face f-bottom" />
    </div>
  );
}

function Pyramid() {
  return (
    <div className="pyramid" aria-hidden="true">
      <span className="face p-1" />
      <span className="face p-2" />
      <span className="face p-3" />
      <span className="face p-4" />
    </div>
  );
}
