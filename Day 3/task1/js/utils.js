export const API_BASE = "https://www.themealdb.com/api/json/v1/1";
export const FAVORITES_KEY = "recipe_favorites";

export function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = String(text ?? "");
    return div.innerHTML;
}

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

export function getIngredients(meal) {
    const list = [];
    for (let i = 1; i <= 20; i += 1) {
        const ingredient = meal[`strIngredient${i}`]?.trim();
        const measure = meal[`strMeasure${i}`]?.trim();
        if (ingredient) {
            list.push({ ingredient, measure: measure || "" });
        }
    }
    return list;
}

export function normalizeMealSummary(meal) {
    return {
        id: meal.idMeal,
        name: meal.strMeal,
        thumb: meal.strMealThumb,
        category: meal.strCategory || meal.strMeal?.split(" ")[0] || "—",
        area: meal.strArea || "—",
    };
}
