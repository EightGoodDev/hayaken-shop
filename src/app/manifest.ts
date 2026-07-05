export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} ｜ ホームセンター通販`,
    short_name: "ハヤケン",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#f4f5f7",
    theme_color: "#e8631a",
    lang: "ja",
    icons: [
      { src: "/icon-pwa", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-pwa", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
