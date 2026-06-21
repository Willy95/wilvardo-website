/**
 * Entry point del personal site. Orquesta la inicializacion de todos los modulos.
 * Three.js se carga lazy (solo cuando el hero entra en viewport).
 */

import "../styles/styles.scss";
import { initI18n } from "./i18n";
import { initTheme } from "./theme";
import { initRevealObserver, revealHeroClaim, initHeaderScrollState } from "./motion";
import {
  initCounters,
  initTiltCards,
  initScramble,
  initTerminal,
  initMagnetic,
  initPortrait,
  initTechIcons,
} from "./interactions";
import { initCursor } from "./cursor";
import { initMobileNav } from "./mobile-nav";

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Carga lazy del modulo Three.js solo cuando el hero entra en viewport. */
const initHeroLazy = (): void => {
  const canvas = document.querySelector<HTMLCanvasElement>(".hero-canvas");
  if (!canvas) return;

  if (REDUCED_MOTION) {
    canvas.style.display = "none";
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          obs.unobserve(entry.target);
          const { createHeroScene } = await import("./hero-scene");
          createHeroScene(canvas);
        }
      });
    },
    { threshold: 0.1 },
  );

  observer.observe(canvas);
};

const boot = (): void => {
  initI18n();
  initTheme();
  initHeaderScrollState();
  initMobileNav();
  revealHeroClaim();
  initRevealObserver();
  initCounters();
  initTiltCards();
  initScramble();
  initTerminal();
  initMagnetic();
  initPortrait();
  initTechIcons();
  initCursor();
  initHeroLazy();

  // Reinyectar iconos tras cambio de idioma (i18n reescribe el texto de los pills).
  document.addEventListener("lang-change", () => initTechIcons());
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
