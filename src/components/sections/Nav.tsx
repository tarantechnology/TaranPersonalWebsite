import { useEffect, useState } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Content", href: "#content" },
  { label: "Contact", href: "#contact" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-background/92 border-b border-primary/30"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <a
          href="#top"
          className="transition-transform duration-300 hover:-translate-y-0.5"
          aria-label="Taran — home"
        >
          <img
            src="/tarantech-logo-cropped.png"
            alt="TaranTech"
            className="h-10 w-auto object-contain opacity-90"
          />
        </a>
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground transition-colors duration-300 hover:text-foreground relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="hidden md:inline-flex font-mono text-[11px] tracking-[0.22em] uppercase border border-primary/60 px-4 py-2 text-foreground transition-all duration-300 hover:bg-primary hover:border-primary"
        >
          Get in touch
        </a>
      </div>
    </nav>
  );
};

export default Nav;
