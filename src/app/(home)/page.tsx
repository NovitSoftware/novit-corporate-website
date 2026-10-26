import type { Metadata } from "next";
import { ContactSection } from "./_sections/ContactSection";
import { HeroSection } from "./_sections/HeroSection";
import { PresenceSection } from "./_sections/PresenceSection";
import { ServicesSection } from "./_sections/ServicesSection";
import { TeamSection } from "./_sections/TeamSection";
import { SiteShell } from "@/components/layout/SiteShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { heroContent, homeFooterContent, services } from "@/content/home";
import { site, siteContact, siteFounders, siteMarkets } from "@/content/site";
import { BRAND_LOGO } from "@/lib/brand-logo";

/** The other routes name their own canonical; the home page names `/`. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * The company as search engines and AI assistants read it (schema.org
 * `Organization`, as JSON-LD): who it is, since when, who founded it, where
 * its clients are and what it works on — the same official data the pages
 * say, in a form a machine does not have to infer.
 */
const ORGANIZATION = {
  "@type": "Organization",
  name: site.name,
  url: site.url,
  description: heroContent.statement.replaceAll("**", ""),
  logo: `${site.url}${BRAND_LOGO.lockup.colour}`,
  foundingDate: String(site.foundingYear),
  email: siteContact.email.label,
  telephone: siteContact.phone.label,
  sameAs: siteContact.social.map((network) => network.href),
  founder: siteFounders.map((founder) => ({
    "@type": "Person",
    name: founder.name,
    jobTitle: founder.role,
  })),
  areaServed: siteMarkets.map((name) => ({ "@type": "Country", name })),
  address: { "@type": "PostalAddress", addressCountry: "AR" },
  memberOf: { "@type": "Organization", name: "Anthropic Partner Network" },
  knowsAbout: services.map((service) => service.label),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.label, description: service.title },
    })),
  },
};

/**
 * Hero · Qué hacemos · Equipo · En persona · Contacto. Unnumbered, like
 * every other route: the numbers added nothing.
 *
 * Equipo and En persona are the bands the page holds beyond
 * `novt-home-texto-final.md`: the people behind the work — without them a
 * visitor met services and a contact form and no one behind them.
 * Ciberseguridad was a band of its own too, and is now the wide card at the
 * foot of Qué hacemos. The Academia, the cases and the governance argument are
 * still subjects this page names or links to, not bands it holds. The
 * Academia reaches the reader as the news strip at the top of the hero, which
 * goes to `/academianovit`; the rest are in the menu and in the footer.
 */
export default function Home() {
  return (
    <SiteShell footer={homeFooterContent}>
      <JsonLd data={ORGANIZATION} />
      <HeroSection />
      <ServicesSection />
      <TeamSection />
      <PresenceSection />
      <ContactSection />
    </SiteShell>
  );
}
