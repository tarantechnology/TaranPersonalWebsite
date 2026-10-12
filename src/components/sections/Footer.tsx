import Dog from "@/components/drive/Dog";
import { scrollToId } from "@/lib/motion";

const links = [
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Content", id: "content" },
  { label: "Blog", id: "blog" },
  { label: "Contact", id: "contact" },
];

const Footer = () => {
  return (
    <footer className="relative pb-20 pt-6 text-hud">
      <div className="container">
        <div className="holo flex flex-col gap-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToId("hero"); }} aria-label="TaranTech home" data-cursor-hover>
              <img src="/tarantech-logo-cropped.png" alt="TaranTech" className="h-9 w-auto opacity-90" />
            </a>
            <ul className="flex flex-wrap gap-6">
              {links.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); scrollToId(l.id); }} className="font-mono text-[11px] uppercase tracking-[0.22em] text-hud/60 transition-colors duration-300 hover:text-hud" data-cursor-hover>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-hud/15 pt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-hud/60">© {new Date().getFullYear()} Taran Puvvala · Built after dark</p>
            <div className="inline-flex items-center gap-3.5 font-serif text-xl italic text-hud/70">
              thanks for looking this far down
              <Dog />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
