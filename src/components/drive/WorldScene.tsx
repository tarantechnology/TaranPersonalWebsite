import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html } from "@react-three/drei";
import CarModel, { CAR_LENGTH } from "./CarModel";
import Env from "./Env";
import Scenery from "./Scenery";
import { damp, drive, hexRGB, lerp, mixSkyRGB, nightness, sceneWeight, smoothstep, wrapAngle, type SkyName } from "@/lib/drive";

/* ---------- palette per time of day (sRGB 0..1) ---------- */
type SkyPalette = Record<SkyName, [number, number, number]>;
const FOG: SkyPalette = { dawn: hexRGB("#f0a872"), day: hexRGB("#ffffff"), golden: hexRGB("#ef8a55"), night: hexRGB("#0a0908") };
const GROUND: SkyPalette = { dawn: hexRGB("#2b1d17"), day: hexRGB("#e9e6df"), golden: hexRGB("#3a241c"), night: hexRGB("#0c0b0a") };
/** multiplier over the baked asphalt texture: bright by day, dim at night */
const ROAD: SkyPalette = { dawn: hexRGB("#8a7a70"), day: hexRGB("#ffffff"), golden: hexRGB("#9a7a68"), night: hexRGB("#555250") };

const rgb: [number, number, number] = [0, 0, 0];
/**
 * Blend a palette by the sky weights into `out`. The blend is done in sRGB, the
 * space the CSS sky layers cross-fade in, so the fully fogged horizon (three
 * writes the fog colour in output sRGB) matches the sky behind the canvas
 * during transitions too, not just at the pure presets.
 */
const tint = (set: SkyPalette, out: THREE.Color) => {
  mixSkyRGB(set, rgb);
  return out.setRGB(rgb[0], rgb[1], rgb[2], THREE.SRGBColorSpace);
};

/* ---------- the road: an endless strip whose texture rolls under the car ---------- */
const makeRoadTexture = () => {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#2a2826";
  ctx.fillRect(0, 0, 512, 128);
  // a little grain
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "#312e2b" : "#232120";
    ctx.fillRect(Math.random() * 512, Math.random() * 128, 2, 2);
  }
  // edge lines
  ctx.fillStyle = "#c9c4ba";
  ctx.fillRect(0, 6, 512, 3);
  ctx.fillRect(0, 119, 512, 3);
  // centre dashes
  ctx.fillStyle = "#f0ece4";
  for (let x = 0; x < 512; x += 128) ctx.fillRect(x, 62, 64, 4);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  t.repeat.set(60, 1);
  t.anisotropy = 8;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const Road = () => {
  const tex = useMemo(makeRoadTexture, []);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const ground = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(() => {
    // 480-unit plane / 60 repeats = 8 units per tile; an offset of 1 is exactly one tile, so the wrap is seamless
    tex.offset.x = (drive.traveled / 8) % 1;
    if (mat.current) tint(ROAD, mat.current.color);
    if (ground.current) tint(GROUND, ground.current.color);
  });
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
        <planeGeometry args={[900, 900]} />
        <meshStandardMaterial ref={ground} color="#2b1d17" roughness={1} metalness={0} />
      </mesh>
      {/* the road's centre line sits at z=-2 so the car (at the origin) drives in the right-hand lane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
        <planeGeometry args={[480, 8]} />
        <meshStandardMaterial ref={mat} map={tex} color="#8a7a70" roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
};

/* ---------- sun and stars ---------- */
const Sun = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const s = drive.sky;
    const vis = Math.max(s.dawn, s.golden);
    m.visible = vis > 0.002;
    if (!m.visible) return;
    // size and place by which sun this is (dawn or golden), not by how faded it is:
    // it fades out in place instead of shrinking and sliding across the sky
    const g = s.golden / Math.max(1e-4, s.dawn + s.golden);
    m.scale.setScalar(lerp(14, 28, g));
    m.position.set(130, lerp(8, 7, g), lerp(36, -24, g));
    (m.material as THREE.MeshBasicMaterial).opacity = vis;
  });
  return (
    <mesh ref={ref} position={[240, 10, 40]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color="#ffb97a" transparent fog={false} toneMapped={false} />
    </mesh>
  );
};

