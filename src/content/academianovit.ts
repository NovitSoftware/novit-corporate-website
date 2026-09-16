/* ==========================================================================
   `/academianovit` — the programme, the page around it and its own footer.

   The home page's Academia band is not here: it states the load in its own
   words and lives in `home.ts`, so this file has one reader.
   ========================================================================== */

import { academyContact, type FooterContent } from "./shared";

/**
 * The programme, in full, and the single source for it.
 *
 * Everything here comes from `docs/novit/academia-novit.md`, the temario.
 *
 * ## What came out, and why it is not recoverable from a comment
 *
 * `objective`, `definition`, `requirements` and `entryLevel` are gone with the
 * two bands that rendered them — "Qué es" and "A quién está dirigida". They
 * were the aim of the course quoted from the temario, the agent/agentic-software
 * distinction, and the four prerequisites with the "no es de nivel inicial"
 * note. Removing them was asked for directly; what is left describes how the
 * course runs rather than arguing who should take it. The temario at
 * `docs/novit/academia-novit.md` is the source and still has every word of it,
 * so restoring a band is a copy from there, not an archaeology exercise.
 *
 * Still no calendar beyond `edition`. Class-by-class dates and delivery
 * deadlines belong to one cohort and would be wrong the moment it closes.
 */
export const academyProgram = {
  format: {
    facts: [
      { label: "Carga total", value: "32 horas", icon: "clock" },
      { label: "Clases", value: "14", icon: "academy" },
      { label: "Talleres de consulta", value: "2", icon: "team" },
      { label: "Modalidad", value: "100% online", icon: "globe" },
    ],
    /**
     * The five blocks, in the order they are taught.
     *
     * They were titles alone for a while, on the reasoning that naming what
     * each block covers commits the course to teach exactly that. Five
     * two-word headings turned out to describe nothing — a reader could not
     * tell what "Contexto y conocimiento" meant without the temario open — so
     * each block now carries one sentence and its load.
     *
     * Every `detail` is a compression of that block's bullets in
     * `docs/novit/academia-novit.md` §Contenidos. Not a new claim: if the
     * temario changes, these change with it and nothing else here does.
     *
     * No per-block hours. They were here — "3 clases · 6 h" under each title,
     * from §Duración y modalidad — and they turned the panel into a timetable.
     * The totals a reader needs are already in the opener's stat row.
     */
    modules: [
      {
        title: "Fundamentos",
        icon: "agent",
        detail:
          "La anatomía de un agente como sistema de software —proveedor de LLM, contexto, tools, memoria y loop de control—, qué cambia respecto de un sistema tradicional, y el diseño de tools con contratos claros sobre Model Context Protocol.",
      },
      {
        title: "Contexto y conocimiento",
        icon: "database",
        detail:
          "Qué se le manda al modelo y por qué: presupuesto de contexto, selección y compactación. RAG sobre PostgreSQL con pgvector, la calidad de la recuperación y cuándo no usarlo. Memoria de corto y largo plazo.",
      },
      {
        title: "Arquitectura y orquestación",
        icon: "link",
        detail:
          "Prompt chaining, routing, parallelization, orchestrator-workers y evaluator-optimizer, y cuándo alcanza un workflow determinístico en lugar de un agente. Handoff entre agentes, multimodalidad y validación humana antes de escribir en sistemas operativos.",
      },
      {
        title: "Modelos, costos y ejecución",
        icon: "coin",
        detail:
          "Proveedores en la nube y sus límites de costo y de uso, criterio para elegir modelo según propósito y latencia, ejecución local y en la nube, y el costo por resolución medido en tokens y tiempo.",
      },
      {
        title: "Producción, seguridad y observabilidad",
        icon: "shield",
        detail:
          "Prompt injection, guardrails y permisos acotados al mínimo en cada sistema que el agente toca. Registrar la decisión y no sólo la respuesta: reintentos, timeouts, fallos parciales y trazabilidad auditable.",
      },
    ],
  },
  /**
   * How the work is marked.
   *
   * ## This band has no source document, and that is a standing problem
   *
   * `docs/novit/academia-novit.md` covers the aim, the objectives, the
   * prerequisites, the load and every module — and says nothing at all about an
   * evaluation. No trabajo integrador, no partial deliveries, no marking
   * scheme, no sector. Its one occurrence of "evaluación" is "evaluación
   * sistemática de agentes y armado de datasets de prueba", which is a topic
   * taught inside the Producción module, not a way of grading anyone.
   *
   * So `description` and the three headings below are the one part of this page
   * that is not a reading of the temario. They are kept because they are
   * already published and read well, and the details are written against the
   * objectives the temario *does* state — efficiency in cost and response time,
   * defences on user input, minimum permissions, explicit identity — so the
   * band at least says nothing the course document contradicts. Anything
   * further has to come from a document, not from here.
   */
  evaluation: {
    description:
      "Trabajo práctico integrador con entregas parciales obligatorias, corrección por aprobado o desaprobado y devolución personalizada. Se corrige el sistema entregado, no el examen: las tres preguntas de abajo se aplican juntas a la misma entrega.",
    criteria: [
      {
        title: "Que funcione",
        icon: "check",
        detail:
          "El sistema resuelve el problema planteado de punta a punta: el agente cumple su objetivo utilizando las herramientas y el contexto necesarios para hacerlo.",
      },
      {
        title: "Que sea eficiente",
        icon: "metric",
        detail:
          "El modelo elegido corresponde a la tarea por propósito, costo y latencia, y el costo por resolución se mide en tokens y en tiempo de respuesta en lugar de estimarse.",
      },
      {
        title: "Que sea seguro",
        icon: "lock",
        detail:
          "El agente debe operar bajo un conjunto de límites explícitos: entradas validadas, permisos mínimos y herramientas restringidas según su propósito. Las instrucciones del usuario no deben permitirle ejecutar acciones fuera de las capacidades y autorizaciones definidas.",
      },
    ],
  },
  /**
   * The edition, with its dates.
   *
   * These were deliberately left out once, on the reasoning that a calendar
   * goes stale the moment a cohort closes. That was the wrong call for a
   * course whose edition is open: a reader deciding whether to apply needs to
   * know when it runs and whether they can make the timeslot, and "32 horas"
   * does not answer either. It is one object, so retiring an edition is
   * editing one place.
   */
  edition: {
    label: "Edición 2026",
    facts: [
      { label: "Cursada", value: "13/10/2026 → 04/12/2026", icon: "calendar" },
      { label: "Días", value: "Martes y viernes", icon: "calendar" },
      { label: "Horario", value: "16 a 18 h (ART)", icon: "clock" },
    ],
  },
} as const;

