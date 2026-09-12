# Novit Software — Sistema visual

**Versión 0.2 · Septiembre 2026 · Documento de trabajo**

*Cambios de esta versión: el capítulo de color queda definido a partir del AI Radar —dos
degradés, rampa violeta con función semántica, rampa de grises— y se incorporan los
hallazgos de tipografía de esa misma pieza. Se saca el debate sobre los efectos
expresivos de la identidad 2024: está cerrado y no vuelve al material comercial.*

Complementa a `novit-brand-core.md`. Ese documento define qué dice Novit; este define
cómo se ve. Los dos se leen juntos: cada regla visual de acá responde a una decisión
estratégica de allá.

**Cómo leer las marcas:**
- ✅ **Definido** — decidido, se aplica.
- 🔴 **DECIDIR** — falta elegir.
- ⚠️ **Verificar** — hay que confirmar contra la realidad.

---

## 00. De dónde viene este sistema

Novit tuvo dos identidades. La anterior era azul petróleo, celeste y grises, sin
magenta. El brandbook de enero 2024 mantuvo el celeste, subió el azul a `#0A0089` e
incorporó el magenta.

Esa identidad se pensó para toda la comunicación, no para un canal: el capítulo visual
define logo, paleta, tipografía, recursos gráficos y estilo fotográfico de forma
general, y solo las últimas láminas bajan a Instagram como aplicación concreta.

**Lo que nunca se produjo fueron las aplicaciones de venta.** No existe plantilla de
documento, de propuesta ni de presentación comercial. Por eso cada pieza de ese tipo se
resolvió sola y con criterio propio: la skill de propuestas usa Calibri porque Effra no
está en Google Docs, el one-pager del workshop usa Rajdhani, y los grises se inventaron
en cada caso. No fue un problema de identidad mal pensada, fue falta de material de
referencia para copiar.

**Este documento no rediseña la marca.** Mantiene la identidad de 2024 y define dos
cosas: qué parte del tratamiento aplica al material comercial y qué parte queda para
redes. Lo que se modera es la capa más expresiva, que funciona en un feed y compite con
el texto en un PDF que alguien lee en una reunión.

### La pieza de referencia

⭐ **El AI & Tech Radar manda.** Es un one-pager A4 que sale todos los meses a los
contactos de nurturing, generado por una rutina automática, y hoy es la única pieza
comercial construida entera con criterio de sistema. Cuando este documento y el radar no
coincidan, **gana el radar**: acá hay decisiones escritas, allá hay una pieza que ya se
imprime, se manda y se lee.

De ahí salen el capítulo de color completo, los hallazgos de tipografía y la opacidad de
la marca de agua. Los valores exactos, con muestras, están en
`novit-marca-tokens.html`.

---

## 01. Color

### Paleta comercial

✅ **Definida.** Es la única paleta para material que ve un cliente. Todos los colores
provienen de una de las dos identidades de Novit o de las rampas del AI Radar; no hay
ninguno inventado sobre la marcha.

**Base**

| Token | HEX | Rol |
|---|---|---|
| `azul` | `#0A0089` | Color dominante. Títulos, fondos oscuros, headers, portadas |
| `celeste` | `#3DB0E4` | Acento sobre fondo oscuro o de color |
| `cyan` | `#3398DC` | Acento sobre fondo claro. Etiquetas, categorías, líneas |
| `blanco` | `#FFFFFF` | Fondo de página y texto sobre fondo oscuro |
| `texto` | `#333333` | Cuerpo sobre fondo claro |

**Rampa azul** — de la que sale el degradé de cabecera.

| HEX | Posición en el degradé |
|---|---|
| `#0D0B92` | 0% |
| `#1B4BB9` | 34% |
| `#4F8ED5` | 74% |
| `#3398DC` | 100% |

**Rampa violeta** — de la que sale el degradé de cierre.

| HEX | Posición en el degradé |
|---|---|
| `#0F0086` | 0% |
| `#2C037B` | 28% |
| `#510371` | 62% |
| `#85067B` | 100% |

**Grises**

