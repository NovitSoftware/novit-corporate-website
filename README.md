# novit-corporate-website

El sitio de Novit Software: Next.js con export estático, publicado en GitHub Pages.

## Producción

Cada push a `master` se publica en **www.novitsoftware.com** (`.github/workflows/pages.yml`).
Lo que se pushea a `master` va a producción.

## Vista previa para compartir

Para mostrar cambios antes de que vayan a producción, el sitio se publica en un repo aparte,
[NovitSoftware/novit-web-preview](https://github.com/NovitSoftware/novit-web-preview), que sirve
**https://novitsoftware.github.io/novit-web-preview/**:

```powershell
./scripts/preview.ps1 -Message "Qué cambió"
```

- Publica el estado local, haya commits o no, sin tocar este repo ni producción.
- GitHub Pages da un sitio por repo: un branch de este repo reemplazaría producción.
  Por eso la vista previa vive en otro repo.
- Sale marcada como `noindex`. Nunca debe tener archivo CNAME ni dominio propio.

## Fotos y videos

- **Fotos:** los originales van en `media/team/`. `scripts/photos.mjs` corre antes de
  `dev` y `build` y genera las copias WebP en `public/team/` (no se versionan).
- **Videos:** van en `public/clips/<nombre>.av1.mp4`, `<nombre>.mp4` (H.264) y
  `<nombre>.webp` (portada), recortados al tramo que se muestra, a 360 px y 24 fps.
- **Resaltados:** en los textos de `src/content`, una frase entre `**dobles asteriscos**`
  se muestra resaltada.

## Para agentes de IA

- `/llms.txt` y `/llms-full.txt` se generan en el build desde `src/content` (`src/lib/llms.ts`):
  el sitio en Markdown para modelos de lenguaje, con los datos clave escritos para ser citados.
- `robots.txt` deja entrar a los bots de IA a propósito (`src/app/robots.ts`): queremos que nos citen.
- Cada página lleva datos estructurados de schema.org (`JsonLd`): Organization, Service y Course.
