import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SceneAtmosphere } from "@/components/layout/SceneAtmosphere";
import { metadataContent, site } from "@/content/site";
import "./globals.css";

/**
 * Lato has 100, 300, 400, 700 and 900 — and no 500, 600 or 800. A rule asking
 * for one of those does not fail, the browser resolves to the nearest weight
 * and the result changes with the engine, so only these are ever named.
 * 900 carries the display type, the way the manual's own cover sets its title.
 */
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  /* The tab always reads "Novit Software", on every route: a page-specific
     title here would need every child route to repeat it (or override it) to
     keep the tab from drifting per page, and the tab is not where the fuller,
     descriptive title belongs anyway — that's `openGraph`/`twitter`, for a
     link card, where there's room for one. */
  title: site.name,
  description: metadataContent.description,
  applicationName: site.name,
  openGraph: {
    title: metadataContent.title,
    description: metadataContent.description,
    url: site.url,
    siteName: site.name,
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: metadataContent.title,
    description: metadataContent.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0089",
};

/**
 * One flag, stamped before the first paint.
 *
 * `data-motion="on"` says scripts are running and motion is welcome. The
 * resting states of every reveal in `globals.css` hang off it, so a visitor
 * without JavaScript, a crawler, or anyone who asked for reduced motion gets
 * the finished page instead of a hidden one.
 *
 * It has to be inline and it has to be here, before the body parses: set from
 * an effect it would paint the finished page and then hide it.
 */
const PRE_PAINT_SCRIPT = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.motion="on"}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /*
     * `suppressHydrationWarning` is here for PRE_PAINT_SCRIPT below, and
     * only for that. The script runs before React hydrates and stamps
     * `data-motion="on"` onto this element, which React rendered on the
     * server without it — so hydration finds an attribute on the DOM that is
     * not in its tree and logs a mismatch.
     * React named it exactly:
     *
     *     <html lang="es" className="...">
     *   -   data-motion="on"
     *
     * The attribute has to be set that early: every reveal's resting state in
     * globals.css hangs off it, so waiting for an effect would paint the
     * finished page and then hide it. This flag makes React skip diffing
     * attributes and text on this one element; it does not extend to
     * descendants, so a real mismatch anywhere else still reports.
     *
     * `SmoothScroll` also writes `--scene-*` custom properties to this
     * element, but it does that in an effect after hydration, which is not a
     * mismatch and needs no suppression.
     */
    <html
      lang="es"
      className={`${lato.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full overflow-hidden font-sans">
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT_SCRIPT }} />
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {/*
          The atmosphere. Order here is the only thing stacking these: they are
          all `position: fixed` with no z-index, so they paint in tree order,
          above `body`'s gradient and below the scroll shell's content. Moving
          one after <SmoothScroll> hides it behind the page; giving one a
          z-index forces explicit stacking on all of them, and a negative one
          drops it behind the canvas background entirely. See globals.css.
        */}
        <SceneAtmosphere />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
