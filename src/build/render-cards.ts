/**
 * Render de tarjetas de blog a HTML para inyeccion en tiempo de build.
 * Reproduce exactamente el markup del componente `.card` (ver _blog.scss).
 * Codigo de build (Node): lo usa el plugin `injectPosts` de vite.config.ts y no
 * llega al bundle del cliente.
 */
import { POSTS, PILLARS, PILLAR_ORDER, type Post, type PillarKey } from "../data/posts";

/** Orden por fecha descendente; desempata por slug para un render determinista. */
const byDateDesc = (a: Post, b: Post): number =>
  b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug);

/** Ruta del hero: la explicita o la convencion /blog/<slug>/<slug>-hero.webp. */
const heroFor = (post: Post): string => post.hero ?? `/blog/${post.slug}/${post.slug}-hero.webp`;

const publishedPosts = (): Post[] => POSTS.filter((p) => p.status === "published").sort(byDateDesc);
const upcomingPosts = (): Post[] => POSTS.filter((p) => p.status === "upcoming");

/** Tarjeta de un post publicado. `featured` la agranda y le anade el badge "Nuevo". */
const publishedCard = (post: Post, featured: boolean): string => `
          <article class="card${featured ? " is-featured" : ""}" data-pilar="${post.pillar}">
            <div class="card-thumb"><img src="${heroFor(post)}" alt="${post.heroAlt ?? ""}"${featured ? "" : ' loading="lazy"'} width="1200" height="800" decoding="async" />${featured ? '<span class="card-badge">Nuevo</span>' : ""}</div>
            <div class="card-body">
              <p class="card-meta"><span class="pilar">${PILLARS[post.pillar].label}</span></p>
              <h2><a class="card-cover-link" href="/blog/${post.slug}/">${post.title}</a></h2>
              <p>${post.excerpt}</p>
              <span class="card-cta">Leer →</span>
            </div>
          </article>`;

/** Tarjeta de un post en preparacion (sin enlace, atenuada). */
const upcomingCard = (post: Post): string => `
          <article class="card is-soon" data-pilar="${post.pillar}">
            <div class="card-thumb"><img src="/blog/placeholder-card.webp" alt="" loading="lazy" width="1200" height="800" decoding="async" /><span class="card-badge soon">Próximo</span></div>
            <div class="card-body">
              <p class="card-meta"><span class="pilar">${PILLARS[post.pillar].label}</span></p>
              <h2>${post.title}</h2>
              <p>${post.excerpt}</p>
              <span class="card-cta">Próximamente</span>
            </div>
          </article>`;

/** Hasta 3 publicados mas recientes, para el teaser del home (tarjetas uniformes). */
export const renderHomeCards = (): string =>
  publishedPosts()
    .slice(0, 3)
    .map((post) => publishedCard(post, false))
    .join("\n");

/** Rejilla del indice: el publicado mas reciente como featured, luego el resto y los proximos. */
export const renderBlogGrid = (): string =>
  [
    ...publishedPosts().map((post, i) => publishedCard(post, i === 0)),
    ...upcomingPosts().map(upcomingCard),
  ].join("\n");

/** Botones de filtro con conteos por pilar derivados del manifiesto. */
export const renderBlogFilters = (): string => {
  const countOf = (pillar: PillarKey): number => POSTS.filter((p) => p.pillar === pillar).length;
  return [
    `<button class="filter" type="button" data-filter="all" aria-pressed="true">Todos <span class="count">${POSTS.length}</span></button>`,
    ...PILLAR_ORDER.map(
      (k) =>
        `<button class="filter" type="button" data-filter="${k}" aria-pressed="false">${PILLARS[k].label} <span class="count">${countOf(k)}</span></button>`,
    ),
  ].join("\n          ");
};
