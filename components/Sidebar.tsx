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

  // --- Expanded: full panel ---
  return (
    <aside
      className="absolute left-3 top-3 z-10 flex max-h-[calc(100dvh-1.5rem)] w-[300px]
                 max-w-[calc(100vw-1.5rem)] flex-col rounded-2xl border border-white/10
                 bg-black/60 text-white shadow-2xl shadow-black/50 backdrop-blur-md
                 sm:left-4 sm:top-4 sm:w-[320px] sm:max-h-[calc(100dvh-2rem)]"
    >
      {/* Header (sticky so the collapse control is always reachable) */}
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
