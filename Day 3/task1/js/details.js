import { getMealById } from "./api.js";
import { isFavorite, toggleFavorite } from "./storage.js";
import { renderSidebar, showLoading, showError, showToast } from "./ui.js";
import { escapeHtml, getIngredients } from "./utils.js";

renderSidebar("details", { showFilters: false });

document.getElementById("surpriseBtn")?.addEventListener("click", () => {
    window.location.href = "index.html";
});

const container = document.getElementById("recipeDetail");
const params = new URLSearchParams(window.location.search);
const mealId = params.get("id");

async function loadRecipe() {
    if (!mealId) {
        showError(container, "No recipe selected.");
        return;
    }

    showLoading(container, "Loading recipe...");

    try {
        const meal = await getMealById(mealId);
        if (!meal) {
            showError(container, "Recipe not found.");
            return;
        }
        renderDetail(meal);
    } catch (error) {
        showError(container, error.message || "Failed to load recipe.", loadRecipe);
    }
}

function renderDetail(meal) {
    const id = meal.idMeal;
    const favorited = isFavorite(id);
    const ingredients = getIngredients(meal);
    const youtube = meal.strYoutube?.trim();
    const instructions = meal.strInstructions?.trim() || "No instructions available.";

    container.innerHTML = `
        <nav class="breadcrumbs">
            <a href="index.html">Home</a>
            <span>/</span>
            <span>${escapeHtml(meal.strMeal)}</span>
        </nav>

        <div class="detail-layout">
            <div class="detail-image">
                <img src="${escapeHtml(meal.strMealThumb)}" alt="${escapeHtml(meal.strMeal)}">
            </div>
            <div class="detail-info">
                <div class="recipe-tags">
                    <span class="tag tag-cat">${escapeHtml(meal.strCategory || "—")}</span>
                    <span class="tag tag-area">${escapeHtml(meal.strArea || "—")}</span>
                </div>
                <h1>${escapeHtml(meal.strMeal)}</h1>

                <div class="detail-actions">
                    <button type="button" class="btn btn-primary" id="favBtn">
                        ${favorited ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
                    </button>
                    <a href="index.html" class="btn btn-ghost">Back to Home</a>
                </div>

                ${
                    youtube
                        ? `
                <div class="video-box">
                    <h2>Cooking Video</h2>
                    <a href="${escapeHtml(youtube)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                        Watch on YouTube ↗
                    </a>
                </div>`
                        : ""
                }
            </div>
        </div>

        <div class="detail-grid">
            <section class="card">
                <h2>Ingredients</h2>
                <ul class="ingredient-list">
                    ${ingredients
                        .map(
                            (item) => `
                        <li>
                            <strong>${escapeHtml(item.ingredient)}</strong>
                            <span>${escapeHtml(item.measure)}</span>
                        </li>
                    `
                        )
                        .join("")}
                </ul>
            </section>

            <section class="card">
                <h2>Cooking Instructions</h2>
                <div class="instructions">${escapeHtml(instructions).replace(/\n/g, "<br>")}</div>
            </section>
        </div>
    `;

    document.getElementById("favBtn").addEventListener("click", () => {
        const recipe = {
            id,
            name: meal.strMeal,
            thumb: meal.strMealThumb,
            category: meal.strCategory || "—",
            area: meal.strArea || "—",
        };
        const { added } = toggleFavorite(recipe);
        renderSidebar("details", { showFilters: false });
        document.getElementById("surpriseBtn")?.addEventListener("click", () => {
            window.location.href = "index.html";
        });
        renderDetail(meal);
        showToast(added ? "Added to favorites" : "Removed from favorites");
    });
}

loadRecipe();
