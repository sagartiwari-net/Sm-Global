import { STORAGE_KEYS, getItem, setItem } from "./utils.js";

export function getFavorites() {
    return getItem(STORAGE_KEYS.favorites, []);
}

export function saveFavorites(list) {
    setItem(STORAGE_KEYS.favorites, list);
}

export function isFavorite(id) {
    return getFavorites().some((m) => String(m.id) === String(id));
}

export function toggleFavorite(movie) {
    let list = getFavorites();
    const id = String(movie.id);
    const exists = list.some((m) => String(m.id) === id);

    if (exists) {
        list = list.filter((m) => String(m.id) !== id);
    } else {
        list.push({
            id,
            title: movie.title,
            poster: movie.poster,
            year: movie.year,
            rating: movie.rating,
            genre: movie.genre,
        });
    }

    saveFavorites(list);
    return { list, added: !exists };
}

export function removeFavorite(id) {
    const list = getFavorites().filter((m) => String(m.id) !== String(id));
    saveFavorites(list);
    return list;
}

export function getFavoriteCount() {
    return getFavorites().length;
}

export function getAllReviews() {
    return getItem(STORAGE_KEYS.reviews, {}) || {};
}

export function getReviews(movieId) {
    const all = getAllReviews();
    return all[String(movieId)] || [];
}

export function addReview(movieId, { name, rating, text }) {
    const all = getAllReviews();
    const id = String(movieId);
    const list = all[id] || [];
    const review = {
        id: `REV-${Date.now().toString(36)}`,
        name: name.trim(),
        rating: Number(rating) || 5,
        text: text.trim(),
        createdAt: new Date().toISOString(),
    };
    list.unshift(review);
    all[id] = list;
    setItem(STORAGE_KEYS.reviews, all);
    return review;
}

export function getAverageReviewRating(movieId) {
    const list = getReviews(movieId);
    if (!list.length) return null;
    const sum = list.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return (sum / list.length).toFixed(1);
}

