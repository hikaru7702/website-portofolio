import type { MetadataRoute } from "next";
import { profile } from "@/lib/data/profile";
import { publicPath } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: publicPath("/"),
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.name,
    description:
      "Portofolio interaktif: karya, keahlian, pengalaman, dan kontak.",
    start_url: `${publicPath("/")}?source=pwa`,
    scope: publicPath("/"),
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    lang: "id",
    dir: "ltr",
    categories: ["portfolio", "productivity", "design"],
    icons: [
      {
        src: publicPath("/icons/192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: publicPath("/icons/512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: publicPath("/icons/maskable.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Lihat Karya",
        short_name: "Karya",
        description: "Lihat kumpulan proyek terpilih",
        url: publicPath("/#works"),
        icons: [
          { src: publicPath("/icons/192.png"), sizes: "192x192" },
        ],
      },
      {
        name: "Hubungi Saya",
        short_name: "Kontak",
        description: "Kirim pesan atau lihat informasi kontak",
        url: publicPath("/#contact"),
        icons: [
          { src: publicPath("/icons/192.png"), sizes: "192x192" },
        ],
      },
      {
        name: "Curriculum Vitae",
        short_name: "CV",
        description: "Lihat CV siap cetak",
        url: publicPath("/cv/"),
        icons: [
          { src: publicPath("/icons/192.png"), sizes: "192x192" },
        ],
      },
    ],
  };
}
