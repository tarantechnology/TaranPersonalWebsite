import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import CarModel, { CAR_LENGTH } from "./CarModel";
import Env from "./Env";
import Scenery from "./Scenery";
import { damp, drive, hexRGB, lerp, mixSkyRGB, nightness, wrapAngle, type SkyName } from "@/lib/drive";

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
  // frame, so anything reading the camera this frame sees its final position
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
