"use client";

/**
 * ForceLightning — global overlay that flashes blue-white / violet electric
 * arcs the moment the theme switches TO the sith side (canon: Force lightning
 * is a Sith-only power, so jedi -> sith is the only trigger).
 *
 * Render contract:
 *  - Fixed, inset-0, pointer-events-none, very high z so it sits above content.
 *  - Idle state renders nothing (null) so it never costs paint while dormant.
 *  - On jedi -> sith, a ~600ms burst paints a handful of jagged SVG polyline
 *    bolts (in var(--c-lightning) / white-hot core) with a soft glow filter,
 *    plus a quick violet screen flash, then clears.
 *  - prefers-reduced-motion: no jagged arcs / no animation — just one brief,
 *    subtle violet flash that fades to the final readable state.
 *
 * Determinism: bolt geometry is varied per burst via an incrementing counter
 * fed into a tiny seeded PRNG (no Math.random / no module-level randomness),
 * so re-renders during a burst never reshuffle the bolts.
 */

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/theme";
import { useReducedMotion } from "@/lib/useReducedMotion";

/* Tunables ---------------------------------------------------------------- */

const BURST_MS = 600;
const REDUCED_FLASH_MS = 320;
const VIEWBOX = 1000;
const BOLT_COUNT = 5;
const SEGMENTS_MIN = 5;
const SEGMENTS_MAX = 9;

/* Deterministic per-burst PRNG (mulberry32) — keeps bolts stable across the
 * burst's renders while still varying from one burst to the next. */
function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Bolt {
  readonly id: number;
  readonly points: string;
  readonly width: number;
  readonly delayMs: number;
}

/** Build a single jagged bolt travelling from a screen edge toward centre. */
function buildBolt(id: number, rng: () => number): Bolt {
  const cx = VIEWBOX / 2;
  const cy = VIEWBOX / 2;

  // Pick a random start anchor on one of the four edges.
  const edge = Math.floor(rng() * 4);
  let sx: number;
  let sy: number;
  switch (edge) {
    case 0: // top
      sx = rng() * VIEWBOX;
      sy = 0;
      break;
    case 1: // right
      sx = VIEWBOX;
      sy = rng() * VIEWBOX;
      break;
    case 2: // bottom
      sx = rng() * VIEWBOX;
      sy = VIEWBOX;
      break;
    default: // left
      sx = 0;
      sy = rng() * VIEWBOX;
      break;
  }

  // End near (but not exactly at) the centre for an organic convergence.
  const ex = cx + (rng() - 0.5) * VIEWBOX * 0.22;
  const ey = cy + (rng() - 0.5) * VIEWBOX * 0.22;

  const segments =
    SEGMENTS_MIN + Math.floor(rng() * (SEGMENTS_MAX - SEGMENTS_MIN + 1));

  // Perpendicular vector for lateral jitter.
  const dx = ex - sx;
  const dy = ey - sy;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;
  const jitter = VIEWBOX * 0.09;

  const coords: string[] = [`${sx.toFixed(1)},${sy.toFixed(1)}`];
  for (let i = 1; i < segments; i += 1) {
    const t = i / segments;
    const baseX = sx + dx * t;
    const baseY = sy + dy * t;
    // Taper jitter so the bolt tightens as it nears the centre.
    const amp = jitter * (1 - t) + jitter * 0.25;
    const off = (rng() - 0.5) * 2 * amp;
    coords.push(
      `${(baseX + px * off).toFixed(1)},${(baseY + py * off).toFixed(1)}`,
    );
  }
  coords.push(`${ex.toFixed(1)},${ey.toFixed(1)}`);

  return {
    id,
    points: coords.join(" "),
    width: 2.5 + rng() * 3.5,
    delayMs: Math.floor(rng() * 140),
  };
}

