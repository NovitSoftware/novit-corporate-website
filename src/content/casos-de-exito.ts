import { footerMission, type FooterContent } from "@/content/footer";
import { siteContact } from "@/content/site";

/**
 * `/casos-de-exito` — one block, the recorrido: a decade of projects grouped
 * by what the work was, IA first.
 *
 * The two agents that used to lead the page under their own heading — from
 * `casesContent` in `@/content/cases`, the cases the brochure documents with
 * a client name and a result — are now the first group of the recorrido
 * itself, not a separate section above it. Everything else under `work` is
 * the project list the standing site publishes at
 * novitsoftware.com/experiencia-novit: a client's mark, the country and one
 * line of what the work was.
 *
 * ## Naming the clients
 *
 * Cap. 09 of brand-core leaves the client mention policy undefined, and cap.
 * 01 would rather talk about how long a relationship lasted than count logos.
 * These nineteen are published because the client asked for this page to
 * carry them, and they are the marks Novit already publishes on its own site,
 * which is where the files come from. A twentieth needs that decision made
 * again.
 *
 * Cap. 01 also fixes what may be said about the countries: Argentina, Chile,
 * España, México and USA have projects running, while Colombia, Perú and
 * Brasil may only appear under "hemos trabajado en". The cards name a country
 * each, so `work.lead` carries that label once for all of them.
 */
