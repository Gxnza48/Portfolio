"use client";

/**
 * Skills.tsx — "Jedi writing" tech-stack archive.
 *
 * Each SKILLS group is rendered as a cluster of holocron-facet / temple-stone
 * inscription chips. Every skill name is decoded from Aurebesh-like glyphs into
 * its real, readable form via <DecodeText> (which keeps the real text in the
 * accessibility tree). A decorative <Holocron variant="cube" /> sits as the
 * section centerpiece.
 *
 * Motion: GSAP ScrollTrigger reveals groups + chips with a stagger, scoped to a
 * gsap.context() that is reverted on cleanup. When prefers-reduced-motion is
 * set, all reveal motion is skipped and the final readable state is rendered.
 *
 * No trademarked fonts/logos/audio — the look is recreated with CSS only.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SKILLS, type SkillGroup } from "@/data/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import DecodeText from "@/components/sw/DecodeText";
import Holocron from "@/components/sw/Holocron";

/* ------------------------------------------------------------------ */
/* Inscription chip — one skill (devicon + decoding name)             */
/* ------------------------------------------------------------------ */

interface InscriptionChipProps {
  readonly icon: string;
  readonly name: string;
}

function InscriptionChip({ icon, name }: InscriptionChipProps) {
  return (
    <li className="chip" data-reveal="chip">
      <span className="chip__rune" aria-hidden="true">
        <i className={icon} />
      </span>
      <DecodeText text={name} trigger="view" className="chip__name" />
      <span className="chip__edge" aria-hidden="true" />

      <style jsx>{`
        .chip {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.55rem 0.9rem;
          border: 1px solid var(--c-border);
          border-radius: 0.55rem;
          background: linear-gradient(
            150deg,
            color-mix(in srgb, var(--c-surface-high) 80%, transparent),
            color-mix(in srgb, var(--c-surface) 90%, transparent)
          );
          box-shadow:
            inset 0 1px 0 color-mix(in srgb, var(--c-holo) 14%, transparent),
            0 1px 12px color-mix(in srgb, var(--c-bg) 60%, transparent);
          overflow: hidden;
          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            transform 0.25s ease;
        }
        .chip:hover {
          border-color: color-mix(in srgb, var(--c-holo) 55%, var(--c-border));
          box-shadow:
            inset 0 1px 0 color-mix(in srgb, var(--c-holo) 26%, transparent),
            0 0 18px color-mix(in srgb, var(--c-holo) 28%, transparent);
          transform: translateY(-2px);
        }
        .chip__rune {
          display: inline-grid;
          place-items: center;
          width: 1.7rem;
          height: 1.7rem;
          font-size: 1.15rem;
          line-height: 1;
          color: var(--c-holo);
          text-shadow: 0 0 0.5em
            color-mix(in srgb, var(--c-holo) 60%, transparent);
        }
        .chip :global(.chip__name) {
          font-family:
            ui-monospace, "SFMono-Regular", "Cascadia Code", "Roboto Mono",
            monospace;
          font-size: 0.82rem;
          letter-spacing: 0.01em;
          color: var(--c-text);
        }
        /* Decorative scanning edge highlight. */
        .chip__edge {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            115deg,
            transparent 35%,
            color-mix(in srgb, var(--c-saber-core) 22%, transparent) 50%,
            transparent 65%
          );
          opacity: 0;
          transform: translateX(-60%);
          transition: opacity 0.3s ease;
        }
        .chip:hover .chip__edge {
          opacity: 1;
          animation: chip-sheen 0.9s ease forwards;
        }
        @keyframes chip-sheen {
          from {
            transform: translateX(-60%);
          }
          to {
            transform: translateX(60%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .chip,
          .chip:hover {
            transition: none;
            transform: none;
          }
          .chip:hover .chip__edge {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Group card — one SKILLS category (temple stone)                    */
/* ------------------------------------------------------------------ */

interface GroupCardProps {
  readonly group: SkillGroup;
}

function GroupCard({ group }: GroupCardProps) {
  return (
    <article className="stone" data-reveal="card">
      <header className="stone__head">
        <span className="stone__kicker">{group.category}</span>
        <span className="stone__rule" aria-hidden="true" />
      </header>

      <ul className="stone__chips">
        {group.items.map((item) => (
          <InscriptionChip key={item.name} icon={item.icon} name={item.name} />
        ))}
      </ul>

      <style jsx>{`
        .stone {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          padding: 1.5rem 1.4rem;
          border: 1px solid var(--c-border);
          border-radius: 1rem;
          background:
            radial-gradient(
              140% 120% at 0% 0%,
              color-mix(in srgb, var(--c-holo) 9%, transparent),
              transparent 60%
            ),
            color-mix(in srgb, var(--c-surface) 92%, transparent);
          box-shadow:
            inset 0 0 0 1px color-mix(in srgb, var(--c-holo) 6%, transparent),
            0 18px 40px -28px color-mix(in srgb, var(--c-bg) 90%, transparent);
          backdrop-filter: blur(6px);
        }
        /* Faint holo corner bracket. */
        .stone::before {
          content: "";
          position: absolute;
          top: 0.7rem;
          left: 0.7rem;
          width: 1.4rem;
          height: 1.4rem;
          border-top: 1px solid
            color-mix(in srgb, var(--c-holo) 45%, transparent);
          border-left: 1px solid
            color-mix(in srgb, var(--c-holo) 45%, transparent);
          opacity: 0.7;
          pointer-events: none;
        }
        .stone__head {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .stone__kicker {
          font-family:
            ui-monospace, "SFMono-Regular", "Cascadia Code", "Roboto Mono",
            monospace;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--c-muted);
          white-space: nowrap;
        }
        .stone__rule {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            color-mix(in srgb, var(--c-holo) 50%, transparent),
            transparent
          );
        }
        .stone__chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }
      `}</style>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                            */
/* ------------------------------------------------------------------ */

export default function Skills() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-reveal="card"]');

      cards.forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 36,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
        });

        const chips = card.querySelectorAll<HTMLElement>('[data-reveal="chip"]');
        if (chips.length) {
          gsap.from(chips, {
            opacity: 0,
            y: 18,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              once: true,
            },
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="skills" ref={rootRef} className="skills" aria-labelledby="skills-title">
      <div className="skills__inner">
        <header className="skills__head">
          <p className="skills__eyebrow">
            <span aria-hidden="true">{">"} </span>
            systems and languages
          </p>
          <h2 id="skills-title" className="skills__title">
            <DecodeText
              text="Tech_Stack"
              trigger="view"
              as="span"
              className="skills__title-decode"
            />
          </h2>
          <p className="skills__sub">
            Inscriptions recovered from the archive — the Jedi writing decodes
            into the tools of the trade.
          </p>
        </header>

        <div className="skills__centerpiece" aria-hidden="true">
          <Holocron variant="cube" />
        </div>

        <div className="skills__grid">
          {SKILLS.map((group) => (
            <GroupCard key={group.category} group={group} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .skills {
          position: relative;
          padding: clamp(4rem, 10vw, 8rem) 1.25rem;
          background: var(--c-bg);
          color: var(--c-text);
          overflow: hidden;
        }
        .skills__inner {
          position: relative;
          max-width: 72rem;
          margin: 0 auto;
        }
        .skills__head {
          max-width: 44rem;
          margin: 0 auto;
          text-align: center;
        }
        .skills__eyebrow {
          margin: 0 0 0.9rem;
          font-family:
            ui-monospace, "SFMono-Regular", "Cascadia Code", "Roboto Mono",
            monospace;
          font-size: 0.74rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--c-holo);
        }
        .skills__title {
          margin: 0;
          font-size: clamp(2rem, 6vw, 3.4rem);
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.02;
        }
        .skills :global(.skills__title-decode) {
          color: var(--c-text);
          text-shadow: 0 0 0.6em
            color-mix(in srgb, var(--c-holo) 30%, transparent);
        }
        .skills__sub {
          margin: 1rem auto 0;
          max-width: 36rem;
          font-size: 0.95rem;
          line-height: 1.55;
          color: var(--c-muted);
        }
        .skills__centerpiece {
          display: flex;
          justify-content: center;
          margin: clamp(2rem, 5vw, 3rem) 0;
        }
        .skills__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.1rem;
        }
        @media (min-width: 640px) {
          .skills__grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 980px) {
          .skills__grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </section>
  );
}
