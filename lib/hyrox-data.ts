import type { FeatureCollection, LineString, Polygon } from "geojson";
import type { LayerProps } from "react-map-gl/mapbox";

/**
 * HYROX San Marino — map data & style config.
 *
 * Everything the map needs (viewport, terrain, mock GeoJSON for the three event
 * zones, and the Mapbox layer paint definitions) lives here so the React
 * components stay focused on rendering and interaction.
 *
 * Coordinates are centered on the Multieventi Sport Domus, San Marino.
 * The GeoJSON is realistic *mock* data — hand-placed around the venue to
 * illustrate the event footprint, not surveyed positions.
 */

// --- Venue & viewport ------------------------------------------------------

export const VENUE = {
  longitude: 12.4795,
  latitude: 43.9715,
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

// --- Geometry helpers ------------------------------------------------------

/**
 * Rough conversion of a metre offset to degrees at this latitude.
 * Good enough for placing mock event zones around the venue.
 */
const M_PER_DEG_LAT = 111_320;
const M_PER_DEG_LNG = 111_320 * Math.cos((VENUE.latitude * Math.PI) / 180);

type LngLat = [number, number];

/** Offset the venue center by (east, north) metres → [lng, lat]. */
function offset(eastM: number, northM: number): LngLat {
  return [
    VENUE.longitude + eastM / M_PER_DEG_LNG,
    VENUE.latitude + northM / M_PER_DEG_LAT,
  ];
}

/** Build a closed rectangular ring (metres) → GeoJSON polygon ring. */
function rectRing(
  centerE: number,
  centerN: number,
  halfWidth: number,
  halfHeight: number,
): LngLat[] {
  return [
    offset(centerE - halfWidth, centerN - halfHeight),
    offset(centerE + halfWidth, centerN - halfHeight),
    offset(centerE + halfWidth, centerN + halfHeight),
    offset(centerE - halfWidth, centerN + halfHeight),
    offset(centerE - halfWidth, centerN - halfHeight), // close ring
  ];
}

// --- Zone 1: 1km Running Loop (LineString) ---------------------------------
// A closed loop wrapping the building (~1km), evoking Via Rancaglia circling
// the site on the inclined road. An oval built from sampled points.

const LOOP_HALF_W = 160; // metres, east-west radius
const LOOP_HALF_H = 120; // metres, north-south radius
const LOOP_POINTS = 48;

const runningLoopCoords: LngLat[] = Array.from(
  { length: LOOP_POINTS + 1 },
  (_, i) => {
    const t = (i / LOOP_POINTS) * Math.PI * 2;
    return offset(Math.cos(t) * LOOP_HALF_W, Math.sin(t) * LOOP_HALF_H);
  },
);

export const runningLoopGeoJSON: FeatureCollection<LineString> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "1km Running Loop", surface: "inclined road" },
      geometry: { type: "LineString", coordinates: runningLoopCoords },
    },
  ],
};

// --- Zone 2: Indoor Arena (extruded Polygon) -------------------------------
// The main basketball court in the center — Cardio Stations + Finish Line.

export const indoorArenaGeoJSON: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Indoor Arena — Cardio & Finish",
        height: 16,
        base: 0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [rectRing(0, 0, 32, 22)],
      },
    },
  ],
};

// --- Zone 3: Outdoor Power Village (extruded Polygon) ----------------------
// Flat parking lot / artificial turf, adjacent to the arena — sleds & lifting.

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
      geometry: {
        type: "Polygon",
        // offset ~90m east of the arena (adjacent stadium parking)
        coordinates: [rectRing(90, -10, 40, 30)],
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
