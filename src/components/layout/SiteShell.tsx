import type { ReactNode } from "react";
import { SectionHandoff } from "@/components/motion/SectionHandoff";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { FooterContent } from "@/content/footer";

/**
 * The chrome every route carries: the header, the band hand-off, the one
 * `#contenido` landmark the skip link targets, and the footer.
 *
 * Extracted when the Academia got a page of its own and this stopped being
 * home-page structure. `SectionHandoff` in particular has to be mounted
 * alongside the bands rather than inside any one of them — it reads them out
 * of `main` — and that is exactly the kind of requirement that gets lost when
 * a second page is assembled by copying the first.
 *
 * The page curtain is *not* here: it has to outlive the page it covers, so it
 * lives in the root layout. See `PageTransitions`.
 */
export function SiteShell({
  children,
  footer,
}: {
  children: ReactNode;
  /** The route's own footer index — every route has one, including `/`. */
  footer: FooterContent;
}) {
  return (
    <>
      <SiteHeader />
      <SectionHandoff />
      <main id="contenido">{children}</main>
      <SiteFooter content={footer} />
    </>
  );
}
