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

export const metadataContent = {
  title: "Novit Software — Partners de transformación IA",
  description:
    "Desarrollamos software a medida y agentes de IA integrados que entienden el negocio. Desde 2015, hacemos simple lo complejo para organizaciones con procesos críticos.",
  /**
   * The link-preview card's own two lines. They were written into
   * `opengraph-image.tsx` as literals, which meant the card and the metadata
   * could drift — and did: the card still promised a headline the page had
   * stopped using. The headline is short because it is set at 64px over the
   * logo; `description` above is a sentence, which is the wrong shape there.
   */
  ogHeadline: "Partners de transformación IA",
  ogSupporting:
    "Software a medida y agentes integrados que entienden el negocio.",
} as const;

/**
 * One entry per section that exists, in page order, labelled with the name the
 * section actually carries. The old list had "Tecnologías" and "Historia"
 * pointing at Servicios and Nosotros — two labels promising pages that were
 * never built — and "Redes" pointing at `#contacto`, which until now was not
 * an anchor on this page at all.
 */
export const navigation = [
  /*
   * Root-relative, not bare fragments. The menu is mounted on every route, so
   * `#servicios` from /academianovit pointed at an anchor that is not in the
   * document and silently did nothing. `/#servicios` is a fragment
   * navigation on the home page and a real navigation from anywhere else.
   *
   * The Academia is the exception: it has a page of its own, so the menu goes
   * there rather than to the teaser band that introduces it.
   *
   * `id` is the section id on the home page and is what drives the menu's
   * active state — read it from here rather than slicing the href, which
   * stopped being the id the moment these gained a leading slash.
   */
  { id: "academia", label: "Academia Novit", href: "/academianovit" },
  { id: "servicios", label: "Servicios", href: "/inteligencia-artificial" },
  { id: "casos", label: "Casos de éxito", href: "/#casos" },
  { id: "seguridad", label: "Seguridad", href: "/#seguridad" },
  { id: "nosotros", label: "Nosotros", href: "/#nosotros" },
  { id: "equipo", label: "Equipo", href: "/#equipo" },
  { id: "contacto", label: "Contacto", href: "/#contacto" },
] as const;

export type NavItem = (typeof navigation)[number];

export const heroContent = {
  eyebrow: "Inteligencia artificial",
  title: "Partners de transformación IA",
  statement:
    "Te acompañamos a definir la estrategia, montar la infraestructura y construir los agentes de inteligencia artificial de tu empresa, y a sostenerlos en el tiempo.",
  supporting:
    "El mercado se mueve. Las organizaciones que siguen operando con planillas y sistemas desconectados se quedan atrás. Hacemos software a medida y agentes integrados que entienden tu proceso, se construyen con vos y quedan siendo tuyos.",
  primaryCta: { label: "Ver la Academia", href: "/academianovit" },
  secondaryCta: { label: "Ver servicios", href: "/inteligencia-artificial" },
  /** The brochure's three pillars, each with the mark that labels it. */
  pillars: [
    { label: "Estrategia tecnológica", icon: "strategy" },
    { label: "Plataforma de IA", icon: "layers" },
    { label: "Agentes en producción", icon: "agent" },
  ],
  /**
   * The Academia, announced above the headline — the first thing on the page,
   * because it is the first priority.
   *
   * This was a two-row block below the CTAs, one row for the Academia and one
   * for the AI practice. The second row restated the H1 and the lead almost
   * word for word, which is what made the whole block read as filler, and
   * being under the buttons put the priority item fourth in reading order. So
   * the services row is gone — the headline, the lead and both CTAs already
   * are the services — and the Academia moved to the top on its own.
   *
   * Every fact here is from the course document: no dates, no "inscripción
   * abierta", nothing that goes stale between editions.
   */
  announcement: {
    kicker: "Academia Novit",
    detail: "Diseño y construcción de software agéntico",
    meta: "32 h · online",
    href: "/academianovit",
  },
} as const;

