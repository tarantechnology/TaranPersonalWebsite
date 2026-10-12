import { Reveal, Words } from "@/components/drive/Reveal";

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col gap-1.5">
    <span className="font-serif text-4xl font-light leading-none text-hud md:text-[40px]">{value}</span>
    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-hud/60">{label}</span>
  </div>
);

const Hero = () => {
  return (
    <section id="hero" data-drive data-sky="dawn" data-theme="dark" data-label="Hello" data-clock="05:48" className="relative flex min-h-screen flex-col justify-center pb-24 pt-32 text-hud">
      <div className="container relative z-10">
        <div className="max-w-3xl lg:max-w-[46%]">
          <Reveal as="p" delay={0.2} className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
            {"// 00 — Hello · 05:48, before sunrise"}
          </Reveal>
          <h1 className="mt-7 font-serif font-light leading-[0.85] tracking-[-0.04em] text-[clamp(4.6rem,11vw,10rem)]">
            <Words text="Hi, I'm Taran." accent="Taran" delay={0.35} />
          </h1>
          <Reveal as="p" delay={0.9} className="mt-8 max-w-xl font-serif text-2xl font-light italic leading-[1.15] text-hud/90 md:text-[32px]">
            I like to build &amp; create. This site is one day's drive, start to finish.
          </Reveal>
          <Reveal delay={1.15} className="holo mt-10 inline-flex flex-wrap items-center gap-x-8 gap-y-4 px-6 py-5">
            <Stat value="400K+" label="Followers" />
            <span className="hidden h-11 w-px bg-hud/25 sm:block" />
            <Stat value="3+" label="Years experience" />
            <span className="hidden h-11 w-px bg-hud/25 sm:block" />
            <Stat value="10+" label="Projects shipped" />
          </Reveal>
        </div>
      </div>

      <Reveal delay={1.6} className="absolute bottom-10 left-6 z-10 hidden items-center gap-4 md:left-14 md:flex">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-hud/70">Scroll to drive</span>
        <span className="block h-px w-16 origin-left bg-primary animate-scroll-line-x" />
      </Reveal>
      <Reveal delay={1.6} className="absolute bottom-10 right-6 z-10 hidden md:right-14 md:block">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-hud/70">CS @ Georgia Tech · ML @ Snap, summer 2026</p>
      </Reveal>
    </section>
  );
};

export default Hero;
