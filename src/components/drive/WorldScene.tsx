import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html } from "@react-three/drei";
import CarModel, { CAR_LENGTH } from "./CarModel";
import Env from "./Env";
import Scenery from "./Scenery";
import { drive, lerp, nightness } from "@/lib/drive";

/* ---------- palette per time of day (RGB 0..1) ---------- */
const col = (hex: string) => new THREE.Color(hex);
const FOG = { dawn: col("#f0a872"), day: col("#ffffff"), golden: col("#ef8a55"), night: col("#0a0908") };
const GROUND = { dawn: col("#2b1d17"), day: col("#e9e6df"), golden: col("#3a241c"), night: col("#0c0b0a") };
/** multiplier over the baked asphalt texture: bright by day, dim at night */
const ROAD = { dawn: col("#8a7a70"), day: col("#ffffff"), golden: col("#9a7a68"), night: col("#555250") };

const mix = (set: Record<string, THREE.Color>, out: THREE.Color) => {
  const s = drive.sky;
  out.setRGB(0, 0, 0);
  (Object.keys(set) as (keyof typeof set)[]).forEach((k) => {
    const c = set[k];
    const w = s[k as keyof typeof s];
    out.r += c.r * w;
    out.g += c.g * w;
    out.b += c.b * w;
  });
  return out;
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
  const tmp = useMemo(() => new THREE.Color(), []);
  useFrame((_, dt) => {
    tex.offset.x = (drive.traveled / 8) % 1; // 8 units per texture tile
    if (mat.current) mat.current.color.copy(mix(ROAD, tmp));
    if (ground.current) ground.current.color.copy(mix(GROUND, tmp));
    void dt;
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
    m.visible = vis > 0.02;
    const scale = 14 + s.golden * 14;
    m.scale.setScalar(scale * Math.max(0.001, vis));
    m.position.set(130, lerp(5, 7, s.golden) + s.dawn * 3, lerp(36, -24, s.golden));
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
const SIGN_GAP = 16;
const SIGN_SPAWN = 28; // road units ahead of the car where the first sign appears
const SIGN_GONE = -26; // behind the car, where a sign is out of frame

/**
 * The signs stand on the road and ride with it (same `traveled` the asphalt
 * and the poles use), so the car drives past them. They spawn ahead when
 * the Experience section starts and re-arm if you scroll back above it.
 */
const RoadSigns = () => {
  const group = useRef<THREE.Group>(null);
  const [active, setActive] = useState(false);
  const start = useRef<number | null>(null);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    if (drive.section < 2) start.current = null;
    if (drive.section === 2 && start.current === null) start.current = drive.traveled;
    let anyVisible = false;
    if (start.current !== null) {
      const travel = drive.traveled - start.current;
      g.children.forEach((child, i) => {
        const x = SIGN_SPAWN + i * SIGN_GAP - travel;
        child.position.x = x;
        child.visible = x > SIGN_GONE && x < SIGN_SPAWN + 1;
        if (child.visible) anyVisible = true;
      });
    }
    const on = start.current !== null && anyVisible;
    if (on !== active) setActive(on);
    g.visible = on;
  });
  return (
    <group ref={group} visible={false}>
      {SIGNS.map((s, i) => (
        <group key={s.role + s.range} position={[6 + i * SIGN_GAP, 0, -7.2]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 3, 6]} />
            <meshBasicMaterial color="#e74c3c" transparent opacity={0.8} />
          </mesh>
          {active && (
            <Html position={[0, 3.6, 0]} sprite transform distanceFactor={6.5} center zIndexRange={[2, 1]} style={{ pointerEvents: "none" }}>
              <div className={`holo-sign ${s.next ? "holo-sign--next" : ""}`}>
                <span className="holo-sign__range">{s.range}{s.next ? " · next" : ""}</span>
                <span className="holo-sign__role">{s.role}</span>
                <span className="holo-sign__co">{s.company}</span>
                <span className="holo-sign__body">{s.body}</span>
              </div>
            </Html>
          )}
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
  const tmp = useMemo(() => ({ c: new THREE.Color(), look: new THREE.Vector3(), box: new THREE.Box3(), v: new THREE.Vector3(), corners: Array.from({ length: 8 }, () => new THREE.Vector3()) }), []);
  const orbitT = useRef(0);

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

  useFrame((state, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const d = drive.cam;
    // frame-rate independent smoothing
    const k = 1 - Math.exp(-dt * 4.5);
    // the last scene sways slowly around the car instead of a full orbit, so the
    // blend from the previous camera never cuts through the car
    orbitT.current += dt;
    const sway = Math.sin(orbitT.current * 0.35) * 0.55 * d.orbit;
    const cs = Math.cos(sway), sn = Math.sin(sway);
    const px = d.pos[0] * cs - d.pos[2] * sn;
    const pz = d.pos[0] * sn + d.pos[2] * cs;
    const py = d.pos[1];
    cam.position.x = lerp(cam.position.x, px, k);
    cam.position.y = lerp(cam.position.y, py, k);
    cam.position.z = lerp(cam.position.z, pz, k);
    tmp.look.set(d.look[0], d.look[1], d.look[2]);
    cam.lookAt(tmp.look);
    const fov = lerp(cam.fov, d.fov, k);
    if (Math.abs(fov - cam.fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    // fog follows the horizon colour; thicker at night and dawn
    fog.color.copy(mix(FOG, tmp.c));
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
    lightsRef.current.forEach((m) => (m.emissiveIntensity = n * 2.4));
    if (head.current) head.current.intensity = n * 40;

    // screen-space box of the car body (not the shadow plane) for the HUD reticle
    const b = body.current;
    if (b) {
      const { box, corners } = tmp;
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
      drive.car = { x: minX, y: minY, w: maxX - minX, h: maxY - minY, ok: true };
    }
  });

  return (
    <>
      <directionalLight ref={sun} position={[8, 14, 6]} intensity={2.3} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0004} />
      <directionalLight position={[-6, 4, -6]} intensity={0.45} />
      <ambientLight intensity={0.35} />
      <group ref={car}>
        <group ref={body}>
          <CarModel onLights={onLights} />
        </group>
        <spotLight ref={head} position={[2.3, 0.7, 0]} target-position={[12, 0, 0]} angle={0.55} penumbra={0.6} intensity={0} color="#ffe2b0" distance={40} />
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
