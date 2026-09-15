import { ChipButton } from "@/components/ui/ChipButton";
import { Container } from "@/components/ui/Container";
import { HeroScene } from "@/components/motion/HeroScene";
import { Icon } from "@/components/ui/Icon";
import { SplitWords } from "@/components/motion/SplitWords";
import { heroContent } from "@/content/site";

/**
 * The cabecera: the one place on the page where the gradient is the surface
 * rather than the ground, and the only band whose copy is set on it directly.
 *
 * What came off it: two blurred blooms and a bar field, all in the colours of
 * the gradient they sat on; a founding-year figure floating over the corner
 * that the Nosotros stat row states again a screen later; the two 4:3 corner
 * tiles, which were filled with a 158° azul-into-azul-deep gradient — a third
 * gradient in a system that has exactly two — to point at a section the copy
 * already names; and the bled isotipo watermark, which repeated the header's
 * own mark as decoration rather than information. What is left is the claim,
 * and the room to read it.
 */
export function HeroSection() {
  return (
    <HeroScene>
      <section
        id="inicio"
        /* The hero is a band too — see `ui/Section.tsx`. It is the first one,
           which is what excludes it from the hand-off: its copy sits at the
           bottom of the band rather than the middle, so the exit window that
           suits every other band would dim the headline while it is still the
           most prominent thing on the page. */
        data-band
        data-tone="dark"
        className="relative flex min-h-dvh scroll-mt-anchor flex-col justify-end overflow-x-clip pb-10 pt-header text-blanco sm:pb-14"
      >
        <Container className="relative">
          <div data-hero="copy" className="max-w-[52rem]">
            <AcademyAnnouncement />

            <span
              data-anim="chip"
              data-hero="badge"
              className="chip chip-outline mb-7 inline-flex text-celeste"
            >
              {heroContent.eyebrow}
            </span>
            {/* `20ch`, where this was `16ch`. The measure is fitted to the
                headline: at 16ch the title — five words longer than the one
                this band opened with — broke to four lines and the last one
                held a single word. Same cap `AcademyOpener` uses. */}
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
              <a
                href={heroContent.secondaryCta.href}
                className="link-rule px-2 eyebrow text-celeste hover:text-blanco"
              >
                {heroContent.secondaryCta.label}
              </a>
            </div>
          </div>

          <div
            data-anim="bar"
            data-hero="pillars-rule"
            aria-hidden="true"
            className="hairline mt-14 w-full"
          />
          <div className="mt-5 flex items-center justify-between gap-8">
            {/* Each pillar carries its own mark now. On the gradient the glyph
                is celeste like the label beside it — the badge plate would put
                a light box on a dark ground for no reason at this size. */}
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
 * The Academia, above the headline — the very first thing on the page,
 * because it is the first priority.
 *
 * It is a pointer, not a bulletin. The strip carries the course name, the load
 * and the modality, all from the temario, and it links to the section below.
 * Nothing about an edition — an opening date, a cupo, a closing — is published
 * on this site; those go out on Novit's own accounts.
 *
 * It started life as a two-row block below the CTAs: one row for the Academia
 * and one for the AI practice. The services row repeated the H1 and the lead
 * almost word for word, and sitting under the buttons put the priority item
 * fourth in reading order. One row, at the top, is both the honest structure
 * and the prominent one.
 *
 * Above the `INTELIGENCIA ARTIFICIAL` chip rather than instead of it: the chip
 * says which practice the page belongs to, this says what is open. The rule
 * between the label and the arrow draws across on hover, so the whole strip
 * behaves like the one link it is.
 *
 * Both data attributes are load-bearing and they do different jobs.
 * `data-anim` sets the resting state in globals.css; `data-hero` is what
 * `HeroScene`'s paused timeline animates out of it. `data-anim` alone is only
 * ever cleared by a scroll-triggered `Scene`, which this band does not have —
 * the first version had `data-anim-batch` and no `data-hero`, so it sat at
 * `opacity: 0` for good and all that showed was the box it lives in.
 */
function AcademyAnnouncement() {
  const { announcement } = heroContent;

  return (
    <a
      data-anim="rise"
      data-hero="news"
      href={announcement.href}
      /* No `max-w` of its own: it fills the copy column. The cap used to be
         `40rem`/640px against content that needs 705px at its natural size, and
         because both flex children were `shrink-0` nothing yielded — the meta
         ran 65px past the card's inner edge and got clipped mid-word. Filling
         the column leaves the rule slack to absorb, which is what `flex-1`
         on it is for, and gives the hero the one full-measure element it was
         missing.

         Layout only. The ground, the border and the celeste rule across the
         top are `.hero-news` in globals.css — they were utilities here, and a
         `border-blanco/20` utility quietly outranks the accent rule the class
         tries to draw. */
      className="hero-news mb-8 flex w-full flex-col gap-2.5 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
    >
      <span className="flex shrink-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-celeste"
        />
        <span className="eyebrow text-celeste">
          {announcement.kicker}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="hero-news_rule hidden h-px flex-1 bg-blanco/25 sm:block"
      />

      {/* `min-w-0` and no `shrink-0`: a flex item defaults to `min-width:auto`,
          so it refuses to go below its content and spills instead of wrapping.
          This is the guard that keeps longer copy inside the border. */}
      <span className="flex min-w-0 items-center gap-3">
        <span className="text-[0.9375rem] leading-snug text-on-heading">
          {announcement.detail}
          <span className="block text-[0.8125rem] text-on-label sm:inline sm:before:mx-2 sm:before:text-on-label sm:before:content-['·']">
            {announcement.meta}
          </span>
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
