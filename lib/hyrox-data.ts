import type { FeatureCollection, LineString, Polygon } from "geojson";
import type { LayerProps } from "react-map-gl/mapbox";

/**
 * HYROX San Marino — map data & style config.
 *
 * The three event-zone geometries below are the EXACT, manually-traced
 * boundaries provided for the Multieventi Sport Domus, Serravalle (San Marino):
 *   - Feature 1 (Polygon)    → Indoor Arena   (red fill-extrusion)
 *   - Feature 2 (Polygon)    → Power Village  (green fill-extrusion)
 *   - Feature 3 (LineString) → Running Loop   (yellow dashed line)
 * Coordinates are used verbatim — no mock data, no generated offsets.
 */

// --- Viewport (centered on the Indoor Arena polygon centroid) --------------

export const VENUE = {
  longitude: 12.4754368,
  latitude: 43.9708936,
} as const;

export const INITIAL_VIEW_STATE = {
  // Centered on the 1 km loop so the whole circuit + stations are framed.
  longitude: 12.4759,
  latitude: 43.971,
  zoom: 16.9,
  pitch: 60,
  bearing: -20,
} as const;

/** Dark 3D-capable Mapbox style. */
export const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";

// --- Terrain (the San Marino hill) -----------------------------------------

/** raster-dem source that feeds the 3D terrain. */
export const DEM_SOURCE = {
  id: "mapbox-dem",
  type: "raster-dem" as const,
  url: "mapbox://mapbox.mapbox-terrain-dem-v1",
  tileSize: 512,
  maxzoom: 14,
};

/** Terrain config applied to the <Map terrain={...} /> prop. */
export const TERRAIN = {
  source: DEM_SOURCE.id,
  exaggeration: 1.5,
};

/** Atmospheric sky layer for a striking horizon. */
export const SKY_LAYER: LayerProps = {
  id: "sky",
  type: "sky",
  paint: {
    "sky-type": "atmosphere",
    "sky-atmosphere-sun": [0.0, 90.0],
    "sky-atmosphere-sun-intensity": 15,
  },
};

// --- HYROX brand colors ----------------------------------------------------

export const HYROX = {
  yellow: "#fbc02d",
  red: "#e74c3c",
  darkRed: "#8b1e1e",
  turf: "#1f8a4c",
  black: "#0a0a0a",
} as const;

// --- Zone 1: Indoor Arena (exact traced Polygon) ---------------------------

export const indoorArenaGeoJSON: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Indoor Arena — Cardio & Finish" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [12.4747636, 43.9711966],
            [12.4752517, 43.9703357],
            [12.4761154, 43.9705866],
            [12.4756165, 43.9714553],
            [12.4747636, 43.9711966],
          ],
        ],
      },
    },
  ],
};

// --- Zone 2: Power Village (exact traced Polygon) --------------------------

export const powerVillageGeoJSON: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Power Village — Heavy Weights" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [12.4753417, 43.9701404],
            [12.4755655, 43.9698254],
            [12.4765602, 43.9701511],
            [12.4763762, 43.9704662],
            [12.4762519, 43.9704339],
            [12.4753417, 43.9701404],
          ],
        ],
      },
    },
  ],
};

// --- Zone 3: Running Loop (exact traced LineString) ------------------------

// 1 km circuit following real roads (Via Rancaglia along the south, Piazzale
// Papa Giovanni Paolo II + the service road up the east), wrapping the complex
// perimeter on the north/west. Calibrated to ~1,000 m. Source: OpenStreetMap.
const RUNNING_LOOP_COORDS: [number, number][] = [
  [12.47508, 43.9695], // Via Rancaglia — SW
  [12.47528, 43.9696],
  [12.47543, 43.96967],
  [12.47635, 43.97004],
  [12.47686, 43.97023],
  [12.47744, 43.97035],
  [12.47765, 43.97041], // Via Rancaglia — SE
  [12.477, 43.97058],
  [12.4764, 43.97044], // Piazzale Papa Giovanni Paolo II
  [12.476, 43.9711],
  [12.4757, 43.97167], // service road — east side, north end
  [12.4753, 43.9726], // north edge
  [12.4741, 43.9715], // NW
  [12.4741, 43.9703], // west edge
  [12.4747, 43.96975], // SW down
  [12.47508, 43.9695], // close
];

export const runningLoopGeoJSON: FeatureCollection<LineString> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "1 km Running Loop" },
      geometry: { type: "LineString", coordinates: RUNNING_LOOP_COORDS },
    },
  ],
};

/** Great-circle length of a lng/lat polyline, in metres. */
function lineLengthMeters(coords: [number, number][]): number {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    const [lo1, la1] = coords[i - 1];
    const [lo2, la2] = coords[i];
    const dLat = rad(la2 - la1);
    const dLon = rad(lo2 - lo1);
    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(rad(la1)) * Math.cos(rad(la2)) * Math.sin(dLon / 2) ** 2;
    total += 2 * R * Math.asin(Math.sqrt(h));
  }
  return total;
}

// --- Race format & distances (HYROX standard) ------------------------------

