import type { CSSProperties, ReactNode } from "react";
import type { IconName } from "@/components/ui/Icon";
import { IconBadge } from "@/components/ui/IconBadge";
import { cn } from "@/lib/cn";
import { variantClass } from "@/lib/variants";

/**
 * The three steps the heading comes in. The sizes themselves are fluid and
 * live in `.card-title*` in `globals.css`, beside the display scale they
 * belong to — there is no `sm:` pair here any more because there is no
 * breakpoint in them any more.
 */
const titleSize = {
  base: "",
  lg: "card-title-lg",
  xl: "card-title-xl",
} as const;

type CardProps = {
  /** The heading. The point of the card, never the category it belongs to. */
  title: string;
  /**
   * The small uppercase eyebrow beside the mark: the area, the step number,
   * the category. It files the card; the title is what the card says.
   */
  label?: string;
  /** The mark. Optional, but every card in a given grid should agree. */
  icon?: IconName;
  /**
   * A picture at the very top, above everything: a client's logo, an
   * illustration. Whatever it is, it is a credential or an image — never the
   * card's argument.
   */
  media?: ReactNode;
  size?: keyof typeof titleSize;
  /**
   * Novit's read on what the card just said, pinned to its foot behind a
   * rule — the result, what stays installed, what it costs. Violet, because
   * that is the one thing the colour means in this system.
   *
   * `ruleWidth` narrows that rule and `minLines` reserves vertical room for
   * the takeaway — both exist for the one band where the rules are themselves
   * the argument and have to line up across the row (`ServicesEvolution`).
   *
   * `ruleWidth` is a length, not a class: it used to take a Tailwind width
   * utility, which let a caller hand the card any class it liked through a
   * gap the card had opened in its own styling.
   */
  footer?: {
    label?: string;
    text: string;
    ruleWidth?: string;
    minLines?: 2;
  };
  className?: string;
  /** The body: a paragraph, a list, whatever this card is made of. */
  children?: ReactNode;
};

/**
 * Every card on the site, and there is only one of it.
 *
 * ## It is the AI Radar's *ficha*, not the IA deck's tile
 *
 * This went through two wrong versions, both because it was copied from the
 * wrong document. `docs/novit/novit-design-system.md` cap. 07 lists the
 * *Presentación IA 2026* — the six-slide deck in `docs/novit/source/` — as
 * "generada con IA, sin criterio de marca aplicado · rehacer con el sistema",
 * and cap. 00 says the reference piece is the **AI & Tech Radar**: "cuando
 * este documento y el radar no coincidan, gana el radar". The deck's celeste
 * top rule and its two card flavours were being treated as the authority. They
 * are not the authority; they are the thing the system says to redo.
 *
 * The radar's ficha, from cap. 01, is one shape with four jobs of colour:
 *
 *     ━━━━━━━━━━━━━━  cyan #3398DC — the accent for a light ground
 *     [▣]  CATEGORÍA  cyan: "etiquetas, categorías, líneas"
 *     Título          azul #0A0089 — the world, the fact, what happened
 *     ──────────────  gris-borde, closing the identity zone
 *     Cuerpo…         texto #333333
 *     ──────────────  the footer rule
 *     RESULTADO       violeta #510371 — Novit speaking
 *     La lectura
 *
 * With no label the mark moves onto the title's line rather than standing on
 * one of its own.
 *
 * ## Why there are no card variants any more
 *
 * There were two — celeste and "voice" — and the voice one turned the whole
 * card violet. That reads the system backwards. Cap. 01: *"el azul es el
 * mundo — la noticia, el dato, lo que pasó — y el violeta es Novit hablando.
 * Por eso el comentario de cada ficha va en #510371… el color dice de quién es
 * la voz."* Violet marks **the comment inside the card**, not the card. A
 * whole violet card says the fact itself belongs to Novit, which is not what
 * any of these cards are claiming, and it is why a page of them read as cards
 * from four different sites — reported three times over.
 *
 * So: one card, one ground, one rule, and the voice is carried by the footer.
 * A card that needs to look different needs different words, not a different
 * colour.
 *
 * ## Cyan and celeste are not interchangeable
 *
 * The rule is cyan `#3398DC`, not celeste. Cap. 01 assigns celeste to "fondo
 * oscuro o de color" and cyan to "fondo claro. Etiquetas, categorías, líneas",
 * and measures why: on the card grey celeste falls to 2,3:1 and cyan holds
 * 2,9:1. The card is a light ground, so it takes cyan; the one card-like thing
 * on the gradient — the hero's Academia strip — takes celeste. Same device,
 * each in the colour its ground calls for.
 *
 * The cyan label is the one place this site sets type below AA on purpose, and
 * the system asks for it explicitly: cyan goes in *"etiquetas y categorías,
 * nunca en información que no esté repetida en otro lado: en el radar la
 * categoría acompaña al titular, que es quien carga el significado."* That is
 * exactly this pair — `label` files the card, `title` carries it — so the
 * category may be cyan. Anything that is not repeated by the title beside it
 * may not.
 *
 * ## What a caller may still change
 *
 * The title size and the body. Nothing else, on purpose: padding, the
 * eyebrow's position, the colours and the rule weights are decisions made
 * once. `className` is for the grid — span, the occasional two-column body —
 * not for restyling the card.
 */
