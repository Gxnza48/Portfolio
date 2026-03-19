"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import anime from "animejs";

const projects = [
  {
    title: "BulletShop",
    description: "Advanced modular store for gaming ecosystems with multi-gateway integration.",
    link: "https://bulletbull.shop/",
    repo: "https://github.com/Gxnza48",
    tags: ["React.js", "Stripe"]
  },
  {
    title: "Rox",
    description: "Data science analysis repo & learning products built for digital learners.",
    link: "https://r0xx.vercel.app/",
    repo: "https://github.com/Gxnza48",
    tags: ["Python", "Data Science"]
  },
  {
    title: "Facundo Diaz Portfolio",
    description: "High-end editorial portfolio design for cinematic visual directors.",
    link: "https://facundodiazportfolio.onrender.com/",
    repo: "https://github.com/Gxnza48/FacundoDiazPortfolio",
    tags: ["React", "Animations", "UI"]
  },
  {
    title: "Kanki Barber Shop",
    description: "Modern booking experience for a sleek barber shop brand.",
    link: "https://kanki.vercel.app/",
    repo: "https://github.com/Gxnza48/Kanki-Barber-Shop",
    tags: ["React", "UI/UX"]
  },
  {
    title: "Hawl Tweaks",
    description: "Performance optimization and system tweaking dashboard.",
    link: "https://hawl.vercel.app/",
    repo: "https://github.com/Gxnza48/Hawl-Tweaks",
    tags: ["React", "Performance"]
  },
  {
    title: "Rapix",
    description: "Dynamic web application with a modern component-driven architecture.",
    link: "https://rapix.netlify.app/",
    repo: "https://github.com/Gxnza48/Rapix",
    tags: ["Web App", "UI"]
  }
];

const techStack = [
  { category: "/01 Core Frontend", icons: [
    { name: "JavaScript", class: "devicon-javascript-plain" },
    { name: "TypeScript", class: "devicon-typescript-plain" },
    { name: "React", class: "devicon-react-original" },
    { name: "Next.js", class: "devicon-nextjs-plain" },
    { name: "Tailwind", class: "devicon-tailwindcss-original" }
  ]},
  { category: "/02 Backend & Scripts", icons: [
    { name: "Lua", class: "devicon-lua-plain" },
    { name: "Node.js", class: "devicon-nodejs-plain" },
    { name: "Python", class: "devicon-python-plain" },
    { name: "C#", class: "devicon-csharp-plain" }
  ]},
  { category: "/03 Infrastructure", icons: [
    { name: "Git", class: "devicon-git-plain" },
    { name: "MongoDB", class: "devicon-mongodb-plain" },
    { name: "Vercel", class: "devicon-vercel-original" }
  ]}
];

const ROLES = ["Fullstack Developer", "UX/UI Designer", "Lua Scripter", "Data Science"];

