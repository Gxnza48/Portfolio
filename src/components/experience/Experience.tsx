"use client";

/**
 * Master composition of the Star Wars portfolio experience.
 *
 * - The persistent WebGL space backdrop is loaded with `ssr: false` (browser
 *   only). Section components are prop-less and read from src/data/content.ts.
 * - Lightsaber dividers separate the major sections; the Projects section adds
 *   its own dividers between project planets.
 */

import dynamic from "next/dynamic";

import Crawl from "@/components/sw/Crawl";
import ThemeToggle from "@/components/sw/ThemeToggle";
import SoundToggle from "@/components/sw/SoundToggle";
import ForceLightning from "@/components/sw/ForceLightning";
import SaberDivider from "@/components/sw/SaberDivider";

import Hero from "@/components/sections/Hero";
import Welcome from "@/components/sections/Welcome";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

// WebGL backdrop: never prerender on the server.
const SpaceBackground = dynamic(
  () => import("@/components/sw/SpaceBackground"),
  { ssr: false },
);

export default function Experience() {
  return (
    <>
      <SpaceBackground />
      <ForceLightning />
      <Crawl />

      {/* Fixed global controls */}
      <div className="fixed bottom-6 right-6 z-[120] flex items-center gap-3">
        <SoundToggle />
        <ThemeToggle />
      </div>

      <main
        id="main-content"
        className="relative z-10 flex min-h-screen w-full flex-col items-center overflow-x-hidden"
      >
        <Hero />
        <SaberDivider color="blue" label="Hyperdrive engaged" />
        <Welcome />
        <SaberDivider color="green" label="Training archives" />
        <Skills />
        <SaberDivider color="red" label="Project systems" />
        <Projects />
        <SaberDivider color="purple" label="Transmission end" />
        <Contact />
      </main>
    </>
  );
}
