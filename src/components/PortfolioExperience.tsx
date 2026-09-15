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
  MoveRight,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import type { CSSProperties } from "react";
import { AiStudio, TechnologyDna } from "./CapabilitiesSections";

type VisualKind = "chain" | "arena" | "archive" | "document" | "chat" | "velocity" | "note" | "network";
type Language = "es" | "en";
type Theme = "night" | "day";

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
  { href: "#work", label: { es: "Proyectos", en: "Work" } },
  { href: "#technologies", label: { es: "ADN", en: "DNA" } },
  { href: "#ai", label: { es: "IA", en: "AI" } },
  { href: "#contact", label: { es: "Contacto", en: "Contact" } },
];

const mobileNavItems = [
  ...navItems.slice(0, 3),
  { href: "#approach", label: { es: "Cómo trabajo", en: "Approach" } },
  { href: "#lab", label: { es: "Otros proyectos", en: "More projects" } },
  navItems[3],
];

const ui = {
  es: {
    available: "Disponible para proyectos seleccionados", location: "Desarrollador digital independiente · Rosario, Argentina",
    heroStatement: "Diseño y desarrollo productos digitales con intención: sistemas útiles, interfaces memorables y movimiento que tiene un propósito.",
    explore: "Ver proyectos", github: "Explorar GitHub", role: "Desarrollador y creador digital", based: "Desde Rosario, Argentina",
    scroll: "Deslizá para explorar", skip: "Saltar a proyectos", caseLabel: "Casos seleccionados",
    workTitle: "Proyectos destacados", workDesc: "Seis proyectos que muestran variedad sin perder el hilo: criterio de producto, profundidad técnica e intuición visual.",
    projectLabel: "Recorré los proyectos", projectHint: "Seguí bajando para descubrir cada proyecto o elegí uno para ir directamente.",
    live: "Producto en línea", source: "Código fuente", liveLink: "Ver proyecto", sourceLink: "Ver código",
    approachLabel: "Cómo trabajo", approachTitleA: "El diseño se siente.", approachTitleB: "La ingeniería lo demuestra.",
    approach1Title: "Primero, el producto", approach1: "Cada interfaz parte de una experiencia que vale la pena mejorar; después construyo un sistema visual que la vuelve intuitiva.",
    approach2Title: "Movimiento con intención", approach2: "Las animaciones guían la atención, explican los cambios y le dan ritmo al producto.",
    approach3Title: "Hechos antes que promesas", approach3: "Sistemas en tiempo real, accesibilidad, pruebas y decisiones cuidadas hablan por sí solos.",
    labLabel: "Experimentos seleccionados", labTitle: "Otros proyectos, el mismo cuidado", labDesc: "Herramientas de escritorio, comunidades y dirección visual; otros proyectos del archivo que también vale la pena conocer.",
    keepScroll: "Seguí bajando para explorar", contactLabel: "Empecemos algo bueno", contactTitleA: "¿Tenés una idea interesante?", contactTitleB: "Démosle impulso.",
    contactDesc: "Estoy abierto a colaborar en productos digitales, experiencias web y proyectos donde los detalles importen.",
    email: "Escribime", whatsapp: "WhatsApp", copy: "Copiar correo", copied: "Copiado", footer: "Hecho con intención, sin relleno.",
    languageLabel: "Idioma", themeDay: "Cambiar a modo día", themeNight: "Cambiar a modo noche", modeDay: "Día", modeNight: "Noche",
  },
  en: {
    available: "Available for selected work", location: "Independent digital builder · Rosario, Argentina",
    heroStatement: "I design and build digital products with a clear pulse: useful systems, memorable interfaces, and motion that earns its place.",
    explore: "Explore selected work", github: "Explore GitHub", role: "Developer & creative builder", based: "Based in Rosario, Argentina",
    scroll: "Scroll to explore", skip: "Skip to projects", caseLabel: "Selected case studies",
    workTitle: "Selected work", workDesc: "Six projects that show range without losing the thread: product thinking, technical depth and visual instinct.",
    projectLabel: "Scroll through the index", projectHint: "Keep scrolling to discover each build, or choose a project to jump ahead.",
    live: "Live product", source: "Source code", liveLink: "Visit live build", sourceLink: "Inspect source",
    approachLabel: "How I work", approachTitleA: "Design should be felt.", approachTitleB: "Engineering should prove it.",
    approach1Title: "Product before pixels", approach1: "Each interface starts from a behavior worth improving, then gets a visual system that makes that behavior obvious.",
    approach2Title: "Motion with a job", approach2: "Animation guides attention, explains change and gives a product tempo.",
    approach3Title: "Signals over claims", approach3: "Real-time systems, accessibility, testing and thoughtful constraints say more than inflated metrics.",
    labLabel: "Selected experiments", labTitle: "Side projects, serious craft", labDesc: "Desktop tools, student networks and visual direction — the rest of the archive, intentionally kept in view.",
    keepScroll: "Keep scrolling to explore", contactLabel: "Start a good thing", contactTitleA: "Have a sharp idea?", contactTitleB: "Let's give it momentum.",
    contactDesc: "I'm open to product collaborations, digital experiences and work where the details need to carry real weight.",
    email: "Send an email", whatsapp: "WhatsApp", copy: "Copy email", copied: "Copied", footer: "Made with focus, not filler.",
    languageLabel: "Language", themeDay: "Switch to day mode", themeNight: "Switch to night mode", modeDay: "Day", modeNight: "Night",
  },
} satisfies Record<Language, Record<string, string>>;

