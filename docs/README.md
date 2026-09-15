# Documentation

Three buckets, one rule: a file lives where its content applies, not where it was found.

```
docs/
├── novit/       Company-level: brand, visual system, brochure collateral
├── app/         This repository: architecture, conventions, content decisions
└── external/    Everything else: third-party references, client material
```

## novit/

Applies to **every Novit property** (site, proposals, decks, social), not just this
codebase. Filenames keep the `novit-` prefix because the documents cross-reference
each other by that exact name.

| File | What it is |
|---|---|
| `novit/README.md` | Summary layer: what each document decides, what is still open |
| `novit/novit-brand-core.md` | Brand platform: who we are, what we promise, how we speak |
| `novit/novit-design-system.md` | Visual system: tokens, typography, grid, templates |
| `novit/academia-novit.md` | Academia Novit syllabus: 2026 course on building AI agents and agentic software |
| `novit/novit-marca-tokens.html` | Exact colors and gradients, with swatches — the technical reference |
| `novit/brochures/` | Brochure collateral (brochure transcripts used as copy sources) |
| `novit/source/` | The originals everything above was written from: the client's PDF, the temario as supplied, the supplied icon |

Read `novit-brand-core.md` and `novit-design-system.md` together: the first defines
what Novit says, the second how it looks.

## app/

Docs scoped to **this website only**: architecture notes, conventions, motion
decisions, content mapping between sources and sections. Anything that stops being
true if the repo changes belongs here.

## external/

Reference material that is neither brand nor app: third-party docs, client-supplied
material, vendor specs.
