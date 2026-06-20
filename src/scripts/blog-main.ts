/**
 * Entry point de las paginas del blog (/blog e /blog/<slug>).
 * Comparte el design system del site, pero sin la escena Three.js del home.
 */

import "../styles/styles.scss";
import { initTheme } from "./theme";
import { initHeaderScrollState } from "./motion";
import { initCursor } from "./cursor";
import { initPost } from "./post";
import { initBlogFilters } from "./blog";

const boot = (): void => {
  initTheme();
  initHeaderScrollState();
  initCursor();
  initPost();
  initBlogFilters();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
