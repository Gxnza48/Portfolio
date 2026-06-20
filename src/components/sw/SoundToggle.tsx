"use client";

/**
 * SoundToggle — an optional, copyright-safe ambient-sound toggle.
 *
 * MUTED BY DEFAULT. On enable it lazily spins up a Web Audio graph and
 * synthesizes an original, low-volume ambient bed entirely in code (no audio
 * files): two slightly detuned low oscillators plus a faint filtered-noise pad,
 * routed through a low-pass filter into a master gain that ramps to ~0.04.
 *
 * Nothing here is decorative-only — it is a real <button> with aria-pressed and
 * a descriptive aria-label, keyboard operable with a visible focus ring.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/** Target master volume — deliberately gentle and non-intrusive. */
const MASTER_VOLUME = 0.04;
/** Ramp time (seconds) for fade in / fade out. */
const RAMP_SECONDS = 0.9;

type AudioContextCtor = typeof AudioContext;

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: AudioContextCtor;
}

function getAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as WindowWithWebkitAudio;
  return window.AudioContext ?? w.webkitAudioContext ?? null;
}

/** All long-lived audio nodes for one active ambient bed. */
interface AudioGraph {
  ctx: AudioContext;
  master: GainNode;
  oscillators: OscillatorNode[];
  noise: AudioBufferSourceNode | null;
}

/** Build a short looping buffer of soft pink-ish noise for the pad layer. */
function createNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * 2);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  // Simple one-pole low-pass on white noise → warmer "pink-ish" noise.
  let last = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = last * 0.96 + white * 0.04;
    data[i] = last * 3.5;
  }
  return buffer;
}

/** Construct and start the ambient graph, fading master gain in from 0. */
function buildGraph(ctx: AudioContext): AudioGraph {
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.connect(ctx.destination);

  // Shared low-pass so everything stays warm and recessed.
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(420, now);
  lowpass.Q.setValueAtTime(0.7, now);
  lowpass.connect(master);

  // Two detuned drones a perfect-fifth-ish apart for a calm, hollow bed.
  const oscillators: OscillatorNode[] = [];
  const droneSpecs: { freq: number; detune: number; type: OscillatorType; gain: number }[] = [
    { freq: 55, detune: -4, type: "sine", gain: 0.6 },
    { freq: 82.4, detune: 5, type: "triangle", gain: 0.35 },
  ];

  for (const spec of droneSpecs) {
    const osc = ctx.createOscillator();
    osc.type = spec.type;
    osc.frequency.setValueAtTime(spec.freq, now);
    osc.detune.setValueAtTime(spec.detune, now);

    const voiceGain = ctx.createGain();
    voiceGain.gain.setValueAtTime(spec.gain, now);

    // Slow LFO on the voice gain for gentle, breathing movement.
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.07 + Math.random() * 0.05, now);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(spec.gain * 0.25, now);
    lfo.connect(lfoGain);
    lfoGain.connect(voiceGain.gain);

    osc.connect(voiceGain);
    voiceGain.connect(lowpass);

    osc.start(now);
    lfo.start(now);
    oscillators.push(osc, lfo);
  }

  // Faint filtered-noise pad for air/texture.
  let noise: AudioBufferSourceNode | null = null;
  try {
    const src = ctx.createBufferSource();
    src.buffer = createNoiseBuffer(ctx);
    src.loop = true;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);

    src.connect(noiseGain);
    noiseGain.connect(lowpass);
    src.start(now);
    noise = src;
  } catch {
    noise = null;
  }

  // Fade the whole bed up smoothly.
  master.gain.exponentialRampToValueAtTime(MASTER_VOLUME, now + RAMP_SECONDS);

  return { ctx, master, oscillators, noise };
}

/** Stop sources and disconnect every node in a graph. */
function teardownGraph(graph: AudioGraph): void {
  const stopAt = graph.ctx.currentTime;
  for (const osc of graph.oscillators) {
    try {
      osc.stop(stopAt);
    } catch {
      /* already stopped */
    }
    osc.disconnect();
  }
  if (graph.noise) {
    try {
      graph.noise.stop(stopAt);
    } catch {
      /* already stopped */
    }
    graph.noise.disconnect();
  }
  graph.master.disconnect();
}

