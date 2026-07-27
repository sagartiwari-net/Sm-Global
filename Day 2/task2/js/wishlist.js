import { STORAGE_KEYS, getItem, setItem } from "./utils.js";
import { getSession } from "./auth.js";

function wishlistKey() {
    const session = getSession();
    return session ? `${STORAGE_KEYS.wishlist}_${session.id}` : STORAGE_KEYS.wishlist;
}

export function getWishlist() {
    return getItem(wishlistKey(), []);
}

export function saveWishlist(list) {
    setItem(wishlistKey(), list);
}

export function isInWishlist(productId) {
    return getWishlist().some((item) => item.id === productId);
}

export function toggleWishlist(product) {
    let list = getWishlist();
    const exists = list.some((item) => item.id === product.id);

    if (exists) {
        list = list.filter((item) => item.id !== product.id);
    } else {
        list.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            rating: product.rating,
        });
    }

    saveWishlist(list);
    return { list, added: !exists };
}

export function removeFromWishlist(productId) {
    const list = getWishlist().filter((item) => item.id !== productId);
    saveWishlist(list);
    return list;
}

export function getWishlistCount() {
    return getWishlist().length;
}
