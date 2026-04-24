const skills = [
  "TypeScript", "Go", "Rust", "Python",
  "Distributed Systems", "Postgres", "Kubernetes",
  "React", "Node", "System Design", "LLMs",
];

const TSculpture = () => {
  // CSS sculpture of a T from bordered rectangles + glowing red corner dots
  return (
    <div className="relative aspect-square w-full max-w-md mx-auto" aria-hidden>
      {/* Crossbar */}
      <div className="absolute left-[8%] right-[8%] top-[12%] h-[22%] border border-border bg-gradient-to-br from-primary/[0.06] to-transparent">
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />
      </div>
      {/* Stem */}
      <div className="absolute left-1/2 top-[34%] h-[58%] w-[22%] -translate-x-1/2 border border-border bg-gradient-to-b from-primary/[0.04] to-transparent">
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />
      </div>
      {/* Faint giant T behind */}
      <span className="absolute inset-0 flex items-center justify-center font-serif text-[22rem] leading-none text-primary/[0.05] select-none pointer-events-none">
        T
      </span>
    </div>
  );
};

const Corner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const map = {
    tl: "-top-1 -left-1",
    tr: "-top-1 -right-1",
    bl: "-bottom-1 -left-1",
    br: "-bottom-1 -right-1",
  } as const;
  return (
    <span
      className={`absolute h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))] animate-pulse-glow ${map[pos]}`}
    />
  );
};

const About = () => {
  return (
    <section id="about" className="relative py-32 md:py-40 bg-noise">
      <div className="container grid gap-16 md:gap-24 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7 reveal">
          <p className="label-mono">// 01 — About</p>
          <h2 className="mt-6 font-serif font-light text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-balance">
            A builder who'd rather <span className="italic text-primary">explain</span> the system
            than gatekeep it.
          </h2>

          <div className="mt-10 max-w-2xl space-y-6 text-lg text-foreground/80 leading-relaxed">
            <p>
              I'm Taran — a computer science engineer who spends one half of his life shipping
              software and the other half explaining how the machine actually works. Five years in,
              I've built backends that survive real traffic, debugged things at 3 a.m. that
              shouldn't have been possible, and turned the lessons into videos watched by
              <span className="text-foreground"> 400,000+ people</span>.
            </p>
            <p>
              The thread through all of it: <span className="text-foreground">curiosity refined into craft</span>.
              I don't believe in mystique. I believe in clear thinking, well-named variables, and
              the kind of writing that respects the reader.
            </p>
          </div>

          <blockquote className="mt-12 border-l-2 border-primary pl-6">
            <p className="font-serif italic text-3xl md:text-4xl text-foreground/95 leading-snug">
              "Code is craft. Teaching is art."
            </p>
          </blockquote>

          <div className="mt-12">
            <p className="label-mono mb-4">// Stack & interests</p>
            <ul className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <li key={s} className="pill-mono">{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5 reveal" style={{ transitionDelay: "120ms" }}>
          <div className="lg:sticky lg:top-28">
            <TSculpture />
            <p className="mt-10 text-center font-serif italic text-2xl md:text-3xl text-foreground/90">
              Think. <span className="text-primary not-italic">·</span> Teach. <span className="text-primary not-italic">·</span> Transform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
