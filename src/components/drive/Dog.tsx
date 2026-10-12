import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const MOODS = ["Waiting by the car.", "Tail going.", "Tail going.", "Very good dog.", "Very good dog.", "Rolled over. You win."];
const KEY = "po-dog-pets";

/**
 * Footer easter egg. A paw print calls the dog; every click on him is a pet.
 */
const Dog = () => {
  const [open, setOpen] = useState(false);
  const [pets, setPets] = useState(0);

  useEffect(() => {
    try {
      const v = parseInt(localStorage.getItem(KEY) || "0", 10);
      if (!Number.isNaN(v)) setPets(v);
    } catch {
      /* private mode */
    }
  }, []);

  const pet = () => {
    const n = pets + 1;
    setPets(n);
    try {
      localStorage.setItem(KEY, String(n));
    } catch {
      /* ignore */
    }
  };

  const wag = pets % 2 === 1;
  const mood = MOODS[Math.min(pets, MOODS.length - 1)];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Send the dog home" : "Call the dog"}
        aria-pressed={open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors duration-300 hover:border-tan"
        data-cursor-hover
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
          <circle cx="7" cy="8" r="2.4" fill="#c9a97a" />
          <circle cx="12" cy="6" r="2.4" fill="#c9a97a" />
          <circle cx="17" cy="8" r="2.4" fill="#c9a97a" />
          <path d="M12 10.5C8 10.5 5.5 14 6.5 17c1 3 3.5 2 5.5 2s4.5 1 5.5-2c1-3-1.5-6.5-5.5-6.5z" fill="#c9a97a" />
        </svg>
      </button>

      {createPortal(
      <div
        className="pointer-events-none fixed bottom-0 right-4 z-[50] flex flex-col items-end gap-2 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] md:right-10"
        style={{ transform: open ? "translateY(0)" : "translateY(110%)" }}
        aria-hidden={!open}
      >
        <div className="mr-6 rounded-sm border border-border bg-background/90 px-3 py-2 text-right backdrop-blur">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Pets: {pets}</p>
          <p className="font-serif italic text-lg leading-tight text-foreground">{mood}</p>
        </div>
        <button
          type="button"
          onClick={pet}
          aria-label="Pet the dog"
          tabIndex={open ? 0 : -1}
          className="pointer-events-auto block h-[170px] w-[170px] bg-transparent p-0"
          data-cursor-hover
        >
          <svg viewBox="0 0 300 300" width="170" height="170" aria-hidden className="block">
            <ellipse cx="160" cy="286" rx="110" ry="8" fill="#000" opacity="0.5" />
            <path
              d={wag ? "M70 215Q30 170 48 118" : "M70 215Q28 220 22 262"}
              stroke="#c9a97a"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
              style={{ transition: "d 300ms ease-out" }}
            />
            <ellipse cx="130" cy="222" rx="82" ry="58" fill="#c9a97a" />
            <ellipse cx="192" cy="226" rx="50" ry="60" fill="#d4b588" />
            <rect x="170" y="238" width="24" height="52" rx="12" fill="#c9a97a" />
            <rect x="206" y="238" width="24" height="52" rx="12" fill="#c9a97a" />
            <ellipse cx="182" cy="290" rx="18" ry="7" fill="#b89768" />
            <ellipse cx="218" cy="290" rx="18" ry="7" fill="#b89768" />
            <circle cx="212" cy="118" r="50" fill="#c9a97a" />
            <ellipse cx="176" cy="128" rx="18" ry="36" fill="#a8865a" transform="rotate(-18 176 128)" />
            <ellipse cx="250" cy="136" rx="30" ry="20" fill="#dcc29c" />
            <circle cx="274" cy="130" r="8" fill="#121212" />
            <circle cx="228" cy="108" r="6" fill="#121212" />
            <circle cx="230" cy="106" r="2" fill="#fff" />
            <path d="M236 150q10 10 22 0" stroke="#121212" strokeWidth="3" strokeLinecap="round" fill="none" />
            <ellipse cx="206" cy="170" rx="36" ry="10" fill="none" stroke="#e74c3c" strokeWidth="8" />
            <circle cx="222" cy="182" r="7" fill="#f0ece4" stroke="#e74c3c" strokeWidth="2" />
            {pets >= 1 && <path d="M268 60c0-10 14-12 16-2 2-10 16-8 16 2 0 12-16 22-16 22s-16-10-16-22z" fill="#e74c3c" />}
            {pets >= 3 && <path d="M236 30c0-8 11-10 13-2 2-8 13-6 13 2 0 10-13 18-13 18s-13-8-13-18z" fill="#e74c3c" />}
            {pets >= 5 && <path d="M286 10c0-6 8-8 10-2 2-6 10-4 10 2 0 8-10 14-10 14s-10-6-10-14z" fill="#e74c3c" />}
          </svg>
        </button>
      </div>,
      document.body
      )}
    </>
  );
};

export default Dog;