const projectCopy: Record<Language, Record<string, Partial<Project>>> = {
  es: {
    chainwork: { kind: "Espacio de trabajo colaborativo", status: "Producto en línea", description: "Un espacio de trabajo en tiempo real para transformar ideas en avances compartidos y visibles.", detail: "Presencia, hojas de ruta, planificación con drag and drop, votaciones y archivos adjuntos: un sistema de producto completo, no un tablero estático.", signal: "Tiempo real / PWA" },
    "major-scrims": { kind: "Plataforma competitiva de gaming", status: "Producto en línea", description: "El espacio competitivo para scrims y partidas personalizadas de Fortnite, pensado para una comunidad activa.", detail: "Un ecosistema en Next.js con autenticación, herramientas editoriales y una identidad visual propia de la arena.", signal: "Next.js / MongoDB" },
    ucahub: { kind: "Centro de recursos universitarios", status: "Producto en línea", description: "Un lugar para encontrar, en un solo sitio, los recursos que necesita la comunidad universitaria.", detail: "Combina una experiencia en Next.js con Supabase, lectura de PDF y búsqueda asistida por IA para que la información útil esté al alcance.", signal: "Búsqueda / IA" },
    pdfjedi: { kind: "Sistema de producto con IA", status: "Producto en línea", description: "Un flujo de trabajo con IA que convierte documentos PDF extensos en la base de un producto digital.", detail: "Transforma documentos en especificaciones técnicas, dirección UX/UI, contratos, presupuestos y hojas de ruta; conecta la estrategia con la ejecución.", signal: "PDF → producto" },
    rox: { kind: "Chat anónimo efímero", status: "Producto en línea", description: "Un chat anónimo en tiempo real y sin servidores propios, donde las conversaciones están hechas para desaparecer.", detail: "Una idea simple define toda la experiencia: entrar sin fricción, conversar al instante y no guardar de más.", signal: "Tiempo real / efímero" },
    hawl: { kind: "Herramientas gaming de baja latencia", status: "Producto en línea", description: "Un conjunto de ajustes reversibles para reducir la demora y mejorar el rendimiento en juegos.", detail: "Une una herramienta práctica con experiencias 3D y animaciones inmersivas.", signal: "3D / rendimiento" },
    notita: { kind: "Aplicación de notas de escritorio", status: "Código / escritorio", description: "Una app de notas sencilla y rápida, pensada para usar con el teclado durante las clases." },
    ucanet: { kind: "Comunidad universitaria", status: "En desarrollo", description: "Una comunidad seudónima para UCA Rosario, organizada por materias y años." , signal: "Sistema de producto"},
    facundo: { kind: "Portfolio de animación", status: "Producto en línea", description: "Un portfolio expresivo para un animador 2D y artista de motion graphics.", signal: "Dirección visual" },
    kanki: { kind: "Experiencia de turnos", status: "Producto en línea", description: "Una experiencia simple para reservar turnos y gestionar una barbería.", signal: "Diseño de servicios" },
  },
  en: {},
};

