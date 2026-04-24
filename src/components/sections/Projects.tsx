import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    n: "01",
    title: "Network Traffic Forecasting with Multi-Layer LSTMs",
    body: "Built an end-to-end time-series forecasting pipeline on 500K+ rows and improved model error by 14.9% with distributed stacked LSTMs.",
    tags: ["Python", "TensorFlow", "JAX", "Pandas"],
    href: "https://morgantonscientific.ncssm.edu/articles/TUVN1118",
  },
  {
    n: "02",
    title: "AI-Driven Financial Market Anomaly Detector",
    body: "Trained an XGBoost-based anomaly detector on 1M+ market datapoints and built an end-to-end inference pipeline with PCA, RFE, and deployment via Next.js.",
    tags: ["Python", "XGBoost", "scikit-learn", "Next.js"],
    href: "https://github.com/tarantechnology/MarketAnomalyDetection",
  },
  {
    n: "03",
    title: "Tabl - AI CAD Generation Software",
    body: "Shipped a containerized text-to-CAD pipeline supporting 500+ concurrent generations and a multi-stage RAG system over 15K+ CAD docs.",
    tags: ["React", "AWS", "TypeScript", "Redis", "Three.js"],
    href: "https://www.trytabl.ai/",
  },
  {
    n: "04",
    title: "AI Executive Assistant Agent (HackMIT)",
    body: "Built an iMessage-accessible GPT agent with LangChain orchestration and per-user knowledge graphs from Gmail, Outlook, and Notion data.",
    tags: ["TypeScript", "Python", "LangChain", "MCP", "Neo4j"],
    href: "https://github.com/ProdText",
  },
  {
    n: "05",
    title: "MacTrack - AI Meal & Macro Tracker (HackGT)",
    body: "Built a React Native app that scans meals with GPT-4o and a Flask + MongoDB backend for fast nutrition logging and sync.",
    tags: ["React Native", "Flask", "MongoDB", "Python", "GPT-4o"],
    href: "https://github.com/tarantechnology/mactrack",
  },
  {
    n: "06",
    title: "More Projects",
    body: "More shipped work across ML, infra, and product engineering lives on my GitHub.",
    tags: ["GitHub", "Open Source", "AI", "Systems"],
    href: "https://github.com/tarantechnology",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="relative py-24 md:py-28">
      <div className="container">
        <div className="reveal max-w-4xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="label-mono">// 03 — Selected work</p>
            <h2 className="mt-6 font-serif font-light text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
              Projects, <span className="italic text-primary">open-source</span> (mostly).
            </h2>
          </div>
        </div>

        <div
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-primary/30"
          style={{ gap: "1px" }}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.n} {...p} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({
  n, title, body, tags, href, delay,
}: { n: string; title: string; body: string; tags: string[]; href: string; delay: number }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
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
  </a>
);

export default Projects;
