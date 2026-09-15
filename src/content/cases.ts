/* The four cases, with the client each one belongs to. */

export const casesContent = {
  index: "03",
  eyebrow: "Casos de éxito",
  title: "Agentes que ya están trabajando",
  description:
    "Cada uno fue el primer agente de su empresa: un proceso concreto que hoy funciona y que abrió la puerta a todo lo que sigue.",
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
        src: "/logos/united-logistic-company.jpg",
        width: 557,
        height: 395,
        displayHeight: 56,
        invertOnLight: false,
      },
    },
    {
      id: "comex",
      icon: "document",
      area: "Documentación",
      title: "Lectura automática de documentación de comex",
      description:
        "Interpreta BL, facturas y certificados, incluso escaneados, y sólo señala lo que necesita criterio humano.",
      result: "Cerca de 40 importaciones por mes sin digitación",
      logo: {
        name: "Ascend Laboratories",
        src: "/logos/ascend-laboratories.png",
        width: 1397,
        height: 520,
        displayHeight: 44,
        invertOnLight: false,
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
        invertOnLight: false,
      },
    },
    {
      id: "ventas",
      icon: "chat",
      area: "Comercial",
      title: "Chats de venta gestionados con IA",
      description:
        "Centraliza las conversaciones de los vendedores y permite delegarlas a un asistente que no deja lead sin responder.",
      result: "Ninguna oportunidad sin atender",
      logo: {
        name: "twistic",
        src: "/logos/twistic.png",
        width: 402,
        height: 94,
        displayHeight: 30,
        invertOnLight: true,
      },
    },
  ],
} as const;

export type CaseStudy = (typeof casesContent.cases)[number];

/*
 * `clientsContent` and the "Confían en Novit" strip under the case grid are
 * gone. A separate row of logos was the right shape while the cases had to
 * stay anonymous — it said who the clients are without saying which system
 * belonged to whom. Now that every case names its own client the strip only
 * repeated the same four marks a screen apart, so the logos moved onto the
 * cards and the strip was deleted. The logo data lives on each case in
 * `casesContent` above.
 */
