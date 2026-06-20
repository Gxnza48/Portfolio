"use client";

/**
 * SpaceBackground — the persistent backdrop for the portfolio.
 *
 * Layers (back to front, all inside a fixed full-viewport wrapper):
 *   1. CSS fallback starfield (radial-gradient dots) — guarantees something
 *      is visible even if WebGL is unavailable.
 *   2. A THREE.Points starfield rendered via useThreeScene. In "normal" mode
 *      the stars drift/rotate slowly; as the user scrolls through the first
 *      ~1.2 viewport heights the stars accelerate toward the camera
 *      (the jump-to-lightspeed effect), respawning far away when they pass.
 *   3. A CSS hyperspace streak overlay (radial/conic white-blue lines from
 *      center) whose opacity tracks scroll progress.
 *   4. A white flash overlay that peaks briefly near progress ~0.7 — the
 *      "jump to lightspeed" flash — then fades.
 *
 * Theme: jedi tints the stars cooler/brighter; sith keeps them plain white,
 * slightly dimmer.
 *
 * Reduced motion: useThreeScene renders a single static frame, and the
 * hyperspace/flash overlays stay hidden — only the calm starfield shows.
 *
 * This component is meant to be dynamically imported with `ssr: false`.
 */

import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import { useThreeScene, type ThreeContext } from "@/lib/three/useThreeScene";
import { useTheme } from "@/lib/theme";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Half-extent of the cube stars are scattered in (world units per axis). */
const FIELD = 600;
/** Base star count at quality 1 (scaled by ctx.quality). */
const BASE_COUNT = 6000;
/** Scroll distance (in viewport heights) over which hyperspace ramps 0..1. */
const SCROLL_SPAN = 1.2;
/** Drift/respawn speeds (world units / second). */
const DRIFT_SPEED = 4;
const HYPER_SPEED = 1400;
/** Progress at which the lightspeed flash peaks. */
const FLASH_PEAK = 0.7;

