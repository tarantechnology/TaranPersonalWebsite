import { useEffect } from "react";

/**
 * IntersectionObserver for `.reveal` / `.reveal-left`. Works with lazy-loaded
 * chunks: observes new elements when they mount (MutationObserver).
 */
const useReveal = () => {
  useEffect(() => {
    const seen = new WeakSet<Element>();

    if (!("IntersectionObserver" in window)) {
      const showAll = (root: ParentNode) => {
        root.querySelectorAll(".reveal, .reveal-left").forEach((el) => {
          el.classList.add("is-visible");
        });
      };
      showAll(document);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    const tryObserve = (el: Element) => {
      if (seen.has(el)) return;
      seen.add(el);
      if (el.classList.contains("reveal") || el.classList.contains("reveal-left")) {
        io.observe(el);
      }
    };

    const scan = (node: Node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const el = node as Element;
      if (el.matches(".reveal, .reveal-left")) tryObserve(el);
      el.querySelectorAll(".reveal, .reveal-left").forEach((child) => tryObserve(child));
    };

    document.querySelectorAll(".reveal, .reveal-left").forEach(tryObserve);

    const mo = new MutationObserver((records) => {
      for (const r of records) {
        r.addedNodes.forEach(scan);
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
};

export default useReveal;
