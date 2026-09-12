import { AcademyAbout } from "@/components/academy/AcademyAbout";
import { AcademyAudience } from "@/components/academy/AcademyAudience";
import { AcademyEvaluation } from "@/components/academy/AcademyEvaluation";
import { AcademyOpener } from "@/components/academy/AcademyOpener";
import { AcademyRegistration } from "@/components/academy/AcademyRegistration";
import { AcademySchedule } from "@/components/academy/AcademySchedule";
import { SiteShell } from "@/components/layout/SiteShell";

/**
 * `/academianovit`.
 *
 * The home page has a teaser band — the description, the one line that turns
 * the wrong reader away, and a link. This is where that link goes, and it
 * carries the programme in full: the aim, the specific objectives, the
 * prerequisites, the modules and their syllabus, the marking criteria, who
 * teaches it, what it reads from, and the way in.
 *
 * ## The order is the order a candidate moves through
 *
 * Not the order of the course document, which opens with its general
 * objective and puts requirements fifth. Someone landing here is deciding one
 * thing at a time, in this sequence: is this selective enough to be worth it
 * (the opener), what is it actually about (Qué es), am I eligible (A quién
 * está dirigida), how is it organised (Cursada), how am I judged (Evaluación),
 * how do I get in (Inscripción). The filter comes third rather than last
 * because the page's job for an ineligible reader is to let them leave early.
 *
 * ## Six bands, and it used to be eight
 *
 * "Qué se enseña" listed thirteen learning outcomes in four cards, and
 * "Docencia y bibliografía" named the staff and the reading. Both were
 * accurate and both were more than this page should carry: a course that is
 * described in full before it is sold is a course the reader finishes reading
 * about instead of applying to. What survives is the argument — what it is,
 * who it is for, how it is organised, how it is marked, and the date.
 *
 * ## No section numbers
 *
 * The home page numbers its bands 01–07, and they are one continuous
 * argument. Numbering these would read as a continuation of it — this is a
 * different page about one subject, not chapters eight to thirteen. The five
 * modules in `AcademySchedule` are the only numbered thing here, because they
 * are the only real sequence.
 *
 * Everything visual comes from the existing system: no new colour, no new
 * type, no new card. What is new is the composition — and the funnel in the
 * opener, which is where the page spends all of its boldness.
 */
export function AcademyPage() {
  return (
    <SiteShell>
      <AcademyOpener />
      <AcademyAbout />
      <AcademyAudience />
      <AcademySchedule />
      <AcademyEvaluation />
      <AcademyRegistration />
    </SiteShell>
  );
}
