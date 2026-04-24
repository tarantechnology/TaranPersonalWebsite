import { Play } from "lucide-react";

const videos = [
  { views: "2.4M", title: "How databases really work — from disk to query plan", featured: true },
  { views: "890K", title: "The CAP theorem, properly explained" },
  { views: "640K", title: "Building a load balancer in 200 lines of Go" },
  { views: "412K", title: "Why your indexes are slower than you think" },
  { views: "1.1M", title: "A practical guide to system design interviews" },
];

const Content = () => {
  return (
    <section id="content" className="relative py-32 md:py-40 bg-surface">
      <div className="container">
        <div className="reveal max-w-4xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="label-mono">// 04 — Content</p>
            <h2 className="mt-6 font-serif font-light text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
              Lessons, <span className="italic text-primary">on tape</span>.
            </h2>
          </div>
          <p className="text-foreground/70 max-w-sm text-lg">
            Long-form videos for engineers who want the whole picture, not the headline.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-px md:bg-border md:[&>*]:bg-surface">
          {videos.map((v, i) => (
            <VideoCard key={i} {...v} index={i} featured={v.featured} />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <a
            href="#"
            className="group inline-flex items-center gap-3 font-mono text-xs tracking-[0.22em] uppercase border-b border-primary/40 pb-1 transition-colors duration-300 hover:text-primary hover:border-primary"
          >
            View all videos
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

const VideoCard = ({
  views, title, index, featured,
}: { views: string; title: string; index: number; featured?: boolean }) => (
  <article
    className={`reveal group relative overflow-hidden ${
      featured ? "md:row-span-2 md:col-span-1" : ""
    }`}
    style={{ transitionDelay: `${index * 80}ms` }}
    data-cursor-hover
  >
    <div className={`relative ${featured ? "aspect-[3/4] md:aspect-auto md:h-full" : "aspect-video"} bg-background overflow-hidden`}>
      {/* Hatch placeholder */}
      <div className="absolute inset-0 hatch-pattern" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-crimson/30 mix-blend-overlay opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Big T watermark */}
      <span className="absolute inset-0 flex items-center justify-center font-serif text-[16rem] leading-none text-foreground/[0.04] select-none">
        T
      </span>

      {featured && (
        <span className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.22em] uppercase border border-primary text-primary px-2 py-1 bg-background/60 backdrop-blur">
          Featured
        </span>
      )}

      {/* Play button */}
      <button
        type="button"
        aria-label={`Play: ${title}`}
        className="absolute right-5 bottom-5 inline-flex h-14 w-14 items-center justify-center rounded-full border border-primary text-primary bg-background/40 backdrop-blur transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110"
      >
        <Play className="h-5 w-5 fill-current" />
      </button>

      {/* Bottom info overlay */}
      <div className="absolute inset-x-5 bottom-5 right-24">
        <p className="font-mono text-xs tracking-[0.18em] uppercase text-primary">{views} views</p>
        <h3 className={`mt-2 font-serif font-light leading-tight text-foreground ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}>
          {title}
        </h3>
      </div>
    </div>
  </article>
);

export default Content;
