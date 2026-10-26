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
  eyebrow: "Más de una década",
  title: "Desarrollo de Software y Transformación IA",
  statement:
    "Desarrollamos software a medida y agentes de IA integrados al proceso real de tu empresa, con foco en la **reducción de costos** y el mantenimiento a largo plazo.",
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
    /**
     * When the card goes: once the 6th is over in Buenos Aires. The site is
     * static and nothing rebuilds it that night, so the page checks the clock
     * itself — see `PRE_PAINT_SCRIPT` in the root layout — and a build made
     * after this leaves the card out altogether.
     */
    until: "2026-10-07T00:00:00-03:00",
  },
} as const;

/**
 * §3 · Qué hacemos. The reference names the band and then goes straight to
 * the cards, so the band has a rail label and no statement of its own.
 */
export const servicesIntro = {
  id: "servicios",
  eyebrow: "Qué hacemos",
  icon: "blocks",
} as const;

/**
 * The lines of work: the reference's four, in its order, and Ciberseguridad
 * across the foot of the grid.
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
      "Sistemas agénticos integrados a tu operación real sin exponer **datos sensibles**, con permisos estrictos y trazabilidad de lo que hace cada agente. Construidos sobre una infraestructura **pensada para escalar** y mantenerla en el tiempo.",
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
      "Desarrollo de Software **guiado por IA** en cada etapa.",
      "Procesos y Criterios de Ingeniería que aseguran **calidad y seguridad**.",
    ],
  },
  {
    id: "cto-as-a-service",
    icon: "metric",
    label: "Consultoría IT / CTOaaS",
    title:
      "Optimizamos tus procesos de desarrollo y mejoramos la productividad de tu equipo",
    points: [
      "Implementar **métricas de calidad** y performance (KPI's)",
      "Identificar ineficiencias y reducir costos",
      "Gestionar de forma correcta la incorporación de **Inteligencia Artificial**",
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
      "Equipos capacitados y comprometidos, células ágiles y staff augmentation que se adapta a tus procesos. Sin costos por escalar o reducir la demanda y con acceso a **equipos multidisciplinarios** sin tener que contratar cada especialidad.",
  },
  /* Ciberseguridad, which was a band of its own: threats now move at the
     pace of AI, and so does the defence. Said without a year, a news item or
     a source, so the card does not date. `wide` sets it across both columns,
     under the other four, where its two-column list has room. */
  {
    id: "ciberseguridad",
    icon: "shield",
    label: "Ciberseguridad",
    title: "Tu software protegido al ritmo en que aparecen las amenazas",
    description:
      "Las vulnerabilidades ya se descubren y se aprovechan a velocidad de máquina, en PHP, Node.js, Java, WordPress y hasta en los agentes que escriben código. Por eso **protegemos tus Datos con IA**, al mismo ritmo:",
    points: [
      "Inventario de dependencias cruzado todos los días con los avisos de cada proveedor y con lo que publican los investigadores.",
      "Agentes que priorizan cada vulnerabilidad según la exposición real de tus sistemas.",
      "Parches probados en un entorno aparte y desplegados en horas, con revisión humana en cada cambio.",
      "Seguridad por diseño en lo que construimos: permisos mínimos, secretos fuera del código y trazabilidad de cada acceso.",
    ],
    wide: true,
  },
] as const;

export type Service = (typeof services)[number];

/** A frame in the Equipo mosaic: a photograph or a muted clip, how many
 *  cells it takes, and whether a phone, where the wall runs long, keeps it.
 *  A clip's `src` has no extension (see `MutedClip`), and a photo cropped hard
 *  by its frame can name where the crop holds (a CSS `object-position`). */
export type TeamFrame = {
  kind: "photo" | "clip";
  size: "big" | "tall" | "single";
  src: string;
  alt: string;
  focus?: string;
  phone?: boolean;
};

/** The mosaic's frames, in order; it packs them densely, four across from `lg`.
 *  The whole team at the 2024 year-end dinner opens it, and the founders at
 *  the office mural lead the second band. Eleven frames fill six rows of four
 *  and ten of two only with two portraits standing tall, so a frame taken out
 *  means the sizes are counted again: a hole is left at the foot otherwise. */
