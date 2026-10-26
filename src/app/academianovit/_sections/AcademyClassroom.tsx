import { Container } from "@/components/ui/Container";
import { MutedClip } from "@/components/ui/MutedClip";
import { Scene } from "@/components/motion/Scene";
import { Section } from "@/components/section/Section";
import { SectionIntro } from "@/components/section/SectionIntro";
import { academyPageContent } from "@/content/academianovit";

/**
 * Clases: the classroom as it runs, in the Academia's own footage.
 *
 * The statement and its reading on one side and, beside them, a stretch of
 * the Academia's reel — a class on a video call — in the team photos' frame,
 * portrait as it was shot and played muted.
 */
export function AcademyClassroom() {
  const { classroom } = academyPageContent.sections;

  return (
    <Section id={classroom.id}>
      <Scene>
        <Container>
          <SectionIntro
            eyebrow={classroom.eyebrow}
            icon={classroom.icon}
            title={classroom.title}
            aside={
              <div data-anim="card" className="team-photo aspect-[9/16] w-full max-w-[18rem]">
                <MutedClip
                  src={classroom.clip.src}
                  description={classroom.clip.description}
                />
              </div>
            }
          >
            <p
              data-anim="rise"
              className="max-w-[46ch] text-base leading-7 text-on-detail sm:text-lg sm:leading-8"
            >
              {classroom.lead}
            </p>
          </SectionIntro>
        </Container>
      </Scene>
    </Section>
  );
}
