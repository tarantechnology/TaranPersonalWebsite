import { useEffect, useRef, useState } from "react";
import { drive, nightness, odometer, onFrame, onSection } from "@/lib/drive";
import { scrollToId } from "@/lib/motion";

const BOOT_LINES = [
  "TARANTECH OS  //  v2.0",
  "loading driver profile ........ taran puvvala",
  "loading vehicle ............... po, 2014 cayenne diesel",
  "odometer ...................... 200,148 mi",
  "camera ........................ sony α7 iv, 35mm",
  "sunrise in 3 .. 2 .. 1",
];

/**
 * JARVIS-style holographic HUD: boot sequence, a reticle locked on the car,
 * live telemetry, a scan sweep, a flicker on every scene change, and the
 * roll strip that doubles as scene navigation.
 */
const Jarvis = () => {
  const [booted, setBooted] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [section, setSection] = useState(0);
  const [sections, setSections] = useState(drive.sections);
  const [flicker, setFlicker] = useState(false);
  const reticle = useRef<HTMLDivElement>(null);
  const odo = useRef<HTMLSpanElement>(null);
  const spd = useRef<HTMLSpanElement>(null);
  const iso = useRef<HTMLSpanElement>(null);

  // boot sequence (once per session)
  useEffect(() => {
    let skip = drive.reducedMotion;
    try {
      skip = skip || sessionStorage.getItem("po-booted") === "1";
    } catch {
      /* ignore */
    }
    if (skip) {
      setBooted(true);
      drive.booted = true;
      return;
    }
    const timers: number[] = [];
    BOOT_LINES.forEach((line, i) => {
      timers.push(window.setTimeout(() => setBootLines((l) => [...l, line]), 220 + i * 260));
    });
    timers.push(
      window.setTimeout(() => {
        setBooted(true);
        drive.booted = true;
        try {
          sessionStorage.setItem("po-booted", "1");
        } catch {
          /* ignore */
        }
      }, 220 + BOOT_LINES.length * 260 + 500)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    setSections(drive.sections);
    const offSection = onSection(() => {
      setSection(drive.section);
      setSections(drive.sections);
      setFlicker(true);
      window.setTimeout(() => setFlicker(false), 700);
    });
    let lastIso = 0, lastOdo = "", lastSpd = "";
    const offFrame = onFrame(() => {
      const el = reticle.current;
      if (el) {
        const c = drive.car;
        if (c.ok && c.w > 10) {
          const size = Math.max(c.w, c.h) * 0.92 + 24;
          el.style.opacity = "1";
          el.style.transform = `translate3d(${(c.x + c.w / 2 - size / 2).toFixed(1)}px, ${(c.y + c.h / 2 - size / 2).toFixed(1)}px, 0)`;
          el.style.width = `${size.toFixed(1)}px`;
          el.style.height = `${size.toFixed(1)}px`;
          el.dataset.state = Math.abs(drive.velocity) > 400 ? "hunting" : "locked";
        } else {
          el.style.opacity = "0";
        }
      }
      const n = nightness();
      const v = n > 0.8 ? 3200 : n > 0.5 ? 1600 : n > 0.25 ? 400 : 100;
      if (v !== lastIso && iso.current) {
        iso.current.textContent = `ISO ${v}`;
        lastIso = v;
      }
      const o = Math.floor(odometer()).toLocaleString("en-US");
      if (o !== lastOdo && odo.current) {
        odo.current.textContent = o;
        lastOdo = o;
      }
      const mph = String(Math.round(drive.speed * 2.6)).padStart(3, "0");
      if (mph !== lastSpd && spd.current) {
        spd.current.textContent = mph;
        lastSpd = mph;
      }
    });
    return () => {
      offSection();
      offFrame();
    };
  }, []);

  const total = Math.max(1, sections.length);
  const frame = String(section + 1).padStart(2, "0");
  const meta = sections[section];

  return (
    <>
      {/* boot screen */}
      <div
        aria-hidden={booted}
        className="fixed inset-0 z-[80] flex items-end bg-background px-6 pb-10 text-foreground transition-opacity duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:px-14 md:pb-14"
        style={{ opacity: booted ? 0 : 1, pointerEvents: booted ? "none" : "auto" }}
      >
        <div className="flex w-full max-w-3xl flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/80">
          {bootLines.map((l, i) => (
            <p key={i} className="jarvis-line">
              <span className="text-primary">&gt;</span> {l}
            </p>
          ))}
          {!booted && <span className="jarvis-caret h-3 w-2 bg-primary" />}
        </div>
      </div>

      <div aria-hidden className={`hud pointer-events-none fixed inset-0 z-[55] ${flicker ? "hud--flicker" : ""}`}>
        <span className="hud-scan" />

        <span className="hud-corner absolute left-5 top-5 h-7 w-7 border-l border-t" />
        <span className="hud-corner absolute right-5 top-5 h-7 w-7 border-r border-t" />
        <span className="hud-corner absolute bottom-5 left-5 h-7 w-7 border-b border-l" />
        <span className="hud-corner absolute bottom-5 right-5 h-7 w-7 border-b border-r" />

        {/* left telemetry */}
        <div className="hud-text absolute left-14 top-[104px] hidden flex-col gap-2 md:flex">
          <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))] animate-pulse-glow" />Sys online · Po</span>
          <span>Odo <span ref={odo} className="hud-num">200,148</span> mi</span>
          <span>Spd <span ref={spd} className="hud-num">026</span> mph</span>
          <span>Time {meta?.clock ?? "05:48"}</span>
        </div>

        {/* right telemetry */}
        <div className="hud-text absolute right-14 top-[104px] hidden flex-col items-end gap-2 md:flex">
          <span>α7 IV · 35mm · f/1.8 · 1/250</span>
          <span ref={iso}>ISO 100</span>
          <span>Scene {frame} / {String(total).padStart(2, "0")}</span>
          <span className="text-primary">{meta?.label ?? ""}</span>
        </div>

        <span className="hud-text absolute bottom-[22px] right-14">Frame {frame} / {String(total).padStart(2, "0")}</span>

        {/* reticle locked on the car */}
        <div ref={reticle} data-state="locked" className="reticle absolute left-0 top-0 will-change-transform" style={{ opacity: 0 }}>
          <span className="reticle__ring reticle__ring--outer" />
          <span className="reticle__ring reticle__ring--inner" />
          <span className="reticle__cross reticle__cross--h" />
          <span className="reticle__cross reticle__cross--v" />
          <span className="reticle__tag">Po · 2014 Cayenne Diesel</span>
        </div>
      </div>

      <nav aria-label="Scenes" className="hud fixed bottom-4 left-1/2 z-[56] hidden -translate-x-1/2 items-end gap-1 md:flex">
        {sections.map((s, i) => (
          <button key={s.id} type="button" onClick={() => scrollToId(s.id)} aria-label={`Go to ${s.label}`} aria-current={i === section ? "true" : undefined} className="roll-frame" data-active={i === section} data-captured={i < section} data-cursor-hover>
            <span className="sr-only">{s.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Jarvis;
