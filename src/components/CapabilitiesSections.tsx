"use client";

import { useRef, useState, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronDown, Code2, FileText, Film, Gamepad2, Image as ImageIcon, Network, Sparkles } from "lucide-react";
import { disciplines, technologies, technologySource, type Discipline, type Locale, type Technology } from "./capabilities-data";

function TechIcon({ technology }: { technology: Technology }) {
  return technology.icon
    ? <i className={`devicon-${technology.icon}`} aria-hidden="true" />
    : <span className="tech-monogram" aria-hidden="true">{technology.monogram}</span>;
}

const signature = ["React", "TypeScript", "Next.js", "Python", "Rust", "Supabase", "Three.js", "GSAP", "PostgreSQL / Neon", "Tauri", "Gemini API", "Git"];

export function TechnologyDna({ language }: { language: Locale }) {
  const es = language === "es";
  const [filter, setFilter] = useState<Discipline | "all">("all");
  const [selected, setSelected] = useState("React");
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const rotateY = useTransform(scrollYProgress, [0, 1], [-14, 14]);
  const y = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const filtered = technologies.filter(item => filter === "all" || item.group === filter);
  const nodes = filter === "all" ? signature.map(name => technologies.find(item => item.name === name)!) : filtered.slice(0, 12);
  const active = technologies.find(item => item.name === selected)!;
  const discipline = disciplines.find(item => item.id === active.group)!;
  const rows = Math.ceil(nodes.length / 2);
  const position = (row: number, side: number) => ({ x: 300 + Math.cos(row * Math.PI / 3) * 185 * side, y: 65 + row * (410 / Math.max(1, rows - 1)) });
  const strand = (side: number) => Array.from({ length: 101 }, (_, index) => {
    const row = (index / 100) * (rows - 1);
    const point = position(row, side);
    return `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`;
  }).join(" ");

  return <section id="technologies" ref={section} className="tech-section section-shell" aria-labelledby="tech-title">
    <div className="capability-heading">
      <p className="eyebrow"><span>03</span> {es ? "Qué tecnologías trabajo" : "Technologies I work with"}</p>
      <h2 id="tech-title">{es ? "Mi ADN" : "My digital"}<br /><em>{es ? "digital." : "DNA."}</em></h2>
      <p>{es ? "Cada tecnología es una pieza. Lo interesante pasa cuando las conecto." : "Every technology is a building block. The interesting part is how I connect them."}</p>
    </div>

    <div className="dna-workbench">
      <div className="dna-controls">
        <span className="capability-kicker">{es ? "Explorá las conexiones" : "Explore the connections"}</span>
        <div className="dna-filters" role="group" aria-label={es ? "Filtrar tecnologías" : "Filter technologies"}>
          <button type="button" aria-pressed={filter === "all"} onClick={() => { setFilter("all"); setSelected("React"); }}><span>00</span>{es ? "Vista completa" : "Full picture"}<ArrowUpRight size={15} /></button>
          {disciplines.map((item, index) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => { setFilter(item.id); setSelected(technologies.find(tech => tech.group === item.id)!.name); }}><span>0{index + 1}</span>{item[language]}<ArrowUpRight size={15} /></button>)}
        </div>
        <p className="dna-footnote">{es ? "Tocá un símbolo. Descubrí dónde lo uso." : "Select a symbol. See where I use it."}</p>
      </div>

      <div className="dna-viewport">
        <span className="dna-coordinate dna-coordinate--top">GB / {es ? "SECUENCIA DIGITAL" : "STACK SEQUENCE"}</span>
        <motion.div className="dna-molecule" style={reduced ? undefined : { rotateY, y }}>
          <svg viewBox="0 0 600 540" preserveAspectRatio="none" className="dna-strands" aria-hidden="true">
            <defs><linearGradient id="dna-strand-gradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffbc88" /><stop offset=".5" stopColor="#ff812e" /><stop offset="1" stopColor="#7a3c1e" /></linearGradient></defs>
            {Array.from({ length: 28 }, (_, i) => {
              const row = i / 27 * (rows - 1); const a = position(row, -1); const b = position(row, 1);
              return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="dna-rung" />;
            })}
            <path d={strand(-1)} className="dna-strand dna-strand--back" /><path d={strand(1)} className="dna-strand" />
          </svg>
          {nodes.map((technology, index) => {
            const point = position(Math.floor(index / 2), index % 2 ? 1 : -1);
            return <button type="button" key={technology.name} className={`dna-node ${selected === technology.name ? "is-selected" : ""}`} style={{ left: `${point.x / 6}%`, top: `${point.y / 5.4}%`, "--tech-color": technology.color } as CSSProperties} onClick={() => setSelected(technology.name)} aria-pressed={selected === technology.name}>
              <span className="dna-node__disc"><TechIcon technology={technology} /></span><span className="dna-node__label">{technology.name}</span>
            </button>;
          })}
        </motion.div>
        <span className="dna-coordinate dna-coordinate--bottom">{String(technologies.length).padStart(2, "0")} {es ? "TECNOLOGÍAS · UN MISMO ADN" : "TECHNOLOGIES · ONE DNA"}</span>
      </div>

      <aside className="dna-inspector" aria-live="polite" aria-atomic="true">
        <span className="capability-kicker">{es ? "Conexión seleccionada" : "Selected connection"}</span>
        <div className="dna-inspector__icon" style={{ "--tech-color": active.color } as CSSProperties}><TechIcon technology={active} /></div>
        <span className="dna-inspector__category">{discipline[language]}</span>
        <h3>{active.name}</h3>
        <p>{discipline.description[language]}</p>
        <a href={technologySource(active)} target="_blank" rel="noreferrer"><span>{es ? "Ver en GitHub" : "View on GitHub"}<strong>{active.repo === "Gxnza48" ? (es ? "Mi perfil" : "My profile") : active.repo}</strong></span><ArrowUpRight size={21} /></a>
      </aside>
    </div>

    <details className="tech-catalog" key={filter}>
      <summary><span>{es ? "Abrir el mapa completo" : "Open the full map"}<small>{filtered.length} {es ? "tecnologías" : "technologies"}</small></span><ChevronDown size={19} /></summary>
      <div className="tech-catalog__grid">{filtered.map(technology => <a key={technology.name} href={technologySource(technology)} target="_blank" rel="noreferrer" style={{ "--tech-color": technology.color } as CSSProperties}><TechIcon technology={technology} /><span>{technology.name}</span><ArrowUpRight size={12} /></a>)}</div>
    </details>
  </section>;
}

