# Academia Novit — Desarrollo de Agentes IA y Software Agéntico

**Temario · Octubre 2026 · Versión 2 — pendiente de validación final.**

---

## Objetivo general

Capacitar a los participantes en el diseño y la construcción de sistemas agénticos de
software: entender la arquitectura interna de un agente de IA, sus componentes y sus
patrones de orquestación, y adquirir criterio para elegir proveedor de modelo,
estrategia de recuperación de información, modo de ejecución y nivel de autonomía en
función del problema, el costo, el tiempo de respuesta y el riesgo.

> Un agente de IA es una entidad de software autónoma que cumple objetivos específicos.
> El software agéntico es el paradigma más amplio que diseña y coordina sistemas donde
> operan uno o varios agentes.

## Objetivos específicos

- Comprender la arquitectura de un sistema agéntico y sus componentes.
- Aplicar los patrones de orquestación de agentes y saber cuándo alcanza un workflow y cuándo hace falta un agente.
- Diseñar tools con contratos claros e integrar servidores MCP.
- Construir el contexto que recibe el modelo con criterio (context engineering) e implementar RAG sobre PostgreSQL.
- Consumir proveedores de LLM en la nube y administrar límites de costo y de uso.
- Comprender cuándo y para qué tiene sentido ejecutar un modelo de lenguaje en forma local o en el borde.
- Seleccionar el modelo adecuado para cada tarea según propósito, costo y latencia.
- Evaluar la eficiencia de un agente en términos de costo y tiempo de respuesta.
- Aplicar defensas de seguridad sobre entradas de usuario y definir permisos mínimos e identidad del agente.
- Instrumentar un sistema agéntico para que sus decisiones sean auditables.
- Manejar un vocabulario técnico común para discutir decisiones de arquitectura agéntica.

## Requisitos

- Manejo de un lenguaje de programación orientado a objetos.
- Conocimiento de Git, Web API y protocolo HTTP.
- Consumo de APIs REST y manejo de credenciales.
- Nociones de bases de datos relacionales.

No es una academia de nivel inicial: se dan por sentados los conocimientos
fundamentales de desarrollo de software y de consumo de APIs.

## Duración y modalidad

- Fundamentos: 3 clases de 2 horas
- Contexto y conocimiento: 3 clases de 2 horas
- Arquitectura y orquestación: 3 clases de 2 horas
- Modelos, costos y ejecución: 3 clases de 2 horas
- Producción — seguridad y observabilidad: 2 clases de 2 horas
- Talleres de consulta: 2 clases de 2 horas

**Total: 32 hs** — 14 clases teórico-prácticas y 2 talleres de consulta.

Clases martes y viernes de 16 a 18 hs, del 13/10/2026 al 04/12/2026.

## Contenidos

### Módulo · Fundamentos

- **Anatomía de un agente.** Un agente de IA como sistema de software: proveedor de LLM, contexto, tools, memoria y loop de control. Qué componentes son nuevos respecto de un sistema tradicional y cuáles se mantienen. Vocabulario técnico del dominio.
- **El LLM como componente.** API, mensajes, system prompt, tokens, ventana de contexto, structured output.
- **Tools y MCP.** Diseño de tools, contratos, idempotencia, manejo de errores. Model Context Protocol: qué resuelve y por qué quedó como estándar.
- **Introducción teórica al ciclo de vida de desarrollo con IA.** Cómo cambió el proceso de desarrollo de software: Spec-Driven Development, revisión asistida de pull requests, agentes de test. Se menciona sin profundizar.

### Módulo · Contexto y Conocimiento

- **Context engineering.** Qué se le manda al modelo y por qué, en contraposición al prompt engineering. Presupuesto de contexto, selección, compactación. Herramientas versus contexto.
- **RAG.** Concepto y lugar dentro de la arquitectura de un agente. Embeddings, chunking, similitud. Implementación sobre PostgreSQL con pgvector. Calidad de recuperación, metadata y filtros. Cuándo no usar RAG.
- **Memoria de agente.** Corto y largo plazo.

### Módulo · Arquitectura y Orquestación

- **Patrones de orquestación.** Prompt chaining, routing, parallelization, orchestrator-workers y evaluator-optimizer. Cuándo alcanza un workflow determinístico y cuándo hace falta un agente.
- **Agentes de control.** Un agente que evalúa, prueba o fuerza errores en otros agentes.
- **Patrones arquitectónicos.** Estado, handoff entre agentes, límites de responsabilidad, integración con sistemas existentes.
- **Multimodalidad.** Interpretación de audio e imágenes como herramientas del agente.
- **Human-in-the-loop.** Validación humana antes de que el agente escriba en sistemas operativos.

### Módulo · Modelos, Costos y Ejecución

- **Proveedores en la nube.** Azure AI Foundry: qué modelos hostea y cómo se consume. API keys, límites de costo y límites de requests por unidad de tiempo.
- **Modelos por propósito.** Razonamiento, tareas simples, generación de imágenes, interpretación de imágenes, audio. Criterio de selección por tarea.
- **Ejecución local y edge.** Requisitos de hardware, qué modelos corren y a qué velocidad, herramientas para levantarlos. Criterio local versus API. Operación sin conexión y cómputo en el lugar.
- **Costos y eficiencia.** Medición de tokens, latencia y costo por resolución. Caching, ruteo por costo, degradación controlada. Latencia como restricción de diseño.

### Módulo · Producción — Seguridad y Observabilidad

- **Seguridad.** Prompt injection, guardrails y filtrado de entradas que vienen directo del usuario. Permisos acotados al mínimo necesario en cada sistema con el que el agente se integra. Modelo de identidad y autorización explícito.
- **Observabilidad y confiabilidad.** Registrar la decisión del agente y no solo su respuesta. Intentos, timeouts, fallos parciales, idempotencia de las tools. Trazabilidad auditable. Qué implica llevar un agente de la demo a producción en una empresa mediana.
- **Mención:** evaluación sistemática de agentes y armado de datasets de prueba.

## Docencia

- **Docente titular:** Ing. Jonathan Velazquez.
- **Ayudantes:** Gustavo Venturo, Efrain Leon, Leo Rosas, Agustin Volpe.

## Bibliografía

- Anthropic — documentación y cursos: <https://docs.anthropic.com/>
- Anthropic — patrones de orquestación de agentes (*Building Effective Agents*).
- Azure AI Foundry: <https://learn.microsoft.com/azure/ai-foundry/>
- Model Context Protocol: <https://modelcontextprotocol.io/>
- PostgreSQL y pgvector: <https://www.postgresql.org/docs/>
- OWASP Top 10 for LLM Applications.
- Can I Run AI (estimación de rendimiento local): <https://www.canirun.ai/>
