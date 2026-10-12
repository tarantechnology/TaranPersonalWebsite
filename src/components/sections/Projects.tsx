import { ArrowUpRight } from "lucide-react";
import { Reveal, Words } from "@/components/drive/Reveal";

const projects = [
  { n: "01", meta: "2022", title: "Network traffic forecasting with multi-layer LSTMs", body: "End-to-end time-series pipeline on 500K+ rows; improved model error by 14.9% with distributed stacked LSTMs.", tags: ["Python", "TensorFlow", "JAX"], href: "https://morgantonscientific.ncssm.edu/articles/TUVN1118" },
  { n: "02", meta: "", title: "AI-driven financial market anomaly detector", body: "XGBoost detector on 1M+ market datapoints with a PCA and RFE inference pipeline, deployed via Next.js.", tags: ["XGBoost", "scikit-learn", "Next.js"], href: "https://github.com/tarantechnology/MarketAnomalyDetection" },
  { n: "03", meta: "In focus", title: "Tabl, AI CAD generation", body: "Containerized text-to-CAD pipeline for 500+ concurrent generations and a multi-stage RAG system over 15K+ CAD docs.", tags: ["React", "AWS", "Three.js"], href: "https://www.trytabl.ai/", focus: true },
  { n: "04", meta: "HackMIT", title: "AI executive assistant agent", body: "iMessage-accessible GPT agent with LangChain orchestration and per-user knowledge graphs from Gmail, Outlook and Notion.", tags: ["LangChain", "MCP", "Neo4j"], href: "https://github.com/ProdText" },
  { n: "05", meta: "2026", title: "Sideby, Netflix with a friend", body: "Chrome extension that syncs Netflix, Disney+ and Hulu playback across two accounts, with a WebRTC camera that floats over the movie. Never screen-shares or touches the stream; it only syncs the clocks.", tags: ["TypeScript", "Chrome MV3", "WebRTC", "WebSockets"], href: "https://github.com/tarantechnology/SideBy" },
  { n: "06", meta: "Unexposed", title: "More on the roll.", body: "More shipped work across ML, infra and product lives on GitHub.", tags: ["@tarantechnology"], href: "https://github.com/tarantechnology", more: true },
];

const Projects = () => {
  return (
    <section id="projects" data-drive data-sky="day" data-theme="light" data-label="Projects" data-clock="13:05" className="relative min-h-screen pb-24 pt-32 text-hud">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">{"// 03 — Selected work · 13:05"}</Reveal>
            <h2 className="mt-6 font-serif text-5xl font-light leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
              <Words text="Projects, open-source (mostly)." accent="open-source" />
            </h2>
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal as="li" key={p.n} delay={i * 0.07} y={36}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className={`holo group relative flex h-full flex-col gap-3.5 p-6 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1.5 ${p.focus ? "holo--accent" : ""}`}
                data-cursor-hover
              >
                <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${p.focus ? "text-primary" : "text-hud/60"}`}>Frame {p.n}{p.meta ? ` · ${p.meta}` : ""}</span>
                <h3 className={`font-serif font-light leading-[1.05] transition-colors duration-300 group-hover:text-primary ${p.more ? "text-4xl italic" : "text-[27px]"} ${p.focus ? "text-primary" : ""}`}>{p.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-hud/75">{p.body}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <li key={t} className="holo-chip">{t}</li>
                  ))}
                </ul>
                <span className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/60 text-primary transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Projects;
