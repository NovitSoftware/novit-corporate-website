import { Card, CardText, cardInk } from "@/components/cards/Card";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/ui/Section";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { servicesPageContent } from "@/content/site";
import { cn } from "@/lib/cn";
import { variantClass } from "@/lib/variants";

/**
 * The offer: three service lines, and the method under them.
 *
 * ## What this band used to be
 *
 * Six "capacidades" as peers, three of which Novit does not sell: QA, UX/UI
 * and a "Data science" line that appears in no source document. Cap. 08 of
 * brand-core closed that question — UX and QA are method, not service lines,
 * and are explicitly not promoted — so the page was arguing against its own
 * positioning two bands after making it. See `servicesPageContent.capabilities`
 * for the full note.
 *
 * The shape follows the tree in that chapter rather than a grid of equal
 * cards, because the tree is the argument: three branches, then a rule, then
 * the things that come with all of them. The AI line is the featured one —
 * full width, violet, Novit's own voice — and it is first because it is the
 * line the market asks about.
 *
 * Each line lists what is inside it. That is the part the old six cards could
 * not carry: "Software a medida" as a card with a paragraph says less than the
 * same card saying discovery, development and support.
 */
export function ServicesCapabilities() {
  const { capabilities } = servicesPageContent;
  const [featured, ...rest] = capabilities.lines;

  return (
    <Section id={capabilities.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={capabilities.eyebrow}
            title={capabilities.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {capabilities.lead}
              </p>
            }
            below={
              <div className="space-y-4">
                <div data-anim-batch className="space-y-4">
                  <div data-anim="card">
                    <OfferLine line={featured} featured />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {rest.map((line) => (
                      <div key={line.id} data-anim="card">
                        <OfferLine line={line} />
                      </div>
                    ))}
                  </div>
                </div>

                <MethodBlock />
              </div>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}

type OfferLineProps = {
  line: (typeof servicesPageContent.capabilities.lines)[number];
  featured?: boolean;
};

/**
 * One branch of the tree.
 *
 * The featured branch runs its description against its own list in two
 * columns, because at the full width of the grid a single measure leaves half
 * the card empty; the other two stack. That split is in the *body* rather than
 * across the whole card, so the head — mark, eyebrow, title — reads the same
 * here as on every other card on the site. It used to split above the title
 * too, which is what made this one card look like it came from somewhere else.
 *
 * No picture in here, and it was tried. These are wide, short cards, so an
 * illustration in either column makes that column twice the height of the one
 * beside it and opens a 300px hole where the hole it was meant to fill used to
 * be. The badge is the image this card wants.
 */
function OfferLine({ line, featured = false }: OfferLineProps) {
  const accent = featured ? "voice" : "celeste";

  const items = (
    <ul className="space-y-2.5">
      {line.items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-texto"
        >
          <Icon
            name="check"
            /* The card's own ink, not the accent: a 16px glyph is a
               graphical object and cyan is 2.9:1 here, just under the 3:1 it
               needs. Same reason the badge draws its icon in azul. */
            className={cn("mt-1 size-4 shrink-0", variantClass(cardInk, accent))}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <Card
      icon={line.icon}
      label={line.meta}
      title={line.title}
      accent={accent}
      size={featured ? "xl" : "lg"}
      className={featured ? "sm:p-10" : undefined}
    >
      {featured ? (
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
          <CardText>{line.description}</CardText>
          {items}
        </div>
      ) : (
        <>
          <CardText>{line.description}</CardText>
          <div className="mt-5">{items}</div>
        </>
      )}
    </Card>
  );
}

/**
 * The row below the rule in cap. 08's diagram: what comes with every line
 * rather than what can be bought on its own.
 *
 * Deliberately not cards. Four more cards under three cards would read as
 * seven peers, which is the exact mistake this band is fixing — these are a
 * footnote to the three above them, so they are a plain four-up list on the
 * ground with the heading saying what they are.
 */
function MethodBlock() {
  const { method } = servicesPageContent.capabilities;

  return (
    <div data-anim-block className="pt-8">
      <div data-anim="bar" aria-hidden="true" className="hairline w-full" />
      <div className="mt-7 grid gap-x-10 gap-y-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
        <div>
          <h3
            data-anim="rise"
            className="text-lg font-bold leading-snug text-blanco sm:text-xl"
          >
            {method.title}
          </h3>
          <p
            data-anim="rise"
            className="mt-2 max-w-[42ch] text-[0.9375rem] leading-relaxed text-on-detail"
          >
            {method.lead}
          </p>
        </div>
        <ul data-anim="rise" className="grid gap-5 sm:grid-cols-2">
          {method.items.map((item) => (
            <li key={item.title}>
              <div className="flex items-center gap-2.5">
                <Icon name={item.icon} className="size-4 text-celeste" />
                <span className="text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-celeste">
                  {item.title}
                </span>
              </div>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-on-detail">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
