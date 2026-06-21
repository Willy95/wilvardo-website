/**
 * Fuente unica de verdad de los posts del blog.
 * La consume el plugin de build `injectPosts` (vite.config.ts) para generar, en
 * tiempo de build, las tarjetas del home y del indice del blog. No se incluye en
 * el bundle del cliente.
 */

/** Pilares editoriales del blog. */
export type PillarKey = "ia" | "ing" | "dir" | "ux";

/** Estado de publicacion de un post. */
export type PostStatus = "published" | "upcoming";

/** Metadatos de un post. La URL es siempre /blog/<slug>/. */
export interface Post {
  /** Identificador y segmento de URL: /blog/<slug>/. */
  slug: string;
  /** Titulo de la tarjeta. Admite HTML inline (p.ej. <code>). */
  title: string;
  /** Resumen corto que se muestra bajo el titulo. */
  excerpt: string;
  /** Pilar editorial al que pertenece. */
  pillar: PillarKey;
  /** Fecha de publicacion en ISO (YYYY-MM-DD). Define el orden "ultimos creados". */
  date: string;
  /** Publicado (con entrada real) o en preparacion. */
  status: PostStatus;
  /** Imagen hero/thumb. Si se omite en un publicado, se usa /blog/<slug>/<slug>-hero.webp. */
  hero?: string;
  /** Texto alternativo del hero. */
  heroAlt?: string;
}

/** Etiqueta visible de cada pilar. */
export const PILLARS: Record<PillarKey, { label: string }> = {
  ia: { label: "IA con criterio" },
  ing: { label: "Ingeniería" },
  dir: { label: "Dirección y producto" },
  ux: { label: "UX y oficio" },
};

/** Orden en el que se muestran los filtros por pilar en el indice. */
export const PILLAR_ORDER: ReadonlyArray<PillarKey> = ["ia", "ing", "dir", "ux"];

/**
 * Manifiesto de posts. Los publicados aparecen primero (ordenados por fecha en el
 * render); los `upcoming` son las tarjetas "Próximo" del indice.
 */
export const POSTS: ReadonlyArray<Post> = [
  {
    slug: "el-modelo-de-datos",
    title: "El modelo de datos: la decisión más cara de improvisar",
    excerpt: "Lo barato hoy se vuelve carísimo cuando ya hay datos en producción.",
    pillar: "ing",
    date: "2026-06-20",
    status: "published",
    hero: "/blog/el-modelo-de-datos/el-modelo-de-datos-hero.webp",
    heroAlt: "Diagrama entidad-relación dibujado a mano sobre papel.",
  },
  {
    slug: "programar-en-la-era-de-la-ia",
    title: "Programar en la era de la IA: por qué el criterio es el diferenciador",
    excerpt: "El criterio es lo que la IA no escribe por ti. El manifiesto que abre el blog.",
    pillar: "ia",
    date: "2026-06-19",
    status: "published",
    hero: "/blog/programar-en-la-era-de-la-ia/programar-en-la-era-de-la-ia-hero.webp",
    heroAlt: "Manos sosteniendo a contraluz una hoja impresa.",
  },
  {
    slug: "arquitectura-hexagonal-vertical-slicing",
    title: "Arquitectura hexagonal + vertical slicing en un API real",
    excerpt: "Cómo estructuro un API Node/Adonis que escala y se mantiene.",
    pillar: "ing",
    date: "2026-06-18",
    status: "upcoming",
  },
  {
    slug: "deuda-tecnica-ia",
    title: "La deuda técnica que la IA acumula sin que la veas",
    excerpt: "El riesgo del que nadie en tu equipo habla.",
    pillar: "ia",
    date: "2026-06-17",
    status: "upcoming",
  },
  {
    slug: "cero-any-typescript-estricto",
    title: "Cero <code>any</code>: lo que TypeScript estricto te obliga a entender",
    excerpt: "Prohibir any no es purismo: es disciplina de pensamiento.",
    pillar: "ing",
    date: "2026-06-16",
    status: "upcoming",
  },
  {
    slug: "errores-de-api-titulo-detalle-key",
    title: "Errores de API que no odies: título, detalle y key",
    excerpt: "Un estándar de errores REST que tu frontend agradece.",
    pillar: "ing",
    date: "2026-06-15",
    status: "upcoming",
  },
  {
    slug: "scrum-que-funciona-equipo-chico",
    title: "Scrum de libro vs. el que sí funciona en equipo chico",
    excerpt: "La certificación enseña ceremonias; la operación enseña qué tirar.",
    pillar: "dir",
    date: "2026-06-14",
    status: "upcoming",
  },
  {
    slug: "interfaces-bonitas-ux-prioridad",
    title: "Interfaces bonitas no son lujo: la UX como prioridad",
    excerpt: "La experiencia gana sobre la lista de features.",
    pillar: "ux",
    date: "2026-06-13",
    status: "upcoming",
  },
  {
    slug: "control-de-calidad-antes-del-deploy",
    title: "Control de calidad antes del deploy: el filtro que no se delega",
    excerpt: "Dónde pongo el ojo humano sin volverme cuello de botella.",
    pillar: "dir",
    date: "2026-06-12",
    status: "upcoming",
  },
  {
    slug: "cuatro-proyectos-fallidos",
    title: "Cuatro proyectos fallidos: lo que aprendí sobre construir software",
    excerpt: "Crecer sin estructura mata más rápido que no crecer.",
    pillar: "ux",
    date: "2026-06-11",
    status: "upcoming",
  },
];
