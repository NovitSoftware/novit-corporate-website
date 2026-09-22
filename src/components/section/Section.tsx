import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Every band on the page.
 *
 * A section paints nothing. The scene gradient on `body` is the site's one
 * background and each band sits on it transparently, so the ground reads
 * through continuously instead of being interrupted by panels that imitate
 * it. What used to be here — a per-section variant that resolved to the same
 * white text four times over, and a bar-field texture layered on top of the
 * global one — was doing exactly that.
 */
export function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      /* Marks this as one of the page's top-level bands, for `SectionHandoff`.
         It cannot find them by tag: `<section>` is the right element for a
         self-contained block with its own heading, so panels inside a band use
         it too — the Academia's Requisitos and Evaluación panels are both
         `<section>` — and selecting on the tag faded those on their own
         schedule inside a band that was already fading. */
      data-band
      data-tone="dark"
      className={cn(
        /*
         * This was `py-24 sm:py-32 lg:py-44` — 176px a side on a desktop, so
         * 352px of empty gradient between the end of one band's copy and the
         * start of the next. The reference carries that much air because its
         * bands are full-bleed imagery; here it is 350px of nothing, and
         * scrolling through it is scrolling through nothing. Cut to 96px a
         * side: 192px between bands still separates them clearly, and the
         * boundary is now something you cross rather than travel.
         *
         * The rest of the crossing is `SectionHandoff`, which fades the band
         * you are leaving as the next one arrives.
         */
        "relative scroll-mt-anchor overflow-x-clip py-16 sm:py-20 lg:py-24",
        "text-blanco",
        className,
      )}
    >
      {children}
    </section>
  );
}
