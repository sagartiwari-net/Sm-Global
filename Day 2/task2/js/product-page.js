import { requireAuth, getSession } from "./auth.js";
import { fetchProductById, fetchProducts } from "./api.js";
import { addToCart } from "./cart.js";
import { toggleWishlist, isInWishlist } from "./wishlist.js";
import {
    renderNavbar,
    renderFooter,
    showLoading,
    showError,
    showToast,
    createProductCard,
    onCurrencyChange,
} from "./ui.js";
import {
    escapeHtml,
    formatCurrency,
    getItem,
    setItem,
    STORAGE_KEYS,
    getStock,
    addRecentlyViewed,
    getRecentlyViewed,
} from "./utils.js";

if (!requireAuth()) throw new Error("Auth required");

renderNavbar("shop");
renderFooter();

const container = document.getElementById("productDetail");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let currentProduct = null;
let relatedProducts = [];

const REVIEW_NAMES = [
    "Aarav Sharma",
    "Priya Patel",
    "Rohan Mehta",
    "Ananya Singh",
    "Kabir Joshi",
    "Isha Verma",
    "Vikram Rao",
    "Neha Kapoor",
];

const REVIEW_TEXTS = [
    "Really good quality for the price. Packaging was neat and delivery was quick.",
    "Exactly as shown in the photos. Happy with this purchase!",
    "Solid product overall. Would recommend to friends and family.",
    "Value for money. Using it daily and no issues so far.",
    "Looks premium and feels durable. Worth buying.",
    "Good product, but delivery took a bit longer than expected.",
    "Nice finish and comfortable to use. Star rating is fair.",
    "Exceeded my expectations. Will order again from ShopEase.",
];

function commentsKey(id) {
    return `${STORAGE_KEYS.comments}_${id}`;
}

function getLocalComments(id) {
    return getItem(commentsKey(id), []);
}

function saveLocalComments(id, comments) {
    setItem(commentsKey(id), comments);
}

function seededIndex(seed, max) {
    let n = 0;
    const str = String(seed);
    for (let i = 0; i < str.length; i += 1) {
        n = (n + str.charCodeAt(i) * (i + 1)) % 997;
    }
    return n % max;
}

function generateSampleReviews(product) {
    const rate = product.rating?.rate ?? 4;
    const count = Math.min(4, Math.max(2, Math.floor((product.rating?.count || 20) / 40)));
    const reviews = [];

    for (let i = 0; i < count; i += 1) {
        const nameIndex = seededIndex(`${product.id}-n-${i}`, REVIEW_NAMES.length);
        const textIndex = seededIndex(`${product.id}-t-${i}`, REVIEW_TEXTS.length);
        const starBias = Math.round(rate);
        const stars = Math.min(5, Math.max(3, starBias - (i % 2)));

        reviews.push({
            id: `sample-${product.id}-${i}`,
            name: REVIEW_NAMES[nameIndex],
            rating: stars,
            text: REVIEW_TEXTS[textIndex],
            date: new Date(Date.now() - (i + 2) * 86400000 * 3).toISOString(),
            isLocal: false,
        });
    }

    return reviews;
}

function getAllReviews(product) {
    const samples = generateSampleReviews(product);
    const local = getLocalComments(product.id).map((c) => ({
        ...c,
        isLocal: true,
    }));
    return [...local, ...samples];
}

function starsHtml(rating) {
    const full = Math.round(Number(rating) || 0);
    return "★".repeat(full) + "☆".repeat(5 - full);
}

async function loadProduct() {
    if (!productId) {
        showError(container, "No product selected.");
        return;
    }

    showLoading(container, "Loading product...");

    try {
        const [product, allProducts] = await Promise.all([
            fetchProductById(productId),
            fetchProducts(),
        ]);

        currentProduct = product;
        addRecentlyViewed(product);
        relatedProducts = allProducts
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4);

        renderProduct();
    } catch (error) {
        showError(container, error.message || "Failed to load product.", loadProduct);
    }
}

