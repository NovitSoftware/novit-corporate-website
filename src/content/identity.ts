/* Who the site is and how to reach it: the constants, the real channels, and the page metadata. */

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
 * The Academia's own inbox. Everything about the cursada — requisitos,
 * contenidos, entregas, cuándo abre la próxima edición — goes here and not to
 * `siteContact.email`, which is the company's commercial channel.
 *
 * The socials are the same two accounts: Novit announces its editions on them,
 * and the Academia has none of its own.
 */
export const academyContact = {
  email: { label: "academia@novit.com.ar", href: "mailto:academia@novit.com.ar" },
  social: siteContact.social,
} as const;

export const metadataContent = {
  title: "Novit Software — Software a medida y agentes de IA integrados",
  description:
    "Desarrollamos software a medida para organizaciones que necesitan digitalizar procesos críticos de negocio, y agentes de IA integrados a esos procesos. Desde 2015.",
  /**
   * The link-preview card's own two lines. They were written into
   * `opengraph-image.tsx` as literals, which meant the card and the metadata
   * could drift — and did: the card still promised a headline the page had
   * stopped using. The headline is short because it is set at 64px over the
   * logo; `description` above is a sentence, which is the wrong shape there.
   */
  ogHeadline: "Software a medida y agentes de IA integrados",
  ogSupporting: "Ingeniería de software para procesos críticos. Desde 2015.",
} as const;
