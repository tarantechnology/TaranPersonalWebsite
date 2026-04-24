const items = [
  "Systems Thinking",
  "Algorithm Design",
  "Technical Writing",
  "Open Source",
  "Content Creation",
  "CS Education",
  "Distributed Systems",
  "Developer Community",
];

const Marquee = () => {
  // Duplicate so the -50% translate creates a seamless loop
  const loop = [...items, ...items];
  return (
    <section
      aria-label="Topics"
      className="relative border-y border-border bg-surface overflow-hidden py-8"
    >
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {loop.map((item, i) => (
          <div key={i} className="flex items-center px-10">
            <span className="font-serif italic text-3xl md:text-5xl text-foreground/90">
              {item}
            </span>
            <span className="ml-10 h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Marquee;
