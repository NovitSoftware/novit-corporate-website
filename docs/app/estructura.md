# Estructura del repo

`src/app/` es solo ruteo. Todo lo demás vive fuera, ordenado por lo que es:
componentes en `components/`, textos en `content/`, hooks en `hooks/`,
funciones sueltas en `lib/`.

```
src/
  app/
    layout.tsx  globals.css  styles/  opengraph-image.tsx  icon.png
    (home)/
      page.tsx      metadata y el orden de las bandas
      _sections/    Hero · Stats · Services · Contact
      _components/  IntroOverlay · HeroScene · ServiceCard · FormField
      _lib/         intro.ts · form.ts · useUnsentForm.ts
    inteligencia-artificial/  page.tsx · _sections/ · _components/ · _lib/
    desarrollo-y-consultoria/ page.tsx · _sections/
    academianovit/            page.tsx · _sections/ · _components/ · _lib/
    casos-de-exito/           page.tsx · _sections/ · _components/ · _lib/
  components/
    layout/     SiteShell · SiteHeader · MenuPanel · SiteFooter · PageOpener
    section/    Section · SectionIntro · SectionLabel · PinnedIntro ·
                ReadingPanel · PanelRow · StatRow
    cards/      Card · CardGrid · CardList · CaseCard · CaseLogo
    motion/     Scene · SplitWords · ScrollWords · SectionHandoff ·
                CountUp · Parallax
    ui/         Container · Divider · ChipButton · Icon · IconBadge ·
                Logo · Image · Illustration · ContactIcons · BarField
    providers/  SmoothScroll
  content/    site · navigation · cases · footer · home ·
              inteligencia-artificial · desarrollo-y-consultoria ·
              academianovit · casos-de-exito
  hooks/      usePrefersReducedMotion · useKeyboardScroll ·
              useSceneGradient · useScrollNavigation
  lib/        cn · gsap · motion · variants · illustrations ·
              brand-logo · brand-mark
```

## Las reglas

**`page.tsx` es la página.** Ahí van su `metadata` y el orden de sus bandas,
nada más. No hay un `HomePage`/`CasesPage` intermedio que la `page` renderice
sin props: era un archivo y un salto de más por ruta.

**El guión bajo no es estilo, es la regla de Next.** Una carpeta que empieza
con `_` queda fuera del ruteo, ella y todo lo que cuelga. Por eso `_sections/`
y `_components/` conviven con `page.tsx` sin generar URLs. Adentro va lo que
renderiza una sola ruta; `_components/` y `_lib/` aparecen en las rutas que
tienen piezas propias que no son bandas — la figura animada de cada una y su
movimiento.

**Cada carpeta de `components/` contesta una pregunta distinta**, que es lo
que `shared/` no hacía:

| | |
|---|---|
| `layout/` | envuelve una ruta entera — header, footer, el shell, el opener |
| `section/` | arma una banda: la `<section>`, su encabezado, sus paneles y filas |
| `cards/` | la familia de tarjetas |
| `motion/` | las primitivas de animación; todas son client components |
| `ui/` | lo chico y agnóstico: contenedores, controles, marcas, íconos |
| `providers/` | contexto de toda la app, montado en el layout raíz |

**Todo el texto está en `content/`**, un archivo por ruta más los que no son
de ninguna: la empresa y sus canales (`site.ts`), el menú (`navigation.ts`),
los dos agentes en producción que rinden tres rutas (`cases.ts`) y la forma de
un pie con la línea que los cinco comparten (`footer.ts`). El pie de cada ruta
va en el archivo de esa ruta, al lado de la página que indexa.

**No hay barril.** Todo se importa por alias y por path completo
(`@/content/home`, `@/components/section/SectionIntro`). El import dice de
dónde sale cada cosa, que es el punto de tener carpetas con nombre.

**El CSS no se modulariza.** `globals.css` y `styles/` son un sistema —tokens,
escala, la tarjeta, las escenas— y ninguna de sus piezas pertenece a una ruta.
Se quedan en `app/` porque es donde Next espera el global.
