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
        window.location.href = "shop.html";
        return true;
    }
    return false;
}

export function registerUser({ name, email, password }) {
    const users = getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
        return { ok: false, message: "Email already registered. Please login." };
    }

    const user = {
        id: `USR-${Date.now().toString(36)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        createdAt: new Date().toISOString(),
    };

    users.push(user);
    saveUsers(users);
    setSession(user);
    return { ok: true, user };
}

export function loginUser({ email, password }) {
    const users = getUsers();
    const user = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!user) {
        return { ok: false, message: "Invalid email or password." };
    }

    setSession(user);
    return { ok: true, user };
}

export function logoutUser() {
    clearSession();
    window.location.href = "index.html";
}

export function updateProfile({ name, email }) {
    const session = getSession();
    if (!session) return { ok: false, message: "Not logged in." };

    const users = getUsers();
    const index = users.findIndex((u) => u.id === session.id);
    if (index === -1) return { ok: false, message: "User not found." };

    const emailTaken = users.some(
        (u) => u.id !== session.id && u.email.toLowerCase() === email.toLowerCase()
    );
    if (emailTaken) {
        return { ok: false, message: "Email already in use." };
    }

    users[index] = {
        ...users[index],
        name: name.trim(),
        email: email.trim().toLowerCase(),
    };

    saveUsers(users);
    setSession(users[index]);
    return { ok: true, user: users[index] };
}

export function changePassword({ currentPassword, newPassword }) {
    const session = getSession();
    if (!session) return { ok: false, message: "Not logged in." };

    const users = getUsers();
    const index = users.findIndex((u) => u.id === session.id);
    if (index === -1) return { ok: false, message: "User not found." };

    if (users[index].password !== currentPassword) {
        return { ok: false, message: "Current password is incorrect." };
    }
    if (!newPassword || newPassword.length < 6) {
        return { ok: false, message: "New password must be at least 6 characters." };
    }

    users[index].password = newPassword;
    saveUsers(users);
    return { ok: true };
}
