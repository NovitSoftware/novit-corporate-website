import { withBasePath } from "@/lib/base-path";
import photoWidths from "@/lib/photo-widths.json";

/** The widths `scripts/photos.mjs` writes, smallest first. */
const WIDTHS = [...photoWidths.imageSizes, ...photoWidths.deviceSizes];

/** A photograph from `media/team`, named by its original file. */
const PHOTO = /^\/team\/([^/]+)\.(?:jpe?g|png)$/i;

/**
 * A static export has no image optimizer to call, so the copies `next/image`
 * asks for are made ahead of time.
 *
 * The site's photographs live as originals in `media/team` and are named in
 * the content by that file (`/team/cena-2024.jpg`); `scripts/photos.mjs` runs
 * before `next dev` and `next build` and writes a WebP of each at every width
 * in `photo-widths.json`, which `next.config.ts` hands `next/image` as its
 * sizes. So a 240px tile fetches the 480px copy on a phone or a retina screen
 * and the 240px one otherwise — never the original.
 *
 * Everything else — the logos, the flags — is served as it is, with the base
 * path added, which `next/image` does not add to `src` on its own. `w` is
 * ignored by the host; it is there so each width in `srcset` is a distinct URL.
 */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  const copy = photoCopy(src, width);
  return copy ? withBasePath(copy) : `${withBasePath(src)}?w=${width}`;
}

/** The web copy that serves a photograph at `width`, as a root-relative path
 *  without the base path; `null` for anything that is not a photograph. The
 *  sitemap names the largest one. */
export function photoCopy(src: string, width: number): string | null {
  const photo = PHOTO.exec(src);
  if (!photo) {
    return null;
  }
  const fit = WIDTHS.find((w) => w >= width) ?? WIDTHS[WIDTHS.length - 1];
  return `/team/${photo[1]}-${fit}.webp`;
}
