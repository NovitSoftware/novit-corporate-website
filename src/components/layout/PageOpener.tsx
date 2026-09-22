import type { ReactNode } from "react";
import { ChipButton } from "@/shared/ui/ChipButton";
import { Container } from "@/shared/ui/Container";
import { Scene } from "@/shared/motion/Scene";
import { SectionLabel } from "@/shared/ui/SectionLabel";
import { SplitWords } from "@/shared/motion/SplitWords";

type PageOpenerProps = {
  eyebrow: string;
  title: string;
  lead: string;
  /** The way in. Off-site hrefs — the WhatsApp line — open in a new tab. */
  cta: { label: string; href: string };
  /** Anything the page wants under the button. */
  children?: ReactNode;
};

/**
 * How every route that is not the home page opens: the label, the claim, the
 * lead, and the one door.
 *
 * Not `HeroScene` and not `Section`. `HeroScene`'s timeline waits on the intro
 * curtain's completion signal, which only the home page sends, so a hero built
 * on it here would sit at opacity 0 for good; `Section` carries the standard
 * vertical rhythm, where an opener has to clear the fixed header instead.
 *
 * It was written out once per route — three times, with the padding scale and
 * the measures drifting a little on each. One shape, so a change to the way
 * the site opens is a change in one place.
 */
export function PageOpener({
  eyebrow,
  title,
  lead,
  cta,
  children,
}: PageOpenerProps) {
  const external = cta.href.startsWith("http");

  return (
    <section
      /* The page's first band, so `SectionHandoff` gives it the later exit
         window every opener gets. */
      data-band
      data-tone="dark"
      className="relative scroll-mt-anchor overflow-x-clip pb-16 pt-[calc(var(--header-height)+3.5rem)] text-blanco sm:pb-20 lg:pt-[calc(var(--header-height)+5rem)]"
    >
      <Scene className="relative">
        <Container>
          <div data-anim-block className="max-w-[54rem]">
            <SectionLabel name={eyebrow} />
            <h1
              data-anim="words"
              className="display-hero mt-7 max-w-[22ch] text-blanco"
            >
              <SplitWords text={title} />
            </h1>
            <p
              data-anim="rise"
              className="mt-7 max-w-[58ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
            >
              {lead}
            </p>
            <div data-anim="rise" className="mt-9">
              <ChipButton
                href={cta.href}
                variant="light"
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                {cta.label}
              </ChipButton>
            </div>
            {children}
          </div>
        </Container>
      </Scene>
    </section>
  );
}
