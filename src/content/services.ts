/* The Qué hacemos band on the home page: the intro and the five offer cards. */

export const servicesIntro = {
  index: "02",
  eyebrow: "Qué hacemos",
  title: "Tres líneas de trabajo",
  description:
    "Desarrollo de software a medida, células ágiles e inteligencia artificial. Trabajamos el ciclo completo —discovery, experiencia, arquitectura, desarrollo, calidad y soporte— o nos integramos a los equipos que ya existen.",
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
