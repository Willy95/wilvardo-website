/**
 * Cursor personalizado: una flecha solida en color de marca (parte de un puntero clasico,
 * mejorado). Sigue exacto al puntero, con una estela tenue al moverse. Sobre elementos
 * interactivos crece y gana un glow de marca; al hacer click se encoge.
 * Solo con puntero fino (mouse); en tactil se deja el cursor nativo.
 * La estela se desactiva con `prefers-reduced-motion`.
 */

const INTERACTIVE =
  "a, button, summary, input, textarea, select, [data-magnetic], .service-card, .caps-card, .faq-item";

const ARROW_SVG =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.4 2.4 L21.5 9.2 L12.7 12.7 L9.2 21.5 Z"/></svg>';

const TIP = 2.4; // px del vertice (hotspot) dentro del SVG

export const initCursor = (): void => {
  if (!window.matchMedia("(pointer: fine)").matches) return; // tactil -> cursor nativo
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ghost = document.createElement("div");
  ghost.className = "cursor-arrow cursor-arrow--ghost";
  ghost.setAttribute("aria-hidden", "true");
  ghost.innerHTML = ARROW_SVG;

  const arrow = document.createElement("div");
  arrow.className = "cursor-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.innerHTML = ARROW_SVG;

  document.body.append(ghost, arrow);
  document.documentElement.classList.add("cursor-custom");

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let gx = mx;
  let gy = my;

  const place = (el: HTMLElement, x: number, y: number): void => {
    el.style.transform = `translate(${x - TIP}px, ${y - TIP}px)`;
  };
  place(arrow, mx, my);
  place(ghost, gx, gy);

  window.addEventListener(
    "pointermove",
    (event: PointerEvent): void => {
      mx = event.clientX;
      my = event.clientY;
      place(arrow, mx, my);
      if (reduceMotion) place(ghost, mx, my);
      const target = event.target instanceof Element ? event.target : null;
      arrow.classList.toggle("is-hover", Boolean(target?.closest(INTERACTIVE)));
    },
    { passive: true },
  );

  window.addEventListener("pointerdown", () => arrow.classList.add("is-down"), { passive: true });
  window.addEventListener("pointerup", () => arrow.classList.remove("is-down"), { passive: true });

  document.addEventListener("mouseleave", () => {
    arrow.classList.add("is-hidden");
    ghost.classList.add("is-hidden");
  });
  document.addEventListener("mouseenter", () => {
    arrow.classList.remove("is-hidden");
    ghost.classList.remove("is-hidden");
  });

  if (!reduceMotion) {
    const loop = (): void => {
      gx += (mx - gx) * 0.13;
      gy += (my - gy) * 0.13;
      place(ghost, gx, gy);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
};
