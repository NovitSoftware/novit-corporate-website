Academia Novit - Desarrollo de Agentes IA y
Software Agentico
Octubre 2026

Version 2. Pendiente de validación final del temario.

Objetivo general
Capacitar a los participantes en el diseño y la construcción de sistemas agénticos de software:
entender la arquitectura interna de un agente de IA, sus componentes y sus patrones de
orquestación, y adqui
rir criterio para elegir proveedor de modelo, estrategia de recuperacion de información, modo
de ejecución y nivel de autonomía en función del problema, el costo, el tiempo de respuesta y
el riesgo.

Un agente de IA es una entidad de software autónoma que cumple objetivos específicos. El
software agentico es el paradigma mas amplio que disena y coordina sistemas donde operan
uno o varios agentes.

Objetivos específicosComprender la arquitectura de un sistema agéntico y
sus componentes
- Aplicar los patrones de orquestación de agentes y saber cuándo alcanza un workflow y
cuando hace falta un agente
- Diseñar tools con contratos claros e integrar servidores MCP
Construir el contexto que recibe el modelo con criterio (context engineering) e
implementar RAG sobre PostgreSQL
- Consumir proveedores de LLM en la nube y administrar limites de costo y de uso
- Comprender cuando y para que tiene sentido ejecutar un modelo de lenguaje en forma
local o en la nube
- Seleccionar el modelo adecuado para cada tarea segun proposito, costo y latencia
Evaluar la eficiencia de un agente en terminos de costo y tiempo de respuesta
- Aplicar defensas de seguridad sobre entradas de usuario y definir permisos minimos e
identidad del agente
- Instrumentar un sistema agéntico para que sus decisiones sean auditables
Manejar un vocabulario tecnico comun para discutir decisiones de arquitectura agentica

Requisitos
Manejo de un lenguaje de programacion orientado a objetos
- Conocimiento de Git, Web API y protocolo HTTP
Consumo de APIs REST y manejo de credenciales
- Nociones de bases de datos relacionales

No es una academia de nivel inicial. Se dan por sentados los conocimientos fundamentales de
desarrollo de software y de consumo de APIs.

Duración y modalidad
- Fundamentos: 3 clases de 2 horas
- Contexto y conocimiento: 3 clases de 2 horas
- Arquitectura y orquestación: 3 clases de 2 horas
- Modelos, costos y ejecución: 3 clases de 2 horas
Produccion - seguridad y observabilidad: 2 clases de 2 horas
Talleres de consulta: 2 clases de 2 horas
Total: 32 hs (14 clases teorico-practicas, 2 talleres de consulta)

Clases martes y viernes de 16 a 18 hs, del 13/10/2026 al 04/12/2026.

Contenidos

Módulo Fundamentos
Anatomia de un agente: un agente de IA como sistema de software. Proveedor de
LLM, contexto, tools, memoria y loop de control. Que componentes son nuevos respecto
de un sistema tradicional y cuales se mantienen. Vocabulario técnico del dominio.
- EI LLM como componente: API, mensajes, system prompt, tokens, ventana de
contexto, structured output.
Tools y MCP: diseno de tools, contratos, idempotencia, manejo de errores. Model
Context Protocol: que resuelve y por que quedo como estandar.
Introduccion teorica al ciclo de vida de desarrollo con IA: como cambio el proceso
de desarrollo de software, Spec-Driven Development, revisión asistida de pull requests,
agentes de test. Se menciona sin profundizar.

Módulo Contexto y Conocimiento
- Context engineering: que se le manda al modelo y por que, en contraposición al
prompt engineering. Presupuesto de contexto, seleccion, compactación. Herramientas
versus contexto.
- RAG: concepto y lugar dentro de la arquitectura de un agente. Embeddings, chunking,
similitud. Implementacion sobre PostgreSQL con pgvector. Calidad de recuperación,
metadata y filtros. Cuándo no usar RAG.
- Memoria de agente: corto y largo plazo.

Módulo Arquitectura y Orquestación
- Patrones de orquestación: prompt chaining, routing, parallelization,
orchestrator-workers y evaluator-optimizer. Cuando alcanza un workflow deterministico
y cuándo hace falta un agente.
Agentes de control: un agente que evalua, prueba o fuerza errores en otros agentes.
Patrones arquitectonicos: estado, handoff entre agentes, limites de responsabilidad,
integracion con sistemas existentes.
- Multimodalidad: interpretacion de audio e imagenes como herramientas del agente.
Human-in-the-loop: validacion humana antes de que el agente escriba en sistemas
operativos.

Módulo Modelos, Costos y Ejecución
Proveedores en la nube: Azure Al Foundry, que modelos hostea y como se consume.
API keys, limites de costo y limites de requests por unidad de tiempo.
- Modelos por proposito: razonamiento, tareas simples, generacion de imagenes,
interpretacion de imágenes, audio. Criterio de selección por tarea.

Ejecucion local y edge: requisitos de hardware, que modelos corren y a que velocidad,
herramientas para levantarlos. Criterio local versus API. Operacion sin conexion y
cómputo en el lugar.
Costos y eficiencia: medicion de tokens, latencia y costo por resolucion. Caching,
ruteo por costo, degradación controlada. Latencia como restricción de diseño.

Módulo Producción
Seguridad: prompt injection, guardrails y filtrado de entradas que vienen directo del
usuario. Permisos acotados al minimo necesario en cada sistema con el que el agente
se integra. Modelo de identidad y autorización explícito.
Observabilidad y confiabilidad: registrar la decision del agente y no solo su
respuesta. Intentos, timeouts, fallos parciales, idempotencia de las tools. Trazabilidad
auditable. Que implica llevar un agente de la demo a produccion en una empresa
mediana.
Mencion: evaluación sistemática de agentes y armado de datasets de prueba.

Docente titular
Ing. Jonathan Velazquez

Ayudantes
Gustavo Venturo, Efrain Leon, Leo Rosas, Agustin Volpe.

Bibliografía
Anthropic - documentacion y cursos: https://docs.anthropic.com/
- Anthropic - patrones de orquestación de agentes (building effective agents)
- Azure Al Foundry: https://learn.microsoft.com/azure/ai-foundry/
- Model Context Protocol: https://modelcontextprotocol.io/
PostgreSQL y pgvector: https://www.postgresql.org/docs/
OWASP Top 10 for LLM Applications
- Can I Run Al (estimacion de rendimiento local): https://www.canirun.ai/
