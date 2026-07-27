import { requireAuth } from "./auth.js";
import { discoverMovies, getGenreOptions, getRandomMovie, upsertCatalog } from "./api.js";
import { isFavorite, toggleFavorite, getFavoriteCount } from "./storage.js";
import { enrichMoviesWithPosters, applyPosterToCard, updateMovieCardMeta } from "./posters.js";
import {
    renderSidebar,
    showSkeletonGrid,
    showError,
    createMovieCard,
    bindFavoriteButtons,
    populateYearFilter,
    showToast,
    closeSidebar,
} from "./ui.js";

if (!requireAuth()) {
    // redirected
} else {
    const grid = document.getElementById("movieGrid");
    const resultsText = document.getElementById("resultsText");
    let currentMovies = [];
    let filterState = { search: "", genre: "", year: "", minRating: "", sort: "" };
    let genresReady = false;

    boot();

    async function boot() {
        renderSidebar("dashboard", { showFilters: true });
        await setupFilters();
        loadMovies();
    }

    async function setupFilters() {
        if (!genresReady) {
            try {
                const genres = await getGenreOptions();
                const genreSelect = document.getElementById("genreFilter");
                genres.forEach((g) => {
                    const opt = document.createElement("option");
                    opt.value = g.id;
                    opt.textContent = g.name;
                    genreSelect.appendChild(opt);
                });
                genresReady = true;
            } catch {
                // filled after first load
            }
        }

        populateYearFilter(document.getElementById("yearFilter"), 2025, 1990);
        applyFilterValues();

        document.getElementById("applyBtn").onclick = () => {
            readFilters();
            closeSidebar();
            loadMovies();
        };

        document.getElementById("clearBtn").onclick = () => {
            filterState = { search: "", genre: "", year: "", minRating: "", sort: "" };
            applyFilterValues();
            closeSidebar();
            loadMovies();
        };

        document.getElementById("searchInput").onkeydown = (e) => {
            if (e.key === "Enter") document.getElementById("applyBtn").click();
        };
    }

    function readFilters() {
        filterState = {
            search: document.getElementById("searchInput").value.trim(),
            genre: document.getElementById("genreFilter").value,
            year: document.getElementById("yearFilter").value,
            minRating: document.getElementById("ratingFilter").value,
            sort: document.getElementById("sortFilter").value,
        };
    }

    function applyFilterValues() {
        document.getElementById("searchInput").value = filterState.search;
        document.getElementById("genreFilter").value = filterState.genre;
        document.getElementById("yearFilter").value = filterState.year;
        document.getElementById("ratingFilter").value = filterState.minRating;
        document.getElementById("sortFilter").value = filterState.sort;
    }

    async function loadMovies() {
        showSkeletonGrid(grid);
        resultsText.textContent = "Loading movies...";

        try {
            const movies = await discoverMovies(filterState);
            currentMovies = movies;
            renderGrid(movies);
            enrichPosters(movies);
        } catch (err) {
            showError(grid, err.message, loadMovies);
            resultsText.textContent = "Could not load movies";
        }
    }

    function renderGrid(movies) {
        if (!movies.length) {
            grid.innerHTML = `
                <div class="state-box">
                    <p>No Results Found</p>
                    <p class="muted">Try a different search or clear filters.</p>
                </div>`;
            resultsText.textContent = "0 movies found";
            return;
        }

        grid.innerHTML = movies
            .map((m) => createMovieCard(m, { favorited: isFavorite(m.id) }))
            .join("");

        resultsText.textContent = `${movies.length} movie${movies.length === 1 ? "" : "s"} found`;
        bindFavoriteButtons(grid, movies, handleToggle);
    }

    function handleToggle(movie) {
        const { added } = toggleFavorite(movie);
        showToast(added ? "Added to favorites" : "Removed from favorites");

        const btn = grid.querySelector(`[data-fav="${CSS.escape(String(movie.id))}"]`);
        if (btn) {
            btn.classList.toggle("active", added);
            btn.textContent = added ? "★ Saved" : "☆ Save";
        }

        const badge = document.querySelector(".sidebar .badge");
        if (badge) badge.textContent = String(getFavoriteCount());
    }

    async function enrichPosters(movies) {
        await enrichMoviesWithPosters(movies, {
            concurrency: 3,
            onPoster: (movie, poster) => applyPosterToCard(movie.id, poster),
            onUpdate: (movie) => {
                applyPosterToCard(movie.id, movie.poster);
                updateMovieCardMeta(movie);
            },
        });
        upsertCatalog(movies);

        // Refresh genre list after OMDb enrichment
        const genreSelect = document.getElementById("genreFilter");
        if (genreSelect) {
            const current = genreSelect.value;
            try {
                const genres = await getGenreOptions();
                genreSelect.innerHTML = '<option value="">All Genres</option>';
                genres.forEach((g) => {
                    const opt = document.createElement("option");
                    opt.value = g.id;
                    opt.textContent = g.name;
                    genreSelect.appendChild(opt);
                });
                genreSelect.value = current;
                genresReady = true;
            } catch {
                // keep previous
            }
        }
    }

    // Optional: surprise via /random (uses 1 API call)
    window.__movieSurprise = async () => {
        try {
            const movie = await getRandomMovie();
            window.location.href = `movie.html?id=${encodeURIComponent(movie.id)}`;
        } catch (err) {
            showToast(err.message);
        }
    };
}