| Token | HEX | Rol |
|---|---|---|
| `gris-superficie` | `#F3F6F8` | Fondo de tarjeta, bloques de contenido |
| `gris-borde` | `#E4E9ED` | Bordes y filetes |
| `gris-borde-suave` | `#EDF0F3` | Separadores internos |
| `gris-1` | `#8A94A0` | Etiquetas atenuadas |
| `gris-2` | `#98A2AE` | Metadatos, fuentes, pies |
| `gris-3` | `#A6B0BB` | Rótulos de separador |
| `gris-4` | `#BCC7D2` | Numeración, elementos de apoyo |

### El violeta significa algo

⭐ **Es la definición de color más importante del sistema, y la que faltaba.**

En el AI Radar el azul es el mundo —la noticia, el dato, lo que pasó— y el violeta es
Novit hablando. Por eso el comentario de cada ficha va en `#510371`, punto medio de la
rampa violeta, y no en el azul de marca: **el color dice de quién es la voz.**

Esto resuelve el problema que el brandbook nunca resolvió. Su justificación del magenta
—las dos fuerzas unidas, los dos hermanos, en clave Star Wars— se descartó por interna e
inservible para decidir nada. La rampa violeta la reemplaza con un criterio que sí ordena
el diseño: se usa donde habla Novit, y en ningún otro lado.

Además el violeta del radar es más profundo que el magenta del brandbook, y eso lo vuelve
utilizable para texto:

| Color | Contraste sobre blanco |
|---|---|
| Magenta brandbook `#BA08A8` | 5,7:1 |
| Violeta radar `#85067B` | 9,1:1 |
| Violeta radar `#510371` sobre tarjeta `#F3F6F8` | 12,1:1 |

`#BA08A8` deja de usarse en material comercial. Sigue vigente en redes, donde vive la
identidad 2024 completa.

### Los dos degradés

✅ **Definidos.** No son decoración: cada uno marca una zona con una función.

**Cabecera** — portadas, headers, banners. Es donde entra la pieza.

```css
background-color: #1B4BB9;   /* fallback para clientes sin degradé */
background-image: linear-gradient(100deg,
    #0D0B92 0%, #1B4BB9 34%, #4F8ED5 74%, #3398DC 100%);
```

**Cierre** — el bloque donde habla Novit: novedades propias, contacto, llamada a la acción.

```css
background-color: #510371;
background-image: linear-gradient(100deg,
    #0F0086 0%, #2C037B 28%, #510371 62%, #85067B 100%);
```

**Reglas de uso:**

- El ángulo es `100deg` en los dos. No se cambia: es lo que los hace reconocibles como
  parte del mismo sistema.
- Siempre con `background-color` de respaldo. Mail y visores de PDF viejos no renderizan
  degradés y sin el color de fondo el texto blanco queda sobre blanco.
- Van en cabecera y cierre, **nunca detrás de un bloque de lectura larga**.
- Entre uno y otro, la página va en blanco o en `#F3F6F8`. Los dos degradés no se tocan.

### Notas de procedencia

**El celeste es el activo más sólido de la marca.** Era `#3FB1E5` en la identidad
anterior, es `#3DB0E4` hoy y el radar lo usa sin cambios: atravesó dos rediseños y una
pieza nueva sin que nadie lo tocara. Es el color con más continuidad, más que el azul.

**El azul `#0A0089` también se confirma.** El radar lo usa para todos los titulares.
Rinde 15,3:1 sobre blanco y 14,1:1 sobre la tarjeta gris.

⚠️ **Único cuidado con el azul.** `#0A0089` está a saturación máxima. En superficies
grandes impresas conviene verificar el resultado en prueba de color antes de mandar a
imprenta, y evitar párrafos largos de texto blanco encima: para bloques de lectura
extensa, mejor fondo claro.

⚠️ **El cuerpo de texto pasa de negro a `#333333`.** La paleta declaraba `#000000`; el
radar usa `#333333`, que sobre la tarjeta gris rinde 11,6:1 y en pantalla cansa menos que
el negro puro. El negro absoluto queda para impresión a una tinta, si hiciera falta.

