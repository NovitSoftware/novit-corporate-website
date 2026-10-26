import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Written once at build time, which a static export requires.
export const dynamic = "force-static";

/** `/robots.txt`: every page open to crawlers, and where the sitemap is. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
