import { STORAGE_KEYS, getItem, setItem, TAX_RATE, getAppliedCoupon, getStock } from "./utils.js";
import { getSession } from "./auth.js";

function cartKey() {
    const session = getSession();
    return session ? `${STORAGE_KEYS.cart}_${session.id}` : STORAGE_KEYS.cart;
}

export function getCart() {
    return getItem(cartKey(), []);
}

export function saveCart(cart) {
    setItem(cartKey(), cart);
}

export function addToCart(product, quantity = 1) {
    const stock = getStock(product.id);
    if (stock <= 0) {
        return { cart: getCart(), ok: false, message: "This product is out of stock." };
    }

    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);
    const currentQty = existing ? existing.quantity : 0;
    const nextQty = currentQty + quantity;

    if (nextQty > stock) {
        return {
            cart,
            ok: false,
            message: `Only ${stock} item(s) available in stock.`,
        };
    }

    if (existing) {
        existing.quantity = nextQty;
        existing.stock = stock;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity,
            stock,
        });
    }

    saveCart(cart);
    return { cart, ok: true };
}

export function updateCartQuantity(productId, quantity) {
    let cart = getCart();
    const item = cart.find((i) => i.id === productId);
    if (!item) return { cart, ok: false, message: "Item not found." };

    const stock = getStock(productId);

    if (quantity <= 0) {
        cart = cart.filter((i) => i.id !== productId);
        saveCart(cart);
        return { cart, ok: true };
    }

    if (quantity > stock) {
        return {
            cart,
            ok: false,
            message: `Only ${stock} item(s) available in stock.`,
        };
    }

    item.quantity = quantity;
    item.stock = stock;
    saveCart(cart);
    return { cart, ok: true };
}

export function removeFromCart(productId) {
    const cart = getCart().filter((i) => i.id !== productId);
    saveCart(cart);
    return cart;
}

export function clearCart() {
    saveCart([]);
    return [];
}

export function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartTotals(cart = getCart(), coupon = getAppliedCoupon()) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = coupon ? (subtotal * coupon.percent) / 100 : 0;
    const taxable = Math.max(0, subtotal - discount);
    const tax = taxable * TAX_RATE;
    const total = taxable + tax;

    return {
        subtotal,
        discount,
        tax,
        total,
        coupon,
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0),
    };
}
