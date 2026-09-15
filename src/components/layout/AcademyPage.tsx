import { AcademyEvaluation } from "@/components/academy/AcademyEvaluation";
import { AcademyOpener } from "@/components/academy/AcademyOpener";
import { AcademyRegistration } from "@/components/academy/AcademyRegistration";
import { AcademySchedule } from "@/components/academy/AcademySchedule";
import { SiteShell } from "@/components/layout/SiteShell";
import { academyFooterContent } from "@/content/site";

/**
 * `/academianovit`.
 *
 * The home page has a teaser band — what the Academia is, the load, and
 * nothing else. This is where the programme itself lives: how the cursada is
 * organised, how the integrador is marked, and where to write.
 *
 * ## Four bands, and it used to be eight
 *
 * "Qué se enseña" listed thirteen learning outcomes in four cards and
 * "Docencia y bibliografía" named the staff and the reading; both were
 * accurate and both were more than this page should carry. Then "Qué es" (the
 * aim of the course and the agent/agentic-software distinction) and "A quién
 * está dirigida" (the four prerequisites under "no es una academia de nivel
 * inicial") came out on request.
 *
 * What that leaves is a page that describes rather than qualifies: the opener
 * says what the cursada is and when it runs, Cursada says how it is organised,
 * Evaluación how it is marked, and Consultas where to ask. The two removed
 * bands are intact in `docs/novit/academia-novit.md`, which is the source for
 * every word here.
 *
 * ## No section numbers
 *
 * The home page numbers its bands 01–07, and they are one continuous
 * argument. Numbering these would read as a continuation of it — this is a
 * different page about one subject, not chapters eight to eleven. The five
 * modules in `AcademySchedule` are the only numbered thing here, because they
 * are the only real sequence.
 *
 * Everything visual comes from the existing system: no new colour, no new
 * type, no new card.
 */
export function AcademyPage() {
  return (
    <SiteShell footer={academyFooterContent}>
      <AcademyOpener />
      <AcademySchedule />
      <AcademyEvaluation />
      <AcademyRegistration />
    </SiteShell>
  );
}