const outputs = [
  { id: "images", icon: ImageIcon, es: "Imágenes", en: "Images", title: { es: "De una visión a un universo visual.", en: "From a vision to a visual universe." }, body: { es: "Dirección de arte, referencias, composición y edición con IA para crear imágenes con una identidad propia.", en: "Art direction, references, composition and AI editing to create images with a distinct identity." }, tags: { es: ["Concepto", "Composición", "Estilo"], en: ["Concept", "Composition", "Style"] } },
  { id: "video", icon: Film, es: "Videos", en: "Video", title: { es: "Ideas que toman movimiento.", en: "Ideas that come to life." }, body: { es: "Desarrollo conceptos, secuencias y piezas audiovisuales con IA, cuidando la continuidad visual, el ritmo y la intención.", en: "I develop concepts, sequences and AI-assisted videos with attention to visual continuity, pacing and intent." }, tags: { es: ["Guion", "Escenas", "Movimiento"], en: ["Script", "Scenes", "Motion"] } },
  { id: "games", icon: Gamepad2, es: "Juegos", en: "Games", title: { es: "De «¿y si…?» a algo que podés jugar.", en: "From “what if?” to something you can play." }, body: { es: "Combino IA y código para explorar mecánicas, crear recursos y desarrollar experiencias interactivas.", en: "I combine AI and code to explore mechanics, create assets and develop interactive experiences." }, tags: { es: ["Mecánicas", "Recursos", "Interacción"], en: ["Mechanics", "Assets", "Interaction"] } },
  { id: "apps", icon: Code2, es: "Aplicaciones", en: "Applications", title: { es: "Una idea que se convierte en producto.", en: "An idea that becomes a product." }, body: { es: "Uso agentes y modelos para acelerar diseño y desarrollo. Defino la arquitectura, integro los sistemas y reviso el código y la experiencia.", en: "I use agents and models to accelerate design and development, define architecture, connect systems and review the code and experience." }, tags: { es: ["Arquitectura", "Agentes", "Validación"], en: ["Architecture", "Agents", "Validation"] } },
  { id: "documents", icon: FileText, es: "Documentos", en: "Documents", title: { es: "Información que se vuelve acción.", en: "Information that becomes action." }, body: { es: "Transformo documentos y requisitos en propuestas, especificaciones y hojas de ruta estructuradas. PDFjedi es una muestra de ese proceso.", en: "I turn documents and requirements into structured proposals, specifications and roadmaps. PDFjedi is an example of this process." }, tags: { es: ["Análisis", "Estructura", "Entrega"], en: ["Analysis", "Structure", "Delivery"] } },
  { id: "workflows", icon: Network, es: "Automatización", en: "Automation", title: { es: "Un buen proceso, multiplicado.", en: "A good process, multiplied." }, body: { es: "Diseño flujos que conectan contexto, herramientas y modelos. Prompts reutilizables, skills y APIs que llevan la IA al trabajo cotidiano.", en: "I design workflows that connect context, tools and models: reusable prompts, skills and APIs that bring AI into everyday work." }, tags: { es: ["Contexto", "APIs", "Flujos"], en: ["Context", "APIs", "Workflows"] } },
] as const;

