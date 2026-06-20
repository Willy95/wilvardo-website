# Wilvardo — Personal site + blog

Personal site y carta de presentacion tecnica de Wilvardo Ramirez (desarrollador, consultor tecnico y director de producto), mas su blog **Criterio** en `/blog`. El home funciona como CV de capacidades + carta de recomendacion; el blog publica ensayos, tutoriales y analisis sobre ingenieria, direccion de producto e IA con criterio.

Identidad visual: **"ingeniero preciso"** — estetica IDE/terminal, oscuro por default con modo claro pulido, acento mint senal. Tipografia Space Grotesk (display) + Inter (cuerpo) + JetBrains Mono (UI tecnica / codigo).

Stack: HTML5 semantico + SCSS + TypeScript estricto + Vite, en modo **multi-pagina (MPA)**. **Sin frameworks de UI** (heredado de las preferencias del autor). Three.js (red de nodos del hero, lazy) + Vanilla-Tilt en el home. Animaciones propias: scramble de texto, impresion de terminal, counters, reveals scroll-triggered, boton magnetico.

## Paginas

| URL | Archivo fuente |
|-----|----------------|
| `/` | `index.html` (home) |
| `/blog/` | `blog/index.html` (indice del blog, grid filtrable por pilar) |
| `/blog/<slug>/` | `blog/<slug>/index.html` (una entrada) |

Las rutas son canonicas **con slash final**. `/blog` redirige 301 a `/blog/` (ver plugin abajo).

## Instalacion y uso

```bash
npm install
npm run dev      # arranca Vite en http://localhost:5173
npm run build    # tsc --noEmit + vite build -> dist/ (incluye sitemap.xml)
npm run preview  # sirve dist/ para validacion final
npm run lint     # ESLint sobre src/**/*.ts
npm run format   # Prettier sobre src/**
```

## Foto profesional (drop-in, sin tocar codigo)

La seccion "Identidad" del home carga la foto automaticamente. Guarda el archivo en `public/` con nombre base `portrait` (`portrait.webp` preferido, o `.jpg/.jpeg/.png`). Ratio ideal 4:5 (~720x900). `initPortrait()` en `src/scripts/interactions.ts` prueba esos archivos en orden y, si no hay ninguno, deja el placeholder con monograma. Ya esta puesta `public/portrait.webp`.

## Decisiones arquitectonicas

### Sin frameworks de UI

HTML semantico + SCSS + Vanilla TS. Cero React/Vue/Angular/Svelte/Solid/Astro. Razon: soporte de largo plazo, control total de lo que se entrega y evitar arrastre de dependencias.

### Multi-pagina (MPA) con Vite

Cada pagina es un `index.html` real, declarado en `build.rollupOptions.input` de `vite.config.ts`. Comparten el bundle de estilos (`cssCodeSplit: false`) pero cargan entradas JS distintas: el home usa `src/scripts/main.ts`; el blog usa `src/scripts/blog-main.ts` (ligero, **sin Three.js**).

### Code-splitting de Three.js

Three.js (~150 KB) se carga **solo cuando el hero del home entra en viewport**, via `IntersectionObserver` + `dynamic import`. El blog nunca lo descarga (su entry no lo importa).

### Tokens via CSS custom properties

Los tokens viven en `src/styles/_tokens.scss` (`--color-brand-primary`, etc.) y permiten cambio de tema sin recompilar. **`--color-accent-text`** es el teal legible para *texto* de acento: el teal de marca `#155E5F` reprueba contraste AA como texto sobre fondo oscuro (2.6:1), asi que el texto de acento usa `#2E8C81` en oscuro y `#155E5F` en claro; el teal de marca queda para fondos, bordes y graficos.

### Tema sistema / claro / oscuro (3 estados)

`src/scripts/theme.ts` cicla entre **sistema** (sigue `prefers-color-scheme` en vivo, default), **claro** y **oscuro**; persiste en `localStorage`. Un script anti-FOUC inline en el `<head>` de cada pagina fija el tema antes del primer pintado. El boton muestra un solo icono segun `data-pref` (CSS) y anima el cambio de color con View Transitions (circular reveal) cuando esta disponible.

### i18n por data-attributes (solo home por ahora)

Sin libreria. Textos en `src/i18n/{es,en}.json`, aplicados con `data-i18n="path"`. El **blog arranca solo en espanol**; el toggle de idioma no se muestra en el blog hasta traducir los posts.

### Plugins de Vite propios (`vite.config.ts`)

- **`trailing-slash-redirect`**: en `dev` y `preview`, redirige 301 las rutas de carpeta sin slash final a su version con slash (`/blog` -> `/blog/`, `/blog/<slug>` -> `/blog/<slug>/`). En produccion lo hace el hosting.
- **`sitemap`**: tras el build, escanea todos los `.html` del `outDir` y escribe `sitemap.xml` con URLs absolutas. **Cada pagina o post nuevo aparece solo** (al agregar su entry). El dominio esta en la constante `SITE_URL`.

### SEO y compartir

- **Open Graph / Twitter**: todas las paginas usan **siempre** la misma tarjeta de marca `public/og-default.webp` (1200x630) como `og:image`. No se genera OG por post.
- **`sitemap.xml`**: generado en el build (ver plugin).
- **`public/robots.txt`**: permite todo y apunta al sitemap.
- Cada pagina lleva meta description, canonical (con slash), OG, Twitter Card; los posts ademas JSON-LD `BlogPosting`.

