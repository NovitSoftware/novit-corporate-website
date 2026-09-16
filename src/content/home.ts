/* ==========================================================================
   `/` — everything the home page renders, in the order it renders it.

   Hero · 01 Academia · 02 Servicios · 03 Casos · 04 Seguridad · 05 Nosotros
   06 Equipo · 07 Contacto. The casos band is the one gap: it comes from
   `casesContent` in `shared.ts`, because `/inteligencia-artificial` renders
   the same cards. The indices below are kept in step with `HomePage.tsx` by
   hand, so change both together.
   ========================================================================== */

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

/*
 * `closingContent` is gone with the cierre band it fed. Once the contact form
 * moved to the bottom of the page, that band's lead was almost word for word
 * `contactContent.description` one screen below it, and its buttons sent the
 * visitor back up to Servicios and Nosotros from directly above a form. The
 * contact section is the close now. See `layout/HomePage.tsx`.
 */
export const introContent = {
  label: "Novit Software",
  markAlt: "Isotipo Novit: barras horizontales y puntos del logotipo",
} as const;

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
      "Baja el costo de escribir código y se acortan los plazos. Parte de esa ganancia se reinvierte en revisión, pruebas y arquitectura: el criterio de ingeniería no se delega.",
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

/**
 * 01 · The Academia band.
 *
 * The programme it points at lives in `academianovit.ts`, which this page does
 * not read: the band states the load in its own words and the footer is what
 * links to the route.
 */
export const academyContent = {
  id: "academia",
  index: "01",
  eyebrow: "Academia Novit",
  title: "Se enseña a construir software agéntico",
  description:
    "Formamos al equipo —y a quienes se suman— en las tecnologías que el mercado demanda, hoy incluida la IA aplicada al desarrollo. Varias ediciones son abiertas y gratuitas.",
  /**
   * The panel under the description, and it states the load.
   *
   * It used to state the entry level — "No es una academia de nivel inicial",
   * in the violet voice, marked with the `alert` glyph — which is the content
   * of the "A quién está dirigida" band that `/academianovit` no longer
   * carries. Keeping the filter here while the page that explains it dropped
   * it would leave the site turning readers away with no page to send the
   * remaining ones to. The shape of the panel is the same; what it holds is
   * the course as the temario describes it.
   */
  note: {
    label: "Cursada",
    icon: "academy",
    text: "32 horas: 14 clases y 2 talleres de consulta, 100% online.",
  },
  /* No `cta`, on purpose. This band had one pointing at `#contacto` — a
     sales form for a question about teaching — and then one pointing at
     `/academianovit`. The band introduces the Academia and does not ask for
     anything, so there is nothing here for a button to do. The footer is
     what links to the route. */
} as const;

/* 02 · The Qué hacemos band: the intro and the five offer cards. */

export const servicesIntro = {
  index: "02",
  eyebrow: "Qué hacemos",
  title: "Tres líneas de trabajo",
  description:
    "Desarrollo de software a medida, células ágiles e inteligencia artificial. Trabajamos el ciclo completo —discovery, experiencia, arquitectura, desarrollo, calidad y soporte— o nos integramos a los equipos que ya existen. La línea de IA se abre en tres: el acompañamiento a la dirección, los agentes en producción y el workshop por donde suele empezar.",
  /* Back to `/inteligencia-artificial`, and it is the only thing that links
     there. The band states the offer; the reader who wants the AI line at
     full length has one place to go, and it is not a form. */
  cta: { label: "Ver la línea de IA", href: "/inteligencia-artificial" },
} as const;

/**
 * The offer, as brand-core cap. 08 draws it: three lines, and the AI line
 * first because it is the one the market asks about. `meta` is the one-phrase
 * answer to "what is this" — a card is scanned before it is read, and these
 * five used to be indistinguishable at a glance because every one of them
 * opened with a paragraph.
 *
 * UX/UI and QA are deliberately absent. Cap. 08 settled that they are method
 * rather than service lines and are not promoted.
 */
