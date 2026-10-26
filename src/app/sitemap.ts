import type { MetadataRoute } from "next";
import { developmentPageContent } from "@/content/desarrollo-y-consultoria";
import { teamContent } from "@/content/home";
import { homeLink, navigation } from "@/content/navigation";
import { site } from "@/content/site";
import { photoCopy } from "@/lib/image-loader";

// Written once at build time, which a static export requires.
export const dynamic = "force-static";

/** The largest web copy of a photograph, as an absolute URL. */
function photoUrl(src: string) {
  const copy = photoCopy(src, Number.POSITIVE_INFINITY);
  return copy ? `${site.url}${copy}` : null;
}

/** The photographs a route shows, so image search finds them with the page. */
const PHOTOS: Partial<Record<string, readonly { src: string }[]>> = {
  [homeLink.href]: teamContent.media.filter((frame) => frame.kind === "photo"),
  "/desarrollo-y-consultoria": developmentPageContent.build.photos,
};

/**
 * `/sitemap.xml`: every route at the address it is served from — with the
 * trailing slash the export gives every page — and, where a route shows the
 * team's photographs, their URLs as an image sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [homeLink.href, ...navigation.map((item) => item.href)];

  return routes.map((href) => ({
    url: `${site.url}${href === "/" ? "/" : `${href}/`}`,
    lastModified,
    changeFrequency: "monthly",
    priority: href === "/" ? 1 : 0.8,
    images: (PHOTOS[href] ?? [])
      .map((photo) => photoUrl(photo.src))
      .filter((url): url is string => url !== null),
  }));
}
