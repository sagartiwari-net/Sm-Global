import { requireAuth } from "./auth.js";
import { fetchProducts, fetchCategories } from "./api.js";
import { addToCart } from "./cart.js";
import { toggleWishlist, isInWishlist } from "./wishlist.js";
import {
    renderNavbar,
    renderFooter,
    showSkeletonGrid,
    showError,
    showToast,
    createProductCard,
    onCurrencyChange,
} from "./ui.js";
import { getRecentlyViewed, formatCurrency, escapeHtml } from "./utils.js";

if (!requireAuth()) throw new Error("Auth required");

renderNavbar("shop");
renderFooter();

const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const categoryList = document.getElementById("categoryList");
const sortSelect = document.getElementById("sortSelect");
const resultsCount = document.getElementById("resultsCount");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");
const filterToggle = document.getElementById("filterToggle");
const filterSidebar = document.getElementById("filterSidebar");
const filterOverlay = document.getElementById("filterOverlay");
const recentSection = document.getElementById("recentSection");
const recentGrid = document.getElementById("recentGrid");

let allProducts = [];

async function loadShop() {
    showSkeletonGrid(productsGrid, 8);
    resultsCount.textContent = "Loading products...";

    try {
        const [products, categories] = await Promise.all([
            fetchProducts(),
            fetchCategories(),
        ]);

        allProducts = products;
        populateCategories(categories);
        renderProducts();
        renderRecent();
    } catch (error) {
        showError(productsGrid, error.message || "Something went wrong.", loadShop);
        resultsCount.textContent = "Failed to load products";
    }
}

function populateCategories(categories) {
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categoryList.innerHTML =
        '<button type="button" class="category-btn active" data-category="">All Categories</button>';

    categories.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "category-btn";
        button.dataset.category = cat;
        button.textContent = cat;
        categoryList.appendChild(button);
    });
}

function setActiveCategory(category) {
    categoryFilter.value = category;
    categoryList.querySelectorAll(".category-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.category === category);
    });
}

function getFilteredProducts() {
    const search = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const sort = sortSelect.value;

    let list = [...allProducts];

    if (search) {
        list = list.filter(
            (p) =>
                p.title.toLowerCase().includes(search) ||
                p.category.toLowerCase().includes(search)
        );
    }

    if (category) {
        list = list.filter((p) => p.category === category);
    }

    switch (sort) {
        case "price-asc":
            list.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            list.sort((a, b) => b.price - a.price);
            break;
        case "rating-desc":
            list.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
            break;
        case "rating-asc":
            list.sort((a, b) => (a.rating?.rate || 0) - (b.rating?.rate || 0));
            break;
        default:
            break;
    }

    return list;
}

function renderProducts() {
    const list = getFilteredProducts();
    resultsCount.textContent = `${list.length} product${list.length === 1 ? "" : "s"} found`;

    if (!list.length) {
        productsGrid.innerHTML = `
            <div class="state-box empty-state">
                <div class="empty-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try another search or clear your filters.</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = list
        .map((product) => createProductCard(product, { wishlisted: isInWishlist(product.id) }))
        .join("");
}

function renderRecent() {
    const recent = getRecentlyViewed();
    if (!recent.length || !recentSection || !recentGrid) return;

    recentSection.classList.remove("hidden");
    recentGrid.innerHTML = recent
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
        .join("");
}

function clearFilters() {
    searchInput.value = "";
    sortSelect.value = "default";
    setActiveCategory("");
    renderProducts();
}

function openFilters() {
    filterSidebar.classList.add("open");
    filterOverlay.classList.remove("hidden");
}

function closeFilters() {
    filterSidebar.classList.remove("open");
    filterOverlay.classList.add("hidden");
}

productsGrid.addEventListener("click", (e) => {
    const button = e.target.closest("[data-action]");
    if (!button || button.disabled) return;

    const id = Number(button.dataset.id);
    const product = allProducts.find((p) => p.id === id);
    if (!product) return;

    if (button.dataset.action === "add-cart") {
        const result = addToCart(product, 1);
        if (!result.ok) {
            showToast(result.message, "error");
            return;
        }
        renderNavbar("shop");
        showToast("Added to cart");
    }

    if (button.dataset.action === "toggle-wish") {
        const { added } = toggleWishlist(product);
        renderNavbar("shop");
        renderProducts();
        showToast(added ? "Added to wishlist" : "Removed from wishlist");
    }
});

categoryList.addEventListener("click", (e) => {
    const button = e.target.closest(".category-btn");
    if (!button) return;
    setActiveCategory(button.dataset.category);
    renderProducts();
    closeFilters();
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
clearFiltersBtn.addEventListener("click", clearFilters);
filterToggle.addEventListener("click", openFilters);
filterOverlay.addEventListener("click", closeFilters);
onCurrencyChange(() => {
    renderProducts();
    renderRecent();
});

loadShop();
