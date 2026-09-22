import type { ClientLogo } from "@/content/cases";
import { Image } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

type CaseLogoProps = {
  logo: ClientLogo;
  className?: string;
};

/**
 * A client's mark, straight on the page's own ground, forced white.
 *
 * No plate: every file is on transparency, so it reads on the gradient
 * unaided — and a white rectangle behind a mark on this ground reads as a
 * sticker stuck to the page. Not every file ships white ink, though, so
 * `brightness(0) invert(1)` collapses whatever colour the artwork carries
 * into a solid white silhouette on the same alpha; a mark that is already
 * white passes through it unchanged. `logo.mono === false` skips the filter
 * — see `ClientLogo`.
 *
 * The box is one height for every mark in a row, so the card heads line up
 * whatever the artwork's proportions are; `displayHeight` is the per-file
 * optical fit inside it.
 */
export function CaseLogo({ logo, className }: CaseLogoProps) {
  return (
    <div
      className={cn("flex h-16 items-center justify-start", className)}
    >
      <Image
        src={logo.src}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        style={{ height: logo.displayHeight }}
        className={cn(
          "w-auto max-w-full object-contain",
          logo.mono !== false && "[filter:brightness(0)_invert(1)]",
        )}
      />
    </div>
  );
}
