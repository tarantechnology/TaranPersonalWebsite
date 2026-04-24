import { useEffect, useRef } from "react";

/**
 * CursorFollower — small red dot + delayed ring. Pure JS, no deps.
 * Hides on touch devices.
 */
const CursorFollower = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onOverInteractive = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor-hover]")) {
        ring.classList.add("cursor-ring--lg");
        dot.classList.add("cursor-dot--sm");
      }
    };
    const onOutInteractive = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor-hover]")) {
        ring.classList.remove("cursor-ring--lg");
        dot.classList.remove("cursor-dot--sm");
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOverInteractive);
    document.addEventListener("mouseout", onOutInteractive);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOverInteractive);
      document.removeEventListener("mouseout", onOutInteractive);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[100] h-8 w-8 rounded-full border border-primary/70 transition-[width,height,opacity] duration-300 ease-out hidden md:block"
        style={{ mixBlendMode: "difference" }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[101] h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))] transition-[width,height] duration-200 ease-out hidden md:block"
      />
      <style>{`
        .cursor-ring--lg { width: 56px; height: 56px; border-color: hsl(var(--primary)); background: hsl(var(--primary) / 0.08); }
        .cursor-dot--sm { width: 4px; height: 4px; }
      `}</style>
    </>
  );
};

export default CursorFollower;
