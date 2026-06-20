"use client";

/**
 * Shared Three.js scene lifecycle hook. Every WebGL component in the app builds
 * on this so the non-negotiable performance rules live in ONE place:
 *
 *  - one WebGLRenderer per canvas, devicePixelRatio capped (default 2)
 *  - rAF render loop (never timers); paused via IntersectionObserver offscreen
 *  - quality auto-scaled on low-end devices (cores / memory / screen size)
 *  - reduced-motion → render a single static frame, no loop
 *  - full disposal of geometries / materials / renderer on unmount
 *  - graceful no-op if WebGL is unavailable
 *
 * Components only describe their scene via `setup`; they never touch the loop.
 *
 * IMPORTANT: components using this hook must be loaded with
 * `next/dynamic(..., { ssr: false })` from a Client Component, because the
 * renderer touches browser-only APIs.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface ThreeContext {
  THREE: typeof THREE;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  width: number;
  height: number;
  /** 0.5 (low-end) .. 1 (high-end) — scale particle counts / segments by this. */
  quality: number;
}

export interface ThreeHandlers {
  /** Called once per animation frame. `elapsed`/`delta` are seconds. */
  onFrame?: (elapsed: number, delta: number) => void;
  /** Called after the renderer/camera have been resized. */
  onResize?: (width: number, height: number) => void;
  /** Called on unmount, before automatic disposal of the scene graph. */
  dispose?: () => void;
}

export interface UseThreeSceneOptions {
  /** Build the scene. Return optional per-frame / resize / dispose handlers. */
  setup: (ctx: ThreeContext) => ThreeHandlers | void;
  alpha?: boolean;
  fov?: number;
  cameraZ?: number;
  /** Pause the loop when the container leaves the viewport. Default true. */
  pauseWhenOffscreen?: boolean;
  /** When true, render a single frame and skip the animation loop. */
  reducedMotion?: boolean;
  /** Max devicePixelRatio. Default 2. */
  dprCap?: number;
}

export function computeQuality(): number {
  if (typeof window === "undefined") return 1;
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const small = Math.min(window.innerWidth, window.innerHeight) < 768;
  let q = 1;
  if (cores <= 4) q = 0.7;
  if (cores <= 2) q = 0.5;
  if (mem <= 2) q = Math.min(q, 0.5);
  if (small) q = Math.min(q, 0.7);
  return q;
}

export function useThreeScene(options: UseThreeSceneOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Keep latest options without re-running the (expensive) effect.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const opts = optionsRef.current;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    const quality = computeQuality();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: quality > 0.75,
        alpha: opts.alpha ?? true,
        powerPreference: "high-performance",
      });
    } catch {
      // WebGL not available — bail quietly; components provide CSS fallbacks.
      return;
    }

    const dprCap = opts.dprCap ?? 2;
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap) * (quality < 1 ? 0.85 : 1);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      opts.fov ?? 60,
      width / height,
      0.1,
      2000,
    );
    camera.position.z = opts.cameraZ ?? 6;

    const ctx: ThreeContext = { THREE, scene, camera, renderer, width, height, quality };
    const handlers = optionsRef.current.setup(ctx) || {};

    const clock = new THREE.Clock();
    let rafId = 0;
    let running = false;
    const reduced = opts.reducedMotion ?? false;

    const renderFrame = () => renderer.render(scene, camera);

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      const delta = Math.min(clock.getDelta(), 0.05);
      handlers.onFrame?.(clock.elapsedTime, delta);
      renderer.render(scene, camera);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      clock.start();
      rafId = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    // Visibility-based pausing.
    let io: IntersectionObserver | null = null;
    if (opts.pauseWhenOffscreen ?? true) {
      io = new IntersectionObserver(
        (entries) => {
          const visible = entries[0]?.isIntersecting ?? false;
          if (reduced) {
            if (visible) renderFrame();
            return;
          }
          if (visible) start();
          else stop();
        },
        { threshold: 0.01 },
      );
      io.observe(container);
    } else {
      if (reduced) renderFrame();
      else start();
    }

    if (reduced) renderFrame();

    // Debounced resize via rAF.
    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        width = container.clientWidth || window.innerWidth;
        height = container.clientHeight || window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        handlers.onResize?.(width, height);
        if (reduced || !running) renderFrame();
      });
    };
    window.addEventListener("resize", onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      stop();
      cancelAnimationFrame(resizeRaf);
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      handlers.dispose?.();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose?.();
      });
      renderer.dispose();
      canvas.parentNode?.removeChild(canvas);
    };
  }, []);

  return containerRef;
}
