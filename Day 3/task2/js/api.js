import {
    RAPID_API_KEY,
    RAPID_API_HOST,
    RAPID_API_BASE,
    STORAGE_KEYS,
    getItem,
    setItem,
    getYear,
    formatRating,
    makeMovieId,
    decodeMovieId,
    inferGenre,
    hasApiKey,
} from "./utils.js";
import { getCachedPoster } from "./posters.js";
import { getCachedOmdb, mergeOmdbIntoMovie, enrichMovieWithOmdb } from "./omdb.js";

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours — saves RapidAPI free quota
const PAGES_TO_CACHE = 5; // 5 requests × 10 movies = 50 movies

async function fetchRapid(path, params = {}) {
    if (!hasApiKey()) {
        throw new Error("RapidAPI key missing. Add it in js/utils.js (RAPID_API_KEY).");
    }

    const url = new URL(`${RAPID_API_BASE}${path}`);
    Object.entries(params).forEach(([k, v]) => {
        if (v !== "" && v != null) url.searchParams.set(k, v);
    });

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": RAPID_API_HOST,
            "x-rapidapi-key": RAPID_API_KEY,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch movies from RapidAPI. Check key/quota or try again.");
    }

    return res.json();
}

export function normalizeMovie(movie) {
    const title = movie.title || "Untitled";
    const release_date = movie.release_date || movie.releaseDate || "";
    const overview = movie.overview || "";
    const vote = movie.vote_average ?? movie.voteAverage ?? 0;
    const genre = inferGenre(title, overview);
    const id = makeMovieId(title, release_date);
    const year = getYear(release_date);

    let base = {
        id,
        title,
        poster: movie.poster || getCachedPoster(id) || "",
        year,
        rating: formatRating(vote),
        vote: Number(vote) || 0,
        genre,
        genres: genre,
        overview,
        release_date,
        popularity: movie.popularity || 0,
        language: movie.original_language || movie.originalLanguage || "—",
        vote_count: movie.vote_count || movie.voteCount || 0,
        runtime: "N/A",
        cast: "Not listed by API",
        director: "",
        enriched: false,
    };

    const omdbCached = getCachedOmdb(title, year);
    if (omdbCached?.Response === "True") {
        base = mergeOmdbIntoMovie(base, omdbCached);
    }

    return base;
}

function readCache() {
    const cache = getItem(STORAGE_KEYS.catalog, null);
    if (!cache?.movies?.length || !cache.savedAt) return null;
    if (Date.now() - cache.savedAt > CACHE_TTL_MS) return null;
    return cache.movies;
}

function writeCache(movies) {
    setItem(STORAGE_KEYS.catalog, { savedAt: Date.now(), movies });
}

export function upsertCatalog(movies) {
    const map = new Map();
    const existing = getItem(STORAGE_KEYS.catalog, null)?.movies || [];
    [...existing, ...movies].forEach((m) => map.set(String(m.id), m));
    const merged = [...map.values()];
    writeCache(merged);
    return merged;
}

export async function loadCatalog(force = false) {
    if (!force) {
        const cached = readCache();
        if (cached) return cached;
    }

    const all = [];
    for (let page = 1; page <= PAGES_TO_CACHE; page += 1) {
        const data = await fetchRapid("", { page });
        const items = (data.items || []).map(normalizeMovie);
        all.push(...items);
    }

    writeCache(all);
    return all;
}

export async function getTrendingMovies() {
    return loadCatalog();
}

export async function searchMovies(query) {
    const q = query.trim().toLowerCase();
    if (!q) return getTrendingMovies();

    // Prefer client-side search on cache (0 RapidAPI calls)
    const catalog = await loadCatalog();
    const local = catalog.filter((m) => m.title.toLowerCase().includes(q));
    if (local.length) return local;

    // Fallback: API name search (1 request)
    const data = await fetchRapid("", { name: query.trim(), page: 1 });
    const movies = (data.items || []).map(normalizeMovie);
    upsertCatalog(movies);
    return movies;
}

export async function discoverMovies({ genre = "", year = "", minRating = "", sort = "", search = "" }) {
    let movies = search
        ? await searchMovies(search)
        : await getTrendingMovies();

    if (genre) {
        movies = movies.filter((m) => {
            const g = `${m.genre || ""}|${m.genres || ""}`.toLowerCase();
            return g.includes(String(genre).toLowerCase());
        });
    }
    if (year) {
        movies = movies.filter((m) => String(m.year) === String(year));
    }
    if (minRating) {
        movies = movies.filter((m) => m.vote >= Number(minRating));
    }

    switch (sort) {
        case "rating":
            movies = [...movies].sort((a, b) => b.vote - a.vote);
            break;
        case "date":
            movies = [...movies].sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
            break;
        case "alpha":
            movies = [...movies].sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            movies = [...movies].sort((a, b) => b.popularity - a.popularity);
    }

    return movies;
}

export async function getMovieDetails(id) {
    const catalog = await loadCatalog();
    let movie = catalog.find((m) => String(m.id) === String(id));

    if (!movie) {
        const decoded = decodeMovieId(id);
        if (decoded?.title) {
            const found = await searchMovies(decoded.title);
            movie = found.find((m) => String(m.id) === String(id)) || found[0];
        }
    }

    if (!movie) throw new Error("Movie not found.");

    movie = await enrichMovieWithOmdb(movie);
    upsertCatalog([movie]);

    return {
        ...movie,
        genres: movie.genres || movie.genre,
        runtime: movie.runtime || "N/A",
        cast: movie.cast || "Not listed by API",
        overview: movie.overview || "No description available.",
        release_date: movie.release_date || "—",
        director: movie.director || "",
        backdrop: movie.poster || "",
    };
}

export async function getRelatedMovies(movie, limit = 8) {
    const catalog = await loadCatalog();
    const currentId = String(movie.id);
    const genre = movie.genre || movie.genres || "";
    const year = movie.year;
    const lang = movie.language;

    const scored = catalog
        .filter((m) => String(m.id) !== currentId)
        .map((m) => {
            let score = 0;
            if (genre && m.genre === genre) score += 3;
            if (lang && m.language === lang) score += 1;
            if (year && m.year === year) score += 1;
            if (Math.abs((m.vote || 0) - (movie.vote || 0)) < 1) score += 0.5;
            return { movie: m, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score || b.movie.popularity - a.movie.popularity);

    let related = scored.slice(0, limit).map((x) => x.movie);

    if (related.length < limit) {
        const ids = new Set(related.map((m) => String(m.id)).concat(currentId));
        const extras = [...catalog]
            .filter((m) => !ids.has(String(m.id)))
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, limit - related.length);
        related = [...related, ...extras];
    }

    return related;
}

export async function getGenreOptions() {
    const movies = await loadCatalog();
    const set = new Set();
    movies.forEach((m) => {
        const raw = m.genres || m.genre || "";
        raw.split(",").forEach((g) => {
            const name = g.trim();
            if (name) set.add(name);
        });
    });
    return [...set].sort().map((name) => ({ id: name, name }));
}

export async function getRandomMovie() {
    const data = await fetchRapid("/random");
    const movie = normalizeMovie(data);
    upsertCatalog([movie]);
    return movie;
}