export const services = [
  {
    id: "ia-partner",
    variant: "featured" as const,
    icon: "strategy",
    title: "Partner de transformación IA",
    meta: "Estrategia, arquitectura y gobierno",
    description:
      "Acompañamos a la dirección en las decisiones que ningún proyecto aislado resuelve: qué construir, cómo medirlo, qué datos salen de la empresa y qué exigirle a terceros.",
  },
  {
    id: "agentes",
    variant: "default" as const,
    icon: "agent",
    title: "Agentes de IA integrados",
    meta: "Un proceso concreto, en producción",
    description:
      "Automatizaciones y agentes sobre un proceso medible y con dueño. Empiezan por un caso puntual y se apoyan en la infraestructura de la empresa.",
  },
  {
    id: "workshop",
    variant: "default" as const,
    icon: "search",
    title: "Workshop de IA aplicada",
    meta: "Una sesión con los líderes del negocio",
    description:
      "Los procesos que duelen, ordenados por impacto y esfuerzo. Sale un plan de acción con un primer caso, su métrica y quién lo va a usar.",
  },
  {
    id: "custom-software",
    variant: "default" as const,
    icon: "code",
    title: "Software a medida",
    meta: "Discovery, desarrollo e integraciones",
    description:
      "Para procesos que hoy se sostienen con planillas y sistemas desconectados. Empieza por un discovery con entregables propios, donde se define si el proyecto sirve antes de escribir código.",
  },
  {
    id: "staff",
    variant: "default" as const,
    icon: "team",
    title: "Células ágiles",
    meta: "Staff augmentation",
    description:
      "Nos sumamos a tu equipo cuando el cuello de botella es de capacidad. Misma ingeniería, misma continuidad de personas.",
  },
] as const;

/* 04 · The Confianza band: criterio, seguridad y gobierno. */

export const safetyContent = {
  index: "04",
  eyebrow: "Confianza",
  title: "Criterio, seguridad y gobierno",
  /* This read "Construir un agente se está volviendo commodity. Lo que no se
     commoditiza es el criterio que evita seis stacks que no se hablan y ningún
     activo propio." — the sales argument of the brochure, stated in a band
     whose subject is how client data is handled. The same four pillars below
     are what the band actually has to say, so the statement names the
     principle they come from instead of arguing against a competitor. */
  statement:
    "Tratamos la inteligencia artificial como infraestructura de la empresa, y una infraestructura se diseña con su gobierno adentro.",
  description:
    "Son las cuatro preguntas que aparecen apenas un agente toca datos reales: dónde se procesa la información, quién preguntó qué, contra qué norma se responde y de quién es lo que queda construido.",
  /* No `cta`. It read "Leer el enfoque de gobierno" and went to
     /inteligencia-artificial; with no route to send anyone to, a second
     "Solicitar cotización" two bands under the first one is chrome. The four
     pillars are the whole argument this band has to make. */
  pillars: [
    {
      icon: "lock",
      title: "Datos bajo control",
      description:
        "Procesamiento en la red privada del cliente. Sabemos qué información sale, dónde se procesa y con qué se entrena.",
    },
    {
      icon: "key",
      title: "Identidad y trazabilidad",
      description:
        "Permisos por usuario en cada consulta. Una auditoría tiene qué mirar: quién preguntó, qué se respondió y quién lo autorizó.",
    },
    {
      icon: "shield",
      title: "Cumplimiento",
      description:
        "Diseñamos para GDPR y para las reglas internas de cada organización. Las restricciones normativas entran en el alcance junto con los requerimientos funcionales.",
    },
    {
      icon: "check",
      title: "Propiedad del cliente",
      description:
        "Código, conocimiento y componentes quedan como activo de la empresa. Si se va un proveedor, no se va la capacidad.",
    },
  ],
} as const;

/* 05 · Quiénes somos, con la banda de Relaciones plegada adentro. */

export const aboutContent = {
  index: "05",
  eyebrow: "Quiénes somos",
  title: "Hacemos simple lo complejo",
  /**
   * The large statement over the two paragraphs.
   *
   * It was `heroContent.supporting` — a field on the hero, read by this band,
   * which is how it stayed unnoticed that what it said was "el mercado se
   * mueve… las organizaciones se quedan atrás": an appeal to the fear of
   * being late, in the section about who Novit is. It belongs to this band, so
   * it lives here now, and it says the purpose and the mission of cap. 03 plus
   * the two differentials of cap. 05 that a corporate page can state as fact.
   */
  statement:
    "Optimizamos procesos de negocio desarrollando software de calidad. Entendemos el proceso antes de escribir código, y la propiedad intelectual es del cliente desde el momento cero.",
  paragraphs: [
    "Novit nació en 2015 como un emprendimiento entre hermanos con una idea simple: aportar desde la ingeniería de software para que las organizaciones trabajen mejor. Hoy somos un equipo de unos treinta profesionales con proyectos activos en Argentina, Chile, España, México y Estados Unidos, y conservamos la agilidad de aquella estructura inicial: los socios siguen involucrados en las decisiones que importan.",
    "Desarrollamos software a medida para organizaciones que necesitan digitalizar procesos críticos de negocio. Trabajamos el ciclo completo —discovery, experiencia, arquitectura, desarrollo, calidad y soporte— o nos integramos a los equipos existentes. La propiedad intelectual es del cliente desde el momento cero, y el conocimiento se transfiere.",
  ],
  cta: { label: "Conocer al equipo", href: "#equipo" },
  /** Every figure here is from cap. 01 of brand-core, which is the only place
   *  a number may come from. No client count: that chapter rules it out. */
  facts: [
    { label: "Fundación", value: "2015", icon: "calendar" },
    { label: "Equipo", value: "~30 profesionales", icon: "team" },
    { label: "Proyectos activos", value: "5 países", icon: "globe" },
  ],
} as const;

