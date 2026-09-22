/* ==========================================================================
   The two agents in production, and the shape a client's mark comes in.

   Read by `/`, `/inteligencia-artificial` and `/casos-de-exito`, each under
   its own heading, which is what puts them here rather than in one of them.
   ========================================================================== */

/**
 * A client's mark, as the file actually is.
 *
 * Every file is white ink on transparency or carries its own colour block, so
 * a mark needs no ground of its own — see `CaseLogo`. The numbers are the
 * PNG's, which `next/image` needs; `displayHeight` is what it is set to on
 * screen, per file, so a wide wordmark and a square badge come out looking the
 * same size, which matching heights would not do.
 */
export type ClientLogo = {
  readonly name: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly displayHeight: number;
};

/* The cases, with the client each one belongs to. Rendered on the home page
   and again on `/inteligencia-artificial`, each under its own heading. */

export const casesContent = {
  index: "03",
  eyebrow: "Casos de éxito",
  title: "Agentes que ya están trabajando",
  /* Textual del brochure §04. Estuvo reescrito acá como "En las dos empresas
     fue el primer agente que entró en producción…", que es copy nueva sobre
     una fuente que ya existe. La banda dice lo que dice la presentación. */
  description:
    "Cada uno fue el primer agente de su empresa: un proceso concreto que hoy funciona y que abrió la puerta a todo lo que sigue.",
  /* La columna que el brochure pone sobre esta cifra en su tabla de casos.
     Estaba escrita como literal en `CaseCard`. */
  resultLabel: "Resultado",
  cases: [
    {
      id: "arancelaria",
      icon: "search",
      area: "Comercio exterior",
      title: "Clasificación arancelaria asistida",
      description:
        "Años de antecedentes y criterio experto convertidos en un agente que encuentra el código arancelario para la declaración aduanera.",
      result: "De horas de búsqueda a segundos",
      logo: {
        name: "United Logistic Company",
        src: "/logos/united-logistic-company.png",
        width: 556,
        height: 395,
        displayHeight: 56,
      },
    },
    {
      id: "sap",
      icon: "coin",
      area: "Administración",
      title: "Facturación automatizada contra SAP",
      description:
        "Interpreta las facturas de proveedores, arma la documentación en el ERP y captura datos de compra que antes se perdían.",
      result: "Dos personas liberadas de la carga manual",
      logo: {
        name: "Gamma Group",
        src: "/logos/gamma-group.png",
        width: 300,
        height: 54,
        displayHeight: 26,
      },
    },
  ],
} as const;

export type CaseStudy = (typeof casesContent.cases)[number];

/*
 * There is no `clientsContent` and no "Confían en Novit" strip: each case
 * names its own client, so the logo data lives on the case above and the
 * separate row of marks was removed.
 */
