import { STORAGE_KEYS, getItem, setItem } from "./utils.js";
import { enrichMovieWithOmdb } from "./omdb.js";

function getPosterMap() {
    return getItem(STORAGE_KEYS.posters, {}) || {};
}

function savePoster(id, url) {
    const map = getPosterMap();
    map[String(id)] = url;
    setItem(STORAGE_KEYS.posters, map);
}

export function getCachedPoster(id) {
    return getPosterMap()[String(id)] || "";
}

async function wikiSummary(title) {
    const slug = encodeURIComponent(String(title).trim().replace(/ /g, "_"));
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === "disambiguation") return null;
    return data.originalimage?.source || data.thumbnail?.source || "";
}

async function wikiSearchPoster(title, year) {
    const q = encodeURIComponent(`${title} ${year || ""} film`.trim());
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${q}&srlimit=5&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return "";
    const data = await res.json();
    const pages = data.query?.search || [];

    for (const page of pages) {
        const img = await wikiSummary(page.title);
        if (img && !/\.svg(\?|$)/i.test(img)) return img;
        if (img) return img;
    }
    return "";
}

async function fetchWikiPoster(movie) {
    const title = movie.title || "";
    const year = movie.year && movie.year !== "—" ? movie.year : "";
    const candidates = [
        year ? `${title} (${year} film)` : null,
        `${title} (film)`,
        title,
    ].filter(Boolean);

    for (const name of candidates) {
        try {
            const img = await wikiSummary(name);
            if (img && !/\.svg(\?|$)/i.test(img)) return img;
        } catch {
            // next
        }
    }

    try {
        return (await wikiSearchPoster(title, year)) || "";
    } catch {
        return "";
    }
}

/** Prefer OMDb poster, fallback Wikipedia */
export async function fetchPosterForMovie(movie) {
    const id = String(movie.id);
    const cached = getCachedPoster(id);
    if (cached) return cached;
    if (movie.poster) {
        savePoster(id, movie.poster);
        return movie.poster;
    }

    const enriched = await enrichMovieWithOmdb(movie);
    if (enriched.poster) {
        savePoster(id, enriched.poster);
        Object.assign(movie, enriched);
        return enriched.poster;
    }

    const wiki = await fetchWikiPoster(movie);
    if (wiki) {
        savePoster(id, wiki);
        return wiki;
    }

    return "";
}

export async function enrichMoviesWithPosters(movies, { concurrency = 3, onPoster, onUpdate } = {}) {
    const queue = [...movies];
    const workers = Array.from({ length: concurrency }, async () => {
        while (queue.length) {
            const movie = queue.shift();
            if (!movie) break;

            const updated = await enrichMovieWithOmdb(movie);
            Object.assign(movie, updated);

            if (!movie.poster) {
                const wiki = await fetchWikiPoster(movie);
                if (wiki) movie.poster = wiki;
            }

            if (movie.poster) {
                savePoster(movie.id, movie.poster);
                onPoster?.(movie, movie.poster);
            }
            onUpdate?.(movie);
        }
    });
    await Promise.all(workers);
    return movies;
}

export function applyPosterToCard(movieId, posterUrl) {
    const card = document.querySelector(`[data-movie-id="${CSS.escape(String(movieId))}"]`);
    if (!card || !posterUrl) return;
    const link = card.querySelector(".movie-poster");
    if (!link) return;
    const existing = link.querySelector("img");
    if (existing) {
        existing.src = posterUrl;
        return;
    }
    const art = link.querySelector(".poster-art");
    const img = document.createElement("img");
    img.src = posterUrl;
    img.alt = card.querySelector("h3")?.textContent || "Poster";
    img.loading = "lazy";
    if (art) art.replaceWith(img);
    else link.prepend(img);
}

export function updateMovieCardMeta(movie) {
    const card = document.querySelector(`[data-movie-id="${CSS.escape(String(movie.id))}"]`);
    if (!card) return;
    const meta = card.querySelector(".movie-meta");
    if (meta) meta.textContent = `${movie.year} · ${movie.genre}`;
    const badge = card.querySelector(".rating-badge");
    if (badge) badge.textContent = `★ ${movie.rating}`;
}
