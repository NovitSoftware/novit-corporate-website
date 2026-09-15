# Novit — brand documentation

Summary layer for this bucket. Full documents are the source of truth; this only
tells you what they decide and what is still open.

Read `novit-brand-core.md` (what Novit says) and `novit-design-system.md` (how it
looks) together. Status markers used in both: ✅ decided · 🔴 to decide · ⚠️ verify.

## novit-brand-core.md · v0.1 (ago 2026)

Brand platform: identity, positioning, voice. Strategy layer the brandbook will be
built from — deliberately not the brandbook itself.

Key decisions:

- **Official figures (cap. 01)** — single source for every number. No client count is
  published; credibility rides on relationship length ("desde 2015" over "11 años").
- **Identity (caps. 02–04)** — purpose *"Hacemos simple lo complejo"*; four values
  (Confianza, Excelencia, Flexibilidad, Compañerismo y aprendizaje) each defined by
  observable behaviors. "Somos nerds" is tone, not a value.
- **Positioning (cap. 05)** — stop selling hours, sell business impact. Five
  differentials; client owns the IP from day zero and know-how transfers. Canonical
  term for the AI line: *"agentes integrados"*.
- **AI narrative (cap. 05)** — three dimensions (how we work / what we build / how it
  is sustained), told in order 3 → 2; dimension 1 almost never leads.
- **Regla de la prueba concreta** — the document's most important comms rule: enter
  through market interest, close with a measurable result. No magic promises.
- **Audiences (cap. 06)** — business areas (finance, commercial), not the CTO.
  Real estate is industry experience, not a declared vertical.
- **Voice (cap. 07)** — close, expert, direct; positive framing only (say what we do,
  never what we don't); blacklist: journey, disruptivo, sinergia, end-to-end…
- **Offer (cap. 08)** — custom development / staff augmentation / AI. UX and QA are
  part of the method, not service lines.

Still open 🔴: which AI conversation level the brochure keeps (1), client naming
policy (2), objection handling for sales (3), governance owners (4).

## novit-design-system.md · v0.2 (sep 2026)

Visual system for commercial material. Keeps the 2024 identity; moderates the
expressive layer for sales pieces. **The AI & Tech Radar is the reference piece —
when this document and the radar disagree, the radar wins.**

Key decisions:

- **Commercial palette (cap. 01)** — azul `#0A0089` dominant, celeste `#3DB0E4`
  accent on dark, cyan `#3398DC` accent on light (labels only — fails AA for small
  text), body text `#333333` (not black), 7-step gray ramp.
- **Violet means Novit speaking (cap. 01)** — `#510371` for Novit's own voice,
  violet ramp for the closing gradient. Magenta `#BA08A8` is out of commercial
  material; survives in social media.
- **Two gradients (cap. 01)** — header (blue ramp) and closing (violet ramp), angle
  fixed at `100deg`, always with a solid `background-color` fallback, never behind
  long-form text.
- **Typography (cap. 02)** — Lato as the single family (weights 300/400/700/900
  only; 500/600/800 don't exist). Arrows are drawn as SVG — the Google Fonts latin
  subset ships no `→`. Pending 🔴: self-hosting Lato instead of Google Fonts.
- **Logo & resources (caps. 03–04)** — unchanged; watermark at 7–8% opacity.

Still open 🔴: validate the Effra → Lato switch, logo clear space and minimum size,
retiring the 2015 grays, a business-process photo bank.

## academia-novit.md

Temario v2 (octubre 2026) of the Academia Novit course *Desarrollo de Agentes IA y
Software Agéntico*: 32 hs — 14 theory-practice classes plus 2 consultation workshops,
Tue/Fri 16–18, 13/10/2026 → 04/12/2026. Five modules: Fundamentos; Contexto y
conocimiento (context engineering, RAG over PostgreSQL/pgvector); Arquitectura y
orquestación; Modelos, costos y ejecución (Azure AI Foundry, local/edge); Producción
(security and observability). Not entry-level — OOP, Git/HTTP and REST APIs assumed.
Copy source for the site's Academia section.

## novit-marca-tokens.html

Technical reference: exact colors, gradients and the SVG arrow vector with swatches.

## brochures/transformacion-ia-brochure.md

Structured transcript of the 2026 AI presentation *Partners de transformación IA*
(ingested from `source/transformacion-ia-brochure.raw.md`): risks of buying loose
agents, the
partner role (stack / measurement / security / vendor scrutiny), the shared
infrastructure (corporate RAG, identity & SSO, integration layer, swappable models),
four production cases (United Logistic Company, Ascend Laboratories, GAMMA, Twistic)
and the evolution path from first agent to corporate strategy. Source of the AI
narrative in cap. 05 of `novit-brand-core.md`; copy reference for this website's
services and safety sections.

## source/

The client's own files: the *Transformación IA* deck (PDF and its raw text
extraction), the Academia temario as supplied, and the icon PNG. Provenance
only — every one of them has a readable write-up above. See
[`source/README.md`](source/README.md), which also records how to render the PDF
on this machine.
