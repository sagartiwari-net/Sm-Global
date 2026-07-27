import { requireAuth } from "./auth.js";
import { getFavorites, toggleFavorite, saveFavorites } from "./storage.js";
import { getCachedPoster, enrichMoviesWithPosters, applyPosterToCard } from "./posters.js";
import {
    renderSidebar,
    createMovieCard,
    bindFavoriteButtons,
    showToast,
} from "./ui.js";

if (!requireAuth()) {
    // redirected
} else {
    const grid = document.getElementById("movieGrid");
    const resultsText = document.getElementById("resultsText");
    let movies = [];

    renderSidebar("favorites");
    renderFavorites();

    function renderFavorites() {
        movies = getFavorites().map((m) => ({
            ...m,
            poster: m.poster || getCachedPoster(m.id) || "",
        }));

        if (!movies.length) {
            grid.innerHTML = `
                <div class="state-box">
                    <p>No favorites yet</p>
                    <p class="muted">Save movies from the dashboard to see them here.</p>
                    <a href="dashboard.html" class="btn btn-primary">Browse Movies</a>
                </div>`;
            resultsText.textContent = "0 saved movies";
            return;
        }

        grid.innerHTML = movies
            .map((m) => createMovieCard(m, { favorited: true }))
            .join("");

        resultsText.textContent = `${movies.length} saved movie${movies.length === 1 ? "" : "s"}`;
        bindFavoriteButtons(grid, movies, handleToggle);

        enrichMoviesWithPosters(movies, {
            onPoster: (movie, poster) => {
                applyPosterToCard(movie.id, poster);
                const list = getFavorites().map((m) =>
                    String(m.id) === String(movie.id) ? { ...m, poster } : m
                );
                saveFavorites(list);
            },
        });
    }

    function handleToggle(movie) {
        toggleFavorite(movie);
        showToast("Removed from favorites");
        renderSidebar("favorites");
        renderFavorites();
    }
}
