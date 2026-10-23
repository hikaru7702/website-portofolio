import type { MetadataRoute } from "next";
import { publicPath, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: publicPath("/"),
        disallow: [publicPath("/offline"), publicPath("/api/")],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: new URL(siteUrl).origin,
  };
}
