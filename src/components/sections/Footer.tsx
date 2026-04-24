const Footer = () => {
  return (
    <footer className="relative border-t border-border bg-background overflow-hidden">
      {/* Giant faint T */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[28rem] leading-none text-primary/[0.04] select-none"
      >
        T
      </span>

      <div className="container relative grid grid-cols-1 md:grid-cols-3 items-center gap-6 py-10">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} Taran
        </p>

        <div className="text-center font-serif text-2xl">
          <span className="text-primary">T</span>
          <span className="text-foreground/60">aran</span>
        </div>

        <p className="font-mono text-xs tracking-[0.22em] uppercase text-muted-foreground text-center md:text-right">
          Think · Teach · Transform
        </p>
      </div>
    </footer>
  );
};

export default Footer;
