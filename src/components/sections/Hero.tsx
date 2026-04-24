import DotGridT from "@/components/DotGridT";

const Hero = () => {
  return (
    <section id="top" className="relative min-h-screen w-full overflow-hidden">
      {/* Animated dot grid */}
      <div className="absolute inset-0">
        <DotGridT />
      </div>

      {/* Faint giant T watermark */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <span className="font-serif font-light text-[58vw] leading-none text-primary/[0.04] select-none">
          T
        </span>
      </div>

      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, hsl(var(--background)) 95%)" }}
      />

      {/* Content */}
      <div className="container relative z-10 min-h-screen flex flex-col justify-center pt-24 pb-32">
        <div className="max-w-5xl">
          <p
            className="label-mono opacity-0 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            // CS Engineer · Content Creator · Builder
          </p>

          <h1
            className="mt-6 font-serif font-light leading-[0.85] text-[clamp(5rem,18vw,18rem)] tracking-[-0.04em] opacity-0 animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="red-underline-T text-primary">T</span>
            <span>ARAN</span>
          </h1>

          <p
            className="mt-8 font-serif italic text-2xl md:text-3xl lg:text-4xl text-foreground/90 max-w-3xl text-balance opacity-0 animate-fade-up"
            style={{ animationDelay: "0.9s" }}
          >
            Engineering elegant systems —
            <br className="hidden sm:block" />
            and teaching the world how they work.
          </p>

          <div
            className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 opacity-0 animate-fade-up"
            style={{ animationDelay: "1.2s" }}
          >
            <Stat value="400K+" label="Followers" />
            <Divider />
            <Stat value="5+" label="Years Experience" />
            <Divider />
            <Stat value="20+" label="Projects Shipped" />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="label-mono">Scroll</span>
          <span className="block h-16 w-px bg-primary origin-top animate-scroll-line" />
        </div>
      </div>
    </section>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div>
    <div className="font-serif text-3xl md:text-4xl text-foreground">{value}</div>
    <div className="label-mono mt-1">{label}</div>
  </div>
);

const Divider = () => <span className="hidden sm:block h-10 w-px bg-border" />;

export default Hero;
