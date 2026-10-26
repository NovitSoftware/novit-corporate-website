import type { Metadata } from "next";
import { OfficeWalk } from "./_components/OfficeWalk";
import { DevelopmentConsulting } from "./_sections/DevelopmentConsulting";
import { DevelopmentStages } from "./_sections/DevelopmentStages";
import { PageOpener } from "@/components/layout/PageOpener";
import { SiteShell } from "@/components/layout/SiteShell";
import { developmentFooterContent, developmentPageContent } from "@/content/desarrollo-y-consultoria";
import { site } from "@/content/site";

/** Its own title, description and link-card title; the title is what the
 *  tab reads and what search results show for this page. */
export const metadata: Metadata = {
  title: developmentPageContent.meta.title,
  description: developmentPageContent.meta.description,
  alternates: { canonical: "/desarrollo-y-consultoria" },
  openGraph: {
    title: developmentPageContent.meta.title,
    description: developmentPageContent.meta.description,
    url: "/desarrollo-y-consultoria",
    siteName: site.name,
    locale: "es_AR",
    type: "website",
  },
};

/**
 * Opener, then Desarrollo → Consultoría.
 *
 * Two bands and in that order, because the second is the first seen from the
 * other side: we build it, or we work on how your own team builds it. Both
 * are described at novitsoftware.com today, on a page each; the menu carries
 * one entry, so they share a page here.
 */
export default function DesarrolloYConsultoria() {
  const { eyebrow, icon, title, lead, cta } = developmentPageContent;

  return (
    <SiteShell footer={developmentFooterContent}>
      {/* Beside the claim, a walk round the office where the work is done:
          the desks, the servers, the lounge over the avenue, the meeting
          room. */}
      <PageOpener
        eyebrow={eyebrow}
        icon={icon}
        title={title}
        lead={lead}
        cta={cta}
        art={<OfficeWalk />}
      />
      <DevelopmentStages />
      <DevelopmentConsulting />
    </SiteShell>
  );
}
