import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type BadgeProps = {
  /** Required: the glyph is half of what makes the pill read as a tag. */
  icon: IconName;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"span">, "children">;

/**
 * A fact, tagged: "Desde 2015", an edition, a date, a line of work.
 *
 * One treatment and no `tone` or `variant` prop — there were two (an outline
 * and a tinted fill) and a reader could not tell what the difference meant,
 * because it meant nothing. The look is `.badge` in `styles/badge.css`.
 *
 * Not a control. A badge never links anywhere; what does is `ChipButton`,
 * and the two must not be mistaken for each other.
 */
export function Badge({ icon, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn("badge", className)} {...props}>
      <Icon name={icon} size="micro" className="badge_icon" />
      {children}
    </span>
  );
}