function localizeProject(project: Project, language: Language): Project {
  return { ...project, ...projectCopy[language][project.id] };
}

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
  const [activeSection, setActiveSection] = useState("");
  const [copied, setCopied] = useState(false);
  const [portraitColor, setPortraitColor] = useState(false);
  const [language, setLanguage] = useState<Language>("es");
  const [theme, setTheme] = useState<Theme>("night");
  const [preferencesReady, setPreferencesReady] = useState(false);
  const text = ui[language];
  const prefersReducedMotion = useReducedMotion();
  const workRef = useRef<HTMLElement>(null);
  const labRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = "";
      mobileNavItems.forEach(({ href }) => {
        const section = document.getElementById(href.slice(1));
        if (section && section.getBoundingClientRect().top <= window.innerHeight * .35) current = href;
      });
      setActiveSection(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const media = window.matchMedia("(min-width: 900px)");
    const closeOnDesktop = () => { if (media.matches) setMenuOpen(false); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", closeOnDesktop);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  useEffect(() => {
    const restorePreferences = window.setTimeout(() => {
      try {
        const storedLanguage = window.localStorage.getItem("portfolio-language");
        const storedTheme = window.localStorage.getItem("portfolio-theme");
        if (storedLanguage === "es" || storedLanguage === "en") setLanguage(storedLanguage);
        if (storedTheme === "night" || storedTheme === "day") setTheme(storedTheme);
      } catch {
        // Keep the Spanish/night defaults when storage is unavailable.
      }
      setPreferencesReady(true);
    }, 0);
    return () => window.clearTimeout(restorePreferences);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "es" ? "es-AR" : "en";
    document.documentElement.dataset.theme = theme;
    if (!preferencesReady) return;
    try {
      window.localStorage.setItem("portfolio-language", language);
      window.localStorage.setItem("portfolio-theme", theme);
    } catch {
      // Theme and language still work for the current page session.
    }
  }, [language, theme, preferencesReady]);

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
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const handleOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest(".site-nav")) setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    if (menuOpen) window.addEventListener("pointerdown", handleOutsidePress);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handleOutsidePress);
    };
  }, [menuOpen]);

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
      <a className="skip-link" href="#work">{text.skip}</a>
      <div className="site-shell__atmosphere" aria-hidden="true" />
      <div className="site-shell__grid" aria-hidden="true" />

      <header className={`site-nav nav-design ${menuOpen ? "nav-design--open" : ""}`}>
        <a href="#top" className="site-nav__mark" onClick={() => setMenuOpen(false)} aria-label={language === "es" ? "Volver al inicio" : "Back to top"}>
          <b className="nav-monogram">g<span>.</span>b</b>
          <span className="nav-signature">Gonzalo<br />Bonadeo</span>
        </a>
        <nav className="site-nav__links" aria-label={language === "es" ? "Navegación principal" : "Primary navigation"}>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} aria-current={activeSection === item.href ? "location" : undefined}>
              {item.label[language]}
              {item.href === "#contact" && <ArrowUpRight size={14} />}
            </a>
          ))}
        </nav>
        <div className="site-nav__tools">
          <button type="button" className="site-nav__tool locale-toggle" onClick={() => setLanguage(value => value === "es" ? "en" : "es")} aria-label={`${text.languageLabel}: ${language === "es" ? "English" : "Español"}`} title={`${text.languageLabel}: ${language === "es" ? "English" : "Español"}`}>
            <span className="locale-toggle__flag" role="img" aria-label={language === "es" ? "Argentina" : "United States"} style={{ backgroundImage: `url(https://flagsapi.com/${language === "es" ? "AR" : "US"}/flat/64.png)` }} />
            <span>{language === "es" ? "ES" : "EN"}</span>
          </button>
          <button type="button" className="site-nav__tool theme-toggle" onClick={() => setTheme(value => value === "night" ? "day" : "night")} aria-label={theme === "night" ? text.themeDay : text.themeNight} title={theme === "night" ? text.themeDay : text.themeNight}>
            {theme === "night" ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === "night" ? text.modeNight : text.modeDay}</span>
          </button>
        </div>
        <button
          type="button"
          className="site-nav__menu-button"
          ref={menuButtonRef}
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="sr-only">{language === "es" ? (menuOpen ? "Cerrar navegación" : "Abrir navegación") : (menuOpen ? "Close navigation" : "Open navigation")}</span>
          <span className="nav-menu-glyph" aria-hidden="true"><i /><i /></span>
        </button>
        <nav id="mobile-navigation" inert={!menuOpen} className={`mobile-navigation ${menuOpen ? "is-open" : ""}`} aria-label={language === "es" ? "Navegación móvil" : "Mobile navigation"}>
          <div className="nav-panel-heading"><span>{language === "es" ? "Explorá el portfolio" : "Explore the portfolio"}</span><span>01 — 06</span></div>
          {mobileNavItems.map((item, index) => (
            <a key={item.href} href={item.href} aria-current={activeSection === item.href ? "location" : undefined} onClick={() => setMenuOpen(false)}>
              <span className="nav-item-number">0{index + 1}</span>
              <span className="nav-item-label">{item.label[language]}</span>
              <ArrowUpRight size={18} />
            </a>
          ))}
          <div className="nav-panel-footer"><span className="nav-status" />{text.available}<span>ARG ↗</span></div>
        </nav>
      </header>

      <section className="hero section-shell" aria-labelledby="hero-title">
        <motion.div
          className="hero__intro"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow"><span>01</span> {text.location}</p>
          <h1 id="hero-title" className="hero__title">
            Gonzalo <span>Bonadeo</span>
          </h1>
          <p className="hero__statement">
            {text.heroStatement}
          </p>
          <div className="hero__actions">
            <a href="#work" className="button button--solid">
              {text.explore} <MoveRight size={18} />
            </a>
            <a href="https://github.com/Gxnza48" target="_blank" rel="noreferrer" className="button button--quiet">
              <Github size={17} /> {text.github}
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero__object hero__portrait"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="portrait__image-wrap">
          <span className="portrait__orbit" aria-hidden="true" />
          <button type="button" className={`portrait__frame ${portraitColor ? "is-color" : ""}`} onClick={() => setPortraitColor(value => !value)} aria-pressed={portraitColor} aria-label={language === "es" ? "Alternar color de la foto" : "Toggle portrait color"}>
            <Image src="/gonzalo-portrait.png" alt={language === "es" ? "Retrato de Gonzalo Bonadeo" : "Portrait of Gonzalo Bonadeo"} width={304} height={365} loading="eager" fetchPriority="high" className="portrait__image" />
            <span className="portrait__shade" aria-hidden="true" />
          </button>
          </div>
          <div className="portrait__identity">
            <p className="portrait__name">Gonzalo Bonadeo</p>
            <p className="portrait__role">{text.role}</p>
            <span className="portrait__label">{text.based}</span>
            <span className="portrait__hint">{portraitColor ? (language === "es" ? "Color activado" : "Color on") : (language === "es" ? "Tocá la foto para ver el color" : "Tap the photo to reveal color")} <ArrowUpRight size={13} /></span>
          </div>
        </motion.div>

        <motion.a
          href="#work"
          className="hero__scroll"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span>{text.scroll}</span>
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
          <p className="eyebrow"><span>02</span> {text.caseLabel}</p>
          <h2 id="work-title">{text.workTitle}<span>.</span></h2>
          <p>{text.workDesc}</p>
        </motion.div>

        <div className="project-index">
          <div className="project-index__rail" aria-label={language === "es" ? "Elegí un proyecto destacado" : "Select a featured project"}>
            <p className="project-index__label">{text.projectLabel}</p>
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
            <p className="project-index__hint">{text.projectHint}</p>
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
                <ProjectVisual project={localizeProject(selectedProject, language)} />
                <div className="project-stage__content">
                  <div className="project-stage__meta">
                    <span className="status-dot">{localizeProject(selectedProject, language).status}</span>
                    <span>{localizeProject(selectedProject, language).kind}</span>
                  </div>
                  <div className="project-stage__title-row">
                    <h3>{selectedProject.title}</h3>
                    <span className="project-stage__index">/{selectedProject.index}</span>
                  </div>
                  <p className="project-stage__lead">{localizeProject(selectedProject, language).description}</p>
                  <p className="project-stage__detail">{localizeProject(selectedProject, language).detail}</p>
                  <div className="tag-list">
                    {selectedProject.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="project-stage__actions">
                    {selectedProject.live && (
                      <a className="text-link" href={selectedProject.live} target="_blank" rel="noreferrer">
                        {text.liveLink} <ExternalLink size={16} />
                      </a>
                    )}
                    <a className="text-link text-link--muted" href={selectedProject.repo} target="_blank" rel="noreferrer">
                      {text.sourceLink} <Github size={16} />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
        </div>
      </section>

      <TechnologyDna language={language} />
      <AiStudio language={language} />

      <section id="approach" className="approach section-shell" aria-labelledby="approach-title">
        <motion.div
          className="approach__statement"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <p className="eyebrow"><span>05</span> {text.approachLabel}</p>
          <h2 id="approach-title">{text.approachTitleA}<br /><em>{text.approachTitleB}</em></h2>
        </motion.div>
        <div className="approach__grid">
          <article>
            <span>01</span>
            <h3>{text.approach1Title}</h3>
            <p>{text.approach1}</p>
          </article>
          <article>
            <span>02</span>
            <h3>{text.approach2Title}</h3>
            <p>{text.approach2}</p>
          </article>
          <article>
            <span>03</span>
            <h3>{text.approach3Title}</h3>
            <p>{text.approach3}</p>
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
          <p className="eyebrow"><span>06</span> {text.labLabel}</p>
          <h2 id="lab-title">{text.labTitle}<span>.</span></h2>
          <p>{text.labDesc}</p>
        </motion.div>

        <div className="experiment-grid">
          {experiments.map((project, index) => {
            const localizedProject = localizeProject(project, language);
            return (
            <motion.article
              className="experiment-card"
              key={project.id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: prefersReducedMotion ? 0 : index * 0.07 }}
              style={{ "--project-accent": project.accent, "--project-soft-accent": project.softAccent } as CSSProperties}
            >
              <ProjectVisual project={localizedProject} compact />
              <div className="experiment-card__body">
                <div className="experiment-card__meta"><span>{project.index}</span><span>{localizedProject.status}</span></div>
                <h3>{project.title}</h3>
                <p>{localizedProject.description}</p>
                <div className="tag-list tag-list--small">
                  {project.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <div className="experiment-card__links">
                  <a href={project.repo} target="_blank" rel="noreferrer">{text.source} <Github size={15} /></a>
                  {project.live && <a href={project.live} target="_blank" rel="noreferrer">{text.liveLink} <ArrowUpRight size={15} /></a>}
                </div>
              </div>
            </motion.article>
            );
          })}
        </div>
        <p className="lab__direction">{text.keepScroll} <MoveRight size={18} /></p>
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
          <p className="eyebrow"><span>07</span> {text.contactLabel}</p>
          <h2 id="contact-title">{text.contactTitleA}<br /><em>{text.contactTitleB}</em></h2>
          <p>{text.contactDesc}</p>
          <div className="contact__actions">
            <a href="mailto:gonzalobonadeo07@gmail.com" className="button button--solid"><Mail size={17} /> {text.email}</a>
            <a href="https://wa.me/5493415850155" target="_blank" rel="noreferrer" className="button button--quiet">WhatsApp <ArrowUpRight size={17} /></a>
            <button type="button" className="button button--quiet" onClick={copyEmail}>
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? text.copied : text.copy}
            </button>
          </div>
        </motion.div>
        <footer className="site-footer">
          <span>© {new Date().getFullYear()} Gonzalo Bonadeo</span>
          <span>{text.footer}</span>
          <a href="https://github.com/Gxnza48" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
        </footer>
      </section>
    </main>
  );
}
