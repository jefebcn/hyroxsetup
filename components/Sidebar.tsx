"use client";

import { useEffect, useState } from "react";
import {
  Footprints,
  Building2,
  Tent,
  MapPin,
  SlidersHorizontal,
  X,
  type LucideIcon,
} from "lucide-react";
import { HYROX } from "@/lib/hyrox-data";

export type LayerKey = "running" | "arena" | "village" | "stations";
export type LayerState = Record<LayerKey, boolean>;

interface ToggleConfig {
  key: LayerKey;
  emoji: string;
  label: string;
  sublabel: string;
  icon: LucideIcon;
  /** Accent color used when the toggle is active. */
  accent: string;
}

const TOGGLES: ToggleConfig[] = [
  {
    key: "running",
    emoji: "🏃",
    label: "1km Running Loop",
    sublabel: "Inclined outdoor track · Via Rancaglia",
    icon: Footprints,
    accent: HYROX.yellow,
  },
  {
    key: "arena",
    emoji: "🏟️",
    label: "Indoor Arena",
    sublabel: "Cardio Stations & Finish Line",
    icon: Building2,
    accent: HYROX.red,
  },
  {
    key: "village",
    emoji: "⛺",
    label: "Power Village",
    sublabel: "Heavy sleds & lifting · Stadium Parking",
    icon: Tent,
    accent: HYROX.turf,
  },
  {
    key: "stations",
    emoji: "📍",
    label: "Station Markers",
    sublabel: "8 workouts + Start & Finish",
    icon: MapPin,
    accent: HYROX.yellow,
  },
];

interface SidebarProps {
  layers: LayerState;
  onToggle: (key: LayerKey) => void;
}

