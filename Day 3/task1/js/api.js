import { API_BASE, normalizeMealSummary } from "./utils.js";

async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch recipes. Please try again.");
    }
    return response.json();
}

export async function searchMealsByName(query) {
    const data = await fetchJson(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);
    return (data.meals || []).map(normalizeMealSummary);
}

export async function getMealById(id) {
    const data = await fetchJson(`${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`);
    return data.meals?.[0] || null;
}

export async function getRandomMeal() {
    const data = await fetchJson(`${API_BASE}/random.php`);
    return data.meals?.[0] || null;
}

export async function getRandomMeals(count = 8) {
    const results = await Promise.all(
        Array.from({ length: count }, () => getRandomMeal())
    );
    const seen = new Set();
    return results
        .filter((meal) => {
            if (!meal || seen.has(meal.idMeal)) return false;
            seen.add(meal.idMeal);
            return true;
        })
        .map(normalizeMealSummary);
}

export async function listCategories() {
    const data = await fetchJson(`${API_BASE}/list.php?c=list`);
    return (data.meals || []).map((m) => m.strCategory);
}

export async function listAreas() {
    const data = await fetchJson(`${API_BASE}/list.php?a=list`);
    return (data.meals || []).map((m) => m.strArea);
}

export async function filterByCategory(category) {
    const data = await fetchJson(`${API_BASE}/filter.php?c=${encodeURIComponent(category)}`);
    return data.meals || [];
}

export async function filterByArea(area) {
    const data = await fetchJson(`${API_BASE}/filter.php?a=${encodeURIComponent(area)}`);
    return data.meals || [];
}

export async function enrichMeals(summaries) {
    const details = await Promise.all(
        summaries.map(async (item) => {
            try {
                const meal = await getMealById(item.idMeal);
                if (!meal) return null;
                return {
                    id: meal.idMeal,
                    name: meal.strMeal,
                    thumb: meal.strMealThumb,
                    category: meal.strCategory || "—",
                    area: meal.strArea || "—",
                };
            } catch {
                return {
                    id: item.idMeal,
                    name: item.strMeal,
                    thumb: item.strMealThumb,
                    category: item.strCategory || "—",
                    area: "—",
                };
            }
        })
    );
    return details.filter(Boolean);
}