⚠️ **Los grises de 2015 quedan superados.** `#EAEBEC` y `#58585B` eran dos, y una pieza
densa necesita más escalones: superficie, borde, separador y tres niveles de texto
atenuado. La rampa de arriba es la del radar, medida sobre una pieza real. Los dos
viejos no contradicen nada pero ya no alcanzan, y conviene no mantener dos juegos en
paralelo.

⚠️ **Ni el cyan ni el celeste llegan a AA sobre fondo claro.** `#3398DC` sobre `#F3F6F8`
da 2,9:1, por debajo del 4,5:1 que pide la norma para texto chico. Por eso el cyan se usa
en **etiquetas y categorías, nunca en información que no esté repetida en otro lado**: en
el radar la categoría acompaña al titular, que es quien carga el significado. Sobre el
violeta la situación se invierte y ahí el celeste `#3DB0E4` sí rinde, 5,3:1.

**Por qué son dos acentos y no uno.** El cyan `#3398DC` y el celeste `#3DB0E4` se ven casi
iguales pero no son intercambiables: sobre la tarjeta gris el celeste cae a 2,3:1, y sobre
el violeta el cyan cae a 4,2:1. Cada uno está elegido para su fondo.

---

## 02. Tipografía

### Familia

✅ **Lato, familia única.** Para todo el material: documentos, propuestas,
presentaciones, piezas de diseño y web.

**Por qué Lato y no Effra.** Effra es de Dalton Maag, es de pago y no está en Google
Fonts, ni en Word, ni en Google Docs. Esa fue la causa directa de que convivieran cuatro
tipografías: Effra en piezas de diseño, Calibri en propuestas, Rajdhani en el one-pager
del workshop y una sans neutra en la presentación de IA. Mantener Effra como principal
obligaba a arrastrar una sustituta en paralelo y a decidir cuál usar en cada pieza. Una
sola familia disponible en todos lados elimina el problema de raíz.

**Por qué Lato y no otra.** Comparando el mismo párrafo al mismo tamaño contra Effra:

| Fuente | Ancho vs Effra | Líneas |
|---|---|---|
| Effra | referencia | 3 |
| **Lato** | **+2%** | **3** |
| Hanken Grotesk | +5% | 3 |
| Inter | +11% | 4 |
| Montserrat | +17% | 4 |

Lato es la más cercana con diferencia: el texto rompe en los mismos lugares y los
bloques ocupan el mismo espacio, así que cualquier pieza histórica compuesta en Effra
se puede rehacer sin descuadres. Comparte además la 'a' de doble piso, las terminales
horizontales y la temperatura humanista de Effra.

**Ventajas operativas:** licencia libre (SIL Open Font License), disponible en Google
Docs, en Google Fonts, instalable en Word y presente en prácticamente todo catálogo de
herramientas de diseño. No hay costo, no hay restricción de uso web y no hay que
verificar disponibilidad pieza por pieza.

> ⚠️ **Es la primera decisión que se aparta del brandbook 2024**, que declara
> explícitamente "seguimos usando la tipografía Effra para establecer una continuidad
> visual con la identidad anterior". El cambio es mínimo a la vista —2% de diferencia de
> ancho— pero conviene que esté hablado con quienes sostienen la identidad antes de
> aplicarlo a todo.

**Pesos:** Light para textos secundarios, Regular para cuerpo, Bold para títulos y
destacados. **Tracking:** amplio en títulos, según el brandbook 2024.

### Dos límites de Lato que hay que conocer

Los dos aparecieron produciendo el AI Radar, y los dos fallan **en silencio**: la pieza
se genera sin error y sale mal.

⚠️ **Lato no tiene los pesos 500, 600 ni 800.** Solo 100, 300, 400, 700 y 900. Un CSS que
pida `font-weight: 600` no da error: el navegador resuelve al peso más cercano, y el
resultado cambia según el motor. **Usar 300, 400, 700 o 900 y nada más.**

⚠️ **Lato tiene la flecha `→`, pero Google Fonts no la sirve.** La distinción importa
porque cambia cuál es la solución.

