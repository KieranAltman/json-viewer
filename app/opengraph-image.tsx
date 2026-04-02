import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const alt = "JSON Viewer - Online JSON Formatter & Visualizer"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="4" y="4" width="56" height="56" rx="14" fill="#18181b"/>
  <path d="M22,16 C18,16 16,18 16,22 L16,28 C16,30 14,32 14,32 C14,32 16,34 16,36 L16,42 C16,46 18,48 22,48" fill="none" stroke="#fafafa" stroke-width="3" stroke-linecap="round"/>
  <path d="M42,16 C46,16 48,18 48,22 L48,28 C48,30 50,32 50,32 C50,32 48,34 48,36 L48,42 C48,46 46,48 42,48" fill="none" stroke="#fafafa" stroke-width="3" stroke-linecap="round"/>
  <line x1="26" y1="26" x2="38" y2="26" stroke="#a1a1aa" stroke-width="2" stroke-linecap="round"/>
  <line x1="26" y1="32" x2="34" y2="32" stroke="#fafafa" stroke-width="2" stroke-linecap="round"/>
  <line x1="26" y1="38" x2="36" y2="38" stroke="#a1a1aa" stroke-width="2" stroke-linecap="round"/>
</svg>`

const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`

export default async function Image() {
  const geistSemiBold = await readFile(
    join(process.cwd(), "assets/fonts/Geist-SemiBold.ttf"),
  )

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#09090b",
          padding: "80px 80px",
        }}
      >
        {/* Eyebrow chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 20px",
            backgroundColor: "rgba(161, 161, 170, 0.08)",
            border: "1px solid rgba(161, 161, 170, 0.2)",
            borderRadius: 9999,
            marginBottom: 40,
            alignSelf: "flex-start",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#a1a1aa",
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "rgba(250, 250, 250, 0.7)",
              letterSpacing: "0.05em",
            }}
          >
            Online Developer Tool
          </span>
        </div>

        {/* Logo + Headline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            marginBottom: 28,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDataUrl}
            width={88}
            height={88}
            alt=""
            style={{ borderRadius: 18 }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            <span style={{ color: "#fafafa" }}>JSON Viewer</span>
            <span
              style={{
                backgroundImage:
                  "linear-gradient(to right, #a1a1aa, rgba(161, 161, 170, 0.5))",
                backgroundClip: "text",
                color: "transparent",
                fontSize: 48,
              }}
            >
              Format & Visualize
            </span>
          </div>
        </div>

        {/* Subheadline */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "rgba(250, 250, 250, 0.5)",
            lineHeight: 1.6,
            maxWidth: 700,
            fontWeight: 600,
          }}
        >
          Free online JSON viewer with formatting, tree visualization, search
          filtering, and path copying. Supports file drag-and-drop and URL
          loading.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geistSemiBold,
          style: "normal" as const,
          weight: 600,
        },
      ],
    },
  )
}
