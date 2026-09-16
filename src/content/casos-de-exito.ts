import { footerContent, siteContact, type FooterContent } from "./shared";

/**
 * `/casos-de-exito` — two blocks: the agents that are running, and the
 * recorrido behind them.
 *
 * The agents come from `casesContent` in `shared.ts`, the two cases the
 * brochure documents with a client name and a result. Everything under
 * `work` is the project list the standing site publishes at
 * novitsoftware.com/experiencia-novit, which is a wall of client logos with a
 * line of copy under each.
 *
 * ## Without the logos, and without the names
 *
 * The logos are not in this repo and cap. 09 of brand-core leaves the client
 * mention policy undefined — which cases are nameable, with what detail and
 * who authorises it. So the work is listed by what it was rather than by who
 * paid for it: the line under each logo is the part that says anything, and it
 * carries no name. The two named cases stay named because the brochure
 * already publishes them that way.
 */
export const casesPageContent = {
  meta: {
    title: "Casos de éxito — Novit Software",
    description:
      "Agentes de IA en producción y una década de proyectos: sistemas de gestión, plataformas web y mobile, consultoría de procesos y equipos integrados.",
  },
  eyebrow: "Casos de éxito",
  title: "Clientes que confían en Novit",
  lead: "Desde 2015, con proyectos activos en cinco países y trabajo hecho en otros tres. Estos son los agentes que hoy están en producción y el recorrido que hay detrás.",
  cta: { label: "Consultanos", href: siteContact.phone.href },
  agents: {
    id: "agentes-en-produccion",
    eyebrow: "En producción",
    title: "Agentes que ya están trabajando",
    lead: "Cada uno fue el primer agente de su empresa: un proceso concreto que hoy funciona y que abrió la puerta a todo lo que sigue.",
  },
  /**
   * The recorrido, grouped by what the work was. Three groups rather than one
   * list of nineteen: a wall of one-liners is scanned, not read, and the
   * grouping is the only thing that tells a reader whether their own problem
   * is in it.
   */
  work: {
    id: "recorrido",
    eyebrow: "Recorrido",
    title: "Una década de proyectos",
    lead: "Software a medida, consultoría sobre el proceso de desarrollo y equipos integrados a los del cliente, en industrias que van del real estate al retail, la salud y la educación.",
    groups: [
      {
        id: "producto",
        icon: "code",
        title: "Software a medida",
        items: [
          "Sistema de gestión comercial, CRM y plataforma de cobranzas en cuotas para real estate, integrada con entidades bancarias",
          "Portal de ventas online",
          "Plataforma web y mobile para censos y encuestas",
          "App mobile y plataforma web para la gestión de membresías en una red de estacionamientos",
          "Plataforma web con integración a SAP y app mobile para punto de venta",
          "Software para punto de venta y campañas de mailing para retail",
          "App mobile para relevamiento de precios",
          "Diseño y desarrollo integral de un producto SaaS",
          "Desarrollo y migración de CRM, integración con la API de WhatsApp y desarrollo a bajo nivel TCP/IP y VoIP",
          "Data analytics para retail",
        ],
      },
      {
        id: "consultoria",
        icon: "metric",
        title: "Consultoría y procesos",
        items: [
          "Consultoría en procesos de desarrollo de software y soporte: SLA, métricas y KPI",
          "Consultoría en optimización de procesos de desarrollo de software y KPI",
          "Consultoría en data migration e implementación de SAP S/4HANA, con soporte ABAP",
          "Consultoría SAP FICO y ABAP",
        ],
      },
      {
        id: "equipos",
        icon: "team",
        title: "Equipos, soporte e integraciones",
        items: [
          "Staff augmentation para healthcare: talento experto en tiempo récord y a un costo competitivo",
          "Outsourcing de un equipo de desarrollo integral: devs, QA y Scrum Master",
          "Soporte y mantenimiento evolutivo de una plataforma SaaS",
          "Soporte de una plataforma web educativa",
          "Integraciones con entidades bancarias de la región",
        ],
      },
    ],
  },
  /* La invitación con la que cierra la página del sitio actual, textual. */
  closing: {
    title: "¿Te interesa conocer un caso en profundidad?",
    description:
      "Contanos cuál y con qué proceso lo estás comparando. Lo que no está publicado lo contamos en una conversación.",
  },
} as const;

/** The footer on `/casos-de-exito`: this page's two bands, and the channels. */
export const casesFooterContent: FooterContent = {
  mission: footerContent.mission,
  columns: [
    {
      title: "En esta página",
      links: [
        {
          label: casesPageContent.agents.eyebrow,
          href: "#agentes-en-produccion",
        },
        { label: casesPageContent.work.eyebrow, href: "#recorrido" },
      ],
    },
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
