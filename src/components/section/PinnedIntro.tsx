import type { ReactNode } from "react";
import { SectionIntro } from "@/components/section/SectionIntro";
import { cn } from "@/lib/cn";

type PinnedIntroProps = {
  index?: string;
  eyebrow: string;
  title: string;
  /** The reading that belongs with the statement, inside the pinned column. */
  children?: ReactNode;
  /** The column that travels past it. */
  beside: ReactNode;
  className?: string;
};

/**
 * A statement that holds still while its evidence moves past it.
 *
 * Two things make this work and both are easy to lose in a copy: the pinned
 * column is `sticky` from `lg` only — below that it is the full width and has
 * nothing to sit beside — and the grid is `items-start`, because a stretched
 * grid item fills its row and a stretched item has no slack to stick within.
 * That second one is the bug this component exists to stop repeating; it is
 * invisible when wrong, the column simply never pins.
 *
 * One shape, not a set of ratios. The two bands that had this before were
 * within 25px of each other (`0.95/1.05` and `0.9/1.1` on a 1168px grid),
 * which is a difference nobody chose. `SafetySection` keeps its own grid: it
 * runs a wider gutter around a pull-quote built for it, and bending this to
 * fit would be the abstraction arguing with the content.
 */
export function PinnedIntro({
  index,
  eyebrow,
  title,
  children,
  beside,
  className,
}: PinnedIntroProps) {
  return (
    <div
      className={cn(
        "grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-16",
        className,
      )}
    >
      <div className="lg:sticky lg:top-[calc(var(--header-height)+4rem)]">
        <SectionIntro
          index={index}
          eyebrow={eyebrow}
          title={title}
          layout="stacked"
        >
          {children}
        </SectionIntro>
      </div>

      {beside}
    </div>
  );
}
