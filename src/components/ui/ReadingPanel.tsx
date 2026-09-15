import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type ReadingPanelProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

/**
 * Where reading happens: the open-composition sibling of `Card`.
 *
 * The two gradients are the cabecera and the cierre and neither goes behind a
 * long block of text; between them the page is the card surface. Every
 * paragraph on this site therefore sits on one of these, floating on the
 * gradient rather than dissolving into it — which is also what stops the
 * ground from having to be dimmed until it is grey just to hold body copy at
 * a legible contrast.
 *
 * ## It is the same ground as a card, and now it says so
 *
 * This used to render `.surface`, a class that declared the same background,
 * border and text colour as `.card` under a different name. Two names for one
 * ground is how `ServicesArchitecture` came to hand-build a violet card by
 * pasting classes together — the two were interchangeable, so nothing flagged
 * that the div was missing the states a real card has. Both components now sit
 * on `.card`, take their accent from the same `--card-accent` knob, and differ
 * in exactly one thing: `Card` fixes its composition and this does not.
 *
 * ## It has no accent prop, and neither has `Card`
 *
 * The 3px rule was opt-in here and mandatory on `Card`, so eight panels stood
 * beside cards that had one and read as a different object. Then the prop
 * chose between a celeste and a violet rule, which inverted the system's own
 * rule about what violet means. Both are gone: the rule belongs to `.card`,
 * it is cyan because this is a light ground, and a panel where Novit is doing
 * the talking says so in its copy — `ServicesStart`'s commitment and
 * `AcademyRegistration`'s channels are already set in `violeta-medio`. See
 * `cards/Card.tsx` for the chapter and verse.
 *
 * `.card-roomy` is the one deliberate difference in the ground itself. A panel
 * holding four paragraphs wants more padding than a card holding a title and
 * three lines, so it takes one step more — replacing the three different
 * paddings that had accumulated across these call sites.
 */
export function ReadingPanel({
  as: Tag = "div",
  className,
  children,
  ...props
}: ReadingPanelProps) {
  return (
    <Tag
      data-tone="light"
      className={cn("card card-roomy", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
