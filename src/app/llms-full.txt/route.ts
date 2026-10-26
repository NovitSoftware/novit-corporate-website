import { llmsFull } from "@/lib/llms";

// Written once at build time, which a static export requires.
export const dynamic = "force-static";

/** `/llms-full.txt`: the whole site's content as one Markdown file. See `@/lib/llms`. */
export function GET() {
  return new Response(llmsFull(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
