"use client";

/**
 * ProjectPlanet — a single procedural 3D planet rendered with Three.js.
 *
 * Each project in the archive is mapped to a Star Wars planet archetype
 * (Coruscant, Kamino, Naboo, Mustafar, Hoth, Endor). This component renders a
 * lightweight, GLSL-free planet: the surface is a CanvasTexture (no shader
 * compile risk), wrapped on a sphere with a Standard material, an additive
 * atmosphere rim shell, and simple ambient + directional lighting.
 *
 * It is purely decorative; the readable project information lives in the
 * Projects section. Loaded with `next/dynamic(..., { ssr: false })`.
 */

import { useMemo } from "react";
import * as THREE from "three";
import type { PlanetType, PlanetParams } from "@/data/content";
import { PLANETS } from "@/data/content";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useThreeScene } from "@/lib/three/useThreeScene";

export interface ProjectPlanetProps {
  readonly type: PlanetType;
  readonly className?: string;
  readonly spin?: boolean;
}

/** Build the faux-terrain surface as a 256x256 CanvasTexture (no GLSL). */
function buildSurfaceTexture(params: PlanetParams, quality: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");

  if (g) {
    // Base fill = primary surface color.
    g.fillStyle = params.surface;
    g.fillRect(0, 0, size, size);

    // Stamp many semi-transparent blobs alternating between landmass and
    // surface tones to fake continents, oceans and noise.
    const stamps = Math.round(2000 * quality);
    for (let i = 0; i < stamps; i++) {
      g.fillStyle = i % 2 === 0 ? params.surfaceAlt : params.surface;
      g.globalAlpha = 0.04 + Math.random() * 0.16;
      const r = 2 + Math.random() * 16;
      const x = Math.random() * size;
      const y = Math.random() * size;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export default function ProjectPlanet({
  type,
  className = "w-full h-full",
  spin = true,
}: ProjectPlanetProps) {
  const reducedMotion = useReducedMotion();
  const params = PLANETS[type];

  // CSS fallback gradient (shown behind the canvas for no-WebGL / reduced-motion).
  const fallbackGradient = useMemo(
    () =>
      `radial-gradient(circle at 35% 30%, ${params.surfaceAlt} 0%, ${params.surface} 45%, ${params.atmosphere}33 78%, transparent 100%)`,
    [params.surface, params.surfaceAlt, params.atmosphere],
  );

  const containerRef = useThreeScene({
    alpha: true,
    cameraZ: 4.2,
    fov: 45,
    reducedMotion,
    setup: ({ THREE: T, scene, quality }) => {
      const group = new T.Group();

      // --- Planet body -----------------------------------------------------
      const seg = Math.round(48 * quality);
      const tex = buildSurfaceTexture(params, quality);
      const surfaceMat = new T.MeshStandardMaterial({
        map: tex,
        roughness: 1,
        metalness: 0,
      });
      if (params.emissive) {
        surfaceMat.emissive = new T.Color(params.emissive);
        surfaceMat.emissiveIntensity = 0.45;
      }
      const planet = new T.Mesh(new T.SphereGeometry(1.4, seg, seg), surfaceMat);
      group.add(planet);

      // --- Atmosphere rim (additive back-side shell) -----------------------
      const atmosMat = new T.MeshBasicMaterial({
        color: new T.Color(params.atmosphere),
        transparent: true,
        opacity: 0.18,
        side: T.BackSide,
        blending: T.AdditiveBlending,
        depthWrite: false,
      });
      const atmosphere = new T.Mesh(
        new T.SphereGeometry(1.62, seg, seg),
        atmosMat,
      );
      group.add(atmosphere);

      // Slight tilt for a more dynamic read.
      group.rotation.z = 0.18;
      scene.add(group);

      // --- Lighting --------------------------------------------------------
      const ambient = new T.AmbientLight(0x404050, 1.2);
      scene.add(ambient);
      const sun = new T.DirectionalLight(0xffffff, 2);
      sun.position.set(3, 2, 4);
      scene.add(sun);

      return {
        onFrame: (_elapsed, delta) => {
          if (!spin || reducedMotion) return;
          group.rotation.y += delta * 0.18;
        },
        dispose: () => {
          tex.dispose();
        },
      };
    },
  });

  return (
    <div
      className={`relative ${className}`}
      role="img"
      aria-label="3D planet representing the project"
    >
      {/* CSS fallback circle: visible for no-WebGL / reduced-motion, sits
          behind the canvas the scene hook appends. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ backgroundImage: fallbackGradient }}
      />
      <div ref={containerRef} aria-hidden="true" className="absolute inset-0" />
    </div>
  );
}
