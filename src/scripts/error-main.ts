/**
 * Entry point de la pagina de error (404 y futuros codigos).
 * Reusa el design system del site sin la escena Three.js, igual que el blog.
 */

import "../styles/styles.scss";
import { initI18n } from "./i18n";
import { initTheme } from "./theme";
import { initHeaderScrollState } from "./motion";
import { initCursor } from "./cursor";
import { initErrorTerminal } from "./error";

const boot = (): void => {
  initI18n();
  initTheme();
  initHeaderScrollState();
  initCursor();
  initErrorTerminal();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
