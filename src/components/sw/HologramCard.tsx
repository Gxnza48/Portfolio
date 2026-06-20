"use client";

import { ExternalLink } from "lucide-react";
import type { Project } from "@/data/content";
import ProjectPreview from "@/components/ProjectPreview";
import { useReducedMotion } from "@/lib/useReducedMotion";

export interface HologramCardProps {
  readonly project: Project;
}

/**
 * Hologram-style project card — the Leia / Death-Star-plans look.
 *
 * A semi-transparent cyan panel ("var(--c-holo)") with a soft outer glow,
 * a thin holographic border and animated horizontal scanlines. The whole card
 * carries a subtle flicker + jitter; on hover the glow/opacity intensify and
 * the card lifts. When `prefers-reduced-motion` is set, all motion is dropped
 * and the final readable, static state is rendered.
 */
export default function HologramCard({ project }: HologramCardProps) {
  const reduced = useReducedMotion();

  return (
    <article
      className={`holo-card group ${reduced ? "is-static" : ""}`}
      aria-label={`Project: ${project.title}`}
    >
      {/* Animated holographic background layers (decorative) */}
      <span className="holo-card__scanlines" aria-hidden="true" />
      <span className="holo-card__sheen" aria-hidden="true" />

      <div className="holo-card__inner">
        <ProjectPreview image={project.image} title={project.title} />

        <header className="holo-card__head">
          <h3 className="holo-card__title">{project.title}</h3>
        </header>

        <p className="holo-card__desc">{project.description}</p>

        {project.tags.length > 0 && (
          <ul className="holo-card__tags" aria-label="Technologies">
            {project.tags.map((tag) => (
              <li key={tag} className="holo-card__chip">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <div className="holo-card__links">
          <a
            className="holo-card__link holo-card__link--primary"
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title} live site (opens in a new tab)`}
          >
            <ExternalLink className="holo-card__icon" aria-hidden="true" />
            <span>Live Site</span>
          </a>

          {project.repo && (
            <a
              className="holo-card__link holo-card__link--repo"
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code on GitHub (opens in a new tab)`}
            >
              <i className="devicon-github-original holo-card__icon" aria-hidden="true" />
              <span>Source</span>
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        .holo-card {
          position: relative;
          isolation: isolate;
          display: block;
          border-radius: 0.85rem;
          padding: 1px;
          color: var(--c-holo);
          background:
            linear-gradient(
              160deg,
              color-mix(in srgb, var(--c-holo) 14%, transparent),
              color-mix(in srgb, var(--c-holo) 4%, transparent)
            );
          border: 1px solid color-mix(in srgb, var(--c-holo) 45%, transparent);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--c-holo) 18%, transparent) inset,
            0 0 22px color-mix(in srgb, var(--c-holo) 18%, transparent),
            0 18px 40px -22px color-mix(in srgb, var(--c-holo) 60%, transparent);
          backdrop-filter: blur(2px);
          transform: translateZ(0);
          transition:
            box-shadow 0.4s ease,
            transform 0.4s ease,
            border-color 0.4s ease;
          animation:
            holo-flicker 6s steps(60) infinite,
            holo-jitter 4.5s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .holo-card:hover,
        .holo-card:focus-within {
          transform: translateY(-6px);
          border-color: color-mix(in srgb, var(--c-holo) 75%, transparent);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--c-holo) 30%, transparent) inset,
            0 0 40px color-mix(in srgb, var(--c-holo) 35%, transparent),
            0 24px 60px -24px color-mix(in srgb, var(--c-holo) 80%, transparent);
        }

        .holo-card__inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          padding: 1.1rem;
          border-radius: 0.78rem;
          background: color-mix(in srgb, var(--c-surface) 78%, transparent);
        }

        /* Horizontal scanlines */
        .holo-card__scanlines {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          border-radius: inherit;
          mix-blend-mode: screen;
          opacity: 0.5;
          background-image: repeating-linear-gradient(
            to bottom,
            color-mix(in srgb, var(--c-holo) 22%, transparent) 0px,
            color-mix(in srgb, var(--c-holo) 22%, transparent) 1px,
            transparent 1px,
            transparent 4px
          );
          animation: holo-scan 6s linear infinite;
        }

        /* Soft moving sheen */
        .holo-card__sheen {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          border-radius: inherit;
          background: radial-gradient(
            120% 80% at 50% -10%,
            color-mix(in srgb, var(--c-holo) 22%, transparent),
            transparent 60%
          );
        }

        .holo-card__head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .holo-card__title {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--c-saber-core);
          text-shadow: 0 0 12px color-mix(in srgb, var(--c-holo) 70%, transparent);
        }

        .holo-card__desc {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.5;
          color: var(--c-text);
        }

        .holo-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .holo-card__chip {
          font-size: 0.72rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          color: var(--c-holo);
          background: color-mix(in srgb, var(--c-holo) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--c-holo) 35%, transparent);
        }

        .holo-card__links {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: 0.25rem;
        }

        .holo-card__link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          padding: 0.45rem 0.8rem;
          border-radius: 0.5rem;
          text-decoration: none;
          color: var(--c-holo);
          border: 1px solid color-mix(in srgb, var(--c-holo) 40%, transparent);
          background: color-mix(in srgb, var(--c-holo) 8%, transparent);
          transition:
            background 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease,
            color 0.25s ease;
        }

        .holo-card__link:hover,
        .holo-card__link:focus-visible {
          color: var(--c-saber-core);
          border-color: color-mix(in srgb, var(--c-holo) 80%, transparent);
          background: color-mix(in srgb, var(--c-holo) 20%, transparent);
          box-shadow: 0 0 16px color-mix(in srgb, var(--c-holo) 45%, transparent);
        }

        .holo-card__link:focus-visible {
          outline: 2px solid var(--c-holo);
          outline-offset: 2px;
        }

        .holo-card__icon {
          width: 1rem;
          height: 1rem;
          font-size: 1rem;
          line-height: 1;
          flex: none;
        }

        @keyframes holo-flicker {
          0%,
          100% {
            opacity: 1;
          }
          7% {
            opacity: 0.86;
          }
          9% {
            opacity: 1;
          }
          42% {
            opacity: 0.92;
          }
          44% {
            opacity: 1;
          }
          78% {
            opacity: 0.82;
          }
          80% {
            opacity: 1;
          }
        }

        @keyframes holo-jitter {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          25% {
            transform: translate3d(0.4px, -0.3px, 0);
          }
          50% {
            transform: translate3d(-0.3px, 0.4px, 0);
          }
          75% {
            transform: translate3d(0.3px, 0.2px, 0);
          }
        }

        @keyframes holo-scan {
          from {
            background-position-y: 0;
          }
          to {
            background-position-y: 64px;
          }
        }

        /* Reduced-motion: render final static state, no flicker/jitter/scan */
        .holo-card.is-static {
          animation: none;
        }
        .holo-card.is-static .holo-card__scanlines {
          animation: none;
        }
        .holo-card.is-static:hover,
        .holo-card.is-static:focus-within {
          transform: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .holo-card,
          .holo-card__scanlines {
            animation: none !important;
          }
          .holo-card:hover,
          .holo-card:focus-within {
            transform: none;
          }
        }
      `}</style>
    </article>
  );
}