/** Jedi: cool, bright. Sith: plain white, slightly dimmer. */
const STAR_TINT = {
  jedi: { color: 0xdff3ff, opacity: 1 },
  sith: { color: 0xffffff, opacity: 0.82 },
} as const;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** smoothstep easing for a softer acceleration curve. */
function smooth(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export default function SpaceBackground() {
  const { side } = useTheme();
  const reducedMotion = useReducedMotion();

  // Overlay opacities are driven by the scroll handler (via rAF-throttled state).
  const [streakOpacity, setStreakOpacity] = useState(0);
  const [flashOpacity, setFlashOpacity] = useState(0);

  // Live scroll progress 0..1, read inside the WebGL frame loop without
  // re-rendering React.
  const progressRef = useRef(0);
  // The PointsMaterial, so the theme effect can re-tint without rebuilding.
  const materialRef = useRef<THREE.PointsMaterial | null>(null);
  // Latest reducedMotion for the scroll handler closure.
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  // ---- WebGL starfield --------------------------------------------------
  const containerRef = useThreeScene({
    alpha: true,
    pauseWhenOffscreen: false,
    reducedMotion,
    setup: (ctx: ThreeContext) => {
      const { THREE: T, scene, camera, quality } = ctx;
      camera.position.z = 1;

      const count = Math.max(1, Math.floor(BASE_COUNT * quality));
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 0] = (Math.random() * 2 - 1) * FIELD;
        positions[i * 3 + 1] = (Math.random() * 2 - 1) * FIELD;
        positions[i * 3 + 2] = (Math.random() * 2 - 1) * FIELD;
      }

      const geometry = new T.BufferGeometry();
      const attr = new T.BufferAttribute(positions, 3);
      geometry.setAttribute("position", attr);

      const tint = STAR_TINT[side];
      const material = new T.PointsMaterial({
        color: tint.color,
        size: 1.1,
        sizeAttenuation: true,
        transparent: true,
        opacity: tint.opacity * 0.9,
        depthWrite: false,
        blending: T.AdditiveBlending,
      });
      materialRef.current = material;

      const points = new T.Points(geometry, material);
      scene.add(points);

      return {
        onFrame: (_elapsed: number, delta: number) => {
          const progress = smooth(progressRef.current);
          const speed = lerp(DRIFT_SPEED, HYPER_SPEED, progress);
          const dz = speed * delta;

          // Move stars toward the camera (+z); respawn far away when passed.
          const arr = attr.array as Float32Array;
          const limit = camera.position.z + 5;
          for (let i = 0; i < count; i++) {
            const zi = i * 3 + 2;
            let z = arr[zi] + dz;
            if (z > limit) {
              z -= FIELD * 2;
              arr[i * 3 + 0] = (Math.random() * 2 - 1) * FIELD;
              arr[i * 3 + 1] = (Math.random() * 2 - 1) * FIELD;
            }
            arr[zi] = z;
          }
          attr.needsUpdate = true;

          // Gentle rotation/drift in normal mode; eased out in hyperspace.
          points.rotation.z += delta * 0.02 * (1 - progress);
        },
        dispose: () => {
          materialRef.current = null;
        },
      };
    },
  });

  // ---- Re-tint stars on theme change ------------------------------------
  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    const tint = STAR_TINT[side];
    material.color.setHex(tint.color);
    material.opacity = tint.opacity * 0.9;
    material.needsUpdate = true;
  }, [side]);

  // ---- Scroll → progress + overlay opacities (rAF throttled) ------------
  useEffect(() => {
    if (reducedMotion) {
      progressRef.current = 0;
      setStreakOpacity(0);
      setFlashOpacity(0);
      return;
    }

    let rafId = 0;
    let queued = false;

    const update = () => {
      queued = false;
      const span = window.innerHeight * SCROLL_SPAN;
      const progress = span > 0 ? clamp01(window.scrollY / span) : 0;
      progressRef.current = progress;

      const eased = smooth(progress);

      // Streaks fade in with progress (subtle until well into the scroll).
      setStreakOpacity(clamp01(eased * eased) * 0.9);

      // Flash: a narrow Gaussian-like pulse centered on FLASH_PEAK.
      const d = (progress - FLASH_PEAK) / 0.12;
      setFlashOpacity(clamp01(Math.exp(-d * d)) * 0.85);
    };

    const onScroll = () => {
      if (queued || reducedRef.current) return;
      queued = true;
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
      {/* 1. CSS fallback starfield — always painted under the canvas. */}
      <div className="sb-fallback absolute inset-0" />

      {/* 2. WebGL starfield container. */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* 3. Hyperspace streak overlay. */}
      <div
        className="sb-streaks absolute inset-0"
        style={{ opacity: streakOpacity }}
      />

      {/* 4. Jump-to-lightspeed white flash. */}
      <div
        className="sb-flash absolute inset-0"
        style={{ opacity: flashOpacity }}
      />

      <style jsx>{`
        .sb-fallback {
          background-color: var(--c-bg);
          background-image:
            radial-gradient(
              1px 1px at 20% 30%,
              var(--c-saber-core),
              transparent
            ),
            radial-gradient(
              1px 1px at 75% 45%,
              var(--c-text),
              transparent
            ),
            radial-gradient(
              1.5px 1.5px at 50% 80%,
              var(--c-saber-core),
              transparent
            ),
            radial-gradient(
              1px 1px at 88% 12%,
              var(--c-text),
              transparent
            ),
            radial-gradient(
              1px 1px at 12% 70%,
              var(--c-saber-core),
              transparent
            ),
            radial-gradient(
              1px 1px at 35% 18%,
              var(--c-text),
              transparent
            ),
            radial-gradient(
              1.5px 1.5px at 64% 62%,
              var(--c-saber-core),
              transparent
            );
          background-repeat: repeat;
          background-size: 320px 320px;
          opacity: 0.5;
        }

        .sb-streaks {
          background-image:
            repeating-conic-gradient(
              from 0deg at 50% 50%,
              transparent 0deg,
              var(--c-saber-core) 0.4deg,
              transparent 0.9deg,
              transparent 3deg
            ),
            radial-gradient(
              circle at 50% 50%,
              var(--c-holo) 0%,
              transparent 60%
            );
          /* Brighter at the edges, dark core — like streaks shooting outward. */
          mask-image: radial-gradient(
            circle at 50% 50%,
            transparent 6%,
            black 55%
          );
          -webkit-mask-image: radial-gradient(
            circle at 50% 50%,
            transparent 6%,
            black 55%
          );
          mix-blend-mode: screen;
          transition: opacity 80ms linear;
          will-change: opacity;
        }

        .sb-flash {
          background: radial-gradient(
            circle at 50% 50%,
            var(--c-saber-core) 0%,
            var(--c-holo) 45%,
            transparent 100%
          );
          mix-blend-mode: screen;
          transition: opacity 60ms linear;
          will-change: opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .sb-streaks,
          .sb-flash {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
