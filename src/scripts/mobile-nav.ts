/**
 * Navegacion movil: panel lateral (drawer) que entra desde la izquierda al pulsar
 * el boton hamburguesa. Cierra al tocar el scrim, presionar Escape o elegir un link.
 * El markup se repite en cada pagina; si no esta presente, la funcion no hace nada.
 */

/** Conecta el boton hamburguesa con el panel lateral y su scrim. */
export const initMobileNav = (): void => {
  const toggle = document.querySelector<HTMLButtonElement>('[data-action="toggle-nav"]');
  const nav = document.querySelector<HTMLElement>("#mobile-nav");
  if (!toggle || !nav) return;

  const panel = nav.querySelector<HTMLElement>(".mobile-nav__panel");
  let isOpen = false;

  const open = (): void => {
    isOpen = true;
    nav.dataset["open"] = "true";
    nav.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Cerrar menú");
    // Bloquea el scroll de fondo mientras el panel esta abierto.
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("a")?.focus();
  };

  /** Cierra el panel. `returnFocus` evita robar el foco cuando el cierre viene de un link. */
  const close = (returnFocus: boolean): void => {
    isOpen = false;
    nav.dataset["open"] = "false";
    nav.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
    document.body.style.overflow = "";
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => (isOpen ? close(true) : open()));

  nav.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-action="close-nav"]')) close(true);
    else if (target.closest("a")) close(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) close(true);
  });
};
