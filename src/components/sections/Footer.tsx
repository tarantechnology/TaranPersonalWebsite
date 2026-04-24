const Footer = () => {
  return (
    <footer className="relative bg-background overflow-hidden">
      <div className="container relative grid grid-cols-1 md:grid-cols-3 items-center gap-6 py-8">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} Taran
        </p>

        <a href="#top" className="flex justify-center" aria-label="TaranTech home">
          <img
            src="/tarantech-logo-cropped.png"
            alt="TaranTech"
            className="h-9 w-auto object-contain opacity-90"
          />
        </a>

        <p className="font-mono text-xs tracking-[0.22em] uppercase text-muted-foreground text-center md:text-right">
          thanks for looking this far down
        </p>
      </div>
    </footer>
  );
};

export default Footer;
