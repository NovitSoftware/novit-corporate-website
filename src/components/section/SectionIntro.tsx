import type { ReactNode } from "react";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { SectionLabel } from "@/components/section/SectionLabel";
import { cn } from "@/lib/cn";

type SectionIntroProps = {
  index?: string;
  eyebrow: string;
  /** The large statement, brought up word by word as the section passes. */
  title: string;
  /**
   * `rail` hangs the label in a column of its own beside the statement.
   * `stacked` sets it above, for an opener sharing a band with something else
   * — there is no rail to hang it in.
   */
  layout?: "rail" | "stacked";
  /**
   * Anything that belongs under the statement — normally the reading panel.
   * It goes in the same grid, so it lines up with the statement structurally
   * rather than by a matched margin that has to be kept in step by hand.
   */
  children?: ReactNode;
  /**
   * The reading, set *beside* the statement instead of under it.
   *
   * For bands whose content is short: a statement capped at `24ch` over a
   * `1168px` column left a dead rectangle the width of half the page and the
   * height of the whole opener — 624×250px on Casos, 460×390px on Equipo —
   * while the card grid below proved the measure was there to be used. Moving
   * the reading up into a column of its own uses the measure end to end and
   * takes about 90px of vertical slack out at the same time.
   *
   * Dense bands (Academia, Nosotros, Servicios) keep using `children`: their
   * openers already fill the measure, and splitting them would break a
   * composition that works.
   */
  aside?: ReactNode;
  /**
   * The rest of the band — the card grid, the lists, whatever follows the
   * opener.
   *
   * Passing it through here rather than as a sibling of `SectionIntro` is what
   * makes the pinned rail possible. A sticky element can only travel inside its
   * own parent box, so while the rail grid was just the opener the label had
   * about 250px of run and released a third of the way down the band. With the
   * band's content inside the same grid, the label's parent is the full band
   * and the label stays put until the band ends.
   *
   * Safe for the reveal choreography: `Scene` buckets a tagged element under
   * `closest("[data-anim-block], [data-anim-batch]")`, so a grid arriving here
   * with its own `data-anim-batch` still gets batched rather than being
   * absorbed into this component's block.
   */
  below?: ReactNode;
  className?: string;
};

/**
 * How every section opens: the label in the left rail, the statement in the
 * wide column, and the reading under it or beside it in that same column.
 *
 * The alignment used to be a pair of magic numbers — `indent-[9.5rem]` on the
 * statement and a matching `ml-[9.5rem]` on the paragraph, repeated across
 * four sections and eyeballed against the width of the old label pills. Any
 * change to the label broke every section quietly. The rail is a grid column
 * now, so the two can't drift apart.
 *
 * Two columns at the top level, always — rail and everything else — with the
 * statement/reading split handled by a nested grid. The flat three-column
 * version of this needed explicit row numbers for each slot, and an absent
 * slot left an empty grid row whose gaps still counted, so the vertical rhythm
 * changed depending on which props a caller happened to pass.
 */
export function SectionIntro({
  index,
  eyebrow,
  title,
  layout = "rail",
  children,
  aside,
  below,
  className,
}: SectionIntroProps) {
  const rail = layout === "rail";
  const hasAside = Boolean(aside);

  return (
    <div
      data-anim-block
      className={cn(
        "grid gap-x-10 gap-y-9",
        rail && "lg:grid-cols-[10rem_minmax(0,1fr)] lg:items-start",
        className,
      )}
    >
      <SectionLabel
        index={index}
        name={eyebrow}
        className={cn(
          /* The label is a running head, not a stamp: it says where in the
             argument you are, so it stays on screen for the argument it names.
             `self-start` is what gives it somewhere to travel — a grid item
             stretches to its row by default, and a stretched item has no slack
             to stick within. Only from `lg`, where the rail exists at all. */
          rail &&
            "lg:sticky lg:top-[calc(var(--header-height)+2.5rem)] lg:self-start",
        )}
      />

      <div className="grid min-w-0 gap-y-9">
        <div
          className={cn(
            "grid gap-x-10 gap-y-9",
            hasAside &&
              "lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-start",
          )}
        >
          <ScrollWords
            as="h2"
            text={title}
            className="display-xl max-w-[24ch] text-blanco"
          />
          {aside ? (
            /* Nudged down to sit on the statement's first baseline rather than
               its box top: display type carries far more leading than body
               copy, so aligning the boxes leaves the two first lines visibly
               out of step. */
            <div className="lg:pt-3">{aside}</div>
          ) : null}
        </div>

        {children ? <div>{children}</div> : null}

        {/* 36px of row gap plus this padding reproduces the `mt-16 lg:mt-20`
            the bands used to carry themselves, so moving content in here does
            not change the rhythm. */}
        {below ? <div className="pt-7 lg:pt-11">{below}</div> : null}
      </div>
    </div>
  );
}
