/* The chrome around the bands: the two footers and the intro curtain. */

import { academyContent, academyProgram } from "./academy";
import { siteContact } from "./identity";

export const footerContent = {
  tagline: "Hacemos simple lo complejo.",
  mission:
    "Optimizamos procesos de negocio desarrollando software de calidad con tecnologías de vanguardia.",
  /**
   * Every link here resolves to a section that exists, and each section is
   * named once. The previous list had "Servicios" and "Transformación IA"
   * both pointing at `#servicios` — two labels for one destination, which
   * makes a footer look bigger than the site is — and "Relaciones" pointing
   * at `#partners`, an anchor that stopped existing when that band folded
   * into Nosotros. A footer link that lands nowhere is worse than a missing
   * one: it moves the page and leaves the reader where they were.
   */
  columns: [
    {
      title: "Compañía",
      links: [
        { label: "Nosotros", href: "/#nosotros" },
        { label: "Equipo", href: "/#equipo" },
        { label: "Contacto", href: "/#contacto" },
      ],
    },
    {
      title: "Enfoque",
      links: [
        /* Both of these point at their own route again. They were anchors on
           the home page, on the reasoning that a band that exists beats a
           route nothing links to — but each route carries a subject the home
           page only introduces, and the footer is where a corporate site
           lists what it has. `servicesIntro.cta` is the other way into the AI
           page; this is the only way into the Academia's. */
        { label: "Academia Novit", href: "/academianovit" },
        { label: "Inteligencia artificial", href: "/inteligencia-artificial" },
        { label: "Casos", href: "/#casos" },
        { label: "Seguridad y gobierno", href: "/#seguridad" },
      ],
    },
  ],
  /**
   * Empty on purpose. This row used to read "Privacidad · Seguridad", both
   * pointing at `#seguridad` — an in-page section about how client data is
   * handled in an AI architecture, which is not a privacy policy. Two links
   * in the legal row of a footer read as legal documents; neither exists, and
   * no policy page is named anywhere in the brand material. When they are
   * written, they go here with their real URLs.
   */
  legal: [] as Array<{ label: string; href: string }>,
  /** Instagram and LinkedIn, both live and linked from novitsoftware.com. */
  social: siteContact.social,
  /**
   * The footer's one call to action, and it stays on this page.
   *
   * It used to be the most prominent link on the site pointing away from it: a
   * full ChipButton reading "novitsoftware.com", sending anyone who reached the
   * bottom back to the standing corporate site rather than to the form one
   * band above them. The label names what happens, in the same words the
   * contact section opens with.
   */
  contact: {
    label: "Contacto",
    value: "Escribinos",
    href: "/#contacto",
  },
} as const;

/**
 * What the footer needs, whichever route is rendering it.
 *
 * A `link` with no `href` is a fact rather than a destination — the edition's
 * dates, say. The footer renders those as text instead of inventing an anchor
 * for them.
 */
export type FooterContent = {
  mission: string;
  columns: ReadonlyArray<{
    title: string;
    links: ReadonlyArray<{ label: string; href?: string }>;
  }>;
  legal: ReadonlyArray<{ label: string; href: string }>;
  social: ReadonlyArray<{
    id: "instagram" | "linkedin";
    label: string;
    href: string;
  }>;
  contact: { label: string; value: string; href: string };
};

/**
 * The footer on `/academianovit`, and it is about the Academia only.
 *
 * The site-wide footer indexes the home page: Nosotros, Equipo, Contacto,
 * Casos, Seguridad, plus `/inteligencia-artificial`. Rendered under the
 * Academia it turned the bottom of a page about a course into a way out of it,
 * which is the opposite of what the page is for — a reader who got to the end
 * of the temario is deciding whether to write, not shopping the rest of the
 * site.
 *
 * So the columns index *this* page — its three bands, and the edition it is
 * announcing — and no link here leaves the route. Novit's own accounts stay in
 * the row below, because that is the site's identity rather than navigation,
 * and the inbox is the chip: on this page it is the only thing to do.
 */
export const academyFooterContent: FooterContent = {
  mission: academyContent.description,
  columns: [
    {
      title: "La cursada",
      links: [
        { label: "Cinco bloques", href: "#cursada" },
        { label: "Evaluación", href: "#evaluacion" },
        { label: "Consultas", href: "#inscripcion" },
      ],
    },
    {
      /* Facts, not links — there is nowhere on this page for a date to go. */
      title: academyProgram.edition.label,
      links: academyProgram.edition.facts.map((fact) => ({
        label: `${fact.label}: ${fact.value}`,
      })),
    },
  ],
  legal: [],
  social: siteContact.social,
  contact: {
    label: "Consultas",
    value: "Escribir a Novit",
    href: siteContact.email.href,
  },
};

/*
 * `closingContent` is gone with the cierre band it fed. Once the contact form
 * moved to the bottom of the page, that band's lead was almost word for word
 * `contactContent.description` one screen below it, and its buttons sent the
 * visitor back up to Servicios and Nosotros from directly above a form. The
 * contact section is the close now. See `layout/HomePage.tsx`.
 */
export const introContent = {
  label: "Novit Software",
  markAlt: "Isotipo Novit: barras horizontales y puntos del logotipo",
} as const;
