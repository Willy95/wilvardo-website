// vite.config.ts
import { defineConfig } from "file:///sessions/serene-great-hawking/mnt/wilvardo-site/node_modules/vite/dist/node/index.js";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, statSync, writeFileSync } from "node:fs";
var __vite_injected_original_import_meta_url = "file:///sessions/serene-great-hawking/mnt/wilvardo-site/vite.config.ts";
var root = fileURLToPath(new URL(".", __vite_injected_original_import_meta_url));
var SITE_URL = "https://wilvardo.com";
var trailingSlashRedirect = () => {
  const middleware = (req, res, next) => {
    const url = req.url ?? "/";
    const [rawPath, query] = url.split("?");
    const path = rawPath ?? "/";
    const isInternal = path.startsWith("/@") || path.startsWith("/src") || path.startsWith("/node_modules");
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
    }
  };
};
var htmlToRoute = (file) => {
  const normalized = file.split("\\").join("/");
  if (normalized === "index.html") return "/";
  if (normalized.endsWith("/index.html")) {
    return `/${normalized.slice(0, normalized.length - "index.html".length)}`;
  }
  return `/${normalized}`;
};
var collectHtml = (dir, base, out) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) collectHtml(full, base, out);
    else if (name.endsWith(".html")) out.push(relative(base, full));
  }
};
var sitemap = () => {
  let outDirAbs = "";
  return {
    name: "sitemap",
    configResolved(config) {
      outDirAbs = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const files = [];
      collectHtml(outDirAbs, outDirAbs, files);
      const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const priorityFor = (route) => route === "/" ? "1.0" : route === "/blog/" ? "0.9" : "0.8";
      const urls = files.map(htmlToRoute).sort().map(
        (route) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priorityFor(route)}</priority>
  </url>`
      ).join("\n");
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
      writeFileSync(join(outDirAbs, "sitemap.xml"), xml, "utf8");
    }
  };
};
var vite_config_default = defineConfig({
  base: "./",
  plugins: [trailingSlashRedirect(), sitemap()],
  build: {
    target: "es2020",
    cssCodeSplit: false,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        blog: resolve(root, "blog/index.html"),
        "blog-programar-en-la-era-de-la-ia": resolve(root, "blog/programar-en-la-era-de-la-ia/index.html")
      },
      output: {
        manualChunks: {
          three: ["three"],
          gsap: ["gsap"]
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvc2VyZW5lLWdyZWF0LWhhd2tpbmcvbW50L3dpbHZhcmRvLXNpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9zZXNzaW9ucy9zZXJlbmUtZ3JlYXQtaGF3a2luZy9tbnQvd2lsdmFyZG8tc2l0ZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vc2Vzc2lvbnMvc2VyZW5lLWdyZWF0LWhhd2tpbmcvbW50L3dpbHZhcmRvLXNpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgQ29ubmVjdCwgdHlwZSBQbHVnaW4gfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgam9pbiwgcmVsYXRpdmUsIHJlc29sdmUgfSBmcm9tIFwibm9kZTpwYXRoXCI7XG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcIm5vZGU6dXJsXCI7XG5pbXBvcnQgeyByZWFkZGlyU3luYywgc3RhdFN5bmMsIHdyaXRlRmlsZVN5bmMgfSBmcm9tIFwibm9kZTpmc1wiO1xuXG4vKipcbiAqIENvbmZpZ3VyYWNpb24gZGUgVml0ZSBwYXJhIGVsIHBlcnNvbmFsIHNpdGUgZGUgV2lsdmFyZG8uXG4gKiAtIFNpbiBmcmFtZXdvcmtzIGRlIFVJLlxuICogLSBNdWx0aS1wYWdpbmEgKE1QQSk6IGhvbWUsIGluZGljZSBkZWwgYmxvZyB5IGVudHJhZGFzIGRlIGJsb2cuXG4gKiAtIENvZGUtc3BsaXR0aW5nIG1hbnVhbCBwYXJhIFRocmVlLmpzIChjYXJnYWRvIHNvbG8gY3VhbmRvIGVsIGhlcm8gZW50cmEgYWwgdmlld3BvcnQpLlxuICovXG5jb25zdCByb290ID0gZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLlwiLCBpbXBvcnQubWV0YS51cmwpKTtcblxuLyoqIERvbWluaW8gY2Fub25pY28gZGVsIHNpdGlvIChwYXJhIHNpdGVtYXAgeSBVUkxzIGFic29sdXRhcykuICovXG5jb25zdCBTSVRFX1VSTCA9IFwiaHR0cHM6Ly93aWx2YXJkby5jb21cIjtcblxuLyoqXG4gKiBSZWRpcmlnZSAoMzAxKSBsYXMgcnV0YXMgXCJkZSBjYXJwZXRhXCIgc2luIHNsYXNoIGZpbmFsIGEgc3UgdmVyc2lvbiBjb24gc2xhc2gsXG4gKiBwYXJhIHF1ZSAvYmxvZyB5IC9ibG9nLyAobyAvYmxvZy88c2x1Zz4geSAvYmxvZy88c2x1Zz4vKSBzZWFuIGVxdWl2YWxlbnRlcy5cbiAqIFNlIGlnbm9yYW4gbG9zIGludGVybm9zIGRlIFZpdGUgeSBsb3MgYXJjaGl2b3MgY29uIGV4dGVuc2lvbi5cbiAqL1xuY29uc3QgdHJhaWxpbmdTbGFzaFJlZGlyZWN0ID0gKCk6IFBsdWdpbiA9PiB7XG4gIGNvbnN0IG1pZGRsZXdhcmU6IENvbm5lY3QuTmV4dEhhbmRsZUZ1bmN0aW9uID0gKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgY29uc3QgdXJsID0gcmVxLnVybCA/PyBcIi9cIjtcbiAgICBjb25zdCBbcmF3UGF0aCwgcXVlcnldID0gdXJsLnNwbGl0KFwiP1wiKTtcbiAgICBjb25zdCBwYXRoID0gcmF3UGF0aCA/PyBcIi9cIjtcbiAgICBjb25zdCBpc0ludGVybmFsID1cbiAgICAgIHBhdGguc3RhcnRzV2l0aChcIi9AXCIpIHx8IHBhdGguc3RhcnRzV2l0aChcIi9zcmNcIikgfHwgcGF0aC5zdGFydHNXaXRoKFwiL25vZGVfbW9kdWxlc1wiKTtcblxuICAgIGlmICghaXNJbnRlcm5hbCAmJiBwYXRoICE9PSBcIi9cIiAmJiAhcGF0aC5lbmRzV2l0aChcIi9cIikgJiYgIXBhdGguaW5jbHVkZXMoXCIuXCIpKSB7XG4gICAgICByZXMuc3RhdHVzQ29kZSA9IDMwMTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCBgJHtwYXRofS8ke3F1ZXJ5ID8gYD8ke3F1ZXJ5fWAgOiBcIlwifWApO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBuZXh0KCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBcInRyYWlsaW5nLXNsYXNoLXJlZGlyZWN0XCIsXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShtaWRkbGV3YXJlKTtcbiAgICB9LFxuICAgIGNvbmZpZ3VyZVByZXZpZXdTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKG1pZGRsZXdhcmUpO1xuICAgIH0sXG4gIH07XG59O1xuXG4vKiogQ29udmllcnRlIHVuYSBydXRhIGRlIGFyY2hpdm8gSFRNTCAocmVsYXRpdmEgYWwgb3V0RGlyKSBlbiBzdSBVUkwgY2Fub25pY2EgY29uIHNsYXNoLiAqL1xuY29uc3QgaHRtbFRvUm91dGUgPSAoZmlsZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgY29uc3Qgbm9ybWFsaXplZCA9IGZpbGUuc3BsaXQoXCJcXFxcXCIpLmpvaW4oXCIvXCIpO1xuICBpZiAobm9ybWFsaXplZCA9PT0gXCJpbmRleC5odG1sXCIpIHJldHVybiBcIi9cIjtcbiAgaWYgKG5vcm1hbGl6ZWQuZW5kc1dpdGgoXCIvaW5kZXguaHRtbFwiKSkge1xuICAgIHJldHVybiBgLyR7bm9ybWFsaXplZC5zbGljZSgwLCBub3JtYWxpemVkLmxlbmd0aCAtIFwiaW5kZXguaHRtbFwiLmxlbmd0aCl9YDtcbiAgfVxuICByZXR1cm4gYC8ke25vcm1hbGl6ZWR9YDtcbn07XG5cbi8qKiBSZWNvbGVjdGEgcmVjdXJzaXZhbWVudGUgdG9kb3MgbG9zIC5odG1sIGRlbnRybyBkZSB1biBkaXJlY3RvcmlvLiAqL1xuY29uc3QgY29sbGVjdEh0bWwgPSAoZGlyOiBzdHJpbmcsIGJhc2U6IHN0cmluZywgb3V0OiBzdHJpbmdbXSk6IHZvaWQgPT4ge1xuICBmb3IgKGNvbnN0IG5hbWUgb2YgcmVhZGRpclN5bmMoZGlyKSkge1xuICAgIGNvbnN0IGZ1bGwgPSBqb2luKGRpciwgbmFtZSk7XG4gICAgaWYgKHN0YXRTeW5jKGZ1bGwpLmlzRGlyZWN0b3J5KCkpIGNvbGxlY3RIdG1sKGZ1bGwsIGJhc2UsIG91dCk7XG4gICAgZWxzZSBpZiAobmFtZS5lbmRzV2l0aChcIi5odG1sXCIpKSBvdXQucHVzaChyZWxhdGl2ZShiYXNlLCBmdWxsKSk7XG4gIH1cbn07XG5cbi8qKlxuICogR2VuZXJhIHNpdGVtYXAueG1sIHRyYXMgZWwgYnVpbGQsIGVzY2FuZWFuZG8gdG9kYXMgbGFzIHBhZ2luYXMgSFRNTCBkZWwgb3V0RGlyLlxuICogQ2FkYSBwYWdpbmEgbyBwb3N0IG51ZXZvIGFwYXJlY2UgYXV0b21hdGljYW1lbnRlLCBzaW4gbWFudGVuZXJsbyBhIG1hbm8uXG4gKi9cbmNvbnN0IHNpdGVtYXAgPSAoKTogUGx1Z2luID0+IHtcbiAgbGV0IG91dERpckFicyA9IFwiXCI7XG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJzaXRlbWFwXCIsXG4gICAgY29uZmlnUmVzb2x2ZWQoY29uZmlnKSB7XG4gICAgICBvdXREaXJBYnMgPSByZXNvbHZlKGNvbmZpZy5yb290LCBjb25maWcuYnVpbGQub3V0RGlyKTtcbiAgICB9LFxuICAgIGNsb3NlQnVuZGxlKCkge1xuICAgICAgY29uc3QgZmlsZXM6IHN0cmluZ1tdID0gW107XG4gICAgICBjb2xsZWN0SHRtbChvdXREaXJBYnMsIG91dERpckFicywgZmlsZXMpO1xuXG4gICAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgICBjb25zdCBwcmlvcml0eUZvciA9IChyb3V0ZTogc3RyaW5nKTogc3RyaW5nID0+XG4gICAgICAgIHJvdXRlID09PSBcIi9cIiA/IFwiMS4wXCIgOiByb3V0ZSA9PT0gXCIvYmxvZy9cIiA/IFwiMC45XCIgOiBcIjAuOFwiO1xuXG4gICAgICBjb25zdCB1cmxzID0gZmlsZXNcbiAgICAgICAgLm1hcChodG1sVG9Sb3V0ZSlcbiAgICAgICAgLnNvcnQoKVxuICAgICAgICAubWFwKFxuICAgICAgICAgIChyb3V0ZSkgPT5cbiAgICAgICAgICAgIGAgIDx1cmw+XFxuICAgIDxsb2M+JHtTSVRFX1VSTH0ke3JvdXRlfTwvbG9jPlxcbiAgICA8bGFzdG1vZD4ke3RvZGF5fTwvbGFzdG1vZD5cXG4gICAgPGNoYW5nZWZyZXE+d2Vla2x5PC9jaGFuZ2VmcmVxPlxcbiAgICA8cHJpb3JpdHk+JHtwcmlvcml0eUZvcihyb3V0ZSl9PC9wcmlvcml0eT5cXG4gIDwvdXJsPmAsXG4gICAgICAgIClcbiAgICAgICAgLmpvaW4oXCJcXG5cIik7XG5cbiAgICAgIGNvbnN0IHhtbCA9IGA8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiPz5cXG48dXJsc2V0IHhtbG5zPVwiaHR0cDovL3d3dy5zaXRlbWFwcy5vcmcvc2NoZW1hcy9zaXRlbWFwLzAuOVwiPlxcbiR7dXJsc31cXG48L3VybHNldD5cXG5gO1xuICAgICAgd3JpdGVGaWxlU3luYyhqb2luKG91dERpckFicywgXCJzaXRlbWFwLnhtbFwiKSwgeG1sLCBcInV0ZjhcIik7XG4gICAgfSxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6IFwiLi9cIixcbiAgcGx1Z2luczogW3RyYWlsaW5nU2xhc2hSZWRpcmVjdCgpLCBzaXRlbWFwKCldLFxuICBidWlsZDoge1xuICAgIHRhcmdldDogXCJlczIwMjBcIixcbiAgICBjc3NDb2RlU3BsaXQ6IGZhbHNlLFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcmVzb2x2ZShyb290LCBcImluZGV4Lmh0bWxcIiksXG4gICAgICAgIGJsb2c6IHJlc29sdmUocm9vdCwgXCJibG9nL2luZGV4Lmh0bWxcIiksXG4gICAgICAgIFwiYmxvZy1wcm9ncmFtYXItZW4tbGEtZXJhLWRlLWxhLWlhXCI6IHJlc29sdmUocm9vdCwgXCJibG9nL3Byb2dyYW1hci1lbi1sYS1lcmEtZGUtbGEtaWEvaW5kZXguaHRtbFwiKSxcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdGhyZWU6IFtcInRocmVlXCJdLFxuICAgICAgICAgIGdzYXA6IFtcImdzYXBcIl0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgaG9zdDogdHJ1ZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrVSxTQUFTLG9CQUErQztBQUMxWCxTQUFTLE1BQU0sVUFBVSxlQUFlO0FBQ3hDLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsYUFBYSxVQUFVLHFCQUFxQjtBQUhtSixJQUFNLDJDQUEyQztBQVd6UCxJQUFNLE9BQU8sY0FBYyxJQUFJLElBQUksS0FBSyx3Q0FBZSxDQUFDO0FBR3hELElBQU0sV0FBVztBQU9qQixJQUFNLHdCQUF3QixNQUFjO0FBQzFDLFFBQU0sYUFBeUMsQ0FBQyxLQUFLLEtBQUssU0FBUztBQUNqRSxVQUFNLE1BQU0sSUFBSSxPQUFPO0FBQ3ZCLFVBQU0sQ0FBQyxTQUFTLEtBQUssSUFBSSxJQUFJLE1BQU0sR0FBRztBQUN0QyxVQUFNLE9BQU8sV0FBVztBQUN4QixVQUFNLGFBQ0osS0FBSyxXQUFXLElBQUksS0FBSyxLQUFLLFdBQVcsTUFBTSxLQUFLLEtBQUssV0FBVyxlQUFlO0FBRXJGLFFBQUksQ0FBQyxjQUFjLFNBQVMsT0FBTyxDQUFDLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLFNBQVMsR0FBRyxHQUFHO0FBQzdFLFVBQUksYUFBYTtBQUNqQixVQUFJLFVBQVUsWUFBWSxHQUFHLElBQUks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
