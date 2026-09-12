import Image from "next/image";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { BRAND_LOGO, type BrandLogoTone } from "@/lib/brand-logo";

type LogoProps = {
  href?: string;
  /** Full lockup by default; `false` for the isotipo on its own. */
  showWordmark?: boolean;
  className?: string;
  /**
   * Which colourway. White by default: every ground this site puts a logo on
   * is the brand gradient. `colour` is for a white or light-grey plate.
   */
  tone?: BrandLogoTone;
  /** Set on the one logo that is above the fold on first paint. */
  priority?: boolean;
  onClick?: () => void;
};

/**
 * The logo, as the official artwork.
 *
 * It used to be an SVG this file drew itself, out of path data traced from
 * `Logo_Novit.svg` — ten rects for the isotipo and the wordmark split into five
 * addressable letters. All of that is gone: the logo is now `next/image`
 * pointing at the PNG export. See `lib/brand-logo.ts` for the files and why
 * there are two colourways.
 *
 * What went with it is the hover that walked a highlight down the five rows of
 * the isotipo. That effect only existed because the mark was a live DOM tree
 * with one node per shape, and a raster has no rows to address — so rather
 * than fake it with a filter or an overlay, there is no logo hover any more.
 * The link still shows focus like every other link on the page.
 *
 * `sizes` is worth setting even though this renders small: without it
 * `next/image` assumes the image could be viewport-wide and picks a source far
 * larger than the ~150px this is ever drawn at.
 */
export function Logo({
  href = "/",
  showWordmark = true,
  className,
  tone = "white",
  priority = false,
  onClick,
}: LogoProps) {
  const art = showWordmark ? BRAND_LOGO.lockup : BRAND_LOGO.isotipo;

  return (
    <a
      href={href}
      onClick={onClick}
      className={cn("logo inline-flex items-center", className)}
      aria-label={`${site.name}, ir al inicio`}
    >
      <Image
        src={art[tone]}
        alt=""
        width={art.width}
        height={art.height}
        priority={priority}
        sizes="200px"
        /* The isotipo alone is nearly square, so it is set a little shorter
           than the lockup to keep the two optically the same weight. */
        className={cn(
          "w-auto",
          showWordmark ? "h-8 sm:h-9" : "h-7 sm:h-8",
        )}
      />
    </a>
  );
}
