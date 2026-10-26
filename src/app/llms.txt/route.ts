import { llmsIndex } from "@/lib/llms";

// Written once at build time, which a static export requires.
export const dynamic = "force-static";

/** `/llms.txt`: what the site is and where each part lives, for language models. See `@/lib/llms`. */
export function GET() {
  return new Response(llmsIndex(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
