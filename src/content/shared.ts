/* ==========================================================================
   Content read by more than one route.

   Everything else lives in the file named after the page that renders it. A
   value belongs here only once a second route reads it; one caller means it
   goes back to that page's file.
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

/**
 * The root layout's metadata and the link-preview card. It is the home page's
 * own title and description, and the default the other two routes override.
 */
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

/* The cases, with the client each one belongs to. Rendered on the home page
   and again on `/inteligencia-artificial`, each under its own heading. */

export const casesContent = {
  index: "03",
  eyebrow: "Casos de éxito",
  title: "Agentes que ya están trabajando",
  /* Textual del brochure §04. Estuvo reescrito acá como "En las dos empresas
     fue el primer agente que entró en producción…", que es copy nueva sobre
     una fuente que ya existe. La banda dice lo que dice la presentación. */
  description:
    "Cada uno fue el primer agente de su empresa: un proceso concreto que hoy funciona y que abrió la puerta a todo lo que sigue.",
  /* La columna que el brochure pone sobre esta cifra en su tabla de casos.
     Estaba escrita como literal en `CaseCard`. */
  resultLabel: "Resultado",
  cases: [
    {
      id: "arancelaria",
      icon: "search",
      area: "Comercio exterior",
      title: "Clasificación arancelaria asistida",
      description:
        "Años de antecedentes y criterio experto convertidos en un agente que encuentra el código arancelario para la declaración aduanera.",
      result: "De horas de búsqueda a segundos",
      logo: {
        name: "United Logistic Company",
        src: "/logos/united-logistic-company.jpg",
        width: 557,
        height: 395,
        displayHeight: 56,
        invertOnLight: false,
      },
    },
    {
      id: "sap",
      icon: "coin",
      area: "Administración",
      title: "Facturación automatizada contra SAP",
      description:
        "Interpreta las facturas de proveedores, arma la documentación en el ERP y captura datos de compra que antes se perdían.",
      result: "Dos personas liberadas de la carga manual",
      logo: {
        name: "Gamma Group",
        src: "/logos/gamma-group.png",
        width: 300,
        height: 54,
        displayHeight: 26,
        invertOnLight: false,
      },
    },
  ],
} as const;

export type CaseStudy = (typeof casesContent.cases)[number];

/*
 * There is no `clientsContent` and no "Confían en Novit" strip: each case
 * names its own client, so the logo data lives on the case above and the
 * separate row of marks was removed.
 */

/**
 * What the footer needs, whichever route is rendering it.
 *
 * A `link` with no `href` is a fact rather than a destination — the edition's
 * dates, say. The footer renders those as text instead of inventing an anchor
 * for them.
 */
export type FooterContent = {
  /** Optional: a route whose footer is a short index reads better without it. */
  mission?: string;
  columns: ReadonlyArray<{
    title: string;
    links: ReadonlyArray<{ label: string; href?: string }>;
  }>;
  legal: ReadonlyArray<{ label: string; href: string }>;
  social: ReadonlyArray<{
    id: "instagram" | "linkedin";
    label: string;
    href: string;
  }>;
  /**
   * The direct channels listed under the chip, each with the glyph its `id`
   * selects. Per route, because the inbox that answers depends on what the
   * page is about: the Academia's consultas go to its own address.
   */
  channels: ReadonlyArray<{
    id: "whatsapp" | "email";
    label: string;
    href: string;
  }>;
  /* `value` is the chip's label. There was a `label` beside it that no footer
     ever rendered. */
  contact: { value: string; href: string };
};

/** The footer on `/`. The other two routes have their own — see
 *  `servicesFooterContent` and `academyFooterContent`. */
export const footerContent = {
  /* Sin `tagline`. Era "Hacemos simple lo complejo." y no lo renderizaba
     nadie; la misma frase está viva como título de la banda Nosotros. */
  mission:
    "Optimizamos procesos de negocio desarrollando software de calidad con tecnologías de vanguardia.",
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
      title: "Compañía",
      links: [
        { label: "Nosotros", href: "/#nosotros" },
        { label: "Equipo", href: "/#equipo" },
        { label: "Contacto", href: "/#contacto" },
      ],
    },
    {
      title: "Enfoque",
      links: [
        /* The only way into either route. The home page names the Academia
           and the AI line and does not link to them: it is about the company,
           and those two are subjects it mentions. The footer is where a
           corporate site lists what it has. */
        { label: "Academia Novit", href: "/academianovit" },
        { label: "Inteligencia artificial", href: "/inteligencia-artificial" },
        { label: "Casos", href: "/#casos" },
        { label: "Seguridad y gobierno", href: "/#seguridad" },
      ],
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
