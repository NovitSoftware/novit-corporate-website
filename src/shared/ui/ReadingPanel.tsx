import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import { cn } from "@/shared/lib/cn";

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
 * ## The same ground as a card
 *
 * It renders `.card`: one glass ground, one ink set, one set of states, shared
 * with `Card`. The two differ in exactly one thing — `Card` fixes its
 * composition and this does not. There is no second surface class to drift
 * from it, and no call site may assemble one by pasting the parts together.
 *
 * Anything set inside a panel therefore takes its colour from the card's inks
 * (`.card-ink*`), never from a light-ground token. A panel where Novit is doing
 * the talking says so with `.card-ink-voice`.
 *
 * `.card-roomy` is the one deliberate difference in the ground: a panel holding
 * four paragraphs takes one padding step more than a card holding a title and
 * three lines.
 */
export function ReadingPanel({
  as: Tag = "div",
  className,
  children,
  ...props
}: ReadingPanelProps) {
  return (
    <Tag className={cn("card card-roomy", className)} {...props}>
      {children}
    </Tag>
  );
}
