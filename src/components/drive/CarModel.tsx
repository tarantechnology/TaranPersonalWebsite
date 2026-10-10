import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

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

/**
 * The Cayenne, scaled to real length, resting on y=0, nose pointing +x.
 * Each mount clones the cached scene so several canvases can show it.
 */
const CarModel = ({ onLights }: { onLights?: (l: THREE.MeshStandardMaterial[]) => void }) => {
  const { scene } = useGLTF(CAR_URL);
  const clone = useMemo(() => scene.clone(true), [scene]);
  const inner = useRef<THREE.Group>(null);
  const outer = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const lights = applyPoLook(clone);
    onLights?.(lights);
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
