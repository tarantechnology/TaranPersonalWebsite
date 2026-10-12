import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CAMS, damp, drive, emitFrame, emitSection, lerp, smoothstep, SKY_NAMES, wrapAngle, type SectionMeta, type SkyName } from "./drive";

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

/** Camera presets in cylindrical form around the car (radius, angle, height). */
const polar = (p: readonly [number, number, number]) => ({ r: Math.hypot(p[0], p[2]), th: Math.atan2(p[2], p[0]), y: p[1] });

/**
 * Boots Lenis smooth scrolling, wires it to GSAP ScrollTrigger, and runs the
 * per-frame interpolation of sky, camera and road speed from the sections
 * marked with data-drive attributes.
 */
export const useDriveEngine = () => {
  useEffect(() => {
    const reduced = drive.reducedMotion;
    let tick: ((t: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis?.raf(t * 1000);
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
      holdStart: 0,
      holdEnd: 0,
    }));
    const polars = metas.map((m) => polar(m.cam.pos));
    drive.sections = metas;

    // document scroll range, cached on refresh instead of reading layout every frame
    let maxScroll = 1;
    const measure = () => {
      const vh = window.innerHeight;
      maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      sectionEls.forEach((el, index) => {
        // rect.top + scrollY is the document offset whatever the scroll position is mid-refresh
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY;
        const m = metas[index];
        m.center = top + r.height / 2;
        m.holdStart = Math.min(m.center, top + vh / 2);
        m.holdEnd = Math.max(m.center, top + r.height - vh / 2);
      });
    };

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
      });
      triggers.push(st);
    });


    // one listener for all sections; runs after every refresh (load, resize, layout change)
    ScrollTrigger.addEventListener("refresh", measure);

    // late layout changes (fonts, images, reveals) move the sections; re-measure when the page resizes
    let roTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(roTimer);
      roTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);

    let lastY = window.scrollY;
    let lastT = performance.now();

    const update = () => {
      const y = window.scrollY;
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastT) / 1000));
      const v = (y - lastY) / dt; // px/s
      drive.velocity = lerp(drive.velocity, v, damp(9.75, dt)); // ~0.15 per frame at 60fps
      lastY = y;
      lastT = now;
      drive.scrollY = y;
      drive.progress = Math.min(1, Math.max(0, y / maxScroll));

      // always driving; scrolling is the throttle
      const targetSpeed = 10 + Math.min(60, Math.abs(drive.velocity) * 0.04);
      drive.speed = lerp(drive.speed, targetSpeed, damp(3, dt)); // ~0.05 per frame at 60fps
      drive.traveled += drive.speed * dt;

      const m = metas;
      if (m.length) {
        const vc = y + window.innerHeight / 2;
        // hold on a section while it fills the screen, blend between holds
        let ia = 0;
        let ib = 0;
        let t = 0;
        if (vc > m[0].holdEnd) {
          let i = 0;
          while (i < m.length - 1 && vc > m[i + 1].holdEnd) i++;
          if (i === m.length - 1) {
            ia = ib = i;
          } else if (vc >= m[i + 1].holdStart) {
            ia = ib = i + 1;
          } else {
            ia = i;
            ib = i + 1;
            const span = Math.max(1, m[ib].holdStart - m[ia].holdEnd);
            t = smoothstep((vc - m[ia].holdEnd) / span);
          }
        }
        const a = m[ia];
        const b = m[ib];
        drive.blend.a = a.id;
        drive.blend.b = b.id;
        drive.blend.t = t;

        for (const k of SKY_NAMES) drive.sky[k] = 0;
        drive.sky[a.sky] += 1 - t;
        drive.sky[b.sky] += t;

        // position: blend in cylindrical coordinates around the car so a move between
        // two presets on opposite sides orbits the car instead of flying through it
        const pa = polars[ia], pb = polars[ib];
        const r = lerp(pa.r, pb.r, t);
        const th = pa.th + wrapAngle(pb.th - pa.th) * t;
        drive.cam.pos[0] = r * Math.cos(th);
        drive.cam.pos[1] = lerp(pa.y, pb.y, t);
        drive.cam.pos[2] = r * Math.sin(th);
        const ca = a.cam, cb = b.cam;
        for (let k = 0; k < 3; k++) drive.cam.look[k] = lerp(ca.look[k], cb.look[k], t);
        drive.cam.fov = lerp(ca.fov, cb.fov, t);
        drive.cam.orbit = lerp(ca.orbit ? 1 : 0, cb.orbit ? 1 : 0, t);
      }
      emitFrame();
    };

    gsap.ticker.add(update);
    ScrollTrigger.refresh();
    measure(); // in case refresh had nothing to do
    update();
    emitSection(); // the HUD mounted before the sections were registered

    return () => {
      gsap.ticker.remove(update);
      if (tick) gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener("refresh", measure);
      ro.disconnect();
      window.clearTimeout(roTimer);
      triggers.forEach((t) => t.kill());
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      gsap.ticker.lagSmoothing(500, 33); // GSAP's default, restored for anything mounted later
    };
  }, []);
};
