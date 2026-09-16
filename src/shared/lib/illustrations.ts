/**
 * The illustration set, and the one place a section names one.
 *
 * ## Where they come from and what was changed
 *
 * Eight unDraw drawings, supplied for this site. Two substitutions were made
 * across all eight and nothing else was touched:
 *
 * - unDraw's default accent `#6c63ff` — a lavender purple that reads as
 *   nobody's brand — became cyan `#3398DC`. That is the design system's accent
 *   *for light grounds*, which is the right one here: these are drawn for
 *   light, and they are presented on a light plate (see `Illustration`).
 * - `#d6d6e3`, a lavender-tinted grey that only existed to sit under that
 *   purple, became a neutral cool grey so no lilac cast survives.
 *
 * Everything else — the near-white paper shapes, the dark navy details, the
 * skin tones — is as drawn. They were built to work on a light surface and
 * they do; recolouring them further would mean inverting their tonal logic and
 * is what makes a restyled stock illustration look broken.
 *
 * ## Why they sit on a plate
 *
 * This site's ground is the brand gradient from end to end, and these are
 * light-ground drawings: dropped straight onto it, their dark details close up
 * and their accent fights the blue behind it. The design system already allows
 * the surface grey — "entre uno y otro, la página va en blanco o en #F3F6F8" —
 * so a light plate is a system surface rather than an invention, and it gives
 * a card the one bright anchor that makes it scannable.
 *
 * ## Dimensions, and why they decide where a drawing can go
 *
 * Intrinsic sizes, rounded from each file's own `viewBox`. `next/image` needs
 * them to reserve space before the bytes land, and a wrong ratio here shows up
 * as a jump on load. They are also the constraint on placement: `Illustration`
 * contains rather than crops, so a drawing in a plate that does not match its
 * ratio simply gets smaller, and a row of cards where one picture is half the
 * size of the others reads as broken. The set runs from 0.64 to 2.09, which is
 * three groups, not one:
 *
 * - near-square (0.91–1.06): `context`, `answers`, `extraction`
 * - wide (1.34–2.09): `research`, `conversation`, `documents`, `coding`
 * - tall (0.64): `intelligence`
 *
 * ## What is placed
 *
 * The near-square three, in the home page's `HighlightCard` row — the one card
 * type built around a picture, and a square plate holds all three at the same
 * scale. Nothing else on the site has a slot a stock drawing improves: the
 * cases lead with the client's own logo, the offer lines are wide and short so
 * a picture in one column empties the other, and both openers already carry a
 * device of their own (the home hero's scene, the AI page's architecture
 * diagram). Five entries therefore have no consumer, on purpose — this is an
 * asset catalogue, and using four badly would be worse than using three well.
 */
export const ILLUSTRATIONS = {
  /** A head wired into a circuit. The AI practice itself. */
  intelligence: {
    src: "/illustrations/artificial-intelligence.svg",
    width: 458,
    height: 720,
    alt: "Diagrama de un sistema de inteligencia artificial conectado a sus componentes",
  },
  /** A grid of squares filling in — and the closest thing here to the
   *  isotipo's own grid, which is why it carries the shared architecture. */
  context: {
    src: "/illustrations/ai-context.svg",
    width: 724,
    height: 800,
    alt: "Una grilla de datos indexados alimentando el contexto de un modelo",
  },
  /** Fields being lifted off a document. */
  extraction: {
    src: "/illustrations/ai-data-extraction.svg",
    width: 846,
    height: 800,
    alt: "Extracción automática de datos desde documentos",
  },
  /** A document read and cross-checked. */
  documents: {
    src: "/illustrations/ai-document-analysis.svg",
    width: 960,
    height: 471,
    alt: "Análisis automático de documentación",
  },
  /** Someone working with an assistant beside them. */
  research: {
    src: "/illustrations/ai-research-assistant.svg",
    width: 960,
    height: 717,
    alt: "Una persona trabajando con un asistente de inteligencia artificial",
  },
  /** A question, and where the answer comes from. */
  answers: {
    src: "/illustrations/ai-answers.svg",
    width: 732,
    height: 763,
    alt: "Consultas respondidas sobre el conocimiento de la empresa",
  },
  /** A conversation handled by an assistant. */
  conversation: {
    src: "/illustrations/chat-with-ai.svg",
    width: 801,
    height: 567,
    alt: "Una conversación de venta atendida por un asistente",
  },
  /** Code, and a second pair of eyes on it. */
  coding: {
    src: "/illustrations/coding-assistant.svg",
    width: 960,
    height: 459,
    alt: "Desarrollo de software asistido por inteligencia artificial",
  },
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;
