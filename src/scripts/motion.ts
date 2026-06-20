/**
 * Orquestador de animaciones scroll-triggered + reveal del claim del hero.
 * Usa IntersectionObserver nativo (en lugar de GSAP ScrollTrigger) para mantener bundle bajo.
 */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Registra reveals con `IntersectionObserver`. Se aplica a `.reveal` y `.reveal-stagger`. */
export const initRevealObserver = (): void => {
  if (REDUCED_MOTION) {
    document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger").forEach((el) => {
      el.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
  );

  document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger").forEach((el) => {
    observer.observe(el);
  });
};

/**
 * Divide el hero claim en palabras (inline-block, no se parten) y, dentro de cada una,
 * en chars que entran con stagger. Los espacios son los unicos puntos de quiebre de linea.
 * Se ejecuta una sola vez al cargar.
 */
export const revealHeroClaim = (): void => {
  const lines = document.querySelectorAll<HTMLElement>(".hero-claim-line");

  lines.forEach((line) => {
    const original = line.textContent ?? "";
    line.textContent = "";
    const words = original.split(" ");
    let charIdx = 0;
    words.forEach((word, wordIdx) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "word";
      [...word].forEach((char) => {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = char;
        span.style.transitionDelay = `${charIdx * 26}ms`;
        wordSpan.appendChild(span);
        charIdx += 1;
      });
      line.appendChild(wordSpan);
      if (wordIdx < words.length - 1) {
        line.appendChild(document.createTextNode(" "));
      }
    });
  });

  requestAnimationFrame(() => {
    lines.forEach((line, lineIdx) => {
      window.setTimeout(() => line.classList.add("is-revealed"), lineIdx * 220);
    });
  });
};

/** Activa la clase `is-scrolled` en el header al hacer scroll. */
export const initHeaderScrollState = (): void => {
  const header = document.querySelector<HTMLElement>(".site-header");
  if (!header) return;

  const update = (): void => {
    if (window.scrollY > 8) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
};
