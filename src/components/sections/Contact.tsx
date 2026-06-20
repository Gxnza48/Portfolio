"use client";

/**
 * Contact.tsx — the epic ending + contact finale.
 *
 * A tall, restrained, emotional close to the archive. The twin-suns
 * <BinarySunset /> sits behind as an absolute backdrop layer; all content sits
 * above it (relative z-10), centered.
 *
 * Content is rendered VERBATIM from CONTACT / SITE in "@/data/content":
 *   - CONTACT.kicker as a mono kicker ("END OF ARCHIVE")
 *   - CONTACT.heading (two lines, 2nd line accented var(--c-primary))
 *   - CONTACT.body paragraph
 *   - primary mailto CTA + secondary external "Review Code" CTA (github icon)
 *   - footer: "(c) " + year + " " + CONTACT.footer  /  SITE.socials labels
 *
 * Motion: GSAP ScrollTrigger staggered reveal, reverted on unmount. Respects
 * prefers-reduced-motion (renders the final readable state, no motion).
 * Social labels have no real URLs, so they render as plain styled text.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail } from "lucide-react";

import BinarySunset from "@/components/sw/BinarySunset";
import { CONTACT, SITE } from "@/data/content";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function Contact() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Reduced motion: ensure the final readable state, no animation.
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
      gsap.set(targets, { autoAlpha: 0, y: 40 });

      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.13,
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          once: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="contact"
      aria-labelledby="contact-heading"
      className="contact-root relative isolate flex min-h-screen w-full flex-col justify-between overflow-hidden"
    >
      {/* Twin-suns backdrop — decorative, behind everything. */}
      <BinarySunset />

      {/* Readability scrim so text stays legible over the bright sunset. */}
      <div className="contact-scrim pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />

      {/* Centered finale content */}
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center sm:px-8 sm:py-32">
        <p
          data-reveal
          className="contact-kicker font-mono text-xs uppercase tracking-[0.4em] text-brand-gold sm:text-sm"
        >
          {CONTACT.kicker}
        </p>

        <h2
          id="contact-heading"
          data-reveal
          className="contact-heading mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-brand-text sm:text-6xl md:text-7xl"
        >
          <span className="block">{CONTACT.heading[0]}</span>
          <span className="contact-accent block">{CONTACT.heading[1]}</span>
        </h2>

        <p
          data-reveal
          className="contact-body mt-8 max-w-xl text-pretty text-base leading-relaxed text-brand-muted sm:text-lg"
        >
          {CONTACT.body}
        </p>

        {/* CTAs */}
        <div
          data-reveal
          className="mt-12 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center"
        >
          <a
            href={CONTACT.primaryCta.href}
            aria-label={CONTACT.primaryCta.label}
            className="contact-cta contact-cta--primary group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--c-bg)]"
          >
            <Mail aria-hidden="true" className="h-4 w-4" />
            <span>{CONTACT.primaryCta.label}</span>
          </a>

          <a
            href={CONTACT.secondaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${CONTACT.secondaryCta.label} (opens in a new tab)`}
            className="contact-cta contact-cta--secondary group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-holo)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--c-bg)]"
          >
            <i className="devicon-github-original" aria-hidden="true" />
            <span>{CONTACT.secondaryCta.label}</span>
          </a>
        </div>
      </div>

      {/* Footer row */}
      <footer
        data-reveal
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-4 border-t border-brand-border/60 px-6 py-6 text-xs text-brand-muted sm:flex-row sm:justify-between sm:px-8"
      >
        <p className="font-mono tracking-wide">
          {"(c) "}
          {year} {CONTACT.footer}
        </p>

        <ul className="flex items-center gap-5 font-mono uppercase tracking-[0.18em]">
          {SITE.socials.map((social) => (
            <li
              key={social}
              className="contact-social text-brand-muted transition-colors"
            >
              {social}
            </li>
          ))}
        </ul>
      </footer>

      <style jsx>{`
        .contact-root {
          background: var(--c-bg);
        }

        /* Top-down scrim: clear over the suns, darker at the very top/bottom
           edges so the kicker, body and footer keep contrast. */
        .contact-scrim {
          background: linear-gradient(
            to bottom,
            color-mix(in srgb, var(--c-bg) 55%, transparent) 0%,
            transparent 28%,
            transparent 68%,
            color-mix(in srgb, var(--c-bg) 35%, transparent) 100%
          );
        }

        .contact-accent {
          color: var(--c-primary);
        }

        /* Primary CTA — solid force-colored button. */
        .contact-cta--primary {
          color: var(--c-bg);
          background: var(--c-primary);
          box-shadow: 0 0 0 1px var(--c-primary),
            0 8px 30px -8px color-mix(in srgb, var(--c-primary) 70%, transparent);
          transition: transform 0.25s ease, box-shadow 0.25s ease,
            background 0.25s ease;
        }
        .contact-cta--primary:hover {
          background: var(--c-primary-soft);
          box-shadow: 0 0 0 1px var(--c-primary),
            0 12px 40px -8px color-mix(in srgb, var(--c-primary) 85%, transparent);
        }

        /* Secondary CTA — glassy outline with hologram-cyan hover. */
        .contact-cta--secondary {
          color: var(--c-text);
          background: color-mix(in srgb, var(--c-surface) 55%, transparent);
          border: 1px solid var(--c-border);
          backdrop-filter: blur(6px);
          transition: transform 0.25s ease, border-color 0.25s ease,
            color 0.25s ease, box-shadow 0.25s ease;
        }
        .contact-cta--secondary:hover {
          color: var(--c-holo);
          border-color: var(--c-holo);
          box-shadow: 0 0 24px -6px
            color-mix(in srgb, var(--c-holo) 60%, transparent);
        }

        .contact-cta :global(.devicon-github-original) {
          font-size: 1.1rem;
          line-height: 1;
        }

        .contact-cta:active {
          transform: translateY(1px);
        }

        .contact-social:hover {
          color: var(--c-text);
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-cta {
            transition: none;
          }
          .contact-cta:active {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