/**
 * The three-card compression of the AI argument, in the order brand-core
 * cap. 05 says to tell it: the risk and the criterion first, the solution
 * second.
 *
 * `takeaway` is new and it is the reason these cards are readable now. Each
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
    id: "agentes-sueltos",
    kicker: "Riesgo",
    icon: "alert",
    illustration: "answers",
    title: "El costo de comprar agentes sueltos",
    takeaway: "Un abono por agente, para siempre",
    description:
      "Cada proveedor entrega su agente, cobra su abono y se va. Lo que queda es un rompecabezas que nadie gobierna.",
  },
  {
    id: "arquitectura",
    kicker: "Infraestructura",
    icon: "layers",
    illustration: "context",
    title: "Una arquitectura de IA compartida",
    takeaway: "Cada agente cuesta menos que el anterior",
    description:
      "Conocimiento indexado una sola vez, identidad única y una capa de integración: lo que se construye una vez no se vuelve a pagar.",
  },
  {
    id: "evolucion",
    kicker: "Método",
    icon: "target",
    illustration: "extraction",
    title: "Del primer agente a la estrategia",
    takeaway: "Se empieza por un proceso, no por un plan",
    description:
      "Un caso concreto, medible y con dueño dentro de la empresa. Sobre ese resultado se construye el resto.",
  },
] as const;

export type Highlight = (typeof highlights)[number];

export const aboutContent = {
  index: "05",
  eyebrow: "Quiénes somos",
  title: "Hacemos simple lo complejo",
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

export const servicesIntro = {
  index: "02",
  eyebrow: "Qué hacemos",
  title: "Capacidades que quedan instaladas",
  description:
    "La inteligencia artificial abre la conversación. Lo que la sostiene es un proceso de negocio resuelto, con software que la empresa puede operar y evolucionar.",
  /* The band is the compressed argument; the page is the argument. It used
     to send the reader to the enquiry four bands below, which the header
     reaches in one click anyway. */
  cta: { label: "Ver los servicios en detalle", href: "/inteligencia-artificial" },
} as const;

/**
 * The offer, as brand-core cap. 08 draws it: three lines, and the AI line
 * first because it is the one the market asks about. `meta` is the one-phrase
 * answer to "what is this" — a card is scanned before it is read, and these
 * five used to be indistinguishable at a glance because every one of them
 * opened with a paragraph.
 *
 * UX/UI and QA are deliberately absent. Cap. 08 settled that they are method
 * rather than service lines and are not promoted — see `servicesPageContent`'s
 * `method` block, which is where they are named instead.
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
    meta: "La puerta de entrada",
    description:
      "Una sesión para que los líderes prioricen casos reales y construyan un plan de acción, sin comprar piezas sueltas.",
  },
  {
    id: "custom-software",
    variant: "default" as const,
    icon: "code",
    title: "Software a medida",
    meta: "Discovery, desarrollo e integraciones",
    description:
      "Para procesos que hoy se sostienen con planillas y sistemas desconectados. Entregamos software terminado.",
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


/**
 * Everything on `/inteligencia-artificial`, the page written for a company
 * that is being sold agents.
 *
 * ## Where this comes from
 *
 * The 2026 brochure, transcribed at
 * `docs/novit/marketing/transformacion-ia-brochure.md`: its five chapters are
 * the risk, the partner's role, the shared architecture, the cases and the
 * path from a first agent to a corporate strategy. The home page already
 * carries a compressed reading of it — three `highlights` and five
 * `services` — and this is the argument at full length.
 *
 * The standing site at novitsoftware.com also has a page per discipline, and
 * its own AI page pitches WhatsApp bots, collections and re-contact
 * campaigns. That copy is not here on purpose: it addresses a small business
 * buying a chatbot, and every other word on this site addresses a company
 * treating AI as infrastructure. Two positionings on one site is neither. The
 * six disciplines themselves are real and they are in `capabilities` below.
 *
 * ## Why the numbers are where they are
 *
 * `evolution` is the only numbered thing on the page, because it is the only
 * sequence: the infrastructure has to exist before the second agent is
 * cheaper than the first. The six risks are not ranked, the four decisions
 * are held at once, and the six capabilities are a set.
 */