function openZoom(src, alt) {
    let modal = document.getElementById("imageZoomModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "imageZoomModal";
        modal.className = "zoom-modal hidden";
        modal.innerHTML = `
            <div class="zoom-overlay" data-close-zoom></div>
            <div class="zoom-content">
                <button type="button" class="zoom-close" data-close-zoom aria-label="Close">×</button>
                <img id="zoomImage" src="" alt="">
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener("click", (e) => {
            if (e.target.closest("[data-close-zoom]")) {
                modal.classList.add("hidden");
            }
        });
    }
    document.getElementById("zoomImage").src = src;
    document.getElementById("zoomImage").alt = alt;
    modal.classList.remove("hidden");
}

function renderProduct() {
    if (!currentProduct) return;

    const product = currentProduct;
    const wishlisted = isInWishlist(product.id);
    const rating = product.rating?.rate ?? 0;
    const count = product.rating?.count ?? 0;
    const reviews = getAllReviews(product);
    const session = getSession();
    const stock = getStock(product.id);
    const outOfStock = stock <= 0;
    const recent = getRecentlyViewed(product.id);

    container.innerHTML = `
        <nav class="breadcrumbs">
            <a href="shop.html">Shop</a>
            <span>/</span>
            <a href="shop.html">${escapeHtml(product.category)}</a>
            <span>/</span>
            <span>${escapeHtml(product.title)}</span>
        </nav>

        <div class="detail-layout">
            <div class="detail-image">
                <button type="button" class="zoom-trigger" id="zoomTrigger" aria-label="Zoom image">
                    <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}">
                    <span class="zoom-hint">Click to zoom</span>
                </button>
            </div>
            <div class="detail-info">
                <p class="product-category">${escapeHtml(product.category)}</p>
                <h1>${escapeHtml(product.title)}</h1>
                <div class="product-meta detail-meta">
                    <span class="price">${formatCurrency(product.price)}</span>
                    <span class="rating">★ ${rating} (${count} reviews)</span>
                </div>
                <p class="stock-text ${outOfStock ? "out" : ""}">
                    ${outOfStock ? "Out of stock" : `${stock} items in stock`}
                </p>

                <div class="qty-row">
                    <label for="qtyInput">Quantity</label>
                    <input type="number" id="qtyInput" min="1" max="${Math.max(1, stock)}" value="1" ${outOfStock ? "disabled" : ""}>
                </div>

                <div class="detail-actions">
                    <button type="button" class="btn btn-primary" id="addCartBtn" ${outOfStock ? "disabled" : ""}>
                        ${outOfStock ? "Sold Out" : "Add to Cart"}
                    </button>
                    <button type="button" class="btn btn-outline ${wishlisted ? "active" : ""}" id="wishBtn">
                        ${wishlisted ? "♥ In Wishlist" : "♡ Add to Wishlist"}
                    </button>
                    <a href="shop.html" class="btn btn-ghost">Back to Shop</a>
                </div>
            </div>
        </div>

        <section class="card detail-section">
            <h2>Product Description</h2>
            <p class="detail-desc-full">${escapeHtml(product.description)}</p>
            <ul class="detail-highlights">
                <li><strong>Category:</strong> ${escapeHtml(product.category)}</li>
                <li><strong>Price:</strong> ${formatCurrency(product.price)}</li>
                <li><strong>Average Rating:</strong> ${rating} / 5</li>
                <li><strong>Stock:</strong> ${outOfStock ? "Unavailable" : stock}</li>
            </ul>
        </section>

        <section class="card detail-section" id="reviewsSection">
            <div class="section-head">
                <h2>Reviews & Comments</h2>
                <span class="muted">${reviews.length} shown</span>
            </div>

            <form id="commentForm" class="comment-form" novalidate>
                <div class="form-group">
                    <label for="commentRating">Your Rating</label>
                    <select id="commentRating">
                        <option value="5">5 - Excellent</option>
                        <option value="4">4 - Good</option>
                        <option value="3">3 - Average</option>
                        <option value="2">2 - Poor</option>
                        <option value="1">1 - Bad</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="commentText">Your Comment</label>
                    <textarea id="commentText" rows="3" placeholder="Share your experience with this product..."></textarea>
                    <span class="error-msg" id="commentTextError"></span>
                </div>
                <button type="submit" class="btn btn-primary">Post Comment</button>
            </form>

            <div class="reviews-list">
                ${
                    reviews.length === 0
                        ? `<p class="muted">No reviews yet. Be the first to comment.</p>`
                        : reviews
                              .map(
                                  (review) => `
                        <article class="review-card">
                            <div class="review-top">
                                <div>
                                    <strong>${escapeHtml(review.name)}</strong>
                                    <p class="muted">${new Date(review.date).toLocaleDateString()}</p>
                                </div>
                                <span class="review-stars">${starsHtml(review.rating)}</span>
                            </div>
                            <p>${escapeHtml(review.text)}</p>
                            ${
                                review.isLocal
                                    ? `<button type="button" class="btn btn-ghost btn-sm" data-action="delete-comment" data-id="${escapeHtml(review.id)}">Delete</button>`
                                    : ""
                            }
                        </article>
                    `
                              )
                              .join("")
                }
            </div>
        </section>

        <section class="detail-section">
            <div class="section-head">
                <h2>Related Products</h2>
                <span class="muted">${escapeHtml(product.category)}</span>
            </div>
            <div class="products-grid" id="relatedGrid">
                ${
                    relatedProducts.length === 0
                        ? `<div class="state-box"><p>No related products found.</p></div>`
                        : relatedProducts
                              .map((p) =>
                                  createProductCard(p, { wishlisted: isInWishlist(p.id) })
                              )
                              .join("")
                }
            </div>
        </section>

        ${
            recent.length
                ? `
        <section class="detail-section">
            <div class="section-head">
                <h2>Recently Viewed</h2>
            </div>
            <div class="recent-grid">
                ${recent
                    .map(
                        (p) => `
                    <a href="product.html?id=${p.id}" class="recent-chip">
                        <img src="${escapeHtml(p.image)}" alt="">
                        <div>
                            <strong>${escapeHtml(p.title)}</strong>
                            <span>${formatCurrency(p.price)}</span>
                        </div>
                    </a>
                `
                    )
                    .join("")}
            </div>
        </section>`
                : ""
        }
    `;

    document.getElementById("zoomTrigger")?.addEventListener("click", () => {
        openZoom(product.image, product.title);
    });

    document.getElementById("addCartBtn")?.addEventListener("click", () => {
        if (outOfStock) return;
        const qty = Math.max(1, Number(document.getElementById("qtyInput").value) || 1);
        const result = addToCart(currentProduct, qty);
        if (!result.ok) {
            showToast(result.message, "error");
            return;
        }
        renderNavbar("shop");
        showToast(`Added ${qty} item(s) to cart`);
    });

    document.getElementById("wishBtn").addEventListener("click", () => {
        const { added } = toggleWishlist(currentProduct);
        renderNavbar("shop");
        renderProduct();
        showToast(added ? "Added to wishlist" : "Removed from wishlist");
    });

    document.getElementById("commentForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const text = document.getElementById("commentText").value.trim();
        const userRating = Number(document.getElementById("commentRating").value);
        const errorEl = document.getElementById("commentTextError");
        errorEl.textContent = "";

        if (!text) {
            errorEl.textContent = "Please write a comment.";
            return;
        }
        if (text.length < 5) {
            errorEl.textContent = "Comment must be at least 5 characters.";
            return;
        }

        const comments = getLocalComments(product.id);
        comments.unshift({
            id: `local-${Date.now()}`,
            name: session?.name || "You",
            rating: userRating,
            text,
            date: new Date().toISOString(),
        });
        saveLocalComments(product.id, comments);
        showToast("Comment posted");
        renderProduct();
    });

    container.querySelectorAll('[data-action="delete-comment"]').forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const comments = getLocalComments(product.id).filter((c) => c.id !== id);
            saveLocalComments(product.id, comments);
            showToast("Comment deleted");
            renderProduct();
        });
    });

    document.getElementById("relatedGrid")?.addEventListener("click", (e) => {
        const button = e.target.closest("[data-action]");
        if (!button || button.disabled) return;

        const id = Number(button.dataset.id);
        const related = relatedProducts.find((p) => p.id === id);
        if (!related) return;

        if (button.dataset.action === "add-cart") {
            const result = addToCart(related, 1);
            if (!result.ok) {
                showToast(result.message, "error");
                return;
            }
            renderNavbar("shop");
            showToast("Added to cart");
        }

        if (button.dataset.action === "toggle-wish") {
            const { added } = toggleWishlist(related);
            renderNavbar("shop");
            renderProduct();
            showToast(added ? "Added to wishlist" : "Removed from wishlist");
        }
    });
}

loadProduct();

onCurrencyChange(() => {
    if (currentProduct) renderProduct();
});
