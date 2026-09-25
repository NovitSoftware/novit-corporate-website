import { withBasePath } from "@/lib/base-path";
import { Badge } from "@/components/ui/Badge";
import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { HeroCurrents } from "../_components/HeroCurrents";
import { HeroScene } from "../_components/HeroScene";
import { Icon } from "@/components/ui/Icon";
import { SplitWords } from "@/components/motion/SplitWords";
import { heroContent } from "@/content/home";

/**
 * The cabecera: the one band where the gradient is the surface rather than the
 * ground, and the only one whose copy is set on it directly.
 *
 * Its copy sits at the bottom of the band, which is what excludes it from
 * `SectionHandoff` — the exit window that suits every other band would dim the
 * headline while it is still the most prominent thing on the page.
 *
 * Under the copy, the band's ground moves: `HeroCurrents`. The customer map
 * that used to stand beside the headline belongs to `/casos-de-exito`, the
 * band that says who the clients are.
 */
export function HeroSection() {
  return (
    <HeroScene>
      <section
        id="inicio"
        data-band
        data-tone="dark"
        className="relative flex min-h-dvh scroll-mt-anchor flex-col justify-end overflow-x-clip pb-10 pt-header text-blanco sm:pb-14"
      >
        <HeroCurrents />
        <Container className="relative">
          <div data-hero="copy" className="max-w-[52rem]">
            <AcademyAnnouncement />

            <Badge
              icon="award"
              data-anim="chip"
              data-hero="badge"
              className="mb-7"
            >
              {heroContent.eyebrow}
            </Badge>
            {/* `20ch` is the measure the headline is fitted to, and the same
                cap `AcademyOpener` uses. */}
            <h1
              data-anim="words"
              data-hero="title"
              className="display-hero max-w-[20ch]"
            >
              <SplitWords text={heroContent.title} />
            </h1>
            <p
              data-anim="rise"
              data-hero="lead"
              className="mt-7 max-w-[46ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
            >
              {heroContent.statement}
            </p>
            <div
              data-anim="rise"
              data-hero="cta"
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <ChipButton href={heroContent.primaryCta.href} variant="light">
                {heroContent.primaryCta.label}
              </ChipButton>
            </div>
          </div>

          <div
            data-anim="bar"
            data-hero="pillars-rule"
            aria-hidden="true"
            className="hairline mt-14 w-full"
          />
          <div className="mt-5 flex items-center justify-between gap-8">
            {/* On the gradient each glyph is celeste like the label beside it:
                the badge plate would put a light box on a dark ground at a
                size that does not need one. */}
            <ul className="flex flex-wrap gap-x-7 gap-y-2 eyebrow text-celeste">
              {heroContent.pillars.map((pillar) => (
                <li
                  key={pillar.label}
                  data-anim="chip"
                  data-hero="pillar"
                  className="inline-flex items-center gap-2"
                >
                  <Icon name={pillar.icon} size="inline" />
                  {pillar.label}
                </li>
              ))}
            </ul>
            <ScrollCue />
          </div>
        </Container>
      </section>
    </HeroScene>
  );
}

/**
 * The Academia, above the headline: one date, and the route that explains the
 * programme. It is a news item — nothing about the course is stated here,
 * because `/academianovit` is where the course is.
 *
 * Both data attributes are load-bearing and do different jobs. `data-anim`
 * sets the resting state in globals.css; `data-hero` is what `HeroScene`'s
 * paused timeline animates out of it. `data-anim` alone is only ever cleared
 * by a scroll-triggered `Scene`, which this band does not have, so without
 * `data-hero` the strip stays at `opacity: 0` for good.
 */
function AcademyAnnouncement() {
  const { announcement } = heroContent;

  return (
    <a
      data-anim="rise"
      data-hero="news"
      href={withBasePath(announcement.href)}
      /* No `max-w` of its own: it fills the copy column, which gives the hero
         its one full-measure element and leaves the rule the slack to absorb
         — that is what `flex-1` on it is for.

         Layout only. The ground, the border and the celeste rule across the
         top are `.hero-news` in globals.css; a `border-blanco/20` utility here
         would quietly outrank the accent rule that class draws. */
      className="hero-news mb-8 flex w-full flex-col gap-2.5 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
    >
      <span className="flex shrink-0 items-center gap-2.5 text-celeste">
        <Icon name="academy" size="inline" />
        <span className="eyebrow">{announcement.kicker}</span>
      </span>

      <span
        aria-hidden="true"
        className="hero-news_rule hidden h-px flex-1 bg-blanco/25 sm:block"
      />

      {/* `min-w-0` and no `shrink-0`: a flex item defaults to
          `min-width: auto`, so it refuses to go below its content and spills
          instead of wrapping. This is what keeps longer copy inside the
          border. */}
      <span className="flex min-w-0 items-center gap-3">
        <span className="text-[0.9375rem] leading-snug text-on-heading">
          {announcement.detail}
        </span>
        <svg
          viewBox="0 0 10 10"
          aria-hidden="true"
          focusable="false"
          className="hero-news_arrow size-2.5 shrink-0 text-celeste"
        >
          <path d="M2 1.4 7.4 5 2 8.6Z" fill="currentColor" />
        </svg>
      </span>
    </a>
  );
}

/** Purely graphical hint that there is more below. No copy, no information. */
function ScrollCue() {
  return (
    <span
      aria-hidden="true"
      className="scroll-cue-track hidden h-14 w-px shrink-0 bg-blanco/20 lg:block"
    />
  );
}