export default function SoundToggle() {
  const [supported, setSupported] = useState(true);
  const [enabled, setEnabled] = useState(false);

  const graphRef = useRef<AudioGraph | null>(null);
  // Tracks a pending close timeout so we can clear it on unmount/re-toggle.
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSupported(getAudioContextCtor() !== null);
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const stopAmbient = useCallback(() => {
    const graph = graphRef.current;
    if (!graph) return;
    graphRef.current = null;
    clearCloseTimer();

    const { ctx, master } = graph;
    const now = ctx.currentTime;
    // Ramp gain down to silence, then tear down + suspend the context.
    try {
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + RAMP_SECONDS);
    } catch {
      /* ignore scheduling errors */
    }

    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      teardownGraph(graph);
      if (ctx.state !== "closed") {
        void ctx.suspend().catch(() => undefined);
      }
    }, RAMP_SECONDS * 1000 + 80);
  }, [clearCloseTimer]);

  const startAmbient = useCallback(() => {
    if (graphRef.current) return;
    const Ctor = getAudioContextCtor();
    if (!Ctor) {
      setSupported(false);
      return;
    }
    clearCloseTimer();

    const ctx = new Ctor();
    // Autoplay policy: resume on the user gesture that triggered this.
    void ctx.resume().catch(() => undefined);
    graphRef.current = buildGraph(ctx);
  }, [clearCloseTimer]);

  const handleToggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      if (next) {
        startAmbient();
      } else {
        stopAmbient();
      }
      return next;
    });
  }, [startAmbient, stopAmbient]);

  // Full cleanup on unmount: stop nodes, close context, clear timer.
  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      const graph = graphRef.current;
      graphRef.current = null;
      if (graph) {
        teardownGraph(graph);
        if (graph.ctx.state !== "closed") {
          void graph.ctx.close().catch(() => undefined);
        }
      }
    };
  }, []);

  const label = enabled ? "Mute ambient sound" : "Enable ambient sound";

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={!supported}
      aria-label={supported ? label : "Ambient sound unavailable"}
      aria-pressed={enabled}
      title={supported ? label : "Ambient sound unavailable"}
      className={[
        "sound-toggle group relative inline-flex h-11 w-11 items-center justify-center",
        "rounded-full border border-brand-border bg-brand-surface text-brand-text",
        "transition-colors duration-300 outline-none",
        "hover:border-brand-primary hover:text-brand-primary",
        "focus-visible:ring-2 focus-visible:ring-[var(--c-primary)] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--c-bg)]",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-brand-border",
        "disabled:hover:text-brand-text",
      ].join(" ")}
    >
      {/* Soft pulsing aura while audio is active. */}
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 rounded-full",
          enabled ? "sound-toggle__aura" : "",
        ].join(" ")}
      />
      <span aria-hidden="true" className="relative flex">
        {enabled ? (
          <Volume2 className="h-5 w-5" strokeWidth={1.75} />
        ) : (
          <VolumeX className="h-5 w-5" strokeWidth={1.75} />
        )}
      </span>

      <style jsx>{`
        .sound-toggle {
          -webkit-tap-highlight-color: transparent;
        }
        .sound-toggle__aura {
          box-shadow: 0 0 0 0 var(--c-primary-soft);
          animation: sound-toggle-pulse 2.4s ease-out infinite;
        }
        @keyframes sound-toggle-pulse {
          0% {
            box-shadow: 0 0 0 0 var(--c-primary-soft);
            opacity: 0.8;
          }
          70% {
            box-shadow: 0 0 0 9px transparent;
            opacity: 0;
          }
          100% {
            box-shadow: 0 0 0 0 transparent;
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sound-toggle__aura {
            animation: none;
          }
        }
      `}</style>
    </button>
  );
}
