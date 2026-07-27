import { STORAGE_KEYS, getItem, setItem, generateId, clearCoupon, getAppliedCoupon } from "./utils.js";
import { getSession } from "./auth.js";
import { getCart, getCartTotals, clearCart } from "./cart.js";

function ordersKey() {
    const session = getSession();
    return session ? `${STORAGE_KEYS.orders}_${session.id}` : STORAGE_KEYS.orders;
}

export function getOrders() {
    return getItem(ordersKey(), []);
}

export function saveOrders(orders) {
    setItem(ordersKey(), orders);
}

export function placeOrder(billing) {
    const session = getSession();
    const cart = getCart();

    if (!cart.length) {
        return { ok: false, message: "Your cart is empty." };
    }

    const coupon = getAppliedCoupon();
    const totals = getCartTotals(cart, coupon);
    const order = {
        id: generateId("ORD"),
        userId: session?.id,
        createdAt: new Date().toISOString(),
        billing,
        items: cart,
        totals,
        coupon,
        status: "Confirmed",
    };

    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    clearCart();
    clearCoupon();

    return { ok: true, order };
}

export function getOrderStats() {
    const orders = getOrders();
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0);
    return { totalOrders, totalSpent, orders };
}
