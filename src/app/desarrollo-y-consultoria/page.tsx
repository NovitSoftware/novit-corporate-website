import type { Metadata } from "next";
import { DevelopmentPage } from "@/components/layout/DevelopmentPage";
import { developmentPageContent, site } from "@/content/site";

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

export default function DesarrolloYConsultoria() {
  return <DevelopmentPage />;
}
