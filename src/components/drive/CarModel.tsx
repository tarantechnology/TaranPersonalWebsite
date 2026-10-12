import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { drive } from "@/lib/drive";

export const CAR_URL = "/models/cayenne.glb";
export const CAR_LENGTH = 4.85;

/** Material names inside the Sketchfab glTF ("2011 Porsche Cayenne" by Ddiaz Design). */
export const applyPoLook = (root: THREE.Object3D) => {
  const lights: THREE.MeshStandardMaterial[] = [];
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((mat) => {
      const m = mat as THREE.MeshStandardMaterial;
      switch (m.name) {
        case "CarPaint":
          m.color.set("#ffffff");
          m.roughness = 0.08;
          m.metalness = 0;
          break;
        case "internal":
          m.color.set("#d9b98a");
          m.metalness = 0.1;
          m.roughness = 0.7;
          break;
        case "windows":
          m.color.set("#0a0a0a");
          m.transparent = true;
          m.opacity = 0.42;
          break;
        case "Light_Glass":
          m.opacity = 0.3;
          break;
        case "Lights":
          m.emissive = new THREE.Color("#ffe9c4");
          m.emissiveIntensity = 0;
          lights.push(m);
          break;
        default:
          break;
      }
      m.needsUpdate = true;
    });
  });
  return lights;
};

type Axis = "x" | "y" | "z";
const AXES: Axis[] = ["x", "y", "z"];

type Wheel = { mesh: THREE.Mesh; axis: Axis; radius: number; sign: number };

/**
 * The model ships all four tyres (and rims, discs) as single meshes. Split each
 * into four by which quadrant its triangles sit in, re-centre every piece on
 * its own hub, and return them so they can spin on their axle.
 */
const splitWheels = (root: THREE.Object3D): Wheel[] => {
  const wheels: Wheel[] = [];
  const targets: THREE.Mesh[] = [];
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh && /tire|rim|disk/i.test(mesh.name)) targets.push(mesh);
  });

  targets.forEach((mesh) => {
    const geo = mesh.geometry;
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const size = bb.getSize(new THREE.Vector3());
    const center = bb.getCenter(new THREE.Vector3());
    // over all four wheels the longest extent is front-to-back, the middle one is
    // the axle (track width) and the shortest is the wheel diameter (vertical)
    const order = [...AXES].sort((a, b) => size[b] - size[a]);
    const [a1, a2] = order;
    const axle = a2;

    const pos = geo.getAttribute("position") as THREE.BufferAttribute;
    const index = geo.getIndex();
    const triCount = index ? index.count / 3 : pos.count / 3;
    const buckets: number[][] = [[], [], [], []];
    const v = new THREE.Vector3();
    for (let t = 0; t < triCount; t++) {
      let cx = 0, cy = 0, cz = 0;
      for (let k = 0; k < 3; k++) {
        const i = index ? index.getX(t * 3 + k) : t * 3 + k;
        v.fromBufferAttribute(pos, i);
        cx += v.x; cy += v.y; cz += v.z;
      }
      v.set(cx / 3, cy / 3, cz / 3);
      const q = (v[a1] > center[a1] ? 1 : 0) + (v[a2] > center[a2] ? 2 : 0);
      for (let k = 0; k < 3; k++) buckets[q].push(index ? index.getX(t * 3 + k) : t * 3 + k);
    }

    buckets.forEach((idx) => {
      if (idx.length < 3) return;
      const part = new THREE.BufferGeometry();
      for (const name of Object.keys(geo.attributes)) part.setAttribute(name, geo.getAttribute(name));
      part.setIndex(idx);
      // bake the hub into the origin so rotation happens around the axle
      // (bounding boxes ignore the index, so measure the de-indexed piece)
      const baked = part.toNonIndexed();
      baked.computeBoundingBox();
      const c = baked.boundingBox!.getCenter(new THREE.Vector3());
      baked.translate(-c.x, -c.y, -c.z);
      baked.computeBoundingBox();
      const extent = baked.boundingBox!.getSize(new THREE.Vector3());
      const radius = extent[a1] / 2;
      const piece = new THREE.Mesh(baked, mesh.material);
      piece.name = `${mesh.name}_wheel`;
      piece.position.copy(c);
      piece.castShadow = mesh.castShadow;
      piece.receiveShadow = mesh.receiveShadow;
      mesh.parent?.add(piece);
      wheels.push({ mesh: piece, axis: axle, radius, sign: 0 });
      part.dispose();
    });
    mesh.parent?.remove(mesh);
  });
  return wheels;
};

/**
 * The Cayenne, scaled to real length, resting on y=0, nose pointing +x,
 * wheels spinning with the road speed. Each mount clones the cached scene.
 */
const CarModel = ({ onLights }: { onLights?: (l: THREE.MeshStandardMaterial[]) => void }) => {
  const { scene } = useGLTF(CAR_URL);
  const clone = useMemo(() => scene.clone(true), [scene]);
  const inner = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Group>(null);
  const wheels = useRef<Wheel[]>([]);
  const tmp = useMemo(() => ({ axis: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0), cross: new THREE.Vector3(), q: new THREE.Quaternion(), s: new THREE.Vector3() }), []);

  useLayoutEffect(() => {
    const lights = applyPoLook(clone);
    onLights?.(lights);
    wheels.current = splitWheels(clone);
    const g = inner.current!;
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const s = CAR_LENGTH / Math.max(size.x, size.z);
    g.scale.setScalar(s);
    g.rotation.y = Math.PI / 2; // glTF nose is +z; we drive along +x
    g.updateMatrixWorld(true);
    const b2 = new THREE.Box3().setFromObject(g);
    const c = b2.getCenter(new THREE.Vector3());
    outer.current!.position.set(-c.x, -b2.min.y, -c.z);
  }, [clone, onLights]);

  useFrame((_, dt) => {
    const list = wheels.current;
    if (!list.length) return;
    for (const w of list) {
      if (w.sign === 0) {
        // which way is "forward" for this axle: the direction the top of the wheel moves
        w.mesh.updateWorldMatrix(true, false);
        w.mesh.getWorldQuaternion(tmp.q);
        tmp.axis.set(w.axis === "x" ? 1 : 0, w.axis === "y" ? 1 : 0, w.axis === "z" ? 1 : 0).applyQuaternion(tmp.q);
        tmp.cross.crossVectors(tmp.axis, tmp.up);
        w.sign = tmp.cross.x >= 0 ? 1 : -1;
        // the glTF nests several scaled nodes; measure the radius in world units
        w.mesh.getWorldScale(tmp.s);
        w.radius = Math.max(0.05, w.radius * tmp.s.x);
      }
      // clamp like the scroll engine does, so a stalled tab doesn't spin the wheels wildly
      w.mesh.rotation[w.axis] += (w.sign * drive.speed * Math.min(dt, 0.05)) / w.radius;
    }
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={clone} />
      </group>
    </group>
  );
};

useGLTF.preload(CAR_URL);

export default CarModel;
