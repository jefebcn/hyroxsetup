"use client";

import { useEffect } from "react";

/**
 * Progressive-enhancement scroll reveal. On mount it marks <html> so the CSS
 * hiding rules kick in (no-JS users always see content), then fades each
 * `.reveal` element up as it scrolls into view. Runs once per page.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("reveal-in"));
      return;
    }

    root.classList.add("js-reveal");
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            obs.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));

    // Safety net: never leave content hidden if the observer misbehaves
    // (some mobile browsers), and reveal anything already on screen.
    const revealVisible = () => {
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95) el.classList.add("reveal-in");
      }
    };
    revealVisible();
    const failSafe = window.setTimeout(() => {
      els.forEach((el) => el.classList.add("reveal-in"));
    }, 1600);

    return () => {
      window.clearTimeout(failSafe);
      io.disconnect();
    };
  }, []);

  return null;
}