La fuente completa —2.164 glifos— trae once símbolos del bloque de flechas, incluida
`→` (U+2192). El archivo que sirve Google Fonts para el subset *latin* tiene 215 glifos y
**ninguna flecha**: ni siquiera las dos que su propio `unicode-range` declara (↑ y ↓), y
`→` no está ni declarada. Cargando Lato desde Google Fonts, la flecha se cae siempre a la
tipografía del sistema —Arial en Windows, otra cosa en otro lado— y la pieza deja de ser
consistente entre máquinas. En el radar estuvo saliendo en Arial sin que nadie lo notara.

**Hoy las flechas van dibujadas en SVG**, que funciona en cualquier lado y no depende de
ninguna fuente. El vector está en `novit-marca-tokens.html`.

🔴 **Alternativa a evaluar: alojar Lato completa en vez de traerla de Google Fonts.**
Resolvería la flecha y además saca la dependencia de red al renderizar, que es una
fragilidad real: sin conexión la pieza se genera igual, con otra tipografía y sin avisar.

La regla general detrás de las dos advertencias: **si un glifo o un peso no está en el
archivo que se cargó, el navegador no avisa, sustituye.** Y lo que se cargó puede ser
mucho menos que la fuente. Ante cualquier símbolo que no sea una letra o un signo de
puntuación corriente, verificarlo en el PDF exportado.

### Escala

✅ **Derivada de las piezas existentes**, no inventada. Tres contextos, cada uno con su
escala.

**Documento** — de la skill de propuestas, que ya venía funcionando en Calibri. Los
valores se trasladan a Lato sin cambio, porque el ancho es equivalente.

| Elemento | Tamaño |
|---|---|
| Título de portada | 28 pt |
| Nombre de cliente / subtítulo de portada | 18 pt |
| H1 · sección | 16 pt |
| H2 · subsección | 13 pt |
| Cuerpo | 11 pt |
| Tabla | 10 pt |
| Footer y metadatos | 9 pt |

**Presentación** — del brandbook 2024, sobre slide 16:9 de 25,4 cm de ancho.

| Elemento | Tamaño |
|---|---|
| Título de capítulo | 18 pt |
| Título de lámina | 14 pt |
| Cuerpo | 9 pt |
| Interlineado de cuerpo | 12 pt |

**One-pager y brochure** — del one-pager del Workshop y del brochure v3.1, sobre A4.

| Elemento | Tamaño |
|---|---|
| Titular de portada | 30 pt o más |
| Título de sección | 16 pt |
| Subtítulo de bloque | 14 pt |
| Cuerpo | 12 pt |
| Interlineado de cuerpo | 18 pt |
| Pie y datos de contacto | 9 pt |

**Diferencia a sostener entre contextos:** el cuerpo de un one-pager es más grande que
el de una propuesta —12 contra 11— y con bastante más interlineado, porque se lee de un
vistazo y no de corrido. La propuesta se lee sentado; el one-pager, de pie.

⚠️ Los valores de presentación y one-pager se obtuvieron midiendo las piezas exportadas
a imagen, así que tienen un margen de error de uno o dos puntos. Al abrir los archivos
originales conviene confirmarlos y ajustar estas tablas.

---

## 03. Logo

✅ **Sin cambios.** Isotipo de barras más logotipo "novit" con la "t" en celeste.

**Archivos disponibles** en `/mnt/skills/user/novit-propuesta-comercial/assets/`:
- `logo_novit_transparent.png` — 912×202px, para fondo claro
- `logo_novit_white.png` — para fondo oscuro

**Usos permitidos** (brandbook 2024): azul sobre blanco · blanco sobre azul profundo ·
celeste sobre blanco · blanco sobre celeste · blanco sobre degradé azul.

**No permitido:** cambiar el color, distorsionar, inclinar, agregar elementos ni efectos,
cambiar la tipografía. El logo tiene que leerse igual impreso en blanco y negro o
fotocopiado.

🔴 **Falta definir:** zona de resguardo y tamaño mínimo. No están en ningún manual.

---

## 04. Recursos gráficos

✅ **La grilla del isotipo.** El brandbook define que el isotipo se descompone en dos
recursos: bandas horizontales y rectángulos, que generan una grilla. También se usa
como máscara para fotos.

Es el recurso más propio que tiene la marca: funciona en un solo color y sin ningún
efecto encima.

