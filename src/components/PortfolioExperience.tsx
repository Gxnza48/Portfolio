"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Github,
  Mail,
  Menu,
  MoveRight,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import type { CSSProperties } from "react";

type VisualKind = "chain" | "arena" | "archive" | "document" | "chat" | "velocity" | "note" | "network";

type Project = {
  id: string;
  index: string;
  title: string;
  kind: string;
  status: string;
  description: string;
  detail: string;
  signal: string;
  tags: string[];
  repo: string;
  live?: string;
  image?: string;
  accent: string;
  softAccent: string;
  visual: VisualKind;
};

const featuredProjects: Project[] = [
  {
    id: "chainwork",
    index: "01",
    title: "ChainWork",
    kind: "Collaborative workspace",
    status: "Live product",
    description:
      "A real-time workspace where teams turn loose ideas into shared, visible momentum.",
    detail:
      "Presence, append-only roadmaps, drag-and-drop planning, votes and attachments — built as a product system, not a static dashboard.",
    signal: "Real-time / PWA",
    tags: ["React", "Supabase", "PWA", "Tiptap", "Motion"],
    repo: "https://github.com/Gxnza48/Chain-work",
    live: "https://chain-work-woad.vercel.app",
    accent: "#80a7ff",
    softAccent: "rgba(128, 167, 255, 0.24)",
    visual: "chain",
  },
  {
    id: "major-scrims",
    index: "02",
    title: "MajorScrims",
    kind: "Competitive gaming platform",
    status: "Live product",
    description:
      "The competitive layer for Fortnite scrims and customs, designed for an always-on community.",
    detail:
      "A production Next.js ecosystem with authentication, editorial tools and a visual language that feels native to the arena.",
    signal: "Next.js / MongoDB",
    tags: ["Next.js", "NextAuth", "MongoDB", "Tiptap", "Framer"],
    repo: "https://github.com/Gxnza48/MajorScrims",
    live: "https://major-scrims.vercel.app",
    accent: "#b5ff4d",
    softAccent: "rgba(181, 255, 77, 0.22)",
    visual: "arena",
  },
  {
    id: "ucahub",
    index: "03",
    title: "UCAHUB",
    kind: "Campus resource hub",
    status: "Live product",
    description:
      "One searchable home for the resources that a university community actually needs.",
    detail:
      "Combines a polished Next.js interface with Supabase, PDF parsing and AI-assisted discovery so useful information stops getting lost.",
    signal: "Search / AI layer",
    tags: ["Next.js", "Supabase", "OpenAI SDK", "PDF", "GSAP"],
    repo: "https://github.com/Gxnza48/UCAHUB",
    live: "https://ucahub.vercel.app",
    accent: "#c1a5ff",
    softAccent: "rgba(193, 165, 255, 0.23)",
    visual: "archive",
  },
  {
    id: "pdfjedi",
    index: "04",
    title: "PDFjedi",
    kind: "AI product system",
    status: "Live product",
    description:
      "An AI workflow that turns dense PDFs into the raw material for a digital product.",
    detail:
      "It translates source documents into technical specifications, UX/UI direction, contracts, budgets and roadmaps — a strong bridge between strategy and execution.",
    signal: "PDF → product",
    tags: ["Claude Code", "AI Workflows", "UX/UI", "Specs", "HTML"],
    repo: "https://github.com/Gxnza48/PDFjedi",
    live: "https://pdfjedi.vercel.app",
    accent: "#ff9b71",
    softAccent: "rgba(255, 155, 113, 0.22)",
    visual: "document",
  },
  {
    id: "rox",
    index: "05",
    title: "rox",
    kind: "Ephemeral anonymous chat",
    status: "Live product",
    description:
      "A serverless, real-time anonymous chat where the conversation is meant to disappear.",
    detail:
      "A focused product constraint becomes the interface: minimum friction, immediate presence and no unnecessary permanence.",
    signal: "Realtime / ephemeral",
    tags: ["Next.js", "Neon", "NanoID", "Realtime", "Vercel"],
    repo: "https://github.com/Gxnza48/rox",
    live: "https://r0xx.vercel.app",
    image: "/projects/Rox.png",
    accent: "#ff7bb7",
    softAccent: "rgba(255, 123, 183, 0.22)",
    visual: "chat",
  },
  {
    id: "hawl",
    index: "06",
    title: "Hawl Tweaks",
    kind: "Low-latency gaming toolkit",
    status: "Live product",
    description:
      "A reversible gaming toolkit made to reduce delay and make performance feel tangible.",
    detail:
      "It pairs a strong utility use case with immersive 3D and motion work — proof that performance tooling can still have personality.",
    signal: "3D / performance",
    tags: ["Next.js", "Three.js", "R3F", "GSAP", "Radix"],
    repo: "https://github.com/Gxnza48/Hawl-Tweaks",
    live: "https://hawl.vercel.app",
    image: "/projects/Hawl.png",
    accent: "#ffd255",
    softAccent: "rgba(255, 210, 85, 0.2)",
    visual: "velocity",
  },
];

