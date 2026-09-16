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
 * Every link in this file is an anchor on its own page or a real channel
 * (WhatsApp, mail, Instagram, LinkedIn). Nothing here points at
 * `/inteligencia-artificial` or `/academianovit`: this page is about the
 * company, and those two are subjects it names rather than doors it opens.
 * The footer lists both routes, which is what keeps them reachable.
 */

/*
 * `closingContent` is gone with the cierre band it fed. Once the contact form
 * moved to the bottom of the page, that band's lead was almost word for word
 * `contactContent.description` one screen below it, and its buttons sent the
 * visitor back up to Servicios and Nosotros from directly above a form. The
 * contact section is the close now. See `layout/HomePage.tsx`.
 */
/* Sin `markAlt`: el `<Image>` del telón va con `alt=""` porque el nombre ya
   está en el `aria-label` del contenedor, así que ese campo no lo leía nadie. */
export const introContent = {
  label: "Novit Software",
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
  /* Sin `secondaryCta`. Decía "Ver los casos" y bajaba a #casos, una banda por
     la que el lector pasa scrolleando de todos modos. El footer la lista. */
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
    meta: "32 h · 14 clases",
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
/* En el orden que fija el cap. 05: 3 → 2, y la 1 "casi no se menciona". La
   fila abría con la dimensión 1, que el mismo capítulo define como "una
   ventaja de eficiencia, no un argumento de venta". */
export const highlights = [
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
    id: "ia-proceso",
    kicker: "Nuestro proceso",
    icon: "code",
    illustration: "answers",
    title: "IA en cómo trabajamos",
    takeaway: "Una herramienta más del desarrollo",
    description:
      "Baja el costo de escribir código y se acortan los plazos. Parte de esa ganancia se reinvierte en revisión, pruebas y arquitectura: el criterio de ingeniería no se delega.",
  },
] as const;

export type Highlight = (typeof highlights)[number];

/**
 * 01 · The Academia band, which is here as a fact about the company: Novit
 * teaches, where the industry default is to retain the know-how (cap. 04).
 *
 * Not a course page. The programme is on `/academianovit` and this file does
 * not read it; the band names the Academia, states its load and stops.
 */
