"use client";

import { useState, useCallback } from "react";
import Map, {
  Source,
  Layer,
  Marker,
  Popup,
  NavigationControl,
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
  type Station,
  type StationIcon,
} from "@/lib/hyrox-data";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

/** Maps a station's icon name to its Lucide component. */
const STATION_ICONS: Record<StationIcon, LucideIcon> = {
  Play,
  Flag,
  Activity,
  Dumbbell,
  Target,
};

export default function MapViewer() {
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

  // Graceful fallback when the Mapbox token is missing — keeps the app from
  // crashing and tells the developer exactly what to do.
  if (!MAPBOX_TOKEN) {
    return <MissingTokenScreen />;
  }

  return (
    <div className="relative h-screen w-screen">
      <Map
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
            const indoor = station.type === "indoor";
            return (
              <Marker
                key={station.id}
                longitude={station.lng}
                latitude={station.lat}
                anchor="bottom"
                onClick={(e) => {
                  // Keep the map's onClick from immediately closing the popup.
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
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold shadow-lg ring-1 ring-black/30 ${
                      indoor
                        ? "bg-red-600 text-yellow-300"
                        : "bg-green-600 text-white"
                    } ${selected?.id === station.id ? "ring-2 ring-white" : ""}`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{station.name}</span>
                  </div>
                  {/* pointer */}
                  <div
                    className={`h-2 w-2 -translate-y-1 rotate-45 ${
                      indoor ? "bg-red-600" : "bg-green-600"
                    }`}
                  />
                </button>
              </Marker>
            );
          })}

        {/* Click popup with station details */}
        {selected && (
          <Popup
            longitude={selected.lng}
            latitude={selected.lat}
            anchor="bottom"
            offset={28}
            closeButton={false}
            onClose={() => setSelected(null)}
            className="hyrox-popup"
          >
            <div className="min-w-[190px] p-1">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    selected.type === "indoor"
                      ? "bg-red-600/25 text-red-300"
                      : "bg-green-600/25 text-green-300"
                  }`}
                >
                  {selected.type === "indoor" ? "Indoor" : "Outdoor"}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{selected.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/70">
                {selected.detail}
              </p>
            </div>
          </Popup>
        )}
      </Map>

      <Sidebar layers={layers} onToggle={handleToggle} />
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
