import { Container } from "@/components/ui/Container";
import { Emphasis } from "@/components/ui/Emphasis";
import { MutedClip } from "@/components/ui/MutedClip";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/section/Section";
import { SectionIntro } from "@/components/section/SectionIntro";
import { presenceContent } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * En persona: the founders on the road, in their own clips.
 *
 * Portrait clips — the format they were shot in — in the team photos' frame,
 * each captioned with where it was and never when. One row from `lg`, as many
 * across as there are clips; two across on a narrower screen.
 */
export function PresenceSection() {
  const { clips } = presenceContent;

  return (
    <Section id={presenceContent.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={presenceContent.eyebrow}
            icon={presenceContent.icon}
            title={presenceContent.title}
            aside={
              <p
                data-anim="rise"
                className="max-w-[52ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
              >
                <Emphasis text={presenceContent.lead} />
              </p>
            }
            below={
              <ul
                data-anim-batch
                className={cn(
                  "grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6",
                  clips.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
                )}
              >
                {clips.map((clip) => (
                  <li
                    key={clip.src}
                    data-anim="card"
                    className="team-photo aspect-[9/16]"
                  >
                    <MutedClip src={clip.src} description={clip.description} />
                    <div className="absolute inset-x-0 bottom-0 z-[2] p-4 sm:p-5">
                      <p className="eyebrow text-celeste">{clip.label}</p>
                      <p className="mt-1 text-sm font-bold text-blanco">{clip.place}</p>
                    </div>
                  </li>
                ))}
              </ul>
            }
          />
        </Container>
      </Scene>
    </Section>
  );
}