### Reduce motion

`prefers-reduced-motion: reduce` desactiva la escena Three.js, el marquee, los reveals, los counters, el tilt, la transicion del tema y la animacion del hero claim.

## Estructura

```
index.html                 Home
blog/
  index.html               Indice del blog (/blog/)
  <slug>/index.html        Una entrada (/blog/<slug>/)
public/
  portrait.webp            Foto del home
  isotipo.png              Isotipo / favicon
  og-default.webp          Tarjeta OG de marca (fija, todas las paginas)
  robots.txt               Apunta al sitemap
  blog/
    placeholder-card.webp  Imagen generica para cards sin hero
    <slug>/<slug>-hero.webp Hero de cada post (lo subes aqui)
src/
  styles/
    _tokens.scss           Tokens de marca (+ accent-text)
    _reset.scss            Reset minimo
    _a11y.scss             .visually-hidden (skip link) + [hidden]
    _typography.scss       Escala tipografica
    _components.scss       Botones, inputs, cards, pills, container
    _animations.scss       Reveals, marquee, hero claim
    _post.scss             Plantilla de entrada de blog (2 columnas, TOC, share)
    _blog.scss             Indice del blog (grid filtrable, cards)
    styles.scss            Entry point + estilos del home
  scripts/
    main.ts                Entry del home (orquesta todo, lazy Three.js)
    blog-main.ts           Entry del blog (theme + post + filtros, sin Three.js)
    theme.ts               Tema sistema/claro/oscuro (3 estados)
    post.ts                Compartir (Web Share + copiar) y TOC con scroll-spy
    blog.ts                Filtro por pilar del indice
    i18n.ts                Strings ES/EN (home)
    motion.ts              Reveals + estado scroll del header
    hero-scene.ts          Escena Three.js del hero (lazy)
    interactions.ts        Counters, tilt, terminal, portrait, iconos
    cursor.ts              Cursor de marca
  i18n/{es,en}.json        Diccionarios del home
vite.config.ts             MPA + plugins (trailing slash, sitemap)
```

## Como publicar un post del blog

1. Crear `blog/<slug>/index.html` (copiar una entrada existente como plantilla y actualizar `title`, meta description, `canonical`, `og:url`, JSON-LD, kicker del pilar, `h1`, dek, fecha, contenido y el indice lateral). El `<slug>` deriva del titulo.
2. Agregar su entry en `vite.config.ts` -> `build.rollupOptions.input`: `"blog-<slug>": resolve(root, "blog/<slug>/index.html")`.
3. Guardar el hero en `public/blog/<slug>/<slug>-hero.webp` y referenciarlo con ruta absoluta en el `<img>` del hero. El `og:image` se queda en `og-default.webp`.
4. En `blog/index.html`, pasar la card del post de "Proximo" a publicada: enlazar el `h2` con `<a class="card-cover-link" href="/blog/<slug>/">`, poner el hero en `.card-thumb` y quitar `is-soon`.
5. `npm run build`: el `sitemap.xml` incluye el nuevo post automaticamente.

> El contenido (borradores y esbozos de los proximos posts) se planifica fuera del repo, en `cowork/Blog-Wilvardo/`.

## Como agregar una seccion al home

1. Agregar el HTML en `index.html` con `class="section reveal"`.
2. Agregar traducciones en `src/i18n/es.json` y `en.json`.
3. Estilos especificos al final de `src/styles/styles.scss`; logica en un modulo nuevo de `src/scripts/` orquestado desde `main.ts`.

## Performance y accesibilidad

Objetivos: PageSpeed mobile **>= 85**, accesibilidad **WCAG 2.1 AA** como minimo. Para validar:

```bash
npm run build && npm run preview
npx lighthouse http://localhost:4173/ --view --form-factor=mobile
npx lighthouse http://localhost:4173/blog/ --view --form-factor=mobile
```

Los heroes de los posts deben ser WebP **< 200 KB** (la foto editorial sobria comprime muy bien).

## Despliegue de la pagina 404 (Droplet + Nginx)

El sitio se sirve estatico desde un Droplet de DigitalOcean con Nginx (DNS en
Cloudflare, que deja pasar el 404 del origen sin tocarlo). `vite build` genera
`dist/404.html`, pero Nginx no lo entrega solo: hay que declararlo en el `server`
block y recargar.

```nginx
location / {
    try_files $uri $uri/ =404;
}

error_page 404 /404.html;
location = /404.html {
    internal;
}
```

Aplicar en el servidor y validar antes de recargar:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

`error_page` conserva el status 404 real (no un 200 disfrazado), correcto para SEO.
En local, `npm run preview` replica este comportamiento (rutas inexistentes
devuelven la 404 con status 404).

## Pendientes conocidos

- **i18n del blog:** el blog esta solo en espanol. Traducir los posts y activar el toggle de idioma cuando aplique.
- **Suscripcion:** no hay newsletter conectado. Si se decide, integrar un servicio (Buttondown, ConvertKit) o un endpoint propio (Adonis) guardando correos.
- **Logo SVG:** el isotipo es PNG. Convertir a SVG para nitidez y favicon dedicado.
- **Legal:** aviso de privacidad y terminos no existen aun.
- **Dominio del sitemap:** confirmar `SITE_URL` en `vite.config.ts` antes de desplegar, y configurar en el hosting el redirect de rutas sin slash (la mayoria lo hace solo).
```
