import { defineConfig, type Connect, type Plugin } from "vite";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { renderHomeCards, renderBlogGrid, renderBlogFilters } from "./src/build/render-cards";

/**
 * Configuracion de Vite para el personal site de Wilvardo.
 * - Sin frameworks de UI.
 * - Multi-pagina (MPA): home, indice del blog y entradas de blog.
 * - Code-splitting manual para Three.js (cargado solo cuando el hero entra al viewport).
 */
const root = fileURLToPath(new URL(".", import.meta.url));

/** Dominio canonico del sitio (para sitemap y URLs absolutas). */
const SITE_URL = "https://wilvardo.com";

/**
 * Redirige (301) las rutas "de carpeta" sin slash final a su version con slash,
 * para que /blog y /blog/ (o /blog/<slug> y /blog/<slug>/) sean equivalentes.
 * Se ignoran los internos de Vite y los archivos con extension.
 */
const trailingSlashRedirect = (): Plugin => {
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const url = req.url ?? "/";
    const [rawPath, query] = url.split("?");
    const path = rawPath ?? "/";
    const isInternal =
      path.startsWith("/@") || path.startsWith("/src") || path.startsWith("/node_modules");

    if (!isInternal && path !== "/" && !path.endsWith("/") && !path.includes(".")) {
      res.statusCode = 301;
      res.setHeader("Location", `${path}/${query ? `?${query}` : ""}`);
      res.end();
      return;
    }
    next();
  };

  return {
    name: "trailing-slash-redirect",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
};

/**
 * Sirve 404.html en rutas inexistentes, replicando lo que en produccion hace
 * Nginx con `error_page 404 /404.html`. En dev reescribe la URL para que Vite
 * sirva la pagina (status 200, solo previsualizacion); en preview entrega el
 * archivo de dist con status 404 real.
 */
const notFoundFallback = (): Plugin => {
  let outDirAbs = "";
  let knownRoutes = new Set<string>();

  /** Una ruta es candidata a 404 si no es interna, no es archivo, no es la raiz y no es una ruta conocida. */
  const isFallbackTarget = (rawPath: string): boolean => {
    const path = rawPath.split("?")[0] ?? "/";
    const isInternal =
      path.startsWith("/@") ||
      path.startsWith("/src") ||
      path.startsWith("/node_modules") ||
      path.startsWith("/.vite");
    if (isInternal || path.includes(".") || path === "/") return false;
    const normalized = path.endsWith("/") ? path : `${path}/`;
    return !knownRoutes.has(normalized);
  };

  return {
    name: "not-found-fallback",
    configResolved(config) {
      outDirAbs = resolve(config.root, config.build.outDir);
      const input = config.build.rollupOptions?.input;
      const files =
        input && typeof input === "object" ? Object.values(input as Record<string, string>) : [];
      knownRoutes = new Set(files.map((abs) => htmlToRoute(relative(config.root, abs))));
    },
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (isFallbackTarget(req.url ?? "/")) req.url = "/404.html";
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!isFallbackTarget(req.url ?? "/")) {
          next();
          return;
        }
        try {
          const html = readFileSync(join(outDirAbs, "404.html"), "utf8");
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(html);
        } catch {
          next();
        }
      });
    },
  };
};

/** Convierte una ruta de archivo HTML (relativa al outDir) en su URL canonica con slash. */
const htmlToRoute = (file: string): string => {
  const normalized = file.split("\\").join("/");
  if (normalized === "index.html") return "/";
  if (normalized.endsWith("/index.html")) {
    return `/${normalized.slice(0, normalized.length - "index.html".length)}`;
  }
  return `/${normalized}`;
};

/** Recolecta recursivamente todos los .html dentro de un directorio. */
const collectHtml = (dir: string, base: string, out: string[]): void => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) collectHtml(full, base, out);
    else if (name.endsWith(".html")) out.push(relative(base, full));
  }
};

/**
 * Nginx sirve 404.html en CUALQUIER ruta fallida (error_page), pero el navegador
 * resuelve las rutas relativas contra la URL de la barra, no contra /404.html. Con
 * base "./" eso rompe los assets en rutas profundas. Reescribimos las referencias
 * relativas de 404.html a absolutas para que carguen desde la raiz del dominio
 * sin importar la profundidad de la ruta fallida.
 */
const absolutizeErrorAssets = (): Plugin => {
  let outDirAbs = "";
  return {
    name: "absolutize-error-assets",
    configResolved(config) {
      outDirAbs = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const file = join(outDirAbs, "404.html");
      try {
        const html = readFileSync(file, "utf8");
        const fixed = html.replace(/(src|href)="\.\//g, '$1="/');
        if (fixed !== html) writeFileSync(file, fixed, "utf8");
      } catch {
        // si 404.html no existe en el build, no hay nada que reescribir
      }
    },
  };
};

/**
 * Genera sitemap.xml tras el build, escaneando todas las paginas HTML del outDir.
 * Cada pagina o post nuevo aparece automaticamente, sin mantenerlo a mano.
 */
const sitemap = (): Plugin => {
  let outDirAbs = "";
  return {
    name: "sitemap",
    configResolved(config) {
      outDirAbs = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const files: string[] = [];
      collectHtml(outDirAbs, outDirAbs, files);

      const today = new Date().toISOString().slice(0, 10);
      const priorityFor = (route: string): string =>
        route === "/" ? "1.0" : route === "/blog/" ? "0.9" : "0.8";

      const urls = files
        .map((file) => file.split("\\").join("/"))
        .filter((file) => !/(^|\/)[0-9]{3}\.html$/.test(file))
        .map(htmlToRoute)
        .sort()
        .map(
          (route) =>
            `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priorityFor(route)}</priority>\n  </url>`,
        )
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      writeFileSync(join(outDirAbs, "sitemap.xml"), xml, "utf8");
    },
  };
};

/**
 * Inyecta en tiempo de build (y en dev) las tarjetas de blog desde el manifiesto
 * unico `src/data/posts.ts`, reemplazando marcadores HTML por el markup renderizado.
 * Asi el home y el indice del blog comparten una sola fuente de verdad sin JS en
 * cliente: el HTML sale estatico, indexable y sin parpadeo.
 *   - <!-- posts:home -->    -> ultimos publicados (teaser del home)
 *   - <!-- posts:grid -->    -> rejilla completa del indice del blog
 *   - <!-- posts:filters --> -> botones de filtro con conteos por pilar
 */
const injectPosts = (): Plugin => ({
  name: "inject-posts",
  transformIndexHtml(html) {
    return html
      .replace("<!-- posts:home -->", () => renderHomeCards())
      .replace("<!-- posts:grid -->", () => renderBlogGrid())
      .replace("<!-- posts:filters -->", () => renderBlogFilters());
  },
});

export default defineConfig({
  base: "./",
  plugins: [
    trailingSlashRedirect(),
    notFoundFallback(),
    sitemap(),
    absolutizeErrorAssets(),
    injectPosts(),
  ],
  build: {
    target: "es2020",
    cssCodeSplit: false,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        blog: resolve(root, "blog/index.html"),
        "blog-programar-en-la-era-de-la-ia": resolve(root, "blog/programar-en-la-era-de-la-ia/index.html"),
        "blog-el-modelo-de-datos": resolve(root, "blog/el-modelo-de-datos/index.html"),
        error: resolve(root, "404.html"),
      },
      output: {
        manualChunks: {
          three: ["three"],
          gsap: ["gsap"],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
