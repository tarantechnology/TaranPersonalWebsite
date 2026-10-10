import { Reveal, Words } from "@/components/drive/Reveal";

const entries = [
  { range: "Jun 2022 — Nov 2023", role: "Research Intern", company: "UNC Wilmington · Wilmington, NC", body: "Novel method to detect atrial fibrillation in real time. Under Dr. Cuxian Chen & Dr. Yishi Wang." },
  { range: "May 2023 — Sep 2023", role: "Research Intern", company: "WSPR Lab · Raleigh, NC", body: "Analyzed 250K+ virtual reality privacy concerns under Dr. Anupam Das." },
  { range: "2024 — Present", role: "Co-Founder", company: "Tabl · AI CAD generation", body: "Text-to-CAD solved. Backed by Christopher Klaus." },
  { range: "Sep 2024 — Present", role: "Lead Undergraduate Researcher", company: "Georgia Tech CHART Lab · Atlanta, GA", body: "Real-time ML pipelines that make technical cross-collaboration way less painful." },
  { range: "May 2025 — Jul 2025", role: "SDE Intern", company: "Georgia Tech Research Institute · Huntsville, AL", body: "Performance testing suite for the Air & Missile Defense division." },
  { range: "Jul 2025 — Sep 2025", role: "Software Engineer Intern", company: "Pally (YC S25) · San Francisco, CA", body: "$1.1M pre-seed. Full-stack, backend, infra and search, whatever was next to my name on the whiteboard." },
  { range: "May 2026 — Aug 2026", role: "ML Engineer Intern", company: "Snap Inc. · Palo Alto, CA", body: "Summer 2026. 👻", next: true },
];

/**
 * A tall section: the header sticks while the road signs in the 3D world
 * pass the car (WorldScene reads drive.expProgress). The list below the
 * fold is the readable, accessible version of the same stops.
 */
const Experience = () => {
  return (
    <section id="experience" data-drive data-sky="day" data-theme="light" data-label="Experience" data-clock="11:20" className="relative min-h-[320vh] text-hud">
      <div className="sticky top-0 flex h-screen flex-col justify-between pb-16 pt-32">
        <div className="container">
          <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">{"// 02 — Experience · 11:20, full daylight"}</Reveal>
          <h2 className="mt-6 font-serif text-5xl font-light leading-[0.95] tracking-tight md:text-6xl lg:text-7xl">
            <Words text="Past & Present." accent="Present" />
          </h2>
          <Reveal as="p" delay={0.2} className="mt-5 max-w-sm text-hud/75">
            Keep scrolling. Every stop is a sign on the road, and the last one is where Po's parked today.
          </Reveal>
        </div>
        <div className="container">
          <span className="holo-chip holo-chip--accent">7 stops · 2022 → 2026</span>
        </div>
      </div>

      <ol className="container relative -mt-[40vh] grid gap-4 pb-32 md:grid-cols-2 lg:grid-cols-3">
        {entries.map((e, i) => (
          <Reveal as="li" key={e.role + e.range} delay={(i % 3) * 0.08} className={`holo flex flex-col gap-2 p-6 ${e.next ? "holo--accent" : ""}`}>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">{e.range}{e.next ? " · Next" : ""}</p>
            <h3 className="font-serif text-[26px] font-light leading-[1.05]">{e.role}</h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-hud/60">{e.company}</p>
            <p className="text-sm leading-relaxed text-hud/75">{e.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
};

export default Experience;
