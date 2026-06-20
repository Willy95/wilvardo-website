/**
 * Modulo de internacionalizacion. Soporta ES (default) y EN.
 * Aplica los textos a elementos con atributo `data-i18n` y persiste la eleccion en localStorage.
 */

import esStrings from "../i18n/es.json";
import enStrings from "../i18n/en.json";

type Lang = "es" | "en";

const STORAGE_KEY = "wilvardo:lang";

const dictionaries: Record<Lang, unknown> = {
  es: esStrings,
  en: enStrings,
};

/** Resuelve un path tipo `hero.claim1` o `services.items.0.title` dentro de un arbol JSON. */
const resolvePath = (tree: unknown, path: string): string | undefined => {
  const segments = path.split(".");
  let current: unknown = tree;
  for (const segment of segments) {
    if (current === null || current === undefined) return undefined;
    if (Array.isArray(current)) {
      const idx = Number.parseInt(segment, 10);
      if (Number.isNaN(idx)) return undefined;
      current = current[idx];
    } else if (typeof current === "object") {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
};

/** Detecta el idioma inicial a partir de localStorage o navigator.language. */
const detectInitialLang = (): Lang => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "es" || stored === "en") {
    return stored;
  }
  const navLang = navigator.language.toLowerCase();
  return navLang.startsWith("en") ? "en" : "es";
};

/** Aplica el diccionario activo a todos los elementos con `data-i18n` o `data-i18n-html`. */
const applyTranslations = (lang: Lang): void => {
  const dict = dictionaries[lang];
  document.documentElement.lang = lang;

  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset["i18n"];
    if (!key) return;
    const value = resolvePath(dict, key);
    if (value !== undefined) {
      el.textContent = value;
    }
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-html]").forEach((el) => {
    const key = el.dataset["i18nHtml"];
    if (!key) return;
    const value = resolvePath(dict, key);
    if (value !== undefined) {
      el.innerHTML = value;
    }
  });

  document.querySelectorAll<HTMLElement>("[data-i18n-attr]").forEach((el) => {
    const config = el.dataset["i18nAttr"];
    if (!config) return;
    // formato: "attr:key,attr2:key2"
    config.split(",").forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      if (!attr || !key) return;
      const value = resolvePath(dict, key);
      if (value !== undefined) {
        el.setAttribute(attr, value);
      }
    });
  });
};

let currentLang: Lang = "es";

/** Cambia el idioma activo y re-renderiza textos. */
export const setLang = (lang: Lang): void => {
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
  applyTranslations(lang);
  document.dispatchEvent(new CustomEvent("lang-change", { detail: { lang } }));
};

/** Devuelve el idioma activo. */
export const getLang = (): Lang => currentLang;

/** Inicializa el modulo y aplica el idioma detectado. */
export const initI18n = (): void => {
  currentLang = detectInitialLang();
  applyTranslations(currentLang);

  document.querySelectorAll<HTMLButtonElement>("[data-action='toggle-lang']").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLang(currentLang === "es" ? "en" : "es");
    });
    btn.textContent = currentLang === "es" ? "EN" : "ES";
  });

  document.addEventListener("lang-change", () => {
    document.querySelectorAll<HTMLButtonElement>("[data-action='toggle-lang']").forEach((btn) => {
      btn.textContent = currentLang === "es" ? "EN" : "ES";
    });
  });
};
