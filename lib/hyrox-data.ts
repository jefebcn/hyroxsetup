import type { FeatureCollection, LineString, Polygon } from "geojson";
import type { LayerProps } from "react-map-gl/mapbox";

/**
 * HYROX San Marino — map data & style config.
 *
 * Everything the map needs (viewport, terrain, GeoJSON for the three event
 * zones, and the Mapbox layer paint definitions) lives here so the React
 * components stay focused on rendering and interaction.
 *
 * Geometry is aligned to the real Multieventi Sport Domus complex in
 * Serravalle, San Marino, using OpenStreetMap data:
 *  - The running loop traces the real Via Rancaglia along the south of the site.
 *  - The indoor arena sits on the Multieventi hall, attached to the north edge
 *    of the Piscina Olimpica di Serravalle.
 *  - The power village covers the flat stadium parking to the south/south-east.
 * The stadium (grandstands to the east) is deliberately excluded from the loop.
 */

// --- Venue & viewport ------------------------------------------------------

/** Roof of the Multieventi Sport Domus. */
export const VENUE = {
  longitude: 12.4761,
  latitude: 43.9725,
} as const;

export const INITIAL_VIEW_STATE = {
  longitude: VENUE.longitude,
  latitude: VENUE.latitude,
  zoom: 17.3,
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

// --- Zone 1: 1km Running Loop (LineString) ---------------------------------
// Traces the real Via Rancaglia along the south of the complex, then wraps the
// north / east / west perimeter of the arena + parking. Stays west of the
// football stadium. Total length ≈ 1.1 km.

const RUNNING_LOOP_COORDS: [number, number][] = [
  [12.4747, 43.9729], // NW corner
  [12.4772, 43.9729], // NE corner
  [12.4776, 43.9713], // E side (kept west of the stadium)
  [12.47778, 43.97046], // join Via Rancaglia (SE)
  // --- real Via Rancaglia points, running east → west along the south ---
  [12.47765, 43.97041],
  [12.47744, 43.97035],
  [12.47686, 43.97023],
  [12.47657, 43.97013],
  [12.47635, 43.97004],
  [12.47543, 43.96967],
  [12.47528, 43.9696],
  [12.47517, 43.96954],
  [12.47508, 43.9695],
  // --- close the loop up the west side ---
  [12.47488, 43.96985], // SW
  [12.4747, 43.9712], // W side
  [12.4747, 43.9729], // back to start
];

export const runningLoopGeoJSON: FeatureCollection<LineString> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "1km Running Loop", surface: "Via Rancaglia" },
      geometry: { type: "LineString", coordinates: RUNNING_LOOP_COORDS },
    },
  ],
};

// --- Zone 2: Indoor Arena (extruded Polygon) -------------------------------
// The Multieventi hall — Cardio Stations + Finish Line. Rotated ~20° to match
// the complex orientation, attached to the north edge of the Piscina Olimpica.

const ARENA_COORDS: [number, number][][] = [
  [
    [12.47542, 43.97178],
    [12.47654, 43.97207],
    [12.47628, 43.97258],
    [12.47516, 43.97229],
    [12.47542, 43.97178],
  ],
];

export const indoorArenaGeoJSON: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Indoor Arena — Cardio & Finish",
        height: 18,
        base: 0,
      },
      geometry: { type: "Polygon", coordinates: ARENA_COORDS },
    },
  ],
};

// --- Zone 3: Outdoor Power Village (extruded Polygon) ----------------------
// Flat stadium parking south / south-east of the Multieventi — sleds & lifting.

const VILLAGE_COORDS: [number, number][][] = [
  [
    [12.47547, 43.96999],
    [12.47676, 43.97033],
    [12.47653, 43.97081],
    [12.47524, 43.97047],
    [12.47547, 43.96999],
  ],
];

export const powerVillageGeoJSON: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Power Village — Heavy Weights",
        height: 4,
        base: 0,
      },
      geometry: { type: "Polygon", coordinates: VILLAGE_COORDS },
    },
  ],
};

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
    "fill-extrusion-height": ["get", "height"],
    "fill-extrusion-base": ["get", "base"],
    "fill-extrusion-opacity": 0.85,
  },
};

export const powerVillageLayer: LayerProps = {
  id: "power-village-extrusion",
  type: "fill-extrusion",
  paint: {
    "fill-extrusion-color": HYROX.turf,
    "fill-extrusion-height": ["get", "height"],
    "fill-extrusion-base": ["get", "base"],
    "fill-extrusion-opacity": 0.8,
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

// --- Stations (markers + popups) -------------------------------------------

export type StationCategory = "finish" | "cardio" | "sled" | "strength";

export interface Station {
  id: string;
  name: string;
  description: string;
  category: StationCategory;
  /** Which zone toggle controls this marker's visibility. */
  zone: "arena" | "village";
  coordinates: [number, number];
}

export const STATIONS: Station[] = [
  // Indoor Arena (Multieventi hall)
  {
    id: "finish",
    name: "🏁 Finish Line",
    description: "The final push. Timing gate and podium at the heart of the arena.",
    category: "finish",
    zone: "arena",
    coordinates: [12.47585, 43.97211],
  },
  {
    id: "skierg",
    name: "SkiErg",
    description: "1,000 m ski. Opening cardio station on the parquet.",
    category: "cardio",
    zone: "arena",
    coordinates: [12.47558, 43.97223],
  },
  {
    id: "row",
    name: "RowErg",
    description: "1,000 m row. Second indoor cardio block before the finish.",
    category: "cardio",
    zone: "arena",
    coordinates: [12.47612, 43.97223],
  },
  // Outdoor Power Village (stadium parking)
  {
    id: "sled-push",
    name: "Sled Push",
    description: "50 m heavy sled push on the artificial turf.",
    category: "sled",
    zone: "village",
    coordinates: [12.47563, 43.97044],
  },
  {
    id: "sled-pull",
    name: "Sled Pull",
    description: "50 m sled pull. Grip and posterior-chain grinder.",
    category: "sled",
    zone: "village",
    coordinates: [12.47637, 43.97044],
  },
  {
    id: "farmers",
    name: "Farmers Carry",
    description: "200 m loaded carry through the power village.",
    category: "strength",
    zone: "village",
    coordinates: [12.47563, 43.97027],
  },
  {
    id: "lunges",
    name: "Sandbag Lunges",
    description: "100 m walking lunges under a loaded sandbag.",
    category: "strength",
    zone: "village",
    coordinates: [12.47637, 43.97027],
  },
  {
    id: "wallballs",
    name: "Wall Balls",
    description: "100 reps to close the race before the run back to the finish.",
    category: "strength",
    zone: "village",
    coordinates: [12.476, 43.97036],
  },
];
