export const STORAGE_KEYS = {
    users: "movie_users",
    session: "movie_session",
    favorites: "movie_favorites",
    theme: "movie_theme",
    catalog: "movie_catalog_cache",
    posters: "movie_poster_cache",
    reviews: "movie_reviews",
    omdb: "movie_omdb_cache",
};

// RapidAPI — list / search (popular movies)
export const RAPID_API_KEY = "0723533adamsh21dbe34e0e928d2p1c9c6fjsnbb21c476dec9";
export const RAPID_API_HOST = "tmdb-movies-and-tv-shows-api-by-apirobots.p.rapidapi.com";
export const RAPID_API_BASE = `https://${RAPID_API_HOST}/v1/tmdb`;

// OMDb — posters, genre, cast, runtime, plot (enrich)
export const OMDB_API_KEY = "28bee999";
export const OMDB_BASE = "https://www.omdbapi.com/";

export function getItem(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key) {
    localStorage.removeItem(key);
}

export function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = String(text ?? "");
    return div.innerHTML;
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getYear(dateStr) {
    if (!dateStr) return "—";
    return String(dateStr).split("-")[0];
}

export function formatRating(vote) {
    return vote || vote === 0 ? Number(vote).toFixed(1) : "N/A";
}

export function makeMovieId(title, releaseDate) {
    const raw = `${title || ""}|${releaseDate || ""}`;
    return btoa(unescape(encodeURIComponent(raw))).replace(/=+$/, "");
}

export function decodeMovieId(id) {
    try {
        const raw = decodeURIComponent(escape(atob(id)));
        const [title, release_date] = raw.split("|");
        return { title, release_date };
    } catch {
        return null;
    }
}

export function inferGenre(title = "", overview = "") {
    const text = `${title} ${overview}`.toLowerCase();
    const rules = [
        { genre: "Horror", keys: ["horror", "zombie", "demon", "haunted", "ghost", "vampire", "monster", "plague"] },
        { genre: "Action", keys: ["action", "assassin", "soldier", "mission", "combat", "fight", "mercenary", "war", "revenge", "heist"] },
        { genre: "Comedy", keys: ["comedy", "funny", "hilarious", "laugh", "party"] },
        { genre: "Romance", keys: ["love", "romance", "romantic", "wedding", "affair"] },
        { genre: "Sci-Fi", keys: ["space", "alien", "future", "robot", "sci-fi", "planet", "universe", "wormhole"] },
        { genre: "Thriller", keys: ["thriller", "kidnap", "escape", "suspect", "terrorist", "danger"] },
        { genre: "Animation", keys: ["animated", "animation", "duck", "cartoon", "family trip"] },
        { genre: "Crime", keys: ["crime", "police", "detective", "mafia", "theft", "robbery"] },
        { genre: "Adventure", keys: ["adventure", "journey", "quest", "expedition", "treasure"] },
        { genre: "Drama", keys: ["family", "father", "daughter", "life", "custody", "emotional"] },
    ];

    for (const rule of rules) {
        if (rule.keys.some((k) => text.includes(k))) return rule.genre;
    }
    return "Drama";
}

export function getTheme() {
    return getItem(STORAGE_KEYS.theme, "dark") === "light" ? "light" : "dark";
}

export function applyTheme(theme = getTheme()) {
    const next = theme === "light" ? "light" : "dark";
    document.body.classList.toggle("light-mode", next === "light");
    setItem(STORAGE_KEYS.theme, next);
    return next;
}

export function toggleTheme() {
    return applyTheme(getTheme() === "dark" ? "light" : "dark");
}

export function hasApiKey() {
    return Boolean(RAPID_API_KEY && RAPID_API_KEY.length > 10);
}
