/* ==========================================================================
   The menu. One entry per route; adding a route means adding a line here.
   ========================================================================== */

/**
 * The menu, and the whole of it: one entry per section the site has.
 *
 * Every destination is a route. The home page is not in the list because the
 * logo is how a reader gets to it, and in-page anchors are not either — the
 * footer of each page indexes that page, which is where an index of bands
 * belongs.
 *
 * `href` is what the header compares against the current pathname for the
 * active state, and the order here is the order of the menu. `id` is only the
 * React key.
 *
 * `summary` is what the reader gets for choosing that entry, in one clause.
 * Each is a reduction of that route's own `meta.description`, so the menu and
 * the page it opens say the same thing.
 */
export const navigation = [
  {
    id: "inteligencia-artificial",
    label: "Inteligencia Artificial",
    href: "/inteligencia-artificial",
    summary: "Estrategia, infraestructura y agentes sobre tu red privada",
  },
  {
    id: "desarrollo-y-consultoria",
    label: "Desarrollo y Consultoría",
    href: "/desarrollo-y-consultoria",
    summary: "Software a medida por etapas, y el proceso de tu equipo",
  },
  {
    id: "academianovit",
    label: "Academia Novit",
    href: "/academianovit",
    summary: "Cursada de 32 horas sobre sistemas agénticos",
  },
  {
    id: "casos-de-exito",
    label: "Casos de éxito",
    href: "/casos-de-exito",
    summary: "Los agentes en producción y una década de proyectos",
  },
] as const;

export type NavigationItem = (typeof navigation)[number];
