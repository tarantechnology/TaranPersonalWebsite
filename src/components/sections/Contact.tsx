import { ArrowRight } from "lucide-react";

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
    <section id="contact" className="relative py-24 md:py-28">
      <div className="container grid gap-16 lg:grid-cols-12 items-start">
        <div className="lg:col-span-6 reveal">
          <p className="label-mono">// 05 — Contact</p>
          <h2 className="mt-6 font-serif font-light leading-[0.85] tracking-[-0.03em] text-7xl md:text-8xl lg:text-[10rem]">
            Let's
            <br />
            <span className="italic text-primary">Talk</span>
            <br />
            Tech.
          </h2>
          <p className="mt-10 max-w-md text-lg text-foreground/70 leading-relaxed">
            Open to interesting engineering work, speaking, and the occasional collaboration.
            I read everything; I reply to most.
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 reveal" style={{ transitionDelay: "120ms" }}>
          <ul className="border-t border-border">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-6 py-6 border-b border-border transition-colors duration-300 hover:border-primary"
                  data-cursor-hover
                >
                  <span className="font-mono text-xs tracking-[0.22em] uppercase text-primary w-24 shrink-0">
                    {l.label}
                  </span>
                  <span className="flex-1 font-serif text-2xl md:text-3xl text-foreground/95 transition-colors duration-300 group-hover:text-primary">
                    {l.value}
                  </span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:text-primary group-hover:translate-x-2" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Contact;
