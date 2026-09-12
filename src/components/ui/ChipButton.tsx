import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { variantClass } from "@/lib/variants";

const chipButtonVariants = {
  /** For dark grounds: celeste body, azul arrow block. */
  light: "chip-cta-light",
  /** For light grounds: azul body, white arrow block. */
  dark: "chip-cta-dark",
} as const;

export type ChipButtonVariant = keyof typeof chipButtonVariants;

type ChipButtonProps = {
  variant?: ChipButtonVariant;
  children: ReactNode;
} & ComponentPropsWithoutRef<"a">;

/**
 * The site's call to action: a label block and a separate arrow block joined
 * into one unit. On hover the label fill wipes in from the left and the arrow
 * travels — out to the right, with its replacement arriving from the left.
 */
export function ChipButton({
  variant = "dark",
  className,
  children,
  ...props
}: ChipButtonProps) {
  return (
    <a
      className={cn(
        "chip-cta",
        variantClass(chipButtonVariants, variant),
        className,
      )}
      {...props}
    >
      <span className="chip-cta_label">
        <span>{children}</span>
      </span>
      <ChipArrow />
    </a>
  );
}

/**
 * The arrow block, shared so the one hand-built `chip-cta` on the page — the
 * contact form's submit, which has to be a `<button>` and cannot use
 * `ChipButton` — cannot drift away from this one.
 *
 * Two glyphs, both inside the block and therefore both in its colour: the
 * first leaves to the right, the second arrives from the left to take its
 * place. The travel and the clipping live in `.chip-cta_arrow` in globals.css.
 */
export function ChipArrow() {
  return (
    <span className="chip-cta_arrow" aria-hidden="true">
      <span className="chip-cta_glyph chip-cta_glyph-out">
        <ArrowGlyph />
      </span>
      <span className="chip-cta_glyph chip-cta_glyph-in">
        <ArrowGlyph />
      </span>
    </span>
  );
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 10 10" className="size-2.5" focusable="false">
      <path d="M2 1.4 7.4 5 2 8.6Z" fill="currentColor" />
    </svg>
  );
}
