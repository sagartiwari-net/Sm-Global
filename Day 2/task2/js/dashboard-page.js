import { requireAuth, getSession, updateProfile, changePassword } from "./auth.js";
import { getOrderStats } from "./orders.js";
import { renderNavbar, renderFooter, showToast, onCurrencyChange } from "./ui.js";
import { escapeHtml, formatCurrency, isValidEmail } from "./utils.js";

if (!requireAuth()) throw new Error("Auth required");

renderNavbar("dashboard");
renderFooter();

const container = document.getElementById("dashboardContent");

function renderDashboard() {
    const session = getSession();
    const { totalOrders, totalSpent, orders } = getOrderStats();

    container.innerHTML = `
        <div class="stats-row">
            <div class="stat-card">
                <span class="stat-label">Total Orders</span>
                <span class="stat-value">${totalOrders}</span>
            </div>
            <div class="stat-card stat-card--teal">
                <span class="stat-label">Total Spent</span>
                <span class="stat-value">${formatCurrency(totalSpent)}</span>
            </div>
        </div>

        <div class="dashboard-grid">
            <section class="card">
                <h2>Profile</h2>
                <form id="profileForm" novalidate>
                    <div class="form-group">
                        <label for="profileName">Full Name</label>
                        <input type="text" id="profileName" value="${escapeHtml(session.name)}">
                        <span class="error-msg" id="profileNameError"></span>
                    </div>
                    <div class="form-group">
                        <label for="profileEmail">Email</label>
                        <input type="email" id="profileEmail" value="${escapeHtml(session.email)}">
                        <span class="error-msg" id="profileEmailError"></span>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Profile</button>
                </form>

                <hr class="dash-divider">

                <h2>Change Password</h2>
                <form id="passwordForm" novalidate>
                    <div class="form-group">
                        <label for="currentPassword">Current Password</label>
                        <input type="password" id="currentPassword" autocomplete="current-password">
                        <span class="error-msg" id="currentPasswordError"></span>
                    </div>
                    <div class="form-group">
                        <label for="newPassword">New Password</label>
                        <input type="password" id="newPassword" autocomplete="new-password">
                        <span class="error-msg" id="newPasswordError"></span>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm New Password</label>
                        <input type="password" id="confirmPassword" autocomplete="new-password">
                        <span class="error-msg" id="confirmPasswordError"></span>
                    </div>
                    <button type="submit" class="btn btn-outline">Update Password</button>
                </form>
            </section>

            <section class="card">
                <h2>Order History</h2>
                ${
                    orders.length === 0
                        ? `<div class="empty-state compact">
                            <div class="empty-icon">📦</div>
                            <h3>No orders yet</h3>
                            <p>Your purchases will show up here.</p>
                            <a href="shop.html" class="btn btn-primary">Start Shopping</a>
                           </div>`
                        : `
                    <div class="orders-list">
                        ${orders
                            .map(
                                (order, index) => `
                            <article class="order-card" data-order-index="${index}">
                                <button type="button" class="order-head order-toggle" data-toggle-order="${index}">
                                    <div>
                                        <strong>${escapeHtml(order.id)}</strong>
                                        <p class="muted">${new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div class="order-head-right">
                                        <span class="status-pill">${escapeHtml(order.status)}</span>
                                        <span class="order-chevron">▾</span>
                                    </div>
                                </button>
                                <div class="order-detail ${index === 0 ? "open" : ""}" id="orderDetail-${index}">
                                    <div class="order-billing muted">
                                        <p><strong>Ship to:</strong> ${escapeHtml(order.billing?.fullName || "-")}</p>
                                        <p>${escapeHtml(order.billing?.address || "")}, ${escapeHtml(order.billing?.city || "")} ${escapeHtml(order.billing?.zip || "")}</p>
                                        <p>${escapeHtml(order.billing?.phone || "")} · ${escapeHtml(order.billing?.email || "")}</p>
                                        ${order.coupon ? `<p><strong>Coupon:</strong> ${escapeHtml(order.coupon.code)} (${order.coupon.percent}% off)</p>` : ""}
                                    </div>
                                    <div class="order-items">
                                        ${order.items
                                            .map(
                                                (item) => `
                                            <div class="order-item">
                                                <span>${escapeHtml(item.title)} × ${item.quantity}</span>
                                                <span>${formatCurrency(item.price * item.quantity)}</span>
                                            </div>
                                        `
                                            )
                                            .join("")}
                                    </div>
                                    <div class="order-totals-mini">
                                        <div><span>Subtotal</span><span>${formatCurrency(order.totals.subtotal)}</span></div>
                                        ${
                                            order.totals.discount
                                                ? `<div><span>Discount</span><span>-${formatCurrency(order.totals.discount)}</span></div>`
                                                : ""
                                        }
                                        <div><span>Tax</span><span>${formatCurrency(order.totals.tax)}</span></div>
                                    </div>
                                    <div class="order-foot">
                                        <span>Total</span>
                                        <strong>${formatCurrency(order.totals.total)}</strong>
                                    </div>
                                </div>
                            </article>
                        `
                            )
                            .join("")}
                    </div>
                `
                }
            </section>
        </div>
    `;

    document.getElementById("profileForm").addEventListener("submit", handleProfileSave);
    document.getElementById("passwordForm").addEventListener("submit", handlePasswordSave);

    container.querySelectorAll("[data-toggle-order]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const idx = btn.dataset.toggleOrder;
            const detail = document.getElementById(`orderDetail-${idx}`);
            detail?.classList.toggle("open");
            btn.querySelector(".order-chevron")?.classList.toggle("open");
        });
    });
}

function handleProfileSave(e) {
    e.preventDefault();

    const name = document.getElementById("profileName").value.trim();
    const email = document.getElementById("profileEmail").value.trim();

    document.getElementById("profileNameError").textContent = "";
    document.getElementById("profileEmailError").textContent = "";

    let valid = true;
    if (!name) {
        document.getElementById("profileNameError").textContent = "Name is required.";
        valid = false;
    }
    if (!email) {
        document.getElementById("profileEmailError").textContent = "Email is required.";
        valid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById("profileEmailError").textContent = "Enter a valid email.";
        valid = false;
    }
    if (!valid) return;

    const result = updateProfile({ name, email });
    if (!result.ok) {
        document.getElementById("profileEmailError").textContent = result.message;
        return;
    }

    showToast("Profile updated");
    renderNavbar("dashboard");
    renderDashboard();
}

function handlePasswordSave(e) {
    e.preventDefault();
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    ["currentPassword", "newPassword", "confirmPassword"].forEach((id) => {
        document.getElementById(id + "Error").textContent = "";
    });

    let valid = true;
    if (!currentPassword) {
        document.getElementById("currentPasswordError").textContent = "Required.";
        valid = false;
    }
    if (!newPassword || newPassword.length < 6) {
        document.getElementById("newPasswordError").textContent = "Min 6 characters.";
        valid = false;
    }
    if (newPassword !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
        valid = false;
    }
    if (!valid) return;

    const result = changePassword({ currentPassword, newPassword });
    if (!result.ok) {
        document.getElementById("currentPasswordError").textContent = result.message;
        return;
    }

    document.getElementById("passwordForm").reset();
    showToast("Password updated");
}

renderDashboard();
onCurrencyChange(renderDashboard);
