import type { ReactNode } from "react";
import { SectionHandoff } from "@/components/motion/SectionHandoff";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

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
 * The intro curtain is *not* here. It belongs to the home page: it plays
 * once, on arrival at the site, and `HeroScene` waits on its completion
 * signal. Mounting it on every route would replay it on every navigation.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <SectionHandoff />
      <main id="contenido">{children}</main>
      <SiteFooter />
    </>
  );
}
