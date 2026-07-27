import { getSession, logoutUser } from "./auth.js";
import { getFavoriteCount } from "./storage.js";
import { escapeHtml, getTheme, toggleTheme, applyTheme } from "./utils.js";

export function initTheme() {
    applyTheme(getTheme());
}

export function renderSidebar(active = "dashboard", { showFilters = false } = {}) {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    initTheme();
    const session = getSession();
    const count = getFavoriteCount();
    const theme = getTheme();

    sidebar.innerHTML = `
        <div class="sidebar-brand">
            <span class="brand-mark">MX</span>
            <div>
                <strong>Movie Explorer</strong>
                <span class="brand-sub">Cinema Dashboard</span>
            </div>
        </div>

        <nav class="sidebar-nav">
            <p class="nav-label">Menu</p>
            <a href="dashboard.html" class="nav-item ${active === "dashboard" ? "active" : ""}">
                <span class="nav-ico">▦</span> Dashboard
            </a>
            <a href="favorites.html" class="nav-item ${active === "favorites" ? "active" : ""}">
                <span class="nav-ico">★</span> Favorites
                <span class="badge">${count}</span>
            </a>
            <button type="button" class="nav-item" id="themeToggle">
                <span class="nav-ico">${theme === "dark" ? "☀" : "☾"}</span>
                ${theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
        </nav>

        ${
            showFilters
                ? `
        <div class="sidebar-filters">
            <p class="nav-label">Filters</p>
            <div class="filter-group">
                <label for="searchInput">Search</label>
                <input type="text" id="searchInput" placeholder="Search movies...">
            </div>
            <div class="filter-group">
                <label for="genreFilter">Genre</label>
                <select id="genreFilter"><option value="">All Genres</option></select>
            </div>
            <div class="filter-group">
                <label for="yearFilter">Release Year</label>
                <select id="yearFilter"><option value="">All Years</option></select>
            </div>
            <div class="filter-group">
                <label for="ratingFilter">Min Rating</label>
                <select id="ratingFilter">
                    <option value="">Any</option>
                    <option value="9">9+</option>
                    <option value="8">8+</option>
                    <option value="7">7+</option>
                    <option value="6">6+</option>
                </select>
            </div>
            <div class="filter-group">
                <label for="sortFilter">Sort By</label>
                <select id="sortFilter">
                    <option value="">Popularity</option>
                    <option value="rating">Rating</option>
                    <option value="date">Release Date</option>
                    <option value="alpha">Alphabetical</option>
                </select>
            </div>
            <div class="filter-btns">
                <button type="button" class="btn btn-primary btn-block" id="applyBtn">Apply</button>
                <button type="button" class="btn btn-ghost btn-block" id="clearBtn">Clear</button>
            </div>
        </div>`
                : `
        <div class="sidebar-note">
            <p>Browse trending movies or use filters on the dashboard.</p>
            <a href="dashboard.html" class="btn btn-outline btn-block">Go to Dashboard</a>
        </div>`
        }

        <div class="sidebar-user">
            <span>${escapeHtml(session?.name || "User")}</span>
            <button type="button" class="btn btn-ghost btn-sm" id="logoutBtn">Logout</button>
        </div>
    `;

    document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);
    document.getElementById("themeToggle")?.addEventListener("click", () => {
        const next = toggleTheme();
        const btn = document.getElementById("themeToggle");
        if (btn) {
            btn.innerHTML = `
                <span class="nav-ico">${next === "dark" ? "☀" : "☾"}</span>
                ${next === "dark" ? "Light Mode" : "Dark Mode"}`;
        }
    });

    bindSidebarChrome();
}

export function bindSidebarChrome() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const menuBtn = document.getElementById("menuBtn");

    if (menuBtn) {
        menuBtn.onclick = () => {
            sidebar?.classList.add("open");
            overlay?.classList.remove("hidden");
        };
    }
    if (overlay) {
        overlay.onclick = () => {
            sidebar?.classList.remove("open");
            overlay.classList.add("hidden");
        };
    }
}

export function closeSidebar() {
    document.getElementById("sidebar")?.classList.remove("open");
    document.getElementById("sidebarOverlay")?.classList.add("hidden");
}

export function showToast(msg) {
    let t = document.getElementById("toast");
    if (!t) {
        t = document.createElement("div");
        t.id = "toast";
        t.className = "toast";
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove("show"), 2400);
}

export function showSkeletonGrid(el, n = 10) {
    el.innerHTML = Array.from({ length: n })
        .map(
            () => `
        <div class="skeleton-card">
            <div class="skeleton skeleton-poster"></div>
            <div class="skeleton skeleton-line"></div>
            <div class="skeleton skeleton-line short"></div>
        </div>`
        )
        .join("");
}

export function showError(el, msg, retry) {
    el.innerHTML = `
        <div class="state-box state-error">
            <p>${escapeHtml(msg)}</p>
            ${retry ? '<button type="button" class="btn btn-primary" id="retryBtn">Try Again</button>' : ""}
        </div>`;
    document.getElementById("retryBtn")?.addEventListener("click", retry);
}

export function createMovieCard(movie, { favorited = false } = {}) {
    const poster = movie.poster || "";
    const initial = (movie.title || "?").trim().charAt(0).toUpperCase();
    const href = `movie.html?id=${encodeURIComponent(movie.id)}`;
    return `
        <article class="movie-card" data-movie-id="${escapeHtml(String(movie.id))}">
            <a href="${href}" class="movie-poster">
                ${
                    poster
                        ? `<img src="${escapeHtml(poster)}" alt="${escapeHtml(movie.title)}" loading="lazy">`
                        : `<div class="poster-art" data-letter="${escapeHtml(initial)}"><span>${escapeHtml(initial)}</span><em>${escapeHtml(movie.title)}</em></div>`
                }
                <span class="rating-badge">★ ${escapeHtml(movie.rating)}</span>
            </a>
            <div class="movie-body">
                <h3><a href="${href}">${escapeHtml(movie.title)}</a></h3>
                <p class="movie-meta">${escapeHtml(movie.year)} · ${escapeHtml(movie.genre)}</p>
                <div class="movie-actions">
                    <a href="${href}" class="btn btn-primary btn-sm">Details</a>
                    <button type="button" class="btn btn-outline btn-sm ${favorited ? "active" : ""}" data-fav="${escapeHtml(String(movie.id))}" data-action="toggle-fav">
                        ${favorited ? "★ Saved" : "☆ Save"}
                    </button>
                </div>
            </div>
        </article>`;
}

export function bindFavoriteButtons(container, movies, onToggle) {
    container.querySelectorAll('[data-action="toggle-fav"]').forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const m = movies.find((x) => String(x.id) === btn.dataset.fav);
            if (m && onToggle) onToggle(m);
        });
    });
}

export function sortMoviesClient(movies, sort) {
    const list = [...movies];
    switch (sort) {
        case "rating":
            return list.sort((a, b) => b.vote - a.vote);
        case "date":
            return list.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
        case "alpha":
            return list.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return list;
    }
}

export function populateYearFilter(select, start = 2026, end = 1980) {
    select.innerHTML = '<option value="">All Years</option>';
    for (let y = start; y >= end; y -= 1) {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        select.appendChild(opt);
    }
}
