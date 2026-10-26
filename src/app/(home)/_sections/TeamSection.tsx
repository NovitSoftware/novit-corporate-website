import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Image } from "@/components/ui/Image";
import { MutedClip } from "@/components/ui/MutedClip";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/section/Section";
import { SectionIntro } from "@/components/section/SectionIntro";
import { teamContent, type TeamFrame } from "@/content/home";
import { cn } from "@/lib/cn";

/** How many cells each frame takes: four columns from `lg`, two below. */
const SIZE: Record<TeamFrame["size"], string> = {
  big: "col-span-2 row-span-2",
  tall: "row-span-2",
  single: "",
};

/** What each frame is drawn at, for `next/image` to pick a width. */
const SIZES: Record<TeamFrame["size"], string> = {
  big: "(min-width: 1024px) 520px, 100vw",
  tall: "(min-width: 1024px) 260px, 50vw",
  single: "(min-width: 1024px) 260px, 50vw",
};

/**
 * Equipo: the people who do the work, in the team's own photographs and
 * clips.
 *
 * The page never says how many — the wall does: the year-end meetings at full
 * strength and the founders at the office mural in the large frames, the
 * office working, and two clips that keep it moving. Under it, the disciplines
 * a project draws on. Each is a reason to read the team as a company rather
 * than a pair of freelancers, without a sentence claiming it.
 *
 * The wall is a dense grid on fixed rows — four columns from `lg`, two below
 * — so frames of three sizes pack without gaps; a phone leaves out a few
 * frames, where the wall would otherwise run several screens.
 */
export function TeamSection() {
  const { media, disciplines } = teamContent;

  return (
    <Section id={teamContent.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={teamContent.eyebrow}
            icon={teamContent.icon}
            title={teamContent.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                {teamContent.lead}
              </p>
            }
            below={
              <div className="grid gap-12 lg:gap-14">
                <ul
                  data-anim-batch
                  className="grid grid-flow-dense auto-rows-[9rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:gap-4 lg:auto-rows-[10.5rem] lg:grid-cols-4"
                >
                  {media.map((frame) => (
                    <li
                      key={frame.src}
                      data-anim="card"
                      className={cn(
                        "team-photo",
                        SIZE[frame.size],
                        frame.phone === false && "max-lg:hidden",
                      )}
                    >
                      {frame.kind === "clip" ? (
                        <MutedClip src={frame.src} description={frame.alt} />
                      ) : (
                        <Image
                          src={frame.src}
                          alt={frame.alt}
                          fill
                          sizes={SIZES[frame.size]}
                          className="object-cover"
                          style={
                            frame.focus
                              ? { objectPosition: frame.focus }
                              : undefined
                          }
                        />
                      )}
                    </li>
                  ))}
                </ul>

                {/* The disciplines a project draws on, in the hero pillars'
                    own form: celeste marks on the gradient, one row. */}
                <ul
                  data-anim-batch
                  className="flex flex-wrap gap-x-7 gap-y-3 eyebrow text-celeste"
                >
                  {disciplines.map((discipline) => (
                    <li
                      key={discipline.label}
                      data-anim="chip"
                      className="inline-flex items-center gap-2"
                    >
                      <Icon name={discipline.icon} size="inline" />
                      <span>{discipline.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
