import type { Metadata } from "next";
import { AcademyPage } from "./_components/AcademyPage";
import { academyPageContent } from "./_content/academianovit";
import { site } from "@/shared/content/site";

/**
 * Its own description and link-card title, not the site's — but not its own
 * tab title. The root layout pins `title` to `site.name` so the tab reads
 * "Novit Software" everywhere; leaving `title` out here is what lets that
 * inherit instead of being overridden per route.
 *
 * `metadataBase` in the root layout is what makes the relative `url` below
 * resolve, and the root layout's `openGraph` block is not inherited field by
 * field — declaring `openGraph` here replaces it, so the fields that still
 * apply (`siteName`, `locale`, `type`) are repeated rather than assumed.
 */
export const metadata: Metadata = {
  description: academyPageContent.meta.description,
  alternates: { canonical: "/academianovit" },
  openGraph: {
    title: academyPageContent.meta.title,
    description: academyPageContent.meta.description,
    url: "/academianovit",
    siteName: site.name,
    locale: "es_AR",
    type: "website",
  },
};

export default function AcademiaNovit() {
  return <AcademyPage />;
}
