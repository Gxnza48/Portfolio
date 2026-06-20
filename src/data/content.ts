/**
 * Single source of truth for ALL real portfolio content.
 *
 * This file was authored by extracting the existing site verbatim — bio,
 * projects, skills, links and contact details are preserved exactly. The
 * Star Wars presentation layer (planets, sabers, crawl) only *restyles* this
 * data; it never invents facts about Gonzalo. Edit content here, never in the
 * presentation components.
 */

export type SaberColor = "blue" | "green" | "red" | "purple";

export type PlanetType =
  | "coruscant"
  | "kamino"
  | "naboo"
  | "mustafar"
  | "hoth"
  | "endor";

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  repo?: string;
  image: string;
  tags: string[];
  /** Star Wars planet archetype this project is mapped to. */
  planet: PlanetType;
  /** Saber color used for this project's section divider. */
  saber: SaberColor;
}

export interface SkillGroup {
  /** Original category label, e.g. "/01 Core Frontend". */
  category: string;
  items: { name: string; icon: string }[];
}

export interface PlanetParams {
  /** In-universe planet name (decorative label). */
  label: string;
  /** Primary surface color (hex). */
  surface: string;
  /** Secondary surface / landmass color (hex). */
  surfaceAlt: string;
  /** Rim/atmosphere glow color (hex). */
  atmosphere: string;
  /** Optional emissive color for lava/city-lights (hex). */
  emissive?: string;
  /** Optional cloud layer color (hex). */
  cloud?: string;
  /** Whether to render a ring system. */
  rings?: boolean;
}

/* ------------------------------------------------------------------ */
/* Identity                                                            */
/* ------------------------------------------------------------------ */

export const SITE = {
  name: "Gonzalo Bonadeo",
  firstName: "Gonzalo",
  lastName: "Bonadeo",
  tagline: "Frontend Developer / Web Developer / Creative Builder",
  subtitle:
    "Building sharp web experiences, interactive products, and privacy-focused tools.",
  location: "Rosario, Argentina",
  /** Rotating role labels (preserved from the original typewriter). */
  roles: ["Fullstack Developer", "UX/UI Designer", "Lua Scripter", "Data Science"],
  stats: [
    { value: "4+", label: "Years Exp" },
    { value: "42", label: "Deployments" },
  ],
  email: "gonzalo.bonadeo@email.com",
  github: "https://github.com/Gxnza48",
  /** Social labels shown in the footer (no URLs existed on the original site). */
  socials: ["Twitter", "LinkedIn", "Discord"],
  metaTitle: "Gonzalo Bonadeo | Creative Builder",
  metaDescription:
    "Frontend Developer / Web Developer focusing on sleek web experiences.",
} as const;

/* ------------------------------------------------------------------ */
/* Opening crawl — composed strictly from existing facts              */
/* ------------------------------------------------------------------ */

