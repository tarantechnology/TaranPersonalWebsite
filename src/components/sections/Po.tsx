import { Reveal, Words } from "@/components/drive/Reveal";

const Spec = ({ k, v, accent }: { k: string; v: string; accent?: boolean }) => (
  <div className="flex flex-col gap-1.5">
    <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-hud/60">{k}</dt>
    <dd className={`font-serif text-3xl font-light leading-none md:text-4xl ${accent ? "text-primary" : ""}`}>{v}</dd>
  </div>
);

/** Last stop. The world camera orbits Po here. */
const Po = () => {
  return (
    <section id="po" data-drive data-sky="night" data-theme="dark" data-label="Po" data-clock="23:40" className="relative min-h-screen pb-28 pt-32 text-hud">
      <div className="container">
        <div className="max-w-xl">
          <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">{"// 07 — Btw · 23:40, last stop"}</Reveal>
          <h2 className="mt-6 font-serif font-light leading-[0.88] tracking-[-0.04em] text-6xl md:text-7xl lg:text-[7.5rem]">
            <Words text="This is Po." accent="Po" />
          </h2>
          <Reveal as="p" delay={0.15} className="mt-6 max-w-md font-serif text-2xl font-light italic leading-[1.15] text-hud/90 md:text-3xl">
            My 2014 Porsche Cayenne Diesel, now past 200K miles.
          </Reveal>
          <Reveal delay={0.25} className="holo mt-6 max-w-md p-6">
            <p className="leading-relaxed text-hud/80">
              He's got some problems, but I fix them as they come up. It's been a fun project, and he's the car you've been riding with this whole time.
            </p>
            <dl className="mt-6 flex flex-wrap gap-8">
              <Spec k="Model" v="2014 Porsche Cayenne" />
              <Spec k="Engine" v="3.0 V6 Diesel" />
              <Spec k="Odometer" v="200K+" accent />
            </dl>
          </Reveal>
          <Reveal as="p" delay={0.4} className="mt-6 max-w-md font-mono text-[10px] uppercase tracking-[0.2em] text-hud/50">
            3D model: "2011 Porsche Cayenne" by{" "}
            <a href="https://sketchfab.com/ddiaz-design" target="_blank" rel="noreferrer" className="text-hud/80 underline-offset-4 hover:underline">Ddiaz Design</a>, CC BY-NC-SA 4.0, the same generation as Po. Paint and interior recoloured to match.
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Po;
