import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A dark slate in a glass frame: the surface the site draws its figures on.
 * `ruled` gives it the board's faint grid, for a drawing that brings no grid
 * of its own.
 */
export function Slate({
  ruled = false,
  className,
  children,
}: {
  ruled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("slate-frame", className)}>
      <div className={cn("slate", ruled && "slate-ruled")}>{children}</div>
    </div>
  );
}
