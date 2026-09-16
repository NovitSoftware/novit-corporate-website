import { IntroOverlay } from "./IntroOverlay";
import { AboutSection } from "../_sections/AboutSection";
import { AcademySection } from "../_sections/AcademySection";
import { CasesSection } from "../_sections/CasesSection";
import { ContactSection } from "../_sections/ContactSection";
import { HeroSection } from "../_sections/HeroSection";
import { SafetySection } from "../_sections/SafetySection";
import { ServicesSection } from "../_sections/ServicesSection";
import { SiteShell } from "@/shared/layout/SiteShell";
import { footerContent } from "../_content/footer";
import { TeamSection } from "../_sections/TeamSection";

/**
 * Page order is priority order: the Academia used to be an aside three
 * quarters of the way down, inside the Equipo section, and it is now the first
 * thing after the hero — announced above the headline as well — because it is
 * what this site is most trying to place. The AI practice follows, then the
 * four agents already in production that back it up, then the governance
 * argument, then who Novit is.
 *
 * 01 Academia · 02 Servicios · 03 Casos · 04 Seguridad · 05 Nosotros
 * 06 Equipo · 07 Contacto. The old `05 · Relaciones` band folded into
 * Nosotros; the numbers in `_content/home.ts` are kept in step with this list
 * by hand, so change both together.
 *
 * Contacto is last, directly above the footer, and it is now the only closing
 * band. `NextSection` — the cierre — used to sit after it, and once the form
 * moved to the bottom the two were saying the same thing twice: the cierre's
 * lead ("una conversación corta para entender cómo trabajás hoy, y una
 * propuesta acotada con alcance, plazo y dueño") was almost word for word the
 * contact section's own description, and its buttons pointed back up the page
 * to Servicios and Nosotros from immediately above a form. A statement of the
 * ask followed by the ask is one section, so the cierre is gone and the form
 * carries the close.
 */
export function HomePage() {
  return (
    <>
      {/* Outside the shell, and only here: the curtain plays once on arrival
          at the site, and `HeroScene` below waits on its completion signal. */}
      <IntroOverlay />
      <SiteShell footer={footerContent}>
        <HeroSection />
        <AcademySection />
        <ServicesSection />
        <CasesSection />
        <SafetySection />
        <AboutSection />
        <TeamSection />
        <ContactSection />
      </SiteShell>
    </>
  );
}
