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

/** Des-escapa entidades HTML del codigo (markdown las escapo al hornear el post). */
const decodeHtml = (s: string): string =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

/** Escapa texto plano para insertarlo en HTML (nombre de archivo de la barra). */
const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type CodeToHtml = (typeof import("shiki"))["codeToHtml"];

/**
 * Renderiza un bloque sin lenguaje (arbol de archivos) como mapa legible: preserva la
 * sangria y la alineacion, pinta las carpetas (terminan en `/`) con el acento, los
 * archivos con texto fuerte y los comentarios `#` atenuados pero legibles. Buen
 * contraste en claro y oscuro (usa los tokens del tema, no los de Shiki).
 */
const renderFileTree = (code: string): string => {
  // Cada nivel del arbol fuente son 2 espacios. Reconstruimos los conectores
  // tipo `tree` (├── │ └──) calculando, por linea, si es el ultimo hijo y si
  // cada ancestro sigue teniendo ramas debajo.
  const rows = code
    .split("\n")
    .filter((l) => l.trim().length > 0)
    .map((line) => {
      const m = line.match(/^(.*?)(\s{2,})(#.*)$/);
      const left = m ? m[1] : line;
      const comment = m ? m[3] : "";
      const lead = left.match(/^(\s*)(.*)$/);
      const depth = Math.floor((lead?.[1].length ?? 0) / 2);
      const name = (lead?.[2] ?? "").trimEnd();
      return { depth, name, comment };
    });
  const n = rows.length;
  const isLast = (i: number): boolean => {
    const d = rows[i].depth;
    for (let j = i + 1; j < n; j++) {
      if (rows[j].depth < d) return true;
      if (rows[j].depth === d) return false;
    }
    return true;
  };
  const guideOf = (i: number): string => {
    const d = rows[i].depth;
    let prefix = "";
    for (let a = 1; a < d; a++) {
      let cont = false;
      for (let j = i + 1; j < n; j++) {
        const dj = rows[j].depth;
        if (dj <= a) {
          cont = dj === a;
          break;
        }
      }
      prefix += cont ? "│   " : "    ";
    }
    return prefix + (d >= 1 ? (isLast(i) ? "└── " : "├── ") : "");
  };
  const guides = rows.map((_, i) => guideOf(i));
  const leftLen = rows.map((r, i) => guides[i].length + r.name.length);
  const maxLeft = Math.max(...rows.map((r, i) => (r.comment ? leftLen[i] : 0)), 0);
  const body = rows
    .map((r, i) => {
      const guideHtml = guides[i] ? `<span class="tree-line">${escapeHtml(guides[i])}</span>` : "";
      const nameHtml = `<span class="${r.name.endsWith("/") ? "tree-dir" : "tree-file"}">${escapeHtml(r.name)}</span>`;
      let commentHtml = "";
      if (r.comment) {
        const pad = " ".repeat(Math.max(2, maxLeft - leftLen[i] + 2));
        commentHtml = pad + `<span class="tree-comment">${escapeHtml(r.comment)}</span>`;
      }
      return guideHtml + nameHtml + commentHtml;
    })
    .join("\n");
  return `<pre class="tree"><code>${body}</code></pre>`;
};

/**
 * Resalta en build los bloques `<pre><code>` con Shiki, tema dual claro/oscuro via
 * variables CSS (sin JS en cliente: el HTML sale ya coloreado e indexable). Si la
 * primera linea del bloque es `// ruta`, la usa como barra de archivo (estetica IDE).
 * Los bloques sin lenguaje declarado se tratan como arbol de archivos.
 */
const highlightCode = (): Plugin => {
  let codeToHtml: CodeToHtml | null = null;
  return {
    name: "highlight-code",
    async transformIndexHtml(html) {
      if (!html.includes("<pre><code")) return html;
      if (!codeToHtml) codeToHtml = (await import("shiki")).codeToHtml;

      const re = /<pre><code(?: class="language-([\w-]+)")?>([\s\S]*?)<\/code><\/pre>/g;
      const matches = [...html.matchAll(re)];
      let out = html;

      for (const match of matches) {
        const lang = match[1];
        const raw = decodeHtml(match[2] ?? "").replace(/\n$/, "");

        // Bloque sin lenguaje = arbol de archivos: render propio tipo mapa.
        if (!lang) {
          out = out.replace(match[0], () => `<div class="code-block">${renderFileTree(raw)}</div>`);
          continue;
        }

        const lines = raw.split("\n");
        const fileMatch = lines[0]?.match(/^\/\/\s?(\S.*)$/);
        const file = fileMatch ? fileMatch[1].trim() : "";
        const code = file ? lines.slice(1).join("\n").replace(/^\n+/, "") : raw;

        const highlighted = await codeToHtml(code, {
          lang,
          themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
          defaultColor: false,
        });
        const header = file ? `<div class="code-file">${escapeHtml(file)}</div>` : "";
        out = out.replace(match[0], () => `<div class="code-block">${header}${highlighted}</div>`);
      }
      return out;
    },
  };
};

export default defineConfig({
  base: "./",
  plugins: [
    trailingSlashRedirect(),
    notFoundFallback(),
    sitemap(),
    absolutizeErrorAssets(),
    injectPosts(),
    highlightCode(),
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
        "blog-arquitectura-hexagonal-y-vertical-slicing": resolve(root, "blog/arquitectura-hexagonal-y-vertical-slicing/index.html"),
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
