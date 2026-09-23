import { withBasePath } from "@/lib/base-path";

/**
 * A static export has no image optimizer to call, so `next/image` serves the
 * files in `public/` as they are. The loader's only job is the base path,
 * which `next/image` does not add to `src` on its own. `w` is ignored by the
 * host; it is there so each width in `srcset` is a distinct URL.
 */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  return `${withBasePath(src)}?w=${width}`;
}