export function Card({
  title,
  label,
  icon,
  media,
  size = "lg",
  footer,
  className,
  children,
}: CardProps) {
  /* A boolean, not the value: `media` is a ReactNode, and testing it inline
     renders whatever falsy thing the node happened to be — `0` for an empty
     list, which would print a zero into the card. */
  const hasMedia = Boolean(media);
  /* Seven cards pass an icon and no label. The plate used to take a line of
     its own anyway, which left a 40px object alone in open space with the
     title under it. With no eyebrow to stand against, the mark belongs on the
     title's line. */
  const markBesideTitle = icon !== undefined && label === undefined;

  return (
    <article data-tone="light" className={cn("card h-full", className)}>
      {/* Identity: what this card is. The zone carries its own rhythm — see
          `.card-zone` — so there are no margins to set from here. */}
      <div className="card-zone">
        {hasMedia ? <div className="card-media">{media}</div> : null}

        {label ? (
          <div className="flex items-center gap-3">
            {icon ? <IconBadge name={icon} /> : null}
            <span className="eyebrow text-cyan">{label}</span>
          </div>
        ) : null}

        <h3
          className={cn(
            "card-title flex items-start gap-3 text-azul",
            variantClass(titleSize, size),
          )}
        >
          {/* Centred on the title's *first line*, not on the block: with
              `items-center` a 40px plate beside a three-line title floats at
              the middle of the paragraph, which put the mark at a different
              height on every card in a row of uneven titles. One line-box is
              the same measure `IconLine` centres a glyph in.

              Inside the heading and not in a row beside it, which is what
              makes `1lh` the *title's* line and not the card's: `lh` resolves
              against the element's own leading, and a wrapper outside the
              heading inherits the card's 16px body leading instead, which
              left the plate two pixels high. Same structure `PanelRow` uses
              for its own mark. */}
          {markBesideTitle ? (
            <span className="flex h-[1lh] shrink-0 items-center">
              <IconBadge name={icon} />
            </span>
          ) : null}
          <span>{title}</span>
        </h3>
      </div>

      {/* Argument: what it says, and what Novit makes of it. */}
      <div className="card-body">
        {children}

        {footer ? (
          <div
            className="card-foot"
            style={
              footer.ruleWidth
                ? ({ "--card-foot-rule": footer.ruleWidth } as CSSProperties)
                : undefined
            }
          >
            {footer.label ? (
              <span className="eyebrow block text-violeta-medio">
                {footer.label}
              </span>
            ) : null}
            <p
              className={cn(
                "text-base font-bold leading-snug text-violeta-medio",
                footer.label && "mt-1.5",
                /* The footer pins itself to the foot of the card, so in a row
                   of equal-height cards a one-line takeaway beside a two-line
                   one puts their rules at different heights. Where every
                   takeaway in the row runs to one line that never happens and
                   reserving space would only add dead air, so this is opt-in —
                   `ServicesEvolution` asks for it because its four rules of
                   growing width *are* the argument and must line up. `lh`
                   rather than a pixel guess, so it survives a change of size
                   or leading. */
                footer.minLines === 2 && "min-h-[2lh]",
              )}
            >
              {footer.text}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/**
 * Body copy on the reading surface: 15px at `leading-relaxed` in `texto`
 * `#333333`, which cap. 01 measures at 11,6:1 on the card grey and prefers to
 * pure black on screen.
 *
 * Exported as a string because two components set it on two different
 * elements — a paragraph here, a list row's text in `CardList` — and a list
 * item whose text is a `<p>` inside a `<span>` inside an `<li>` is three
 * elements to place one type size. Same reasoning as `panelRowRule`.
 */
export const cardCopy = "text-[0.9375rem] leading-relaxed text-texto";

/**
 * The body most cards have: one paragraph, at the size and leading the card
 * grid is built around.
 *
 * Six bands were writing the same three utility classes, and two of them had
 * drifted — `leading-7` against `leading-relaxed`, which is a 1px difference
 * nobody chose and nobody can unsee once the cards are side by side.
 */
export function CardText({ children }: { children: ReactNode }) {
  return <p className={cardCopy}>{children}</p>;
}