export const servicesPageContent = {
  meta: {
    title: "Servicios de IA para empresas — Novit Software",
    description:
      "Estrategia, infraestructura y agentes de IA sobre una arquitectura compartida en tu red privada. Cada agente nuevo cuesta menos que el anterior.",
  },
  eyebrow: "Servicios",
  /** Requested verbatim — echoes the home hero's own claim on the page a
   *  reader lands on for the detail behind it. */
  title: "Partnership de Transformación IA",
  lead: "Te acompañamos a definir la estrategia, montar la infraestructura y construir los agentes de inteligencia artificial de tu empresa, y a sostenerlos en el tiempo. Sobre una arquitectura compartida, en tu red privada: lo que se construye una vez no se vuelve a pagar.",
  cta: { label: "Solicitar cotización", href: "/#contacto" },
  /**
   * Slide 03 of the brochure, rebuilt as a band of its own.
   *
   * It used to be a figure hanging off the bottom of the opener, where it
   * read as an unexplained strip: a label, four floating pills, and then a
   * white box with four more titles in it, with nothing saying what the two
   * halves had to do with each other. The brochure draws the same thing as a
   * diagram with a heading over it, in third position — after the risk and
   * after our role, which is the order the argument needs.
   *
   * The three parts are the diagram: who the agents are, the line that says
   * they all draw on the same services, and the platform itself as one solid
   * block. `platformLabel` is what the block is; the four `shared` entries are
   * what is inside it.
   */
  architecture: {
    id: "infraestructura",
    eyebrow: "Infraestructura",
    title: "Una arquitectura de IA compartida",
    lead: "Un RAG corporativo centralizado, una identidad única y una capa de integración común: cada agente nuevo se apoya en lo ya construido y cuesta menos que el anterior.",
    agentsLabel: "Agentes de la empresa",
    agents: [
      "Agentes de proceso",
      "Asistentes de consulta",
      "Agentes por área",
      "Low-code del negocio",
    ],
    sharedLabel: "Todos consumen los mismos servicios",
    shared: [
      {
        icon: "database",
        title: "RAG corporativo",
        detail: "El conocimiento de la empresa, indexado una sola vez.",
      },
      {
        icon: "key",
        title: "Identidad y SSO",
        detail: "Permisos y trazabilidad por usuario en cada consulta.",
      },
      {
        icon: "link",
        title: "Capa de integración",
        detail: "Un único punto de acceso a los sistemas core.",
      },
      {
        icon: "spark",
        title: "Modelos",
        detail:
          "Razonamiento, embeddings y OCR intercambiables sin rehacer nada.",
      },
    ],
    platformLabel: "Arquitectura compartida · Red privada del cliente",
  },
  risk: {
    id: "riesgo",
    eyebrow: "Riesgos",
    /*
     * A question, not a statement of consequence.
     *
     * This read "Lo que queda cuando cada proveedor se va", which is a fine
     * sentence and a poor heading: it describes the aftermath of a decision
     * the reader has not been asked to make yet, so the six items under it
     * had nothing to be answers to. The question is the one a director is
     * actually holding while three vendors pitch them, and every item below
     * is a reason.
     */
    title: "¿Por qué no contratar proveedores individuales?",
    lead: "Seis agentes comprados a seis proveedores no son una estrategia de inteligencia artificial: son seis contratos, seis stacks y ningún dueño. Esto es lo que aparece a los dos años.",
    /**
     * `title` is the subject, `negative` is what goes wrong with it, and the
     * band sets the second half in the alert red. The brochure does the same
     * thing on the same six items, and it is the only place on the site where
     * a colour means "bad" rather than "whose voice is this".
     *
     * Splitting the heading in the content rather than marking it up in the
     * component is what keeps the two halves editable together: whoever
     * rewrites "Datos sensibles" also sees which words are the damage.
     */
    items: [
      {
        icon: "coin",
        title: "Abonos",
        negative: "que se acumulan",
        description:
          "Un fee mensual por cada agente, para siempre, y ninguno abarata al siguiente.",
      },
      {
        icon: "layers",
        title: "Un stack distinto",
        negative: "por cada proveedor",
        description:
          "Tecnologías, modelos y nubes que no hablan entre sí y que alguien va a tener que integrar.",
      },
      {
        icon: "lock",
        title: "Datos sensibles",
        negative: "fuera de control",
        description:
          "Información corporativa procesada en plataformas de terceros, sin saber dónde queda ni con qué se entrena.",
      },
      {
        icon: "eye",
        title: "Compliance",
        negative: "sin respaldo",
        description:
          "Sin registro de qué consultó cada agente ni quién lo autorizó, una auditoría no tiene qué mirar.",
      },
      {
        icon: "database",
        title: "Nada",
        negative: "se capitaliza",
        description:
          "Cada piloto empieza de cero: el conocimiento y los componentes no quedan como activo de la empresa.",
      },
      {
        icon: "alert",
        title: "Dependencia",
        negative: "del proveedor",
        description:
          "Si se va, se va el agente: sin código, sin documentación y sin nadie que lo mantenga.",
      },
    ],
  },
  partner: {
    id: "nuestro-rol",
    eyebrow: "Nuestro rol",
    title: "Qué aporta un partner de transformación IA",
    lead: "Acompañamos a la dirección con un equipo experto disponible de forma continua, en las cuatro decisiones que sobreviven a cualquier agente puntual.",
    /**
     * Four decisions held at once, not four steps — so nothing is numbered.
     *
     * `label` is the area and `title` is the decision, in that order and at
     * those weights. They used to be the other way round: "Stack" was set as
     * the heading and "Qué construir y sobre qué base" as a small label under
     * it, which put a one-word category where the reader looks for the point
     * and buried the actual question. The brochure sets these four the way
     * they are set here.
     */
    items: [
      {
        icon: "strategy",
        label: "Stack",
        title: "Qué construir y sobre qué base",
        description:
          "Modelos, nube y frameworks elegidos por costo, dependencia y vida útil, con componentes que se reutilizan en vez de rehacerse.",
      },
      {
        icon: "metric",
        label: "Medición",
        title: "Cómo saber si funciona",
        description:
          "KPI de precisión, adopción, horas liberadas y costo por operación, definidos antes de desarrollar y monitoreados en producción.",
      },
      {
        icon: "shield",
        label: "Seguridad",
        title: "Qué datos salen de la empresa",
        description:
          "Procesamiento en red privada, identidad corporativa, trazabilidad de cada consulta y cumplimiento de GDPR.",
      },
      {
        icon: "clipboardCheck",
        label: "Proveedores",
        title: "Qué exigirle a terceros",
        description:
          "Evaluación técnica de software y componentes de IA de terceros: integraciones, propiedad del dato y condiciones contractuales.",
      },
    ],
  },
  evolution: {
    id: "evolucion",
    eyebrow: "Evolución",
    title: "Del primer agente a la estrategia corporativa",
    /* "Estas empresas", and the band sits directly under the four of them.
       It read "las empresas de acá abajo" while Evolución came *before*
       Casos, so the sentence pointed at a band that was not there yet. The
       order is the brochure's now — riesgo, rol, infraestructura, casos,
       evolución — and the pronoun has something to refer to. */
    lead: "Ninguna de estas empresas arrancó con un plan de IA. Arrancó con un caso puntual, y sobre eso se construyó todo lo demás.",
    /** The one genuinely numbered thing on the page: the infrastructure has to
     *  exist before the second agent is cheaper than the first. `leaves` is
     *  what the step installs, which is the whole argument of the band. */
    steps: [
      {
        icon: "target",
        title: "Un primer agente que funciona",
        leaves: "Un resultado medible",
        description:
          "Un proceso concreto, medible y con dueño dentro de la empresa. Sirve para aprender y para convencer.",
      },
      {
        icon: "layers",
        title: "La infraestructura queda instalada",
        leaves: "RAG, identidad y capa de integración",
        description:
          "El segundo agente arranca con la mitad del camino hecho, y el tercero sobre lo mismo.",
      },
      {
        icon: "shield",
        title: "Gobierno, seguridad y métricas",
        leaves: "Reglas que valen para todos",
        description:
          "Datos en red privada, trazabilidad por usuario y KPI que valen para todos los agentes, no para uno solo.",
      },
      {
        icon: "clipboardCheck",
        title: "Estándares para todo lo que sigue",
        leaves: "Criterio para comprar y para integrar",
        description:
          "Las apps y los proveedores externos se conectan bajo las reglas que definimos junto a la empresa.",
      },
    ],
  },
  /*
   * The same four clients as the home page, asked a different question. The
   * home band asks who trusts Novit, so the logo is the masthead and the
   * result is the card's last line; this band has to prove the one above it,
   * so the result is the biggest type in the row and the logo is a credential
   * beside it. `title` and `lead` therefore say what the home band cannot:
   * what the first agent left behind, and how it got chosen.
   */
  cases: {
    id: "casos-en-produccion",
    eyebrow: "Casos de éxito",
    title: "Agentes que ya están trabajando",
    lead: "Ninguna de las cuatro empezó por el caso más vistoso. Empezó por el que tenía a alguien de la empresa perdiendo horas, y por el que se podía medir.",
  },
  /**
   * The offer, exactly as brand-core cap. 08 draws the tree.
   *
   * ## What was wrong here
   *
   * This band used to list six "capacidades" as peers, and three of them were
   * not ours to promote. Cap. 08 closes the question on 13/08/2026: *"UX/UI y
   * QA/testing dejan de ser líneas de servicio y pasan a ser método. No se
   * promocionan; se prestan si un lead los pide."* The reasoning is in the
   * same chapter and it is a positioning argument, not a tidiness one —
   * selling UX by the deliverable puts Novit against design studios on price,
   * and selling QA by the deliverable puts it against outsourced test shops,
   * which is the by-the-hour ground the whole strategy exists to leave. Both
   * had a card here anyway, so the page argued against its own positioning
   * two bands after making it.
   *
   * "Data science" was worse: it is not in the offer tree at all, and no
   * source document mentions it. It is gone rather than demoted.
   *
   * So `lines` is the tree's three branches, and `method` is the row below the
   * rule in that same diagram — the things that are part of how we build
   * rather than things to buy. Saying them that way is the stronger claim:
   * *entregamos software que funciona y que la gente usa.*
   */
  capabilities: {
    id: "capacidades",
    eyebrow: "La oferta",
    title: "Tres líneas, y un método que no se cobra aparte",
    lead: "La inteligencia artificial es la línea que ordena a las otras dos. Lo que no aparece acá como servicio aparece más abajo como método: es parte de cómo construimos, no un extra.",
    lines: [
      {
        id: "ia",
        variant: "featured" as const,
        icon: "spark",
        title: "Inteligencia artificial",
        meta: "La línea que ordena a las demás",
        description:
          "Agentes y automatizaciones sobre procesos concretos, integrados a los sistemas que la empresa ya usa, sobre la arquitectura compartida de más arriba.",
        items: [
          "Partner de transformación IA — estrategia, arquitectura y gobierno",
          "Agentes de IA integrados en producción",
          "Workshop de IA aplicada — la puerta de entrada",
        ],
      },
      {
        id: "software",
        variant: "default" as const,
        icon: "code",
        title: "Desarrollo de software a medida",
        meta: "El sistema donde el agente se apoya",
        description:
          "La mayoría de los procesos que automatizamos se sostenían con planillas y sistemas desconectados.",
        items: [
          "Discovery y definición",
          "Desarrollo e integraciones",
          "Soporte y evolución",
        ],
      },
      {
        id: "celulas",
        variant: "default" as const,
        icon: "team",
        title: "Células ágiles y staff augmentation",
        meta: "Cuando el cuello de botella es de capacidad",
        description:
          "Nos sumamos al equipo que ya existe, con la misma ingeniería y la misma continuidad de personas.",
        items: [
          "Equipos que se integran al proceso del cliente",
          "Escalar y reasignar sin tres capas de aprobación",
        ],
      },
    ],
    method: {
      title: "Parte del método, no una línea de servicio",
      lead: "No se promocionan y no se cobran como entregable aparte. Si un lead los pide, se toman.",
      items: [
        {
          icon: "check",
          title: "Experiencia de usuario",
          description:
            "La interfaz por la que alguien va a usar el sistema todos los días. Si no se entiende no se adopta.",
        },
        {
          icon: "shield",
          title: "QA y testing",
          description:
            "Un equipo que encuentra lo que quien escribió el código ya no ve. En un sistema agéntico, lo que prueba que no se pueda torcer.",
        },
        {
          icon: "spark",
          title: "IA en el proceso de desarrollo",
          description:
            "Producimos más rápido y con mejor cobertura. El criterio de ingeniería y la revisión humana no se delegan.",
        },
        {
          icon: "key",
          title: "Propiedad intelectual del cliente",
          description:
            "Desde el momento cero. Cada empresa queda dueña de su solución, de su código y del conocimiento para sostenerlo.",
        },
      ],
    },
  },
  start: {
    id: "empezar",
    eyebrow: "Empezar",
    title: "El primer caso, con dueño y con fecha",
    lead: "La puerta de entrada es un workshop de IA aplicada: una sesión de trabajo con los líderes del negocio para poner sobre la mesa los procesos que duelen y ordenarlos por impacto y esfuerzo.",
    /* What comes out of the session, which is the part a director is
       actually being asked to say yes to. */
    cta: { label: "Pedir el workshop", href: "/#contacto" },
    commitment:
      "Sale un plan con un primer caso elegido, su métrica y quién lo va a usar adentro de la empresa. Sin comprar una sola licencia para llegar hasta ahí.",
  },
} as const;