export function AiStudio({ language }: { language: Locale }) {
  const es = language === "es";
  const [selected, setSelected] = useState(0);
  const section = useRef<HTMLElement>(null);
  const inView = useInView(section, { margin: "100px" });
  const output = outputs[selected];
  return <section id="ai" ref={section} data-in-view={inView} className="ai-section section-shell" aria-labelledby="ai-title">
    <div className="ai-intro">
      <p className="eyebrow"><span>04</span> {es ? "Especialista en IA aplicada" : "Applied AI specialist"}</p>
      <h2 id="ai-title">{es ? "Imaginación humana." : "Human imagination."}<br /><em>{es ? "Potencial aumentado." : "Amplified potential."}</em></h2>
      <div className="ai-intro__bottom"><span className="ai-signature"><Sparkles size={18} /> {es ? "Idea × criterio × IA" : "Idea × judgment × AI"}</span><p>{es ? "Entiendo cómo funcionan las herramientas de IA, sus posibilidades y sus límites. Las combino con criterio creativo y técnico para convertir ideas en imágenes, videos, juegos, aplicaciones y documentos." : "I understand how AI tools work, their possibilities and their limits. I combine them with creative and technical judgment to turn ideas into images, videos, games, applications and documents."}</p></div>
    </div>
    <div className="ai-studio">
      <div className="ai-studio__toolbar"><span><i /> {es ? "Estudio de posibilidades" : "Possibility studio"}</span><span>01 — 06</span></div>
      <div className="ai-output-tabs" role="group" aria-label={es ? "Explorar capacidades de IA" : "Explore AI capabilities"}>
        {outputs.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><item.icon size={18} /><span>{item[language]}</span></button>)}
      </div>
      <div className="ai-studio__body">
        <div className={`ai-art ai-art--${output.id}`} aria-hidden="true">
          <div className="ai-art__grid" /><div className="ai-art__halo" />
          <span className="ai-art__coordinate">GB / {es ? "INTELIGENCIA CREATIVA" : "CREATIVE INTELLIGENCE"}</span>
          <div className="ai-art__composition" key={output.id}>
            <div className="ai-art__orbit ai-art__orbit--one" /><div className="ai-art__orbit ai-art__orbit--two" />
            <div className="ai-art__core"><span /><span /><span /><span /><span /><span /></div>
            <div className="ai-art__frame ai-art__frame--one"><span /><span /><span /></div>
            <div className="ai-art__frame ai-art__frame--two"><span /><span /><span /></div>
            <div className="ai-art__frame ai-art__frame--three"><span /><span /><span /></div>
            <div className="ai-art__satellite ai-art__satellite--one"><output.icon size={23} /></div>
            <div className="ai-art__satellite ai-art__satellite--two"><Sparkles size={20} /></div>
          </div>
          <div className="ai-art__caption"><span>{String(selected + 1).padStart(2, "0")}</span><strong>{output[language]}</strong><span>↗</span></div>
        </div>
        <div className="ai-output" aria-live="polite" aria-atomic="true">
          <span className="capability-kicker">{es ? "Lo que puedo crear" : "What I can create"}</span>
          <h3>{output.title[language]}</h3><p>{output.body[language]}</p>
          <div className="ai-output__tags">{output.tags[language].map(tag => <span key={tag}>{tag}</span>)}</div>
          <a href="#contact" className="text-link">{es ? "Hagamos realidad tu idea" : "Let's bring your idea to life"}<ArrowUpRight size={18} /></a>
        </div>
      </div>
      <div className="ai-process">{(es ? ["Entender la idea", "Dar contexto", "Crear e iterar", "Revisar y entregar"] : ["Understand the idea", "Set the context", "Create and iterate", "Review and deliver"]).map((step, index) => <span key={step}><small>0{index + 1}</small>{step}<ArrowUpRight size={14} /></span>)}</div>
    </div>
    <div className="ai-evidence"><span>{es ? "IA en mis proyectos" : "AI in my projects"}</span><a href="https://github.com/Gxnza48/PDFjedi" target="_blank" rel="noreferrer">PDFjedi <small>Claude · Skills</small><ArrowUpRight size={14} /></a><a href="https://github.com/Gxnza48/UCAHUB" target="_blank" rel="noreferrer">UCAHUB <small>OpenAI SDK</small><ArrowUpRight size={14} /></a><a href="https://github.com/Gxnza48/Rand0m" target="_blank" rel="noreferrer">Rand0m <small>Gemini API</small><ArrowUpRight size={14} /></a></div>
  </section>;
}
