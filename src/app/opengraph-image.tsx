import { ImageResponse } from "next/og";
import { site } from "@/config/site";

/** Preview card shown when the link is shared on WhatsApp, Instagram, etc. */
export const alt = `${site.name} — Certified Personal Trainer in ${site.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#0b0b0c",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#e8ff4d",
            fontSize: 22,
            letterSpacing: 5,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 14, height: 14, background: "#e8ff4d" }} />
          Certified Personal Trainer · {site.city}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              color: "#f5f5f3",
              fontSize: 84,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -2,
              textTransform: "uppercase",
              maxWidth: 940,
            }}
          >
            Train for a body that lasts
          </div>
          <div
            style={{
              display: "flex",
              color: "#a8a9a4",
              fontSize: 28,
              letterSpacing: 1,
            }}
          >
            Online coaching · Prehab &amp; rehab · Nutrition
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "2px solid #2a2c31",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#f5f5f3",
              fontSize: 34,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Fit with <span style={{ color: "#e8ff4d" }}>&nbsp;Vijay</span>
          </div>
          {/* Plain latin text only — Satori downloads a font per glyph, and
              symbols like ★ fail the build if that download is unavailable. */}
          <div
            style={{
              display: "flex",
              background: "#e8ff4d",
              color: "#0b0b0c",
              fontSize: 22,
              padding: "10px 18px",
              letterSpacing: 2,
            }}
          >
            RATED {site.rating.value} ON GOOGLE
          </div>
        </div>
      </div>
    ),
    size,
  );
}
