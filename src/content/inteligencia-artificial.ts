import { exploreColumn, footerMission, type FooterContent } from "@/content/footer";
import { siteContact } from "@/content/site";

/**
 * `/inteligencia-artificial` — four blocks, in render order: `partner`,
 * `architecture`, `cases`, `evolution`. The opener's `title`, `lead` and `cta`
 * sit at the top level, and the cards under `cases` come from `casesContent`
 * in `@/content/cases`, which two other routes render too.
 *
 * Source is the brochure at
 * `docs/novit/brochures/transformacion-ia-brochure.md`, without its risk band
 * ("¿por qué no contratar proveedores individuales?") or its workshop closer.
 * The standing site's AI copy — WhatsApp bots, cobranzas, campañas de
 * recontacto — is not here either; it addresses a different buyer.
 *
 * `evolution` is the only numbered block: it is the only sequence.
 */
export const servicesPageContent = {
  meta: {
    title: "Inteligencia Artificial y Software Agéntico — Novit Software",
    description:
      "Estrategia, infraestructura y agentes de IA sobre una arquitectura reutilizable en la red privada de tu empresa.",
  },
  eyebrow: "Servicios",
  title: "Inteligencia Artificial y Software Agéntico",
  lead: "Te acompañamos a definir la estrategia, montar la infraestructura, construir los agentes de inteligencia artificial y a sostenerlos en el tiempo. Sobre una arquitectura reutilizable en la red privada de tu empresa.",
  /* WhatsApp, como `/academianovit` va al inbox de la Academia: cada página
     tiene el canal que corresponde a lo que se pregunta ahí. Decía "Contacto"
     y llevaba a `/#contacto`, el formulario del home: la única salida de esta
     página era hacia otra ruta. */
  cta: { label: "Consultanos", href: siteContact.phone.href },
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
      { label: "Agentes de proceso", icon: "agent" },
      { label: "Asistentes de consulta", icon: "chat" },
      { label: "Agentes por área", icon: "team" },
      { label: "Low-code del negocio", icon: "blocks" },
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
    platformLabel: "Arquitectura compartida · Red privada de tu empresa",
  },
  partner: {
    id: "nuestro-rol",
    eyebrow: "Nuestro rol",
    title: "Qué aporta un partner de transformación IA",
    lead: "Acompañamos a la dirección en cuatro decisiones que ningún proyecto aislado resuelve, con el mismo equipo disponible a lo largo del tiempo.",
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
          "El segundo agente arranca con la mitad del camino hecho, y el tercero sobre lo que dejó el segundo.",
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
   * The cards come from `casesContent`, shared with the home page; only the
   * heading and lead are this page's own.
   */
  cases: {
    id: "casos-en-produccion",
    eyebrow: "Casos de éxito",
    title: "Agentes que ya están trabajando",
    lead: "Dos agentes en producción, cada uno sobre un proceso concreto de una empresa distinta: qué resuelve y qué cambió al ponerlo a andar.",
  },
} as const;

/**
 * The figure beside the opener: an agent playing snake on its own, and the
 * audit of every move it makes — the page's claims about traceability and
 * governance, shown working rather than stated.
 *
 * The moves are named the way a policy names its actions, in English, as the
 * Academia's board names its parts; everything that frames them is Spanish.
 * `{n}` and `{move}` are filled in by `snake-motion.ts`.
 */
