"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Map, {
  Source,
  Layer,
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  type MapRef,
} from "react-map-gl/mapbox";
import {
  Play,
  Pause,
  Flag,
  Activity,
  Dumbbell,
  Target,
  RotateCcw,
  Loader2,
  Download,
  type LucideIcon,
} from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

import Sidebar, { type LayerKey, type LayerState } from "./Sidebar";
import { useI18n } from "./i18n";
import {
  INITIAL_VIEW_STATE,
  MAP_STYLE,
  TERRAIN,
  DEM_SOURCE,
  SKY_LAYER,
  HYROX,
  runningLoopGeoJSON,
  runningLoopLayer,
  indoorArenaGeoJSON,
  indoorArenaLayer,
  powerVillageGeoJSON,
  powerVillageLayer,
  buildingsLayer,
  STATIONS,
  RACE_SEQUENCE,
  RUNNING_LOOP_LENGTH_M,
  RUN_TARGET_M,
  STATION_FOOT_M,
  MACHINE_M,
  type Station,
  type StationIcon,
} from "@/lib/hyrox-data";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const RUNNING_LAYER_ID = "running-loop-line";

/** Maps a station's icon name to its Lucide component. */
const STATION_ICONS: Record<StationIcon, LucideIcon> = {
  Play,
  Flag,
  Activity,
  Dumbbell,
  Target,
};

/** Marching-ants dash frames for the animated running loop. */
const DASH_SEQUENCE: number[][] = [
  [0, 4, 3],
  [0.5, 4, 2.5],
  [1, 4, 2],
  [1.5, 4, 1.5],
  [2, 4, 1],
  [2.5, 4, 0.5],
  [3, 4, 0],
  [0, 0.5, 3, 3.5],
  [0, 1, 3, 3],
  [0, 1.5, 3, 2.5],
  [0, 2, 3, 2],
  [0, 2.5, 3, 1.5],
  [0, 3, 3, 1],
  [0, 3.5, 3, 0.5],
];

type LngLat = [number, number];

/** Bounding box of a set of coordinates → [[W,S],[E,N]]. */
function boundsOf(coords: LngLat[]): [LngLat, LngLat] {
  let w = 180,
    s = 90,
    e = -180,
    n = -90;
  for (const [lng, lat] of coords) {
    w = Math.min(w, lng);
    e = Math.max(e, lng);
    s = Math.min(s, lat);
    n = Math.max(n, lat);
  }
  return [
    [w, s],
    [e, n],
  ];
}

/** Coordinates that define each zone's extent, for "focus zone". */
const ZONE_COORDS: Record<LayerKey, LngLat[]> = {
  running: runningLoopGeoJSON.features[0].geometry.coordinates as LngLat[],
  arena: indoorArenaGeoJSON.features[0].geometry.coordinates[0] as LngLat[],
  village: powerVillageGeoJSON.features[0].geometry.coordinates[0] as LngLat[],
  stations: STATIONS.map((s) => [s.lng, s.lat] as LngLat),
};

