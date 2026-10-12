/**
 * Scenery — stylised, low-poly surroundings for the endless road.
 *
 *  - Ridges: three layered mountain silhouettes (near / mid / far) on both sides
 *    of the road, built once as tent-shaped triangle strips whose crest follows
 *    seeded 1D value noise. They are static: they sit far enough away that not
 *    moving with the road reads as distance parallax. Far = lighter, near = darker.
 *  - Poles: telephone poles every POLE_GAP units on the left shoulder (z = -7).
 *  - Shrubs / rocks: sparse desert clutter on both shoulders (|z| 6..20).
 *    Poles, shrubs and rocks are InstancedMeshes whose instances are re-placed
 *    every frame at x = base - drive.traveled, wrapped modulo LOOP so they
 *    recycle seamlessly ahead of the car.
 *
 * Every material colour is re-mixed each frame from drive.sky weights
 * (dawn / day / golden / night), the same way WorldScene tints the road, and
 * the scene fog set by WorldScene fades the distant layers. Nothing is placed
 * inside the road strip (|z| < 4.5), at the car (origin) or above y = 60.
 *
 * Mount it inside the <Canvas> next to <Road />:  <Scenery />
 */
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { drive, SKY_NAMES, type SkyName } from "@/lib/drive";

/* ---------- palettes per time of day ---------- */
type Palette = Record<SkyName, THREE.Color>;

const col = (hex: string): THREE.Color => new THREE.Color(hex);
const palette = (dawn: string, day: string, golden: string, night: string): Palette => ({
  dawn: col(dawn),
  day: col(day),
  golden: col(golden),
  night: col(night),
});

const RIDGE_FAR = palette("#3a241c", "#d9d4ca", "#3a241c", "#141210");
const RIDGE_MID = palette("#33201a", "#c9c4ba", "#33201a", "#111010");
const RIDGE_NEAR = palette("#2b1d17", "#bdb7ab", "#2b1d17", "#0e0d0c");
const POLE = palette("#2b1d17", "#a39d91", "#2b1d17", "#0e0d0c");
const SHRUB = palette("#2b1d17", "#aaa497", "#2f1f19", "#0e0d0c");
const ROCK = palette("#3a241c", "#bdb7ab", "#3a241c", "#141210");
/** faint warm rim on the far ridge at dawn / golden hour */
const RIM = col("#c0392b");
const RIM_STRENGTH = 0.14;

/** Blend a palette by the current sky weights (same idea as `mix` in WorldScene). */
const mixSky = (set: Palette, out: THREE.Color): THREE.Color => {
  out.setRGB(0, 0, 0);
  for (const k of SKY_NAMES) {
    const c = set[k];
    const w = drive.sky[k];
    out.r += c.r * w;
    out.g += c.g * w;
    out.b += c.b * w;
  }
  return out;
};

/* ---------- layout constants ---------- */
/** ridges span x in [-RIDGE_HALF, RIDGE_HALF] */
const RIDGE_HALF = 250;
const RIDGE_BASE_Y = -0.4;
/** recycled roadside objects live on a loop this long ... */
const LOOP = 324;
/** ... placed from BEHIND units behind the car to LOOP - BEHIND ahead of it */
const BEHIND = 110;
const POLE_GAP = 18;
const POLE_Z = -7;
const SHRUB_COUNT = 96;
const ROCK_COUNT = 40;
/** shoulder band for shrubs and rocks: |z| in [SHOULDER_MIN, SHOULDER_MAX] */
const SHOULDER_MIN = 6;
const SHOULDER_MAX = 20;

/* ---------- seeded randomness ---------- */
type Rand = () => number;

