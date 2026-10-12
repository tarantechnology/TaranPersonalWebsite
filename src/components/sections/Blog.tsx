import { useState } from "react";
import { Reveal, Words } from "@/components/drive/Reveal";

const drafts = [
  { n: "01", tilt: "-2deg", tone: "linear-gradient(180deg, #2a0d0a 0%, #c0392b 55%, #f2a65a 85%, #0f0e0d 85%)", op: 0.35 },
  { n: "02", tilt: "1.5deg", tone: "#e8e4dc", op: 0.5 },
  { n: "03", tilt: "-1deg", tone: "#121212", op: 0.85 },
];

const Blog = () => {
  const [email, setEmail] = useState("");

  return (
    <section id="blog" data-drive data-sky="night" data-theme="dark" data-label="Blog" data-clock="21:10" className="relative min-h-screen pb-24 pt-32 text-hud">
      <span aria-hidden className="absolute left-1/2 top-0 h-2.5 w-[120px] -translate-x-1/2 rounded-b-md bg-primary shadow-[0_0_40px_rgba(231,76,60,0.9)]" />

      <div className="container relative grid items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">{"// 05 — Blog · 21:10, darkroom"}</Reveal>
          <h2 className="mt-6 font-serif text-6xl font-light leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
            <Words text="Still developing." accent="developing" />
          </h2>
          <Reveal as="p" delay={0.15} className="mt-8 max-w-md font-serif text-2xl font-light italic leading-[1.15] text-hud/90 md:text-3xl">
            Roll 01 is in the tank. Notes on building, creating, and the occasional car.
          </Reveal>
          <Reveal as="p" delay={0.25} className="mt-5 max-w-md text-hud/70">
            First posts are coming soon. Leave an email and the dog will bark when they're dry.
          </Reveal>

          <Reveal delay={0.35} className="holo mt-8 max-w-md p-5">
            <form
              className="flex flex-col gap-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `mailto:tpuvvala@gatech.edu?subject=${encodeURIComponent("Tell me when the blog is up")}&body=${encodeURIComponent(`Add ${email} to the list.`)}`;
              }}
            >
              <label htmlFor="blog-email" className="font-mono text-[11px] uppercase tracking-[0.22em] text-hud/60">Email</label>
              <div className="flex flex-wrap gap-2">
                <input
                  id="blog-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 min-w-0 flex-1 basis-56 rounded-sm border border-hud/25 bg-background/40 px-4 text-[15px] text-hud outline-none transition-colors duration-300 placeholder:text-hud/40 focus:border-primary"
                />
                <button type="submit" className="h-12 rounded-sm border border-primary px-5 font-mono text-[11px] uppercase tracking-[0.22em] text-hud transition-all duration-300 hover:bg-primary hover:text-primary-foreground" data-cursor-hover>
                  Notify me
                </button>
              </div>
            </form>
          </Reveal>
        </div>

        <div className="relative lg:col-span-5 lg:col-start-8">
          <span aria-hidden className="absolute inset-x-0 top-10 h-px bg-hud/35" />
          <ul className="grid grid-cols-3 gap-4 pt-6 md:gap-5">
            {drafts.map((d, i) => (
              <Reveal as="li" key={d.n} delay={0.2 + i * 0.12} y={-16} className="flex flex-col items-center">
                <span aria-hidden className="h-8 w-3 rounded-sm bg-tan" style={{ marginTop: i === 1 ? 28 : i === 2 ? 8 : 0 }} />
                <article className="flex w-full flex-col gap-2 bg-paper p-2.5 pb-3.5 text-ink transition-transform duration-500 hover:rotate-0" style={{ transform: `rotate(${d.tilt})` }}>
                  <div className="h-24 md:h-32" style={{ background: d.tone, opacity: d.op }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Draft · {d.n}</span>
                  <h3 className="font-serif text-lg font-light leading-[1.1]">Untitled</h3>
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-light">Developing</span>
                </article>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.5} className="holo mt-10 flex flex-wrap items-end justify-between gap-6 p-5">
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-hud/60">Dev timer</span>
              <span className="font-serif text-5xl font-light leading-none">00:00<span className="text-primary">:00</span></span>
            </div>
            <div className="flex min-w-[200px] flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-hud/60">Roll 01 · 0 of 3 fixed</span>
              <span className="relative block h-1 bg-hud/20"><span className="absolute inset-y-0 left-0 w-[12%] bg-primary shadow-[0_0_12px_hsl(var(--primary))]" /></span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Blog;
