import type { ClientLogo } from "@/content/cases";
import { Image } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

type CaseLogoProps = {
  logo: ClientLogo;
  className?: string;
};

/**
 * A client's mark, straight on the page's own ground.
 *
 * No plate: every file is white ink on transparency, or carries its own colour
 * block, so it reads on the gradient unaided — and a white rectangle behind a
 * mark on this ground reads as a sticker stuck to the page.
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
        className="w-auto max-w-full object-contain"
      />
    </div>
  );
}
