/* Who Novit is: the Nosotros band, the team and its values, and the relationships band folded into them. */

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
  statement:
    "Optimizamos procesos de negocio desarrollando software de calidad. Entendemos el proceso antes de escribir código, y la propiedad intelectual es del cliente desde el momento cero.",
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
export const teamContent = {
  index: "06",
  eyebrow: "Equipo",
  title: "Personas que se quedan en el proyecto",
  description:
    "Somos cerca de treinta profesionales. El cliente habla con las mismas personas a lo largo del tiempo: los fundadores participan de las cuentas críticas y los líderes actúan como mentores, no solo como asignadores de tareas.",
  careersCta: { label: "Conocer la Academia", href: "#academia" },
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

