// vite.config.ts
import { defineConfig } from "file:///sessions/serene-great-hawking/mnt/wilvardo-site/node_modules/vite/dist/node/index.js";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
var __vite_injected_original_import_meta_url = "file:///sessions/serene-great-hawking/mnt/wilvardo-site/vite.config.ts";
var root = fileURLToPath(new URL(".", __vite_injected_original_import_meta_url));
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
var vite_config_default = defineConfig({
  base: "./",
  plugins: [trailingSlashRedirect()],
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvc2VyZW5lLWdyZWF0LWhhd2tpbmcvbW50L3dpbHZhcmRvLXNpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9zZXNzaW9ucy9zZXJlbmUtZ3JlYXQtaGF3a2luZy9tbnQvd2lsdmFyZG8tc2l0ZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vc2Vzc2lvbnMvc2VyZW5lLWdyZWF0LWhhd2tpbmcvbW50L3dpbHZhcmRvLXNpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgQ29ubmVjdCwgdHlwZSBQbHVnaW4gfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcblxuLyoqXG4gKiBDb25maWd1cmFjaW9uIGRlIFZpdGUgcGFyYSBlbCBwZXJzb25hbCBzaXRlIGRlIFdpbHZhcmRvLlxuICogLSBTaW4gZnJhbWV3b3JrcyBkZSBVSS5cbiAqIC0gTXVsdGktcGFnaW5hIChNUEEpOiBob21lLCBpbmRpY2UgZGVsIGJsb2cgeSBlbnRyYWRhcyBkZSBibG9nLlxuICogLSBDb2RlLXNwbGl0dGluZyBtYW51YWwgcGFyYSBUaHJlZS5qcyAoY2FyZ2FkbyBzb2xvIGN1YW5kbyBlbCBoZXJvIGVudHJhIGFsIHZpZXdwb3J0KS5cbiAqL1xuY29uc3Qgcm9vdCA9IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi5cIiwgaW1wb3J0Lm1ldGEudXJsKSk7XG5cbi8qKlxuICogUmVkaXJpZ2UgKDMwMSkgbGFzIHJ1dGFzIFwiZGUgY2FycGV0YVwiIHNpbiBzbGFzaCBmaW5hbCBhIHN1IHZlcnNpb24gY29uIHNsYXNoLFxuICogcGFyYSBxdWUgL2Jsb2cgeSAvYmxvZy8gKG8gL2Jsb2cvPHNsdWc+IHkgL2Jsb2cvPHNsdWc+Lykgc2VhbiBlcXVpdmFsZW50ZXMuXG4gKiBTZSBpZ25vcmFuIGxvcyBpbnRlcm5vcyBkZSBWaXRlIHkgbG9zIGFyY2hpdm9zIGNvbiBleHRlbnNpb24uXG4gKi9cbmNvbnN0IHRyYWlsaW5nU2xhc2hSZWRpcmVjdCA9ICgpOiBQbHVnaW4gPT4ge1xuICBjb25zdCBtaWRkbGV3YXJlOiBDb25uZWN0Lk5leHRIYW5kbGVGdW5jdGlvbiA9IChyZXEsIHJlcywgbmV4dCkgPT4ge1xuICAgIGNvbnN0IHVybCA9IHJlcS51cmwgPz8gXCIvXCI7XG4gICAgY29uc3QgW3Jhd1BhdGgsIHF1ZXJ5XSA9IHVybC5zcGxpdChcIj9cIik7XG4gICAgY29uc3QgcGF0aCA9IHJhd1BhdGggPz8gXCIvXCI7XG4gICAgY29uc3QgaXNJbnRlcm5hbCA9XG4gICAgICBwYXRoLnN0YXJ0c1dpdGgoXCIvQFwiKSB8fCBwYXRoLnN0YXJ0c1dpdGgoXCIvc3JjXCIpIHx8IHBhdGguc3RhcnRzV2l0aChcIi9ub2RlX21vZHVsZXNcIik7XG5cbiAgICBpZiAoIWlzSW50ZXJuYWwgJiYgcGF0aCAhPT0gXCIvXCIgJiYgIXBhdGguZW5kc1dpdGgoXCIvXCIpICYmICFwYXRoLmluY2x1ZGVzKFwiLlwiKSkge1xuICAgICAgcmVzLnN0YXR1c0NvZGUgPSAzMDE7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgYCR7cGF0aH0vJHtxdWVyeSA/IGA/JHtxdWVyeX1gIDogXCJcIn1gKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbmV4dCgpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJ0cmFpbGluZy1zbGFzaC1yZWRpcmVjdFwiLFxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UobWlkZGxld2FyZSk7XG4gICAgfSxcbiAgICBjb25maWd1cmVQcmV2aWV3U2VydmVyKHNlcnZlcikge1xuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShtaWRkbGV3YXJlKTtcbiAgICB9LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgYmFzZTogXCIuL1wiLFxuICBwbHVnaW5zOiBbdHJhaWxpbmdTbGFzaFJlZGlyZWN0KCldLFxuICBidWlsZDoge1xuICAgIHRhcmdldDogXCJlczIwMjBcIixcbiAgICBjc3NDb2RlU3BsaXQ6IGZhbHNlLFxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcmVzb2x2ZShyb290LCBcImluZGV4Lmh0bWxcIiksXG4gICAgICAgIGJsb2c6IHJlc29sdmUocm9vdCwgXCJibG9nL2luZGV4Lmh0bWxcIiksXG4gICAgICAgIFwiYmxvZy1wcm9ncmFtYXItZW4tbGEtZXJhLWRlLWxhLWlhXCI6IHJlc29sdmUocm9vdCwgXCJibG9nL3Byb2dyYW1hci1lbi1sYS1lcmEtZGUtbGEtaWEvaW5kZXguaHRtbFwiKSxcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdGhyZWU6IFtcInRocmVlXCJdLFxuICAgICAgICAgIGdzYXA6IFtcImdzYXBcIl0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDUxNzMsXG4gICAgaG9zdDogdHJ1ZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrVSxTQUFTLG9CQUErQztBQUMxWCxTQUFTLGVBQWU7QUFDeEIsU0FBUyxxQkFBcUI7QUFGMEssSUFBTSwyQ0FBMkM7QUFVelAsSUFBTSxPQUFPLGNBQWMsSUFBSSxJQUFJLEtBQUssd0NBQWUsQ0FBQztBQU94RCxJQUFNLHdCQUF3QixNQUFjO0FBQzFDLFFBQU0sYUFBeUMsQ0FBQyxLQUFLLEtBQUssU0FBUztBQUNqRSxVQUFNLE1BQU0sSUFBSSxPQUFPO0FBQ3ZCLFVBQU0sQ0FBQyxTQUFTLEtBQUssSUFBSSxJQUFJLE1BQU0sR0FBRztBQUN0QyxVQUFNLE9BQU8sV0FBVztBQUN4QixVQUFNLGFBQ0osS0FBSyxXQUFXLElBQUksS0FBSyxLQUFLLFdBQVcsTUFBTSxLQUFLLEtBQUssV0FBVyxlQUFlO0FBRXJGLFFBQUksQ0FBQyxjQUFjLFNBQVMsT0FBTyxDQUFDLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLFNBQVMsR0FBRyxHQUFHO0FBQzdFLFVBQUksYUFBYTtBQUNqQixVQUFJLFVBQVUsWUFBWSxHQUFHLElBQUksSUFBSSxRQUFRLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtBQUMvRCxVQUFJLElBQUk7QUFDUjtBQUFBLElBQ0Y7QUFDQSxTQUFLO0FBQUEsRUFDUDtBQUVBLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLGdCQUFnQixRQUFRO0FBQ3RCLGFBQU8sWUFBWSxJQUFJLFVBQVU7QUFBQSxJQUNuQztBQUFBLElBQ0EsdUJBQXVCLFFBQVE7QUFDN0IsYUFBTyxZQUFZLElBQUksVUFBVTtBQUFBLElBQ25DO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sU0FBUyxDQUFDLHNCQUFzQixDQUFDO0FBQUEsRUFDakMsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsY0FBYztBQUFBLElBQ2QsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsTUFBTSxRQUFRLE1BQU0sWUFBWTtBQUFBLFFBQ2hDLE1BQU0sUUFBUSxNQUFNLGlCQUFpQjtBQUFBLFFBQ3JDLHFDQUFxQyxRQUFRLE1BQU0sOENBQThDO0FBQUEsTUFDbkc7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLE9BQU8sQ0FBQyxPQUFPO0FBQUEsVUFDZixNQUFNLENBQUMsTUFBTTtBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
