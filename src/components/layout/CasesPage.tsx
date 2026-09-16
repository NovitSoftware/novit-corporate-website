import { CasesAgents } from "@/components/cases/CasesAgents";
import { CasesWork } from "@/components/cases/CasesWork";
import { PageOpener } from "@/components/layout/PageOpener";
import { SiteShell } from "@/components/layout/SiteShell";
import { casesFooterContent, casesPageContent } from "@/content/site";

/**
 * `/casos-de-exito`: opener, then the agents in production, then the
 * recorrido behind them.
 *
 * The named cases first and the unnamed work second, which is the order of
 * the evidence: two agents anybody can go and check, and then the decade that
 * made them possible.
 */
export function CasesPage() {
  const { eyebrow, title, lead, cta } = casesPageContent;

  return (
    <SiteShell footer={casesFooterContent}>
      <PageOpener eyebrow={eyebrow} title={title} lead={lead} cta={cta} />
      <CasesAgents />
      <CasesWork />
    </SiteShell>
  );
}