export const academyContent = {
  id: "academia",
  index: "01",
  /* La fila del cap. 01 tal cual: "Programa de formación | Academia Novit".
     La banda nombra la Academia y describe la cursada; los títulos anteriores
     —"Acá se enseña", "Enseñamos a construir agentes de IA"— hablaban de
     Novit como si enseñar fuera su actividad. */
  eyebrow: "Programa de formación",
  title: "Academia Novit",
  /* El curso en dos líneas, con los módulos del temario. El detalle —objetivos,
     requisitos, contenidos, docentes— está en /academianovit. La frase "el
     conocimiento se comparte" salió de acá: es textual del cap. 04 y ya es una
     de las cuatro tarjetas de valores en la banda Equipo. */
  description:
    "Diseño y construcción de sistemas agénticos: la arquitectura interna de un agente, los patrones de orquestación y lo que hace falta para llevarlo a producción. Varias ediciones son abiertas y gratuitas.",
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
    /* Sin "100% online": la modalidad no está en el temario ni en ninguna
       otra fuente. Esto es lo que §Duración y modalidad dice. */
    text: "32 horas: 14 clases teórico-prácticas y 2 talleres de consulta.",
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
  /* La misión del cap. 03, textual, que es la respuesta del brand-core a "qué
     hacemos". Decía "Tres líneas de servicio": el término es del cap. 08, pero
     contar las líneas no le dice nada a quien todavía no las leyó. Las tres
     están enumeradas abajo. */
  title: "Optimizamos procesos de negocio",
  /* Cap. 02, §Qué hacemos, textual. Lo que decía antes era el índice de la
     banda: enumeraba las tres líneas y después las cinco tarjetas las volvían
     a nombrar una por una, y de paso contaba dos cosas distintas con el mismo
     número —tres líneas de servicio, tres dimensiones de IA— que abajo se ven
     como dos grillas seguidas. Acá va cómo se trabaja; qué se ofrece lo dicen
     las tarjetas. */
  description:
    "Trabajamos el ciclo completo —discovery, UX/UI, arquitectura, desarrollo, QA, soporte— o nos integramos a los equipos existentes del cliente.",
  /* No `cta`. It read "Ver la línea de IA" and went to
     `/inteligencia-artificial` — the one thing on this page that handed the
     reader off to a route. The band states what the company does; the AI line
     is one of the three, not the exit. The footer lists the route. */
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
    /* Sin cómo se ordenan los procesos en la sesión: el cap. 09 deja la
       metodología del workshop fuera del material externo. */
    description:
      "Sale un plan de acción con un primer caso concreto, medible y con dueño dentro de la empresa.",
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
  /* "Confianza" es el nombre de un valor del cap. 04, y ese valor ya es una de
     las cuatro tarjetas de Equipo. El footer llama a esta banda "Seguridad y
     gobierno" y el ancla es #seguridad: tres nombres para una sección. */
  eyebrow: "Seguridad y gobierno",
  /* Las dos cosas de las que hablan las cuatro tarjetas, nombradas: el código
     (cap. 05, diferencial 4) y los datos (brochure §02 y §03, procesamiento en
     la red privada del cliente). Decía "El cliente es dueño de su solución"
     —cap. 04— y el lector no tenía cómo saber de qué solución se hablaba. */
  title: "El código y los datos quedan en tu empresa",
  /* This read "Construir un agente se está volviendo commodity. Lo que no se
     commoditiza es el criterio que evita seis stacks que no se hablan y ningún
     activo propio." — the sales argument of the brochure, stated in a band
     whose subject is how client data is handled.

     Then it opened on "Tratamos la inteligencia artificial como
     infraestructura de la empresa", which made the whole band about agents on
     a page about the company. What it describes holds for every project; an
     agent is the case where it gets hardest. */
  /* Cap. 05, diferencial 4, dicho sobre algo concreto: de qué proyecto, y qué
     cosas son. "La propiedad intelectual es del cliente" a secas no le dice
     nada a quien todavía no contrató nada. La segunda frase es la
     infraestructura del brochure §03, que es lo que queda instalado cuando hay
     agentes de por medio. */
  statement:
    "De cada proyecto, el código, los componentes y la documentación quedan como activo de la empresa. Con agentes de IA de por medio, también el conocimiento indexado y la capa de integración sobre la que corren.",
  /* No `cta`. It read "Leer el enfoque de gobierno" and went to
     /inteligencia-artificial; with no route to send anyone to, a second
     "Solicitar cotización" two bands under the first one is chrome. The four
     pillars are the whole argument this band has to make. */
  /* Propiedad del cliente va primero. Es el único de los cuatro que un
     competidor no puede repetir sin cambiar su modelo de negocio (cap. 05), y
     el orden de las tarjetas sigue al de la bajada. */
  pillars: [
    {
      icon: "check",
      title: "Propiedad del cliente",
      description:
        "La propiedad intelectual es del cliente desde el momento cero, y el know-how se transfiere. Documentamos y entregamos para que la empresa pueda sostener el software con su propio equipo.",
    },
    {
      icon: "lock",
      title: "Datos en la red privada",
      description:
        "El procesamiento sucede en la red privada del cliente, y el conocimiento de la empresa se indexa una sola vez sobre su propia infraestructura. Sabemos qué información sale, dónde se procesa y con qué se entrena.",
    },
    {
      icon: "key",
      title: "Identidad y trazabilidad",
      description:
        "Identidad corporativa única, con permisos y trazabilidad por usuario en cada consulta. Queda registrado quién preguntó, qué se respondió y quién lo autorizó.",
    },
    {
      icon: "shield",
      title: "Cumplimiento",
      description:
        "Diseñamos para GDPR y para las reglas de la organización. Novit está encuadrada en la Ley de Economía del Conocimiento, y el mismo criterio se aplica al software de terceros que se integra: propiedad del dato y condiciones contractuales.",
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
  /* Sin la misión adelante: "Optimizamos procesos de negocio" es ahora el
     título de la banda 02, y el pie la enuncia completa. Quedan los dos
     diferenciales del cap. 05 que esta banda puede afirmar como hecho. */
  statement:
    "Entendemos el proceso antes de escribir código, y la propiedad intelectual es del cliente desde el momento cero.",
  /* El relato de origen del cap. 02, textual —"proyectos activos en cinco
     países", no la lista, que está dos bloques más abajo—. Había un segundo
     párrafo con el §Qué hacemos del mismo capítulo: lo dicen la cabecera y la
     banda 02, así que acá era la tercera vez. */
  paragraphs: [
    "Novit nació en 2015 como un emprendimiento entre hermanos con una idea simple: aportar desde la ingeniería de software para que las organizaciones trabajen mejor. Hoy somos un equipo de unos treinta profesionales con proyectos activos en cinco países, y conservamos la agilidad de aquella estructura inicial: los socios siguen involucrados en las decisiones que importan.",
  ],
  /* Sin `cta`. Decía "Conocer al equipo" y llevaba a #equipo, que es la banda
     inmediatamente siguiente. */
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
  /* Cap. 05, diferencial 5, textual. */
  title: "Partner de largo plazo",
  /* Cap. 05, diferencial 5, textual. Abría con "No publicamos un recuento de
     clientes", que es una decisión interna del cap. 01 anunciada al lector, y
     empezar por lo que no se dice es justo lo que el cap. 07 descarta: se
     enuncia por lo que se ofrece. */
  description:
    "Entramos por un discovery o una prueba acotada y crecemos con resultados demostrados. La permanencia se gana con resultados.",
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
  /* Cap. 04, evidencia del valor Confianza: "Equipo estable, así que el
     cliente habla siempre con las mismas personas." */
  title: "Equipo estable",
  description:
    "Somos cerca de treinta profesionales y la rotación está por debajo de la media de la industria, así que el cliente habla con las mismas personas a lo largo del tiempo: los fundadores participan de las cuentas críticas y los líderes actúan como mentores, no solo como asignadores de tareas.",
  /* Sin `careersCta`. Decía "Conocer la Academia" y volvía hacia arriba, a la
     banda 01, desde una banda que habla del equipo. La Academia es evidencia
     del valor Compañerismo y aprendizaje, que ya está entre los cuatro de
     abajo; eso no la convierte en un botón. */
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
  /* Cap. 07, columna "Así sí", textual. */
  title: "Empezamos por lo que ya te duele hoy",
  description:
    "Entramos por un discovery o una prueba acotada: una conversación corta para entender cómo trabajás hoy, y una propuesta con alcance, plazo y presupuesto.",
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
