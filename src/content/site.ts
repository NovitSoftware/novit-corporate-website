/* ==========================================================================
   The company, its channels and the page metadata — read by every route.
   ========================================================================== */

export const site = {
  name: "Novit Software",
  shortName: "novit",
  url: "https://www.novitsoftware.com",
  foundingYear: 2015,
  copyrightYear: 2026,
  locale: "es",
} as const;

/**
 * The channels that actually exist, pulled from the standing corporate site
 * at novitsoftware.com — the phone number, the inbox, and the two social
 * accounts it links from its header. Nothing here is invented: the contact
 * form still doesn't send (see `contactContent`), because a submit needs a
 * receiving endpoint and a published phone number isn't one, but the header
 * menu and the footer can point at real channels in the meantime.
 *
 * The phone number opens WhatsApp rather than the dialer — novitsoftware.com
 * itself only exposes this number as a WhatsApp icon, never as a `tel:`
 * link, so a call is not actually one of the two things this number does.
 */
export const siteContact = {
  phone: {
    label: "+54 11 3176 9406",
    href: "https://wa.me/5491131769406",
  },
  email: { label: "info@novitsoftware.com", href: "mailto:info@novitsoftware.com" },
  social: [
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/novit.software",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/novit-software",
    },
  ],
} as const;

/**
 * The root layout's metadata and the link-preview card. It is the home page's
 * own Meta block from `novt-home-texto-final.md`, and the default the other
 * routes override.
 */
export const metadataContent = {
  title: "Novit Software — Desarrollo y Transformación IA",
  description:
    "Desarrollamos software a medida y agentes de IA integrados al proceso real de tu empresa, con foco en la reducción de costos y el mantenimiento a largo plazo.",
  /** The card's own two lines: the headline is set at 64px over the logo, so
   *  it takes the title without the company name, and the sentence below is
   *  the cierre's volanta rather than the description, which is the wrong
   *  shape there. */
  ogHeadline: "Desarrollo y Transformación IA",
  ogSupporting: "Más de 11 años haciendo simple lo complejo.",
} as const;