export default function ForceLightning() {
  const { side } = useTheme();
  const reducedMotion = useReducedMotion();

  const prevSideRef = useRef(side);
  const burstCounterRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [bolts, setBolts] = useState<readonly Bolt[]>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const prev = prevSideRef.current;
    prevSideRef.current = side;

    // Only the jedi -> sith transition unleashes Force lightning.
    if (!(prev === "jedi" && side === "sith")) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (reducedMotion) {
      // Single subtle flash, no jagged geometry.
      setBolts([]);
      setActive(true);
      timeoutRef.current = setTimeout(() => {
        setActive(false);
        timeoutRef.current = null;
      }, REDUCED_FLASH_MS);
      return;
    }

    burstCounterRef.current += 1;
    const seed = burstCounterRef.current * 2654435761 + 0x9e3779b9;
    const rng = makeRng(seed);
    const next: Bolt[] = [];
    for (let i = 0; i < BOLT_COUNT; i += 1) {
      next.push(buildBolt(i, rng));
    }

    setBolts(next);
    setActive(true);
    timeoutRef.current = setTimeout(() => {
      setActive(false);
      setBolts([]);
      timeoutRef.current = null;
    }, BURST_MS);
  }, [side, reducedMotion]);

  // Clean up any pending timeout on unmount.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!active) return null;

  const filterId = "force-lightning-glow";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[130] overflow-hidden"
    >
      {/* Violet screen flash. */}
      <div
        className={
          reducedMotion
            ? "force-lightning-flash force-lightning-flash--reduced absolute inset-0"
            : "force-lightning-flash absolute inset-0"
        }
      />

      {/* Jagged arcs (skipped entirely under reduced motion). */}
      {!reducedMotion && bolts.length > 0 && (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter
              id={filterId}
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter={`url(#${filterId})`}>
            {bolts.map((bolt) => (
              <g
                key={bolt.id}
                className="force-lightning-bolt"
                style={{ animationDelay: `${bolt.delayMs}ms` }}
              >
                {/* Outer violet/blue halo. */}
                <polyline
                  points={bolt.points}
                  fill="none"
                  stroke="var(--c-lightning)"
                  strokeWidth={bolt.width * 2.6}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity={0.55}
                />
                {/* Mid stroke. */}
                <polyline
                  points={bolt.points}
                  fill="none"
                  stroke="var(--c-lightning)"
                  strokeWidth={bolt.width}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {/* White-hot core. */}
                <polyline
                  points={bolt.points}
                  fill="none"
                  stroke="var(--c-saber-core)"
                  strokeWidth={Math.max(1, bolt.width * 0.4)}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </g>
        </svg>
      )}

      <style jsx>{`
        .force-lightning-flash {
          background: radial-gradient(
            circle at 50% 50%,
            color-mix(in srgb, var(--c-lightning) 55%, transparent) 0%,
            color-mix(in srgb, var(--c-lightning) 18%, transparent) 45%,
            transparent 78%
          );
          mix-blend-mode: screen;
          opacity: 0;
          animation: force-lightning-flash ${BURST_MS}ms
            cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
        }
        .force-lightning-flash--reduced {
          animation: force-lightning-flash-reduced ${REDUCED_FLASH_MS}ms
            ease-out forwards;
        }
        .force-lightning-bolt {
          opacity: 0;
          animation: force-lightning-bolt ${BURST_MS}ms steps(1, end) forwards;
        }

        @keyframes force-lightning-flash {
          0% {
            opacity: 0;
          }
          8% {
            opacity: 0.9;
          }
          18% {
            opacity: 0.2;
          }
          30% {
            opacity: 0.7;
          }
          55% {
            opacity: 0.15;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes force-lightning-flash-reduced {
          0% {
            opacity: 0;
          }
          25% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
          }
        }
        /* Flicker the bolts on/off rapidly across the burst. */
        @keyframes force-lightning-bolt {
          0%,
          12%,
          26%,
          44% {
            opacity: 1;
          }
          6%,
          20%,
          36%,
          60% {
            opacity: 0.15;
          }
          70%,
          100% {
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .force-lightning-bolt {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
