export const STORAGE_KEYS = {
    users: "ecom_users",
    session: "ecom_session",
    cart: "ecom_cart",
    wishlist: "ecom_wishlist",
    orders: "ecom_orders",
    currency: "ecom_currency",
    comments: "ecom_comments",
    theme: "ecom_theme",
    recent: "ecom_recent",
    coupon: "ecom_coupon",
};

export const API_BASE = "https://fakestoreapi.com";
export const TAX_RATE = 0.08;
export const USD_TO_INR = 83;
export const COUPONS = {
    SAVE10: { code: "SAVE10", percent: 10, label: "10% off" },
};

export function getItem(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

export function setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key) {
    localStorage.removeItem(key);
}

export function generateId(prefix = "ID") {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
}

export function getCurrency() {
    const saved = getItem(STORAGE_KEYS.currency, "INR");
    return saved === "USD" ? "USD" : "INR";
}

export function setCurrency(currency) {
    const next = currency === "USD" ? "USD" : "INR";
    setItem(STORAGE_KEYS.currency, next);
    window.dispatchEvent(new CustomEvent("currencychange", { detail: next }));
}

export function toINR(usdAmount) {
    return Number(usdAmount) * USD_TO_INR;
}

export function formatCurrency(usdAmount) {
    const amount = Number(usdAmount) || 0;

    if (getCurrency() === "USD") {
        return `$${amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }

    const inr = toINR(amount);
    return `₹${inr.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}

export function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = String(text ?? "");
    return div.innerHTML;
}

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Simulated stock from product id (API has no stock field) */
export function getStock(productId) {
    const id = Number(productId);
    if (id % 13 === 0) return 0;
    return ((id * 7) % 12) + 2;
}

export function getTheme() {
    return getItem(STORAGE_KEYS.theme, "light") === "dark" ? "dark" : "light";
}

export function applyTheme(theme = getTheme()) {
    const next = theme === "dark" ? "dark" : "light";
    document.body.classList.toggle("dark-mode", next === "dark");
    setItem(STORAGE_KEYS.theme, next);
    return next;
}

export function toggleTheme() {
    return applyTheme(getTheme() === "dark" ? "light" : "dark");
}

export function addRecentlyViewed(product) {
    if (!product?.id) return;
    let list = getItem(STORAGE_KEYS.recent, []);
    list = list.filter((p) => p.id !== product.id);
    list.unshift({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
    });
    setItem(STORAGE_KEYS.recent, list.slice(0, 6));
}

export function getRecentlyViewed(excludeId = null) {
    const list = getItem(STORAGE_KEYS.recent, []);
    if (excludeId == null) return list;
    return list.filter((p) => p.id !== Number(excludeId) && p.id !== excludeId);
}

export function getAppliedCoupon() {
    return getItem(STORAGE_KEYS.coupon, null);
}

export function setAppliedCoupon(code) {
    if (!code) {
        removeItem(STORAGE_KEYS.coupon);
        return null;
    }
    const key = String(code).trim().toUpperCase();
    const coupon = COUPONS[key] || null;
    if (coupon) setItem(STORAGE_KEYS.coupon, coupon);
    return coupon;
}

export function clearCoupon() {
    removeItem(STORAGE_KEYS.coupon);
}
