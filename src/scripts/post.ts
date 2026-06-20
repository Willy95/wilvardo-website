/**
 * Interacciones de una entrada de blog: compartir y el indice lateral con scroll-spy.
 */

/** Copia el enlace al portapapeles y muestra confirmacion temporal en el boton. */
const copyLink = async (btn: HTMLElement): Promise<void> => {
  if (!navigator.clipboard) return;
  try {
    await navigator.clipboard.writeText(window.location.href);
    const label = btn.querySelector<HTMLElement>(".share-label");
    if (!label) return;
    const previous = label.textContent;
    label.textContent = "Enlace copiado";
    window.setTimeout(() => {
      label.textContent = previous;
    }, 1800);
  } catch {
    // Silencioso: el portapapeles puede estar bloqueado por permisos.
  }
};

/** Comparte el post con la Web Share API; si no existe, copia el enlace. */
const initShare = (): void => {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-share]");
  if (buttons.length === 0) return;

  const data: ShareData = { title: document.title, url: window.location.href };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (typeof navigator.share === "function") {
        void navigator.share(data).catch(() => undefined);
        return;
      }
      void copyLink(btn);
    });
  });
};

/** Resalta en el indice lateral la seccion visible mientras se hace scroll. */
const initToc = (): void => {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".toc a"));
  const headings = Array.from(document.querySelectorAll<HTMLElement>(".post-body .ph2"));
  if (links.length === 0 || headings.length === 0 || !("IntersectionObserver" in window)) return;

  const linkById = new Map<string, HTMLAnchorElement>();
  links.forEach((link) => {
    const id = link.getAttribute("href")?.slice(1);
    if (id) linkById.set(id, link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.remove("is-active"));
        linkById.get(entry.target.id)?.classList.add("is-active");
      });
    },
    { rootMargin: "-20% 0px -70% 0px" },
  );

  headings.forEach((heading) => observer.observe(heading));
};

/** Inicializa las interacciones de una entrada de blog. */
export const initPost = (): void => {
  initShare();
  initToc();
};
