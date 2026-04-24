import { ArrowRight } from "lucide-react";

const links = [
  { label: "Email", value: "hello@taran.dev", href: "mailto:hello@taran.dev" },
  { label: "Twitter", value: "@taran", href: "https://twitter.com" },
  { label: "YouTube", value: "youtube.com/@taran", href: "https://youtube.com" },
  { label: "LinkedIn", value: "in/taran", href: "https://linkedin.com" },
  { label: "GitHub", value: "github.com/taran", href: "https://github.com" },
];

const Contact = () => {
  return (
    <section id="contact" className="relative py-32 md:py-44">
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
