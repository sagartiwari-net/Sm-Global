import {
    searchMealsByName,
    getRandomMeals,
    getRandomMeal,
    listCategories,
    listAreas,
    filterByCategory,
    filterByArea,
    enrichMeals,
} from "./api.js";
import { isFavorite, toggleFavorite } from "./storage.js";
import {
    renderSidebar,
    closeSidebar,
    showSkeletonGrid,
    showError,
    showToast,
    createRecipeCard,
    bindFavoriteButtons,
} from "./ui.js";

const INITIAL_COUNT = 12;
const LOAD_MORE_COUNT = 8;
const FILTER_LIMIT = 48;

renderSidebar("home", { showFilters: true });

const grid = document.getElementById("recipeGrid");
const resultsText = document.getElementById("resultsText");
const loadMoreBtn = document.getElementById("loadMoreBtn");

let searchInput = document.getElementById("searchInput");
let categoryFilter = document.getElementById("categoryFilter");
let areaFilter = document.getElementById("areaFilter");
let searchBtn = document.getElementById("searchBtn");
let surpriseBtn = document.getElementById("surpriseBtn");
let clearBtn = document.getElementById("clearBtn");

let currentRecipes = [];
let currentLabel = "Featured recipes";
let canLoadMore = true;
let isLoadingMore = false;
let filterCache = []; // raw filter results for pagination
let filterShown = 0;

function refreshSidebarRefs() {
    searchInput = document.getElementById("searchInput");
    categoryFilter = document.getElementById("categoryFilter");
    areaFilter = document.getElementById("areaFilter");
    searchBtn = document.getElementById("searchBtn");
    surpriseBtn = document.getElementById("surpriseBtn");
    clearBtn = document.getElementById("clearBtn");
    bindSidebarEvents();
}

function bindSidebarEvents() {
    const onSearch = () => {
        applyFilters();
        closeSidebar();
    };

    if (searchBtn) searchBtn.onclick = onSearch;
    if (searchInput) {
        searchInput.onkeydown = (e) => {
            if (e.key === "Enter") onSearch();
        };
    }
    if (categoryFilter) {
        categoryFilter.onchange = () => {
            applyFilters();
            closeSidebar();
        };
    }
    if (areaFilter) {
        areaFilter.onchange = () => {
            applyFilters();
            closeSidebar();
        };
    }
    if (surpriseBtn) surpriseBtn.onclick = surpriseMe;
    if (clearBtn) {
        clearBtn.onclick = () => {
            clearFilters();
            closeSidebar();
        };
    }
}

function updateLoadMoreButton() {
    if (!loadMoreBtn) return;
    loadMoreBtn.classList.toggle("hidden", !canLoadMore);
    loadMoreBtn.disabled = isLoadingMore;
    loadMoreBtn.textContent = isLoadingMore ? "Loading..." : "Load More Recipes";
}

async function initFilters() {
    try {
        const [categories, areas] = await Promise.all([listCategories(), listAreas()]);

        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        categories.forEach((cat) => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = cat;
            categoryFilter.appendChild(opt);
        });

        areaFilter.innerHTML = '<option value="">All Cuisines</option>';
        areas.forEach((area) => {
            const opt = document.createElement("option");
            opt.value = area;
            opt.textContent = area;
            areaFilter.appendChild(opt);
        });
    } catch {
        // filters optional
    }
}

function mergeUnique(existing, incoming) {
    const seen = new Set(existing.map((r) => String(r.id)));
    const next = [...existing];
    incoming.forEach((r) => {
        if (!seen.has(String(r.id))) {
            seen.add(String(r.id));
            next.push(r);
        }
    });
    return next;
}

async function loadHomeRecipes() {
    showSkeletonGrid(grid, INITIAL_COUNT);
    resultsText.textContent = "Loading recipes...";
    canLoadMore = true;
    filterCache = [];
    filterShown = 0;
    updateLoadMoreButton();

    try {
        currentRecipes = await getRandomMeals(INITIAL_COUNT);
        currentLabel = `Featured recipes · ${currentRecipes.length} shown`;
        renderGrid(currentRecipes, currentLabel);
        canLoadMore = true;
        updateLoadMoreButton();
    } catch (error) {
        showError(grid, error.message || "Could not load recipes.", loadHomeRecipes);
        resultsText.textContent = "Failed to load";
        canLoadMore = false;
        updateLoadMoreButton();
    }
}

