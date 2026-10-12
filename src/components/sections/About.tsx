import { Play } from "lucide-react";
import { Reveal, Words } from "@/components/drive/Reveal";

const skills = [
  "Swift/SwiftUI", "Java", "Python", "C/C++", "C#", "Go", "JavaScript", "TypeScript", "SQL", "Bash", "CUDA",
  "PyTorch", "TensorFlow", "JAX", "scikit-learn", "React", "FastAPI", "LangChain", "Tauri",
  "PostgreSQL", "MongoDB", "Snowflake", "Neo4j", "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Linux",
];
const loves = ["Sony α7 IV", "Cayenne", "Sunsets"];

const About = () => {
  return (
    <section id="about" data-drive data-sky="day" data-theme="light" data-label="About" data-clock="07:40" className="relative min-h-screen pb-24 pt-32 text-hud md:pt-40">
      <div className="container grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6">
          <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">{"// 01 — About · 07:40, sun's up"}</Reveal>
          <h2 className="mt-6 font-serif text-5xl font-light leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
            <Words text="Same curiosity, different output." accent="output" />
          </h2>
          <Reveal delay={0.1} className="holo mt-10 max-w-2xl space-y-5 p-6 text-[17px] leading-relaxed text-hud/80 md:p-8">
            <p>
              I'm Taran, a computer science student at Georgia Tech who got into tech an unconventional way. I spent years obsessing over hardware, software, and why some products just felt better to use than others. That turned into videos on TikTok and YouTube, and a community of <strong className="font-medium text-hud">400,000+ people</strong>.
            </p>
            <p>
              Now I'm more interested in building than reviewing. Most of my time goes into <strong className="font-medium text-hud">AI systems, useful software, and products people actually come back to daily</strong>.
            </p>
          </Reveal>

          <Reveal delay={0.25} className="mt-8">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-hud/60">{"// Stack & interests"}</p>
            <ul className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <li key={s} className="holo-chip">{s}</li>
              ))}
              {loves.map((s) => (
                <li key={s} className="holo-chip holo-chip--accent">{s}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <Reveal delay={0.2}>
            <a href="https://www.youtube.com/watch?v=NE1GqwGmSwE" target="_blank" rel="noreferrer" className="holo group relative block p-4 transition-colors duration-300" data-cursor-hover>
              <div className="overflow-hidden">
                <img src="/youtube-feature-thumb.png" alt="Day One, the first YouTube video" className="block w-full transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]" loading="lazy" decoding="async" />
              </div>
              <span className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-full border border-primary bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur">
                <Play className="h-3 w-3 fill-current" /> Watch
              </span>
              <span className="absolute bottom-8 right-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white [text-shadow:0_1px_6px_rgba(0,0,0,.6)]">Shot 02 · 2019</span>
            </a>
          </Reveal>
          <Reveal as="p" delay={0.35} className="mt-6 text-center font-serif text-3xl font-light italic text-hud/80">
            Day One.
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default About;
