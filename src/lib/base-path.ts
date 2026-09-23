/**
 * The sub-path the site is served under, e.g. `/novit-corporate-website` on
 * GitHub Pages. Empty in development and on a custom domain.
 *
 * `next/link` would add it on its own, but every internal link on this site is
 * a plain `<a href>` and every asset is a root-relative string, so anything
 * that points into the site goes through `withBasePath`.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefixes a root-relative path; leaves external, mailto, tel and hash hrefs alone. */
export function withBasePath(href: string): string;
export function withBasePath(href: string | undefined): string | undefined;
export function withBasePath(href: string | undefined) {
  if (!href || !basePath) return href;
  return href.startsWith("/") && !href.startsWith("//") ? basePath + href : href;
}
