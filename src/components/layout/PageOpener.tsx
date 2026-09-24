import type { ReactNode } from "react";
import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { Scene } from "@/components/motion/Scene";
import { SectionLabel } from "@/components/section/SectionLabel";
import { SplitWords } from "@/components/motion/SplitWords";
import { cn } from "@/lib/cn";

type PageOpenerProps = {
  eyebrow: string;
  title: string;
  lead: string;
  /** The way in. Off-site hrefs — the WhatsApp line — open in a new tab. */
  cta: { label: string; href: string };
  /** Anything the page wants under the button. */
  children?: ReactNode;
  /** Art beside the copy from `xl`, bled to the window edge like the home hero's map. */
  aside?: ReactNode;
  /**
   * A figure that is read, not glanced at, laid out as the Academia's board
   * is: the wider of the two columns from `xl`, with the headline stepped down
   * to fit its own and the copy held beside it as it scrolls; under the copy
   * at full width from `md`; left out on a phone, where its labels would be
   * too small to read.
   */
  figure?: ReactNode;
};

/**
 * How every route that is not the home page opens: the label, the claim, the
 * lead, and the one door.
 *
 * Not `HeroScene` and not `Section`. `HeroScene` is choreographed for the home
 * hero's own parts — badge, pillars, map — which no other opener has;
 * `Section` carries the standard vertical rhythm, where an opener has to clear
 * the fixed header instead.
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
  aside,
  figure,
}: PageOpenerProps) {
  const external = cta.href.startsWith("http");
  const layout = figure
    ? "xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] xl:items-start xl:gap-12"
    : aside
      ? "xl:grid xl:grid-cols-[minmax(0,54rem)_minmax(0,1fr)] xl:items-center xl:gap-8"
      : undefined;

  return (
    <section
      /* The page's first band, so `SectionHandoff` gives it the later exit
         window every opener gets. */
      data-band
      data-tone="dark"
      className="relative scroll-mt-anchor overflow-x-clip pb-16 pt-[calc(var(--header-height)+3.5rem)] text-blanco sm:pb-20 lg:pt-[calc(var(--header-height)+5rem)]"
    >
      <Scene className="relative">
        <Container className={layout}>
          {/* Beside a figure the copy starts level with its top and stays in
              view while the taller figure scrolls past. */}
          <div
            data-anim-block
            className={
              figure
                ? "xl:sticky xl:top-[calc(var(--header-height)+2.5rem)] xl:self-start"
                : "max-w-[54rem]"
            }
          >
            <SectionLabel name={eyebrow} />
            <h1
              data-anim="words"
              className={cn(
                "display-hero mt-7 text-blanco",
                figure
                  ? "max-w-[20ch] text-balance xl:text-[clamp(3.25rem,4.6vw,4.5rem)]"
                  : "max-w-[22ch]",
              )}
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
          {aside && (
            <div className="hidden xl:-mr-[max(2.25rem,calc((100vw_-_1440px)/2_+_2.25rem))] xl:block">
              <div data-anim="fade">{aside}</div>
            </div>
          )}
          {figure && <div className="mt-14 hidden md:block xl:mt-0">{figure}</div>}
        </Container>
      </Scene>
    </section>
  );
}
