import { Play } from "lucide-react";

const videos = [
  {
    views: "7.3M",
    title: "The Tank PC...",
    href: "https://www.tiktok.com/@tarantech/video/7171166357948468526?is_from_webapp=1&sender_device=pc&web_id=7601218732539741710",
    thumbnail: "/tiktok-thumbs/7171166357948468526.jpg",
  },
  {
    views: "250K+",
    title: "In partnership with @TikTok",
    href: "https://www.tiktok.com/@tarantech/video/7042403432635845934",
    thumbnail: "/tiktok-thumbs/7042403432635845934.jpg",
  },
  {
    views: "1.2M",
    title: "Solid gaming experience overall (sponsored by @NZXT)",
    href: "https://www.tiktok.com/@tarantech/video/7170008975004519723",
    thumbnail: "/tiktok-thumbs/7170008975004519723.jpg",
  },
  {
    views: "851K",
    title: "Latest gaming deals for Intel Gamer Days (sponsored by @Intel Gaming)",
    href: "https://www.tiktok.com/@tarantech/video/7135925927522979115",
    thumbnail: "/tiktok-thumbs/7135925927522979115.jpg",
  },
];

const Content = () => {
  return (
    <section id="content" className="relative py-24 md:py-28 bg-background">
      <div className="container">
        <div className="reveal max-w-4xl flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="label-mono">// 04 — Content</p>
            <h2 className="mt-6 font-serif font-light text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
              Where it all <span className="italic text-primary">started</span>.
            </h2>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {videos.map((v, i) => (
            <VideoCard key={v.href} {...v} index={i} />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <a
            href="https://www.tiktok.com/@tarantech"
            target="_blank"
            rel="noreferrer"
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
  views, title, href, thumbnail, index,
}: { views: string; title: string; href: string; thumbnail: string; index: number }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="reveal group relative overflow-hidden rounded-md border border-border/60 bg-background"
    style={{ transitionDelay: `${index * 80}ms` }}
    data-cursor-hover
  >
    <div className="relative aspect-[9/16] bg-background overflow-hidden">
      <img
        src={thumbnail}
        alt={title}
        className="absolute inset-0 h-full w-full object-contain bg-background transition-transform duration-500 group-hover:scale-[1.02]"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-crimson/30 mix-blend-overlay opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />

      {/* Play button */}
      <span
        aria-hidden
        className="absolute right-3 bottom-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary bg-background/50 backdrop-blur transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110"
      >
        <Play className="h-4 w-4 fill-current" />
      </span>

      {/* Bottom info overlay */}
      <div className="absolute inset-x-3 bottom-3 pr-12">
        <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-primary">{views} views</p>
        <h3 className="mt-1 font-serif font-light leading-tight text-foreground text-sm md:text-base line-clamp-3">
          {title}
        </h3>
      </div>
    </div>
  </a>
);

export default Content;
