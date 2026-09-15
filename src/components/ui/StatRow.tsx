import { CountUp } from "@/components/motion/CountUp";
import { IconLine, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Stat = {
  label: string;
  value: string;
  /** Optional mark beside the label. A figure is already scannable, so this
   *  is for rows where the *kind* of figure is the useful distinction —
   *  hours against classes against modality. */
  icon?: IconName;
};

type StatRowProps = {
  items: ReadonlyArray<Stat>;
  className?: string;
};

/**
 * A row of figures, each under a small tracked label and over a rule that
 * draws itself in. Quantities count up as they arrive; years and non-numeric
 * values are left alone — see CountUp.
 *
 * ## One ground, because that is the only one it ever sits on
 *
 * This carried a `tone` of `dark` | `light` | `voice` with three parallel
 * class maps, and both call sites — `AboutSection` and `AcademyOpener` — take
 * the default. Two thirds of the component was a variant nobody asked for.
 *
 * If a row ever does need the reading surface, the numbers are: celeste falls
 * to 2.3:1 on `gris-superficie` and cannot carry the label there, so a light
 * row would be a cyan rule with azul text, and a violet one violet throughout.
 * Add it then, with a call site.
 */
export function StatRow({ items, className }: StatRowProps) {
  return (
    <dl
      data-anim-batch
      className={cn(
        "grid gap-8 sm:grid-cols-2",
        items.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.label}>
          <span
            data-anim="bar"
            aria-hidden="true"
            className="mb-4 block h-px w-full bg-[linear-gradient(90deg,var(--celeste),transparent)]"
          />
          <div data-anim="rise">
            <dt className="flex items-start gap-2 text-[0.625rem] font-bold uppercase tracking-[0.18em] text-celeste">
              {item.icon ? <IconLine name={item.icon} size="micro" /> : null}
              {item.label}
            </dt>
            <dd className="display-m mt-2 tabular-nums text-blanco">
              <CountUp value={item.value} />
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