/**
 * Everything on `/academianovit` that is not the programme itself.
 *
 * The programme lives in `academyProgram`; this is the page's own
 * scaffolding — its metadata, the words that open it and the heading of each
 * band. Nothing is repeated from it: the page reads both.
 *
 * ## Three bands
 *
 * The course as it runs: the opener, the five blocks, the marking criteria.
 * `docs/novit/academia-novit.md` carries the rest of the temario, and it is
 * the source for every word here.
 *
 * ## The way in is an inbox
 *
 * The opener's button is a `mailto:` to the Academia's own address, not an
 * anchor — it is the only way to ask about the cursada, so it is on the one
 * button the page has and a reader never has to scroll to find it.
 */
export const academyPageContent = {
  meta: {
    title: "Academia Novit — Desarrollo de Agentes IA y Software Agéntico",
    description:
      "Cursada de 32 horas sobre diseño y construcción de sistemas agénticos: arquitectura, orquestación, contexto, costos, seguridad y observabilidad.",
  },
  eyebrow: "Academia Novit",
  title: "Desarrollo de Agentes IA y Software Agéntico",
  lead: "Una cursada de 32 horas sobre cómo se diseña, se construye y se sostiene un sistema agéntico: arquitectura, orquestación, contexto, costos, seguridad y observabilidad.",
  /* Not "Inscribirse" and not "Cuándo abre la inscripción": the first promises
     a mechanism that is not decided, the second a date this site does not
     publish. A consulta is what the inbox actually takes. */
  cta: { label: "Consultanos", href: academyContact.email.href },
  /** One heading per band, in reading order. No indices — see `AcademyPage`. */
  sections: {
    schedule: {
      id: "cursada",
      eyebrow: "Cursada",
      title: "Sistemas agénticos: diseño, arquitectura y producción",
      lead: "La cursada trabaja el diseño y la construcción de sistemas agénticos: cómo está hecho un agente por dentro, qué patrones lo orquestan, y con qué criterio se elige proveedor de modelo, estrategia de recuperación, modo de ejecución y nivel de autonomía según el problema, el costo, el tiempo de respuesta y el riesgo. Teoría y práctica en la misma clase, más dos talleres de consulta para las entregas. Todo online.",
    },
    evaluation: {
      id: "evaluacion",
      eyebrow: "Evaluación",
      title: "Un trabajo integrador del sector energético",
    },
  },
} as const;

/**
 * The footer on `/academianovit`, and it is about the Academia only.
 *
 * The site-wide footer indexes the home page: Nosotros, Equipo, Contacto,
 * Casos, Seguridad, plus `/inteligencia-artificial`. Rendered under the
 * Academia it turned the bottom of a page about a course into a way out of it,
 * which is the opposite of what the page is for — a reader who got to the end
 * of the temario is deciding whether to write, not shopping the rest of the
 * site.
 *
 * So the one column here is the edition this page is announcing, no link
 * leaves the route, and the inbox is the chip: on this page it is the only
 * thing to do. Novit's own accounts stay in the row below, because that is the
 * site's identity rather than navigation.
 *
 * No mission line under the logo and no index of the page's own bands: this
 * footer sits three screens below an opener that says the same thing, under a
 * page short enough to scroll back up.
 */
export const academyFooterContent: FooterContent = {
  columns: [
    {
      /* Facts, not links — there is nowhere on this page for a date to go. */
      title: academyProgram.edition.label,
      links: academyProgram.edition.facts.map((fact) => ({
        label: `${fact.label}: ${fact.value}`,
      })),
    },
  ],
  legal: [],
  social: academyContact.social,
  /* The Academia's inbox alone. The WhatsApp number is the company's
     commercial line and answers for sales, not for a question about the
     cursada. */
  channels: [
    {
      id: "email",
      label: academyContact.email.label,
      href: academyContact.email.href,
    },
  ],
  contact: {
    value: "Consultanos",
    href: academyContact.email.href,
  },
};
