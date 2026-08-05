# HYROX San Marino — Interactive 3D Map Viewer

A full-screen, dark-themed 3D map viewer for the **HYROX** fitness competition at the
**Multieventi Sport Domus** in the Republic of San Marino. Built to show stakeholders that the
hybrid indoor/outdoor event layout has no bottlenecks across its three zones.

Centered on the venue (`12.4795, 43.9715`) with 3D terrain so the San Marino hill's elevation is
visible, an isometric camera (`pitch: 60`, `bearing: -20`), and independent layer toggles for each
event zone.

## Features

- 🗺️ Full-screen Mapbox GL canvas (`100vw` × `100vh`) on the `dark-v11` style
- ⛰️ 3D terrain (`mapbox-dem`) revealing the venue's elevation
- 🎛️ Glass-morphism sidebar with three independent layer toggles:
  - 🏃 **1km Running Loop** — dashed yellow `LineString` circling the building
  - 🏟️ **Indoor Arena** — dark-red 3D extruded polygon (Cardio & Finish Line)
  - ⛺ **Power Village** — green 3D extruded polygon (turf / heavy weights)
- 🎨 HYROX brand palette (Black, Yellow `#fbc02d`, Red `#e74c3c`)

## Tech stack

| Concern    | Choice                                    |
| ---------- | ----------------------------------------- |
| Framework  | Next.js 15 (App Router) + React 19 + TS   |
| Styling    | Tailwind CSS v4                           |
| Mapping    | Mapbox GL JS v3 via `react-map-gl` v8     |
| Icons      | `lucide-react`                            |
| Deployment | Vercel                                    |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Mapbox token

Copy the example env file and drop in a token from
[account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens/):

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
```

> The `NEXT_PUBLIC_` prefix is required — Mapbox GL JS runs in the browser, so the token must be
> exposed to the client. `.env.local` is git-ignored; never commit a real token.
>
> Without a token the app renders a friendly fallback screen instead of crashing.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  layout.tsx          # root layout + metadata, full-bleed dark theme
  page.tsx            # renders the full-screen MapViewer
  globals.css         # Tailwind v4 import + viewport reset
components/
  MapViewer.tsx       # 'use client' — Mapbox map, terrain, sources & layers, state
  Sidebar.tsx         # glass sidebar with the three layer toggles + legend
lib/
  hyrox-data.ts       # viewport/terrain config, mock GeoJSON, layer paint styles
```

All map data lives in `lib/hyrox-data.ts` — mock GeoJSON for the three zones plus the Mapbox layer
paint definitions — so the components stay focused on rendering.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel — the framework is auto-detected as Next.js.
3. Add the `NEXT_PUBLIC_MAPBOX_TOKEN` environment variable in the Vercel project settings.
4. Deploy.

## Notes

The GeoJSON is realistic **mock** data — event zones are hand-placed around the venue to illustrate
the footprint, not surveyed coordinates. Swap the geometry in `lib/hyrox-data.ts` for real survey
data when available.
