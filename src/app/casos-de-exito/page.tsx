import type { Metadata } from "next";
import { CasesWork } from "./_sections/CasesWork";
import { CustomerMap } from "./_components/CustomerMap";
import { PageOpener } from "@/components/layout/PageOpener";
import { SiteShell } from "@/components/layout/SiteShell";
import { casesFooterContent, casesPageContent } from "@/content/casos-de-exito";
import { site } from "@/content/site";

/** Its own title, description and link-card title; the title is what the
 *  tab reads and what search results show for this page. */
export const metadata: Metadata = {
  title: casesPageContent.meta.title,
  description: casesPageContent.meta.description,
  alternates: { canonical: "/casos-de-exito" },
  openGraph: {
    title: casesPageContent.meta.title,
    description: casesPageContent.meta.description,
    url: "/casos-de-exito",
    siteName: site.name,
    locale: "es_AR",
    type: "website",
  },
};

/**
 * Opener, then the recorrido: one decade of projects, IA first.
 *
 * The opener's aside is the customer map: this is where the site says who
 * the clients are. The home page's hero carries it too, beside the headline.
 *
 * The two agents that used to lead as their own section are now the first
 * group of the recorrido, not a claim standing apart from the evidence
 * behind it.
 */
export default function CasosDeExito() {
  const { eyebrow, icon, title, lead, cta } = casesPageContent;

  return (
    <SiteShell footer={casesFooterContent}>
      <PageOpener
        eyebrow={eyebrow}
        icon={icon}
        title={title}
        lead={lead}
        cta={cta}
        art={<CustomerMap />}
      />
      <CasesWork />
    </SiteShell>
  );
}
