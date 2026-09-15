/* The cabecera, and the three dimensions of AI it opens onto. */

/*
 * There is no `navigation` list any more, and no menu to hold one.
 *
 * Two of its seven entries were the other two routes, and nothing links
 * across routes now: each page is reached from novitsoftware.com and is the
 * whole of what it is. The remaining five were in-page anchors on a page the
 * reader is already scrolling, kept behind a panel they had to open to find
 * out that is all it held. The footer lists the sections in the open, which is
 * where an index of a single page belongs, and the header's one control takes
 * you back to the top.
 *
 * Every link in this file is an anchor on its own page, one of the three
 * routes, or a real channel (WhatsApp, mail, Instagram, LinkedIn). The two
 * inner routes are reachable again — `/inteligencia-artificial` from
 * `servicesIntro.cta` and the footer, `/academianovit` from the footer — which
 * is the condition for keeping them: a route nothing points at is dead weight.
 */

/**
 * The cabecera.
 *
 * ## It describes the company; it does not pitch
 *
 * This band used to open with "Partners de transformación IA" over "El mercado
 * se mueve. Las organizaciones que siguen operando con planillas y sistemas
 * desconectados se quedan atrás" — the brochure's headline and a line whose
 * whole mechanism is the reader's fear of being late. Both are sales copy on a
 * corporate site, and the second one is the exact shape brand-core cap. 07
 * rules out: *decimos lo que hacemos, no lo que no hacemos*, plus the regla de
 * la prueba concreta, which puts "la IA transforma tu negocio" in the "así no"
 * column.
 *
 * What is here instead is what Novit is, in the words the brand platform
 * already settled: the offer tree of cap. 08 as the three pillars, and the
 * spoken positioning of cap. 05 as the lead.
 *
 * The buttons say where they go. "Solicitar cotización" was a sales ask at the
 * top of a page the reader had not read yet.
 */
export const heroContent = {
  /* "Desde 2015" rather than "11 años" — cap. 01: the second one has to be
     recalculated every January and the first one never goes stale. */
  eyebrow: "Desde 2015",
  title: "Software a medida y agentes de IA integrados",
  statement:
    "Desarrollamos software a medida para organizaciones que necesitan digitalizar procesos críticos de negocio, y agentes de IA integrados a esos procesos. Entendemos el proceso, lo construimos con vos y la solución queda siendo tuya.",
  primaryCta: { label: "Contacto", href: "#contacto" },
  secondaryCta: { label: "Ver los casos", href: "#casos" },
  /** The offer tree of brand-core cap. 08, each branch with its mark. */
  pillars: [
    { label: "Software a medida", icon: "code" },
    { label: "Agentes de IA integrados", icon: "agent" },
    { label: "Células ágiles", icon: "team" },
  ],
  /**
   * The Academia, above the headline — the first thing on the page, because it
   * is the first priority.
   *
   * It is a pointer to the section below, not an announcement: the course
   * name, the load and the modality, all from the temario. No edition dates,
   * no "inscripción abierta", nothing that goes stale between cohorts. News
   * about an edition is not published on this site at all; it goes out on
   * Novit's own accounts.
   */
  announcement: {
    kicker: "Academia Novit",
    detail: "Desarrollo de Agentes IA y Software Agéntico",
    meta: "32 h · online",
    href: "#academia",
  },
} as const;

/**
 * The three dimensions of AI at Novit, which is brand-core cap. 05's canonical
 * block: *"Todo material comercial que hable de IA parte de acá, para que el
 * discurso sea uno solo."*
 *
 * ## They used to be an argument against buying elsewhere
 *
 * "El costo de comprar agentes sueltos · Un abono por agente, para siempre",
 * then the architecture, then the method. That is the brochure's sales
 * sequence — the risk and the criterion first, the solution second — and it is
 * the right one in a pitch deck, where someone is holding three vendor
 * proposals. On a corporate site it makes the first thing the company says
 * about itself a warning about somebody else, which cap. 07 rules out
 * (*"Negar una acusación que nadie hizo la instala"*).
 *
 * So the same three cards now say what AI is at Novit in the document's own
 * order: how we work, what we build, how it is sustained. The competitive
 * reading of it is still on `/inteligencia-artificial`, where a reader who
 * came for that argument can find it.
 *
 * `takeaway` is the one line the card exists to leave behind, set large. Each
 * card used to be a kicker, a heading and a three-line paragraph, and the
 * paragraph was doing all the work — so the eye had to read the whole card to
 * learn anything. The takeaway is the one line the card exists to leave
 * behind, set large; the description is there for whoever wants the rest.
 *
 * The three illustrations are the three near-square ones — 0.96, 0.91 and 1.06
 * — chosen together so one plate ratio holds all three at the same scale. That
 * is what picking art for a row means here: `object-contain` never crops, so a
 * drawing whose ratio fights the plate just gets smaller, and a row of three
 * with one small picture in it looks like a mistake rather than a set. The
 * character-led drawings, which are all wide, are not in this row for the same
 * reason — plus a face pulls the eye off the heading it is meant to support.
 */
export const highlights = [
  {
    id: "ia-proceso",
    kicker: "Nuestro proceso",
    icon: "code",
    illustration: "answers",
    title: "IA en cómo trabajamos",
    takeaway: "Una herramienta más del desarrollo",
    description:
      "Producimos más rápido y con mejor cobertura. El criterio de ingeniería y la revisión humana no se delegan.",
  },
  {
    id: "ia-solucion",
    kicker: "La solución",
    icon: "agent",
    illustration: "context",
    title: "IA en lo que construimos",
    takeaway: "Agentes integrados a un proceso concreto",
    description:
      "Automatización conversacional, automatización de procesos internos e IA sobre datos propios. Empieza por un caso medible y con dueño dentro de la empresa.",
  },
  {
    id: "ia-criterio",
    kicker: "El criterio",
    icon: "layers",
    illustration: "extraction",
    title: "IA en cómo se sostiene",
    takeaway: "La infraestructura queda instalada",
    description:
      "Conocimiento indexado una sola vez, identidad única y una capa de integración: cada agente nuevo se apoya en lo ya construido.",
  },
] as const;

export type Highlight = (typeof highlights)[number];