/** Measured length of one running lap, in metres (≈ 1 km by design). */
export const RUNNING_LOOP_LENGTH_M = Math.round(lineLengthMeters(RUNNING_LOOP_COORDS));

/** HYROX runs 8 × 1 km laps, one before each workout station. */
export const RUN_COUNT = 8;

/** On-foot station distances (m): sled push 50 + pull 50 + burpees 80 +
 *  farmers carry 200 + sandbag lunges 100. (SkiErg/Row are on ergometers.) */
export const STATION_FOOT_M = 480;

/** Ergometer metres: SkiErg 1,000 + Row 1,000. */
export const MACHINE_M = 2000;

// --- Layer paint definitions -----------------------------------------------

export const runningLoopLayer: LayerProps = {
  id: "running-loop-line",
  type: "line",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-color": HYROX.yellow,
    "line-width": 4,
    "line-dasharray": [2, 1],
    "line-opacity": 0.95,
  },
};

export const indoorArenaLayer: LayerProps = {
  id: "indoor-arena-extrusion",
  type: "fill-extrusion",
  paint: {
    "fill-extrusion-color": HYROX.darkRed,
    "fill-extrusion-height": 18,
    "fill-extrusion-base": 0,
    "fill-extrusion-opacity": 0.65,
  },
};

export const powerVillageLayer: LayerProps = {
  id: "power-village-extrusion",
  type: "fill-extrusion",
  paint: {
    "fill-extrusion-color": HYROX.turf,
    "fill-extrusion-height": 4,
    "fill-extrusion-base": 0,
    "fill-extrusion-opacity": 0.65,
  },
};

/**
 * Surrounding city buildings in 3D. Pulls from the `composite` vector source
 * bundled with the dark-v11 style and extrudes each building by its `height`
 * property — adds real isometric depth around the venue.
 */
export const buildingsLayer: LayerProps = {
  id: "3d-buildings",
  source: "composite",
  "source-layer": "building",
  filter: ["==", "extrude", "true"],
  type: "fill-extrusion",
  minzoom: 14,
  paint: {
    "fill-extrusion-color": "#2b2b30",
    "fill-extrusion-height": ["get", "height"],
    "fill-extrusion-base": ["get", "min_height"],
    "fill-extrusion-opacity": 0.9,
  },
};

// --- Stations (markers) ----------------------------------------------------
// The 8 workout stations plus Start and Finish, positioned inside the Red
// (indoor) and Green (outdoor) polygons. Coordinates provided verbatim.

export type StationType = "indoor" | "outdoor";
export type StationIcon = "Play" | "Flag" | "Activity" | "Dumbbell" | "Target";

export interface Station {
  id: string;
  name: string;
  lng: number;
  lat: number;
  type: StationType;
  icon: StationIcon;
  /** Popup detail — distance/reps and surface. */
  distance?: string;
  surface?: string;
  /** Free-form note used for Start / Finish (no distance/surface). */
  note?: string;
}

export const STATIONS: Station[] = [
  // OUTDOOR (Green polygon) — distributed on a 3×2 grid inside the parking
  { id: "start", name: "START", lng: 12.475917, lat: 43.969999, type: "outdoor", icon: "Play", note: "Race start — 8 × 1 km runs separate the stations (8 km total)." },
  { id: "st2", name: "2. Sled Push", lng: 12.476118, lat: 43.970078, type: "outdoor", icon: "Dumbbell", distance: "50 m", surface: "Artificial turf" },
  { id: "st3", name: "3. Sled Pull", lng: 12.476386, lat: 43.970289, type: "outdoor", icon: "Dumbbell", distance: "50 m", surface: "Artificial turf" },
  { id: "st4", name: "4. Burpees", lng: 12.475954, lat: 43.970286, type: "outdoor", icon: "Activity", distance: "80 m broad jumps", surface: "Artificial turf" },
  { id: "st6", name: "6. Farmers Carry", lng: 12.475652, lat: 43.970117, type: "outdoor", icon: "Dumbbell", distance: "200 m", surface: "Flat asphalt" },
  { id: "st7", name: "7. Sandbags", lng: 12.476081, lat: 43.970327, type: "outdoor", icon: "Dumbbell", distance: "100 m lunges", surface: "Artificial turf" },

  // INDOOR (Red polygon) — single file up the arena (entry → finish)
  { id: "st1", name: "1. SkiErg", lng: 12.475327, lat: 43.970558, type: "indoor", icon: "Activity", distance: "1,000 m", surface: "Indoor parquet" },
  { id: "st5", name: "5. RowErg", lng: 12.4754, lat: 43.970782, type: "indoor", icon: "Activity", distance: "1,000 m", surface: "Indoor parquet" },
  { id: "st8", name: "8. Wall Balls", lng: 12.475473, lat: 43.971006, type: "indoor", icon: "Target", distance: "100 reps", surface: "Indoor parquet" },
  { id: "finish", name: "FINISH", lng: 12.475546, lat: 43.971229, type: "indoor", icon: "Flag", note: "Finish line — timing gate and podium." },
];
