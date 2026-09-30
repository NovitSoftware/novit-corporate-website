import { exploreColumn, footerMission } from "@/content/footer";
import { siteContact } from "@/content/site";

/* ==========================================================================
   `/` — everything the home page renders, in the order it renders it.

   Hero · 01 Qué hacemos · 02 Contacto, with the franja de datos as an
   unlabelled strip between the hero and the first band.

   Every string on this page comes from `novt-home-texto-final.md`, and only
   from there. The reference numbers its blocks 2 · Franja de datos,
   3 · Qué hacemos and 5 · Cierre; the section indices below are this page's
   own count and are kept in step with `app/(home)/page.tsx` by hand, so
   change both together.
   ========================================================================== */

/**
 * The cabecera. The reference has no §1, so the headline and the lead are its
 * Meta pair — the title without the company name the logo already carries,
 * and the description whole.
 */
export const heroContent = {
  eyebrow: "Desde 2015",
  title: "Desarrollo de Software y Transformación IA",
  statement:
    "Desarrollamos software a medida y agentes de IA integrados al proceso real de tu empresa, con foco en la reducción de costos y el mantenimiento a largo plazo.",
  primaryCta: { label: "Contacto", href: "#contacto" },
  /** The four volantas of `services`, as the rail under the headline. */
  pillars: [
    { label: "Transformación IA", icon: "agent" },
    { label: "Desarrollo a medida", icon: "code" },
    { label: "Consultoría IT / CTOaaS", icon: "metric" },
    { label: "Staff Augmentation", icon: "team" },
  ],
  /**
   * A news item and nothing else: one date, and the route that explains the
   * programme. The home page carries no Academia band — the menu and this
   * card are the two ways to `/academianovit`.
   */
  announcement: {
    kicker: "Academia Novit",
    detail: "Inscripciones abiertas hasta el 6 de octubre",
    href: "/academianovit",
  },
} as const;

/**
 * §3 · Qué hacemos. The reference names the band and then goes straight to
 * the cards, so the band has a rail label and no statement of its own.
 */
export const servicesIntro = {
  id: "servicios",
  index: "01",
  eyebrow: "Qué hacemos",
  icon: "blocks",
} as const;

/**
 * The four lines of work, in the reference's order.
 *
 * `layers` is only on the first card: its ítems are not a list but a stack —
 * the agents run *on top of* the four capabilities under them, which is the
 * one thing the reference marks as needing to be visible.
 */
export const services = [
  {
    id: "transformacion-ia",
    icon: "agent",
    label: "Transformación IA",
    title: "Agentes que trabajan y escalan como parte de tu proceso",
    description:
      "Sistemas agénticos integrados a tu operación real sin exponer datos sensibles, con permisos estrictos y trazabilidad de lo que hace cada agente. Construidos sobre una infraestructura pensada para escalar y mantenerla en el tiempo.",
    layers: {
      top: "Agentes en producción",
      base: [
        { label: "Estrategia", icon: "strategy" },
        { label: "Infraestructura", icon: "layers" },
        { label: "Gobierno", icon: "eye" },
        { label: "Seguridad", icon: "shield" },
      ],
    },
  },
  {
    id: "desarrollo-a-medida",
    icon: "code",
    label: "Desarrollo a medida",
    title: "Desarrollo Software guiado por IA en todo el ciclo",
    points: [
      "Discovery, Desarrollo, Soporte y Evolución.",
      "Desarrollo de Software guiado por IA en cada etapa que reduce costos en un 70%.",
      "Procesos y Criterios de Ingeniería que aseguran calidad y seguridad.",
    ],
  },
  {
    id: "cto-as-a-service",
    icon: "metric",
    label: "Consultoría IT / CTOaaS",
    title:
      "Optimizamos tus procesos de desarrollo y mejoramos la productividad de tu equipo",
    points: [
      "Implementar métricas de calidad y performance (KPI's)",
      "Identificar ineficiencias y reducir costos",
      "Gestionar de forma correcta la incorporación de Inteligencia Artificial",
      "Implementar mejores prácticas de la ingeniería en software",
      "Reducir tiempos de delivery",
      "Automatizar pipelines de desarrollo",
      "Contratar y motivar a los mejores recursos y proveedores",
    ],
  },
  {
    id: "celulas-agiles",
    icon: "team",
    label: "Staff Augmentation",
    title: "Capacidad elástica y multidisciplinaria para el equipo que ya tenés",
    description:
      "Equipos capacitados y comprometidos, células ágiles y staff augmentation que se adapta a tus procesos. Sin costos por escalar o reducir la demanda y con acceso a equipos multidisciplinarios sin tener que contratar cada especialidad.",
  },
] as const;

export type Service = (typeof services)[number];

/**
 * §5 · El cierre, and the form under it.
 *
 * The volanta is split because the reference bolds its second half; `eyebrow`
 * is this page's own word for the anchor the hero CTA, the footer and the
 * menu all point at.
 *
 * It asks for the message and nothing else: there is no endpoint to post it
 * to, so it hands it to one of the two channels that do exist — WhatsApp or
 * the inbox — already written, and whoever sends it is who Novit answers. No
 * name and no email: WhatsApp and the mail client both carry who it is from.
 */
export const closingContent = {
  id: "contacto",
  index: "02",
  eyebrow: "Contacto",
  icon: "chat",
  kicker: { lead: "Más de 11 años", strong: "haciendo simple lo complejo" },
  title: "¿En qué proceso te ayudamos a reducir costos?",
  description:
    "Una primera conversación alcanza para ver si hay un caso por dónde empezar.",
  message: {
    label: "Mensaje",
    icon: "chat",
    placeholder: "¿Dónde querés reducir costos?",
  },
  /** One button per channel, WhatsApp first: it is the line the rest of the
   *  site sends people to. */
  send: {
    whatsapp: "Enviar por WhatsApp",
    email: "Enviar por correo",
  },
  /** The subject the mail client opens with; the body is the message. */
  subject: "Consulta desde novitsoftware.com",
} as const;

/** The footer on `/`. Every route has one, and it indexes that page. */
export const homeFooterContent = {
  mission: footerMission,
  columns: [
    {
      /* This page's own bands, which is what every route's footer indexes. */
      title: "En esta página",
      links: [
        { label: servicesIntro.eyebrow, href: "/#servicios", icon: servicesIntro.icon },
        { label: closingContent.eyebrow, href: "/#contacto", icon: closingContent.icon },
      ],
    },
    exploreColumn("/"),
  ],
  /** Empty until a privacy policy exists to point at. */
  legal: [] as Array<{ label: string; href: string }>,
  /** Instagram and LinkedIn, both live and linked from novitsoftware.com. */
  social: siteContact.social,
  /** The two direct channels: the WhatsApp number and the commercial inbox. */
  channels: [
    {
      id: "whatsapp",
      label: siteContact.phone.label,
      href: siteContact.phone.href,
    },
    { id: "email", label: siteContact.email.label, href: siteContact.email.href },
  ],
  /** The footer's one call to action, and it stays on this page. */
  contact: {
    value: "Escribinos",
    href: "/#contacto",
  },
} as const;