/**
 * Folded into the Nosotros section rather than standing alone. It was a full
 * band carrying one three-line paragraph and a list of five countries, and it
 * is making the same argument Nosotros makes — who we are, and that the
 * measure is how long clients stay. Two thin sections saying one thing is one
 * section.
 */
export const partnersContent = {
  eyebrow: "Relaciones",
  title: "La credibilidad está en quedarse",
  // The country list lived here too, so the section named the same eight
  // markets three times over: once in prose, once in `activeMarkets`, once
  // in the note. The paragraph makes the argument; the set does the naming.
  description:
    "No publicamos un recuento de clientes. Lo que importa es la duración de las relaciones: entrar por un discovery o una prueba acotada y crecer con resultados.",
  activeMarkets: [
    "Argentina",
    "Chile",
    "España",
    "México",
    "Estados Unidos",
  ],
  historicalNote: "También hemos trabajado en Colombia, Perú y Brasil.",
} as const;

/* 06 · Equipo. */

export const teamContent = {
  index: "06",
  eyebrow: "Equipo",
  title: "Personas que se quedan en el proyecto",
  description:
    "Somos cerca de treinta profesionales y la rotación está por debajo de la media de la industria, así que el cliente habla con las mismas personas a lo largo del tiempo: los fundadores participan de las cuentas críticas y los líderes actúan como mentores, no solo como asignadores de tareas.",
  careersCta: { label: "Conocer la Academia", href: "#academia" },
  founders: [
    {
      name: "Leandro A. Vazquez",
      role: "Co-founder & CEO",
    },
    {
      name: "Rodrigo H. Vazquez",
      role: "Co-founder, CTO & COO",
    },
  ],
  /** The four values of brand-core cap. 04, each stated by the behaviour that
   *  makes it observable rather than by the word on its own. */
  values: [
    {
      icon: "check",
      title: "Confianza",
      text: "Cumplimos lo acordado en tiempo, alcance y presupuesto. Ningún problema se comunica sin una propuesta de resolución.",
    },
    {
      icon: "shield",
      title: "Excelencia",
      text: "Usamos IA para acelerar el desarrollo, nunca para reemplazar el criterio de ingeniería ni la revisión humana.",
    },
    {
      icon: "link",
      title: "Flexibilidad",
      text: "Nos adaptamos al proceso del cliente. La estructura permite reasignar sin tres capas de aprobación.",
    },
    {
      icon: "academy",
      title: "Compañerismo y aprendizaje",
      text: "El conocimiento se comparte: adentro con la Academia, afuera transfiriéndolo al cliente.",
    },
  ],
} as const;

/**
 * 07 · Contacto.
 *
 * The form does not send. A phone number and an inbox address are now
 * published in the header and footer (see `siteContact`), but neither is a
 * form endpoint — wiring the submit means a real destination for what people
 * type, and a form that silently drops it is worse than one that says it
 * isn't connected yet. `ContactSection.tsx` carries the TODO and the field
 * validation is real, so connecting it is one function.
 */
export const contactContent = {
  index: "07",
  eyebrow: "Contacto",
  title: "Contanos qué proceso querés resolver",
  description:
    "Entramos por un discovery o una prueba acotada: una conversación corta para entender cómo trabajás hoy, y una propuesta con alcance, plazo y dueño.",
  fields: {
    name: { label: "Nombre", placeholder: "Cómo te llamás" },
    email: { label: "Email", placeholder: "nombre@empresa.com" },
    message: {
      label: "Mensaje",
      placeholder: "Qué proceso querés resolver, y con qué se sostiene hoy.",
    },
  },
  submit: "Enviar mensaje",
  /** Shown after a valid submit, since nothing is actually delivered. */
  pending:
    "Este formulario todavía no está conectado, así que el mensaje no se envió. Estamos terminando de configurar la dirección de contacto.",
  errors: {
    name: "Escribí tu nombre.",
    email: "Escribí un email válido.",
    message: "Contanos brevemente qué necesitás.",
  },
} as const;
