"use client";

/**
 * StarDestroyer — the iconic slow overhead descent of a massive wedge hull
 * entering frame from the top. A dramatic, one-shot reveal piece.
 *
 * Pure CSS/SVG (no WebGL). The hull is an original triangular silhouette with
 * surface paneling, a raised command tower near the rear and engine glow dots.
 * On scroll into view the hull descends with subtle parallax (framer-motion
 * useScroll, scrubbed). A faint underbelly light sweep adds menace.
 *
 * Decorative only: the whole thing is aria-hidden. When the user prefers
 * reduced motion it renders already in place with no descent/sweep.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

export interface StarDestroyerProps {
  readonly className?: string;
}

/* ------------------------------------------------------------------ */
/* The hull silhouette (foreshortened, viewed from below/ahead).      */
/* ------------------------------------------------------------------ */

function Hull() {
  return (
    <svg
      viewBox="0 0 800 520"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMin meet"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      <defs>
        {/* Top-lit hull body: brighter at the nose, falling into shadow aft. */}
        <linearGradient id="sd-body" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="var(--c-surface-high)" />
          <stop offset="42%" stopColor="var(--c-surface)" />
          <stop offset="100%" stopColor="var(--c-bg)" />
        </linearGradient>
        {/* Sharper top facet to read the dorsal crease. */}
        <linearGradient id="sd-crest" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="var(--c-surface-high)" />
          <stop offset="100%" stopColor="var(--c-surface)" />
        </linearGradient>
        {/* Underbelly sweep — a faint band of light that travels aft. */}
        <linearGradient id="sd-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--c-holo)" stopOpacity="0" />
          <stop offset="48%" stopColor="var(--c-holo)" stopOpacity="0.55" />
          <stop offset="52%" stopColor="var(--c-holo)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--c-holo)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sd-engine" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--c-saber-core)" />
          <stop offset="35%" stopColor="var(--c-holo)" />
          <stop offset="100%" stopColor="var(--c-holo)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sd-tower" cx="0.5" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="var(--c-surface-high)" />
          <stop offset="100%" stopColor="var(--c-surface)" />
        </radialGradient>
      </defs>

      {/* Hull body — long isosceles wedge, nose down. */}
      <path
        d="M400 18 L760 470 L40 470 Z"
        fill="url(#sd-body)"
        stroke="var(--c-border)"
        strokeWidth="1.5"
      />

      {/* Central dorsal crest, a brighter spine running the length. */}
      <path
        d="M400 18 L470 470 L330 470 Z"
        fill="url(#sd-crest)"
        opacity="0.9"
      />

      {/* Longitudinal paneling lines fanning out from the nose. */}
      <g stroke="var(--c-border)" strokeWidth="1" fill="none" opacity="0.55">
        <path d="M400 18 L150 470" />
        <path d="M400 18 L250 470" />
        <path d="M400 18 L340 470" />
        <path d="M400 18 L460 470" />
        <path d="M400 18 L550 470" />
        <path d="M400 18 L650 470" />
      </g>

      {/* Transverse rib lines, suggesting hull plating depth. */}
      <g stroke="var(--c-border)" strokeWidth="0.75" fill="none" opacity="0.4">
        <path d="M312 130 L488 130" />
        <path d="M268 210 L532 210" />
        <path d="M212 305 L588 305" />
        <path d="M150 400 L650 400" />
      </g>

      {/* Faint primary-color rim accent along the leading edges. */}
      <g
        stroke="var(--c-primary-soft)"
        strokeWidth="1.25"
        fill="none"
        opacity="0.5"
      >
        <path d="M400 22 L752 466" />
        <path d="M400 22 L48 466" />
      </g>

      {/* Raised command tower near the rear (aft third). */}
      <g>
        <rect
          x="362"
          y="392"
          width="76"
          height="44"
          rx="4"
          fill="url(#sd-tower)"
          stroke="var(--c-border)"
          strokeWidth="1"
        />
        {/* Bridge deck cap. */}
        <rect
          x="378"
          y="380"
          width="44"
          height="16"
          rx="3"
          fill="var(--c-surface-high)"
          stroke="var(--c-border)"
          strokeWidth="1"
        />
        {/* Twin sensor globes. */}
        <circle cx="384" cy="380" r="5" fill="var(--c-surface-high)" stroke="var(--c-border)" strokeWidth="0.75" />
        <circle cx="416" cy="380" r="5" fill="var(--c-surface-high)" stroke="var(--c-border)" strokeWidth="0.75" />
        {/* Lit bridge windows. */}
        <g fill="var(--c-holo)" opacity="0.85">
          <rect x="372" y="404" width="6" height="3" />
          <rect x="384" y="404" width="6" height="3" />
          <rect x="396" y="404" width="6" height="3" />
          <rect x="408" y="404" width="6" height="3" />
          <rect x="420" y="404" width="6" height="3" />
        </g>
      </g>

      {/* Underbelly light sweep band (animated via CSS transform). */}
      <g className="sd-sweep" aria-hidden="true">
        <rect x="40" y="438" width="720" height="32" fill="url(#sd-sweep)" />
      </g>

      {/* Engine glow dots along the rear edge. */}
      <g className="sd-engines">
        {[120, 240, 360, 440, 560, 680].map((cx, i) => (
          <g key={cx} style={{ ["--sd-i" as string]: i }}>
            <circle cx={cx} cy="470" r="22" fill="url(#sd-engine)" />
            <circle cx={cx} cy="470" r="7" fill="var(--c-saber-core)" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function StarDestroyer({ className }: StarDestroyerProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Scrubbed scroll progress across the section's traversal of the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Hull descends from above; the glow layer trails slightly for parallax.
  const hullY = useTransform(scrollYProgress, [0, 0.6, 1], ["-78%", "0%", "8%"]);
  const glowY = useTransform(scrollYProgress, [0, 0.6, 1], ["-58%", "6%", "16%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 1], [0, 1, 1]);

  return (
    <div
      ref={ref}
      className={`sd-root${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      <div className="sd-stage">
        {/* Ambient glow that the hull pushes ahead of itself. */}
        <motion.div
          className="sd-glow"
          style={reduced ? undefined : { y: glowY }}
        />
        {/* The hull. */}
        <motion.div
          className="sd-hull"
          style={reduced ? undefined : { y: hullY, opacity }}
        >
          <Hull />
        </motion.div>
      </div>

      <style jsx>{`
        .sd-root {
          position: relative;
          width: 100%;
          overflow: hidden;
          pointer-events: none;
          /* Enough vertical room for the descent to read as enormous. */
          min-height: clamp(280px, 52vw, 640px);
        }

        .sd-stage {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          /* Hull aligns to the top so it appears to enter overhead. */
          align-items: flex-start;
        }

        .sd-hull {
          position: relative;
          z-index: 2;
          width: min(110%, 1100px);
          /* Foreshorten: tilt the wedge so the nose reads as nearer/lower. */
          transform-origin: 50% 0%;
          will-change: transform, opacity;
          filter: drop-shadow(0 24px 48px rgba(0, 0, 0, 0.55));
        }

        .sd-glow {
          position: absolute;
          top: 0;
          left: 50%;
          z-index: 1;
          width: min(120%, 1200px);
          height: 70%;
          transform: translateX(-50%);
          background: radial-gradient(
            60% 50% at 50% 30%,
            color-mix(in srgb, var(--c-holo) 22%, transparent),
            transparent 70%
          );
          will-change: transform;
        }

        /* Underbelly light sweep travelling aft. */
        :global(.sd-sweep) {
          transform-box: fill-box;
          transform-origin: center;
          animation: sd-sweep 6s ease-in-out infinite;
        }

        @keyframes sd-sweep {
          0%,
          100% {
            transform: translateX(-26%);
            opacity: 0.25;
          }
          50% {
            transform: translateX(26%);
            opacity: 0.7;
          }
        }

        /* Engine cores pulse gently. */
        :global(.sd-engines) > g {
          transform-box: fill-box;
          transform-origin: center;
          animation: sd-engine 2.6s ease-in-out infinite;
          animation-delay: calc(var(--sd-i) * -0.32s);
        }

        @keyframes sd-engine {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        @media (max-width: 640px) {
          .sd-hull {
            width: 140%;
          }
        }

        /* Respect reduced motion: kill all looping CSS animation too. */
        @media (prefers-reduced-motion: reduce) {
          :global(.sd-sweep),
          :global(.sd-engines) > g {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