const Stars = () => {
  const geo = useMemo(() => {
    const n = 1400;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 300;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.random() * Math.PI * 0.42;
      pos[i * 3] = r * Math.cos(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) + 4;
      pos[i * 3 + 2] = r * Math.cos(ph) * Math.sin(th);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  const mat = useRef<THREE.PointsMaterial>(null);
  useFrame(() => {
    if (mat.current) mat.current.opacity = Math.max(0, drive.sky.night - 0.1) * 0.9;
  });
  return (
    <points geometry={geo}>
      <pointsMaterial ref={mat} color="#f0ece4" size={1.6} sizeAttenuation transparent opacity={0} fog={false} />
    </points>
  );
};

/* ---------- holographic road signs for the Experience scene ---------- */
export const SIGNS = [
  { range: "Jun 2022 — Nov 2023", role: "Research Intern", company: "UNC Wilmington · Wilmington, NC", body: "Novel method to detect atrial fibrillation in real time. Under Dr. Cuxian Chen & Dr. Yishi Wang." },
  { range: "May 2023 — Sep 2023", role: "Research Intern", company: "WSPR Lab · Raleigh, NC", body: "Analyzed 250K+ virtual reality privacy concerns under Dr. Anupam Das." },
  { range: "2024 — Present", role: "Co-Founder", company: "Tabl · AI CAD generation", body: "Text-to-CAD solved. Backed by Christopher Klaus." },
  { range: "Sep 2024 — Present", role: "Lead Undergraduate Researcher", company: "Georgia Tech CHART Lab · Atlanta, GA", body: "Real-time ML pipelines that make technical cross-collaboration way less painful." },
  { range: "May 2025 — Jul 2025", role: "SDE Intern", company: "Georgia Tech Research Institute · Huntsville, AL", body: "Performance testing suite for the Air & Missile Defense division." },
  { range: "Jul 2025 — Sep 2025", role: "Software Engineer Intern", company: "Pally (YC S25) · San Francisco, CA", body: "$1.1M pre-seed. Full-stack, backend, infra and search, whatever was next to my name on the whiteboard." },
  { range: "May 2026 — Aug 2026", role: "ML Engineer Intern", company: "Snap Inc. · Palo Alto, CA", body: "Summer 2026.", next: true },
];
/** behind the telephone-pole line (z = -7, cross-arms to about -8.2) so a sign never intersects a pole */
const SIGN_Z = -8.6;
/** minimum road distance between consecutive signs: with the Experience camera two cards never overlap on screen */
const SIGN_GAP = 18;
/** road units ahead of the car where a sign appears (small, near the vanishing point) ... */
const SIGN_SPAWN = 36;
/** ... and the distance over which it fades in, since the spawn point is inside the frame */
const SIGN_FADE = 8;
/** behind the car, past the left edge of the Experience frame (it leaves the frame near x = -6) */
const SIGN_GONE = -12;
/** Experience hold progress at which sign i is due */
const signDue = (i: number) => 0.01 + (i / (SIGNS.length - 1)) * 0.8;

/** 0 = waiting, 1 = on the road (spawned when the road had travelled `at`), 2 = passed */
type SignState = { phase: 0 | 1 | 2; at: number };

/**
 * The signs stand on the road and ride with it: a live sign's x is
 * SIGN_SPAWN - (traveled - at), the same `traveled` the asphalt and the poles
 * use, so it always passes the car at exactly road speed and never looks
 * attached to it. Scroll only decides *when* each one appears: sign i spawns
 * once the Experience hold reaches signDue(i) and the previous sign is
 * SIGN_GAP down the road. Passed signs re-arm when you scroll back above them.
 * Every DOM card stays mounted (no React state per frame); hidden ones get
 * visibility:hidden, because drei's <Html> ignores the 3D `visible` flag.
 */
const RoadSigns = () => {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const shown = useMemo(() => SIGNS.map(() => -1), []);
  const signs = useMemo<SignState[]>(() => SIGNS.map(() => ({ phase: 0, at: 0 })), []);
  const primed = useRef(false);

  // priority -1: positions are final before drei's <Html> (priority 0) projects the cards,
  // otherwise the cards trail their poles by a frame of road travel
  useFrame(() => {
    const p = drive.expProgress;
    const inside = p > 0 && p < 1;

    // landing mid-section (reload, anchor): start from the sign that is due now, not the first one
    if (!primed.current) {
      primed.current = true;
      if (inside) signs.forEach((s, i) => i + 1 < signs.length && signDue(i + 1) <= p && (s.phase = 2));
    }

    // scrolled back above a passed sign: it can come again
    signs.forEach((s, i) => {
      if (s.phase === 2 && p < signDue(i) - 0.005) s.phase = 0;
    });

    // live signs move with the road
    let lead = -Infinity; // x of the most recently spawned live sign
    signs.forEach((s) => {
      if (s.phase !== 1) return;
      const x = SIGN_SPAWN - (drive.traveled - s.at);
      if (x < SIGN_GONE) s.phase = 2;
      else lead = Math.max(lead, x);
    });

    // spawn the next waiting sign once it is due and the road ahead is clear
    if (inside) {
      const next = signs.findIndex((s) => s.phase === 0);
      if (next >= 0 && p >= signDue(next) && lead <= SIGN_SPAWN - SIGN_GAP) {
        signs[next].phase = 1;
        signs[next].at = drive.traveled;
      }
    }

    // fade with the Experience camera, so signs still on the road leave with the scene instead of popping
    const scene = sceneWeight("experience");
    signs.forEach((s, i) => {
      const g = groups.current[i];
      let o = 0;
      if (s.phase === 1) {
        const x = SIGN_SPAWN - (drive.traveled - s.at);
        if (g) g.position.x = x;
        o = smoothstep((SIGN_SPAWN - x) / SIGN_FADE) * scene;
      }
      if (g) g.visible = o > 0.001;
      const m = mats.current[i];
      if (m) m.opacity = 0.8 * o;
      const card = cards.current[i];
      // only touch the DOM when the value really changes (but never skip the step to/from hidden)
      if (card && (Math.abs(o - shown[i]) > 0.004 || o > 0.001 !== shown[i] > 0.001)) {
        shown[i] = o;
        card.style.opacity = o.toFixed(3);
        card.style.visibility = o > 0.001 ? "visible" : "hidden";
      }
    });
  }, -1);

  return (
    <group>
      {SIGNS.map((s, i) => (
        <group key={s.role + s.range} ref={(g) => (groups.current[i] = g)} position={[SIGN_SPAWN, 0, SIGN_Z]} visible={false}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 3, 6]} />
            <meshBasicMaterial ref={(m) => (mats.current[i] = m)} color="#e74c3c" transparent opacity={0} depthWrite={false} />
          </mesh>
          <Html position={[0, 3.6, 0]} sprite transform distanceFactor={6.5} zIndexRange={[2, 1]} style={{ pointerEvents: "none" }}>
            <div ref={(el) => (cards.current[i] = el)} className={`holo-sign ${s.next ? "holo-sign--next" : ""}`} style={{ opacity: 0, visibility: "hidden" }}>
              <span className="holo-sign__range">{s.range}{s.next ? " · next" : ""}</span>
              <span className="holo-sign__role">{s.role}</span>
              <span className="holo-sign__co">{s.company}</span>
              <span className="holo-sign__body">{s.body}</span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

/* ---------- camera, lights, fog, car ---------- */
const Rig = () => {
  const car = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const head = useRef<THREE.SpotLight>(null);
  const lightsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const { camera, scene, gl } = useThree();
  const fog = useMemo(() => new THREE.Fog("#e8a06a", 26, 140), []);
  const tmp = useMemo(() => ({ box: new THREE.Box3(), corners: Array.from({ length: 8 }, () => new THREE.Vector3()) }), []);
  /** the camera's own smoothed pose, kept in cylindrical form around the car (see motion.ts) */
  const rig = useMemo(() => ({ ready: false, r: 0, th: 0, y: 0, look: new THREE.Vector3(), swayT: 0 }), []);
  // a spotlight only aims at its target if the target is in the scene graph (it is mounted below)
  const headTarget = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    scene.fog = fog;
    if (import.meta.env.DEV) (window as unknown as { __world?: unknown }).__world = { scene, camera, car, drive };
    return () => {
      scene.fog = null;
    };
  }, [scene, fog, camera]);

  const onLights = useCallback((l: THREE.MeshStandardMaterial[]) => {
    lightsRef.current = l;
  }, []);

  // priority -1: the camera is final before anything that projects through it this
  // frame (drei <Html> road signs, the reticle box below), so the DOM never lags the canvas
  useFrame((state, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const d = drive.cam;
    // frame-rate independent smoothing
    const k = damp(4.5, dt);

    // the last scene sways slowly around the car instead of a full orbit. The phase
    // restarts at 0 whenever the sway fades in, so it never starts mid-swing.
    if (d.orbit > 0.001) rig.swayT += dt;
    else rig.swayT = 0;
    const sway = Math.sin(rig.swayT * 0.35) * 0.55 * d.orbit;

    // smooth radius / angle / height rather than x / y / z: a fast jump between presets
    // on opposite sides (blog -> contact) swings round the car instead of cutting through it
    const tr = Math.hypot(d.pos[0], d.pos[2]);
    const tth = Math.atan2(d.pos[2], d.pos[0]) + sway;
    if (!rig.ready) {
      // first frame: start on the target instead of gliding in from the Canvas default
      rig.ready = true;
      rig.r = tr;
      rig.th = tth;
      rig.y = d.pos[1];
      rig.look.fromArray(d.look);
      cam.fov = d.fov;
      cam.updateProjectionMatrix();
    } else {
      rig.r += (tr - rig.r) * k;
      rig.th += wrapAngle(tth - rig.th) * k;
      rig.y += (d.pos[1] - rig.y) * k;
      // the look target eases with the position; on its own it would follow raw scroll and twitch
      rig.look.x += (d.look[0] - rig.look.x) * k;
      rig.look.y += (d.look[1] - rig.look.y) * k;
      rig.look.z += (d.look[2] - rig.look.z) * k;
    }
    cam.position.set(rig.r * Math.cos(rig.th), rig.y, rig.r * Math.sin(rig.th));
    cam.lookAt(rig.look);
    // ease every frame and snap when close. (Gating on the step size froze the fov up
    // to ~0.1 deg short of the target and made slow scrolls zoom in visible steps.)
    const df = d.fov - cam.fov;
    if (df !== 0) {
      cam.fov = Math.abs(df) < 0.005 ? d.fov : cam.fov + df * k;
      cam.updateProjectionMatrix();
    }
    cam.updateMatrixWorld();

    // fog follows the horizon colour; thicker at night and dawn
    tint(FOG, fog.color);
    const n = nightness();
    fog.near = lerp(34, 16, n);
    fog.far = lerp(170, 80, n);

    // car: idle bob and a pitch with the throttle
    const g = car.current;
    if (g) {
      g.position.y = Math.sin(state.clock.elapsedTime * 2.1) * 0.008 + Math.sin(drive.traveled * 1.7) * 0.004;
      g.rotation.z = lerp(g.rotation.z, -(drive.speed - 10) * 0.0006, k);
    }

    const s = sun.current;
    if (s) {
      s.intensity = lerp(2.3, 0.35, n);
      const warm = drive.sky.golden + drive.sky.dawn;
      s.color.setRGB(1, lerp(0.96, 0.7, warm), lerp(0.9, 0.45, warm));
      s.position.set(lerp(8, 30, warm), lerp(14, 5, warm), lerp(6, -8, drive.sky.golden));
    }
    const lights = lightsRef.current;
    for (let i = 0; i < lights.length; i++) lights[i].emissiveIntensity = n * 2.4;
    if (head.current) head.current.intensity = n * 40;

    // screen-space box of the car body (not the shadow plane) for the HUD reticle
    const b = body.current;
    if (b && g) {
      const { box, corners } = tmp;
      g.updateWorldMatrix(true, false); // the bob and pitch above changed it this frame
      box.setFromObject(b);
      const r = gl.domElement.clientWidth, h = gl.domElement.clientHeight;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let i = 0; i < 8; i++) {
        corners[i].set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(cam);
        const px2 = ((corners[i].x + 1) / 2) * r;
        const py2 = ((1 - corners[i].y) / 2) * h;
        minX = Math.min(minX, px2); maxX = Math.max(maxX, px2);
        minY = Math.min(minY, py2); maxY = Math.max(maxY, py2);
      }
      const c = drive.car; // in place: no allocation per frame
      c.x = minX;
      c.y = minY;
      c.w = maxX - minX;
      c.h = maxY - minY;
      c.ok = true;
    }
  }, -1);

  return (
    <>
      <directionalLight ref={sun} position={[8, 14, 6]} intensity={2.3} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0004} />
      <directionalLight position={[-6, 4, -6]} intensity={0.45} />
      <ambientLight intensity={0.35} />
      <group ref={car}>
        <group ref={body}>
          <CarModel onLights={onLights} />
        </group>
        <primitive object={headTarget} position={[12, 0, 0]} />
        <spotLight ref={head} position={[2.3, 0.7, 0]} target={headTarget} angle={0.55} penumbra={0.6} intensity={0} color="#ffe2b0" distance={40} />
        <ContactShadows position={[0, 0.002, 0]} opacity={0.5} scale={CAR_LENGTH * 2} blur={2} far={2} resolution={512} frames={1} />
      </group>
      <Road />
      <Scenery />
      <RoadSigns />
      <Sun />
      <Stars />
    </>
  );
};

/** Static fallback for phones and reduced motion: a single render of Po. */
const LiteWorld = () => (
  <img src="/car/front34.png" alt="" aria-hidden className="absolute bottom-[8vh] right-[-6vw] w-[88vw] max-w-[560px] opacity-90" decoding="async" />
);

/**
 * The one continuous scene behind every section: Po driving on an endless
 * road while the camera moves between scenes with the scroll.
 */
const WorldScene = () => {
  const [lite, setLite] = useState<boolean | null>(null);
  useEffect(() => setLite(drive.lite), []);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {lite === null ? null : lite ? (
        <LiteWorld />
      ) : (
        <Canvas
          dpr={[1, 1.6]}
          shadows
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ fov: 32, position: [-9.5, 2.3, 7.5], near: 0.3, far: 400 }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            gl.setClearColor(0x000000, 0);
          }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Suspense fallback={null}>
            <Env />
            <Rig />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default WorldScene;
