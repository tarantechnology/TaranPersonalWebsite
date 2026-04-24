import { Play } from "lucide-react";

const skills = [
  "Swift/SwiftUI", "Java", "Python", "C/C++", "C#",
  "Go", "JavaScript", "TypeScript", "SQL", "Bash", "CUDA",
  "PyTorch", "TensorFlow", "JAX", "scikit-learn",
  "React", "FastAPI", "LangChain", "Tauri",
  "PostgreSQL", "MongoDB", "Snowflake", "Neo4j",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Linux",
];

const About = () => {
  return (
    <section id="about" className="relative py-24 md:py-28 bg-noise">
      <div className="container grid gap-16 md:gap-24 lg:grid-cols-12 items-start">
        <div className="lg:col-span-7 reveal">
          <p className="label-mono">// 01 — About</p>
          <h2 className="mt-6 font-serif font-light text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-balance">
             {/* Hey<span className="italic text-primary">!</span>*/}👋
          </h2>

          <div className="mt-10 max-w-2xl space-y-6 text-lg text-foreground/80 leading-relaxed">
  <p>
    I'm Taran, a computer science student at Georgia Tech who got into tech an unconventional way.
    I spent years obsessing over hardware, software, and why some products just felt better to use than others.
    That turned into making videos on TikTok and YouTube, where I built a community of
    <span className="text-foreground"> 400,000+ people</span>.
  </p>
  <p>
    Now I’m more interested in building than reviewing. I spend most of my time working on
    <span className="text-foreground"> AI systems, useful software, and products people actually come back to daily</span>.
    Same curiosity, different output.
  </p>
</div>

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
            <a
              href="https://www.youtube.com/watch?v=NE1GqwGmSwE"
              target="_blank"
              rel="noreferrer"
              className="group relative block rounded-md border border-primary/60 p-1 transition-colors duration-300 hover:border-primary"
              data-cursor-hover
            >
              <img
                src="/youtube-feature-thumb.png"
                alt="YouTube video thumbnail"
                className="w-full rounded-sm border border-border object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                loading="lazy"
                decoding="async"
              />
              <span className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-primary/40 ring-inset" />
              <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-primary bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur">
                <Play className="h-3 w-3 fill-current" />
                Watch
              </span>
            </a>
            <p className="mt-10 text-center font-serif italic text-2xl md:text-3xl text-foreground/90">
              Day One
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