/** mulberry32: tiny seeded PRNG, uniform in [0, 1) */
const mulberry32 = (seed: number): Rand => {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** 1D value noise with smoothstep interpolation on a seeded, wrapping lattice */
const makeNoise1D = (rand: Rand, cells = 64): ((t: number) => number) => {
  const lattice = Float32Array.from({ length: cells }, () => rand());
  const at = (i: number) => lattice[((i % cells) + cells) % cells];
  return (t) => {
    const i = Math.floor(t);
    const f = t - i;
    const s = f * f * (3 - 2 * f);
    const a = at(i);
    return a + (at(i + 1) - a) * s;
  };
};

/* ---------- geometry builders ---------- */
type RidgeSpec = {
  /** distance of the crest from the road (used on both sides: ±z) */
  z: number;
  height: number;
  /** half-width of the ridge footprint across z */
  depth: number;
  segments: number;
  /** horizontal wavelength of the main undulation */
  wave: number;
};

/**
 * A tent-shaped ridge (crest + front base + back base per column) built for both
 * sides of the road in one geometry. Winding is mirrored on the +z side so the
 * faces always point outwards.
 */
const buildRidge = (spec: RidgeSpec, rand: Rand): THREE.BufferGeometry => {
  const cols = spec.segments + 1;
  const spacing = (RIDGE_HALF * 2) / spec.segments;
  const sides = [-1, 1];
  const pos = new Float32Array(sides.length * cols * 3 * 3);
  const idx: number[] = [];

  sides.forEach((side, sIdx) => {
    const n1 = makeNoise1D(rand);
    const n2 = makeNoise1D(rand);
    const n3 = makeNoise1D(rand);
    const zc = side * spec.z;
    const zFront = zc - side * spec.depth; // towards the road
    const zBack = zc + side * spec.depth; // away from the road
    const vBase = sIdx * cols * 3;

    for (let i = 0; i < cols; i++) {
      const x = -RIDGE_HALF + i * spacing;
      const u = x / spec.wave;
      const shape = 0.6 * n1(u) + 0.3 * n2(u * 2.7 + 11) + 0.1 * n3(u * 7.3 + 23);
      const h = spec.height * (0.18 + 0.82 * shape) + (rand() - 0.5) * spec.height * 0.08;
      const o = (vBase + i * 3) * 3;
      // crest, with a little jitter for a faceted silhouette
      pos[o] = x + (rand() - 0.5) * spacing * 0.35;
      pos[o + 1] = Math.max(RIDGE_BASE_Y + 0.5, h);
      pos[o + 2] = zc + (rand() - 0.5) * spec.depth * 0.3;
      // front base
      pos[o + 3] = x;
      pos[o + 4] = RIDGE_BASE_Y;
      pos[o + 5] = zFront;
      // back base
      pos[o + 6] = x;
      pos[o + 7] = RIDGE_BASE_Y;
      pos[o + 8] = zBack;
    }

    const tri = side < 0 ? (a: number, b: number, c: number) => idx.push(a, b, c) : (a: number, b: number, c: number) => idx.push(a, c, b);
    for (let i = 0; i < spec.segments; i++) {
      const c0 = vBase + i * 3;
      const f0 = c0 + 1;
      const b0 = c0 + 2;
      const c1 = c0 + 3;
      const f1 = f0 + 3;
      const b1 = b0 + 3;
      tri(f0, f1, c1);
      tri(f0, c1, c0);
      tri(b0, c1, b1);
      tri(b0, c0, c1);
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geometry.setIndex(idx);
  geometry.computeVertexNormals();
  return geometry;
};

/** Concatenate simple geometries (position + normal) into one non-indexed buffer. */
const mergeGeometries = (parts: THREE.BufferGeometry[]): THREE.BufferGeometry => {
  const flat = parts.map((g) => (g.index ? g.toNonIndexed() : g));
  let count = 0;
  for (const g of flat) count += g.getAttribute("position").count;
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  let offset = 0;
  for (const g of flat) {
    const p = g.getAttribute("position");
    const n = g.getAttribute("normal");
    pos.set(p.array, offset * 3);
    nor.set(n.array, offset * 3);
    offset += p.count;
  }
  flat.forEach((g) => g.dispose());
  parts.forEach((g) => g.dispose());
  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  return merged;
};

/** telephone pole: tapered post with two cross-arms (base at y = 0) */
const buildPole = (): THREE.BufferGeometry =>
  mergeGeometries([
    new THREE.CylinderGeometry(0.08, 0.13, 5.6, 6).translate(0, 2.8, 0),
    new THREE.BoxGeometry(0.1, 0.11, 1.7).translate(0, 5.25, 0),
    new THREE.BoxGeometry(0.1, 0.1, 1.2).translate(0, 4.75, 0),
  ]);

/** low desert shrub: two squashed icosahedra */
const buildShrub = (): THREE.BufferGeometry =>
  mergeGeometries([
    new THREE.IcosahedronGeometry(0.55, 0).scale(1, 0.62, 1).translate(0, 0.3, 0),
    new THREE.IcosahedronGeometry(0.4, 0).scale(1, 0.7, 1).translate(0.42, 0.22, 0.18),
  ]);

/** rock: a dodecahedron sunk slightly into the ground */
const buildRock = (): THREE.BufferGeometry => new THREE.DodecahedronGeometry(0.6, 0).scale(1, 0.6, 1.15).translate(0, 0.22, 0);

/* ---------- scene pieces ---------- */
type RidgeLayer = {
  geometry: THREE.BufferGeometry;
  material: THREE.MeshStandardMaterial;
  palette: Palette;
  /** does this layer pick up the warm rim at dawn / golden hour */
  rim: boolean;
};

type Placement = {
  /** x on the loop before travel is subtracted */
  base: number;
  z: number;
  quat: THREE.Quaternion;
  scale: THREE.Vector3;
};

type MoverSet = {
  mesh: THREE.InstancedMesh;
  material: THREE.MeshStandardMaterial;
  palette: Palette;
  items: Placement[];
};

type World = { ridges: RidgeLayer[]; movers: MoverSet[] };

const makeMaterial = (): THREE.MeshStandardMaterial =>
  new THREE.MeshStandardMaterial({ color: "#2b1d17", roughness: 1, metalness: 0, flatShading: true });

const makeRidgeLayer = (spec: RidgeSpec, pal: Palette, rim: boolean, rand: Rand): RidgeLayer => {
  const material = makeMaterial();
  if (rim) material.emissive.copy(RIM);
  material.emissiveIntensity = 0;
  return { geometry: buildRidge(spec, rand), material, palette: pal, rim };
};

const makeMoverSet = (geometry: THREE.BufferGeometry, pal: Palette, items: Placement[]): MoverSet => {
  const material = makeMaterial();
  const mesh = new THREE.InstancedMesh(geometry, material, items.length);
  // instances are spread over the whole loop, so never let three cull by the geometry's own bounds
  mesh.frustumCulled = false;
  return { mesh, material, palette: pal, items };
};

const yaw = (angle: number): THREE.Quaternion => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);

const polePlacements = (rand: Rand): Placement[] => {
  const count = Math.floor(LOOP / POLE_GAP);
  return Array.from({ length: count }, (_, i) => {
    const lean = (rand() - 0.5) * 0.04;
    const quat = yaw(rand() * 0.2 - 0.1).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), lean));
    return { base: i * POLE_GAP, z: POLE_Z + (rand() - 0.5) * 0.6, quat, scale: new THREE.Vector3(1, 0.92 + rand() * 0.16, 1) };
  });
};

