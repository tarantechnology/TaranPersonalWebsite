import { SIGNS } from "@/components/drive/WorldScene";

/**
 * A tall, mostly empty section: the road signs in the 3D world carry the
 * content (WorldScene reads drive.expProgress). The list is for screen
 * readers and search engines only.
 */
const Experience = () => {
  return (
    <section id="experience" data-drive data-sky="day" data-theme="light" data-label="Experience" data-clock="11:20" className="relative min-h-[340vh] text-hud">
      <div className="container pt-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">{"// 02 — Experience · 11:20"}</p>
      </div>
      <ol className="sr-only">
        {SIGNS.map((e) => (
          <li key={e.role + e.range}>
            {e.range}: {e.role}, {e.company}. {e.body}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Experience;
