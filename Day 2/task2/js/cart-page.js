import { requireAuth } from "./auth.js";
import { getCart, updateCartQuantity, removeFromCart, clearCart, getCartTotals } from "./cart.js";
import { renderNavbar, renderFooter, showEmptyState, showToast, onCurrencyChange, onCartChange } from "./ui.js";
import { escapeHtml, formatCurrency, getStock } from "./utils.js";

if (!requireAuth()) throw new Error("Auth required");

renderNavbar("cart");
renderFooter();

const cartContainer = document.getElementById("cartContent");

function renderCart() {
    const cart = getCart();
    const totals = getCartTotals(cart);

    if (!cart.length) {
        showEmptyState(cartContainer, {
            title: "Your cart is empty",
            text: "Browse our shop and add items you would like to purchase.",
            actionHref: "shop.html",
            actionLabel: "Continue Shopping",
        });
        renderNavbar("cart");
        return;
    }

    cartContainer.innerHTML = `
        <div class="cart-layout">
            <div class="card">
                <div class="table-wrap">
                    <table class="cart-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cart
                                .map((item) => {
                                    const stock = item.stock ?? getStock(item.id);
                                    const atMax = item.quantity >= stock;

                                    return `
                                <tr>
                                    <td class="cart-product">
                                        <img src="${escapeHtml(item.image)}" alt="">
                                        <div>
                                            <span>${escapeHtml(item.title)}</span>
                                            ${
                                                stock != null
                                                    ? `<p class="stock-text">${stock <= 0 ? "Out of stock" : `${stock} in stock`}</p>`
                                                    : ""
                                            }
                                        </div>
                                    </td>
                                    <td>${formatCurrency(item.price)}</td>
                                    <td>
                                        <div class="qty-controls">
                                            <button type="button" data-action="dec" data-id="${item.id}">−</button>
                                            <span>${item.quantity}</span>
                                            <button type="button" data-action="inc" data-id="${item.id}" ${atMax ? "disabled" : ""}>+</button>
                                        </div>
                                    </td>
                                    <td>${formatCurrency(item.price * item.quantity)}</td>
                                    <td>
                                        <button type="button" class="btn btn-danger btn-sm" data-action="remove" data-id="${item.id}">Remove</button>
                                    </td>
                                </tr>
                            `;
                                })
                                .join("")}
                        </tbody>
                    </table>
                </div>
                <div class="cart-actions">
                    <button type="button" class="btn btn-ghost" id="clearCartBtn">Clear Cart</button>
                    <a href="shop.html" class="btn btn-outline">Continue Shopping</a>
                </div>
            </div>

            <aside class="card summary-card">
                <h2>Order Summary</h2>
                <div class="summary-row">
                    <span>Subtotal</span>
                    <strong>${formatCurrency(totals.subtotal)}</strong>
                </div>
                ${
                    totals.discount > 0
                        ? `
                <div class="summary-row">
                    <span>Discount${totals.coupon ? ` (${escapeHtml(totals.coupon.label)})` : ""}</span>
                    <strong>−${formatCurrency(totals.discount)}</strong>
                </div>
                `
                        : ""
                }
                <div class="summary-row">
                    <span>Tax (8%)</span>
                    <strong>${formatCurrency(totals.tax)}</strong>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <strong>${formatCurrency(totals.total)}</strong>
                </div>
                <a href="checkout.html" class="btn btn-primary btn-block">Proceed to Checkout</a>
            </aside>
        </div>
    `;

    document.getElementById("clearCartBtn")?.addEventListener("click", () => {
        if (confirm("Clear all items from cart?")) {
            clearCart();
            showToast("Cart cleared");
            renderCart();
        }
    });

    renderNavbar("cart");
}

cartContainer.addEventListener("click", (e) => {
    const button = e.target.closest("[data-action]");
    if (!button || button.disabled) return;

    const id = Number(button.dataset.id);
    const cart = getCart();
    const item = cart.find((i) => i.id === id);

    if (button.dataset.action === "inc" && item) {
        const stock = item.stock ?? getStock(item.id);
        if (item.quantity >= stock) return;

        const result = updateCartQuantity(id, item.quantity + 1);
        if (!result.ok) {
            showToast(result.message, "error");
            return;
        }
        renderCart();
    }

    if (button.dataset.action === "dec" && item) {
        const result = updateCartQuantity(id, item.quantity - 1);
        if (!result.ok) {
            showToast(result.message, "error");
            return;
        }
        renderCart();
    }

    if (button.dataset.action === "remove") {
        removeFromCart(id);
        showToast("Item removed");
        renderCart();
    }
});

renderCart();
onCurrencyChange(renderCart);
onCartChange(renderCart);
