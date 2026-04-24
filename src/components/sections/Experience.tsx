const entries = [
  {
    range: "May 2026 — Aug 2026",
    role: "Incoming Machine Learning Engineer Intern",
    company: "Snap Inc. · Palo Alto, CA",
    body: "Summer 2026 👻",
  },
  {
    range: "2024 — Present",
    role: "Co-Founder",
    company: "Tabl · AI CAD Generation",
    body: "Text-to-CAD solved.",
  },
  {
    range: "Sep 2024 — Present",
    role: "Lead Undergraduate Researcher",
    company: "Georgia Tech CHART Lab · Atlanta, GA",
    body: "Building real-time ML pipelines that make technical cross-collaboration way less painful.",
  },
  {
    range: "Jul 2025 — Sep 2025",
    role: "Software Engineer Intern",
    company: "Pally (YC S25) · San Francisco, CA",
    body: "$1.1M pre-seed; worked across full-stack, backend, infrastructure, and search - whatever my name was next to on the whiteboard.",
  },
  {
    range: "May 2025 — Jul 2025",
    role: "Software Development Engineer Intern",
    company: "Georgia Tech Research Institute · Huntsville, AL",
    body: "Performance testing suite for Air & Missile defense division.",
  },
  {
    range: "May 2023 — Sep 2023",
    role: "Research Intern",
    company: " Wolfpack Security and Privacy Research (WSPR) lab · Raleigh, NC",
    body: "Analyzed 250k+ virtual reality privacy concerns. Under Dr. Anupam Das.",
  },
  {
    range: "June 2022 — Nov 2023",
    role: "Research Intern",
    company: "University of North Carolina at Wilmington · Wilmington, NC",
    body: "Novel method to detect Atrial Fibrillation in real-time. Under Dr. Cuxian Chen & Dr. Yishi Wang.",
  },
];

const Experience = () => {
  return (
    <section id="experience" className="relative py-24 md:py-28 bg-background">
      <div className="container">
        <div className="reveal max-w-3xl">
          <p className="label-mono">// 02 — Experience</p>
          <h2 className="mt-6 font-serif font-light text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
            Past & <span className="italic text-primary">Present</span> 
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
              key={`${e.role}-${e.range}`}
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
