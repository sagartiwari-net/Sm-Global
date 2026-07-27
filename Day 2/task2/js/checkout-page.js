import { requireAuth, getSession } from "./auth.js";
import { getCart, getCartTotals } from "./cart.js";
import { placeOrder } from "./orders.js";
import { renderNavbar, renderFooter, showToast, onCurrencyChange } from "./ui.js";
import {
    escapeHtml,
    formatCurrency,
    isValidEmail,
    setAppliedCoupon,
    clearCoupon,
    getAppliedCoupon,
} from "./utils.js";

if (!requireAuth()) throw new Error("Auth required");

renderNavbar("cart");
renderFooter();

const container = document.getElementById("checkoutContent");

function getBillingDraft() {
    const fullNameEl = document.getElementById("fullName");
    if (fullNameEl) {
        return {
            fullName: fullNameEl.value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            zip: document.getElementById("zip").value,
        };
    }

    const session = getSession();
    return {
        fullName: session?.name || "",
        email: session?.email || "",
        phone: "",
        address: "",
        city: "",
        zip: "",
    };
}

function renderCheckoutPage() {
    const cart = getCart();

    if (!cart.length) {
        container.innerHTML = `
            <div class="state-box">
                <p>Your cart is empty. Add products before checkout.</p>
                <a href="shop.html" class="btn btn-primary">Go to Shop</a>
            </div>
        `;
        renderNavbar("cart");
        return;
    }

    renderCheckout();
}

function renderCheckout() {
    const cart = getCart();
    const totals = getCartTotals(cart);
    const draft = getBillingDraft();
    const applied = getAppliedCoupon();

    container.innerHTML = `
        <div class="checkout-layout">
            <form id="billingForm" class="card" novalidate>
                <h2>Billing Details</h2>

                <div class="form-row">
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" placeholder="Your full name" value="${escapeHtml(draft.fullName)}">
                        <span class="error-msg" id="fullNameError"></span>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" placeholder="you@email.com" value="${escapeHtml(draft.email)}">
                        <span class="error-msg" id="emailError"></span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="tel" id="phone" placeholder="10-digit phone number" value="${escapeHtml(draft.phone)}">
                    <span class="error-msg" id="phoneError"></span>
                </div>

                <div class="form-group">
                    <label for="address">Address</label>
                    <input type="text" id="address" placeholder="Street address" value="${escapeHtml(draft.address)}">
                    <span class="error-msg" id="addressError"></span>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="city">City</label>
                        <input type="text" id="city" placeholder="City" value="${escapeHtml(draft.city)}">
                        <span class="error-msg" id="cityError"></span>
                    </div>
                    <div class="form-group">
                        <label for="zip">ZIP / Postal Code</label>
                        <input type="text" id="zip" placeholder="ZIP code" value="${escapeHtml(draft.zip)}">
                        <span class="error-msg" id="zipError"></span>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block">Place Order</button>
            </form>

            <aside class="card summary-card">
                <h2>Order Summary</h2>
                <ul class="summary-items">
                    ${cart
                        .map(
                            (item) => `
                        <li>
                            <span>${escapeHtml(item.title)} × ${item.quantity}</span>
                            <strong>${formatCurrency(item.price * item.quantity)}</strong>
                        </li>
                    `
                        )
                        .join("")}
                </ul>
                <div class="coupon-box">
                    <label for="couponCode">Coupon code</label>
                    <div class="coupon-row">
                        <input type="text" id="couponCode" placeholder="e.g. SAVE10" value="${escapeHtml(applied?.code || "")}">
                        <button type="button" class="btn btn-outline btn-sm" id="applyCouponBtn">Apply</button>
                    </div>
                    ${
                        applied
                            ? `<p class="coupon-applied muted">Applied: ${escapeHtml(applied.label)} <button type="button" class="btn btn-ghost btn-sm" id="clearCouponBtn">Remove</button></p>`
                            : ""
                    }
                </div>
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
            </aside>
        </div>
    `;

    bindCheckoutEvents();
    renderNavbar("cart");
}

function bindCheckoutEvents() {
    document.getElementById("billingForm")?.addEventListener("submit", handlePlaceOrder);

    document.getElementById("applyCouponBtn")?.addEventListener("click", () => {
        const code = document.getElementById("couponCode").value.trim();
        if (!code) {
            showToast("Enter a coupon code", "error");
            return;
        }

        const coupon = setAppliedCoupon(code);
        if (!coupon) {
            showToast("Invalid coupon code", "error");
            return;
        }

        showToast(`Coupon applied: ${coupon.label}`);
        renderCheckout();
    });

    document.getElementById("clearCouponBtn")?.addEventListener("click", () => {
        clearCoupon();
        showToast("Coupon removed");
        renderCheckout();
    });
}

function setError(id, message) {
    document.getElementById(id + "Error").textContent = message;
    document.getElementById(id).classList.toggle("input-error", Boolean(message));
}

function clearErrors() {
    ["fullName", "email", "phone", "address", "city", "zip"].forEach((id) => setError(id, ""));
}

function validateBilling(data) {
    clearErrors();
    let valid = true;

    if (!data.fullName) {
        setError("fullName", "Full name is required.");
        valid = false;
    }
    if (!data.email) {
        setError("email", "Email is required.");
        valid = false;
    } else if (!isValidEmail(data.email)) {
        setError("email", "Enter a valid email.");
        valid = false;
    }
    if (!data.phone) {
        setError("phone", "Phone is required.");
        valid = false;
    } else if (!/^\d{10}$/.test(data.phone)) {
        setError("phone", "Enter a valid 10-digit phone.");
        valid = false;
    }
    if (!data.address) {
        setError("address", "Address is required.");
        valid = false;
    }
    if (!data.city) {
        setError("city", "City is required.");
        valid = false;
    }
    if (!data.zip) {
        setError("zip", "ZIP code is required.");
        valid = false;
    }

    return valid;
}

function handlePlaceOrder(e) {
    e.preventDefault();

    const billing = {
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        zip: document.getElementById("zip").value.trim(),
    };

    if (!validateBilling(billing)) return;

    const result = placeOrder(billing);
    if (!result.ok) {
        showToast(result.message, "error");
        return;
    }

    container.innerHTML = `
        <div class="state-box success-box">
            <h2>Order Placed Successfully!</h2>
            <p>Your Order ID is</p>
            <p class="order-id">${escapeHtml(result.order.id)}</p>
            <p>Total paid: <strong>${formatCurrency(result.order.totals.total)}</strong></p>
            <div class="success-actions">
                <a href="dashboard.html" class="btn btn-primary">View Orders</a>
                <a href="shop.html" class="btn btn-outline">Continue Shopping</a>
            </div>
        </div>
    `;

    renderNavbar("cart");
    showToast("Order placed!");
}

renderCheckoutPage();
onCurrencyChange(() => {
    if (getCart().length) renderCheckout();
});