const TEAM_MEDIA: ReadonlyArray<TeamFrame> = [
  {
    kind: "photo",
    size: "big",
    src: "/team/cena-2024.jpg",
    alt: "El equipo de Novit en la cena de cierre de 2024",
  },
  {
    kind: "clip",
    size: "tall",
    /* Cut from the Instagram reel at 19–43.5 s. */
    src: "/clips/panic-room",
    alt: "El equipo resolviendo juntos un desafío de Panic Room",
  },
  {
    kind: "photo",
    size: "single",
    src: "/team/selfie-equipo.jpg",
    alt: "Una selfie del equipo alrededor de la mesa de la oficina",
  },
  {
    kind: "photo",
    size: "tall",
    src: "/team/liderazgo.jpg",
    alt: "Parte del equipo conversando en el lounge de la oficina",
    focus: "left",
  },
  {
    kind: "clip",
    size: "tall",
    /* Cut from the Instagram reel at 2–52 s, before its closing card. */
    src: "/clips/noviters",
    alt: "El equipo trabajando y compartiendo en la oficina",
  },
  {
    kind: "photo",
    size: "big",
    src: "/team/founders-mural.jpg",
    alt: "Leandro y Rodrigo Vazquez, fundadores de Novit, frente al mural de la oficina",
  },
  {
    kind: "photo",
    size: "tall",
    src: "/team/consultoria.jpg",
    alt: "Tres personas del equipo revisando una solución en una notebook",
  },
  {
    kind: "photo",
    size: "big",
    src: "/team/equipo-2025.jpg",
    alt: "El equipo de Novit reunido en la oficina al cierre de 2025",
    phone: false,
  },
  {
    kind: "photo",
    size: "single",
    src: "/team/oficina-abierta.jpg",
    alt: "La oficina abierta, con el equipo trabajando en sus puestos",
  },
  {
    kind: "photo",
    size: "single",
    src: "/team/reunion-remota.jpg",
    alt: "Una reunión en la oficina con parte del equipo conectado en la pantalla",
  },
  {
    kind: "photo",
    size: "single",
    src: "/team/lounge.jpg",
    alt: "El equipo conversando en el espacio común de la oficina",
  },
];

/**
 * Equipo: who does the work. Not a headcount — the team says it, by the
 * people in the photographs and the clips, the roles the lead names and the
 * disciplines a project draws on. Every frame is the team's own, from the office,
 * the year-end meetings and the company's Instagram, so no one in them is a
 * stand-in; the clips put the wall in motion, played muted. The count of
 * people stays out on purpose.
 */
export const teamContent = {
  id: "equipo",
  eyebrow: "Equipo",
  icon: "team",
  title: "Un equipo con criterio",
  lead: "Arquitectos de Software, Ingenieros de IA, Expertos en Seguridad, Ingenieros de Infraestructura, Analistas de QA, Diseñadores UX.",
  disciplines: [
    { label: "Desarrollo", icon: "code" },
    { label: "Arquitectura", icon: "layers" },
    { label: "IA y datos", icon: "agent" },
    { label: "QA", icon: "check" },
    { label: "UX/UI", icon: "eye" },
    { label: "Scrum y gestión", icon: "repeat" },
    { label: "Soporte", icon: "shield" },
  ],
  media: TEAM_MEDIA,
} as const;

/**
 * En persona: the relationship side of the partnership. Novit is IA optimista
 * and gives human relationships the same weight: the founders travel across
 * Argentina and abroad to be near the clients and understand how they work.
 * The clips are the founders' own, from the company's reels, played muted —
 * two of each founder — and they show the place, so each is captioned with
 * where it was and never when.
 */
/** A clip in En persona and where it was; `src` has no extension (see
 *  `MutedClip`). Each is cut from the reel to the stretch shown, noted on it. */
export type PresenceClip = {
  src: string;
  label: string;
  place: string;
  description: string;
};

export const presenceContent = {
  id: "en-persona",
  eyebrow: "En persona",
  icon: "globe",
  title: "La relación con nuestros partners",
  lead: "Somos IA optimistas, pero le damos el mismo peso a las relaciones humanas: viajamos por Argentina y el mundo para estar **cerca de nuestros clientes** y entender mejor su operatoria.",
  clips: [
    {
      /* 3–37.9 s: after the opening caption, which names the year, and
         before the closing logo. */
      src: "/clips/south-summit",
      label: "South Summit",
      place: "Madrid, España",
      description: "Recorrido por South Summit, en Madrid, España",
    },
    {
      /* The whole reel. The conference was at the Fox Theater in Redwood
         City; the reel itself says Silicon Valley, the better-known name. */
      src: "/clips/startup-grind",
      label: "Startup Grind Global",
      place: "Silicon Valley, Estados Unidos",
      description: "Recorrido por Startup Grind Global, en Silicon Valley, Estados Unidos",
    },
    {
      /* From 15.5 s, where Rodrigo comes in, to the end. */
      src: "/clips/chile",
      label: "Startups Connect",
      place: "Santiago, Chile",
      description: "El encuentro Startups Connect Chile-Argentina, en Santiago de Chile",
    },
    {
      /* 17.9–35.2 s, between the title card and the closing card. */
      src: "/clips/aog",
      label: "AOG Patagonia",
      place: "Neuquén, Argentina",
      description:
        "Leandro Vazquez en AOG Patagonia, en Neuquén, Argentina, sobre la IA en la cadena de valor del Oil & Gas",
    },
  ] as ReadonlyArray<PresenceClip>,
} as const;

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
  eyebrow: "Contacto",
  icon: "chat",
  kicker: { lead: "Más de 11 años", strong: "haciendo simple lo complejo" },
  title: "¿En qué proceso te ayudamos a reducir costos?",
  description:
    "Una primera conversación alcanza para ver si hay un caso por dónde empezar.",
  message: {
    label: "Mensaje",
    icon: "chat",
    placeholder: "¡Contanos!",
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
        { label: teamContent.eyebrow, href: "/#equipo", icon: teamContent.icon },
        { label: presenceContent.eyebrow, href: "/#en-persona", icon: presenceContent.icon },
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
