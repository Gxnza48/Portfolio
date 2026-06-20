"use client";

/**
 * Force-side theme system: "jedi" (light / day) vs "sith" (dark / night).
 *
 * The active side is written to `document.documentElement.dataset.side`
 * ("jedi" | "sith"); all visual tokens are CSS variables keyed off that
 * attribute in globals.css, so switching is instant and consistent.
 *
 * Default is "sith" (dark) — best backdrop for the starfield. The user's
 * choice is persisted to localStorage.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Side = "jedi" | "sith";

interface ThemeContextValue {
  side: Side;
  setSide: (side: Side) => void;
  toggle: () => void;
  /** True once the persisted value has been read on the client. */
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "force-side";

export function ThemeProvider({
  children,
  defaultSide = "sith",
}: {
  children: ReactNode;
  defaultSide?: Side;
}) {
  const [side, setSideState] = useState<Side>(defaultSide);
  const [ready, setReady] = useState(false);

  // Read persisted preference on mount (client only).
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "jedi" || stored === "sith") {
        setSideState(stored);
      }
    } catch {
      /* localStorage unavailable — keep default */
    }
    setReady(true);
  }, []);

  // Reflect the active side onto <html> and persist it.
  useEffect(() => {
    document.documentElement.dataset.side = side;
    try {
      localStorage.setItem(STORAGE_KEY, side);
    } catch {
      /* ignore */
    }
  }, [side]);

  const setSide = useCallback((next: Side) => setSideState(next), []);
  const toggle = useCallback(
    () => setSideState((prev) => (prev === "jedi" ? "sith" : "jedi")),
    [],
  );

  return (
    <ThemeContext.Provider value={{ side, setSide, toggle, ready }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}