export const agentSnake = {
  title: "Agente autónomo",
  subtitle: "Simulación: juega solo, paso a paso.",
  description:
    "Simulación de un agente que juega a la víbora por su cuenta. En cada paso busca la ruta más corta al objetivo alrededor de su propio cuerpo y comprueba que, después de comer, todavía pueda llegar a su cola; si quedaría encerrado, sigue su cola hasta que se abra un camino seguro. En el tablero se dibuja la ruta que planea. Al lado, la auditoría de cada decisión: la confianza en cada movimiento, su razonamiento y un registro de eventos.",
  board: { label: "Entorno", game: "Partida" },
  /** How fast the game runs, against its normal pace. */
  speed: {
    label: "Velocidad",
    initial: 1,
    options: [
      { value: 0.5, label: "0,5×" },
      { value: 1, label: "1×" },
      { value: 2, label: "2×" },
    ],
  },
  audit: {
    label: "Auditoría",
    step: "Paso",
    blocked: "bloqueado",
    log: "Registro",
    captures: "Capturas",
    avoided: "Trampas evitadas",
  },
  moves: ["LEFT", "RIGHT", "UP", "DOWN"],
  /**
   * Its thinking: streamed before it moves, the way a model's reasoning
   * arrives, and in the first person, because it is the agent working it out
   * for itself. Every figure in it is one the planner found — `snake-sim.ts`
   * — so it never says anything it did not work out.
   *
   * Put together in `snake-copy.ts`: `{a}` and `{b}` are directions, `{n}` a
   * count of steps written out, `{m}` a bare number. Kept short enough that
   * a thought fits the audit's column in five lines.
   */
  thinking: {
    label: "Razonamiento",
    live: "Pensando",
    /* What it did, not how long it took: the planner answers in well under a
       millisecond, so a thinking time would be one the page made up. */
    done: { one: "Evaluó 1 opción", other: "Evaluó {n} opciones" },
    start: "Partida nueva: mido {n} celdas.",
    caught: ["Lo tengo.", "Uno más.", "Capturado."],
    resumed: "Mi cola dejó lugar.",
    steps: { one: "1 paso", other: "{n} pasos" },
    one: "Por {a} llego en {n}.",
    two: "Por {a} llego en {n}; por {b}, en {m}.",
    tie: "Por {a} o por {b}, llego en {n}.",
    exit: "Al comer, todavía tengo salida.",
    but: "Pero al comer me quedaría sin salida.",
    instead: "Por {b} son {m} y no me encierro: voy por ahí.",
    trap: "Un momento: al comer me quedaría sin salida.",
    /* The route it will follow, told as it will be walked: one or two legs
       in so many words, and a route that winds round the body as that. */
    legs: ["voy {n} a la izquierda", "voy {n} a la derecha", "subo {n}", "bajo {n}"],
    course: "{a} y {b}.",
    winding: "Salgo por {a} y rodeo mi cuerpo.",
    tail: "Sigo mi cola hasta que se abra un camino.",
    closed: "Mi cuerpo cierra todas las rutas.",
    space: "No veo ruta ni cola: busco lugar.",
    trapped: "No me queda salida.",
    end: { one: "Fin de la partida: 1 captura.", other: "Fin de la partida: {n} capturas." },
    directions: ["la izquierda", "la derecha", "arriba", "abajo"],
  },
  /** The log keeps what changed: a capture, a change of plan, a game. */
  events: {
    start: { label: "Partida {n}", detail: "empieza" },
    capture: { label: "Captura", one: "en 1 paso", other: "en {n} pasos" },
    avoid: { label: "Desvío", detail: "evita una trampa" },
    noroute: { label: "Desvío", detail: "sin ruta libre" },
    resume: { label: "Retoma", one: "ruta de 1 paso", other: "ruta de {n} pasos" },
    end: { label: "Fin", one: "1 captura", other: "{n} capturas" },
  },
  /** Novit's one remark on it, in its own voice. */
  note: "Cada decisión queda registrada: qué vio, qué eligió y por qué.",
} as const;

/**
 * The footer on `/inteligencia-artificial`, and it is about this page only.
 *
 * The site-wide footer indexes the home page — Nosotros, Equipo, Contacto,
 * Casos, Seguridad — and links out to `/academianovit`. Rendered here it made
 * the bottom of a services page a way out of it, and it sent anyone who wanted
 * to write to a form on another route. The one column is this page's own four
 * bands, and the chip is the WhatsApp line: the same shape `/academianovit`
 * has with its inbox.
 */
export const servicesFooterContent: FooterContent = {
  mission: footerMission,
  columns: [
    {
      title: "En esta página",
      links: [
        { label: servicesPageContent.partner.eyebrow, href: "#nuestro-rol" },
        {
          label: servicesPageContent.architecture.eyebrow,
          href: "#infraestructura",
        },
        {
          label: servicesPageContent.cases.eyebrow,
          href: "#casos-en-produccion",
        },
        { label: servicesPageContent.evolution.eyebrow, href: "#evolucion" },
      ],
    },
    exploreColumn("/inteligencia-artificial"),
  ],
  legal: [],
  social: siteContact.social,
  /* WhatsApp primero, que es adonde va el chip, y el inbox comercial abajo
     como alternativa. */
  channels: [
    {
      id: "whatsapp",
      label: siteContact.phone.label,
      href: siteContact.phone.href,
    },
    {
      id: "email",
      label: siteContact.email.label,
      href: siteContact.email.href,
    },
  ],
  contact: {
    value: "Consultanos",
    href: siteContact.phone.href,
  },
};
