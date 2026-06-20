"use client";

/**
 * BinarySunset — the twin-suns binary sunset of Tatooine.
 *
 * A purely-decorative CSS background layer (absolute, behind content) used as the
 * emotional backdrop for the closing Contact section. It composes:
 *   - a warm vertical sky gradient (deep violet -> orange/amber -> pale gold);
 *   - two glowing suns (radial-gradient circles) sitting low, with soft bloom and
 *     a gentle heat-haze shimmer;
 *   - a dark dune horizon silhouette at the bottom.
 *
 * The palette is a fixed warm Tatooine scheme regardless of the active Force side.
 * As the layer scrolls into view, the suns drift / parallax subtly via GSAP
 * ScrollTrigger (scrubbed). When reduced motion is requested, the layer renders
 * its final static state with no shimmer and no parallax.
 *
 * Decorative only: the host is `aria-hidden`.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/lib/useReducedMotion";

export interface BinarySunsetProps {
  readonly className?: string;
}

/* Fixed warm Tatooine palette — intentionally theme-independent. */
const SKY_TOP = "#2a1442"; // deep twilight violet
const SKY_MID = "#7a2d4e"; // dusky magenta
const SKY_AMBER = "#d4622a"; // burning orange
const SKY_GOLD = "#f6b656"; // pale amber-gold near horizon
const SUN_BIG_CORE = "#fff3cf";
const SUN_BIG_RIM = "#ffb347";
const SUN_SMALL_CORE = "#fff0c0";
const SUN_SMALL_RIM = "#ff8a3d";
const DUNE = "#1b0c1f"; // near-black warm dune silhouette

export default function BinarySunset({ className }: BinarySunsetProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const sunBigRef = useRef<HTMLDivElement>(null);
  const sunSmallRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Suns drift gently upward as the section scrolls past — the classic
      // slow rise of the twin suns. Different magnitudes give parallax depth.
      tl.fromTo(
        sunBigRef.current,
        { yPercent: 14 },
        { yPercent: -6, ease: "none" },
        0,
      )
        .fromTo(
          sunSmallRef.current,
          { yPercent: 22, xPercent: -4 },
          { yPercent: 0, xPercent: 2, ease: "none" },
          0,
        )
        // The sky drifts slightly to enhance the parallax separation.
        .fromTo(
          skyRef.current,
          { yPercent: -4 },
          { yPercent: 4, ease: "none" },
          0,
        );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`bs-root${className ? ` ${className}` : ""}`}
      data-reduced={reducedMotion ? "true" : "false"}
    >
      {/* Sky gradient */}
      <div ref={skyRef} className="bs-sky" />

      {/* Atmospheric warm bloom hugging the horizon */}
      <div className="bs-horizon-glow" />

      {/* Twin suns */}
      <div ref={sunBigRef} className="bs-sun bs-sun--big">
        <span className="bs-sun-haze" />
      </div>
      <div ref={sunSmallRef} className="bs-sun bs-sun--small">
        <span className="bs-sun-haze bs-sun-haze--delayed" />
      </div>

      {/* Dune horizon silhouette */}
      <div className="bs-dunes" />

      <style jsx>{`
        .bs-root {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background: ${SKY_TOP};
        }

        .bs-sky {
          position: absolute;
          /* Extra height so the parallax drift never reveals an edge. */
          inset: -8% 0;
          background: linear-gradient(
            to bottom,
            ${SKY_TOP} 0%,
            ${SKY_MID} 38%,
            ${SKY_AMBER} 70%,
            ${SKY_GOLD} 92%,
            ${SKY_GOLD} 100%
          );
          will-change: transform;
        }

        .bs-horizon-glow {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 8%;
          height: 55%;
          background: radial-gradient(
            120% 90% at 50% 100%,
            rgba(255, 196, 110, 0.55) 0%,
            rgba(255, 150, 70, 0.28) 35%,
            rgba(255, 120, 60, 0) 70%
          );
          mix-blend-mode: screen;
        }

        .bs-sun {
          position: absolute;
          border-radius: 50%;
          will-change: transform;
        }

        /* Larger, higher sun */
        .bs-sun--big {
          width: clamp(180px, 32vw, 420px);
          aspect-ratio: 1;
          left: 50%;
          bottom: 16%;
          transform: translateX(-50%);
          background: radial-gradient(
            circle at 50% 50%,
            ${SUN_BIG_CORE} 0%,
            ${SUN_BIG_CORE} 30%,
            ${SUN_BIG_RIM} 58%,
            rgba(255, 140, 60, 0.55) 74%,
            rgba(255, 120, 50, 0) 100%
          );
          /* Soft bloom */
          filter: drop-shadow(0 0 60px rgba(255, 180, 90, 0.75))
            drop-shadow(0 0 140px rgba(255, 140, 60, 0.45));
        }

        /* Smaller, lower companion sun */
        .bs-sun--small {
          width: clamp(90px, 17vw, 220px);
          aspect-ratio: 1;
          left: 32%;
          bottom: 8%;
          transform: translateX(-50%);
          background: radial-gradient(
            circle at 50% 50%,
            ${SUN_SMALL_CORE} 0%,
            ${SUN_SMALL_CORE} 28%,
            ${SUN_SMALL_RIM} 56%,
            rgba(255, 110, 50, 0.5) 74%,
            rgba(255, 100, 45, 0) 100%
          );
          filter: drop-shadow(0 0 36px rgba(255, 150, 80, 0.7))
            drop-shadow(0 0 90px rgba(255, 110, 55, 0.4));
        }

        /* Heat-haze shimmer — a faint vertically-stretched ring that pulses. */
        .bs-sun-haze {
          position: absolute;
          inset: -18%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 200, 120, 0) 52%,
            rgba(255, 190, 110, 0.35) 64%,
            rgba(255, 160, 80, 0) 80%
          );
          transform-origin: 50% 50%;
          animation: bs-haze 5.5s ease-in-out infinite;
        }
        .bs-sun-haze--delayed {
          animation-duration: 6.8s;
          animation-delay: -2.4s;
        }

        @keyframes bs-haze {
          0%,
          100% {
            transform: scaleY(1) scaleX(1);
            opacity: 0.55;
          }
          50% {
            transform: scaleY(1.06) scaleX(0.985);
            opacity: 0.9;
          }
        }

        .bs-dunes {
          position: absolute;
          left: -2%;
          right: -2%;
          bottom: 0;
          height: 18%;
          background: ${DUNE};
          /* Rolling dune profile carved with a radial mask. */
          -webkit-mask-image: radial-gradient(
              120% 140% at 22% 0%,
              transparent 0,
              transparent 38%,
              black 39%
            ),
            radial-gradient(
              120% 160% at 78% 0%,
              transparent 0,
              transparent 30%,
              black 31%
            );
          mask-image: radial-gradient(
              120% 140% at 22% 0%,
              transparent 0,
              transparent 38%,
              black 39%
            ),
            radial-gradient(
              120% 160% at 78% 0%,
              transparent 0,
              transparent 30%,
              black 31%
            );
          -webkit-mask-composite: source-over;
          mask-composite: add;
          box-shadow: 0 -24px 50px -10px rgba(255, 140, 60, 0.35);
        }

        /* Reduced motion: freeze everything to the readable final frame. */
        .bs-root[data-reduced="true"] .bs-sun-haze {
          animation: none;
          opacity: 0.7;
        }

        @media (prefers-reduced-motion: reduce) {
          .bs-sun-haze {
            animation: none;
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
