import { CountUp } from "@/components/motion/CountUp";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { variantClass } from "@/lib/variants";

type Stat = {
  label: string;
  value: string;
  /** Optional mark beside the label. A figure is already scannable, so this
   *  is for rows where the *kind* of figure is the useful distinction —
   *  hours against classes against modality. */
  icon?: IconName;
};

/**
 * Three grounds, because the accent that works on one fails on the next:
 * celeste over the gradient, cyan on the reading surface — celeste falls to
 * 2.3:1 there — and violet where the figures are Novit's own.
 */
const ruleTone = {
  dark: "bg-[linear-gradient(90deg,var(--celeste),transparent)]",
  light: "bg-[linear-gradient(90deg,var(--cyan),transparent)]",
  voice: "bg-[linear-gradient(90deg,var(--violeta),transparent)]",
} as const;

const labelTone = {
  dark: "text-celeste",
  light: "text-azul",
  voice: "text-violeta-medio",
} as const;

const valueTone = {
  dark: "text-blanco",
  light: "text-azul",
  voice: "text-violeta-medio",
} as const;

export type StatTone = keyof typeof ruleTone;

type StatRowProps = {
  items: ReadonlyArray<Stat>;
  tone?: StatTone;
  className?: string;
};

/**
 * A row of figures, each under a small tracked label and over a rule that
 * draws itself in. Quantities count up as they arrive; years and non-numeric
 * values are left alone — see CountUp.
 */
export function StatRow({ items, tone = "dark", className }: StatRowProps) {
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
            className={cn(
              "mb-4 block h-px w-full",
              variantClass(ruleTone, tone),
            )}
          />
          <div data-anim="rise">
            <dt
              className={cn(
                "flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.18em]",
                variantClass(labelTone, tone),
              )}
            >
              {item.icon ? (
                <Icon name={item.icon} className="size-3.5" />
              ) : null}
              {item.label}
            </dt>
            <dd
              className={cn(
                "display-m mt-2 tabular-nums",
                variantClass(valueTone, tone),
              )}
            >
              <CountUp value={item.value} />
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