const experiments: Project[] = [
  {
    id: "notita",
    index: "A",
    title: "notita",
    kind: "Desktop note app",
    status: "Source / desktop",
    description: "A ridiculously simple, keyboard-first notebook for classes.",
    detail: "",
    signal: "Tauri / Rust / SQLite",
    tags: ["Tauri 2", "Rust", "SQLite", "React"],
    repo: "https://github.com/Gxnza48/notita",
    accent: "#f5f0e8",
    softAccent: "rgba(245, 240, 232, 0.14)",
    visual: "note",
  },
  {
    id: "ucanet",
    index: "B",
    title: "uca.net",
    kind: "Student community network",
    status: "In build",
    description: "A pseudonymous community for UCA Rosario, organized around subjects and cohorts.",
    detail: "",
    signal: "Full product system",
    tags: ["Next.js", "Supabase", "S3", "Vitest", "a11y"],
    repo: "https://github.com/Gxnza48/Ucanet",
    accent: "#7ce6d6",
    softAccent: "rgba(124, 230, 214, 0.18)",
    visual: "network",
  },
  {
    id: "facundo",
    index: "C",
    title: "Facundo Díaz",
    kind: "Motion portfolio",
    status: "Live product",
    description: "A high-energy portfolio built for a 2D animator and motion-graphics artist.",
    detail: "",
    signal: "Visual direction",
    tags: ["React", "GSAP", "Lenis", "Vite"],
    repo: "https://github.com/Gxnza48/FacundoDiazPortfolio",
    live: "https://facundodiazportfolio.onrender.com/",
    image: "/projects/Facundo.png",
    accent: "#ff876e",
    softAccent: "rgba(255, 135, 110, 0.2)",
    visual: "velocity",
  },
  {
    id: "kanki",
    index: "D",
    title: "Kanki",
    kind: "Booking experience",
    status: "Live product",
    description: "A crisp booking and admin experience for a barbershop brand.",
    detail: "",
    signal: "Service design",
    tags: ["React", "UI/UX", "Booking"],
    repo: "https://github.com/Gxnza48/Kanki-Barber-Shop",
    live: "https://kanki.vercel.app/",
    image: "/projects/Kanki.png",
    accent: "#e8b873",
    softAccent: "rgba(232, 184, 115, 0.2)",
    visual: "archive",
  },
];

const navItems = [
  { href: "#work", label: "Work" },
  { href: "#approach", label: "Approach" },
  { href: "#lab", label: "Lab" },
  { href: "#contact", label: "Contact" },
];

