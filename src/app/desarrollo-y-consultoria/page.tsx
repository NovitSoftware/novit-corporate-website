import type { Metadata } from "next";
import { DevelopmentConsulting } from "./_sections/DevelopmentConsulting";
import { DevelopmentStages } from "./_sections/DevelopmentStages";
import { PageOpener } from "@/components/layout/PageOpener";
import { SiteShell } from "@/components/layout/SiteShell";
import { developmentFooterContent, developmentPageContent } from "@/content/desarrollo-y-consultoria";
import { site } from "@/content/site";

/** Its own description and link-card title; the tab title is the root
 *  layout's, which pins it to `site.name` on every route. */
export const metadata: Metadata = {
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
  const { eyebrow, title, lead, cta } = developmentPageContent;

  return (
    <SiteShell footer={developmentFooterContent}>
      <PageOpener eyebrow={eyebrow} title={title} lead={lead} cta={cta} />
      <DevelopmentStages />
      <DevelopmentConsulting />
    </SiteShell>
  );
}
