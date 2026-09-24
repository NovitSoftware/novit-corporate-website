/* ==========================================================================
   What a footer is, and the one line all four of them open with. The footers
   themselves live beside the page each one indexes.
   ========================================================================== */

import type { IconName } from "@/components/ui/Icon";
import { homeLink, navigation } from "@/content/navigation";

/**
 * What the footer needs, whichever route is rendering it.
 *
 * A `link` with no `href` is a fact rather than a destination — the edition's
 * dates, say. The footer renders those as text instead of inventing an anchor
 * for them. `icon` is optional per link, but every link in one column should
 * agree.
 */
export type FooterContent = {
  /** Optional: a route whose footer is a short index reads better without it. */
  mission?: string;
  columns: ReadonlyArray<{
    title: string;
    links: ReadonlyArray<{ label: string; href?: string; icon?: IconName }>;
  }>;
  legal: ReadonlyArray<{ label: string; href: string }>;
  social: ReadonlyArray<{
    id: "instagram" | "linkedin";
    label: string;
    href: string;
  }>;
  /**
   * The direct channels listed under the chip, each with the glyph its `id`
   * selects. Per route, because the inbox that answers depends on what the
   * page is about: the Academia's consultas go to its own address.
   */
  channels: ReadonlyArray<{
    id: "whatsapp" | "email";
    label: string;
    href: string;
  }>;
  /* `value` is the chip's label. There was a `label` beside it that no footer
     ever rendered. */
  contact: { value: string; href: string };
};

/**
 * The one line every footer opens with. It is the company's, not a route's,
 * which is why it is here and the four `FooterContent` objects are not: each
 * of those indexes the page it belongs to and lives beside it.
 */
/**
 * Every route but the current one, home first: the way on from the bottom of
 * any page without going back up to the menu.
 */
export function exploreColumn(current: string) {
  return {
    title: "Explorá",
    links: [homeLink, ...navigation]
      .filter((item) => item.href !== current)
      .map(({ label, href, icon }) => ({ label, href, icon })),
  };
}

export const footerMission =
  "Optimizamos procesos de negocio desarrollando software de calidad con tecnologías de vanguardia.";
