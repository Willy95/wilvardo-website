/**
 * Logica de la pagina de error (terminal).
 * Inyecta la ruta intentada de forma segura (textContent) y, si hay movimiento
 * permitido, la teclea como typewriter antes de revelar la linea de shell.
 * El contenido significativo (codigo, titulo, cuerpo) vive siempre en el DOM:
 * la animacion solo afecta a elementos decorativos (aria-hidden).
 */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Escribe `text` en `el`, caracter por caracter. Resuelve al terminar. */
const typeInto = (el: HTMLElement, text: string, speedMs: number): Promise<void> =>
  new Promise((resolve) => {
    let i = 0;
    el.textContent = "";
    const tick = (): void => {
      // Slicing sobre textContent: el texto se trata como inerte, sin riesgo de inyeccion.
      el.textContent = text.slice(0, i);
      i += 1;
      if (i <= text.length) {
        window.setTimeout(tick, speedMs);
      } else {
        resolve();
      }
    };
    tick();
  });

/** Inicializa la terminal de error: ruta real + typewriter + revelado de la linea de shell. */
export const initErrorTerminal = (): void => {
  const root = document.querySelector<HTMLElement>("[data-error-terminal]");
  if (!root) return;

  const pathEl = root.querySelector<HTMLElement>("[data-error-path]");
  if (!pathEl) return;

  const shellLine = root.querySelector<HTMLElement>("[data-error-shell]");

  // location.pathname + search reflejan la ruta rota real que sirvio Nginx.
  const attempted = window.location.pathname + window.location.search;

  // Sin movimiento: estado final inmediato.
  if (REDUCED_MOTION) {
    pathEl.textContent = attempted;
    return;
  }

  // Con movimiento: oculta la linea de shell (decorativa), teclea la ruta y revela.
  if (shellLine) shellLine.style.visibility = "hidden";
  void typeInto(pathEl, attempted, 45).then(() => {
    if (shellLine) shellLine.style.visibility = "visible";
  });
};
