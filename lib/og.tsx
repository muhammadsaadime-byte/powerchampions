import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Branded Open Graph image: ink background, gold rule, page title, logo, tagline. */
export async function renderOg(title: string, eyebrow = "PowerChampions") {
  const svg = await readFile(join(process.cwd(), "public/images/site/powerchampions-logo-trim.svg"), "utf8");
  const logo = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#101010",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(234,166,7,0.28), transparent 45%), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 64px 64px, 64px 64px",
          color: "#fff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={300} height={100} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#EAA607", fontSize: 26, letterSpacing: 6, textTransform: "uppercase" }}>
            <div style={{ width: 56, height: 3, background: "linear-gradient(90deg,#EAA607,#F57500)" }} />
            {eyebrow}
          </div>
          <div style={{ marginTop: 22, fontSize: title.length > 48 ? 58 : 72, fontWeight: 700, lineHeight: 1.05, maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "rgba(255,255,255,0.7)" }}>
          <span>Critical power across the Southeast</span>
          <span style={{ color: "#EAA607" }}>power-champions.com</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
