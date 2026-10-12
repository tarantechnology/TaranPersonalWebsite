import { useEffect, useRef } from "react";
import { drive, onFrame } from "@/lib/drive";

export const GRADIENTS = {
  // the horizon of the 3D world sits a little above mid-screen; the bright band lives there
  dawn: "linear-gradient(180deg, #080808 0%, #120908 16%, #4a1510 30%, #c0392b 40%, #e74c3c 45%, #f2a65a 49%, #f0a872 53%, #f0a872 100%)",
  day: "linear-gradient(180deg, #ffffff 0%, #ffffff 100%)",
  golden: "linear-gradient(180deg, #3a100c 0%, #c0392b 22%, #e74c3c 36%, #f2a65a 46%, #ef8a55 53%, #ef8a55 100%)",
  night: "linear-gradient(180deg, #080808 0%, #0b0908 100%)",
} as const;

const KEYS = Object.keys(GRADIENTS) as (keyof typeof GRADIENTS)[];

/** Fixed sky behind the 3D world: four gradients cross-faded by scroll. */
const Sky = () => {
  const layers = useRef<Record<string, HTMLDivElement | null>>({});
  const shown = useRef<Record<string, string>>({});

  useEffect(() => {
    return onFrame(() => {
      const s = drive.sky;
      // The layers are stacked, so plain opacity = weight composites as
      // w1*L1 + (1-w1)*(...) and lets the near-black page background bleed
      // through mid-blend (a dark dip between dawn and day, and a sky that no
      // longer matches the fog). Giving layer k the opacity w_k / (w_1 + ... + w_k)
      // makes the stack composite to exactly sum(w_k * L_k), the same mix the fog uses.
      let acc = 0;
      for (const k of KEYS) {
        const w = s[k];
        acc += w;
        const o = acc > 1e-6 ? (w / acc).toFixed(3) : "0.000";
        if (shown.current[k] === o) continue; // skip style writes when nothing changed
        shown.current[k] = o;
        const el = layers.current[k];
        if (el) el.style.opacity = o;
      }
    });
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {(Object.keys(GRADIENTS) as (keyof typeof GRADIENTS)[]).map((k) => (
        <div
          key={k}
          ref={(el) => (layers.current[k] = el)}
          className="absolute inset-0 will-change-[opacity]"
          style={{ background: GRADIENTS[k], opacity: k === "dawn" ? 1 : 0 }}
        />
      ))}
    </div>
  );
};

export default Sky;
