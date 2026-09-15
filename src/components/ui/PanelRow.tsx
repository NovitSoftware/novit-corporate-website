import type { ReactNode } from "react";
import { IconLine, type IconName } from "@/components/ui/Icon";

type PanelRowProps = {
  /** The mark. Optional, but every row in a given list should agree. */
  icon?: IconName;
  /**
   * A step number, for a list that genuinely is a sequence — the course blocks
   * in order, the four stages of an evolution. Not for a list of peers, where
   * numbering invents a progression the content does not have.
   */
  index?: string;
  title: ReactNode;
  /**
   * The half of the heading that carries the judgement, set in violet after
   * the azul half. `ServicesRisk` is built on this: "Datos sensibles" is the
   * fact and "fuera de control" is Novit's reading of it, and the colour is
   * what says which is which.
   */
  titleAside?: string;
  children?: ReactNode;
};

/**
 * One row of a list inside a `ReadingPanel`: a mark, a heading, a paragraph.
 *
 * ## Why this exists
 *
 * Six bands rendered this shape and no two of them agreed. The headings ran at
 * two sizes, the bodies at two leadings (`leading-7` against
 * `leading-relaxed`, the same 1px drift `CardText` was written to kill), the
 * marks at four sizes in three alignments, and the gaps at four values. Four
 * of the six were already within a hairsbreadth of each other — near-duplicate
 * code that had never been extracted, so each one drifted on its own.
 *
 * The row owns its *typography*. The list around it owns its own layout: the
 * element, the grid, and whether rows are divided by a rule, because that is
 * where the six genuinely differ and forcing those into one component would
 * mean five flags. `ServicesRisk` puts a violet gradient above each row in a
 * three-column grid; `AcademySchedule` divides a single column with hairlines.
 * Both are right, and both use this for the part inside.
 *
 * ## Azul heading and mark, violet judgement
 *
 * Two jobs, the same two the card gives those colours, at the scale of one
 * line — from `novit-design-system.md` cap. 01:
 *
 * - the heading is the world — the fact, the name of the thing — so azul
 *   `#0A0089`, 14,1:1 on this surface. The mark and the step number label
 *   that same fact, so they take its ink;
 * - `titleAside` is Novit's read on the fact, so `violeta-medio` `#510371` at
 *   12,1:1 — "el violeta es Novit hablando", and nowhere else.
 *
 * Neither accent appears on the three. The mark was violet, which put Novit's
 * voice on a bullet; it was then cyan, on the argument that cap. 01 assigns
 * cyan to "etiquetas, categorías, líneas" on light grounds. That reads the
 * licence too widely in two ways: the chapter measures cyan at 2,9:1 here and
 * grants it only where the information is repeated elsewhere, which a step
 * number is not, and a glyph is a graphical object needing 3:1 rather than a
 * label. It also left the site with two icon inks, since `IconBadge` draws in
 * azul on a cyan plate. Cyan keeps the two jobs it can hold at this contrast:
 * the card's category eyebrow, which the chapter names outright, and rules.
 */
export function PanelRow({
  icon,
  index,
  title,
  titleAside,
  children,
}: PanelRowProps) {
  return (
    <>
      <h3 className="flex items-start gap-2.5 text-[1.0625rem] font-bold leading-snug text-azul">
        {index ? (
          <span className="flex h-[1lh] shrink-0 items-center tabular-nums tracking-[0.12em]">
            {index}
          </span>
        ) : null}
        {icon ? <IconLine name={icon} /> : null}
        <span>
          {title}
          {titleAside ? (
            <>
              {" "}
              <span className="text-violeta-medio">{titleAside}</span>
            </>
          ) : null}
        </span>
      </h3>
      {children ? <div className="mt-2">{children}</div> : null}
    </>
  );
}

/**
 * The hairline that divides one row from the next, as a class rather than an
 * element — it goes on the `<li>` so the first row does not get one.
 *
 * `gris-borde-suave` and not `gris-borde`: this separates two rows *inside* a
 * panel, and a rule at the same weight as the panel's own edge reads as the
 * start of another panel. Same reasoning as the card's head separator.
 */
export const panelRowRule =
  "border-t border-t-gris-borde-suave pt-5 first:border-t-0 first:pt-0";