export default function MapViewer() {
  const { d, t } = useI18n();
  const mapRef = useRef<MapRef | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [layers, setLayers] = useState<LayerState>({
    running: true,
    arena: true,
    village: true,
    stations: true,
  });
  const [selected, setSelected] = useState<Station | null>(null);
  const [tourOn, setTourOn] = useState(true);
  const [activeStep, setActiveStep] = useState(-1);
  const [exportOpen, setExportOpen] = useState(false);

  const handleToggle = useCallback((key: LayerKey) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const focusZone = useCallback((key: LayerKey) => {
    mapRef.current?.fitBounds(boundsOf(ZONE_COORDS[key]), {
      padding: 90,
      pitch: 55,
      bearing: INITIAL_VIEW_STATE.bearing,
      maxZoom: 18,
      duration: 1200,
    });
  }, []);

  const resetView = useCallback(() => {
    mapRef.current?.flyTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      pitch: INITIAL_VIEW_STATE.pitch,
      bearing: INITIAL_VIEW_STATE.bearing,
      duration: 1200,
    });
  }, []);

  const exportImage = useCallback(
    async (format: "png" | "pdf") => {
      setExportOpen(false);
      try {
      const map = mapRef.current?.getMap();
      if (!map) return;
      const src = map.getCanvas();
      const w = src.width;
      const h = src.height;
      const dpr = src.clientWidth ? src.width / src.clientWidth : 1;

      const out = document.createElement("canvas");
      out.width = w;
      out.height = h;
      const ctx = out.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(src, 0, 0);

      // Draw the station pins (HTML markers aren't on the WebGL canvas).
      if (layers.stations) {
        for (const s of STATIONS) {
          const p = map.project([s.lng, s.lat]);
          const x = p.x * dpr;
          const y = p.y * dpr;
          const terminus = s.id === "start" || s.id === "finish";
          const fill = terminus
            ? "#0a0a0a"
            : s.type === "indoor"
              ? "#dc2626"
              : "#16a34a";
          ctx.beginPath();
          ctx.arc(x, y, 15 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = fill;
          ctx.fill();
          ctx.lineWidth = 2.5 * dpr;
          ctx.strokeStyle = terminus ? "#fbc02d" : "rgba(0,0,0,0.45)";
          ctx.stroke();
          ctx.fillStyle = terminus
            ? "#fbc02d"
            : s.type === "indoor"
              ? "#fde047"
              : "#ffffff";
          ctx.font = `bold ${15 * dpr}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const label =
            s.order != null ? String(s.order) : s.id === "start" ? "S" : "F";
          ctx.fillText(label, x, y);
        }
      }

      // Title footer bar.
      const bar = 42 * dpr;
      ctx.fillStyle = "rgba(10,10,10,0.78)";
      ctx.fillRect(0, h - bar, w, bar);
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillStyle = "#fbc02d";
      ctx.font = `bold ${17 * dpr}px sans-serif`;
      ctx.fillText("HYROX San Marino", 16 * dpr, h - bar / 2);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = `${13 * dpr}px sans-serif`;
      ctx.fillText("Multieventi Sport Domus", 200 * dpr, h - bar / 2);

      const dataURL = out.toDataURL("image/png");
      if (format === "png") {
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = "hyrox-san-marino.png";
        a.click();
        return;
      }
      const jspdf = await import("jspdf");
      const JsPDF = jspdf.jsPDF ?? jspdf.default;
      // A4 landscape in points — robust page geometry.
      const pdf = new JsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const M = 28;

      // Page 1 — title + fitted map image.
      pdf.setTextColor(18, 18, 22);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("HYROX San Marino", M, M + 4);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(110, 110, 120);
      pdf.text(`Multieventi Sport Domus · San Marino — ${t("pdf.plan")}`, M, M + 18);

      const availW = pageW - M * 2;
      const availH = pageH - (M + 28) - M;
      const scale = Math.min(availW / w, availH / h);
      const iw = w * scale;
      const ih = h * scale;
      pdf.addImage(
        dataURL,
        "PNG",
        (pageW - iw) / 2,
        M + 28,
        iw,
        ih,
        undefined,
        "FAST",
      );

      // Page 2 — event plan: race summary + station specs.
      pdf.addPage("a4", "landscape");
      let y = M + 6;
      pdf.setTextColor(18, 18, 22);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text("HYROX San Marino", M, y);
      y += 18;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(110, 110, 120);
      pdf.text(`Multieventi Sport Domus · San Marino — ${t("pdf.plan")}`, M, y);
      y += 26;

      pdf.setTextColor(18, 18, 22);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text(t("pdf.summary"), M, y);
      y += 16;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10.5);
      pdf.setTextColor(55, 55, 65);
      const lapM = RUNNING_LOOP_LENGTH_M;
      const summary = [
        `${t("rf.lap")}: ${lapM} m`,
        `${t("rf.runTarget")}: ${(RUN_TARGET_M / 1000).toFixed(1)} km   ·   ${t("rf.laps")}: ≈ ${(RUN_TARGET_M / lapM).toFixed(1)}`,
        `${t("rf.stationsFoot")}: ${STATION_FOOT_M} m   ·   ${t("rf.ergo")}: ${MACHINE_M} m`,
        `${t("rf.totalFoot")}: ${((RUN_TARGET_M + STATION_FOOT_M) / 1000).toFixed(2)} km   ·   ${t("pdf.total")}: ${t("rf.estTime.v")}`,
      ];
      for (const line of summary) {
        pdf.text(line, M, y);
        y += 14;
      }
      y += 12;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(18, 18, 22);
      pdf.text(t("pdf.stations"), M, y);
      y += 16;

      const workout = STATIONS.filter((s) => s.order != null).sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0),
      );
      for (const s of workout) {
        if (y > pageH - M) {
          pdf.addPage("a4", "landscape");
          y = M + 6;
        }
        pdf.setTextColor(18, 18, 22);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.text(`${d(s.name)}  —  ${d(s.distance) ?? ""}`, M, y);
        if (s.time) {
          pdf.setTextColor(180, 120, 0);
          pdf.text(s.time, pageW - M, y, { align: "right" });
        }
        y += 12;
        pdf.setTextColor(90, 90, 100);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        const specs = [d(s.weights), d(s.space)]
          .filter(Boolean)
          .join("   ·   ");
        if (specs) pdf.text(specs, M, y);
        y += 18;
      }

      pdf.save("hyrox-san-marino.pdf");
      } catch (err) {
        console.error("Export failed", err);
      }
    },
    [layers.stations, t, d],
  );

  const handleLoad = useCallback(() => {
    setMapLoaded(true);
    const map = mapRef.current?.getMap();
    try {
      map?.setFog({
        color: "rgb(12,12,16)",
        "high-color": "rgb(22,22,34)",
        "horizon-blend": 0.2,
        "space-color": "rgb(6,6,10)",
        "star-intensity": 0.12,
      });
    } catch {
      /* fog unsupported */
    }
  }, []);

  // Esc closes the station popup.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Animated route numbering: a highlight travels the sequence Start → 1 … 8 → Finish.
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!tourOn || reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveStep(-1);
      return;
    }
    let raf = 0;
    let cur = -1;
    const tick = (time: number) => {
      const idx = Math.floor(time / 1100) % RACE_SEQUENCE.length;
      if (idx !== cur) {
        cur = idx;
        setActiveStep(idx);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tourOn]);

  // Animate the running-loop dash so it "flows" like a stream of athletes.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return; // respect reduced-motion preference
    }
    let raf = 0;
    let step = -1;
    const animate = (t: number) => {
      const map = mapRef.current?.getMap();
      if (map && map.getLayer(RUNNING_LAYER_ID)) {
        // Higher divisor = slower flow.
        const next = Math.floor(t / 160) % DASH_SEQUENCE.length;
        if (next !== step) {
          step = next;
          try {
            map.setPaintProperty(
              RUNNING_LAYER_ID,
              "line-dasharray",
              DASH_SEQUENCE[next],
            );
          } catch {
            /* layer not ready yet */
          }
        }
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Graceful fallback when the Mapbox token is missing.
  if (!MAPBOX_TOKEN) {
    return <MissingTokenScreen />;
  }

  return (
    <div className="relative h-screen w-screen">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
        terrain={TERRAIN}
        maxPitch={85}
        antialias
        preserveDrawingBuffer
        style={{ width: "100vw", height: "100vh" }}
        onClick={() => setSelected(null)}
        onLoad={handleLoad}
      >
        <NavigationControl position="bottom-right" visualizePitch />
        <FullscreenControl position="bottom-right" />
        <ScaleControl position="bottom-left" />

        {/* 3D terrain — the San Marino hill */}
        <Source {...DEM_SOURCE} />

        {/* Atmospheric sky */}
        <Layer {...SKY_LAYER} />

        {/* Surrounding city in 3D */}
        <Layer {...buildingsLayer} />

        {/* Zone 1 — 1km Running Loop */}
        {layers.running && (
          <Source id="running-loop" type="geojson" data={runningLoopGeoJSON}>
            <Layer {...runningLoopLayer} />
          </Source>
        )}

        {/* Zone 2 — Indoor Arena (Cardio & Finish) */}
        {layers.arena && (
          <Source id="indoor-arena" type="geojson" data={indoorArenaGeoJSON}>
            <Layer {...indoorArenaLayer} />
          </Source>
        )}

        {/* Zone 3 — Power Village (Heavy Weights) */}
        {layers.village && (
          <Source id="power-village" type="geojson" data={powerVillageGeoJSON}>
            <Layer {...powerVillageLayer} />
          </Source>
        )}

        {/* Station markers — 8 workouts + Start & Finish */}
        {layers.stations &&
          STATIONS.map((station) => {
            const Icon = STATION_ICONS[station.icon];
            const terminus = station.id === "start" || station.id === "finish";
            const indoor = station.type === "indoor";
            const active = selected?.id === station.id;
            const isTourActive =
              activeStep >= 0 && RACE_SEQUENCE[activeStep] === station.id;

            const pill = terminus
              ? "bg-black text-yellow-400 ring-yellow-400/70"
              : indoor
                ? "bg-red-600 text-yellow-300 ring-black/30"
                : "bg-green-600 text-white ring-black/30";
            const pointer = terminus
              ? "bg-black"
              : indoor
                ? "bg-red-600"
                : "bg-green-600";

            return (
              <Marker
                key={station.id}
                longitude={station.lng}
                latitude={station.lat}
                anchor="bottom"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelected(station);
                }}
              >
                <button
                  type="button"
                  aria-label={station.name}
                  className="flex cursor-pointer flex-col items-center transition-transform hover:scale-110"
                >
                  <div
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold shadow-lg ring-1 transition-transform ${pill} ${
                      active ? "ring-2 ring-white" : ""
                    } ${terminus ? "uppercase tracking-wide" : ""} ${
                      isTourActive
                        ? "scale-110 animate-[hyrox-pulse_1.1s_ease-in-out_infinite]"
                        : ""
                    }`}
                  >
                    {/* Order number stays visible on mobile where the label
                        is hidden, so the sequence is always readable. */}
                    {station.order != null && (
                      <span className="text-[11px] font-black leading-none md:hidden">
                        {station.order}
                      </span>
                    )}
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {/* On mobile show only the icon for numbered stations to
                        avoid overlap; Start/Finish always show their label. */}
                    <span className={terminus ? "inline" : "hidden md:inline"}>
                      {d(station.name)}
                    </span>
                  </div>
                  <div className={`h-2 w-2 -translate-y-1 rotate-45 ${pointer}`} />
                </button>
              </Marker>
            );
          })}

        {/* Click popup with the full step-by-step for the station */}
        {selected && (
          <StationPopup station={selected} onClose={() => setSelected(null)} />
        )}
      </Map>

      {/* Map controls: reset · animated sequence · export */}
      <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={resetView}
          aria-label={t("aria.reset")}
          title={t("aria.reset")}
          className="flex h-10 w-10 items-center justify-center rounded-lg border
                     border-white/10 bg-black/60 text-white/80 shadow-lg backdrop-blur-md
                     transition-colors hover:bg-black/70"
        >
          <RotateCcw className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => setTourOn((v) => !v)}
          aria-label={t(tourOn ? "aria.tourPause" : "aria.tourPlay")}
          title={t(tourOn ? "aria.tourPause" : "aria.tourPlay")}
          className="flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg
                     backdrop-blur-md transition-colors"
          style={{
            backgroundColor: tourOn ? `${HYROX.yellow}` : "rgba(10,10,10,0.6)",
            borderColor: tourOn ? HYROX.yellow : "rgba(255,255,255,0.1)",
            color: tourOn ? "#0a0a0a" : "rgba(255,255,255,0.8)",
          }}
        >
          {tourOn ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setExportOpen((o) => !o)}
            aria-label={t("aria.export")}
            title={t("aria.export")}
            aria-expanded={exportOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border
                       border-white/10 bg-black/60 text-white/80 shadow-lg backdrop-blur-md
                       transition-colors hover:bg-black/70"
          >
            <Download className="h-5 w-5" />
          </button>
          {exportOpen && (
            <div className="absolute right-0 top-full mt-2 flex w-36 flex-col overflow-hidden rounded-lg border border-white/10 bg-black/80 shadow-xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => exportImage("png")}
                className="px-3 py-2 text-left text-xs text-white/80 transition-colors hover:bg-white/10"
              >
                {t("export.png")}
              </button>
              <button
                type="button"
                onClick={() => exportImage("pdf")}
                className="border-t border-white/10 px-3 py-2 text-left text-xs text-white/80 transition-colors hover:bg-white/10"
              >
                {t("export.pdf")}
              </button>
            </div>
          )}
        </div>
      </div>

      <Sidebar
        layers={layers}
        onToggle={handleToggle}
        onFocusZone={focusZone}
      />

      {/* Loading overlay until the map is ready */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <div className="flex items-center gap-3 text-white/70">
            <Loader2
              className="h-5 w-5 animate-spin"
              style={{ color: HYROX.yellow }}
            />
            <span className="text-sm">{t("loading")}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const stationById = (id: string) => STATIONS.find((s) => s.id === id) ?? null;

type FlowStep = { label?: string; value: string; strong?: boolean };

function StationPopup({
  station,
  onClose,
}: {
  station: Station;
  onClose: () => void;
}) {
  const { t, d } = useI18n();
  const idx = RACE_SEQUENCE.indexOf(station.id);
  const prev = idx > 0 ? stationById(RACE_SEQUENCE[idx - 1]) : null;
  const next =
    idx >= 0 && idx < RACE_SEQUENCE.length - 1
      ? stationById(RACE_SEQUENCE[idx + 1])
      : null;
  const laps = (1000 / RUNNING_LOOP_LENGTH_M).toFixed(1);
  const runValue = `1 km · ≈ ${laps} ${t("pp.laps")}`;
  const indoor = station.type === "indoor";
  const isStart = station.id === "start";
  const isFinish = station.id === "finish";

  const steps: FlowStep[] = [];
  if (isStart) {
    steps.push({ value: t("pp.startRace"), strong: true });
    steps.push({ label: t("pp.run"), value: runValue });
    if (next) steps.push({ label: t("pp.then"), value: d(next.name)! });
  } else if (isFinish) {
    if (prev) steps.push({ label: t("pp.arriveFrom"), value: d(prev.name)! });
    steps.push({ value: t("pp.finish"), strong: true });
  } else {
    if (prev) steps.push({ label: t("pp.arriveFrom"), value: d(prev.name)! });
    steps.push({ label: t("pp.run"), value: runValue });
    steps.push({
      value: `${t("pp.do")} ${d(station.distance) ?? ""}`.trim(),
      strong: true,
    });
    if (next) steps.push({ label: t("pp.then"), value: d(next.name)! });
  }

  return (
    <Popup
      longitude={station.lng}
      latitude={station.lat}
      anchor="bottom"
      offset={28}
      closeButton={false}
      onClose={onClose}
      className="hyrox-popup"
      maxWidth="280px"
    >
      <div className="w-[232px] p-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              indoor ? "bg-red-600/25 text-red-300" : "bg-green-600/25 text-green-300"
            }`}
          >
            {indoor ? t("pp.indoor") : t("pp.outdoor")}
          </span>
          {station.order != null && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              {t("pp.station")} {station.order}/8
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-white">{d(station.name)}</h3>

        {/* Step-by-step flow: where you come from, the run, the station, next */}
        <ol className="mt-2 space-y-1 border-l-2 border-white/15 pl-3 text-xs">
          {steps.map((s, i) => (
            <li
              key={i}
              className={s.strong ? "font-semibold text-white" : "text-white/80"}
            >
              {s.label && <span className="text-white/45">{s.label}: </span>}
              {s.value}
            </li>
          ))}
        </ol>

        {/* Specs: surface / space / weight / time / equipment */}
        {(station.surface ||
          station.space ||
          station.weights ||
          station.time ||
          station.equipment) && (
          <dl className="mt-2 space-y-1 border-t border-white/10 pt-2 text-xs">
            {station.surface && (
              <SpecRow k={t("pp.surface")} v={d(station.surface)!} />
            )}
            {station.space && <SpecRow k={t("pp.space")} v={d(station.space)!} />}
            {station.weights && (
              <SpecRow k={t("pp.weight")} v={d(station.weights)!} />
            )}
            {station.time && <SpecRow k={t("pp.time")} v={station.time} />}
            {station.equipment && (
              <div className="flex gap-2">
                <dt className="w-[64px] shrink-0 text-white/45">
                  {t("pp.equipment")}
                </dt>
                <dd className="font-medium text-white/85">
                  {station.equipment.map((e) => d(e)).join(", ")}
                </dd>
              </div>
            )}
          </dl>
        )}

        {station.note && station.order == null && (
          <p className="mt-2 border-t border-white/10 pt-2 text-[11px] leading-relaxed text-white/50">
            {d(station.note)}
          </p>
        )}
      </div>
    </Popup>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-[64px] shrink-0 text-white/45">{k}</dt>
      <dd className="font-medium text-white/85">{v}</dd>
    </div>
  );
}

function MissingTokenScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black p-6">
      <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl font-black"
          style={{ backgroundColor: `${HYROX.yellow}22`, color: HYROX.yellow }}
        >
          !
        </div>
        <h1 className="mb-2 text-lg font-bold text-white">
          Mapbox token missing
        </h1>
        <p className="mb-4 text-sm leading-relaxed text-white/60">
          Create a <code className="rounded bg-white/10 px-1 py-0.5">.env.local</code>{" "}
          file in the project root and add your Mapbox access token:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-black/60 p-3 text-left text-xs text-white/80">
          NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
        </pre>
        <p className="mt-4 text-xs text-white/40">
          Get a free token at account.mapbox.com, then restart the dev server.
        </p>
      </div>
    </div>
  );
}
