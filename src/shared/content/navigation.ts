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
 * active state, and the order here is the order of the menu: the 01–04 beside
 * each entry is its position in this list, not a number the entry carries.
 * `id` is only the React key.
 */
export const navigation = [
  {
    id: "inteligencia-artificial",
    label: "Inteligencia Artificial",
    href: "/inteligencia-artificial",
  },
  {
    id: "desarrollo-y-consultoria",
    label: "Desarrollo y Consultoría",
    href: "/desarrollo-y-consultoria",
  },
  { id: "academianovit", label: "Academia Novit", href: "/academianovit" },
  { id: "casos-de-exito", label: "Casos de éxito", href: "/casos-de-exito" },
] as const;
