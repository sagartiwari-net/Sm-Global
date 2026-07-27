import { getFavorites, removeFavorite } from "./storage.js";
import {
    renderSidebar,
    showToast,
    createRecipeCard,
    bindFavoriteButtons,
} from "./ui.js";

renderSidebar("favorites", { showFilters: false });

document.getElementById("surpriseBtn")?.addEventListener("click", () => {
    window.location.href = "index.html";
});

const grid = document.getElementById("favoritesGrid");
const emptyBox = document.getElementById("emptyFavorites");

function renderFavorites() {
    const list = getFavorites();
    renderSidebar("favorites", { showFilters: false });
    document.getElementById("surpriseBtn")?.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    if (!list.length) {
        grid.innerHTML = "";
        emptyBox.classList.remove("hidden");
        return;
    }

    emptyBox.classList.add("hidden");
    grid.innerHTML = list
        .map((r) => createRecipeCard(r, { favorited: true }))
        .join("");

    bindFavoriteButtons(grid, list, (recipe) => {
        removeFavorite(recipe.id);
        showToast("Removed from favorites");
        renderFavorites();
    });
}

renderFavorites();
