import { requireAuth } from "./auth.js";
import { getWishlist, removeFromWishlist } from "./wishlist.js";
import { addToCart } from "./cart.js";
import { renderNavbar, renderFooter, showEmptyState, showToast, onCurrencyChange } from "./ui.js";
import { escapeHtml, formatCurrency } from "./utils.js";

if (!requireAuth()) throw new Error("Auth required");

renderNavbar("wishlist");
renderFooter();

const container = document.getElementById("wishlistContent");

function renderWishlist() {
    const list = getWishlist();

    if (!list.length) {
        showEmptyState(container, {
            title: "Your wishlist is empty",
            text: "Browse the shop and save products you want to buy later.",
            actionHref: "shop.html",
            actionLabel: "Browse Products",
        });
        renderNavbar("wishlist");
        return;
    }

    container.innerHTML = `
        <div class="products-grid">
            ${list
                .map(
                    (product) => `
                <article class="product-card">
                    <a href="product.html?id=${product.id}" class="product-image">
                        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}">
                    </a>
                    <div class="product-body">
                        <p class="product-category">${escapeHtml(product.category || "")}</p>
                        <h3 class="product-title">
                            <a href="product.html?id=${product.id}">${escapeHtml(product.title)}</a>
                        </h3>
                        <div class="product-meta">
                            <span class="price">${formatCurrency(product.price)}</span>
                        </div>
                        <div class="product-actions">
                            <button type="button" class="btn btn-primary btn-sm" data-action="add-cart" data-id="${product.id}">
                                Add to Cart
                            </button>
                            <button type="button" class="btn btn-outline btn-sm" data-action="remove" data-id="${product.id}">
                                Remove
                            </button>
                        </div>
                    </div>
                </article>
            `
                )
                .join("")}
        </div>
    `;

    renderNavbar("wishlist");
}

container.addEventListener("click", (e) => {
    const button = e.target.closest("[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const product = getWishlist().find((p) => p.id === id);
    if (!product) return;

    if (button.dataset.action === "add-cart") {
        const result = addToCart(product, 1);
        if (!result.ok) {
            showToast(result.message, "error");
            return;
        }
        showToast("Added to cart");
        renderNavbar("wishlist");
    }

    if (button.dataset.action === "remove") {
        removeFromWishlist(id);
        showToast("Removed from wishlist");
        renderWishlist();
    }
});

renderWishlist();
onCurrencyChange(renderWishlist);
