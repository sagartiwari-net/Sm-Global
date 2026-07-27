import { FAVORITES_KEY, getItem, setItem } from "./utils.js";

export function getFavorites() {
    return getItem(FAVORITES_KEY, []);
}

export function saveFavorites(list) {
    setItem(FAVORITES_KEY, list);
}

export function isFavorite(id) {
    return getFavorites().some((r) => r.id === String(id));
}

export function toggleFavorite(recipe) {
    let list = getFavorites();
    const id = String(recipe.id);
    const exists = list.some((r) => r.id === id);

    if (exists) {
        list = list.filter((r) => r.id !== id);
    } else {
        list.push({
            id,
            name: recipe.name,
            thumb: recipe.thumb,
            category: recipe.category,
            area: recipe.area,
        });
    }

    saveFavorites(list);
    return { list, added: !exists };
}

export function removeFavorite(id) {
    const list = getFavorites().filter((r) => r.id !== String(id));
    saveFavorites(list);
    return list;
}

export function getFavoriteCount() {
    return getFavorites().length;
}
