import type { CaseStudy } from "@/content/site";
import { Image } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

type CaseLogoProps = {
  logo: CaseStudy["logo"];
  className?: string;
};

/**
 * A client's logo, on its own white plate.
 *
 * The plate is not a frame around the artwork, it is what makes the artwork
 * survive: three of the four files are dark marks on transparency and would
 * sink into the `#F3F6F8` reading surface, the fourth is a JPEG carrying a
 * white background it cannot shed, and one is white artwork that has to be
 * inverted to exist on white at all. Those are per-file facts, so they are
 * per-file data — see `casesContent`.
 *
 * Used in both places a client is named: as the masthead of a `CaseCard` on
 * the home page, and as the credential at the head of a row on
 * `/inteligencia-artificial`.
 */
export function CaseLogo({ logo, className }: CaseLogoProps) {
  return (
    <div
      className={cn(
        "flex h-16 items-center justify-start rounded-card bg-blanco px-4",
        className,
      )}
    >
      <Image
        src={logo.src}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        style={{ height: logo.displayHeight }}
        className={cn(
          "w-auto max-w-full object-contain",
          logo.invertOnLight && "invert",
        )}
      />
    </div>
  );
}
