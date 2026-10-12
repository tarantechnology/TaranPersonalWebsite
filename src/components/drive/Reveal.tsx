import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  once?: boolean;
  start?: string;
};

/** Fades and slides its children up when they scroll into view. */
export const Reveal = ({ children, as: Tag = "div", className, delay = 0, y = 28, x = 0, once = true, start = "top 88%" }: RevealProps) => {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // no animation, but the inline opacity:0 still has to be lifted
      el.style.opacity = "1";
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y, x },
        { autoAlpha: 1, y: 0, x: 0, duration: 1.1, delay, ease: "power4.out", scrollTrigger: once ? { trigger: el, start, once: true } : { trigger: el, start, toggleActions: "play none none reverse" } }
      );
    });
    return () => ctx.revert();
  }, [delay, y, x, once, start]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Comp>
  );
};

type WordsProps = {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
  /** the one word to set in italic red; matched case-insensitively */
  accent?: string;
  start?: string;
};

/** Splits a headline into words and rolls each one up from behind a mask. */
export const Words = ({ text, className, as: Tag = "span", delay = 0, stagger = 0.06, accent, start = "top 88%" }: WordsProps) => {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // 135%: far enough that no ascender peeks over the (deeper) mask bottom before the reveal
      gsap.fromTo(
        words,
        { yPercent: 135, rotate: 2 },
        { yPercent: 0, rotate: 0, duration: 1.2, delay, stagger, ease: "power4.out", scrollTrigger: { trigger: el, start, once: true } }
      );
    });
    return () => ctx.revert();
  }, [delay, stagger, start, text]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Tag as any;
  const words = text.split(" ");
  return (
    <Comp ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const clean = w.replace(/[.,!?]/g, "").toLowerCase();
        const isAccent = accent && clean === accent.toLowerCase();
        return (
          // the mask is padded (and the padding cancelled by negative margins, so layout is
          // unchanged) because with the tight 0.85 leading the line box ends above the
          // descenders: 0.08em clipped g/p/y and commas, and italic overhang on the right
          <span key={i} aria-hidden className="-mb-[0.24em] -mr-[0.08em] -mt-[0.06em] inline-block overflow-hidden pb-[0.24em] pr-[0.08em] pt-[0.06em] align-baseline">
            <span data-word className={`inline-block will-change-transform ${isAccent ? "italic text-primary" : ""}`}>
              {w}
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </Comp>
  );
};
