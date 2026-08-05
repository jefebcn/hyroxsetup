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
  longitude: VENUE.longitude,
  latitude: VENUE.latitude,
  zoom: 17.5,
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

export const runningLoopGeoJSON: FeatureCollection<LineString> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "1km Running Loop" },
      geometry: {
        type: "LineString",
        coordinates: [
          [12.4763315, 43.9700473],
          [12.4753715, 43.9696285],
          [12.4752671, 43.970212],
          [12.4761972, 43.9705127],
          [12.4756114, 43.9714844],
          [12.4746811, 43.9711906],
          [12.4752128, 43.9702124],
          [12.4753304, 43.9696268],
          [12.47629, 43.9700645],
          [12.47629, 43.9700645],
        ],
      },
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
    "fill-extrusion-height": 18,
    "fill-extrusion-base": 0,
    "fill-extrusion-opacity": 0.85,
  },
};

export const powerVillageLayer: LayerProps = {
  id: "power-village-extrusion",
  type: "fill-extrusion",
  paint: {
    "fill-extrusion-color": HYROX.turf,
    "fill-extrusion-height": 4,
    "fill-extrusion-base": 0,
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
// Removed the previously-guessed station coordinates. Provide real station
// positions and they can be added back here precisely.

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

export const STATIONS: Station[] = [];
