/**
 * Microinteracciones del personal site:
 * - Counters animados (de 0 al valor final cuando entran al viewport)
 * - Tilt 3D suave en las cards de modos
 * - Scramble de texto en los kickers (efecto "decode" tecnico)
 * - Impresion secuencial de la terminal del hero
 * - Boton magnetico (atraccion sutil hacia el cursor)
 */

import VanillaTilt from "vanilla-tilt";
import { TECH_ICONS } from "./tech-icons";

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Anima un numero desde 0 hasta target. Soporta sufijos (ej: "10+", "100%"). */
const animateCounter = (el: HTMLElement, durationMs: number = 1400): void => {
  const raw = el.dataset["counter"] ?? el.textContent ?? "0";
  el.textContent = raw;

  if (REDUCED_MOTION) return;

  const match = raw.match(/(\d[\d,.]*)/);
  if (!match) return;

  const numericString = (match[1] ?? "").replace(/,/g, "");
  const target = parseFloat(numericString);
  if (Number.isNaN(target) || target === 0) return;

  const start = performance.now();
  const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

  const tick = (now: number): void => {
    const progress = Math.min((now - start) / durationMs, 1);
    const currentValue = target * easeOut(progress);
    const formatted =
      target >= 100
        ? Math.round(currentValue).toLocaleString("es-MX")
        : currentValue.toFixed(numericString.includes(".") ? 1 : 0);
    el.textContent = raw.replace(match[1] ?? "", formatted);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = raw;
    }
  };

  requestAnimationFrame(tick);
};

/** Inicializa los counters con IntersectionObserver (anima al entrar al viewport). */
export const initCounters = (): void => {
  const counters = document.querySelectorAll<HTMLElement>("[data-counter]");
  if (counters.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 },
  );

  counters.forEach((el) => observer.observe(el));
};

/** Aplica VanillaTilt a las cards de modos (3D sutil en hover). */
export const initTiltCards = (): void => {
  if (REDUCED_MOTION) return;
  const cards = document.querySelectorAll<HTMLElement>(".service-card");
  if (cards.length === 0) return;
  VanillaTilt.init(Array.from(cards), {
    max: 5,
    speed: 600,
    glare: false,
    "max-glare": 0,
    perspective: 1200,
    scale: 1.01,
  });
};

/** Efecto "decode": el texto se revela desde glifos aleatorios hasta el target. */
const GLYPHS = "ABCDEF0123456789<>/\\{}[]#*+=-_";

const scrambleElement = (el: HTMLElement): void => {
  const target = el.textContent ?? "";
  const len = target.length;
  if (len === 0) return;

  let frame = 0;
  const totalFrames = Math.max(20, Math.round(len * 1.5));
  const settleFrameFor = (index: number): number =>
    Math.floor((index / len) * totalFrames * 0.72);

  const tick = (): void => {
    let out = "";
    for (let i = 0; i < len; i += 1) {
      const ch = target.charAt(i);
      if (ch === " ") {
        out += " ";
      } else if (frame >= settleFrameFor(i)) {
        out += ch;
      } else {
        out += GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
      }
    }
    el.textContent = out;
    frame += 1;
    if (frame <= totalFrames) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  };

  tick();
};

/** Dispara el scramble de cada `[data-scramble]` cuando entra al viewport. */
export const initScramble = (): void => {
  const targets = document.querySelectorAll<HTMLElement>("[data-scramble]");
  if (targets.length === 0) return;

  if (REDUCED_MOTION) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          scrambleElement(entry.target as HTMLElement);
        }
      });
    },
    { threshold: 0.6 },
  );

  targets.forEach((el) => observer.observe(el));
};

/** Imprime las lineas de la terminal del hero de forma secuencial, con caret. */
export const initTerminal = (): void => {
  const term = document.querySelector<HTMLElement>("[data-typed]");
  if (!term) return;

  const lines = Array.from(term.querySelectorAll<HTMLElement>(".t-line"));
  if (lines.length === 0) return;

  if (REDUCED_MOTION) {
    lines.forEach((line) => {
      line.style.opacity = "1";
    });
    return;
  }

  lines.forEach((line) => {
    line.style.opacity = "0";
    line.style.transform = "translateY(5px)";
    line.style.transition =
      "opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)";
  });

  const caret = document.createElement("span");
  caret.className = "t-caret";
  caret.setAttribute("aria-hidden", "true");

  let i = 0;
  const showNext = (): void => {
    const line = lines[i];
    if (!line) return;
    line.style.opacity = "1";
    line.style.transform = "none";
    line.appendChild(caret);
    i += 1;
    if (i < lines.length) {
      const isPrompt = !line.classList.contains("t-out");
      window.setTimeout(showNext, isPrompt ? 440 : 280);
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          window.setTimeout(showNext, 260);
        }
      });
    },
    { threshold: 0.3 },
  );
  observer.observe(term);
};

/** Atraccion magnetica sutil hacia el cursor en `[data-magnetic]`. */
export const initMagnetic = (): void => {
  if (REDUCED_MOTION) return;
  const STRENGTH = 0.28;

  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * STRENGTH}px, ${y * STRENGTH}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
};

/**
 * Carga la foto de retrato si existe. Prueba varios formatos con nombre base "portrait"
 * en la carpeta `public/` (servida en raiz, valida en dev y en build). Si ninguno carga,
 * deja visible el placeholder con monograma.
 */
export const initPortrait = (): void => {
  const img = document.querySelector<HTMLImageElement>(".portrait-photo");
  const placeholder = document.querySelector<HTMLElement>(".portrait-placeholder");
  if (!img || !placeholder) return;

  const candidates = ["/portrait.webp", "/portrait.jpg", "/portrait.jpeg", "/portrait.png"];
  let index = 0;

  const tryNext = (): void => {
    const next = candidates[index];
    index += 1;
    if (next === undefined) {
      img.style.display = "none";
      placeholder.style.display = "grid";
      return;
    }
    img.setAttribute("src", next);
  };

  img.addEventListener("load", () => {
    placeholder.style.display = "none";
    img.style.display = "block";
  });
  img.addEventListener("error", tryNext);

  tryNext();
};

/** Inyecta el SVG del icono de tecnologia en cada elemento con `data-icon`. */
export const initTechIcons = (): void => {
  const SVG_NS = "http://www.w3.org/2000/svg";
  document.querySelectorAll<HTMLElement>("[data-icon]").forEach((el) => {
    const key = el.dataset["icon"];
    if (!key) return;
    if (el.querySelector(".tech-icon")) return; // ya inyectado (idempotente)
    const icon = TECH_ICONS[key];
    if (!icon) return;
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "tech-icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", icon.path);
    svg.appendChild(path);
    el.prepend(svg);
  });
};
