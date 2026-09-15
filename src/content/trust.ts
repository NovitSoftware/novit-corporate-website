/* The Confianza band: criterio, seguridad y gobierno. */

export const safetyContent = {
  index: "04",
  eyebrow: "Confianza",
  title: "Criterio, seguridad y gobierno",
  /* This read "Construir un agente se está volviendo commodity. Lo que no se
     commoditiza es el criterio que evita seis stacks que no se hablan y ningún
     activo propio." — the sales argument of the brochure, stated in a band
     whose subject is how client data is handled. The same four pillars below
     are what the band actually has to say, so the statement names the
     principle they come from instead of arguing against a competitor. */
  statement:
    "Tratamos la inteligencia artificial como infraestructura de la empresa, y una infraestructura se diseña con su gobierno adentro.",
  description:
    "Datos en red privada, identidad corporativa, trazabilidad de cada consulta y cumplimiento normativo. La solución queda documentada y es del cliente desde el día uno.",
  /* No `cta`. It read "Leer el enfoque de gobierno" and went to
     /inteligencia-artificial; with no route to send anyone to, a second
     "Solicitar cotización" two bands under the first one is chrome. The four
     pillars are the whole argument this band has to make. */
  pillars: [
    {
      icon: "lock",
      title: "Datos bajo control",
      description:
        "Procesamiento en la red privada del cliente. Sabemos qué información sale, dónde se procesa y con qué se entrena.",
    },
    {
      icon: "key",
      title: "Identidad y trazabilidad",
      description:
        "Permisos por usuario en cada consulta. Una auditoría tiene qué mirar: quién preguntó, qué se respondió y quién lo autorizó.",
    },
    {
      icon: "shield",
      title: "Cumplimiento",
      description:
        "Diseñamos para GDPR y para las reglas de la organización. El gobierno no es un anexo: es parte de la arquitectura.",
    },
    {
      icon: "check",
      title: "Propiedad del cliente",
      description:
        "Código, conocimiento y componentes quedan como activo de la empresa. Si se va un proveedor, no se va la capacidad.",
    },
  ],
} as const;