✅ **Como marca de agua va al 7-8% de opacidad.** El valor sale del AI Radar, medido sobre
la pieza real: 8% en la cabecera y 7% en el bloque de cierre. La estimación anterior de
este documento era 10-20%, que sobre un degradé se ve como una mancha. Va siempre
sangrado por un borde y nunca como elemento protagónico.

---

## 05. Fotografía

✅ **Del brandbook 2024, se mantiene.** Situaciones de equipo trabajando, espíritu
dinámico y profesional, alternando concentración y momentos distendidos. Revelado en
tonos fríos, compensando cualquier iluminación cálida.

⚠️ **A revisar:** el banco de fotos actual es de la oficina y el equipo. Sirve para
marca empleadora y para "quiénes somos", pero no ilustra procesos de negocio, que es de
lo que habla el material comercial nuevo.

---

## 06. Qué queda fuera del sistema comercial

Resumen de lo que sale del material de venta:

| Elemento | Dónde sobrevive |
|---|---|
| Magenta `#BA08A8` | Redes, donde vive la identidad 2024 completa |
| Degradé azul→magenta del brandbook | Reemplazado por las dos rampas del cap. 01 |
| Efectos aplicados al logo | Redes |
| Saturación alta en superficies grandes impresas | Nada |
| Pesos 500, 600 y 800 | Nada: no existen en Lato |
| Flechas como carácter tipográfico | Nada: van en SVG |

---

## 07. Estado de las piezas actuales

| Pieza | Estado | Acción |
|---|---|---|
| **AI & Tech Radar** | ✅ **Pieza de referencia.** Sistema completo aplicado, en producción mensual | Ninguna. De acá sale el cap. 01 |
| Presentación IA 2026 | ⚠️ Generada con IA, sin criterio de marca aplicado | Rehacer con el sistema |
| Brochure v3.1 | ❌ Magenta dominante como superficie, alta densidad | Rehacer |
| One-pager Workshop IA | ❌ Rajdhani, tratamiento de redes en una pieza de venta | Rehacer o dejar como pieza de otro canal |
| Skill de propuestas | ⚠️ Calibri, grises inventados, sitio desactualizado | Actualizar a Lato y a la paleta nueva |
| Brandbook ene-24 | Identidad vigente. Su tratamiento sigue vigente en redes | Convive |

---

## 08. Pendientes

| # | Pendiente | Bloquea |
|---|---|---|
| 1 | Validar el cambio de Effra a Lato con quienes sostienen la identidad | Aplicación general |
| 2 | Confirmar la escala de presentación y one-pager contra los archivos originales | Precisión de plantillas |
| 3 | Zona de resguardo y tamaño mínimo del logo | Uso correcto en piezas chicas |
| 4 | Banco de imágenes orientado a procesos de negocio | Brochure |
| 5 | Decidir si `#EAEBEC` y `#58585B` se retiran del todo o conviven con la rampa nueva | Coherencia entre piezas viejas y nuevas |
| 6 | Llevar las dos rampas a la plantilla de propuestas y a la de presentación | Que el sistema exista fuera del radar |
| 7 | Evaluar alojar Lato completa en vez de traerla de Google Fonts (cap. 02) | Flechas tipográficas y piezas que se generen sin red |

---

## Anexo · Fuentes

| Definición | Origen |
|---|---|
| Celeste | Paleta de la identidad de 2015, confirmado por el AI Radar |
| Las dos rampas, los degradés, la rampa de grises, el rol semántico del violeta | AI & Tech Radar (`novit-marca-tokens.html`) |
| Límites de Lato y opacidad de la marca de agua | AI & Tech Radar, medidos sobre la pieza |
| Azul, magenta, logo, fotografía, grilla del isotipo | Brandbook Novit, enero 2024 |
| Escala de documento | Skill de propuestas comerciales |
| Escala de presentación | Brandbook Novit, enero 2024 |
| Escala de one-pager y brochure | One-pager Workshop IA y Brochure v3.1 |
| Criterio de aplicación comercial | `novit-brand-core.md`, regla de la prueba concreta y posicionamiento |