function ProjectSignal({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div className={`project-signal project-signal--${project.visual} ${compact ? "project-signal--compact" : ""}`} aria-hidden="true">
      <span className="project-signal__noise" />
      <span className="project-signal__orb project-signal__orb--one" />
      <span className="project-signal__orb project-signal__orb--two" />
      <span className="project-signal__line project-signal__line--one" />
      <span className="project-signal__line project-signal__line--two" />
      <div className="project-signal__interface">
        <span className="project-signal__eyebrow">{project.kind}</span>
        <strong>{project.signal}</strong>
        <div className="project-signal__bars">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
      <span className="project-signal__number">{project.index}</span>
    </div>
  );
}

function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  const style = {
    "--project-accent": project.accent,
    "--project-soft-accent": project.softAccent,
  } as CSSProperties;

  return (
    <div className={`project-visual ${compact ? "project-visual--compact" : ""}`} style={style}>
      <ProjectSignal project={project} compact={compact} />
      <span className="project-visual__scan" />
      <span className="project-visual__grain" />
    </div>
  );
}

export default function PortfolioExperience() {
  const [activeProject, setActiveProject] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [portraitColor, setPortraitColor] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const workRef = useRef<HTMLElement>(null);
  const labRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = workRef.current;
    if (!section) return;
    const media = window.matchMedia("(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    const update = () => {
      frame = 0;
      section.classList.toggle("work--pinned", media.matches);
      let index = 0;
      if (media.matches) {
        const distance = Math.max(0, -section.getBoundingClientRect().top);
        index = Math.min(featuredProjects.length - 1, Math.floor(distance / window.innerHeight));
        section.style.setProperty("--work-progress", String(Math.min(1, distance / (window.innerHeight * featuredProjects.length))));
      } else {
        const cards = section.querySelectorAll<HTMLElement>(".project-stage");
        cards.forEach((card, cardIndex) => {
          if (card.getBoundingClientRect().top < window.innerHeight * 0.55) index = cardIndex;
        });
      }
      setActiveProject(previous => previous === index ? previous : index);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, []);

  const jumpToProject = (index: number) => {
    const section = workRef.current;
    if (!section) return;
    if (section.classList.contains("work--pinned")) {
      window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top + index * window.innerHeight + 2, behavior: "instant" });
    } else {
      section.querySelectorAll<HTMLElement>(".project-stage")[index]?.scrollIntoView({ behavior: "instant", block: "start" });
    }
    setActiveProject(index);
  };

  useEffect(() => {
    const section = labRef.current;
    if (!section) return;
    const media = window.matchMedia("(min-width: 1000px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const track = section.querySelector<HTMLElement>(".experiment-grid");
      if (!track) return;
      const distance = Math.max(0, track.scrollWidth - section.clientWidth);
      const travel = media.matches ? distance : 0;
      section.style.setProperty("--travel", `${travel}px`);
      section.classList.toggle("lab--horizontal", media.matches);
      const progress = Math.max(0, Math.min(travel, -section.getBoundingClientRect().top));
      track.style.transform = media.matches ? `translate3d(${-progress}px,0,0)` : "none";
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("gonzalobonadeo07@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = "mailto:gonzalobonadeo07@gmail.com";
    }
  };

  return (
    <main id="top" className="site-shell">
      <a className="skip-link" href="#work">Skip to projects</a>
      <div className="site-shell__atmosphere" aria-hidden="true" />
      <div className="site-shell__grid" aria-hidden="true" />

      <header className="site-nav">
        <a href="#top" className="site-nav__mark" aria-label="Back to top">
          G<span>/</span>B
        </a>
        <p className="site-nav__availability">
          <span /> available for selected work
        </p>
        <nav className="site-nav__links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="site-nav__menu-button"
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="sr-only">Toggle navigation</span>
          {menuOpen ? <X size={19} /> : <Menu size={20} />}
        </button>
        <nav id="mobile-navigation" inert={!menuOpen} className={`mobile-navigation ${menuOpen ? "is-open" : ""}`} aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      </header>

      <section className="hero section-shell" aria-labelledby="hero-title">
        <motion.div
          className="hero__intro"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow"><span>01</span> Independent digital builder · Rosario, AR</p>
          <h1 id="hero-title" className="hero__title">
            Gonzalo <span>Bonadeo</span>
          </h1>
          <p className="hero__statement">
            I design and build digital products with a clear pulse — useful systems, memorable interfaces, and motion that earns its place.
          </p>
          <div className="hero__actions">
            <a href="#work" className="button button--solid">
              Explore selected work <MoveRight size={18} />
            </a>
            <a href="https://github.com/Gxnza48" target="_blank" rel="noreferrer" className="button button--quiet">
              <Github size={17} /> GitHub archive
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero__object hero__portrait"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="portrait__orbit" aria-hidden="true" />
          <button type="button" className={`portrait__frame ${portraitColor ? "is-color" : ""}`} onClick={() => setPortraitColor(value => !value)} aria-pressed={portraitColor} aria-label="Toggle portrait color">
            <Image src="/gonzalo-portrait.png" alt="Gonzalo Bonadeo smiling" fill sizes="(max-width: 780px) 77vw, 430px" preload className="portrait__image" />
            <span className="portrait__shade" aria-hidden="true" />
            <span className="portrait__caption" aria-hidden="true"><span>Gonzalo Bonadeo</span><small>Developer & creative builder</small></span>
            <span className="portrait__switch" aria-hidden="true">{portraitColor ? "Color on" : "Explore in color"} <ArrowUpRight size={14} /></span>
          </button>
          <span className="portrait__label">Based in Rosario, Argentina <span>↗</span></span>
        </motion.div>

        <motion.a
          href="#work"
          className="hero__scroll"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span>Scroll to browse</span>
          <ArrowDown size={16} />
        </motion.a>
      </section>

      <section id="work" ref={workRef} className="work section-shell" aria-labelledby="work-title">
        <div className="work__sticky">
        <motion.div
          className="section-heading"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <p className="eyebrow"><span>02</span> Curated case studies</p>
          <h2 id="work-title">The build index<span>.</span></h2>
          <p>Six projects that show range without losing the thread: product thinking, technical depth and visual instinct.</p>
        </motion.div>

        <div className="project-index">
          <div className="project-index__rail" aria-label="Select a featured project">
            <p className="project-index__label">Scroll through the index</p>
            <div className="project-index__list">
              {featuredProjects.map((project, index) => (
                <button
                  type="button"
                  key={project.id}
                  className={`project-index__item ${activeProject === index ? "is-active" : ""}`}
                  aria-pressed={activeProject === index}
                  onClick={() => jumpToProject(index)}
                >
                  <span className="project-index__number">{project.index}</span>
                  <span className="project-index__title">{project.title}</span>
                  <span className="project-index__arrow"><ArrowUpRight size={15} /></span>
                </button>
              ))}
            </div>
            <p className="project-index__hint">Keep scrolling to discover each build, or choose a project to jump ahead.</p>
            <div className="work__progress" aria-hidden="true"><span /></div>
          </div>

          <div className="project-stage-wrap">
            {featuredProjects.map((selectedProject, index) => (
              <motion.article
                key={selectedProject.id}
                id={`build-${selectedProject.id}`}
                className={`project-stage ${activeProject === index ? "is-active" : ""}`}
                initial={false}
                style={{ "--project-accent": selectedProject.accent, "--project-soft-accent": selectedProject.softAccent } as CSSProperties}
              >
                <ProjectVisual project={selectedProject} />
                <div className="project-stage__content">
                  <div className="project-stage__meta">
                    <span className="status-dot">{selectedProject.status}</span>
                    <span>{selectedProject.kind}</span>
                  </div>
                  <div className="project-stage__title-row">
                    <h3>{selectedProject.title}</h3>
                    <span className="project-stage__index">/{selectedProject.index}</span>
                  </div>
                  <p className="project-stage__lead">{selectedProject.description}</p>
                  <p className="project-stage__detail">{selectedProject.detail}</p>
                  <div className="tag-list">
                    {selectedProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="project-stage__actions">
                    {selectedProject.live && (
                      <a className="text-link" href={selectedProject.live} target="_blank" rel="noreferrer">
                        Visit live build <ExternalLink size={16} />
                      </a>
                    )}
                    <a className="text-link text-link--muted" href={selectedProject.repo} target="_blank" rel="noreferrer">
                      Inspect source <Github size={16} />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
        </div>
      </section>

      <section id="approach" className="approach section-shell" aria-labelledby="approach-title">
        <motion.div
          className="approach__statement"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <p className="eyebrow"><span>03</span> Working principle</p>
          <h2 id="approach-title">Design should be felt.<br /><em>Engineering should prove it.</em></h2>
        </motion.div>
        <div className="approach__grid">
          <article>
            <span>01</span>
            <h3>Product before pixels</h3>
            <p>Each interface starts from a behavior worth improving, then gets a visual system that makes that behavior obvious.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Motion with a job</h3>
            <p>Animation guides attention, explains change and gives a product tempo — never just decoration sitting on top.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Signals over claims</h3>
            <p>Real-time systems, accessibility checks, tests, deploys and thoughtful constraints say more than inflated metrics.</p>
          </article>
        </div>
      </section>

      <section id="lab" ref={labRef} className="lab section-shell" aria-labelledby="lab-title">
        <div className="lab__sticky">
        <motion.div
          className="section-heading section-heading--lab"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <p className="eyebrow"><span>04</span> Selected experiments</p>
          <h2 id="lab-title">Side quests, serious craft<span>.</span></h2>
          <p>Desktop tools, student networks and visual identity work — the rest of the archive, intentionally kept in view.</p>
        </motion.div>

        <div className="experiment-grid">
          {experiments.map((project, index) => (
            <motion.article
              className="experiment-card"
              key={project.id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: prefersReducedMotion ? 0 : index * 0.07 }}
              style={{ "--project-accent": project.accent, "--project-soft-accent": project.softAccent } as CSSProperties}
            >
              <ProjectVisual project={project} compact />
              <div className="experiment-card__body">
                <div className="experiment-card__meta"><span>{project.index}</span><span>{project.status}</span></div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tag-list tag-list--small">
                  {project.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="experiment-card__links">
                  <a href={project.repo} target="_blank" rel="noreferrer">Source <Github size={15} /></a>
                  {project.live && <a href={project.live} target="_blank" rel="noreferrer">Live <ArrowUpRight size={15} /></a>}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="lab__direction">Keep scrolling to explore <MoveRight size={18} /></p>
        </div>
      </section>

      <section id="contact" className="contact section-shell" aria-labelledby="contact-title">
        <div className="contact__line" aria-hidden="true"><span /></div>
        <motion.div
          className="contact__content"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="eyebrow"><span>05</span> Start a good thing</p>
          <h2 id="contact-title">Have a sharp idea?<br /><em>Let&apos;s give it momentum.</em></h2>
          <p>I&apos;m open to product collaborations, digital experiences and work where the details need to carry real weight.</p>
          <div className="contact__actions">
            <a href="mailto:gonzalobonadeo07@gmail.com" className="button button--solid"><Mail size={17} /> Write an email</a>
            <a href="https://wa.me/5493415850155" target="_blank" rel="noreferrer" className="button button--quiet">WhatsApp <ArrowUpRight size={17} /></a>
            <button type="button" className="button button--quiet" onClick={copyEmail}>
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? "Copied" : "Copy address"}
            </button>
          </div>
        </motion.div>
        <footer className="site-footer">
          <span>© {new Date().getFullYear()} Gonzalo Bonadeo</span>
          <span>Made with focus, not filler.</span>
          <a href="https://github.com/Gxnza48" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
        </footer>
      </section>
    </main>
  );
}
