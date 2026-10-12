/**
 * Shared, mutable scroll-driven state for the "one day's drive" site.
 * Written by the scroll engine every frame; read by the sky, the 3D world and
 * the HUD without going through React state (no re-renders on scroll).
 */

export type SkyName = "dawn" | "day" | "golden" | "night";
export const SKY_NAMES: SkyName[] = ["dawn", "day", "golden", "night"];

export type Cam = { pos: [number, number, number]; look: [number, number, number]; fov: number; orbit?: boolean };

/** Camera per scene. The car sits at the origin, nose pointing +x. */
export const CAMS: Record<string, Cam> = {
  hero: { pos: [-11, 2.4, 8.5], look: [0.6, 0.7, -3.2], fov: 32 },
  about: { pos: [0.5, 1.6, 13], look: [-3.5, 1.2, 0], fov: 28 },
  experience: { pos: [-14, 5.5, 7], look: [6, 0.2, -1], fov: 34 },
  projects: { pos: [10, 2.0, 9], look: [-1.5, 1.6, 2.5], fov: 30 },
  content: { pos: [7, 1.3, -10], look: [0, 1.2, 2.5], fov: 30 },
  blog: { pos: [13, 1.1, 3], look: [-1, 1.3, 3.5], fov: 26 },
  contact: { pos: [-11.5, 2.6, -3], look: [4, 0.6, 3], fov: 30 },
  po: { pos: [-13, 3.2, -10], look: [0, 0.7, 0], fov: 26, orbit: true },
};

export type SectionMeta = {
  id: string;
  index: number;
  sky: SkyName;
  theme: "light" | "dark";
  label: string;
  clock: string;
  cam: Cam;
  /** scroll position (px) where this section is centred in the viewport */
  center: number;
};

export const drive = {
  progress: 0,
  scrollY: 0,
  velocity: 0,
  /** blend weights for the four sky presets, sum to 1 */
  sky: { dawn: 1, day: 0, golden: 0, night: 0 } as Record<SkyName, number>,
  /** interpolated camera for this frame */
  cam: { pos: [-9.5, 2.3, 7.5] as [number, number, number], look: [2.5, 0.8, 0] as [number, number, number], fov: 32, orbit: 0 },
  /** road units travelled, and current speed in units/s */
  traveled: 0,
  speed: 12,
  /** 0..1 through the Experience section (drives the road signs) */
  expProgress: 0,
  /** screen-space box of the car in CSS px, written by the 3D scene */
  car: { x: 0, y: 0, w: 0, h: 0, ok: false },
  section: 0,
  sections: [] as SectionMeta[],
  reducedMotion: false,
  lite: false,
  booted: false,
};

type Listener = () => void;
const frameListeners = new Set<Listener>();
const sectionListeners = new Set<Listener>();

export const onFrame = (l: Listener) => {
  frameListeners.add(l);
  return () => {
    frameListeners.delete(l);
  };
};
export const onSection = (l: Listener) => {
  sectionListeners.add(l);
  return () => {
    sectionListeners.delete(l);
  };
};
export const emitFrame = () => frameListeners.forEach((l) => l());
export const emitSection = () => sectionListeners.forEach((l) => l());

export const smoothstep = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Night-ness 0..1, used for headlights, stars and ISO */
export const nightness = () => drive.sky.night + drive.sky.dawn * 0.55 + drive.sky.golden * 0.35;

/** Fake but satisfying: miles on Po's odometer, climbing with the road */
export const odometer = () => 200148 + drive.traveled * 0.0125;
