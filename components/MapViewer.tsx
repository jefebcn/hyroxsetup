"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Map, {
  Source,
  Layer,
  Marker,
  Popup,
  NavigationControl,
  type MapRef,
} from "react-map-gl/mapbox";
import {
  Play,
  Flag,
  Activity,
  Dumbbell,
  Target,
  type LucideIcon,
} from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

import Sidebar, { type LayerKey, type LayerState } from "./Sidebar";
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

export default function MapViewer() {
  const mapRef = useRef<MapRef | null>(null);
  const [layers, setLayers] = useState<LayerState>({
    running: true,
    arena: true,
    village: true,
    stations: true,
  });
  const [selected, setSelected] = useState<Station | null>(null);

  const handleToggle = useCallback((key: LayerKey) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Animate the running-loop dash so it "flows" like a stream of athletes.
  useEffect(() => {
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
        style={{ width: "100vw", height: "100vh" }}
        onClick={() => setSelected(null)}
      >
        <NavigationControl position="bottom-right" visualizePitch />

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
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-1 text-xs font-bold shadow-lg ring-1 ${pill} ${
                      active ? "ring-2 ring-white" : ""
                    } ${terminus ? "uppercase tracking-wide" : ""}`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {/* On mobile show only the icon for numbered stations to
                        avoid overlap; Start/Finish always show their label. */}
                    <span className={terminus ? "inline" : "hidden md:inline"}>
                      {station.name}
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

      <Sidebar layers={layers} onToggle={handleToggle} />
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
  const idx = RACE_SEQUENCE.indexOf(station.id);
  const prev = idx > 0 ? stationById(RACE_SEQUENCE[idx - 1]) : null;
  const next =
    idx >= 0 && idx < RACE_SEQUENCE.length - 1
      ? stationById(RACE_SEQUENCE[idx + 1])
      : null;
  const laps = (1000 / RUNNING_LOOP_LENGTH_M).toFixed(1);
  const indoor = station.type === "indoor";
  const isStart = station.id === "start";
  const isFinish = station.id === "finish";

  const steps: FlowStep[] = [];
  if (isStart) {
    steps.push({ value: "Start the race", strong: true });
    steps.push({ label: "Run", value: `1 km · ≈ ${laps} laps` });
    if (next) steps.push({ label: "Then", value: next.name });
  } else if (isFinish) {
    if (prev) steps.push({ label: "Arrive from", value: prev.name });
    steps.push({ value: "Finish — race complete", strong: true });
  } else {
    if (prev) steps.push({ label: "Arrive from", value: prev.name });
    steps.push({ label: "Run", value: `1 km · ≈ ${laps} laps` });
    steps.push({ value: `Do ${station.distance ?? "the station"}`, strong: true });
    if (next) steps.push({ label: "Then", value: next.name });
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
            {indoor ? "Indoor" : "Outdoor"}
          </span>
          {station.order != null && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Station {station.order}/8
            </span>
          )}
        </div>
        <h3 className="text-sm font-bold text-white">{station.name}</h3>

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

        {/* Specs: surface / space / weight / equipment */}
        {(station.surface ||
          station.space ||
          station.weights ||
          station.equipment) && (
          <dl className="mt-2 space-y-1 border-t border-white/10 pt-2 text-xs">
            {station.surface && <SpecRow k="Surface" v={station.surface} />}
            {station.space && <SpecRow k="Space" v={station.space} />}
            {station.weights && <SpecRow k="Weight" v={station.weights} />}
            {station.equipment && (
              <div className="flex gap-2">
                <dt className="w-[64px] shrink-0 text-white/45">Equipment</dt>
                <dd className="font-medium text-white/85">
                  {station.equipment.join(", ")}
                </dd>
              </div>
            )}
          </dl>
        )}

        {station.note && station.order == null && (
          <p className="mt-2 border-t border-white/10 pt-2 text-[11px] leading-relaxed text-white/50">
            {station.note}
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
