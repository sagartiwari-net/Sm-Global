import { API_BASE } from "./utils.js";

export async function fetchProducts() {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) {
        throw new Error("Failed to load products. Please try again.");
    }
    return response.json();
}

export async function fetchProductById(id) {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) {
        throw new Error("Product not found.");
    }
    return response.json();
}

export async function fetchCategories() {
    const response = await fetch(`${API_BASE}/products/categories`);
    if (!response.ok) {
        throw new Error("Failed to load categories.");
    }
    return response.json();
}
