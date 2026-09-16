import { DevelopmentConsulting } from "@/components/development/DevelopmentConsulting";
import { DevelopmentStages } from "@/components/development/DevelopmentStages";
import { PageOpener } from "@/components/layout/PageOpener";
import { SiteShell } from "@/components/layout/SiteShell";
import {
  developmentFooterContent,
  developmentPageContent,
} from "@/content/site";

/**
 * `/desarrollo-y-consultoria`: opener, then Desarrollo → Consultoría.
 *
 * Two bands and in that order, because the second is the first seen from the
 * other side: we build it, or we work on how your own team builds it. Both
 * are described at novitsoftware.com today, on a page each; the menu carries
 * one entry, so they share a page here.
 */
export function DevelopmentPage() {
  const { eyebrow, title, lead, cta } = developmentPageContent;

  return (
    <SiteShell footer={developmentFooterContent}>
      <PageOpener eyebrow={eyebrow} title={title} lead={lead} cta={cta} />
      <DevelopmentStages />
      <DevelopmentConsulting />
    </SiteShell>
  );
}
