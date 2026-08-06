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
import {
  HYROX,
  RUNNING_LOOP_LENGTH_M,
  RUN_TARGET_M,
  STATION_FOOT_M,
  MACHINE_M,
  LOGISTICS,
} from "@/lib/hyrox-data";
import { useI18n } from "./i18n";

export type LayerKey = "running" | "arena" | "village" | "stations";
export type LayerState = Record<LayerKey, boolean>;

interface ToggleConfig {
  key: LayerKey;
  emoji: string;
  labelKey: string;
  subKey: string;
  icon: LucideIcon;
  accent: string;
}

const TOGGLES: ToggleConfig[] = [
  { key: "running", emoji: "🏃", labelKey: "tog.running", subKey: "tog.running.sub", icon: Footprints, accent: HYROX.yellow },
  { key: "arena", emoji: "🏟️", labelKey: "tog.arena", subKey: "tog.arena.sub", icon: Building2, accent: HYROX.red },
  { key: "village", emoji: "⛺", labelKey: "tog.village", subKey: "tog.village.sub", icon: Tent, accent: HYROX.turf },
  { key: "stations", emoji: "📍", labelKey: "tog.stations", subKey: "tog.stations.sub", icon: MapPin, accent: HYROX.yellow },
];

interface SidebarProps {
  layers: LayerState;
  onToggle: (key: LayerKey) => void;
}

