"use client";

/**
 * Welcome.tsx — the post-hyperspace "Bienvenido" + biography section.
 *
 * Renders ABOUT.welcome as a serene reveal headline, ABOUT.heading as a
 * three-line display heading (last line accented), and the two ABOUT.bio
 * paragraphs VERBATIM inside a subtle hologram-treated panel.
 *
 * Motion: GSAP ScrollTrigger staggered reveal, reverted on unmount.
 * Respects prefers-reduced-motion (renders final readable state, no motion).
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ABOUT } from "@/data/content";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function Welcome() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Reduced motion: ensure final readable state, no animation.
    if (reducedMotion) {
      gsap.set(root.querySelectorAll<HTMLElement>("[data-reveal]"), {
        autoAlpha: 1,
        y: 0,
        clearProps: "all",
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      gsap.set(targets, { autoAlpha: 0, y: 36 });

      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: root,
          start: "top 72%",
          once: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="about"
      aria-labelledby="welcome-heading"
      className="welcome-section relative mx-auto w-full max-w-6xl px-6 py-24 sm:px-8 sm:py-32 lg:px-12"
    >
      {/* Serene welcome reveal */}
      <p
        data-reveal
        className="welcome-greeting mb-8 font-light tracking-[0.18em] text-brand-holo"
        style={{
          fontSize: "clamp(2.25rem, 7vw, 4.5rem)",
          textShadow: "0 0 28px var(--c-holo)",
        }}
      >
        {ABOUT.welcome}
      </p>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: display heading */}
        <div className="lg:col-span-5">
          <h2
            id="welcome-heading"
            data-reveal
            className="welcome-title font-semibold leading-[0.95] tracking-tight text-brand-text"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.25rem)" }}
          >
            {ABOUT.heading.map((line, i) => {
              const isLast = i === ABOUT.heading.length - 1;
              return (
                <span
                  key={line}
                  className="block"
                  style={
                    isLast
                      ? {
                          color: "var(--c-primary)",
                          textShadow: "0 0 24px var(--c-primary-soft)",
                        }
                      : undefined
                  }
                >
                  {line}
                </span>
              );
            })}
          </h2>
        </div>

        {/* Right: hologram bio panel */}
        <div className="lg:col-span-7">
          <div
            data-reveal
            className="holo-panel relative overflow-hidden rounded-2xl p-7 sm:p-9"
          >
            {/* Scanline overlay (decorative) */}
            <div className="holo-scanlines" aria-hidden="true" />
            <div className="holo-glow" aria-hidden="true" />

            <div className="relative z-[1] space-y-6">
              {ABOUT.bio.map((paragraph, i) => {
                const emphasized = i === 0;
                return (
                  <p
                    key={i}
                    className={
                      emphasized
                        ? "bio-paragraph bio-paragraph--lead text-brand-text"
                        : "bio-paragraph text-brand-muted"
                    }
                    style={
                      emphasized
                        ? { fontSize: "clamp(1.0625rem, 2vw, 1.25rem)" }
                        : { fontSize: "clamp(0.95rem, 1.6vw, 1.0625rem)" }
                    }
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .welcome-greeting {
          /* keep readable even before reveal under reduced motion */
          will-change: transform, opacity;
        }

        .holo-panel {
          background:
            linear-gradient(
              160deg,
              color-mix(in srgb, var(--c-surface-high) 70%, transparent),
              color-mix(in srgb, var(--c-surface) 60%, transparent)
            );
          border: 1px solid color-mix(in srgb, var(--c-holo) 45%, var(--c-border));
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--c-holo) 12%, transparent),
            0 0 48px -12px color-mix(in srgb, var(--c-holo) 40%, transparent),
            inset 0 0 64px -32px color-mix(in srgb, var(--c-holo) 50%, transparent);
          backdrop-filter: blur(4px);
        }

        .holo-glow {
          position: absolute;
          inset: -40%;
          pointer-events: none;
          background: radial-gradient(
            60% 50% at 80% 0%,
            color-mix(in srgb, var(--c-holo) 22%, transparent),
            transparent 70%
          );
          opacity: 0.7;
        }

        .holo-scanlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: repeating-linear-gradient(
            to bottom,
            color-mix(in srgb, var(--c-holo) 9%, transparent) 0px,
            color-mix(in srgb, var(--c-holo) 9%, transparent) 1px,
            transparent 1px,
            transparent 4px
          );
          mix-blend-mode: screen;
          opacity: 0.55;
          animation: holo-scan 7s linear infinite;
        }

        .bio-paragraph {
          line-height: 1.7;
        }

        .bio-paragraph--lead {
          font-weight: 500;
          padding-left: 1.1rem;
          border-left: 2px solid var(--c-primary);
          box-shadow: -8px 0 24px -16px var(--c-primary);
        }

        @keyframes holo-scan {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .holo-scanlines {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
