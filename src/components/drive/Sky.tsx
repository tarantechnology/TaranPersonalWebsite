import { useEffect, useRef } from "react";
import { drive, onFrame } from "@/lib/drive";

export const GRADIENTS = {
  // the horizon of the 3D world sits a little above mid-screen; the bright band lives there
  dawn: "linear-gradient(180deg, #080808 0%, #120908 16%, #4a1510 30%, #c0392b 40%, #e74c3c 45%, #f2a65a 49%, #f0a872 53%, #f0a872 100%)",
  day: "linear-gradient(180deg, #ffffff 0%, #ffffff 100%)",
  golden: "linear-gradient(180deg, #3a100c 0%, #c0392b 22%, #e74c3c 36%, #f2a65a 46%, #ef8a55 53%, #ef8a55 100%)",
  night: "linear-gradient(180deg, #080808 0%, #0b0908 100%)",
} as const;

/** Fixed sky behind the 3D world: four gradients cross-faded by scroll. */
const Sky = () => {
  const layers = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    return onFrame(() => {
      const s = drive.sky;
      (Object.keys(GRADIENTS) as (keyof typeof GRADIENTS)[]).forEach((k) => {
        const el = layers.current[k];
        if (el) el.style.opacity = s[k].toFixed(3);
      });
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
