import { requireAuth, getSession } from "./auth.js";
import { getMovieDetails, getRelatedMovies, upsertCatalog } from "./api.js";
import {
    isFavorite,
    toggleFavorite,
    getReviews,
    addReview,
    getAverageReviewRating,
} from "./storage.js";
import {
    fetchPosterForMovie,
    enrichMoviesWithPosters,
    applyPosterToCard,
    updateMovieCardMeta,
} from "./posters.js";
import {
    renderSidebar,
    showError,
    showToast,
    createMovieCard,
} from "./ui.js";
import { escapeHtml } from "./utils.js";

if (!requireAuth()) {
    // redirected
} else {
    const container = document.getElementById("movieDetail");
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    let relatedMovies = [];

    renderSidebar("dashboard");

    if (!id) {
        container.innerHTML = `
            <div class="state-box">
                <p>Movie not found.</p>
                <a href="dashboard.html" class="btn btn-primary">Back to Dashboard</a>
            </div>`;
    } else {
        loadDetail(id);
    }

    async function loadDetail(movieId) {
        container.innerHTML = `
            <div class="detail-skeleton">
                <div class="skeleton skeleton-poster tall"></div>
                <div class="skeleton-lines">
                    <div class="skeleton skeleton-line"></div>
                    <div class="skeleton skeleton-line short"></div>
                    <div class="skeleton skeleton-line"></div>
                </div>
            </div>`;

        try {
            const movie = await getMovieDetails(movieId);
            // getMovieDetails already enriches via OMDb; ensure poster exists
            if (!movie.poster) {
                movie.poster = await fetchPosterForMovie(movie);
                if (movie.poster) upsertCatalog([movie]);
            }
            relatedMovies = await getRelatedMovies(movie, 8);
            document.getElementById("pageTitle").textContent = movie.title;
            renderDetail(movie);
            enrichRelatedPosters();
        } catch (err) {
            showError(container, err.message, () => loadDetail(movieId));
        }
    }

    function renderDetail(movie) {
        const fav = isFavorite(movie.id);
        const initial = (movie.title || "?").trim().charAt(0).toUpperCase();
        const poster = movie.poster
            ? `<img src="${escapeHtml(movie.poster)}" alt="${escapeHtml(movie.title)}">`
            : `<div class="poster-art large" data-letter="${escapeHtml(initial)}"><span>${escapeHtml(initial)}</span><em>${escapeHtml(movie.title)}</em></div>`;

        const backdropStyle = movie.poster
            ? `background-image:url('${escapeHtml(movie.poster)}')`
            : "";

        const session = getSession();
        const reviews = getReviews(movie.id);
        const avg = getAverageReviewRating(movie.id);

        container.innerHTML = `
            <article class="detail-card">
                <div class="detail-backdrop" style="${backdropStyle}"></div>
                <div class="detail-inner">
                    <div class="detail-poster">${poster}</div>
                    <div class="detail-info">
                        <h2>${escapeHtml(movie.title)}</h2>
                        <div class="detail-tags">
                            <span class="tag">★ ${escapeHtml(movie.rating)}</span>
                            <span class="tag">${escapeHtml(movie.year)}</span>
                            <span class="tag">${escapeHtml(movie.runtime)}</span>
                            <span class="tag">${escapeHtml((movie.language || "").toUpperCase())}</span>
                            ${avg ? `<span class="tag">Reviews ${escapeHtml(avg)}</span>` : ""}
                        </div>
                        <p class="detail-genre"><strong>Genre:</strong> ${escapeHtml(movie.genres || movie.genre)}</p>
                        <p class="detail-date"><strong>Release:</strong> ${escapeHtml(movie.release_date)}</p>
                        ${movie.director ? `<p class="detail-cast"><strong>Director:</strong> ${escapeHtml(movie.director)}</p>` : ""}
                        <p class="detail-cast"><strong>Cast:</strong> ${escapeHtml(movie.cast)}</p>
                        <p class="detail-desc">${escapeHtml(movie.overview)}</p>
                        <button type="button" class="btn ${fav ? "btn-outline active" : "btn-primary"}" id="favBtn">
                            ${fav ? "★ Remove from Favorites" : "☆ Add to Favorites"}
                        </button>
                    </div>
                </div>
            </article>

            <section class="detail-section">
                <div class="section-head">
                    <h3>Related Movies</h3>
                    <p class="muted">Similar picks by genre & language</p>
                </div>
                <div id="relatedGrid" class="related-grid">
                    ${
                        relatedMovies.length
                            ? relatedMovies
                                  .map((m) => createMovieCard(m, { favorited: isFavorite(m.id) }))
                                  .join("")
                            : `<div class="state-box"><p>No related movies found.</p></div>`
                    }
                </div>
            </section>

            <section class="detail-section">
                <div class="section-head">
                    <h3>Reviews</h3>
                    <p class="muted">${reviews.length} review${reviews.length === 1 ? "" : "s"}${avg ? ` · avg ${avg}/5` : ""}</p>
                </div>

                <form id="reviewForm" class="review-form">
                    <div class="review-form-row">
                        <div class="form-group">
                            <label for="reviewName">Name</label>
                            <input type="text" id="reviewName" value="${escapeHtml(session?.name || "")}" required>
                        </div>
                        <div class="form-group">
                            <label>Rating</label>
                            <div class="star-rating" id="starRating" role="radiogroup" aria-label="Rating">
                                ${[1, 2, 3, 4, 5]
                                    .map(
                                        (n) => `
                                    <button type="button" class="star-btn ${n <= 5 ? "active" : ""}" data-value="${n}" aria-label="${n} star${n > 1 ? "s" : ""}">★</button>`
                                    )
                                    .join("")}
                            </div>
                            <input type="hidden" id="reviewRating" value="5" required>
                            <span class="star-label muted" id="starLabel">Excellent</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="reviewText">Your review</label>
                        <textarea id="reviewText" rows="3" required placeholder="What did you think about this movie?"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Post Review</button>
                </form>

                <div id="reviewsList" class="reviews-list">
                    ${renderReviewsList(reviews)}
                </div>
            </section>`;

        document.getElementById("favBtn").addEventListener("click", () => {
            const { added } = toggleFavorite(movie);
            showToast(added ? "Added to favorites" : "Removed from favorites");
            renderDetail(movie);
            enrichRelatedPosters();
        });

        bindStarRating(5);

        document.getElementById("reviewForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("reviewName").value.trim();
            const rating = document.getElementById("reviewRating").value;
            const text = document.getElementById("reviewText").value.trim();

            if (!name || !text) {
                showToast("Please fill name and review");
                return;
            }

            addReview(movie.id, { name, rating, text });
            showToast("Review posted");
            renderDetail(movie);
            enrichRelatedPosters();
        });
    }

    function bindStarRating(initial = 5) {
        const wrap = document.getElementById("starRating");
        const input = document.getElementById("reviewRating");
        const label = document.getElementById("starLabel");
        if (!wrap || !input) return;

        const labels = {
            1: "Bad",
            2: "Poor",
            3: "Okay",
            4: "Good",
            5: "Excellent",
        };

        const paint = (value, hover = 0) => {
            const show = hover || value;
            wrap.querySelectorAll(".star-btn").forEach((btn) => {
                const n = Number(btn.dataset.value);
                btn.classList.toggle("active", n <= show);
                btn.classList.toggle("preview", Boolean(hover) && n <= hover);
            });
            if (label) label.textContent = labels[value] || "";
        };

        paint(initial);

        wrap.querySelectorAll(".star-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const value = Number(btn.dataset.value);
                input.value = String(value);
                paint(value);
            });
            btn.addEventListener("mouseenter", () => paint(Number(input.value), Number(btn.dataset.value)));
            btn.addEventListener("mouseleave", () => paint(Number(input.value)));
        });
    }

    function renderReviewsList(reviews) {
        if (!reviews.length) {
            return `<div class="state-box soft"><p>No reviews yet. Be the first to review!</p></div>`;
        }

        return reviews
            .map(
                (r) => `
            <article class="review-card">
                <div class="review-top">
                    <strong>${escapeHtml(r.name)}</strong>
                    <span class="star-display" aria-label="${escapeHtml(String(r.rating))} out of 5">
                        ${[1, 2, 3, 4, 5]
                            .map((n) => `<span class="${n <= Number(r.rating) ? "on" : ""}">★</span>`)
                            .join("")}
                    </span>
                </div>
                <p>${escapeHtml(r.text)}</p>
                <time class="muted">${escapeHtml(formatReviewDate(r.createdAt))}</time>
            </article>`
            )
            .join("");
    }

    function formatReviewDate(iso) {
        try {
            return new Date(iso).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return "";
        }
    }

    function enrichRelatedPosters() {
        if (!relatedMovies.length) return;
        enrichMoviesWithPosters(relatedMovies, {
            concurrency: 3,
            onPoster: (movie, poster) => applyPosterToCard(movie.id, poster),
            onUpdate: (movie) => {
                applyPosterToCard(movie.id, movie.poster);
                updateMovieCardMeta(movie);
            },
        }).then(() => upsertCatalog(relatedMovies));
    }
}
