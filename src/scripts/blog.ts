/**
 * Filtro por pilar del indice del blog: muestra u oculta tarjetas segun el filtro activo.
 */
export const initBlogFilters = (): void => {
  const filters = Array.from(document.querySelectorAll<HTMLButtonElement>(".filter"));
  const cards = Array.from(document.querySelectorAll<HTMLElement>(".card"));
  if (filters.length === 0 || cards.length === 0) return;

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const value = filter.getAttribute("data-filter") ?? "all";
      filters.forEach((other) => other.setAttribute("aria-pressed", String(other === filter)));
      cards.forEach((card) => {
        card.hidden = !(value === "all" || card.getAttribute("data-pilar") === value);
      });
    });
  });
};
