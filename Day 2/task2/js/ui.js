import { getSession, logoutUser } from "./auth.js";
import { getCart, getCartCount, getCartTotals, removeFromCart } from "./cart.js";
import { getWishlistCount } from "./wishlist.js";
import {
    escapeHtml,
    formatCurrency,
    getCurrency,
    setCurrency,
    applyTheme,
    getTheme,
    toggleTheme,
    getStock,
} from "./utils.js";

export function initTheme() {
    applyTheme(getTheme());
}

export function renderNavbar(activePage = "") {
    const nav = document.getElementById("navbar");
    if (!nav) return;

    initTheme();

    const session = getSession();
    const cartCount = getCartCount();
    const wishCount = getWishlistCount();
    const currency = getCurrency();
    const theme = getTheme();
    const cart = getCart();
    const totals = getCartTotals(cart);

    nav.innerHTML = `
        <div class="nav-inner">
            <a href="shop.html" class="brand">
                <span class="brand-mark">EC</span>
                <span class="brand-text">ShopEase</span>
            </a>

            <button type="button" class="nav-toggle" id="navToggle" aria-label="Menu">☰</button>

            <div class="nav-links" id="navLinks">
                <div class="currency-switch" role="group" aria-label="Currency">
                    <button type="button" class="currency-btn ${currency === "INR" ? "active" : ""}" data-currency="INR">₹ INR</button>
                    <button type="button" class="currency-btn ${currency === "USD" ? "active" : ""}" data-currency="USD">$ USD</button>
                </div>
                <button type="button" class="btn btn-ghost btn-sm" id="themeToggle" aria-label="Toggle theme">
                    ${theme === "dark" ? "☀️ Light" : "🌙 Dark"}
                </button>
                <a href="shop.html" class="${activePage === "shop" ? "active" : ""}">Shop</a>
                <a href="wishlist.html" class="${activePage === "wishlist" ? "active" : ""}">
                    Wishlist <span class="badge">${wishCount}</span>
                </a>

                <div class="mini-cart-wrap">
                    <button type="button" class="mini-cart-btn ${activePage === "cart" ? "active" : ""}" id="miniCartBtn">
                        Cart <span class="badge">${cartCount}</span>
                    </button>
                    <div class="mini-cart-dropdown hidden" id="miniCartDropdown">
                        ${
                            cart.length === 0
                                ? `<p class="muted mini-empty">Your cart is empty.</p>`
                                : `
                            <ul class="mini-cart-list">
                                ${cart
                                    .slice(0, 4)
                                    .map(
                                        (item) => `
                                    <li>
                                        <img src="${escapeHtml(item.image)}" alt="">
                                        <div>
                                            <p>${escapeHtml(item.title)}</p>
                                            <span>${item.quantity} × ${formatCurrency(item.price)}</span>
                                        </div>
                                        <button type="button" data-mini-remove="${item.id}" aria-label="Remove">×</button>
                                    </li>
                                `
                                    )
                                    .join("")}
                            </ul>
                            <div class="mini-cart-foot">
                                <strong>Total: ${formatCurrency(totals.total)}</strong>
                                <div class="mini-cart-actions">
                                    <a href="cart.html" class="btn btn-outline btn-sm">View Cart</a>
                                    <a href="checkout.html" class="btn btn-primary btn-sm">Checkout</a>
                                </div>
                            </div>
                        `
                        }
                    </div>
                </div>

                <a href="dashboard.html" class="${activePage === "dashboard" ? "active" : ""}">Dashboard</a>
                <span class="nav-user">${escapeHtml(session?.name || "User")}</span>
                <button type="button" class="btn btn-ghost" id="logoutBtn">Logout</button>
            </div>
        </div>
    `;

    document.getElementById("logoutBtn")?.addEventListener("click", logoutUser);
    document.getElementById("navToggle")?.addEventListener("click", () => {
        document.getElementById("navLinks")?.classList.toggle("open");
    });

    document.getElementById("themeToggle")?.addEventListener("click", () => {
        toggleTheme();
        renderNavbar(activePage);
    });

    nav.querySelectorAll("[data-currency]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const next = btn.dataset.currency;
            if (next === getCurrency()) return;
            setCurrency(next);
            renderNavbar(activePage);
        });
    });

    const miniBtn = document.getElementById("miniCartBtn");
    const miniDrop = document.getElementById("miniCartDropdown");
    miniBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        miniDrop?.classList.toggle("hidden");
    });

    miniDrop?.addEventListener("click", (e) => {
        const removeBtn = e.target.closest("[data-mini-remove]");
        if (!removeBtn) return;
        removeFromCart(Number(removeBtn.dataset.miniRemove));
        renderNavbar(activePage);
        window.dispatchEvent(new CustomEvent("cartchange"));
        showToast("Item removed");
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".mini-cart-wrap")) {
            miniDrop?.classList.add("hidden");
        }
    });
}

