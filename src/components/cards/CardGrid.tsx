import type { ElementType, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { variantClass } from "@/shared/lib/variants";

/**
 * How many cards stand side by side at full width. Everything narrower steps
 * down to one column; the intermediate step exists only where three or four
 * across would otherwise drop straight to one.
 */
const columnsClass = {
  1: "",
  2: "sm:grid-cols-2",
  3: "md:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

type CardGridProps = {
  /** `ul` for a set of peers, `ol` where the order is the argument. */
  as?: Extract<ElementType, "ul" | "ol" | "div">;
  columns?: keyof typeof columnsClass;
  className?: string;
  children: ReactNode;
};

/**
 * The grid every set of cards stands in.
 *
 * ## Why this is a component and not seven class strings
 *
 * It was seven class strings. Six said `gap-4` and one said
 * `gap-4 lg:gap-5`; the three-across grids disagreed about whether the step
 * up happened at `md` or `lg`; and each one repeated `data-anim-batch`. None
 * of that is a decision anybody made — it is what happens when the same
 * layout is written out seven times.
 *
 * The real work is in `.card-grid` in `globals.css`: it gives every card in a
 * row one shared row structure, so the head separators line up across the row
 * whatever length the titles run to. That only works if the grid, the
 * animation wrapper and the card are all in the same chain, which is a
 * contract better held by one component than by a convention.
 *
 * So the children are still the caller's: one wrapper element per card,
 * carrying `data-anim="card"`, with a `Card` inside it. That wrapper is the
 * middle link in the chain and cannot be skipped.
 */
export function CardGrid({
  as: Tag = "ul",
  columns = 1,
  className,
  children,
}: CardGridProps) {
  return (
    <Tag
      data-anim-batch
      className={cn("card-grid", variantClass(columnsClass, columns), className)}
    >
      {children}
    </Tag>
  );
}