function renderGrid(recipes, label = "") {
    currentRecipes = recipes;
    currentLabel = label || `${recipes.length} recipe${recipes.length === 1 ? "" : "s"} found`;
    resultsText.textContent = currentLabel;

    if (!recipes.length) {
        grid.innerHTML = `
            <div class="state-box empty-state">
                <div class="empty-icon">🍽</div>
                <h3>No recipes found</h3>
                <p>Try another search or clear your filters.</p>
            </div>
        `;
        canLoadMore = false;
        updateLoadMoreButton();
        return;
    }

    grid.innerHTML = recipes
        .map((r) => createRecipeCard(r, { favorited: isFavorite(r.id) }))
        .join("");

    bindFavoriteButtons(grid, recipes, (recipe) => {
        const { added } = toggleFavorite(recipe);
        const savedQuery = searchInput?.value || "";
        const savedCat = categoryFilter?.value || "";
        const savedArea = areaFilter?.value || "";
        renderSidebar("home", { showFilters: true });
        refreshSidebarRefs();
        if (searchInput) searchInput.value = savedQuery;
        initFilters().then(() => {
            if (categoryFilter) categoryFilter.value = savedCat;
            if (areaFilter) areaFilter.value = savedArea;
        });
        renderGrid(currentRecipes, currentLabel);
        showToast(added ? "Added to favorites" : "Removed from favorites");
    });

    updateLoadMoreButton();
}

async function applyFilters() {
    const query = searchInput.value.trim();
    const category = categoryFilter.value;
    const area = areaFilter.value;

    showSkeletonGrid(grid, 12);
    resultsText.textContent = "Searching...";
    filterCache = [];
    filterShown = 0;

    try {
        let recipes = [];

        if (query) {
            recipes = await searchMealsByName(query);
            if (category) recipes = recipes.filter((r) => r.category === category);
            if (area) recipes = recipes.filter((r) => r.area === area);
            canLoadMore = false;
            currentLabel = `Results for "${query}" · ${recipes.length} found`;
        } else if (category || area) {
            filterCache = category
                ? await filterByCategory(category)
                : await filterByArea(area);

            filterShown = Math.min(FILTER_LIMIT, filterCache.length);
            const batch = filterCache.slice(0, filterShown);
            recipes = await enrichMeals(batch);

            if (category && area) {
                recipes = recipes.filter((r) => r.area === area);
            }

            canLoadMore = filterShown < filterCache.length;
            currentLabel = category
                ? `${category} recipes · ${recipes.length} shown`
                : `${area} cuisine · ${recipes.length} shown`;
        } else {
            recipes = await getRandomMeals(INITIAL_COUNT);
            canLoadMore = true;
            currentLabel = `Featured recipes · ${recipes.length} shown`;
        }

        renderGrid(recipes, currentLabel);
    } catch (error) {
        showError(grid, error.message || "Search failed.", applyFilters);
        resultsText.textContent = "Search failed";
        canLoadMore = false;
        updateLoadMoreButton();
    }
}

async function loadMoreRecipes() {
    if (!canLoadMore || isLoadingMore) return;

    isLoadingMore = true;
    updateLoadMoreButton();

    try {
        const query = searchInput?.value.trim() || "";
        const category = categoryFilter?.value || "";
        const area = areaFilter?.value || "";

        if (!query && (category || area) && filterCache.length) {
            const nextEnd = Math.min(filterShown + FILTER_LIMIT, filterCache.length);
            const batch = filterCache.slice(filterShown, nextEnd);
            filterShown = nextEnd;

            let more = await enrichMeals(batch);
            if (category && area) {
                more = more.filter((r) => r.area === area);
            }

            currentRecipes = mergeUnique(currentRecipes, more);
            canLoadMore = filterShown < filterCache.length;
            currentLabel = category
                ? `${category} recipes · ${currentRecipes.length} shown`
                : `${area} cuisine · ${currentRecipes.length} shown`;
        } else {
            // Featured / random mode — fetch more unique random meals
            let attempts = 0;
            let added = [];
            while (added.length < LOAD_MORE_COUNT && attempts < 4) {
                attempts += 1;
                const batch = await getRandomMeals(LOAD_MORE_COUNT);
                const merged = mergeUnique(currentRecipes.concat(added), batch);
                added = merged.slice(currentRecipes.length);
            }
            currentRecipes = mergeUnique(currentRecipes, added);
            canLoadMore = true;
            currentLabel = `Featured recipes · ${currentRecipes.length} shown`;
        }

        renderGrid(currentRecipes, currentLabel);
        showToast("More recipes loaded");
    } catch (error) {
        showToast(error.message || "Could not load more");
    } finally {
        isLoadingMore = false;
        updateLoadMoreButton();
    }
}

async function surpriseMe() {
    showSkeletonGrid(grid, 1);
    resultsText.textContent = "Finding a surprise recipe...";
    closeSidebar();

    try {
        const meal = await getRandomMeal();
        if (!meal) {
            renderGrid([], "No recipe found");
            return;
        }
        window.location.href = `details.html?id=${meal.idMeal}`;
    } catch (error) {
        showError(grid, error.message || "Could not load random recipe.", surpriseMe);
    }
}

function clearFilters() {
    if (searchInput) searchInput.value = "";
    if (categoryFilter) categoryFilter.value = "";
    if (areaFilter) areaFilter.value = "";
    loadHomeRecipes();
}

loadMoreBtn?.addEventListener("click", loadMoreRecipes);

bindSidebarEvents();
initFilters();
loadHomeRecipes();