export default function Sidebar({ layers, onToggle }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Collapse by default on small screens so the map is visible on load.
  // One-time responsive init synced to the viewport width.
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollapsed(true);
    }
  }, []);

  // --- Collapsed: compact branded toggle button ---
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label="Show event layers"
        className="absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full
                   border border-white/10 bg-black/60 px-3.5 py-2.5 shadow-lg
                   shadow-black/50 backdrop-blur-md transition-colors hover:bg-black/70
                   sm:left-4 sm:top-4"
      >
        <SlidersHorizontal className="h-4 w-4" style={{ color: HYROX.yellow }} />
        <span className="text-sm font-black uppercase tracking-tight text-white">
          HYRO<span style={{ color: HYROX.yellow }}>X</span>
        </span>
      </button>
    );
  }

  // --- Expanded: bottom sheet on mobile, top-left panel on desktop ---
  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-10 flex max-h-[82dvh] w-full flex-col
                 rounded-t-2xl border-t border-white/10 bg-black/70 text-white
                 shadow-2xl shadow-black/60 backdrop-blur-md
                 animate-[hyrox-in_0.24s_ease-out]
                 sm:inset-x-auto sm:bottom-auto sm:left-4 sm:top-4 sm:w-[320px]
                 sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl sm:border"
    >
      {/* Grab handle (mobile bottom-sheet affordance) */}
      <div className="flex justify-center pt-2.5 sm:hidden">
        <span className="h-1 w-10 rounded-full bg-white/25" />
      </div>

      {/* Header (the collapse control is always reachable) */}
      <header className="flex items-start justify-between gap-2 border-b border-white/10 p-4 pb-3 sm:p-5 sm:pb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: HYROX.yellow }}
            />
            <h1 className="truncate text-lg font-black uppercase tracking-tight sm:text-xl">
              HYRO<span style={{ color: HYROX.yellow }}>X</span>
              <span className="ml-2 font-semibold text-white/70">San Marino</span>
            </h1>
          </div>
          <p className="mt-2 flex items-start gap-1.5 text-xs text-white/50">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>Multieventi Sport Domus · San Marino</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Hide panel"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                     border border-white/10 bg-white/5 text-white/70 transition-colors
                     hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {/* Scrollable content */}
      <div className="overflow-y-auto p-4 sm:p-5">
        {/* Toggles */}
        <div className="space-y-2.5">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Event Zones
          </p>
          {TOGGLES.map((t) => {
            const active = layers[t.key];
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(t.key)}
                className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3
                            text-left transition-all duration-200
                            ${
                              active
                                ? "border-white/20 bg-white/10"
                                : "border-white/5 bg-white/[0.02] opacity-60 hover:opacity-100"
                            }`}
              >
                {/* Icon chip */}
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors"
                  style={{
                    backgroundColor: active ? `${t.accent}22` : "rgba(255,255,255,0.04)",
                    color: active ? t.accent : "rgba(255,255,255,0.4)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>

                {/* Label */}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    <span aria-hidden>{t.emoji}</span>
                    {t.label}
                  </span>
                  <span className="block truncate text-xs text-white/45">
                    {t.sublabel}
                  </span>
                </span>

                {/* Switch */}
                <span
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200
                              ${active ? "" : "bg-white/15"}`}
                  style={active ? { backgroundColor: t.accent } : undefined}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200
                                ${active ? "translate-x-[18px]" : "translate-x-0.5"}`}
                  />
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <footer className="mt-5 border-t border-white/10 pt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
            Legend
          </p>
          <ul className="space-y-1.5 text-xs text-white/60">
            <LegendItem color={HYROX.yellow} dashed>
              Dashed line — running route
            </LegendItem>
            <LegendItem color={HYROX.darkRed}>Red volume — indoor arena</LegendItem>
            <LegendItem color={HYROX.turf}>Green volume — power village turf</LegendItem>
          </ul>
        </footer>

        {/* Build & setup — what you need to run/deploy this project */}
        <details className="mt-4 border-t border-white/10 pt-4">
          <summary className="cursor-pointer select-none text-[11px] font-semibold uppercase tracking-widest text-white/40">
            🔧 Build &amp; setup
          </summary>
          <div className="mt-3 space-y-3 text-xs leading-relaxed text-white/60">
            <div>
              <p className="mb-1 font-semibold text-white/70">Prerequisites</p>
              <ul className="list-disc space-y-0.5 pl-4 text-white/55">
                <li>Node.js 18+ and npm</li>
                <li>
                  A Mapbox account + <span className="text-white/75">public</span>{" "}
                  token (<code>pk.…</code>)
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-1 font-semibold text-white/70">Environment variable</p>
              <pre className="overflow-x-auto rounded-lg bg-black/60 p-2 text-[11px] text-white/80">
                NEXT_PUBLIC_MAPBOX_TOKEN=pk.•••
              </pre>
              <p className="mt-1 text-white/45">
                Put it in <code>.env.local</code> for local dev, and in Vercel →
                Settings → Environment Variables for production.
              </p>
            </div>
            <div>
              <p className="mb-1 font-semibold text-white/70">Commands</p>
              <pre className="overflow-x-auto rounded-lg bg-black/60 p-2 text-[11px] leading-relaxed text-white/80">
{`npm install
npm run dev    # http://localhost:3000
npm run build  # production build`}
              </pre>
            </div>
            <div>
              <p className="mb-1 font-semibold text-white/70">Key dependencies</p>
              <p className="text-white/55">
                next 16 · react 19 · react-map-gl 8 · mapbox-gl 3 · tailwindcss 4
                · lucide-react
              </p>
            </div>
            <div>
              <p className="mb-1 font-semibold text-white/70">Deploy</p>
              <p className="text-white/55">
                Vercel — framework preset <em>Next.js</em> (pinned in{" "}
                <code>vercel.json</code>). Add the token env var, then deploy.
              </p>
            </div>
          </div>
        </details>
      </div>
    </aside>
  );
}

function LegendItem({
  color,
  dashed = false,
  children,
}: {
  color: string;
  dashed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      <span
        className="inline-block h-2.5 w-4 shrink-0 rounded-sm"
        style={{
          backgroundColor: dashed ? "transparent" : color,
          borderTop: dashed ? `2px dashed ${color}` : undefined,
        }}
      />
      {children}
    </li>
  );
}
