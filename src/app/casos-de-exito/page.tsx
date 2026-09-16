import type { Metadata } from "next";
import { CasesPage } from "./_components/CasesPage";
import { casesPageContent } from "./_content/casos-de-exito";
import { site } from "@/shared/content/site";

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

export default function CasosDeExito() {
  return <CasesPage />;
}
