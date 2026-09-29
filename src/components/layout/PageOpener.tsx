import type { ReactNode } from "react";
import { ChipButton } from "@/components/ui/ChipButton";
import type { IconName } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Container";
import { Scene } from "@/components/motion/Scene";
import { SectionLabel } from "@/components/section/SectionLabel";
import { SplitWords } from "@/components/motion/SplitWords";

type PageOpenerProps = {
  eyebrow: string;
  /** The route's mark, beside `eyebrow` — see `routeIcon`. */
  icon: IconName;
  title: string;
  lead: string;
  /** The way in. Off-site hrefs — the WhatsApp line — open in a new tab. */
  cta: { label: string; href: string };
  /** Anything the page wants under the button. */
  children?: ReactNode;
  /** The art beside the claim — the customer map, the office walk, the
   *  agent. Support for the claim, never the message — see `OpenerArt`. */
  art?: ReactNode;
};

/**
 * How every route that is not the home page opens: the label, the claim, the
 * lead, and the one door.
 *
 * Not `HeroScene` and not `Section`. `HeroScene` is choreographed for the home
 * hero's own parts — badge, pillars, flow — which no other opener has;
 * `Section` carries the standard vertical rhythm, where an opener has to clear
 * the fixed header instead.
 *
 * It was written out once per route — three times, with the padding scale and
 * the measures drifting a little on each. One shape, so a change to the way
 * the site opens is a change in one place.
 */
export function PageOpener({
  eyebrow,
  icon,
  title,
  lead,
  cta,
  children,
  art,
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
        <Container className={art ? OPENER_WITH_ART : undefined}>
          <div data-anim-block className="relative z-[1] max-w-[54rem]">
            <SectionLabel name={eyebrow} icon={icon} />
            <h1 data-anim="words" className="display-hero mt-7 max-w-[22ch] text-blanco">
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
          {art && <OpenerArt>{art}</OpenerArt>}
        </Container>
      </Scene>
    </section>
  );
}

/** The copy and its art side by side from `xl`: the copy's measure first,
 *  the art in what is left. */
export const OPENER_WITH_ART =
  "xl:grid xl:grid-cols-[minmax(0,54rem)_minmax(0,1fr)] xl:items-center xl:gap-8";

/**
 * Where an opener's art stands. It is support for the claim beside it, and is
 * set back as such: in its own column from `xl`, bled to the window's edge
 * past the 1440px container, at a strength short of the copy's; below that it
 * takes no room of its own and is not dropped either — it lies faint behind
 * the copy, where it cannot get in the way of reading it. See opener.css.
 *
 * Two wrappers: the scroll-in fade must not start from the stepped-back
 * strength, or the art would arrive at a fraction of it.
 */
export function OpenerArt({ children }: { children: ReactNode }) {
  return (
    <div className="opener-art xl:-mr-[max(2.25rem,calc((100vw_-_1440px)/2_+_2.25rem))]">
      <div data-anim="fade">{children}</div>
    </div>
  );
}
