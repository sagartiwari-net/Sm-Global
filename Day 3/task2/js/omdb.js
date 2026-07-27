import {
    OMDB_API_KEY,
    OMDB_BASE,
    STORAGE_KEYS,
    getItem,
    setItem,
    formatRating,
} from "./utils.js";

function cacheKey(title, year) {
    return `${String(title || "").trim().toLowerCase()}|${String(year || "").trim()}`;
}

function getOmdbCache() {
    return getItem(STORAGE_KEYS.omdb, {}) || {};
}

function saveOmdbCache(key, data) {
    const map = getOmdbCache();
    map[key] = { savedAt: Date.now(), data };
    setItem(STORAGE_KEYS.omdb, map);
}

export function getCachedOmdb(title, year) {
    const entry = getOmdbCache()[cacheKey(title, year)];
    return entry?.data || null;
}

export function mergeOmdbIntoMovie(movie, omdb) {
    if (!omdb || omdb.Response === "False") return { ...movie };

    const genreFull =
        omdb.Genre && omdb.Genre !== "N/A" ? omdb.Genre : movie.genres || movie.genre || "";
    const primaryGenre = genreFull.split(",")[0].trim() || movie.genre;
    const imdb =
        omdb.imdbRating && omdb.imdbRating !== "N/A" ? Number(omdb.imdbRating) : null;
    const poster =
        omdb.Poster && omdb.Poster !== "N/A" ? omdb.Poster : movie.poster || "";

    return {
        ...movie,
        poster,
        genre: primaryGenre,
        genres: genreFull || primaryGenre,
        cast: omdb.Actors && omdb.Actors !== "N/A" ? omdb.Actors : movie.cast,
        runtime: omdb.Runtime && omdb.Runtime !== "N/A" ? omdb.Runtime : movie.runtime,
        overview: omdb.Plot && omdb.Plot !== "N/A" ? omdb.Plot : movie.overview,
        director: omdb.Director && omdb.Director !== "N/A" ? omdb.Director : movie.director || "",
        rated: omdb.Rated && omdb.Rated !== "N/A" ? omdb.Rated : "",
        imdbID: omdb.imdbID || movie.imdbID || "",
        vote: imdb ?? movie.vote,
        rating: imdb != null ? formatRating(imdb) : movie.rating,
        enriched: true,
    };
}

export async function fetchOmdbByTitle(title, year = "") {
    const key = cacheKey(title, year);
    const cached = getCachedOmdb(title, year);
    if (cached) return cached;

    if (!OMDB_API_KEY) return null;

    const url = new URL(OMDB_BASE);
    url.searchParams.set("apikey", OMDB_API_KEY);
    url.searchParams.set("t", title);
    url.searchParams.set("type", "movie");
    url.searchParams.set("plot", "full");
    if (year && year !== "—") url.searchParams.set("y", String(year));

    const res = await fetch(url);
    if (!res.ok) throw new Error("OMDb request failed");
    const data = await res.json();

    // Cache misses too, to avoid repeat bad requests
    saveOmdbCache(key, data);

    // Retry without year if not found
    if (data.Response === "False" && year && year !== "—") {
        const retry = new URL(OMDB_BASE);
        retry.searchParams.set("apikey", OMDB_API_KEY);
        retry.searchParams.set("t", title);
        retry.searchParams.set("type", "movie");
        retry.searchParams.set("plot", "full");
        const res2 = await fetch(retry);
        const data2 = await res2.json();
        saveOmdbCache(cacheKey(title, ""), data2);
        if (data2.Response !== "False") {
            saveOmdbCache(key, data2);
            return data2;
        }
        return data2;
    }

    return data;
}

export async function enrichMovieWithOmdb(movie) {
    if (movie?.enriched && movie.poster && movie.cast && movie.cast !== "Not listed by API") {
        return movie;
    }

    // Instant apply from cache
    const cached = getCachedOmdb(movie.title, movie.year);
    if (cached?.Response === "True") {
        return mergeOmdbIntoMovie(movie, cached);
    }

    try {
        const data = await fetchOmdbByTitle(movie.title, movie.year);
        return mergeOmdbIntoMovie(movie, data);
    } catch {
        return movie;
    }
}

/**
 * Enrich movies with OMDb data (poster, genre, cast, runtime).
 * Uses cache first — only uncached titles hit the network.
 */
export async function enrichMoviesWithOmdb(movies, { concurrency = 3, onUpdate } = {}) {
    const queue = [...movies];
    const workers = Array.from({ length: concurrency }, async () => {
        while (queue.length) {
            const movie = queue.shift();
            if (!movie) break;

            const updated = await enrichMovieWithOmdb(movie);
            Object.assign(movie, updated);
            onUpdate?.(movie);
        }
    });
    await Promise.all(workers);
    return movies;
}
