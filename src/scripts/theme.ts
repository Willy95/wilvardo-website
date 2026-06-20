/**
 * Modulo de tema: sistema / claro / oscuro (3 estados).
 * - Por defecto sigue la preferencia del sistema (prefers-color-scheme), de forma dinamica.
 * - El usuario cicla entre sistema, claro y oscuro; la eleccion se persiste.
 * - Usa View Transitions API (circular reveal) solo cuando el color resuelto cambia.
 */

type ThemePref = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "wilvardo:theme";
const CYCLE: readonly ThemePref[] = ["system", "light", "dark"];

/** Tema concreto que pide el sistema operativo en este momento. */
const systemTheme = (): ResolvedTheme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

/** Resuelve una preferencia a un tema concreto aplicable. */
const resolveTheme = (pref: ThemePref): ResolvedTheme => (pref === "system" ? systemTheme() : pref);

/** Lee la preferencia persistida; si no hay una valida, usa "system". */
const detectInitialPref = (): ThemePref => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
};

const labelFor = (pref: ThemePref): string =>
  pref === "system" ? "Tema: sistema" : pref === "light" ? "Tema: claro" : "Tema: oscuro";

let currentPref: ThemePref = "system";

/** Aplica el tema resuelto al documento y refleja el estado en cada boton. */
const applyPref = (pref: ThemePref): void => {
  document.documentElement.setAttribute("data-theme", resolveTheme(pref));
  document.querySelectorAll<HTMLElement>("[data-action='toggle-theme']").forEach((btn) => {
    btn.setAttribute("data-pref", pref);
    btn.setAttribute("aria-label", `${labelFor(pref)}. Pulsa para cambiar`);
    btn.setAttribute("title", labelFor(pref));
  });
};

interface ViewTransitionLike {
  ready: Promise<void>;
  finished: Promise<void>;
}

const startViewTransitionIfAvailable = (cb: () => void): ViewTransitionLike | null => {
  const doc = document as unknown as { startViewTransition?: (cb: () => void) => ViewTransitionLike };
  return typeof doc.startViewTransition === "function" ? doc.startViewTransition(cb) : null;
};

/** Anima el cambio de color con un circular reveal centrado en el boton. */
const animateReveal = (event: MouseEvent, toTheme: ResolvedTheme, pref: ThemePref): void => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const transition = startViewTransitionIfAvailable(() => applyPref(pref));
  if (!transition) {
    applyPref(pref);
    return;
  }

  void transition.ready.then(() => {
    const darkening = toTheme === "dark";
    document.documentElement.animate(
      {
        clipPath: darkening
          ? [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
          : [`circle(${endRadius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`],
      },
      {
        duration: 500,
        easing: "cubic-bezier(0.2, 0, 0, 1)",
        pseudoElement: darkening ? "::view-transition-new(root)" : "::view-transition-old(root)",
      },
    );
  });
};

/** Avanza la preferencia en ciclo: sistema -> claro -> oscuro -> sistema. */
export const cycleTheme = (event?: MouseEvent): void => {
  const prevResolved = resolveTheme(currentPref);
  const nextPref = CYCLE[(CYCLE.indexOf(currentPref) + 1) % CYCLE.length] ?? "system";
  const nextResolved = resolveTheme(nextPref);
  currentPref = nextPref;
  localStorage.setItem(STORAGE_KEY, nextPref);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (event && !reduceMotion && prevResolved !== nextResolved) {
    animateReveal(event, nextResolved, nextPref);
  } else {
    applyPref(nextPref);
  }
};

/** Inicializa el tema y conecta los botones. */
export const initTheme = (): void => {
  currentPref = detectInitialPref();
  applyPref(currentPref);

  document.querySelectorAll<HTMLButtonElement>("[data-action='toggle-theme']").forEach((btn) => {
    btn.addEventListener("click", (e) => cycleTheme(e));
  });

  // El cambio del sistema se refleja en vivo solo si la preferencia es "system".
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (currentPref === "system") applyPref("system");
  });
};
