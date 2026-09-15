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
 * into one unit. On hover and on keyboard focus the arrow block crosses to the
 * other side of the label, the label slides over into the room the block left,
 * and the label's fill wipes in behind it. All of that is `.chip-cta` in
 * globals.css — the markup only supplies the two blocks.
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
 * Two blocks, one parked at each end of the chip, of which only one is ever
 * inside it: the trailing one slides out past the end edge as the leading one
 * arrives from the start edge. They are identical, so which is which is a
 * matter of where `.chip-cta_arrow-lead` and `-trail` park them, in
 * globals.css.
 *
 * An SVG triangle rather than a "▸" — cap. 06 of the design system is explicit
 * that arrows are not a typographic character here.
 */
export function ChipArrow() {
  return (
    <>
      <span className="chip-cta_arrow chip-cta_arrow-lead" aria-hidden="true">
        <ArrowGlyph />
      </span>
      <span className="chip-cta_arrow chip-cta_arrow-trail" aria-hidden="true">
        <ArrowGlyph />
      </span>
    </>
  );
}

function ArrowGlyph() {
  return (
    <span className="chip-cta_glyph">
      <svg viewBox="0 0 10 10" className="size-2.5" focusable="false">
        <path d="M2 1.4 7.4 5 2 8.6Z" fill="currentColor" />
      </svg>
    </span>
  );
}