export const CRAWL = {
  intro: "A long time ago in a galaxy far, far away....",
  episode: "EPISODE IV",
  title: "A NEW PORTFOLIO",
  /** Each string is a crawl paragraph. Built only from facts already on site. */
  paragraphs: [
    "An 18-year-old developer from Rosario, Argentina, GONZALO BONADEO builds high-performance digital environments across the galaxy of the web.",
    "His work spans web applications, game systems, and security concepts — bridging creative frontend design with complex script architectures.",
    "Specialized in Next.js ecosystems, elegant motion design, and secure logic loops, he expects nothing less than absolute digital quality. Scroll on to engage the hyperdrive....",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Biography (VERBATIM — do not rewrite)                              */
/* ------------------------------------------------------------------ */

export const ABOUT = {
  welcome: "Bienvenido",
  heading: ["Driven by", "Technical", "Precision."],
  /** Exact bio paragraphs from the original site. */
  bio: [
    "18-year-old developer based in Rosario, Argentina. I build high-performance digital environments with a focus on web applications, game systems, and security concepts.",
    "Bridging the gap between creative frontend design and complex script architectures. Specialized in Next.js ecosystems, elegant motion design, and secure logic loops. Expect nothing less than absolute digital quality.",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Skills / tech stack (devicon classes preserved)                    */
/* ------------------------------------------------------------------ */

export const SKILLS: SkillGroup[] = [
  {
    category: "/01 Core Frontend",
    items: [
      { name: "JavaScript", icon: "devicon-javascript-plain" },
      { name: "TypeScript", icon: "devicon-typescript-plain" },
      { name: "React", icon: "devicon-react-original" },
      { name: "Next.js", icon: "devicon-nextjs-plain" },
      { name: "Tailwind", icon: "devicon-tailwindcss-original" },
    ],
  },
  {
    category: "/02 Backend & Scripts",
    items: [
      { name: "Lua", icon: "devicon-lua-plain" },
      { name: "Node.js", icon: "devicon-nodejs-plain" },
      { name: "Python", icon: "devicon-python-plain" },
      { name: "C#", icon: "devicon-csharp-plain" },
    ],
  },
  {
    category: "/03 Infrastructure",
    items: [
      { name: "Git", icon: "devicon-git-plain" },
      { name: "MongoDB", icon: "devicon-mongodb-plain" },
      { name: "Vercel", icon: "devicon-vercel-original" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Projects (content verbatim; image casing fixed to real files)      */
/* ------------------------------------------------------------------ */

export const PROJECTS: Project[] = [
  {
    id: "bulletshop",
    title: "BulletShop",
    description:
      "Advanced modular store for gaming ecosystems with multi-gateway integration.",
    link: "https://bulletbull.shop/",
    repo: "https://github.com/Gxnza48",
    image: "/projects/Bulletbull.png",
    tags: ["React.js", "Stripe"],
    planet: "coruscant",
    saber: "blue",
  },
  {
    id: "rox",
    title: "Rox",
    description:
      "Data science analysis repo & learning products built for digital learners.",
    link: "https://r0xx.vercel.app/",
    repo: "https://github.com/Gxnza48",
    image: "/projects/Rox.png",
    tags: ["Python", "Data Science"],
    planet: "kamino",
    saber: "green",
  },
  {
    id: "facundo",
    title: "Facundo Diaz Portfolio",
    description:
      "High-end editorial portfolio design for cinematic visual directors.",
    link: "https://facundodiazportfolio.onrender.com/",
    repo: "https://github.com/Gxnza48/FacundoDiazPortfolio",
    image: "/projects/Facundo.png",
    tags: ["React", "Animations", "UI"],
    planet: "naboo",
    saber: "purple",
  },
  {
    id: "kanki",
    title: "Kanki Barber Shop",
    description: "Modern booking experience for a sleek barber shop brand.",
    link: "https://kanki.vercel.app/",
    repo: "https://github.com/Gxnza48/Kanki-Barber-Shop",
    image: "/projects/Kanki.png",
    tags: ["React", "UI/UX"],
    planet: "mustafar",
    saber: "red",
  },
  {
    id: "hawl",
    title: "Hawl Tweaks",
    description: "Performance optimization and system tweaking dashboard.",
    link: "https://hawl.vercel.app/",
    repo: "https://github.com/Gxnza48/Hawl-Tweaks",
    image: "/projects/Hawl.png",
    tags: ["React", "Performance"],
    planet: "hoth",
    saber: "blue",
  },
  {
    id: "rapix",
    title: "Rapix",
    description:
      "Dynamic web application with a modern component-driven architecture.",
    link: "https://rapix.netlify.app/",
    repo: "https://github.com/Gxnza48/Rapix",
    image: "/projects/Rapix.png",
    tags: ["Web App", "UI"],
    planet: "endor",
    saber: "green",
  },
];

/* ------------------------------------------------------------------ */
/* Planet archetype palettes (authentic atmospheres/colors)           */
/* ------------------------------------------------------------------ */

export const PLANETS: Record<PlanetType, PlanetParams> = {
  // City-planet — endless metropolis, warm window lights at night.
  coruscant: {
    label: "Coruscant",
    surface: "#5a5f73",
    surfaceAlt: "#2c2f3d",
    atmosphere: "#ffcf8a",
    emissive: "#ffb347",
    cloud: "#9aa3bf",
  },
  // Ocean world of endless storms and rain.
  kamino: {
    label: "Kamino",
    surface: "#2b5a78",
    surfaceAlt: "#15324a",
    atmosphere: "#9fe3ff",
    cloud: "#dff4ff",
  },
  // Lush green world of lakes and rolling hills.
  naboo: {
    label: "Naboo",
    surface: "#4a7a3a",
    surfaceAlt: "#2f5d6e",
    atmosphere: "#bdf0c4",
    cloud: "#f3f7e8",
  },
  // Volcanic hellscape of lava rivers.
  mustafar: {
    label: "Mustafar",
    surface: "#3a1410",
    surfaceAlt: "#1a0a08",
    atmosphere: "#ff5a2a",
    emissive: "#ff3b15",
  },
  // Frozen ice planet, blinding white wastes.
  hoth: {
    label: "Hoth",
    surface: "#dfeaf2",
    surfaceAlt: "#a9c6dd",
    atmosphere: "#cfe9ff",
    cloud: "#ffffff",
  },
  // Forest moon, deep greens beneath a soft canopy.
  endor: {
    label: "Endor",
    surface: "#39612f",
    surfaceAlt: "#23401d",
    atmosphere: "#a9e08a",
    cloud: "#d8e8c4",
  },
};

/* ------------------------------------------------------------------ */
/* Contact / epic ending                                              */
/* ------------------------------------------------------------------ */

export const CONTACT = {
  kicker: "END OF ARCHIVE",
  heading: ["Let's build", "something sharp."],
  body: "Currently available for freelance projects and full-time opportunities. Hit me up if you want to collaborate.",
  primaryCta: { label: "Send an Email", href: `mailto:gonzalo.bonadeo@email.com` },
  secondaryCta: { label: "Review Code", href: "https://github.com/Gxnza48" },
  footer: "Gonzalo Bonadeo. System Halted.",
} as const;

/* ------------------------------------------------------------------ */
/* Hero CTAs                                                           */
/* ------------------------------------------------------------------ */

export const HERO = {
  status: "[ SYSTEM STATUS: ONLINE ]",
  scrollCue: "scroll to engage hyperdrive",
  primaryCta: { label: "INITIATE_CONTACT", href: "#contact" },
  secondaryCta: { label: "View Archive", href: "#archive" },
} as const;
