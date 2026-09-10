import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Branded social share card (link previews on TikTok, IG, WhatsApp, etc.).
 * Uses system fonts so it renders without fetching external assets.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(60% 80% at 70% 20%, rgba(184,18,31,0.35), transparent 65%), #0a0a0c",
          padding: "72px",
          color: "#f3f2f0",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", color: "#d92c3a", fontSize: 40, letterSpacing: 4 }}>
            ||||
          </div>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            WALL BUY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -3,
            }}
          >
            Buy it off the wall.
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 34, color: "#9a9aa3" }}>
            Hand-built LED neon weapons — Zombies collection.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: 26 }}>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              borderRadius: 999,
              background: "#b8121f",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            Buy 2, save {SITE.bundle.percent}%
          </div>
          <div style={{ display: "flex", color: "#c9a24b" }}>Ships worldwide</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
