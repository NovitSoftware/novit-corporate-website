import { PageOpener } from "@/shared/layout/PageOpener";
import { servicesPageContent } from "../_content/inteligencia-artificial";

/**
 * The opener: the claim, and the door.
 *
 * ## What used to be here
 *
 * The architecture diagram hung off the bottom of this band, on the reasoning
 * that the reader this page is written for reads architecture diagrams for a
 * living and that the diagram *is* the proposition. Both halves of that are
 * still true; the placement was not. What it produced on screen was a label,
 * four floating pills and then an abrupt white strip with four more titles in
 * it, with nothing saying what the two halves had to do with each other — and
 * it arrived before the reader had been told why a shared architecture is the
 * question. It is its own band now, third, where the brochure puts it, with a
 * heading over it saying what it is. See `ServicesArchitecture`.
 *
 * So this band does the one thing an opener does: says what Novit is, and
 * offers the way in. The shape itself is `PageOpener`, shared with the other
 * two routes that open this way.
 */
export function ServicesOpener() {
  const { eyebrow, title, lead, cta } = servicesPageContent;

  return <PageOpener eyebrow={eyebrow} title={title} lead={lead} cta={cta} />;
}