function Typewriter() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const i = loopNum % ROLES.length;
    const fullText = ROLES[i];

    const handleTyping = () => {
      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );
      setTypingSpeed(isDeleting ? 30 : 80);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500); // Small pause before next word
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  return (
    <span className="font-bold text-lg text-brand-primary inline-flex items-center min-h-[28px]">
      {text}
      <span className="inline-block w-[2px] h-5 bg-brand-primary ml-[2px] animate-[pulse_1s_infinite]" style={{ boxShadow: '0 0 10px var(--theme-primary)', backgroundColor: 'var(--theme-primary)' }} />
    </span>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. Initial Hero entrance animation
    anime.timeline({ easing: 'easeOutExpo' })
      .add({
        targets: '.hero-bg-text',
        translateY: [150, 0],
        opacity: [0, 0.03],
        duration: 1500,
      })
      .add({
        targets: '.animate-in',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(100)
      }, '-=1000');

    // 2. Scroll Progress Tracker
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const progress = scrollY / (documentHeight - windowHeight);
      setScrollProgress(progress);

      let offsetY = (progress - 0.5) * 100;
      if (progress > 0.75) {
        // Push the fixed watermark down but a bit higher than before
        offsetY += ((progress - 0.75) / 0.25) * (windowHeight * 0.25);
      }
      anime.set('.hero-bg-text', { translateY: offsetY });

      if (bgTextRef.current) {
        let newWord = "CREATOR";
        let isOrange = false;

        if (progress > 0.75) {
          newWord = "FULLSTACK";
          isOrange = true;
        } else if (progress > 0.5) {
          newWord = "DEVELOPER";
        } else if (progress > 0.15) {
          newWord = "DESIGNER";
        }

        if (bgTextRef.current.innerText !== newWord) {
          bgTextRef.current.innerText = newWord;
        }

        if (scrollY > 100) {
          if (isOrange) {
            bgTextRef.current.style.color = "var(--theme-primary)";
            bgTextRef.current.style.webkitTextStroke = "0px";
            
            // "al final es decir al 100 quede mas brilloso"
            if (progress > 0.95) {
              const glowProgress = Math.min(1, (progress - 0.95) * 20); // 0 to 1
              bgTextRef.current.style.opacity = (0.1 + glowProgress * 0.2).toString();
              bgTextRef.current.style.filter = `drop-shadow(0 0 ${glowProgress * 20}px var(--theme-primary))`;
            } else {
              bgTextRef.current.style.opacity = "0.08";
              bgTextRef.current.style.filter = "none";
            }
          } else {
            bgTextRef.current.style.color = "transparent";
            bgTextRef.current.style.webkitTextStroke = "2px rgba(255,255,255,1)";
            bgTextRef.current.style.opacity = "0.03";
            bgTextRef.current.style.filter = "none";
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 3. IntersectionObserver for scroll reveal —
    //    CSS already made elements opacity:0 / translateY(50px)
    //    anime.js will animate them to visible when they enter the viewport.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target.classList.contains('reveal-group')) {
          // Reveal the container instantly so we can see the children animating inside
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'none';

          // Stagger children
          const children = entry.target.querySelectorAll('.reveal-child');
          anime({
            targets: children,
            translateY: [60, 0],
            opacity: [0, 1],
            rotateX: [10, 0],
            duration: 900,
            delay: anime.stagger(80),
            easing: 'easeOutQuart'
          });
        } else {
          // Single element
          anime({
            targets: entry.target,
            translateY: [50, 0],
            opacity: [0, 1],
            duration: 900,
            easing: 'easeOutQuart'
          });
        }

        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px' // trigger a bit before element fully enters
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <main ref={containerRef} className="flex min-h-screen flex-col items-center overflow-x-hidden pt-20 relative selection:bg-brand-primary selection:text-white">
      
      {/* Ghost Background Grid */}
      <div className="fixed inset-0 z-[-2] pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:100px_100px]" />
      
      {/* Theme Color Switcher */}
      <div className="fixed bottom-8 right-8 z-[100] flex gap-3 p-3 bg-brand-surface/80 backdrop-blur-md rounded-full border border-white/5 shadow-2xl transition-all duration-300">
        {[
          { color: '#ff6a00', muted: '#e2bfb0' },
          { color: '#8b5cf6', muted: '#d8b4fe' },
          { color: '#06b6d4', muted: '#a5f3fc' },
          { color: '#ef4444', muted: '#fca5a5' }
        ].map(theme => (
          <button
            key={theme.color}
            onClick={() => {
              if (typeof document !== 'undefined') {
                document.documentElement.style.setProperty('--theme-primary', theme.color);
                document.documentElement.style.setProperty('--theme-muted', theme.muted);
              }
            }}
            className="w-5 h-5 rounded-full hover:scale-125 transition-transform cursor-pointer border border-white/20"
            style={{ backgroundColor: theme.color }}
            aria-label={`Change theme to ${theme.color}`}
          />
        ))}
      </div>

      {/* Huge Background Watermark Text */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-[-1] pointer-events-none transition-all duration-300">
        <h1 ref={bgTextRef} className="hero-bg-text text-[14vw] lg:text-[11vw] font-black font-display uppercase tracking-tighter text-transparent transition-colors duration-500" style={{ WebkitTextStroke: '2px rgba(255,255,255,1)', opacity: 0 }}>
          CREATOR
        </h1>
      </div>

      {/* Unique Scroll Progress Timeline Indicator */}
      <div className="fixed left-0 lg:left-8 top-0 bottom-0 w-px bg-white/10 z-50 hidden lg:block">
        <div 
          className="absolute top-0 left-0 w-full bg-brand-primary glowing-scroll-bar transition-all duration-75 ease-out rounded-b-full shadow-[0_0_15px_rgba(255,106,0,0.8)]"
          style={{ height: `${scrollProgress * 100}%` }}
        />
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 -rotate-90 uppercase font-mono text-[10px] tracking-widest text-brand-muted whitespace-nowrap opacity-50">
          Scroll Status &mdash; {(scrollProgress * 100).toFixed(0)}%
        </div>
      </div>

      <div className="w-full max-w-[1280px] px-6 lg:px-24 flex flex-col gap-32 pb-32 z-10">

        {/* Hero Section */}
        <section className="relative flex flex-col lg:flex-row gap-12 lg:gap-24 justify-between items-start mt-12 w-full">
          <div className="absolute top-20 left-20 w-[40vw] h-[40vh] bg-brand-primary opacity-10 blur-[150px] -z-10 rounded-full" />

          <div className="flex flex-col gap-6 lg:w-3/5">
            <div className="animate-in text-brand-primary uppercase tracking-widest text-xs font-mono font-bold mb-4 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" style={{ boxShadow: '0 0 10px var(--theme-primary)' }} /> 
              [ SYSTEM STATUS: ONLINE ]
            </div>
            <h1 className="animate-in text-6xl md:text-8xl font-black font-display leading-[0.9] uppercase tracking-tighter mix-blend-difference pb-2">
              Gonzalo <br /> Bonadeo
            </h1>
            <p className="animate-in text-xl md:text-2xl text-brand-muted mt-6 max-w-2xl font-light">
              Frontend Developer / Web Developer / Creative Builder. <br />
              Building sharp web experiences, interactive products, and privacy-focused tools.
            </p>

            <div className="animate-in flex flex-wrap items-center gap-6 mt-10">
              <Link
                href="#contact"
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-brand-primary rounded overflow-hidden transition-all hover:scale-[1.05] active:scale-95"
                style={{ boxShadow: '0 0 30px color-mix(in srgb, var(--theme-primary) 40%, transparent)' }}
              >
                <span className="absolute inset-0 w-full h-full bg-white/20 -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-2">
                  INITIATE_CONTACT <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                href="#archive"
                className="px-8 py-4 font-bold text-white uppercase tracking-wider bg-white/5 border border-white/10 rounded backdrop-blur-md hover:bg-white/10 hover:border-white/30 transition-all"
              >
                View Archive
              </Link>
            </div>
          </div>

          <div className="animate-in flex flex-col gap-8 w-full lg:w-1/3 p-8 rounded bg-brand-surface/40 backdrop-blur-md border border-white/5 hover:border-brand-primary/20 transition-colors shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-[50px] group-hover:bg-brand-primary/10 transition-colors" />
            <div>
              <h3 className="text-xs uppercase font-mono tracking-widest text-brand-muted mb-2">Location</h3>
              <p className="font-bold text-lg">Rosario, Argentina</p>
            </div>
            <div>
              <h3 className="text-xs uppercase font-mono tracking-widest text-brand-muted mb-2">Role</h3>
              <Typewriter />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-brand-bg/50 rounded border border-white/5 backdrop-blur">
                <p className="text-4xl font-display font-black text-white">4+</p>
                <p className="text-xs text-brand-muted/70 uppercase font-mono mt-1">Years Exp</p>
              </div>
              <div className="p-4 bg-brand-bg/50 rounded border border-white/5 backdrop-blur">
                <p className="text-4xl font-display font-black text-white">42</p>
                <p className="text-xs text-brand-muted/70 uppercase font-mono mt-1">Deployments</p>
              </div>
            </div>
          </div>
        </section>


        {/* About Section */}
        <section className="reveal-on-scroll flex flex-col md:flex-row gap-16 justify-between items-start mt-20">
          <div className="md:w-1/3">
            <h2 className="text-4xl md:text-5xl font-black font-display uppercase tracking-tight">
              Driven by <br /> <span className="text-brand-primary">Technical <br /> Precision.</span>
            </h2>
          </div>
          <div className="md:w-5/12 flex flex-col gap-8 text-lg text-brand-muted leading-relaxed font-light">
            <p className="pl-6 border-l-2 border-brand-primary/50 text-white/90 font-medium">
              18-year-old developer based in Rosario, Argentina. I build high-performance digital environments with a focus on web applications, game systems, and security concepts.
            </p>
            <p>
              Bridging the gap between creative frontend design and complex script architectures. Specialized in Next.js ecosystems, elegant motion design, and secure logic loops. Expect nothing less than absolute digital quality.
            </p>
          </div>
        </section>


        {/* Stack */}
        <section className="reveal-on-scroll reveal-group flex flex-col gap-12 mt-16 relative">
          <div className="absolute right-0 top-1/2 w-96 h-96 bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <h2 className="text-4xl font-black font-display uppercase tracking-tight border-b border-white/10 pb-6 w-full flex items-end justify-between">
            <span>Tech_Stack</span>
            <span className="text-xs font-mono text-brand-muted font-normal lowercase tracking-widest">[ systems & languages ]</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((group) => (
              <div key={group.category} className="reveal-child p-8 bg-brand-surface/40 backdrop-blur-sm rounded border border-white/5 space-y-4 hover:border-brand-primary/40 hover:-translate-y-1 transition-all">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-brand-primary mb-4">{group.category}</h3>
                <div className="flex flex-wrap gap-6">
                  {group.icons.map((t) => (
                    <div key={t.name} className="group flex flex-col items-center gap-2 cursor-crosshair">
                      <i className={`${t.class} text-3xl text-brand-muted/80 group-hover:text-white group-hover:scale-110 transition-all drop-shadow-sm`} />
                      <span className="text-[9px] uppercase font-mono text-brand-muted/50 group-hover:text-brand-primary transition-colors">{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* Selected Works */}
        <section id="archive" className="reveal-on-scroll reveal-group flex flex-col gap-12 mt-16 relative">
          <h2 className="text-4xl lg:text-5xl font-black font-display uppercase tracking-tight w-full flex flex-col">
            Selected_Works
            <span className="text-brand-primary text-xl mt-2 tracking-normal lowercase block">Engineering creative products</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((proj, idx) => (
              <div key={idx} className="reveal-child group bg-brand-surface/30 backdrop-blur-md flex flex-col justify-between p-8 md:p-12 rounded border border-white/5 hover:border-brand-primary/30 hover:bg-brand-surface/60 transition-all duration-500 overflow-hidden relative">
                {/* Diagonal Accent line */}
                <div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-brand-primary/80 to-transparent rotate-45 translate-x-12 -translate-y-8 group-hover:translate-x-4 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
                
                <div className="flex justify-between items-start mb-16 relative z-10">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-display font-black text-white/90 group-hover:text-brand-primary group-hover:translate-x-2 transition-all duration-300">{proj.title}</h3>
                    <p className="text-brand-muted leading-relaxed max-w-sm font-light">
                      {proj.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 opacity-100 lg:opacity-0 lg:-translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <Link href={proj.link} target="_blank" className="p-3 bg-brand-bg rounded-full hover:bg-brand-primary hover:text-white text-brand-primary border border-brand-primary/20 transition-colors shadow" title="Live Site">
                      <ExternalLink size={20} />
                    </Link>
                    {proj.repo && (
                      <Link href={proj.repo} target="_blank" className="p-3 bg-brand-bg rounded-full hover:bg-white text-white border border-white/10 transition-colors shadow" title="Repository">
                        <i className="devicon-github-original text-xl" />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {proj.tags.map((tag) => (
                    <span key={tag} className="text-[10px] uppercase font-mono tracking-widest px-3 py-1.5 bg-brand-bg/50 backdrop-blur border border-white/5 text-brand-muted rounded group-hover:border-brand-primary/30 group-hover:text-brand-primary transition-colors">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        
        {/* Footer / Contact */}
        <section id="contact" className="reveal-on-scroll mt-32 pt-16 pb-[25vh] border-t border-white/5 flex flex-col items-center justify-center text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-60 bg-brand-primary/10 blur-[150px] pointer-events-none rounded-b-[100%]" />
          
          <div className="text-brand-primary uppercase tracking-widest text-xs font-mono font-bold mb-6 flex items-center gap-3">
             END OF ARCHIVE
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tight text-white mb-6">
            Let's build <br /> <span className="text-brand-primary">something sharp.</span>
          </h2>
          <p className="text-brand-muted text-lg max-w-xl mx-auto mb-12 font-light">
            Currently available for freelance projects and full-time opportunities. Hit me up if you want to collaborate.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-24 relative z-10">
            <Link href="mailto:gonzalo.bonadeo@email.com" className="group px-10 py-5 bg-white text-black font-bold uppercase tracking-wider rounded border border-transparent hover:bg-brand-primary hover:text-white transition-all hover:shadow-[0_0_40px_var(--theme-primary)]">
              Send an Email
            </Link>
            <Link href="https://github.com/Gxnza48" target="_blank" className="px-10 py-5 bg-brand-surface/50 backdrop-blur border border-white/10 font-bold uppercase tracking-wider text-white rounded hover:border-brand-primary/50 transition-colors flex items-center gap-2">
              <i className="devicon-github-original text-white text-xl" /> Review Code
            </Link>
          </div>

          <div className="w-full flex flex-col lg:flex-row justify-between items-center text-brand-muted text-xs border-t border-white/5 pt-8 z-10 font-mono tracking-widest uppercase">
            <p>© {new Date().getFullYear()} Gonzalo Bonadeo. System Halted.</p>
            <div className="flex space-x-8 mt-6 lg:mt-0">
              <span className="hover:text-brand-primary transition-colors cursor-crosshair">Twitter</span>
              <span className="hover:text-brand-primary transition-colors cursor-crosshair">LinkedIn</span>
              <span className="hover:text-brand-primary transition-colors cursor-crosshair">Discord</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
