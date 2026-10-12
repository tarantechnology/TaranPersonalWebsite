import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { drive } from "@/lib/drive";

const LINES = [
  "Warming up the diesel.",
  "Checking the oil. It's a little low.",
  "200,148 miles and counting.",
  "Finding the right sunrise.",
  "Clearing the windshield.",
];

/**
 * Full-screen loader while the 3D model, textures and fonts arrive.
 * The bar tracks real asset progress; the line changes every second or so.
 */
const Loader = () => {
  const { progress, active } = useProgress();
  const [fontsReady, setFontsReady] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const started = useRef(performance.now());

  useEffect(() => {
    let alive = true;
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) fonts.ready.then(() => alive && setFontsReady(true));
    else setFontsReady(true);
    const t = window.setInterval(() => setLineIndex((i) => (i + 1) % LINES.length), 1100);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    // phones get a static image instead of the 3D scene, so nothing reports progress there
    const assetsDone = drive.lite || (progress >= 100 && !active);
    if (!assetsDone || !fontsReady || done) return;
    const minShow = 700;
    const wait = Math.max(0, minShow - (performance.now() - started.current));
    const t = window.setTimeout(() => setDone(true), wait);
    return () => clearTimeout(t);
  }, [progress, active, fontsReady, done]);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setGone(true), 800);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  const pct = drive.lite ? 100 : Math.round(progress);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-6 bg-background px-6 text-foreground transition-opacity duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
      style={{ opacity: done ? 0 : 1, pointerEvents: done ? "none" : "auto" }}
    >
      <img src="/tarantech-logo-cropped.png" alt="TaranTech" className="h-10 w-auto opacity-90" />
      <div className="w-full max-w-sm">
        <div className="relative h-px w-full bg-border">
          <span className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_14px_hsl(var(--primary))] transition-[width] duration-300 ease-out" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-6">
          <p className="font-serif text-xl italic text-foreground/85 md:text-2xl">{LINES[lineIndex]}</p>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{pct}%</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
