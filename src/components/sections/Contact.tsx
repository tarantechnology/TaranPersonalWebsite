import { ArrowRight } from "lucide-react";
import { Reveal, Words } from "@/components/drive/Reveal";

const links = [
  { label: "Email", value: "tpuvvala@gatech.edu", href: "mailto:tpuvvala@gatech.edu" },
  { label: "X", value: "@taran_tech", href: "https://x.com/taran_tech" },
  { label: "YouTube", value: "@tarantech", href: "https://www.youtube.com/tarantech" },
  { label: "LinkedIn", value: "in/taran-puvvala", href: "https://www.linkedin.com/in/taran-puvvala-747607289/" },
  { label: "GitHub", value: "@tarantechnology", href: "https://github.com/tarantechnology" },
  { label: "TikTok", value: "@tarantech", href: "https://www.tiktok.com/@tarantech" },
];

const Contact = () => {
  return (
    <section id="contact" data-drive data-sky="golden" data-theme="dark" data-label="Contact" data-clock="19:12" className="relative min-h-screen pb-24 pt-32 text-hud md:pt-40">
      <div className="container grid items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.22em] text-hud">{"// 06 — Contact · 19:12, golden hour"}</Reveal>
          <h2 className="mt-6 font-serif font-light leading-[0.85] tracking-[-0.03em] text-7xl md:text-8xl lg:text-[9rem]">
            <Words text="Let's" />
            <br />
            <span className="italic text-primary"><Words text="Talk" delay={0.1} /></span>
            <br />
            <Words text="Tech." delay={0.2} />
          </h2>
          <Reveal as="p" delay={0.3} className="mt-8 max-w-md text-lg leading-relaxed text-hud/85">
            Open to interesting engineering work, speaking, and the occasional collaboration. I read everything; I reply to most.
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
          <Reveal delay={0.1} className="holo p-2">
            <ul>
              {links.map((l, i) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-5 border-b border-hud/15 px-4 py-4 text-hud transition-colors duration-300 last:border-b-0 hover:bg-hud/5"
                    data-cursor-hover
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    <span className="w-20 shrink-0 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">{l.label}</span>
                    <span className="flex-1 font-serif text-2xl font-light md:text-[26px]">{l.value}</span>
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
