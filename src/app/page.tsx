import Experience from "@/components/experience/Experience";

/**
 * Home route — a Server Component shell. All interactivity and WebGL live in
 * the <Experience> client tree (which dynamically imports the heavy 3D pieces
 * with `ssr: false`). Page-level metadata is defined in app/layout.tsx.
 */
export default function Home() {
  return <Experience />;
}
