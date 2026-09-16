import { cn } from "@/shared/lib/cn";

type SectionLabelProps = {
  /** Section number, e.g. "01". */
  index?: string;
  /** Section name, e.g. "Nosotros". */
  name: string;
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
 */
export function SectionLabel({ index, name, className }: SectionLabelProps) {
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
      <span className="eyebrow mt-1 leading-5 text-on-eyebrow">
        {name}
      </span>
    </div>
  );
}
