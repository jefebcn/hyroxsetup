"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type Lang = "it" | "en";

type Dict = Record<string, string>;

/** UI chrome strings. */
const UI: Record<Lang, Dict> = {
  en: {
    "aria.hide": "Hide panel",
    "aria.show": "Show event layers",
    venue: "Multieventi Sport Domus · San Marino",
    eventZones: "Event Zones",
    raceFormat: "Race format & distances",
    materials: "Materials & logistics",
    legend: "Legend",
    buildSetup: "Build & setup",

    "tog.running": "Running Loop",
    "tog.running.sub": "Lap route · indoor ⇄ piazza stations",
    "tog.arena": "Indoor Arena",
    "tog.arena.sub": "Cardio Stations & Finish Line",
    "tog.village": "Power Village",
    "tog.village.sub": "Heavy sleds & lifting · Stadium Parking",
    "tog.stations": "Station Markers",
    "tog.stations.sub": "8 workouts + Start & Finish",

    "rf.lap": "Lap length",
    "rf.runTarget": "Run target",
    "rf.laps": "Laps for the run",
    "rf.stationsFoot": "Stations (on foot)",
    "rf.ergo": "Ergometers",
    "rf.totalFoot": "Total on foot",
    "rf.divisions": "Divisions",
    "rf.divisions.v": "Open · Pro (Doubles · Relay)",

    "lg.dash": "Dashed line — running route",
    "lg.red": "Red volume — indoor arena",
    "lg.green": "Green volume — power village turf",

    "bs.prereq": "Prerequisites",
    "bs.prereq.node": "Node.js 18+ and npm",
    "bs.prereq.mapbox": "A Mapbox account + public token (pk.…)",
    "bs.env": "Environment variable",
    "bs.env.note":
      "Put it in .env.local for local dev, and in Vercel → Settings → Environment Variables for production.",
    "bs.commands": "Commands",
    "bs.deps": "Key dependencies",
    "bs.deploy": "Deploy",
    "bs.deploy.note":
      "Vercel — framework preset Next.js (pinned in vercel.json). Add the token env var, then deploy.",

    "pp.indoor": "Indoor",
    "pp.outdoor": "Outdoor",
    "pp.station": "Station",
    "pp.arriveFrom": "Arrive from",
    "pp.run": "Run",
    "pp.then": "Then",
    "pp.startRace": "Start the race",
    "pp.finish": "Finish — race complete",
    "pp.do": "Do",
    "pp.laps": "laps",
    "pp.surface": "Surface",
    "pp.space": "Space",
    "pp.weight": "Weight",
    "pp.equipment": "Equipment",
    "aria.reset": "Reset view",
    "aria.focus": "Focus zone",
    loading: "Loading map…",
    "rf.estTime": "Est. finish",
    "rf.estTime.v": "~60–90 min",
    "lg.pins": "Station pins",
    "lg.mStartFinish": "Black/yellow — Start & Finish",
    "lg.mIndoor": "Red pin — indoor station",
    "lg.mOutdoor": "Green pin — outdoor station",
    "aria.export": "Export",
    "export.png": "PNG image",
    "export.pdf": "PDF",
    "aria.tourPlay": "Play sequence",
    "aria.tourPause": "Pause sequence",
  },
  it: {
    "aria.hide": "Nascondi pannello",
    "aria.show": "Mostra livelli evento",
    venue: "Multieventi Sport Domus · San Marino",
    eventZones: "Zone evento",
    raceFormat: "Formato gara & distanze",
    materials: "Materiali & logistica",
    legend: "Legenda",
    buildSetup: "Build & setup",

    "tog.running": "Giro di corsa",
    "tog.running.sub": "Percorso giro · stazioni indoor ⇄ piazza",
    "tog.arena": "Arena indoor",
    "tog.arena.sub": "Stazioni cardio & Traguardo",
    "tog.village": "Power Village",
    "tog.village.sub": "Sled pesanti & sollevamenti · Parcheggio stadio",
    "tog.stations": "Marker stazioni",
    "tog.stations.sub": "8 esercizi + Start & Finish",

    "rf.lap": "Lunghezza giro",
    "rf.runTarget": "Obiettivo corsa",
    "rf.laps": "Giri per la corsa",
    "rf.stationsFoot": "Stazioni (a piedi)",
    "rf.ergo": "Ergometri",
    "rf.totalFoot": "Totale a piedi",
    "rf.divisions": "Divisioni",
    "rf.divisions.v": "Open · Pro (Doppi · Staffetta)",

    "lg.dash": "Linea tratteggiata — percorso di corsa",
    "lg.red": "Volume rosso — arena indoor",
    "lg.green": "Volume verde — erba power village",

    "bs.prereq": "Prerequisiti",
    "bs.prereq.node": "Node.js 18+ e npm",
    "bs.prereq.mapbox": "Un account Mapbox + token pubblico (pk.…)",
    "bs.env": "Variabile d'ambiente",
    "bs.env.note":
      "Mettilo in .env.local per lo sviluppo locale e in Vercel → Settings → Environment Variables per la produzione.",
    "bs.commands": "Comandi",
    "bs.deps": "Dipendenze principali",
    "bs.deploy": "Deploy",
    "bs.deploy.note":
      "Vercel — preset framework Next.js (fissato in vercel.json). Aggiungi la env var del token, poi fai il deploy.",

    "pp.indoor": "Indoor",
    "pp.outdoor": "Outdoor",
    "pp.station": "Stazione",
    "pp.arriveFrom": "Arrivi da",
    "pp.run": "Corsa",
    "pp.then": "Poi",
    "pp.startRace": "Partenza della gara",
    "pp.finish": "Traguardo — gara completata",
    "pp.do": "Esegui",
    "pp.laps": "giri",
    "pp.surface": "Superficie",
    "pp.space": "Spazio",
    "pp.weight": "Peso",
    "pp.equipment": "Attrezzatura",
    "aria.reset": "Reimposta vista",
    "aria.focus": "Inquadra zona",
    loading: "Caricamento mappa…",
    "rf.estTime": "Tempo stimato",
    "rf.estTime.v": "~60–90 min",
    "lg.pins": "Pin stazioni",
    "lg.mStartFinish": "Nero/giallo — Partenza & Arrivo",
    "lg.mIndoor": "Pin rosso — stazione indoor",
    "lg.mOutdoor": "Pin verde — stazione outdoor",
    "aria.export": "Esporta",
    "export.png": "Immagine PNG",
    "export.pdf": "PDF",
    "aria.tourPlay": "Avvia sequenza",
    "aria.tourPause": "Ferma sequenza",
  },
};

