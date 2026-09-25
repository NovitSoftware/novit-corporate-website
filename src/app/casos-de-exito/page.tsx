import type { Metadata } from "next";
import { CasesWork } from "./_sections/CasesWork";
import { CustomerMap } from "./_components/CustomerMap";
import { PageOpener } from "@/components/layout/PageOpener";
import { SiteShell } from "@/components/layout/SiteShell";
import { casesFooterContent, casesPageContent } from "@/content/casos-de-exito";
import { site } from "@/content/site";

/** Its own description and link-card title; the tab title is the root
 *  layout's, which pins it to `site.name` on every route. */
export const metadata: Metadata = {
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
 * The opener's aside is the customer map, and this is the only band on the
 * site that carries it: it is where the site says who the clients are.
 *
 * The two agents that used to lead as their own section are now the first
 * group of the recorrido, not a claim standing apart from the evidence
 * behind it.
 */
export default function CasosDeExito() {
  const { eyebrow, title, lead, cta } = casesPageContent;

  return (
    <SiteShell footer={casesFooterContent}>
      <PageOpener
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        cta={cta}
        aside={<CustomerMap />}
      />
      <CasesWork />
    </SiteShell>
  );
}
