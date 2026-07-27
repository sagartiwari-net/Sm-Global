import { STORAGE_KEYS, getItem, setItem, removeItem } from "./utils.js";

export function getUsers() {
    return getItem(STORAGE_KEYS.users, []);
}

export function saveUsers(users) {
    setItem(STORAGE_KEYS.users, users);
}

export function getSession() {
    return getItem(STORAGE_KEYS.session, null);
}

export function setSession(user) {
    setItem(STORAGE_KEYS.session, {
        id: user.id,
        name: user.name,
        email: user.email,
    });
}

export function clearSession() {
    removeItem(STORAGE_KEYS.session);
}

export function isLoggedIn() {
    return Boolean(getSession());
}

export function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = "index.html";
        return false;
    }
    return true;
}

export function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        window.location.href = "dashboard.html";
        return true;
    }
    return false;
}

export function registerUser({ name, email, password }) {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, message: "Email already registered." };
    }

    const user = {
        id: `USR-${Date.now().toString(36)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
    };

    users.push(user);
    saveUsers(users);
    setSession(user);
    return { ok: true, user };
}

export function loginUser({ email, password }) {
    const user = getUsers().find(
        (u) => u.email === email.trim().toLowerCase() && u.password === password
    );
    if (!user) return { ok: false, message: "Invalid email or password." };
    setSession(user);
    return { ok: true, user };
}

export function logoutUser() {
    clearSession();
    window.location.href = "index.html";
}