/** Data-string translations (English value → Italian value). */
const DATA_IT: Dict = {
  // station names
  START: "PARTENZA",
  "1. SkiErg": "1. SkiErg",
  "2. Sled Push": "2. Spinta sled",
  "3. Sled Pull": "3. Traino sled",
  "4. Burpee Broad Jumps": "4. Burpee con salto",
  "5. RowErg": "5. Vogatore",
  "6. Farmers Carry": "6. Trasporto Farmer",
  "7. Sandbag Lunges": "7. Affondi con sandbag",
  "8. Wall Balls": "8. Palla al muro",
  FINISH: "ARRIVO",
  // surfaces
  "Artificial turf": "Erba sintetica",
  "Indoor parquet": "Parquet indoor",
  "Flat asphalt": "Asfalto piano",
  // distances
  "50 m (4 × 12.5 m)": "50 m (4 × 12,5 m)",
  "1,000 m": "1.000 m",
  "100 reps": "100 rip.",
  // space
  "Start corral ~10 × 6 m": "Zona partenza ~10 × 6 m",
  "Lane ~15 × 2.5 m": "Corsia ~15 × 2,5 m",
  "12.5 m pull + rope zone, ~3 m wide": "12,5 m pull + zona corda, ~3 m largh.",
  "Lane ~20 × 2 m": "Corsia ~20 × 2 m",
  "Lane ~25 × 2 m (turns)": "Corsia ~25 × 2 m (con inversioni)",
  "Lane ~25 × 2 m": "Corsia ~25 × 2 m",
  "~2 × 1.5 m per lane": "~2 × 1,5 m per corsia",
  "~2.5 × 1 m per lane": "~2,5 × 1 m per corsia",
  "~2 × 2 m per station": "~2 × 2 m per postazione",
  "Finish lane ~8 × 4 m": "Zona arrivo ~8 × 4 m",
  // weights
  "W 102 · M 152 · Pro W 152 / M 202 kg (incl. sled)":
    "D 102 · U 152 · Pro D 152 / U 202 kg (sled incl.)",
  "W 78 · M 103 · Pro W 103 / M 153 kg (incl. sled)":
    "D 78 · U 103 · Pro D 103 / U 153 kg (sled incl.)",
  "2× — W 16 · M 24 · Pro W 24 / M 32 kg":
    "2× — D 16 · U 24 · Pro D 24 / U 32 kg",
  "W 10 · M 20 · Pro W 20 / M 30 kg": "D 10 · U 20 · Pro D 20 / U 30 kg",
  "W 4 · M 6 · Pro W 6 / M 9 kg · target ~2.7–3 m":
    "D 4 · U 6 · Pro D 6 / U 9 kg · target ~2,7–3 m",
  Bodyweight: "Corpo libero",
  "No load (ergometer)": "Nessun carico (ergometro)",
  // equipment
  "Start arch": "Arco di partenza",
  "Timing mat": "Tappeto cronometraggio",
  Barriers: "Barriere",
  "HYROX push sled": "Sled push HYROX",
  "Weight plates": "Dischi",
  "Turf lane": "Corsia in erba",
  "HYROX pull sled": "Sled pull HYROX",
  Rope: "Corda",
  "Lane markers": "Segnalatori corsia",
  Mats: "Tappetini",
  "2× kettlebells": "2× kettlebell",
  Sandbag: "Sandbag",
  "Concept2 SkiErg": "SkiErg Concept2",
  "Floor protection": "Protezione pavimento",
  "Concept2 RowErg": "RowErg Concept2",
  "Wall ball": "Wall ball",
  Target: "Target",
  "Finish arch": "Arco di arrivo",
  "Timing gate": "Gate cronometraggio",
  Podium: "Podio",
  // notes
  "Race start — 8 × 1 km runs separate the stations (8 km total).":
    "Partenza — 8 corse da 1 km separano le stazioni (8 km totali).",
  "Finish line — timing gate and podium.":
    "Traguardo — gate cronometraggio e podio.",
  // logistics
  "Indoor Arena": "Arena indoor",
  "Finish arch + timing gates": "Arco arrivo + gate cronometraggio",
  "SkiErg + RowErg ergometers": "Ergometri SkiErg + RowErg",
  "Parquet floor protection": "Protezione parquet",
  "Roxzone mats & signage": "Tappeti Roxzone & segnaletica",
  "Scoreboard / LED screens": "Tabellone / schermi LED",
  "Power Village — tents & gear": "Power Village — tende & attrezzi",
  "Main marquee (tendone) over the sled area":
    "Tendone principale sopra l'area sled",
  "Artificial-turf lanes": "Corsie in erba sintetica",
  "Push & pull sleds + weight plates": "Sled push & pull + dischi",
  "Kettlebells & farmers handles": "Kettlebell & maniglie farmers",
  Sandbags: "Sandbag",
  "Wall-ball targets": "Target wall-ball",
  "Water / feed tent": "Tenda ristoro / acqua",
  "Athlete services (tents)": "Servizi atleti (tende)",
  "Registration & check-in tent": "Tenda registrazione & check-in",
  "Medical / physio tent": "Tenda medica / fisio",
  "Bag drop & changing rooms": "Deposito borse & spogliatoi",
  "Warm-up area": "Area riscaldamento",
  Course: "Percorso",
  "Run-route barriers & fencing": "Barriere & transenne percorso",
  "Directional signage": "Segnaletica direzionale",
  "Lap / km markers": "Marker giri / km",
  "Marshal points": "Punti marshal",
};

interface I18n {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a UI key. */
  t: (key: string) => string;
  /** Translate a data string (returns original if untranslated / EN). */
  d: (s?: string) => string | undefined;
}

const I18nContext = createContext<I18n>({
  lang: "it",
  setLang: () => {},
  t: (k) => k,
  d: (s) => s,
});

const STORAGE_KEY = "hyrox.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");

  // Restore the saved language on mount and reflect it on <html lang>.
  useEffect(() => {
    let initial: Lang = "it";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "it" || stored === "en") initial = stored;
    } catch {
      /* localStorage unavailable */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLangState(initial);
    document.documentElement.lang = initial;
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }, []);

  const value = useMemo<I18n>(
    () => ({
      lang,
      setLang,
      t: (key) => UI[lang][key] ?? UI.en[key] ?? key,
      d: (s) => (s == null ? s : lang === "it" ? DATA_IT[s] ?? s : s),
    }),
    [lang, setLang],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
