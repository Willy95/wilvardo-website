// vite.config.ts
import { defineConfig } from "file:///sessions/serene-great-hawking/mnt/wilvardo-site/node_modules/vite/dist/node/index.js";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
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
  if (file === "index.html") return "/";
  if (file.endsWith("/index.html")) return `/${file.slice(0, file.length - "index.html".length)}`;
  return `/${file}`;
};
var sitemap = () => ({
  name: "sitemap",
  generateBundle(_options, bundle) {
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const routes = Object.keys(bundle).filter((file) => file.endsWith(".html")).map(htmlToRoute).sort();
    const priorityFor = (route) => route === "/" ? "1.0" : route === "/blog/" ? "0.9" : "0.8";
    const urls = routes.map(
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
    this.emitFile({ type: "asset", fileName: "sitemap.xml", source: xml });
  }
});
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvc2VyZW5lLWdyZWF0LWhhd2tpbmcvbW50L3dpbHZhcmRvLXNpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9zZXNzaW9ucy9zZXJlbmUtZ3JlYXQtaGF3a2luZy9tbnQvd2lsdmFyZG8tc2l0ZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vc2Vzc2lvbnMvc2VyZW5lLWdyZWF0LWhhd2tpbmcvbW50L3dpbHZhcmRvLXNpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgQ29ubmVjdCwgdHlwZSBQbHVnaW4gfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcblxuLyoqXG4gKiBDb25maWd1cmFjaW9uIGRlIFZpdGUgcGFyYSBlbCBwZXJzb25hbCBzaXRlIGRlIFdpbHZhcmRvLlxuICogLSBTaW4gZnJhbWV3b3JrcyBkZSBVSS5cbiAqIC0gTXVsdGktcGFnaW5hIChNUEEpOiBob21lLCBpbmRpY2UgZGVsIGJsb2cgeSBlbnRyYWRhcyBkZSBibG9nLlxuICogLSBDb2RlLXNwbGl0dGluZyBtYW51YWwgcGFyYSBUaHJlZS5qcyAoY2FyZ2FkbyBzb2xvIGN1YW5kbyBlbCBoZXJvIGVudHJhIGFsIHZpZXdwb3J0KS5cbiAqL1xuY29uc3Qgcm9vdCA9IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi5cIiwgaW1wb3J0Lm1ldGEudXJsKSk7XG5cbi8qKiBEb21pbmlvIGNhbm9uaWNvIGRlbCBzaXRpbyAocGFyYSBzaXRlbWFwIHkgVVJMcyBhYnNvbHV0YXMpLiAqL1xuY29uc3QgU0lURV9VUkwgPSBcImh0dHBzOi8vd2lsdmFyZG8uY29tXCI7XG5cbi8qKlxuICogUmVkaXJpZ2UgKDMwMSkgbGFzIHJ1dGFzIFwiZGUgY2FycGV0YVwiIHNpbiBzbGFzaCBmaW5hbCBhIHN1IHZlcnNpb24gY29uIHNsYXNoLFxuICogcGFyYSBxdWUgL2Jsb2cgeSAvYmxvZy8gKG8gL2Jsb2cvPHNsdWc+IHkgL2Jsb2cvPHNsdWc+Lykgc2VhbiBlcXVpdmFsZW50ZXMuXG4gKiBTZSBpZ25vcmFuIGxvcyBpbnRlcm5vcyBkZSBWaXRlIHkgbG9zIGFyY2hpdm9zIGNvbiBleHRlbnNpb24uXG4gKi9cbmNvbnN0IHRyYWlsaW5nU2xhc2hSZWRpcmVjdCA9ICgpOiBQbHVnaW4gPT4ge1xuICBjb25zdCBtaWRkbGV3YXJlOiBDb25uZWN0Lk5leHRIYW5kbGVGdW5jdGlvbiA9IChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgIGNvbnN0IHVybCA9IHJlcS51cmwgPz8gXCIvXCI7XG4gICAgY29uc3QgW3Jhd1BhdGgsIHF1ZXJ5XSA9IHVybC5zcGxpdChcIj9cIik7XG4gICAgY29uc3QgcGF0aCA9IHJhd1BhdGggPz8gXCIvXCI7XG4gICAgY29uc3QgaXNJbnRlcm5hbCA9XG4gICAgICBwYXRoLnN0YXJ0c1dpdGgoXCIvQFwiKSB8fCBwYXRoLnN0YXJ0c1dpdGgoXCIvc3JjXCIpIHx8IHBhdGguc3RhcnRzV2l0aChcIi9ub2RlX21vZHVsZXNcIik7XG5cbiAgICBpZiAoIWlzSW50ZXJuYWwgJiYgcGF0aCAhPT0gXCIvXCIgJiYgIXBhdGguZW5kc1dpdGgoXCIvXCIpICYmICFwYXRoLmluY2x1ZGVzKFwiLlwiKSkge1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSAzMDE7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgYCR7cGF0aH0vJHtxdWVyeSA/IGA/JHtxdWVyeX1gIDogXCJcIn1gKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbmV4dCgpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJ0cmFpbGluZy1zbGFzaC1yZWRpcmVjdFwiLFxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UobWlkZGxld2FyZSk7XG4gICAgfSxcbiAgICBjb25maWd1cmVQcmV2aWV3U2VydmVyKHNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShtaWRkbGV3YXJlKTtcbiAgICB9LFxuICB9O1xufTtcblxuLyoqIENvbnZpZXJ0ZSBlbCBub21icmUgZGUgYXJjaGl2byBIVE1MIGRlbCBidW5kbGUgZW4gc3UgcnV0YSBjYW5vbmljYSBjb24gc2xhc2guICovXG5jb25zdCBodG1sVG9Sb3V0ZSA9IChmaWxlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICBpZiAoZmlsZSA9PT0gXCJpbmRleC5odG1sXCIpIHJldHVybiBcIi9cIjtcbiAgaWYgKGZpbGUuZW5kc1dpdGgoXCIvaW5kZXguaHRtbFwiKSkgcmV0dXJuIGAvJHtmaWxlLnNsaWNlKDAsIGZpbGUubGVuZ3RoIC0gXCJpbmRleC5odG1sXCIubGVuZ3RoKX1gO1xuICByZXR1cm4gYC8ke2ZpbGV9YDtcbn07XG5cbi8qKlxuICogR2VuZXJhIHNpdGVtYXAueG1sIGVuIGVsIGJ1aWxkIGEgcGFydGlyIGRlIFRPREFTIGxhcyBwYWdpbmFzIEhUTUwgZW1pdGlkYXMuXG4gKiBDYWRhIHBhZ2luYSBvIHBvc3QgbnVldm8gKG51ZXZvIGVudHJ5KSBhcGFyZWNlIGF1dG9tYXRpY2FtZW50ZSwgc2luIG1hbnRlbmVybG8gYSBtYW5vLlxuICovXG5jb25zdCBzaXRlbWFwID0gKCk6IFBsdWdpbiA9PiAoe1xuICBuYW1lOiBcInNpdGVtYXBcIixcbiAgZ2VuZXJhdGVCdW5kbGUoX29wdGlvbnMsIGJ1bmRsZSkge1xuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNsaWNlKDAsIDEwKTtcbiAgICBjb25zdCByb3V0ZXMgPSBPYmplY3Qua2V5cyhidW5kbGUpXG4gICAgICAuZmlsdGVyKChmaWxlKSA9PiBmaWxlLmVuZHNXaXRoKFwiLmh0bWxcIikpXG4gICAgICAubWFwKGh0bWxUb1JvdXRlKVxuICAgICAgLnNvcnQoKTtcblxuICAgIGNvbnN0IHByaW9yaXR5Rm9yID0gKHJvdXRlOiBzdHJpbmcpOiBzdHJpbmcgPT5cbiAgICAgIHJvdXRlID09PSBcIi9cIiA/IFwiMS4wXCIgOiByb3V0ZSA9PT0gXCIvYmxvZy9cIiA/IFwiMC45XCIgOiBcIjAuOFwiO1xuXG4gICAgY29uc3QgdXJscyA9IHJvdXRlc1xuICAgICAgLm1hcChcbiAgICAgICAgKHJvdXRlKSA9PlxuICAgICAgICAgIGAgIDx1cmw+XFxuICAgIDxsb2M+JHtTSVRFX1VSTH0ke3JvdXRlfTwvbG9jPlxcbiAgICA8bGFzdG1vZD4ke3RvZGF5fTwvbGFzdG1vZD5cXG4gICAgPGNoYW5nZWZyZXE+d2Vla2x5PC9jaGFuZ2VmcmVxPlxcbiAgICA8cHJpb3JpdHk+JHtwcmlvcml0eUZvcihyb3V0ZSl9PC9wcmlvcml0eT5cXG4gIDwvdXJsPmAsXG4gICAgICApXG4gICAgICAuam9pbihcIlxcblwiKTtcblxuICAgIGNvbnN0IHhtbCA9IGA8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiPz5cXG48dXJsc2V0IHhtbG5zPVwiaHR0cDovL3d3dy5zaXRlbWFwcy5vcmcvc2NoZW1hcy9zaXRlbWFwLzAuOVwiPlxcbiR7dXJsc31cXG48L3VybHNldD5cXG5gO1xuICAgIHRoaXMuZW1pdEZpbGUoeyB0eXBlOiBcImFzc2V0XCIsIGZpbGVOYW1lOiBcInNpdGVtYXAueG1sXCIsIHNvdXJjZTogeG1sIH0pO1xuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6IFwiLi9cIixcbiAgcGx1Z2luczogW3RyYWlsaW5nU2xhc2hSZWRpcmVjdCgpLCBzaXRlbWFwKCldLFxuICBidWlsZDoge1xuICAgIHRhcmdldDogXCJlczIwMjBcIixcbiAgICBjc3NDb2RlU3BsaXQ6IGZhbHNlLFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcmVzb2x2ZShyb290LCBcImluZGV4Lmh0bWxcIiksXG4gICAgICAgIGJsb2c6IHJlc29sdmUocm9vdCwgXCJibG9nL2luZGV4Lmh0bWxcIiksXG4gICAgICAgIFwiYmxvZy1wcm9ncmFtYXItZW4tbGEtZXJhLWRlLWxhLWlhXCI6IHJlc29sdmUocm9vdCwgXCJibG9nL3Byb2dyYW1hci1lbi1sYS1lcmEtZGUtbGEtaWEvaW5kZXguaHRtbFwiKSxcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdGhyZWU6IFtcInRocmVlXCJdLFxuICAgICAgICAgIGdzYXA6IFtcImdzYXBcIl0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgaG9zdDogdHJ1ZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrVSxTQUFTLG9CQUErQztBQUMxWCxTQUFTLGVBQWU7QUFDeEIsU0FBUyxxQkFBcUI7QUFGMEssSUFBTSwyQ0FBMkM7QUFVelAsSUFBTSxPQUFPLGNBQWMsSUFBSSxJQUFJLEtBQUssd0NBQWUsQ0FBQztBQUd4RCxJQUFNLFdBQVc7QUFPakIsSUFBTSx3QkFBd0IsTUFBYztBQUMxQyxRQUFNLGFBQXlDLENBQUMsS0FBSyxLQUFLLFNBQVM7QUFDakUsVUFBTSxNQUFNLElBQUksT0FBTztBQUN2QixVQUFNLENBQUMsU0FBUyxLQUFLLElBQUksSUFBSSxNQUFNLEdBQUc7QUFDdEMsVUFBTSxPQUFPLFdBQVc7QUFDeEIsVUFBTSxhQUNKLEtBQUssV0FBVyxJQUFJLEtBQUssS0FBSyxXQUFXLE1BQU0sS0FBSyxLQUFLLFdBQVcsZUFBZTtBQUVyRixRQUFJLENBQUMsY0FBYyxTQUFTLE9BQU8sQ0FBQyxLQUFLLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxTQUFTLEdBQUcsR0FBRztBQUM3RSxVQUFJLGFBQWE7QUFDakIsVUFBSSxVQUFVLFlBQVksR0FBRyxJQUFJLElBQUksUUFBUSxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7QUFDL0QsVUFBSSxJQUFJO0FBQ1I7QUFBQSxJQUNGO0FBQ0EsU0FBSztBQUFBLEVBQ1A7QUFFQSxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixnQkFBZ0IsUUFBUTtBQUN0QixhQUFPLFlBQVksSUFBSSxVQUFVO0FBQUEsSUFDbkM7QUFBQSxJQUNBLHVCQUF1QixRQUFRO0FBQzdCLGFBQU8sWUFBWSxJQUFJLFVBQVU7QUFBQSxJQUNuQztBQUFBLEVBQ0Y7QUFDRjtBQUdBLElBQU0sY0FBYyxDQUFDLFNBQXlCO0FBQzVDLE1BQUksU0FBUyxhQUFjLFFBQU87QUFDbEMsTUFBSSxLQUFLLFNBQVMsYUFBYSxFQUFHLFFBQU8sSUFBSSxLQUFLLE1BQU0sR0FBRyxLQUFLLFNBQVMsYUFBYSxNQUFNLENBQUM7QUFDN0YsU0FBTyxJQUFJLElBQUk7QUFDakI7QUFNQSxJQUFNLFVBQVUsT0FBZTtBQUFBLEVBQzdCLE1BQU07QUFBQSxFQUNOLGVBQWUsVUFBVSxRQUFRO0FBQy9CLFVBQU0sU0FBUSxvQkFBSSxLQUFLLEdBQUUsWUFBWSxFQUFFLE1BQU0sR0FBRyxFQUFFO0FBQ2xELFVBQU0sU0FBUyxPQUFPLEtBQUssTUFBTSxFQUM5QixPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsT0FBTyxDQUFDLEVBQ3ZDLElBQUksV0FBVyxFQUNmLEtBQUs7QUFFUixVQUFNLGNBQWMsQ0FBQyxVQUNuQixVQUFVLE1BQU0sUUFBUSxVQUFVLFdBQVcsUUFBUTtBQUV2RCxVQUFNLE9BQU8sT0FDVjtBQUFBLE1BQ0MsQ0FBQyxVQUNDO0FBQUEsV0FBcUIsUUFBUSxHQUFHLEtBQUs7QUFBQSxlQUF3QixLQUFLO0FBQUE7QUFBQSxnQkFBa0UsWUFBWSxLQUFLLENBQUM7QUFBQTtBQUFBLElBQzFKLEVBQ0MsS0FBSyxJQUFJO0FBRVosVUFBTSxNQUFNO0FBQUE7QUFBQSxFQUF5RyxJQUFJO0FBQUE7QUFBQTtBQUN6SCxTQUFLLFNBQVMsRUFBRSxNQUFNLFNBQVMsVUFBVSxlQUFlLFFBQVEsSUFBSSxDQUFDO0FBQUEsRUFDdkU7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVMsQ0FBQyxzQkFBc0IsR0FBRyxRQUFRLENBQUM7QUFBQSxFQUM1QyxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixjQUFjO0FBQUEsSUFDZCxXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLFFBQVEsTUFBTSxZQUFZO0FBQUEsUUFDaEMsTUFBTSxRQUFRLE1BQU0saUJBQWlCO0FBQUEsUUFDckMscUNBQXFDLFFBQVEsTUFBTSw4Q0FBOEM7QUFBQSxNQUNuRztBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osT0FBTyxDQUFDLE9BQU87QUFBQSxVQUNmLE1BQU0sQ0FBQyxNQUFNO0FBQUEsUUFDZjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