export default function Sidebar({ layers, onToggle }: SidebarProps) {
  const { t, lang, setLang } = useI18n();
  const [collapsed, setCollapsed] = useState(false);

  // Collapse by default on small screens so the map is visible on load.
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCollapsed(true);
    }
  }, []);

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label={t("aria.show")}
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

      {/* Header */}
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
            <span>{t("venue")}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <LangToggle lang={lang} setLang={setLang} />
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label={t("aria.hide")}
            className="flex h-8 w-8 items-center justify-center rounded-lg
                       border border-white/10 bg-white/5 text-white/70 transition-colors
                       hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="overflow-y-auto p-4 sm:p-5">
        {/* Toggles */}
        <div className="space-y-2.5">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
            {t("eventZones")}
          </p>
          {TOGGLES.map((tog) => {
            const active = layers[tog.key];
            const Icon = tog.icon;
            return (
              <button
                key={tog.key}
                type="button"
                aria-pressed={active}
                onClick={() => onToggle(tog.key)}
                className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3
                            text-left transition-all duration-200
                            ${
                              active
                                ? "border-white/20 bg-white/10"
                                : "border-white/5 bg-white/[0.02] opacity-60 hover:opacity-100"
                            }`}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors"
                  style={{
                    backgroundColor: active ? `${tog.accent}22` : "rgba(255,255,255,0.04)",
                    color: active ? tog.accent : "rgba(255,255,255,0.4)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 text-sm font-semibold">
                    <span aria-hidden>{tog.emoji}</span>
                    {t(tog.labelKey)}
                  </span>
                  <span className="block truncate text-xs text-white/45">
                    {t(tog.subKey)}
                  </span>
                </span>
                <span
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200
                              ${active ? "" : "bg-white/15"}`}
                  style={active ? { backgroundColor: tog.accent } : undefined}
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

        {/* Race format & distances */}
        <RaceFormat />

        {/* Materials & logistics */}
        <details className="mt-5 border-t border-white/10 pt-4">
          <summary className="cursor-pointer select-none text-[11px] font-semibold uppercase tracking-widest text-white/40">
            📦 {t("materials")}
          </summary>
          <div className="mt-3 space-y-3">
            {LOGISTICS.map((group) => (
              <LogisticsGroup key={group.zone} zone={group.zone} items={group.items} />
            ))}
          </div>
        </details>

        {/* Legend */}
        <footer className="mt-5 border-t border-white/10 pt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
            {t("legend")}
          </p>
          <ul className="space-y-1.5 text-xs text-white/60">
            <LegendItem color={HYROX.yellow} dashed>
              {t("lg.dash")}
            </LegendItem>
            <LegendItem color={HYROX.darkRed}>{t("lg.red")}</LegendItem>
            <LegendItem color={HYROX.turf}>{t("lg.green")}</LegendItem>
          </ul>
        </footer>

        {/* Build & setup */}
        <BuildSetup />
      </div>
    </aside>
  );
}

function LangToggle({
  lang,
  setLang,
}: {
  lang: "it" | "en";
  setLang: (l: "it" | "en") => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-white/10 text-[11px] font-bold">
      {(["it", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2 py-1.5 uppercase transition-colors ${
            lang === l ? "text-black" : "bg-white/5 text-white/60 hover:text-white"
          }`}
          style={lang === l ? { backgroundColor: HYROX.yellow } : undefined}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function RaceFormat() {
  const { t, lang } = useI18n();
  const lapM = RUNNING_LOOP_LENGTH_M;
  const runTargetKm = (RUN_TARGET_M / 1000).toFixed(1);
  const lapsForRun = (RUN_TARGET_M / lapM).toFixed(1);
  const perKm = (1000 / lapM).toFixed(2);
  const footTotalKm = ((RUN_TARGET_M + STATION_FOOT_M) / 1000).toFixed(2);

  const note =
    lang === "it"
      ? `HYROX = 8 corse da 1 km (una prima di ogni stazione). Questo giro da ${lapM} m ≈ ${perKm} giri per ogni km, ${lapsForRun} giri per gli 8 km totali.`
      : `HYROX = 8 × 1 km runs (one before each station). This ${lapM} m lap ≈ ${perKm} laps per 1 km run, ${lapsForRun} laps for the full 8 km.`;

  return (
    <section className="mt-5 border-t border-white/10 pt-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
        {t("raceFormat")}
      </p>
      <dl className="space-y-1 text-xs">
        <MetricRow label={t("rf.lap")} value={`${lapM} m`} />
        <MetricRow label={t("rf.runTarget")} value={`${runTargetKm} km`} highlight />
        <MetricRow label={t("rf.laps")} value={`≈ ${lapsForRun}`} />
        <MetricRow label={t("rf.stationsFoot")} value={`${STATION_FOOT_M} m`} />
        <MetricRow label={t("rf.ergo")} value={`${MACHINE_M.toLocaleString("en-US")} m`} />
        <MetricRow label={t("rf.totalFoot")} value={`${footTotalKm} km`} highlight />
        <MetricRow label={t("rf.divisions")} value={t("rf.divisions.v")} />
      </dl>
      <p className="mt-2 text-[11px] leading-relaxed text-white/40">{note}</p>
    </section>
  );
}

function MetricRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-white/50">{label}</dt>
      <dd
        className={`font-semibold tabular-nums ${highlight ? "" : "text-white/80"}`}
        style={highlight ? { color: HYROX.yellow } : undefined}
      >
        {value}
      </dd>
    </div>
  );
}

function LogisticsGroup({ zone, items }: { zone: string; items: string[] }) {
  const { d } = useI18n();
  return (
    <div>
      <p className="mb-1 text-xs font-semibold text-white/70">{d(zone)}</p>
      <ul className="list-disc space-y-0.5 pl-4 text-xs text-white/55">
        {items.map((item) => (
          <li key={item}>{d(item)}</li>
        ))}
      </ul>
    </div>
  );
}

function BuildSetup() {
  const { t } = useI18n();
  return (
    <details className="mt-4 border-t border-white/10 pt-4">
      <summary className="cursor-pointer select-none text-[11px] font-semibold uppercase tracking-widest text-white/40">
        🔧 {t("buildSetup")}
      </summary>
      <div className="mt-3 space-y-3 text-xs leading-relaxed text-white/60">
        <div>
          <p className="mb-1 font-semibold text-white/70">{t("bs.prereq")}</p>
          <ul className="list-disc space-y-0.5 pl-4 text-white/55">
            <li>{t("bs.prereq.node")}</li>
            <li>{t("bs.prereq.mapbox")}</li>
          </ul>
        </div>
        <div>
          <p className="mb-1 font-semibold text-white/70">{t("bs.env")}</p>
          <pre className="overflow-x-auto rounded-lg bg-black/60 p-2 text-[11px] text-white/80">
            NEXT_PUBLIC_MAPBOX_TOKEN=pk.•••
          </pre>
          <p className="mt-1 text-white/45">{t("bs.env.note")}</p>
        </div>
        <div>
          <p className="mb-1 font-semibold text-white/70">{t("bs.commands")}</p>
          <pre className="overflow-x-auto rounded-lg bg-black/60 p-2 text-[11px] leading-relaxed text-white/80">
{`npm install
npm run dev    # http://localhost:3000
npm run build  # production build`}
          </pre>
        </div>
        <div>
          <p className="mb-1 font-semibold text-white/70">{t("bs.deps")}</p>
          <p className="text-white/55">
            next 16 · react 19 · react-map-gl 8 · mapbox-gl 3 · tailwindcss 4 ·
            lucide-react
          </p>
        </div>
        <div>
          <p className="mb-1 font-semibold text-white/70">{t("bs.deploy")}</p>
          <p className="text-white/55">{t("bs.deploy.note")}</p>
        </div>
      </div>
    </details>
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
