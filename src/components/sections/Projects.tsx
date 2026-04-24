import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    n: "01",
    title: "Helix Queue",
    body: "A distributed task queue with first-class observability and a 12-line client. Built because the alternatives had become museums.",
    tags: ["Go", "Postgres", "Redis"],
  },
  {
    n: "02",
    title: "Compendium",
    body: "An open-source reading platform for engineering papers. Annotations, citations, and a quiet dark theme that respects your eyes.",
    tags: ["TypeScript", "Next", "Postgres"],
  },
  {
    n: "03",
    title: "Lattice",
    body: "Interactive visualizations of classic algorithms — taught to 200K students through a single, very long video.",
    tags: ["Canvas", "WebGL", "Education"],
  },
  {
    n: "04",
    title: "Margin",
    body: "A markdown-first newsletter platform for technical writers. No analytics theatre, no engagement bait. Just words.",
    tags: ["Rust", "SQLite", "Tailwind"],
  },
  {
    n: "05",
    title: "Pulse Monitor",
    body: "Self-hosted uptime + tracing for indie infrastructure. One binary, one config file, one sane dashboard.",
    tags: ["Go", "OpenTelemetry"],
  },
];

const Projects = () => {
  return (
    <section id="projects" className="relative py-32 md:py-40">
      <div className="container">
        <div className="reveal max-w-4xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="label-mono">// 03 — Selected work</p>
            <h2 className="mt-6 font-serif font-light text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
              Projects, <span className="italic text-primary">shipped</span>.
            </h2>
          </div>
          <p className="text-foreground/70 max-w-sm text-lg">
            A short list. Each one solved a problem I actually had — not a problem the framework
            insisted I needed.
          </p>
        </div>

        <div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-primary/30"
          style={{ gap: "1px" }}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.n} {...p} delay={i * 80} />
          ))}
          <GhostCard />
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({
  n, title, body, tags, delay,
}: { n: string; title: string; body: string; tags: string[]; delay: number }) => (
  <article
    className="reveal group relative bg-background p-8 md:p-10 min-h-[320px] flex flex-col transition-all duration-500 hover:bg-surface"
    style={{ transitionDelay: `${delay}ms` }}
    data-cursor-hover
  >
    <p className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground">// {n}</p>
    <h3 className="mt-6 font-serif font-light text-3xl md:text-4xl leading-tight transition-colors duration-300 group-hover:text-primary">
      {title}
    </h3>
    <p className="mt-4 text-foreground/70 leading-relaxed flex-1">{body}</p>
    <div className="mt-6 flex flex-wrap gap-2">
      {tags.map((t) => (
        <span key={t} className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground border border-border px-2 py-1">
          {t}
        </span>
      ))}
    </div>
    <span className="absolute right-6 top-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/60 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-45">
      <ArrowUpRight className="h-5 w-5" />
    </span>
    {/* lift effect */}
    <span className="pointer-events-none absolute inset-0 transition-transform duration-500 group-hover:-translate-y-1" />
  </article>
);

const GhostCard = () => (
  <a
    href="https://github.com"
    target="_blank"
    rel="noreferrer"
    className="reveal group relative bg-background p-8 md:p-10 min-h-[320px] flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 hover:bg-surface"
    data-cursor-hover
  >
    <span className="absolute inset-0 flex items-center justify-center font-serif text-[22rem] leading-none text-primary/[0.06] select-none transition-all duration-500 group-hover:text-primary/20 group-hover:scale-110">
      T
    </span>
    <span className="relative font-mono text-xs tracking-[0.22em] uppercase text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
      More on GitHub
    </span>
    <span className="relative mt-3 font-serif italic text-2xl text-foreground/90">
      → archive.taran
    </span>
  </a>
);

export default Projects;
