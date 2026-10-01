import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { PageTransitions } from "@/components/providers/PageTransitions";
import { SceneAtmosphere } from "@/components/layout/SceneAtmosphere";
import { CurtainGround, CurtainMark } from "@/components/layout/PageCurtain";
import { heroContent } from "@/content/home";
import { metadataContent, site } from "@/content/site";
import { basePath } from "@/lib/base-path";
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
 * The flags stamped before the first paint — and the way on to https.
 *
 * `data-motion="on"` says scripts are running and motion is welcome. The
 * resting states of every reveal in `globals.css` hang off it, so a visitor
 * without JavaScript, a crawler, or anyone who asked for reduced motion gets
 * the finished page instead of a hidden one.
 *
 * `data-curtain="intro"` closes the page behind the curtain for the opening
 * (see `PageTransitions` and curtain.css), under the same condition and on
 * the home page alone: the logo opens the site's front door, not every page
 * someone lands on.
 *
 * It has to be inline and it has to be here, before the body parses: set from
 * an effect it would paint the finished page and then hide it.
 *
 * Ahead of both, a visit over plain http to the site's own host goes on to
 * https before anything paints. GitHub Pages does that itself while "Enforce
 * HTTPS" is on — but it turns that off whenever the custom domain is set
 * again, and will not turn it back on until a new certificate is issued, and
 * meanwhile the site was served over http as "not secure". Only the site's
 * host, so a local server is left alone.
 *
 * And `data-news-over`, once the home hero's announcement is past its date
 * (`heroContent.announcement.until`): the site is static and nothing rebuilds
 * it the night the date passes, so the browser's clock takes the strip down.
 * Set on the document, it holds through client-side navigation too.
 */
const PRE_PAINT_SCRIPT = `try{var l=location;if(l.protocol==="http:"&&l.host===${JSON.stringify(new URL(site.url).host)})l.replace("https://"+l.host+l.pathname+l.search+l.hash)}catch(e){}try{if(Date.now()>=${Date.parse(heroContent.announcement.until)})document.documentElement.dataset.newsOver="on"}catch(e){}try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){var d=document.documentElement.dataset,p=location.pathname,b=${JSON.stringify(basePath)};d.motion="on";if(p===b||p===b+"/"||p===b+"/index.html")d.curtain="intro"}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /*
     * `suppressHydrationWarning` is here for PRE_PAINT_SCRIPT below, and
     * only for that. The script runs before React hydrates and stamps
     * `data-motion` and `data-curtain` onto this element, which React
     * rendered on the server without them — so hydration finds attributes on
     * the DOM that are not in its tree and logs a mismatch.
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
        {/* The curtain's ground under the page and its mark over it, so the
            page opens out of one while the logo leaves above it. */}
        <CurtainGround />
        <div data-page-stage className="page-stage scene-ground">
          <div data-page-lens className="page-lens">
            {/*
              The atmosphere. Order here is the only thing stacking these: they
              are all `position: fixed` with no z-index, so they paint in tree
              order, above the stage's gradient and below the scroll shell's
              content. Moving one after <SmoothScroll> hides it behind the
              page; giving one a z-index forces explicit stacking on all of
              them. See scene.css.
            */}
            <SceneAtmosphere />
            <SmoothScroll>
              <PageTransitions />
              {children}
            </SmoothScroll>
          </div>
        </div>
        <CurtainMark />
      </body>
    </html>
  );
}
