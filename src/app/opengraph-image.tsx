import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { metadataContent, site } from "@/content/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const alt = metadataContent.title;

/**
 * The link-preview card.
 *
 * The logo used to be rebuilt here out of ten positioned `<div>`s, because
 * Satori cannot take an inline SVG and the mark was only available as path
 * data. Now that the logo is artwork, the card embeds the real file — read off
 * disk at build time and inlined as a data URI, since this route is statically
 * generated and Satori will not fetch a relative path.
 *
 * The white colourway, because the card's ground is brand azul.
 */
export default async function OpenGraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public", "brand", "logo-novit-white.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0089",
          color: "#FFFFFF",
          padding: 72,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={326} height={72} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#3DB0E4",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            {metadataContent.ogHeadline}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.78)",
              maxWidth: 820,
            }}
          >
            {metadataContent.ogSupporting}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