const scatterPlacements = (rand: Rand, count: number, minScale: number, maxScale: number): Placement[] =>
  Array.from({ length: count }, () => {
    const side = rand() < 0.5 ? -1 : 1;
    const s = minScale + rand() * (maxScale - minScale);
    return {
      base: rand() * LOOP,
      z: side * (SHOULDER_MIN + rand() * (SHOULDER_MAX - SHOULDER_MIN)),
      quat: yaw(rand() * Math.PI * 2),
      scale: new THREE.Vector3(s, s * (0.8 + rand() * 0.4), s),
    };
  });

/** x on the loop, in [-BEHIND, LOOP - BEHIND), for a given travel distance */
const loopX = (base: number, traveled: number): number => ((((base - traveled) % LOOP) + LOOP) % LOOP) - BEHIND;

type Scratch = { c: THREE.Color; m: THREE.Matrix4; p: THREE.Vector3 };
const makeScratch = (): Scratch => ({ c: new THREE.Color(), m: new THREE.Matrix4(), p: new THREE.Vector3() });

const placeSet = (set: MoverSet, traveled: number, tmp: Scratch) => {
  const { mesh, items } = set;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    tmp.p.set(loopX(it.base, traveled), 0, it.z);
    tmp.m.compose(tmp.p, it.quat, it.scale);
    mesh.setMatrixAt(i, tmp.m);
  }
  mesh.instanceMatrix.needsUpdate = true;
};

const buildWorld = (seed: number): World => {
  const rand = mulberry32(seed);
  const ridges: RidgeLayer[] = [
    makeRidgeLayer({ z: 138, height: 34, depth: 40, segments: 70, wave: 58 }, RIDGE_FAR, true, rand),
    makeRidgeLayer({ z: 88, height: 20, depth: 26, segments: 90, wave: 42 }, RIDGE_MID, false, rand),
    makeRidgeLayer({ z: 46, height: 9, depth: 14, segments: 110, wave: 30 }, RIDGE_NEAR, false, rand),
  ];
  const movers: MoverSet[] = [
    makeMoverSet(buildPole(), POLE, polePlacements(rand)),
    makeMoverSet(buildShrub(), SHRUB, scatterPlacements(rand, SHRUB_COUNT, 0.6, 1.5)),
    makeMoverSet(buildRock(), ROCK, scatterPlacements(rand, ROCK_COUNT, 0.4, 1.3)),
  ];
  // place everything once now so the first rendered frame is already correct
  const scratch = makeScratch();
  movers.forEach((set) => placeSet(set, drive.traveled, scratch));
  return { ridges, movers };
};

const disposeWorld = (world: World) => {
  world.ridges.forEach((r) => {
    r.geometry.dispose();
    r.material.dispose();
  });
  world.movers.forEach((m) => {
    m.mesh.geometry.dispose();
    m.material.dispose();
    m.mesh.dispose();
  });
};

/* ---------- component ---------- */
export type SceneryProps = {
  /** seed for the ridge profiles and the scatter; change it for a different landscape */
  seed?: number;
};

const Scenery = ({ seed = 7 }: SceneryProps) => {
  const world = useMemo(() => buildWorld(seed), [seed]);
  const tmp = useMemo<Scratch>(makeScratch, []);

  useEffect(() => () => disposeWorld(world), [world]);

  useFrame(() => {
    const rim = (drive.sky.dawn + drive.sky.golden) * RIM_STRENGTH;
    for (const layer of world.ridges) {
      layer.material.color.copy(mixSky(layer.palette, tmp.c));
      if (layer.rim) layer.material.emissiveIntensity = rim;
    }
    for (const set of world.movers) set.material.color.copy(mixSky(set.palette, tmp.c));

    for (const set of world.movers) placeSet(set, drive.traveled, tmp);
  });

  return (
    <group>
      {world.ridges.map((layer, i) => (
        <mesh key={i} geometry={layer.geometry} material={layer.material} />
      ))}
      {world.movers.map((set, i) => (
        <primitive key={i} object={set.mesh} />
      ))}
    </group>
  );
};

export default Scenery;
