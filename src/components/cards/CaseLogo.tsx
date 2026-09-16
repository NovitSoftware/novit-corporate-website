import type { ClientLogo } from "@/content/site";
import { Image } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

type CaseLogoProps = {
  logo: ClientLogo;
  className?: string;
};

/**
 * A client's logo, on the ground that file needs.
 *
 * The plate is not a frame around the artwork, it is what makes the artwork
 * survive, and which one a file needs is a per-file fact — see `plate` on
 * `ClientLogo`. The white plate is the default because the two cases on the
 * home page are dark marks on transparency; on the recorrido wall of
 * `/casos-de-exito` most of what the client publishes is white artwork, which
 * needs the page's own dark ground and nothing else.
 *
 * The box is the same either way: one height for every mark in a row, so the
 * card heads line up whatever the artwork's proportions are.
 *
 * Used everywhere a client is named: as the masthead of a `CaseCard` on the
 * home page, as the credential at the head of a row on
 * `/inteligencia-artificial`, and on every card of the recorrido.
 */
export function CaseLogo({ logo, className }: CaseLogoProps) {
  const bare = logo.plate === "none";

  return (
    <div
      className={cn(
        "flex h-16 items-center justify-start rounded-card",
        bare ? "" : "bg-blanco px-4",
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
