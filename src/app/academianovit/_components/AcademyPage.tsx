import { AcademyEvaluation } from "../_sections/AcademyEvaluation";
import { AcademyOpener } from "../_sections/AcademyOpener";
import { AcademySchedule } from "../_sections/AcademySchedule";
import { SiteShell } from "@/shared/layout/SiteShell";
import { academyFooterContent } from "../_content/academianovit";

/**
 * `/academianovit`.
 *
 * The home page has a teaser band — what the Academia is, the load, and
 * nothing else. This is where the programme itself lives.
 *
 * ## Three bands, and the way in is the opener's button
 *
 * The page describes rather than qualifies: the opener says what the cursada
 * is and when it runs, Cursada how it is organised, Evaluación how it is
 * marked. Consultas go to the Academia's inbox, which is the opener's CTA and
 * the footer's — a band of its own repeated the same address three times over.
 * `docs/novit/academia-novit.md` is the source for every word here.
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
    </SiteShell>
  );
}
