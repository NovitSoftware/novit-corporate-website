/* Everything on `/inteligencia-artificial`. */


/**
 * Everything on `/inteligencia-artificial`, the AI line described at length.
 *
 * ## Where this comes from
 *
 * The 2026 brochure, transcribed at
 * `docs/novit/marketing/transformacion-ia-brochure.md`: its five chapters are
 * the risk, the partner's role, the shared architecture, the cases and the
 * path from a first agent to a corporate strategy. The home page already
 * carries a compressed reading of it — three `highlights` and five
 * `services` — and this is the same material at full length.
 *
 * ## Two of the brochure's bands are not here
 *
 * `risk` was six cards — abonos que se acumulan, un stack por proveedor,
 * dependencia del proveedor — under the heading "¿Por qué no contratar
 * proveedores individuales?", with the damage set in the alert red. `start`
 * closed the page on "Pedir el workshop". Both are sales moves and they are
 * the right ones in the deck they came from, where the reader is mid-decision
 * with three proposals on the table. A corporate site is not that room: the
 * first argues against a competitor the reader may not have (cap. 07 — *negar
 * una acusación que nadie hizo la instala*), and the second turns a page that
 * describes a service into a funnel. What the risk band was protecting — that
 * loose agents leave nothing installed — survives as the positive claim it
 * always was, in `architecture` and `evolution`: what a shared architecture
 * leaves behind.
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
    title: "Inteligencia artificial — Novit Software",
    description:
      "Estrategia, infraestructura y agentes de IA sobre una arquitectura compartida en la red privada del cliente. Cada agente nuevo se apoya en lo ya construido.",
  },
  eyebrow: "Servicios",
  title: "Inteligencia artificial en Novit",
  lead: "Acompañamos a definir la estrategia, montar la infraestructura y construir los agentes de inteligencia artificial de una empresa, y a sostenerlos en el tiempo. Sobre una arquitectura compartida, en la red privada del cliente.",
  cta: { label: "Contacto", href: "/#contacto" },
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
  partner: {
    id: "nuestro-rol",
    eyebrow: "Nuestro rol",
    title: "Qué aporta un partner de transformación IA",
    lead: "Acompañamos a la dirección en las cuatro decisiones que sobreviven a cualquier agente puntual, con un equipo disponible de forma continua.",
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
    title: "Tres líneas y un método",
    lead: "La inteligencia artificial es la línea que ordena a las otras dos. Lo que no aparece acá como servicio aparece más abajo como método: es parte de cómo construimos.",
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
      /* This read "Parte del método, no una línea de servicio" over "No se
         promocionan y no se cobran como entregable aparte. Si un lead los
         pide, se toman." — a note from the inside of the sales conversation.
         A reader does not know what a line of service is here, and "si un
         lead los pide, se toman" tells them about our process rather than
         about what they get. Same fact, said to the person reading: these
         four come with the project. */
      title: "Lo que viene con todo proyecto",
      lead: "Experiencia de usuario, testing, IA en el desarrollo y la propiedad del código. No se cotizan aparte porque no son opcionales: son cómo construimos.",
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
} as const;
