"use client";

/**
 * Projects — "the archive": each project mapped to a Star Wars planet.
 *
 * A dramatic <StarDestroyer /> descends overhead at the top, then a heading
 * introduces the work. For every project we pair a procedural 3D
 * <ProjectPlanet /> (lazy, WebGL, ssr:false) with a holographic <HologramCard />,
 * alternating planet left/right on desktop for visual rhythm and stacking the
 * planet above the card on mobile. As you scroll, each planet gently
 * approaches (subtle scrub parallax). A <SaberDivider /> ignites between
 * entries in the project's saber color.
 *
 * All copy is rendered verbatim from PROJECTS in "@/data/content".
 * When prefers-reduced-motion is set, scrub parallax is skipped and planets
 * render in their resting position.
 */

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/data/content";
import type { Project } from "@/data/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import HologramCard from "@/components/sw/HologramCard";
import SaberDivider from "@/components/sw/SaberDivider";
import StarDestroyer from "@/components/sw/StarDestroyer";

// WebGL planet must be client-only — never SSR'd.
const ProjectPlanet = dynamic(() => import("@/components/sw/ProjectPlanet"), {
  ssr: false,
  loading: () => <span aria-hidden="true" className="planet-pending" />,
});

/* ------------------------------------------------------------------ */
/* Single archive entry: planet + hologram card                        */
/* ------------------------------------------------------------------ */

interface ArchiveEntryProps {
  readonly project: Project;
  /** Planet sits on the right (and card on the left) when true. */
  readonly reversed: boolean;
  readonly reduced: boolean;
}

function ArchiveEntry({ project, reversed, reduced }: ArchiveEntryProps) {
  const planetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = planetRef.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Planet drifts up + scales slightly as the entry crosses the viewport,
      // reading as a tasteful "approach" parallax. Scrubbed to scroll.
      gsap.fromTo(
        el,
        { yPercent: 14, scale: 0.92, autoAlpha: 0.55 },
        {
          yPercent: -8,
          scale: 1,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    }, planetRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <article
      className={`archive-entry${reversed ? " is-reversed" : ""}`}
      aria-labelledby={`project-${project.id}-title`}
    >
      {/* Hidden, always-readable heading anchor for the card (decorative
          planet is aria-hidden via ProjectPlanet's own labelling). */}
      <h3 id={`project-${project.id}-title`} className="sr-only">
        {project.title}
      </h3>

      <div ref={planetRef} className="archive-entry__planet">
        <div className="archive-entry__planet-stage">
          <ProjectPlanet type={project.planet} />
        </div>
      </div>

      <div className="archive-entry__card">
        <HologramCard project={project} />
      </div>

      <style jsx>{`
        .archive-entry {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
          align-items: center;
        }

        .archive-entry__planet {
          justify-self: center;
          width: 100%;
          max-width: 420px;
          will-change: transform, opacity;
        }

        /* Square, responsive stage for the WebGL planet. */
        .archive-entry__planet-stage {
          position: relative;
          width: clamp(220px, 70vw, 420px);
          aspect-ratio: 1 / 1;
          margin: 0 auto;
        }

        .archive-entry__card {
          min-width: 0;
        }

        @media (min-width: 900px) {
          .archive-entry {
            grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
            gap: clamp(2rem, 5vw, 4.5rem);
          }
          /* Default: planet left, card right. */
          .archive-entry__planet {
            grid-column: 1;
            grid-row: 1;
          }
          .archive-entry__card {
            grid-column: 2;
            grid-row: 1;
          }
          /* Reversed: card left, planet right. */
          .archive-entry.is-reversed .archive-entry__planet {
            grid-column: 2;
          }
          .archive-entry.is-reversed .archive-entry__card {
            grid-column: 1;
          }
          .archive-entry__planet-stage {
            width: clamp(300px, 30vw, 420px);
          }
        }
      `}</style>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Projects() {
  const reduced = useReducedMotion();

  return (
    <section
      id="archive"
      aria-labelledby="archive-heading"
      className="projects-section relative w-full"
    >
      {/* Dramatic overhead reveal. Decorative. */}
      <StarDestroyer />

      <div className="projects-inner">
        <header className="projects-head">
          <p className="projects-kicker">
            <span aria-hidden="true" className="projects-kicker__bracket">
              [
            </span>
            Selected_Works
            <span aria-hidden="true" className="projects-kicker__bracket">
              ]
            </span>
          </p>
          <h2 id="archive-heading" className="projects-title">
            Engineering creative products
          </h2>
        </header>

        <div className="projects-list">
          {PROJECTS.map((project, index) => (
            <div key={project.id} className="projects-list__item">
              <ArchiveEntry
                project={project}
                reversed={index % 2 === 1}
                reduced={reduced}
              />
              {/* Ignition divider between entries (not after the last). */}
              {index < PROJECTS.length - 1 && (
                <SaberDivider color={project.saber} label={project.title} />
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .projects-section {
          padding-bottom: clamp(3rem, 8vw, 6rem);
        }

        .projects-inner {
          width: min(100%, 1200px);
          margin-inline: auto;
          padding-inline: clamp(1rem, 4vw, 2.5rem);
        }

        .projects-head {
          margin-bottom: clamp(2.5rem, 6vw, 4.5rem);
          text-align: center;
        }

        .projects-kicker {
          margin: 0 0 0.85rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 0.75rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--c-holo);
        }

        .projects-kicker__bracket {
          color: var(--c-muted);
          margin-inline: 0.4rem;
        }

        .projects-title {
          margin: 0;
          font-size: clamp(1.75rem, 5vw, 3.25rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.01em;
          color: var(--c-text);
          text-wrap: balance;
        }

        .projects-list {
          display: flex;
          flex-direction: column;
        }

        .projects-list__item {
          padding-block: clamp(1.5rem, 4vw, 2.5rem);
        }

        /* Loading placeholder for the lazily-imported planet. */
        :global(.planet-pending) {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 999px;
          background: radial-gradient(
            circle at 35% 30%,
            color-mix(in srgb, var(--c-holo) 22%, transparent),
            transparent 70%
          );
        }
      `}</style>
    </section>
  );
}
