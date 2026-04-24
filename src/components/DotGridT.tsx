import { useEffect, useRef } from "react";

/**
 * DotGridT — Canvas of dots filling the viewport. Dots whose position falls
 * inside the silhouette of a giant letter T pulse red; the rest stay dim warm-white.
 */
const DotGridT = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const isLowPowerDevice = prefersReducedMotion || navigator.hardwareConcurrency <= 4 || deviceMemory <= 4;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, isLowPowerDevice ? 1 : 1.5);
    let dots: { x: number; y: number; inT: boolean; phase: number }[] = [];
    let raf = 0;
    let isVisible = true;
    const spacing = isLowPowerDevice ? 34 : 28;

    const buildDots = () => {
      dots = [];
      // T silhouette dimensions (centered)
      const tHeight = Math.min(height * 0.78, 720);
      const tWidth = tHeight * 0.78;
      const cx = width / 2;
      const cy = height / 2;
      const top = cy - tHeight / 2;
      const bottom = cy + tHeight / 2;
      const crossbarHeight = tHeight * 0.18;
      const stemWidth = tWidth * 0.22;

      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          const inCrossbar =
            y >= top &&
            y <= top + crossbarHeight &&
            x >= cx - tWidth / 2 &&
            x <= cx + tWidth / 2;
          const inStem =
            y >= top + crossbarHeight &&
            y <= bottom &&
            x >= cx - stemWidth / 2 &&
            x <= cx + stemWidth / 2;
          const inT = inCrossbar || inStem;
          dots.push({
            x,
            y,
            inT,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    };

    let mouseX = -9999;
    let mouseY = -9999;
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    let lastFrame = 0;
    const targetFrameMs = isLowPowerDevice ? 50 : 33;

    const draw = (t: number) => {
      if (!isVisible) return;
      if (t - lastFrame < targetFrameMs) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastFrame = t;
      ctx.clearRect(0, 0, width, height);
      const time = t / 1000;
      const influenceRadius = isLowPowerDevice ? 130 : 180;
      const influenceRadiusSq = influenceRadius * influenceRadius;

      for (const d of dots) {
        const dx = d.x - mouseX;
        const dy = d.y - mouseY;
        const distSq = dx * dx + dy * dy;
        const mouseInfluence = Math.max(0, 1 - distSq / influenceRadiusSq);

        if (d.inT) {
          const pulse = 0.55 + 0.45 * Math.sin(time * 1.6 + d.phase);
          const alpha = 0.35 + pulse * 0.55 + mouseInfluence * 0.4;
          const radius = 1 + pulse * 0.8 + mouseInfluence * 1.4;
          // crimson #e74c3c => approx 231,76,60
          ctx.fillStyle = `rgba(231, 76, 60, ${Math.min(alpha, 1)})`;
          ctx.beginPath();
          ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
          ctx.fill();
          if (!isLowPowerDevice && pulse > 0.9) {
            ctx.fillStyle = `rgba(231, 76, 60, ${0.12 * pulse})`;
            ctx.beginPath();
            ctx.arc(d.x, d.y, radius * 3, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          const alpha = 0.08 + mouseInfluence * 0.35;
          const radius = 0.9 + mouseInfluence * 0.8;
          // warm off-white #f0ece4 => 240,236,228
          ctx.fillStyle = `rgba(240, 236, 228, ${alpha})`;
          ctx.beginPath();
          ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible && !raf) {
          raf = requestAnimationFrame(draw);
        } else if (!isVisible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
};

export default DotGridT;
