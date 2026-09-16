# Estructura del repo

Una ruta es un módulo. Sus secciones, su contenido y sus componentes viven al
lado de su `page.tsx`, y en `src/shared/` queda lo que lee más de una.

```
src/
  app/
    layout.tsx  globals.css  styles/  opengraph-image.tsx  icon.png
    (home)/
      page.tsx
      _components/  HomePage · IntroOverlay · HeroScene · HighlightCard ·
                    ServiceCard · FormField
      _sections/    Hero · Academy · Services · Cases · Safety · About ·
                    Team · Contact
      _content/     home.ts · footer.ts
      _lib/         intro.ts · form.ts · useUnsentForm.ts
    inteligencia-artificial/  page.tsx · _components/ · _sections/ · _content/
    desarrollo-y-consultoria/ page.tsx · _components/ · _sections/ · _content/
    academianovit/            page.tsx · _components/ · _sections/ · _content/
    casos-de-exito/           page.tsx · _components/ · _sections/ · _content/
  shared/
    layout/     SiteShell · SiteHeader · SiteFooter · PageOpener
    ui/         los primitivos: Container, Section, SectionIntro, Icon, …
    cards/      Card · CardGrid · CardList · CaseCard · CaseLogo
    motion/     Scene · SplitWords · ScrollWords · SectionHandoff · CountUp ·
                Parallax
    decor/      BarField
    providers/  SmoothScroll y sus tres hooks
    hooks/      usePrefersReducedMotion
    lib/        cn · gsap · motion · variants · illustrations · brand-logo ·
                brand-mark
    content/    site.ts · navigation.ts · cases.ts · footer.ts
```

## Las reglas

**Una ruta nueva es una carpeta en `src/app`** con su `page.tsx`, su
`_content/`, sus `_sections/` y su `_components/`. El guión bajo las marca
privadas: Next no rutea carpetas que empiezan con `_`, así que conviven con la
ruta sin generar URLs. El home va en el route group `(home)`, que no cambia su
path y le da carpeta propia.

**Algo baja a `shared/` recién cuando lo lee una segunda ruta**, y sube de
vuelta cuando queda con un solo lector. Por eso `HighlightCard`, `HeroScene`,
`IntroOverlay` y `FormField` están adentro del home, y `academyContact` adentro
de `/academianovit`.

**No hay barril de contenido.** Cada sección importa el contenido de su módulo
por path relativo (`../_content/casos-de-exito`) y lo compartido por alias
(`@/shared/content/site`). El import dice a qué página pertenece cada texto,
que es el punto de tener módulos.

**Un módulo no importa de otro.** Si dos rutas necesitan lo mismo, eso es
`shared/`. El único caso que hubo —`SiteFooter` con el pie del home como
default— se resolvió haciendo que cada ruta le pase el suyo.

**El contenido es del módulo, la marca es de `shared/content`.** Ahí están los
datos que no son de ninguna página: la empresa y sus canales (`site.ts`), el
menú (`navigation.ts`), los dos agentes en producción que rinden tres rutas
(`cases.ts`) y la forma de un pie con la línea que los cuatro comparten
(`footer.ts`).

**El CSS no se modulariza.** `globals.css` y `styles/` son un sistema —tokens,
escala, la tarjeta, las escenas— y ninguna de sus piezas pertenece a una ruta.
