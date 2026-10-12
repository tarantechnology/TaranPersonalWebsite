import { useLayoutEffect, useRef } from "react";
import { Play } from "lucide-react";
import { gsap } from "@/lib/motion";
import { Reveal, Words } from "@/components/drive/Reveal";

const videos = [
  { views: "7.3M", title: "The Tank PC...", href: "https://www.tiktok.com/@tarantech/video/7171166357948468526", thumbnail: "/tiktok-thumbs/7171166357948468526.jpg", focus: true },
  { views: "250K+", title: "In partnership with TikTok", href: "https://www.tiktok.com/@tarantech/video/7042403432635845934", thumbnail: "/tiktok-thumbs/7042403432635845934.jpg" },
  { views: "1.2M", title: "Solid gaming experience overall", href: "https://www.tiktok.com/@tarantech/video/7170008975004519723", thumbnail: "/tiktok-thumbs/7170008975004519723.jpg" },
  { views: "851K", title: "Intel Gamer Days deals", href: "https://www.tiktok.com/@tarantech/video/7135925927522979115", thumbnail: "/tiktok-thumbs/7135925927522979115.jpg" },
];

const Content = () => {
  const strip = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = strip.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { x: 60 }, { x: -60, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="content" data-drive data-sky="day" data-theme="light" data-label="Content" data-clock="15:30" className="relative min-h-screen pb-24 pt-32 text-hud">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">{"// 04 — Content · 15:30, light goes warm"}</Reveal>
            <h2 className="mt-6 font-serif text-5xl font-light leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
              <Words text="Where it all started." accent="started" />
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-14 overflow-x-clip">
        <div ref={strip} className="holo mx-auto w-[min(1328px,calc(100%-3rem))] py-3 will-change-transform">
          <span aria-hidden className="mx-5 block h-2.5" style={{ background: "repeating-linear-gradient(90deg, transparent 0 10px, rgb(var(--hud) / 0.6) 10px 24px, transparent 24px 36px)" }} />
          <ul className="grid grid-cols-2 gap-3 px-5 py-2.5 md:grid-cols-4 md:gap-4">
            {videos.map((v, i) => (
              <Reveal as="li" key={v.href} delay={i * 0.08} y={24}>
                <a href={v.href} target="_blank" rel="noreferrer" className={`group relative block aspect-[9/16] overflow-hidden bg-surface text-foreground ${v.focus ? "outline outline-2 -outline-offset-2 outline-primary" : ""}`} data-cursor-hover>
                  <img src={v.thumbnail} alt={v.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]" loading="lazy" decoding="async" />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <span className="absolute left-3.5 top-3.5 font-mono text-[10px] uppercase tracking-[0.2em]">0{i + 1}</span>
                  <span className="absolute inset-x-3.5 bottom-4 flex flex-col gap-1.5 pr-12">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{v.views} views</span>
                    <span className="font-serif text-lg font-light leading-[1.05] md:text-[22px]">{v.title}</span>
                  </span>
                  <span aria-hidden className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary bg-background/50 text-primary backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
          <span aria-hidden className="mx-5 block h-2.5" style={{ background: "repeating-linear-gradient(90deg, transparent 0 10px, rgb(var(--hud) / 0.6) 10px 24px, transparent 24px 36px)" }} />
        </div>
      </div>

      <div className="container mt-10 flex flex-wrap items-center justify-between gap-6">
        <a href="https://www.tiktok.com/@tarantech" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 border-b border-primary/50 pb-1 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 hover:border-primary hover:text-primary" data-cursor-hover>
          View all videos <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-hud/60">400K+ followers across TikTok and YouTube</span>
      </div>
    </section>
  );
};

export default Content;
