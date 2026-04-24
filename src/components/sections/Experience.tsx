const entries = [
  {
    range: "2023 — Present",
    role: "Senior Software Engineer",
    company: "Independent / Consulting",
    body: "Designing and shipping distributed systems for early-stage teams. Focus on infrastructure that scales without becoming legend.",
  },
  {
    range: "2021 — 2023",
    role: "Full-Stack Engineer",
    company: "Series-B SaaS Startup",
    body: "Owned customer-facing platform end to end. Cut p95 latency by 62%, rewrote the billing pipeline, mentored four engineers into seniors.",
  },
  {
    range: "2020 — Present",
    role: "Tech Content Creator",
    company: "YouTube · Twitter · Newsletter",
    body: "Built an audience of 400K+ around system design, algorithms, and the parts of CS no one bothered to explain properly.",
  },
  {
    range: "2016 — 2020",
    role: "B.Tech, Computer Science",
    company: "University",
    body: "Graduated with distinction. Spent the four years half in the library, half in the terminal.",
  },
];

const Experience = () => {
  return (
    <section id="experience" className="relative py-32 md:py-40 bg-background">
      <div className="container">
        <div className="reveal max-w-3xl">
          <p className="label-mono">// 02 — Experience</p>
          <h2 className="mt-6 font-serif font-light text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            A timeline, <span className="italic text-primary">honestly</span> told.
          </h2>
        </div>

        <ol className="mt-20 relative">
          {/* Vertical red gradient line */}
          <div
            aria-hidden
            className="absolute left-3 md:left-4 top-2 bottom-2 w-px"
            style={{ background: "var(--gradient-red-line)" }}
          />

          {entries.map((e, i) => (
            <li
              key={e.role}
              className="reveal-left relative pl-12 md:pl-20 pb-16 last:pb-0"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Node dot */}
              <span className="absolute left-[7px] md:left-[11px] top-2 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_14px_hsl(var(--primary))] animate-pulse-glow" />
              <span className="absolute left-0 md:left-1 top-[-2px] h-5 w-5 rounded-full border border-primary/30" />

              <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary">{e.range}</p>
              <h3 className="mt-3 font-serif font-light text-3xl md:text-5xl leading-tight">
                {e.role}
              </h3>
              <p className="mt-1 font-mono text-xs tracking-[0.18em] uppercase text-muted-foreground">
                {e.company}
              </p>
              <p className="mt-5 max-w-2xl text-foreground/75 leading-relaxed text-lg">
                {e.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