export function renderFooter() {
    let footer = document.getElementById("siteFooter");
    if (!footer) {
        footer = document.createElement("footer");
        footer.id = "siteFooter";
        footer.className = "site-footer";
        document.body.appendChild(footer);
    }

    footer.innerHTML = `
        <div class="footer-inner">
            <div>
                <strong>ShopEase</strong>
                <p>Simple shopping demo built with HTML, CSS & JavaScript.</p>
            </div>
            <div class="footer-links">
                <a href="shop.html">Shop</a>
                <a href="wishlist.html">Wishlist</a>
                <a href="cart.html">Cart</a>
                <a href="dashboard.html">Dashboard</a>
            </div>
            <p class="footer-copy">© ${new Date().getFullYear()} ShopEase. All rights reserved.</p>
        </div>
    `;
}

export function onCurrencyChange(callback) {
    window.addEventListener("currencychange", callback);
}

export function onCartChange(callback) {
    window.addEventListener("cartchange", callback);
}

export function showLoading(container, message = "Loading...") {
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
            <div class="skeleton skeleton-line"></div>
        </div>
    `
        )
        .join("");
}

export function showEmptyState(container, { title, text, actionHref, actionLabel }) {
    if (!container) return;
    container.innerHTML = `
        <div class="state-box empty-state">
            <div class="empty-icon">🛒</div>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(text)}</p>
            ${
                actionHref
                    ? `<a href="${escapeHtml(actionHref)}" class="btn btn-primary">${escapeHtml(actionLabel || "Continue")}</a>`
                    : ""
            }
        </div>
    `;
}

export function showError(container, message, retryCallback) {
    if (!container) return;
    container.innerHTML = `
        <div class="state-box state-error">
            <p>${escapeHtml(message)}</p>
            ${retryCallback ? '<button type="button" class="btn btn-primary" id="retryBtn">Try Again</button>' : ""}
        </div>
    `;
    if (retryCallback) {
        document.getElementById("retryBtn")?.addEventListener("click", retryCallback);
    }
}

export function showToast(message, type = "success") {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `toast show toast-${type}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}

export function createProductCard(product, { wishlisted = false } = {}) {
    const rating = product.rating?.rate ?? 0;
    const count = product.rating?.count ?? 0;
    const stock = getStock(product.id);
    const out = stock <= 0;

    return `
        <article class="product-card ${out ? "out-of-stock" : ""}" data-id="${product.id}">
            <a href="product.html?id=${product.id}" class="product-image">
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}" loading="lazy">
                ${out ? '<span class="stock-badge">Out of Stock</span>' : ""}
            </a>
            <div class="product-body">
                <p class="product-category">${escapeHtml(product.category)}</p>
                <h3 class="product-title">
                    <a href="product.html?id=${product.id}">${escapeHtml(product.title)}</a>
                </h3>
                <div class="product-meta">
                    <span class="price">${formatCurrency(product.price)}</span>
                    <span class="rating">★ ${rating} (${count})</span>
                </div>
                <p class="stock-text">${out ? "Currently unavailable" : `${stock} in stock`}</p>
                <div class="product-actions">
                    <button type="button" class="btn btn-primary btn-sm" data-action="add-cart" data-id="${product.id}" ${out ? "disabled" : ""}>
                        ${out ? "Sold Out" : "Add to Cart"}
                    </button>
                    <button type="button" class="btn btn-outline btn-sm ${wishlisted ? "active" : ""}" data-action="toggle-wish" data-id="${product.id}">
                        ${wishlisted ? "♥ Saved" : "♡ Wish"}
                    </button>
                </div>
            </div>
        </article>
    `;
}
