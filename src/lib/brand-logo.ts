/**
 * The logo, as artwork rather than as geometry.
 *
 * This replaces the traced vector the site used to draw. The official file is
 * `Logo_Novit.png` — a 1080x1080 RGBA export with the lockup sitting in a band
 * across the middle, transparent everywhere else — and it is the original, so
 * it is what ships. The four files below are that export cropped to its own
 * ink and nothing more: no redrawing, no re-tracing, no approximation of a
 * curve. The brandbook's rule is that the logo is never altered, and the only
 * safe way to honour that is to publish the artwork.
 *
 * Two colourways, because the brandbook names two of its permitted uses and
 * the site needs both:
 *
 * - `colour` is the export untouched — the celeste-to-azul lockup. It is the
 *   "azul sobre blanco" use, so it is only ever put on white or on the light
 *   surface grey.
 * - `white` is the same artwork with every ink pixel set to flat white and the
 *   alpha channel left exactly as it was. That is the "blanco sobre degradé
 *   azul" use the brandbook lists, and it is what the header, the footer and
 *   the intro need, because this site's ground is the blue-to-violet gradient
 *   from end to end. It is not a recolour into a new hue — it is the white
 *   lockup, which the design system says exists as `logo_novit_white.png` in
 *   the brand asset library; that file was not in the repo, so it is derived
 *   from the original's own silhouette instead of being invented.
 *
 * The original's 1080x1080 canvas is deliberately not what ships: 81% of its
 * height is empty, so laying it out means a box five times taller than the
 * logo, and every consumer ends up nudging it back with negative margins.
 * Cropped to the ink, the lockup is a plain 4.53:1 box that behaves like any
 * other image.
 *
 * Sizes are the real pixel dimensions of the files, which `next/image` needs
 * to reserve the right space before the bytes arrive.
 */
export const BRAND_LOGO = {
  /** Isotipo and wordmark together, as the file draws them. */
  lockup: {
    colour: "/brand/logo-novit.png",
    white: "/brand/logo-novit-white.png",
    width: 910,
    height: 201,
  },
  /** The isotipo alone, split at the gutter the artwork itself leaves. */
  isotipo: {
    colour: "/brand/isotipo-novit.png",
    white: "/brand/isotipo-novit-white.png",
    width: 240,
    height: 201,
  },
} as const;

export type BrandLogoTone = "white" | "colour";
