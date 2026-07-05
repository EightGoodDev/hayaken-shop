export const dynamic = "force-static";
import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} ｜ ホームセンター通販`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(120deg,#fff4ea 0%,#ffe6d6 55%,#ffd9c2 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 22,
              background: "linear-gradient(135deg,#e8631a,#d1495b)",
              color: "#fff",
              fontSize: 64,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            K
          </div>
          <div style={{ fontSize: 44, fontWeight: 800, color: "#c44f10" }}>ハヤケン eショップ</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 68, fontWeight: 800, color: "#1f2530", marginTop: 40, lineHeight: 1.25 }}>
          <span>暮らしとDIYの</span>
          <span>「欲しい」がそろう。</span>
        </div>
        <div style={{ fontSize: 30, color: "#4b5563", marginTop: 28 }}>
          工具・園芸・日用品・作業用品まで ／ ホームセンター通販
        </div>
      </div>
    ),
    { ...size },
  );
}
