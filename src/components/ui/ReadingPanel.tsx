import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type ReadingPanelProps = {
  as?: ElementType;
  /** Marks the panel as Novit's own voice: a violet rule across the top. */
  voice?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

/**
 * Where reading happens.
 *
 * The two gradients are the cabecera and the cierre and neither goes behind a
 * long block of text; between them the page is the card surface. Every
 * paragraph on this site therefore sits on one of these, floating on the
 * gradient rather than dissolving into it — which is also what stops the
 * ground from having to be dimmed until it is grey just to hold body copy at
 * a legible contrast.
 *
 * `voice` adds the violet top rule. In this system the colour says whose
 * voice is speaking: azul is the world — the market, the fact, what happened
 * — and violet is Novit. So it goes on the panels where Novit speaks for
 * itself, and nowhere else.
 */
export function ReadingPanel({
  as: Tag = "div",
  voice = false,
  className,
  children,
  ...props
}: ReadingPanelProps) {
  return (
    <Tag
      data-tone="light"
      className={cn(
        "surface rounded-card p-6 sm:p-8",
        // The ramp's middle, not its end: `#85067B` at 3px on this surface
        // reads pink, which is the colour that just left the system.
        voice && "border-t-[3px] border-t-violeta-medio",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
