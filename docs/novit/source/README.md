# Source material

The originals every document in `docs/novit/` was written from. Nothing here is
meant to be read directly — the readable versions live one level up. Keep these
so a claim can always be traced back to the thing the client actually sent.

| File | What it is | Written up as |
|---|---|---|
| `transformacion-ia-brochure.pdf` | The 2026 *Partners de transformación IA* deck, 6 slides. **The design authority for `/inteligencia-artificial`**: band order, band headings and card design all come from here. | [`../brochures/transformacion-ia-brochure.md`](../brochures/transformacion-ia-brochure.md) |
| `academia-novit-temario.raw.md` | Temario v2 of the Academia Novit course, as supplied. No PDF exists for this one, so it is the only original. | `../academia-novit.md` |
| `isotipo-novit-favicon.png` | The site icon as supplied, 192×192, gradient ground already baked in. | `src/app/icon.png` and `src/app/apple-icon.png` (byte-identical copies) |

## Reading the PDF on Windows

`pdftotext -layout` is available through Git Bash and gets the copy out.
`pdftoppm`, `pdftocairo` and `pdfinfo` are not installed and node-canvas will not
build here, so to *see* the pages: install `pdfjs-dist` in a scratch directory,
render each page to a `<canvas>` inside Playwright's Chromium and screenshot the
canvas. The embedded fonts come out as tofu boxes, but layout and colour are
exact — which alongside the fresh `pdftotext` extraction is enough to work from.
