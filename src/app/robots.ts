import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Written once at build time, which a static export requires.
export const dynamic = "force-static";

/**
 * The AI assistants' crawlers, named so the choice is on record: Novit wants
 * to be cited when someone asks an assistant about software and AI, so they
 * are let in like any search engine. Taking one out of this list does not
 * block it — the `*` rule still lets it in; blocking means a `disallow`.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
];

/**
 * `/robots.txt`: every page open to search engines and to AI assistants, and
 * where the sitemap is. The Markdown version for language models is found by
 * its own convention, at `/llms.txt`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
