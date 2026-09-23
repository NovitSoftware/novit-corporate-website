import { exploreColumn, footerMission, type FooterContent } from "@/content/footer";
import { siteContact } from "@/content/site";

/**
 * `/desarrollo-y-consultoria` — two blocks: how a project is built, and what
 * a consultoría engagement does.
 *
 * Source is the standing corporate site, which is where these two services are
 * described today: novitsoftware.com/desarrollodesoftware and
 * /consultoria-it. Both pages are Novit's own published copy, so the stages,
 * the deliverables, the seven outcomes and the four steps are theirs; what
 * changed is the spelling of the headings and the order of a couple of
 * clauses. The opener and the build block's own lead are newer copy the
 * client supplied directly, not on the standing site.
 *
 * It is one page and not two because the menu carries one entry for both, and
 * because the second is what the first turns into once a client has a team of
 * their own: the same engagement seen from either side.
 */
export const developmentPageContent = {
  meta: {
    title: "Desarrollo y Consultoría IT — Novit Software",
    description:
      "Software a medida por etapas, con entregables propios en cada una, y consultoría sobre el proceso de desarrollo: métricas, KPI y optimización.",
  },
  eyebrow: "Servicios",
  /* NBSP between "Consultoría" y "IT": el h1 envuelve a 22ch, y con espacio
     normal "IT" quedaba huérfano en una tercera línea. Con el NBSP el corte
     cae después de "y", y "Consultoría IT" baja junto a la segunda línea. */
  title: "Desarrollo y Consultoría IT",
  lead: "Construimos software a medida para tu empresa y te garantizamos calidad y seguridad a costos ultra competitivos.",
  cta: { label: "Consultanos", href: siteContact.phone.href },
  /**
   * The three stages, as the standing site draws them: independent, each
   * contractable on its own, each feeding the next.
   *
   * The deliverables sit beside the three rather than inside the first card.
   * They belong to Discovery — it is the only stage the source lists them for,
   * and a matching list invented for the other two would be inventing the
   * engagement — but five rows inside one card of three leaves the other two
   * with a hole the height of the list.
   */
  build: {
    id: "desarrollo",
    eyebrow: "Desarrollo de software",
    title: "Creamos software único para los procesos de tu empresa",
    lead: "La inteligencia artificial incrementó la productividad de la industria del software en general y la nuestra en particular en un orden de magnitud. Hoy ofrecemos servicios de calidad a una fracción del costo de años atrás. Vendemos el desarrollo a medida por etapas que se compran individualmente, con entregables tangibles que alimentan a la siguiente.",
    stages: [
      {
        id: "discovery",
        icon: "search",
        label: "Etapa 01",
        title: "Discovery y planificación",
        description:
          "Relevamos y analizamos en detalle los requerimientos y las necesidades, definimos la arquitectura técnica del sistema según los objetivos del proyecto y diseñamos la experiencia de usuario con foco en la usabilidad y la navegación.",
      },
      {
        id: "implementacion",
        icon: "code",
        label: "Etapa 02",
        title: "Desarrollo e implementación",
        description:
          "Convertimos tu visión en realidad. Nuestro equipo de desarrolladores, arquitectos de software, diseñadores UX/UI y QA se encarga integralmente de la solución, o hace sinergia con los squads de desarrollo existentes.",
      },
      {
        id: "soporte",
        icon: "clock",
        label: "Etapa 03",
        title: "Soporte y mantenimiento",
        description:
          "Una vez en producción, damos soporte y mantenimiento continuo durante todo el ciclo de vida del software: corregimos errores e incorporamos mejoras, nuevas funcionalidades e integraciones para adaptar el sistema a las nuevas necesidades del negocio.",
      },
    ],
    deliverablesLabel: "Entregables del discovery",
    deliverables: [
      "Documento de requisitos del sistema",
      "Wireframes y prototipos UX/UI",
      "Documento de diseño de la arquitectura",
      "Propuesta de stack tecnológico",
      "Project plan y Gantt",
    ],
  },
  /**
   * The consultoría, for a company that already has a development team. The
   * seven outcomes and the four steps are the standing site's, in its order.
   */
  consulting: {
    id: "consultoria",
    eyebrow: "Consultoría IT",
    title: "Optimizamos el proceso de desarrollo de tu equipo",
    lead: "Accedé a conocimiento experto y estrategias a medida en el momento en que lo requieras, para incrementar la productividad del equipo y optimizar los procesos con los que trabaja.",
    helpLabel: "Te ayudamos a",
    help: [
      "Implementar métricas de calidad y performance (KPI)",
      "Identificar ineficiencias y reducir costos",
      "Generar código mantenible",
      "Implementar mejores prácticas de la ingeniería de software",
      "Reducir tiempos de delivery",
      "Automatizar pipelines de desarrollo",
      "Contratar y motivar a los mejores recursos y proveedores",
    ],
    stepsLabel: "Cómo trabajamos",
    steps: [
      {
        id: "diagnostico",
        icon: "eye",
        label: "01",
        title: "Diagnóstico",
        description:
          "Analizamos los procesos de desarrollo de software de tu empresa para encontrar oportunidades de mejora en herramientas, marcos de trabajo y metodologías.",
      },
      {
        id: "kpi",
        icon: "metric",
        label: "02",
        title: "Definición de KPI",
        description:
          "Definimos y establecemos KPI alineados con tus objetivos de negocio para medir el rendimiento del equipo de desarrollo, el soporte a clientes, el área de QA y los proveedores de tecnología.",
      },
      {
        id: "optimizacion",
        icon: "layers",
        label: "03",
        title: "Optimización de procesos",
        description:
          "Trabajamos en estrecha colaboración con tus equipos de desarrollo para optimizar los procesos, identificar cuellos de botella e implementar las mejores prácticas de la ingeniería de software.",
      },
      {
        id: "resultados",
        icon: "check",
        label: "04",
        title: "Análisis de resultados",
        description:
          "Aseguramos que las mejoras implementadas están generando el impacto deseado, con un monitoreo continuo.",
      },
    ],
  },
} as const;

/**
 * The footer on `/desarrollo-y-consultoria`. Same shape as the other routes':
 * this page's own two bands, and the two direct channels. The menu is what
 * carries the site now, so the footer does not repeat it.
 */
export const developmentFooterContent: FooterContent = {
  mission: footerMission,
  columns: [
    {
      title: "En esta página",
      links: [
        { label: developmentPageContent.build.eyebrow, href: "#desarrollo" },
        {
          label: developmentPageContent.consulting.eyebrow,
          href: "#consultoria",
        },
      ],
    },
    exploreColumn("/desarrollo-y-consultoria"),
  ],
  legal: [],
  social: siteContact.social,
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
