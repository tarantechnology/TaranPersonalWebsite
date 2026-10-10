import { useEffect, useState } from "react";
import { scrollToId } from "@/lib/motion";

const links = [
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Content", id: "content" },
  { label: "Blog", id: "blog" },
  { label: "Contact", id: "contact" },
];

const Nav = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[58]">
      <div className="flex h-20 items-center justify-between px-6 md:px-14">
        <a href="#hero" onClick={go("hero")} aria-label="Taran, home" className="flex items-center gap-3 transition-transform duration-300 hover:-translate-y-0.5" data-cursor-hover>
          <img src="/tarantech-logo-cropped.png" alt="TaranTech" className="logo-dark h-9 w-auto opacity-90" />
          <span className="logo-light hidden items-center gap-3 font-mono text-[12px] uppercase tracking-[0.26em] text-ink">
            <img src="/favicon.png" alt="" className="h-8 w-8 rounded-md" />
            TaranTech
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} onClick={go(l.id)} className="group relative font-mono text-[11px] uppercase tracking-[0.22em] text-hud/70 transition-colors duration-300 hover:text-hud" data-cursor-hover>
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#contact" onClick={go("contact")} className="hidden rounded-sm border border-primary/70 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-hud transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground md:inline-flex" data-cursor-hover>
            Get in touch
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-hud/30 text-hud lg:hidden"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h10" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className="fixed inset-0 top-20 z-[57] bg-background/95 backdrop-blur transition-opacity duration-500 lg:hidden"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none" }}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-2 px-6 pt-8">
          {links.map((l, i) => (
            <li key={l.id} style={{ transition: `transform 600ms cubic-bezier(.22,1,.36,1) ${i * 50}ms, opacity 400ms ${i * 50}ms`, transform: open ? "translateY(0)" : "translateY(24px)", opacity: open ? 1 : 0 }}>
              <a href={`#${l.id}`} onClick={go(l.id)} className="flex items-baseline justify-between border-b border-border py-5 text-foreground" tabIndex={open ? 0 : -1}>
                <span className="font-serif text-4xl font-light">{l.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">0{i + 1}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Nav;
