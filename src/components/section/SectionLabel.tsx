import { IconLine, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type SectionLabelProps = {
  /** Section number, e.g. "01". */
  index?: string;
  /** Section name, e.g. "Nosotros". */
  name: string;
  /** The section's mark — the same one its link in the footer carries. */
  icon: IconName;
  className?: string;
};

/**
 * The marker that opens every section, sitting in the left rail beside the
 * statement.
 *
 * It used to be two filled pills stacked on each other, which put five loud
 * celeste blocks down a page whose job is to be read. Now it is what an
 * instrument label should be: a short rule, the number, the name — quiet
 * enough that the statement next to it is the thing you see, and still doing
 * its one job of saying where in the argument you are.
 *
 * The name leads with the section's mark, in celeste like the number: every
 * other title on the site carries one — the cards, the recorrido's groups,
 * the footer's links to these very sections — and a section named without
 * one was the odd one out.
 */
export function SectionLabel({ index, name, icon, className }: SectionLabelProps) {
  return (
    <div className={cn("flex flex-col items-start", className)} data-anim="chip">
      <span
        aria-hidden="true"
        className="mb-4 block h-0.5 w-6 bg-celeste"
      />
      {index ? (
        <span className="eyebrow tabular-nums text-celeste">
          {index}
        </span>
      ) : null}
      <span className="eyebrow mt-1 flex items-start gap-2 leading-5 text-on-eyebrow">
        <IconLine name={icon} size="micro" className="text-celeste" />
        {name}
      </span>
    </div>
  );
}
