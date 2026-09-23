import { ContactSection } from "./_sections/ContactSection";
import { HeroSection } from "./_sections/HeroSection";
import { IntroOverlay } from "./_components/IntroOverlay";
import { ServicesSection } from "./_sections/ServicesSection";
import { SiteShell } from "@/components/layout/SiteShell";
import { homeFooterContent } from "@/content/home";

/**
 * Hero · 01 Qué hacemos · 02 Contacto.
 *
 * The page carries exactly what `novt-home-texto-final.md` writes and nothing
 * else: the Academia, the cases, the governance argument, Nosotros and Equipo
 * are subjects this page names or links to, not bands it holds. The Academia
 * reaches the reader as the news strip at the top of the hero, which goes to
 * `/academianovit`; the rest are in the menu and in the footer.
 *
 * The indices above are kept in step with `@/content/home` by hand, so change
 * both together.
 */
export default function Home() {
  return (
    <>
      {/* Outside the shell, and only here: the curtain plays once on arrival
          at the site, and `HeroScene` below waits on its completion signal. */}
      <IntroOverlay />
      <SiteShell footer={homeFooterContent}>
        <HeroSection />
        <ServicesSection />
        <ContactSection />
      </SiteShell>
    </>
  );
}
