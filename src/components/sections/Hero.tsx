"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MapPin, ArrowRight, Database } from "lucide-react";
import { SITE, HERO } from "@/data/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import ScrollCue from "@/components/sw/ScrollCue";
import DecodeText from "@/components/sw/DecodeText";

/* ------------------------------------------------------------------ */
/* Inline role typewriter — cycles SITE.roles with rAF-scheduled ticks */
/* ------------------------------------------------------------------ */

interface TypewriterProps {
  readonly roles: readonly string[];
  readonly reduced: boolean;
}

const TYPE_SPEED = 70; // ms per character while typing
const DELETE_SPEED = 38; // ms per character while deleting
const HOLD_FULL = 1500; // ms to hold a complete word
const HOLD_EMPTY = 320; // ms before typing the next word

function Typewriter({ roles, reduced }: TypewriterProps) {
  const [text, setText] = useState<string>(reduced ? roles[0] ?? "" : "");

  useEffect(() => {
    if (reduced) {
      setText(roles[0] ?? "");
      return;
    }

    let rafId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let cancelled = false;

    const schedule = (fn: () => void, delay: number) => {
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        rafId = requestAnimationFrame(fn);
      }, delay);
    };

    const tick = () => {
      if (cancelled) return;
      const word = roles[wordIndex] ?? "";

      if (!deleting) {
        charIndex += 1;
        setText(word.slice(0, charIndex));
        if (charIndex >= word.length) {
          deleting = true;
          schedule(tick, HOLD_FULL);
        } else {
          schedule(tick, TYPE_SPEED);
        }
      } else {
        charIndex -= 1;
        setText(word.slice(0, charIndex));
        if (charIndex <= 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % roles.length;
          schedule(tick, HOLD_EMPTY);
        } else {
          schedule(tick, DELETE_SPEED);
        }
      }
    };

    schedule(tick, TYPE_SPEED);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [roles, reduced]);

  // Stable accessible label; the visible spans animate, sr text is fixed.
  return (
    <span
      className="inline-flex items-baseline font-mono"
      aria-label={`Roles: ${roles.join(", ")}`}
    >
      <span aria-hidden className="text-brand-holo">
        {text}
      </span>
      <span
        aria-hidden
        className="ml-0.5 inline-block w-[1px] self-stretch bg-brand-holo hero-caret"
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const reduced = useReducedMotion();
  const scopeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) return;
    const root = scopeRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      tl.from(".hero-status", { autoAlpha: 0, y: -12, duration: 0.6 })
        // Perspective entrance: logo arrives huge, then settles.
        .from(
          ".hero-logo",
          {
            autoAlpha: 0,
            scale: 1.85,
            z: 320,
            filter: "blur(14px)",
            duration: 1.1,
            ease: "power4.out",
          },
          "-=0.2",
        )
        .from(
          ".hero-fade",
          {
            autoAlpha: 0,
            y: 26,
            duration: 0.7,
            stagger: 0.12,
          },
          "-=0.5",
        )
        .from(
          ".hero-cue",
          { autoAlpha: 0, y: 14, duration: 0.6 },
          "-=0.2",
        );
    }, scopeRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={scopeRef}
      id="hero"
      aria-label="Introduction"
      className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-5 py-24 sm:px-8"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* Status line */}
        <p className="hero-status mb-8 flex items-center gap-2.5 font-mono text-[0.7rem] tracking-[0.25em] text-brand-muted sm:text-xs">
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-70 hero-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-primary" />
          </span>
          {HERO.status}
        </p>

        {/* Kicker / role label */}
        <div className="hero-fade mb-5">
          <DecodeText
            text={SITE.tagline}
            className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-brand-holo sm:text-xs"
          />
        </div>

        {/* BIG name title — CSS-recreated Star Wars-style logo */}
        <h1
          className="hero-logo select-none [perspective:1000px] [transform-style:preserve-3d]"
          aria-label={SITE.name}
        >
          <span className="sr-only">{SITE.name}</span>
          <span
            aria-hidden
            className="hero-logo-text block font-black uppercase leading-[0.82] tracking-tight"
          >
            <span className="block">{SITE.firstName}</span>
            <span className="block">{SITE.lastName}</span>
          </span>
        </h1>

        {/* Subtitle (verbatim) */}
        <p className="hero-fade mt-8 max-w-2xl text-balance text-base text-brand-text/90 sm:text-lg">
          {SITE.subtitle}
        </p>

        {/* Info panel: location + typewriter role */}
        <div className="hero-fade mt-7 flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <span className="inline-flex items-center gap-2 font-mono text-xs tracking-wide text-brand-muted">
            <MapPin className="h-3.5 w-3.5 text-brand-primary" aria-hidden />
            {SITE.location}
          </span>
          <span className="hidden h-4 w-px bg-brand-border sm:block" aria-hidden />
          <span className="inline-flex items-center gap-2 font-mono text-xs tracking-wide text-brand-muted">
            <span className="text-brand-muted/70">{">"}</span>
            <Typewriter roles={SITE.roles} reduced={reduced} />
          </span>
        </div>

        {/* Stats */}
        <ul className="hero-fade mt-10 flex items-stretch gap-3 sm:gap-4">
          {SITE.stats.map((stat) => (
            <li
              key={stat.label}
              className="min-w-[7rem] rounded-xl border border-brand-border bg-brand-surface/60 px-5 py-4 backdrop-blur-sm transition-colors hover:border-brand-primary/50"
            >
              <span className="block bg-gradient-to-b from-[var(--c-gold)] to-[var(--c-primary)] bg-clip-text text-2xl font-extrabold tabular-nums text-transparent sm:text-3xl">
                {stat.value}
              </span>
              <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-[0.18em] text-brand-muted">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="hero-fade mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href={HERO.primaryCta.href}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-brand-primary/60 bg-brand-primary/10 px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary transition-all hover:bg-brand-primary/20 hover:shadow-[0_0_28px_-6px_var(--c-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          >
            {HERO.primaryCta.label}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
          <a
            href={HERO.secondaryCta.href}
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-brand-border bg-transparent px-8 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted transition-all hover:border-brand-holo/60 hover:text-brand-holo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-holo focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
          >
            <Database className="h-3.5 w-3.5" aria-hidden />
            {HERO.secondaryCta.label}
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-cue absolute bottom-6 left-1/2 -translate-x-1/2">
        <ScrollCue />
      </div>

      <style jsx>{`
        .hero-logo-text {
          /* Wide/condensed heavy display vibe — recreated, no trademarked font. */
          font-size: clamp(3.25rem, 14vw, 11rem);
          letter-spacing: -0.02em;
          background-image: linear-gradient(
            180deg,
            #fff6db 0%,
            var(--c-gold) 38%,
            #b07b1f 72%,
            var(--c-gold) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 2px 30px rgba(0, 0, 0, 0.45);
          filter: drop-shadow(0 0 22px rgba(214, 168, 74, 0.28));
          transform: scaleY(1.06);
        }

        .hero-caret {
          animation: hero-blink 1.05s step-end infinite;
        }

        .hero-ping {
          animation: hero-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes hero-blink {
          0%,
          50% {
            opacity: 1;
          }
          50.01%,
          100% {
            opacity: 0;
          }
        }

        @keyframes hero-ping {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          80%,
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-caret,
          .hero-ping {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
