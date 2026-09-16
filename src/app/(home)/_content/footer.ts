import { footerMission } from "@/shared/content/footer";
import { navigation } from "@/shared/content/navigation";
import { siteContact } from "@/shared/content/site";

/** The footer on `/`. The other two routes have their own — see
 *  `servicesFooterContent` and `academyFooterContent`. */
export const footerContent = {
  /* Sin `tagline`. Era "Hacemos simple lo complejo." y no lo renderizaba
     nadie; la misma frase está viva como título de la banda Nosotros. */
  mission: footerMission,
  /**
   * Every link here resolves to a section that exists, and each section is
   * named once. The previous list had "Servicios" and "Transformación IA"
   * both pointing at `#servicios` — two labels for one destination, which
   * makes a footer look bigger than the site is — and "Relaciones" pointing
   * at `#partners`, an anchor that stopped existing when that band folded
   * into Nosotros. A footer link that lands nowhere is worse than a missing
   * one: it moves the page and leaves the reader where they were.
   */
  columns: [
    {
      /* This page's own bands, which is what every route's footer indexes. */
      title: "En esta página",
      links: [
        { label: "Nosotros", href: "/#nosotros" },
        { label: "Equipo", href: "/#equipo" },
        { label: "Seguridad y gobierno", href: "/#seguridad" },
        { label: "Contacto", href: "/#contacto" },
      ],
    },
    {
      /* The menu, again. The home page names the Academia and the AI line in
         its own copy and does not link to them from the body — it is about
         the company, and those are subjects it mentions — but a reader at the
         bottom of it should not have to go back up to the menu to leave. */
      title: "Secciones",
      links: navigation.map((item) => ({
        label: item.label,
        href: item.href,
      })),
    },
  ],
  /**
   * Empty on purpose. This row used to read "Privacidad · Seguridad", both
   * pointing at `#seguridad` — an in-page section about how client data is
   * handled in an AI architecture, which is not a privacy policy. Two links
   * in the legal row of a footer read as legal documents; neither exists, and
   * no policy page is named anywhere in the brand material. When they are
   * written, they go here with their real URLs.
   */
  legal: [] as Array<{ label: string; href: string }>,
  /** Instagram and LinkedIn, both live and linked from novitsoftware.com. */
  social: siteContact.social,
  /** The two direct channels: the WhatsApp number and the commercial inbox. */
  channels: [
    {
      id: "whatsapp",
      label: siteContact.phone.label,
      href: siteContact.phone.href,
    },
    { id: "email", label: siteContact.email.label, href: siteContact.email.href },
  ],
  /**
   * The footer's one call to action, and it stays on this page.
   *
   * It used to be the most prominent link on the site pointing away from it: a
   * full ChipButton reading "novitsoftware.com", sending anyone who reached the
   * bottom back to the standing corporate site rather than to the form one
   * band above them. The label names what happens, in the same words the
   * contact section opens with.
   */
  contact: {
    value: "Escribinos",
    href: "/#contacto",
  },
} as const;