export const casesPageContent = {
  meta: {
    title: "Casos de éxito — Novit Software",
    description:
      "Agentes de IA en producción y una década de proyectos: sistemas de gestión, plataformas web y mobile, consultoría de procesos y equipos integrados.",
  },
  eyebrow: "Casos de éxito",
  title: "Clientes que confían en Novit",
  lead: "Desde 2015, con proyectos activos en cinco países y trabajo hecho en otros tres. Este es el recorrido: de los agentes de IA que hoy están en producción a una década de software a medida.",
  cta: { label: "Consultanos", href: siteContact.phone.href },
  /**
   * The recorrido, grouped by what the work was. Four groups rather than one
   * list of twenty-one: a wall of one-liners is scanned, not read, and the
   * grouping is the only thing that tells a reader whether their own problem
   * is in it. IA leads because it's the newest and the most concrete — a
   * client name and a result, same as the standing brochure gives it.
   */
  work: {
    id: "recorrido",
    eyebrow: "Recorrido",
    title: "Una década de proyectos",
    /* La segunda oración es la etiqueta que pide el cap. 01: los cinco países
       con proyectos activos se nombran sueltos, Colombia y Brasil no. */
    lead: "Agentes de inteligencia artificial, software a medida, consultoría sobre el proceso de desarrollo y equipos integrados a los del cliente, en industrias que van del real estate al retail, la salud y la educación. Cada proyecto lleva el país donde se hizo: Argentina, Chile, España y Estados Unidos tienen proyectos activos, y en Colombia y Brasil hemos trabajado.",
    groups: [
      {
        id: "inteligencia-artificial",
        icon: "agent",
        title: "Inteligencia Artificial",
        items: [
          {
            country: "Argentina",
            description:
              "Años de antecedentes y criterio experto convertidos en un agente que encuentra el código arancelario para la declaración aduanera.",
            logo: {
              name: "United Logistic Company",
              src: "/logos/united-logistic-company.png",
              width: 556,
              height: 395,
              displayHeight: 56,
            },
          },
          {
            country: "España",
            description:
              "Interpreta las facturas de proveedores, arma la documentación en el ERP y captura datos de compra que antes se perdían.",
            logo: {
              name: "Gamma Group",
              src: "/logos/gamma-group.png",
              width: 300,
              height: 54,
              displayHeight: 26,
            },
          },
        ],
      },
      {
        id: "producto",
        icon: "code",
        title: "Software a medida",
        items: [
          {
            country: "Argentina",
            description:
              "Sistema de gestión comercial, CRM y plataforma de cobranzas en cuotas para real estate, integrada con entidades bancarias",
            logo: {
              name: "Consultatio",
              src: "/logos/consultatio.png",
              width: 603,
              height: 103,
              displayHeight: 26,
            },
          },
          {
            country: "España",
            description: "Portal de ventas online",
            logo: {
              name: "Gamma Group",
              src: "/logos/gamma-group.png",
              width: 300,
              height: 54,
              displayHeight: 27,
            },
          },
          {
            country: "Argentina",
            description: "Plataforma web y mobile para censos y encuestas",
            logo: {
              name: "INDEC",
              src: "/logos/indec.png",
              width: 381,
              height: 192,
              displayHeight: 40,
            },
          },
          {
            country: "Colombia",
            description:
              "App mobile y plataforma web para la gestión de membresías en una red de estacionamientos",
            logo: {
              name: "City Parking",
              src: "/logos/city-parking.png",
              width: 579,
              height: 177,
              displayHeight: 40,
            },
          },
          {
            country: "Argentina",
            description:
              "Plataforma web con integración a SAP y app mobile para punto de venta",
            logo: {
              name: "Puig",
              src: "/logos/puig.png",
              width: 383,
              height: 67,
              displayHeight: 27,
            },
          },
          {
            country: "Argentina",
            description:
              "Software para punto de venta y campañas de mailing para retail",
            logo: {
              name: "Scanntech",
              src: "/logos/scanntech.png",
              width: 649,
              height: 131,
              displayHeight: 32,
            },
          },
          {
            country: "Argentina",
            description: "App mobile para relevamiento de precios",
            logo: {
              name: "iglam Digital",
              src: "/logos/iglam-digital.png",
              width: 360,
              height: 151,
              displayHeight: 40,
            },
          },
          {
            country: "Argentina",
            description: "Diseño y desarrollo integral de un producto SaaS",
            logo: {
              name: "POSforms",
              src: "/logos/posforms.png",
              width: 535,
              height: 185,
              displayHeight: 40,
            },
          },
          {
            country: "Argentina",
            description:
              "Desarrollo y migración de CRM, integración con la API de WhatsApp y desarrollo a bajo nivel TCP/IP y VoIP",
            logo: {
              name: "TecnoVoz",
              src: "/logos/tecnovoz.png",
              width: 433,
              height: 163,
              displayHeight: 40,
            },
          },
          {
            country: "Argentina",
            description: "Data analytics para retail",
            logo: {
              name: "Fulltime Group",
              src: "/logos/fulltime-group.png",
              width: 344,
              height: 210,
              displayHeight: 52,
            },
          },
        ],
      },
      {
        id: "consultoria",
        icon: "metric",
        title: "Consultoría y procesos",
        items: [
          {
            country: "Chile",
            description:
              "Consultoría en procesos de desarrollo de software y soporte: SLA, métricas y KPI",
            logo: {
              name: "MAS",
              src: "/logos/mas.png",
              width: 293,
              height: 125,
              displayHeight: 40,
            },
          },
          {
            country: "Argentina",
            description:
              "Consultoría en optimización de procesos de desarrollo de software y KPI",
            logo: {
              name: "SETUP",
              src: "/logos/setup.png",
              width: 477,
              height: 158,
              displayHeight: 40,
            },
          },
          {
            country: "Argentina",
            description:
              "Consultoría en data migration e implementación de SAP S/4HANA, con soporte ABAP",
            logo: {
              name: "Megatlon",
              src: "/logos/megatlon.png",
              width: 487,
              height: 68,
              displayHeight: 22,
            },
          },
          {
            country: "Argentina",
            description: "Consultoría SAP FICO y ABAP",
            logo: {
              name: "Softtek",
              src: "/logos/softtek.png",
              width: 362,
              height: 186,
              displayHeight: 46,
            },
          },
        ],
      },
      {
        id: "equipos",
        icon: "team",
        title: "Equipos, soporte e integraciones",
        items: [
          {
            country: "Estados Unidos",
            description:
              "Staff augmentation para healthcare: talento experto en tiempo récord y a un costo competitivo",
            logo: {
              name: "NovoPath",
              src: "/logos/novopath.png",
              width: 496,
              height: 143,
              displayHeight: 40,
            },
          },
          {
            country: "Estados Unidos",
            description:
              "Outsourcing de un equipo de desarrollo integral: devs, QA y Scrum Master",
            logo: {
              name: "GovPilot",
              src: "/logos/govpilot.png",
              width: 481,
              height: 124,
              displayHeight: 38,
            },
          },
          {
            country: "Chile",
            description:
              "Soporte y mantenimiento evolutivo de una plataforma SaaS",
            logo: {
              name: "Evidence Based Metrics",
              src: "/logos/evidence-based-metrics.png",
              width: 304,
              height: 184,
              displayHeight: 52,
            },
          },
          {
            country: "Argentina",
            description: "Soporte de una plataforma web educativa",
            logo: {
              name: "TEDx Río de la Plata",
              src: "/logos/tedx-rio-de-la-plata.png",
              width: 740,
              height: 111,
              displayHeight: 24,
            },
          },
          {
            country: "Colombia y Brasil",
            description: "Integraciones con entidades bancarias de la región",
            logo: {
              name: "product minds",
              src: "/logos/product-minds.png",
              width: 862,
              height: 107,
              displayHeight: 20,
            },
          },
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
  mission: footerMission,
  columns: [
    {
      title: "En esta página",
      links: [{ label: casesPageContent.work.eyebrow, href: "#recorrido" }],
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
