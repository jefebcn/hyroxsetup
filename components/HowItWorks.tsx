"use client";

import { useEffect, useState } from "react";
import { MousePointerClick, Zap, Wrench } from "lucide-react";

const STEPS = [
  {
    round: "Round 01",
    icon: <MousePointerClick />,
    title: "Pick your weapon",
    text: "Browse the wall and choose the neon that fits your loadout.",
    points: 500,
  },
  {
    round: "Round 02",
    icon: <Zap />,
    title: "Press & hold to buy",
    text: "Hold the buy button — just like the game — and it drops in your cart.",
    points: 900,
  },
  {
    round: "Round 03",
    icon: <Wrench />,
    title: "Mount & glow",
    text: "Hang it, plug it in, dial the dimmer. Your room just got a Pack-a-Punch.",
    points: 1500,
  },
];

/**
 * Interactive, self-advancing "rounds" stepper — the wall-buy flow told like
 * Zombies rounds. Auto-plays, pauses on hover/focus, and each round is
 * clickable. The active round glows green (Element 115) and the progress bar
 * fills round by round.
 */
export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 3400);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      onMouseLeave={() => setPaused(false)}
      className="mx-auto max-w-6xl px-4 py-20"
    >
      <div className="mb-8 text-center">
        <span className="eyebrow justify-center">Three rounds</span>
        <h2 className="display mt-4 text-4xl sm:text-5xl">How it works</h2>
      </div>

      {/* progress bar */}
      <div className="mx-auto mb-8 flex max-w-md gap-1.5" aria-hidden>
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i <= active ? "bg-blood-bright" : "bg-line"
            }`}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.round}
              type="button"
              onClick={() => {
                setActive(i);
                setPaused(true);
              }}
              onMouseEnter={() => {
                setActive(i);
                setPaused(true);
              }}
              onFocus={() => {
                setActive(i);
                setPaused(true);
              }}
              aria-current={isActive}
              aria-label={`${s.round}: ${s.title}`}
              className={`card group relative overflow-hidden p-7 text-left transition-all duration-300 ${
                isActive
                  ? "-translate-y-1 border-blood/60 bg-elevated shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]"
                  : "hover:-translate-y-0.5 hover:border-line"
              }`}
            >
              {/* big round number */}
              <span
                className="display absolute right-5 top-4 text-5xl transition-colors duration-300"
                style={{
                  color: isActive ? "#7ed957" : "var(--color-line)",
                  textShadow: isActive ? "0 0 18px rgba(126,217,87,0.55)" : "none",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span
                className={`flex h-12 w-12 items-center justify-center rounded-lg border transition-all duration-300 [&>svg]:h-6 [&>svg]:w-6 ${
                  isActive
                    ? "border-blood/50 bg-blood/15 text-blood-bright"
                    : "border-line bg-elevated text-ash"
                }`}
              >
                {s.icon}
              </span>

              <span className="mt-5 block text-[11px] font-semibold uppercase tracking-[0.22em] text-ash">
                {s.round}
              </span>
              <h3 className="display mt-1 text-2xl text-bone">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ash">{s.text}</p>

              {/* themed points reward */}
              <span
                className={`mt-4 inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? "border-[#7ed957]/40 bg-[#7ed957]/10 text-[#7ed957]"
                    : "border-line bg-panel text-ash"
                }`}
              >
                +{s.points.toLocaleString()} pts
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
