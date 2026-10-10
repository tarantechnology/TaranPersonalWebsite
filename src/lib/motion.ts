import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CAMS, drive, emitFrame, emitSection, lerp, smoothstep, SKY_NAMES, type SectionMeta, type SkyName } from "./drive";

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
};

/**
 * Boots Lenis smooth scrolling, wires it to GSAP ScrollTrigger, and runs the
 * per-frame interpolation of sky, camera and road speed from the sections
 * marked with data-drive attributes.
 */
export const useDriveEngine = () => {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    drive.reducedMotion = reduced;
    drive.lite = reduced || (coarse && window.innerWidth < 768) || mem <= 2;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis?.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const sectionEls = Array.from(document.querySelectorAll<HTMLElement>("[data-drive]"));
    const triggers: ScrollTrigger[] = [];

    const metas: SectionMeta[] = sectionEls.map((el, index) => ({
      id: el.id,
      index,
      sky: (el.dataset.sky as SkyName) || "day",
      theme: (el.dataset.theme as "light" | "dark") || "dark",
      label: el.dataset.label || el.id,
      clock: el.dataset.clock || "",
      cam: CAMS[el.id] || CAMS.hero,
      center: 0,
    }));
    drive.sections = metas;

    sectionEls.forEach((el, index) => {
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) {
            document.documentElement.dataset.theme = metas[index].theme;
            if (drive.section !== index) {
              drive.section = index;
              emitSection();
            }
          }
        },
        onRefresh: () => {
          const r = el.getBoundingClientRect();
          metas[index].center = r.top + window.scrollY + r.height / 2;
        },
      });
      triggers.push(st);
    });

    // the Experience section hands its own progress to the road signs
    const exp = document.getElementById("experience");
    if (exp) {
      triggers.push(
        ScrollTrigger.create({
          trigger: exp,
          start: "top 70%",
          end: "bottom 30%",
          onUpdate: (self) => {
            drive.expProgress = self.progress;
          },
        })
      );
    }

    let lastY = window.scrollY;
    let lastT = performance.now();

    const update = () => {
      const y = window.scrollY;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      const v = (y - lastY) / dt; // px/s
      drive.velocity = lerp(drive.velocity, v, 0.15);
      lastY = y;
      lastT = now;
      drive.scrollY = y;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      drive.progress = Math.min(1, Math.max(0, y / max));

      // always driving; scrolling is the throttle
      const targetSpeed = 10 + Math.min(60, Math.abs(drive.velocity) * 0.04);
      drive.speed = lerp(drive.speed, targetSpeed, 0.05);
      drive.traveled += drive.speed * dt;

      const m = drive.sections;
      if (m.length) {
        const vc = y + window.innerHeight / 2;
        let i = 0;
        while (i < m.length - 1 && vc > m[i + 1].center) i++;
        const a = m[i];
        const b = m[Math.min(i + 1, m.length - 1)];
        const span = Math.max(1, b.center - a.center);
        const t = a === b ? 0 : smoothstep((vc - a.center) / span);
        const w: Record<SkyName, number> = { dawn: 0, day: 0, golden: 0, night: 0 };
        w[a.sky] += 1 - t;
        w[b.sky] += t;
        SKY_NAMES.forEach((k) => (drive.sky[k] = w[k]));

        const ca = a.cam, cb = b.cam;
        for (let k = 0; k < 3; k++) {
          drive.cam.pos[k] = lerp(ca.pos[k], cb.pos[k], t);
          drive.cam.look[k] = lerp(ca.look[k], cb.look[k], t);
        }
        drive.cam.fov = lerp(ca.fov, cb.fov, t);
        drive.cam.orbit = lerp(ca.orbit ? 1 : 0, cb.orbit ? 1 : 0, t);
      }
      emitFrame();
    };

    gsap.ticker.add(update);
    ScrollTrigger.refresh();
    update();
    emitSection(); // the HUD mounted before the sections were registered

    return () => {
      gsap.ticker.remove(update);
      triggers.forEach((t) => t.kill());
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
    };
  }, []);
};
