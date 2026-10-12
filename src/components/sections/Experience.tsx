import { Reveal, Words } from "@/components/drive/Reveal";

const entries = [
  { range: "May 2026 — Aug 2026", role: "ML Engineer Intern", company: "Snap Inc. · Palo Alto, CA", body: "Worked on Spotlight recommendation models, from ranking and reward modeling to inference optimization. Shipped experiments that improved engagement while cutting ML serving and training costs.", next: true },
  { range: "Jul 2025 — Sep 2025", role: "Software Engineer Intern", company: "Pally (YC S25) · San Francisco, CA", body: "$1.1M pre-seed. Full-stack, backend, infra and search, whatever was next to my name on the whiteboard." },
  { range: "May 2025 — Jul 2025", role: "SDE Intern", company: "Georgia Tech Research Institute · Huntsville, AL", body: "Performance testing suite for the Air & Missile Defense division." },
  { range: "Sep 2024 — Present", role: "Lead Undergraduate Researcher", company: "Georgia Tech CHART Lab · Atlanta, GA", body: "Real-time ML pipelines that make technical cross-collaboration way less painful." },
  { range: "2024 — Present", role: "Co-Founder", company: "Tabl · AI CAD generation", body: "Text-to-CAD solved. Backed by Christopher Klaus." },
  { range: "May 2023 — Sep 2023", role: "Research Intern", company: "WSPR Lab · Raleigh, NC", body: "Analyzed 250K+ virtual reality privacy concerns under Dr. Anupam Das." },
  { range: "Jun 2022 — Nov 2023", role: "Research Intern", company: "UNC Wilmington · Wilmington, NC", body: "Novel method to detect atrial fibrillation in real time. Under Dr. Cuxian Chen & Dr. Yishi Wang." },
];

const Experience = () => {
  return (
    <section id="experience" data-drive data-sky="day" data-theme="light" data-label="Experience" data-clock="11:20" className="relative min-h-screen pb-24 pt-32 text-hud">
      <div className="container">
        <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">{"// 02 — Experience · 11:20, full daylight"}</Reveal>
        <h2 className="mt-6 font-serif text-5xl font-light leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
          <Words text="Past & Present." accent="Present" />
        </h2>

        <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((e, i) => (
            <Reveal as="li" key={e.role + e.range} delay={(i % 3) * 0.08} y={36} className={`holo flex flex-col gap-2.5 p-6 ${e.next ? "holo--accent" : ""}`}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">{e.range}{e.next ? " · Next" : ""}</p>
              <h3 className="font-serif text-[27px] font-light leading-[1.05]">{e.role}</h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-hud/60">{e.company}</p>
              <p className="text-sm leading-relaxed text-hud/75">{e.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
