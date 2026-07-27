import { getFavoriteCount } from "./storage.js";
import { escapeHtml } from "./utils.js";

const PAGE_META = {
    home: { title: "Discover", subtitle: "Browse featured recipes" },
    favorites: { title: "Favorites", subtitle: "Saved recipes for later" },
    details: { title: "Recipe Details", subtitle: "Ingredients, steps & video" },
};

export function renderSidebar(active = "home", { showFilters = false } = {}) {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    const count = getFavoriteCount();

    sidebar.innerHTML = `
        <div class="sidebar-brand">
            <span class="brand-mark">RF</span>
            <div>
                <strong>Recipe Finder</strong>
                <span class="brand-sub">Kitchen Console</span>
            </div>
        </div>

        <nav class="sidebar-nav">
            <p class="nav-label">Menu</p>
            <a href="index.html" class="nav-item ${active === "home" ? "active" : ""}">
                <span class="nav-ico">⌂</span> Discover
            </a>
            <a href="favorites.html" class="nav-item ${active === "favorites" ? "active" : ""}">
                <span class="nav-ico">♥</span> Favorites
                <span class="badge">${count}</span>
            </a>
            <button type="button" class="nav-item surprise-btn" id="surpriseBtn">
                <span class="nav-ico">✦</span> Surprise Me
            </button>
        </nav>

        ${
            showFilters
                ? `
        <div class="sidebar-filters">
            <p class="nav-label">Filters</p>

            <div class="filter-group">
                <label for="searchInput">Search</label>
                <input type="text" id="searchInput" placeholder="pasta, chicken...">
            </div>

            <div class="filter-group">
                <label for="categoryFilter">Category</label>
                <select id="categoryFilter">
                    <option value="">All Categories</option>
                </select>
            </div>

            <div class="filter-group">
                <label for="areaFilter">Cuisine</label>
                <select id="areaFilter">
                    <option value="">All Cuisines</option>
                </select>
            </div>

            <div class="filter-btns">
                <button type="button" class="btn btn-primary btn-block" id="searchBtn">Search</button>
                <button type="button" class="btn btn-ghost btn-block" id="clearBtn">Clear</button>
            </div>
        </div>`
                : `
        <div class="sidebar-note">
            <p>Tip: Use Discover filters to search by name, category, or cuisine.</p>
            <a href="index.html" class="btn btn-outline btn-block">Go to Discover</a>
        </div>`
        }

        <div class="sidebar-foot">
            <p>TheMealDB API</p>
        </div>
    `;

    bindSidebarChrome();
}

export function bindSidebarChrome() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const menuBtn = document.getElementById("menuBtn");

    function openSidebar() {
        sidebar?.classList.add("open");
        overlay?.classList.remove("hidden");
    }

    function close() {
        sidebar?.classList.remove("open");
        overlay?.classList.add("hidden");
    }

    if (menuBtn) menuBtn.onclick = openSidebar;
    if (overlay) overlay.onclick = close;
}

export function closeSidebar() {
    document.getElementById("sidebar")?.classList.remove("open");
    document.getElementById("sidebarOverlay")?.classList.add("hidden");
}

export function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

export function showLoading(container, message = "Loading recipes...") {
    if (!container) return;
    container.innerHTML = `
        <div class="state-box">
            <div class="spinner"></div>
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

export function showSkeletonGrid(container, count = 8) {
    if (!container) return;
    container.innerHTML = Array.from({ length: count })
        .map(
            () => `
        <div class="skeleton-card">
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton skeleton-line"></div>
            <div class="skeleton skeleton-line short"></div>
        </div>
    `
        )
        .join("");
}

export function showError(container, message, onRetry) {
    if (!container) return;
    container.innerHTML = `
        <div class="state-box state-error">
            <p>${escapeHtml(message)}</p>
            ${onRetry ? '<button type="button" class="btn btn-primary" id="retryBtn">Try Again</button>' : ""}
        </div>
    `;
    if (onRetry) {
        document.getElementById("retryBtn")?.addEventListener("click", onRetry);
    }
}

export function createRecipeCard(recipe, { favorited = false } = {}) {
    const image = recipe.thumb || "";
    return `
        <article class="recipe-card">
            <a href="details.html?id=${escapeHtml(recipe.id)}" class="recipe-image">
                <img src="${escapeHtml(image)}" alt="${escapeHtml(recipe.name)}" loading="lazy" onerror="this.style.opacity='0.2'">
            </a>
            <div class="recipe-body">
                <h3><a href="details.html?id=${escapeHtml(recipe.id)}">${escapeHtml(recipe.name)}</a></h3>
                <div class="recipe-tags">
                    <span class="tag tag-cat">${escapeHtml(recipe.category)}</span>
                    <span class="tag tag-area">${escapeHtml(recipe.area)}</span>
                </div>
                <div class="recipe-actions">
                    <a href="details.html?id=${escapeHtml(recipe.id)}" class="btn btn-primary btn-sm">View</a>
                    <button type="button" class="btn btn-outline btn-sm ${favorited ? "active" : ""}" data-fav="${escapeHtml(recipe.id)}" data-action="toggle-fav">
                        ${favorited ? "♥ Saved" : "♡ Save"}
                    </button>
                </div>
            </div>
        </article>
    `;
}

export function bindFavoriteButtons(container, recipes, onUpdate) {
    container.querySelectorAll('[data-action="toggle-fav"]').forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.dataset.fav;
            const recipe = recipes.find((r) => String(r.id) === String(id));
            if (recipe && onUpdate) onUpdate(recipe, btn);
        });
    });
}

export { PAGE_META };