export const safetyContent = {
  index: "04",
  eyebrow: "Confianza",
  title: "Criterio, seguridad y gobierno",
  statement:
    "Construir un agente se está volviendo commodity. Lo que no se commoditiza es el criterio que evita seis stacks que no se hablan y ningún activo propio.",
  description:
    "Tratamos la inteligencia artificial como infraestructura de la empresa: datos en red privada, identidad corporativa, trazabilidad de cada consulta y cumplimiento normativo. La solución queda documentada y es tuya desde el día uno.",
  cta: { label: "Leer el enfoque de gobierno", href: "/inteligencia-artificial" },
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
        "Diseñamos para GDPR y para las reglas de la organización. El gobierno no es un anexo: es parte de la arquitectura.",
    },
    {
      icon: "check",
      title: "Propiedad del cliente",
      description:
        "Código, conocimiento y componentes quedan como activo de la empresa. Si se va un proveedor, no se va la capacidad.",
    },
  ],
} as const;

export const teamContent = {
  index: "06",
  eyebrow: "Equipo",
  title: "Personas que se quedan en el proyecto",
  description:
    "Somos cerca de treinta profesionales. El cliente habla con las mismas personas a lo largo del tiempo: los fundadores participan de las cuentas críticas y los líderes actúan como mentores, no solo como asignadores de tareas.",
  careersCta: { label: "Ver la Academia", href: "/academianovit" },
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

export const academyContent = {
  id: "academia",
  index: "01",
  eyebrow: "Academia Novit",
  title: "Se enseña a construir software agéntico",
  description:
    "Formamos al equipo —y a quienes se suman— en las tecnologías que el mercado demanda, hoy incluida la IA aplicada al desarrollo. Varias ediciones son abiertas y gratuitas.",
  cta: { label: "Ver la Academia", href: "/academianovit" },
} as const;

/**
 * The programme, in full, and the single source for it.
 *
 * It was cut down to four fields when the home page was the only thing
 * reading it — the syllabus was 3,000px of the band whose job is to
 * *introduce* the Academia. The note left behind said the removed fields were
 * recoverable from this file's git history. They were not: this file has
 * never been committed, so the history did not exist. They are restored here
 * from the course document.
 *
 * Nothing reads all of it twice. `AcademySection` on the home page takes the
 * definition, the entry level and the load; `/academianovit` takes everything.
 * That split is the reason this is one object rather than two copies that
 * drift.
 *
 * The definition is quoted rather than paraphrased because the course turns on
 * it: an agent is the entity, agentic software is the paradigm that coordinates
 * them, and mixing the two is the confusion the first class exists to clear up.
 *
 * Still no calendar. The edition dates, class times and delivery deadlines all
 * belong to one cohort and would be wrong the moment it closes.
 */
export const academyProgram = {
  objective:
    "Capacitar a los participantes en el diseño y la construcción de sistemas agénticos de software: entender la arquitectura interna de un agente de IA, sus componentes y sus patrones de orquestación, y adquirir criterio para elegir proveedor de modelo, estrategia de recuperación de información, modo de ejecución y nivel de autonomía en función del problema, el costo, el tiempo de respuesta y el riesgo.",
  definition:
    "Un agente de IA es una entidad de software autónoma que cumple objetivos específicos. El software agéntico es el paradigma más amplio que diseña y coordina sistemas donde operan uno o varios agentes.",
  /** The one line that stops the wrong person enrolling. */
  entryLevel:
    "No es una academia de nivel inicial. Se dan por sentados los conocimientos fundamentales de desarrollo de software, el consumo de APIs REST y nociones de bases de datos relacionales.",
  requirements: {
    note: "No es una academia de nivel inicial. Se dan por sentados los conocimientos fundamentales de desarrollo de software y de consumo de APIs.",
    items: [
      "Manejo de un lenguaje de programación orientado a objetos",
      "Conocimiento de Git, Web API y protocolo HTTP",
      "Consumo de APIs REST y manejo de credenciales",
      "Nociones de bases de datos relacionales",
    ],
  },
  format: {
    facts: [
      { label: "Carga total", value: "32 horas", icon: "clock" },
      { label: "Clases", value: "14 teórico-prácticas", icon: "academy" },
      { label: "Talleres de consulta", value: "2", icon: "team" },
      { label: "Modalidad", value: "100% online", icon: "globe" },
    ],
    /**
     * The five blocks, in the order they are taught. Titles only.
     *
     * They carried the full syllabus — four or five topics under each block —
     * and a per-block class count. Both are out on purpose: naming what is
     * covered in each class is a commitment to teach exactly that, an edition
     * ahead of time, and the objective at the top of the page already says
     * what the course is for. The blocks say how it is organised, which is as
     * much as a page can promise.
     */
    modules: [
      { title: "Fundamentos", icon: "agent" },
      { title: "Contexto y conocimiento", icon: "database" },
      { title: "Arquitectura y orquestación", icon: "link" },
      { title: "Modelos, costos y ejecución", icon: "coin" },
      { title: "Producción, seguridad y observabilidad", icon: "shield" },
    ],
  },
  evaluation: {
    description:
      "Trabajo práctico integrador con entregas parciales obligatorias, corrección por aprobado o desaprobado y devolución personalizada.",
    criteria: [
      {
        title: "Que funcione",
        icon: "check",
        detail: "El sistema resuelve el problema planteado.",
      },
      {
        title: "Que sea eficiente",
        icon: "metric",
        detail:
          "El agente usa los modelos con criterio: costo y tiempo de respuesta.",
      },
      {
        title: "Que no se pueda torcer",
        icon: "lock",
        detail:
          "El sistema no puede reutilizarse fácilmente de una forma distinta a la esperada.",
      },
    ],
  },
  /**
   * The edition, with its dates.
   *
   * These were deliberately left out once, on the reasoning that a calendar
   * goes stale the moment a cohort closes. That was the wrong call for a
   * course whose edition is open: a reader deciding whether to apply needs to
   * know when it runs and whether they can make the timeslot, and "32 horas"
   * does not answer either. It is one object, so retiring an edition is
   * editing one place.
   */
  edition: {
    label: "Edición 2026",
    facts: [
      { label: "Cursada", value: "13/10/2026 → 04/12/2026", icon: "calendar" },
      { label: "Días", value: "Martes y viernes", icon: "calendar" },
      { label: "Horario", value: "16 a 18 h (ART)", icon: "clock" },
    ],
  },
} as const;

/**
 * Everything on `/academianovit` that is not the programme itself.
 *
 * The programme lives in `academyProgram`; this is the page's own
 * scaffolding — its metadata, the words that open it, the six section
 * headings, and the registration form. Nothing is repeated from it: the page
 * reads both.
 */
export const academyPageContent = {
  meta: {
    title: "Academia Novit — Diseño y construcción de software agéntico",
    description:
      "Cursada de 32 horas sobre diseño y construcción de sistemas agénticos. No es de nivel inicial.",
  },
  eyebrow: "Academia Novit",
  title: "Diseño y construcción de software agéntico",
  lead: "Una cursada de 32 horas sobre cómo se diseña, se construye y se sostiene un sistema agéntico: arquitectura, orquestación, contexto, costos, seguridad y observabilidad.",
  /* Not "Inscribirse": the band it points at has no form in it until the
     22nd, and a button that says one thing and lands on another is the one
     kind of dishonesty a page like this cannot afford. */
  cta: { label: "Cuándo abre la inscripción", href: "#inscripcion" },
  /** One heading per band, in reading order. No indices — see `AcademyPage`. */
  sections: {
    about: {
      id: "que-es",
      eyebrow: "Qué es",
      title: "Un agente, y el paradigma que coordina varios",
    },
    audience: {
      id: "a-quien",
      eyebrow: "A quién está dirigida",
      title: "No es una academia de nivel inicial",
      /*
       * Not `academyProgram.requirements.note`, which opens with this
       * section's own statement — set one under the other and the band
       * said "No es una academia de nivel inicial" twice, at two sizes,
       * in the space of one line. This carries the half of that note the
       * heading does not, and says what the four conditions are for.
       */
      lead: "Se dan por sentados los conocimientos fundamentales de desarrollo de software y el consumo de APIs. Estos cuatro son el punto de partida de la primera clase, no algo que se vea durante la cursada.",
      /** The heading above the four requirements, once they are a checklist. */
      checklist: "Se dan por sentados",
    },
    schedule: {
      id: "cursada",
      eyebrow: "Cursada",
      title: "Cinco bloques, en este orden",
      lead: "Teoría y práctica en la misma clase, más dos talleres de consulta para las entregas. Todo online.",
    },
    evaluation: {
      id: "evaluacion",
      eyebrow: "Evaluación",
      title: "Un trabajo integrador, corregido con tres preguntas",
    },
    /**
     * No form.
     *
     * There was one — four fields and a submit button — and it had no
     * endpoint, so a postulación went nowhere and the page said so in small
     * print under the button. For a course with a fixed opening date that is
     * the wrong trade: the thing a reader needs is the date and where the
     * announcement will appear, and both of those are one sentence. The
     * channels below are the ones that actually work today.
     */
    registration: {
      id: "inscripcion",
      eyebrow: "Inscripción",
      title: "Las inscripciones abren el 22 de septiembre",
      lead: "Todavía no está abierta la postulación. Cuando abra, se anuncia en esta misma página y en el Instagram de Novit — ahí salen la fecha de cierre y el cupo de la edición.",
      /** Where the announcement lands, in the order someone should check. */
      channels: [
        {
          id: "pagina",
          label: "Esta página",
          detail: "El formulario aparece acá el 22 de septiembre.",
          icon: "document",
        },
        {
          id: "instagram",
          label: "Instagram",
          detail: "@novit.software — el anuncio sale el mismo día.",
          icon: "chat",
          href: "https://www.instagram.com/novit.software",
        },
      ],
      /** For someone who wants to ask now rather than wait. */
      aside: {
        text: "¿Consultas sobre la cursada antes de que abra?",
        cta: { label: "Escribinos", href: "mailto:info@novitsoftware.com" },
      },
    },
  },
} as const;

export const casesContent = {
  index: "03",
  eyebrow: "Casos de éxito",
  title: "Agentes que ya están trabajando",
  description:
    "Cada uno fue el primer agente de su empresa: un proceso concreto que hoy funciona y que abrió la puerta a todo lo que sigue.",
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
      id: "comex",
      icon: "document",
      area: "Documentación",
      title: "Lectura automática de documentación de comex",
      description:
        "Interpreta BL, facturas y certificados, incluso escaneados, y sólo señala lo que necesita criterio humano.",
      result: "Cerca de 40 importaciones por mes sin digitación",
      logo: {
        name: "Ascend Laboratories",
        src: "/logos/ascend-laboratories.png",
        width: 1397,
        height: 520,
        displayHeight: 44,
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
    {
      id: "ventas",
      icon: "chat",
      area: "Comercial",
      title: "Chats de venta gestionados con IA",
      description:
        "Centraliza las conversaciones de los vendedores y permite delegarlas a un asistente que no deja lead sin responder.",
      result: "Ninguna oportunidad sin atender",
      logo: {
        name: "twistic",
        src: "/logos/twistic.png",
        width: 402,
        height: 94,
        displayHeight: 30,
        invertOnLight: true,
      },
    },
  ],
} as const;

export type CaseStudy = (typeof casesContent.cases)[number];

/*
 * `clientsContent` and the "Confían en Novit" strip under the case grid are
 * gone. A separate row of logos was the right shape while the cases had to
 * stay anonymous — it said who the clients are without saying which system
 * belonged to whom. Now that every case names its own client the strip only
 * repeated the same four marks a screen apart, so the logos moved onto the
 * cards and the strip was deleted. The logo data lives on each case in
 * `casesContent` above.
 */

/**
 * The contact section.
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

export const footerContent = {
  tagline: "Hacemos simple lo complejo.",
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
        { label: "Academia Novit", href: "/academianovit" },
        { label: "Transformación IA", href: "/inteligencia-artificial" },
        { label: "Casos en producción", href: "/#casos" },
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
    label: "Contacto",
    value: "Solicitar cotización",
    href: "/#contacto",
  },
} as const;

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
