// vite.config.ts
import { defineConfig } from "file:///sessions/serene-great-hawking/mnt/wilvardo-site/node_modules/vite/dist/node/index.js";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
var __vite_injected_original_import_meta_url = "file:///sessions/serene-great-hawking/mnt/wilvardo-site/vite.config.ts";
var root = fileURLToPath(new URL(".", __vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  base: "./",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvc2VyZW5lLWdyZWF0LWhhd2tpbmcvbW50L3dpbHZhcmRvLXNpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9zZXNzaW9ucy9zZXJlbmUtZ3JlYXQtaGF3a2luZy9tbnQvd2lsdmFyZG8tc2l0ZS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vc2Vzc2lvbnMvc2VyZW5lLWdyZWF0LWhhd2tpbmcvbW50L3dpbHZhcmRvLXNpdGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcblxuLyoqXG4gKiBDb25maWd1cmFjaW9uIGRlIFZpdGUgcGFyYSBlbCBwZXJzb25hbCBzaXRlIGRlIFdpbHZhcmRvLlxuICogLSBTaW4gZnJhbWV3b3JrcyBkZSBVSS5cbiAqIC0gTXVsdGktcGFnaW5hIChNUEEpOiBob21lLCBpbmRpY2UgZGVsIGJsb2cgeSBlbnRyYWRhcyBkZSBibG9nLlxuICogLSBDb2RlLXNwbGl0dGluZyBtYW51YWwgcGFyYSBUaHJlZS5qcyAoY2FyZ2FkbyBzb2xvIGN1YW5kbyBlbCBoZXJvIGVudHJhIGFsIHZpZXdwb3J0KS5cbiAqL1xuY29uc3Qgcm9vdCA9IGZpbGVVUkxUb1BhdGgobmV3IFVSTChcIi5cIiwgaW1wb3J0Lm1ldGEudXJsKSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJhc2U6IFwiLi9cIixcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6IFwiZXMyMDIwXCIsXG4gICAgY3NzQ29kZVNwbGl0OiBmYWxzZSxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGlucHV0OiB7XG4gICAgICAgIG1haW46IHJlc29sdmUocm9vdCwgXCJpbmRleC5odG1sXCIpLFxuICAgICAgICBibG9nOiByZXNvbHZlKHJvb3QsIFwiYmxvZy9pbmRleC5odG1sXCIpLFxuICAgICAgICBcImJsb2ctcHJvZ3JhbWFyLWVuLWxhLWVyYS1kZS1sYS1pYVwiOiByZXNvbHZlKHJvb3QsIFwiYmxvZy9wcm9ncmFtYXItZW4tbGEtZXJhLWRlLWxhLWlhL2luZGV4Lmh0bWxcIiksXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHRocmVlOiBbXCJ0aHJlZVwiXSxcbiAgICAgICAgICBnc2FwOiBbXCJnc2FwXCJdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczLFxuICAgIGhvc3Q6IHRydWUsXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1UsU0FBUyxvQkFBb0I7QUFDL1YsU0FBUyxlQUFlO0FBQ3hCLFNBQVMscUJBQXFCO0FBRjBLLElBQU0sMkNBQTJDO0FBVXpQLElBQU0sT0FBTyxjQUFjLElBQUksSUFBSSxLQUFLLHdDQUFlLENBQUM7QUFFeEQsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsY0FBYztBQUFBLElBQ2QsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsTUFBTSxRQUFRLE1BQU0sWUFBWTtBQUFBLFFBQ2hDLE1BQU0sUUFBUSxNQUFNLGlCQUFpQjtBQUFBLFFBQ3JDLHFDQUFxQyxRQUFRLE1BQU0sOENBQThDO0FBQUEsTUFDbkc7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLE9BQU8sQ0FBQyxPQUFPO0FBQUEsVUFDZixNQUFNLENBQUMsTUFBTTtBQUFBLFFBQ2Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
