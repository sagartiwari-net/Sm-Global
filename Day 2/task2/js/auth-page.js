import { redirectIfLoggedIn, loginUser, registerUser } from "./auth.js";
import { isValidEmail, applyTheme, getTheme } from "./utils.js";

applyTheme(getTheme());
redirectIfLoggedIn();

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authMessage = document.getElementById("authMessage");

function showMessage(text, type = "error") {
    authMessage.textContent = text;
    authMessage.className = `auth-message show ${type}`;
}

function clearMessage() {
    authMessage.textContent = "";
    authMessage.className = "auth-message";
}

function switchTab(tab) {
    clearMessage();
    const isLogin = tab === "login";
    loginTab.classList.toggle("active", isLogin);
    registerTab.classList.toggle("active", !isLogin);
    loginForm.classList.toggle("hidden", !isLogin);
    registerForm.classList.toggle("hidden", isLogin);
}

loginTab.addEventListener("click", () => switchTab("login"));
registerTab.addEventListener("click", () => switchTab("register"));

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearMessage();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        showMessage("Please fill in all fields.");
        return;
    }
    if (!isValidEmail(email)) {
        showMessage("Please enter a valid email.");
        return;
    }

    const result = loginUser({ email, password });
    if (!result.ok) {
        showMessage(result.message);
        return;
    }

    window.location.href = "shop.html";
});

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearMessage();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirm").value;

    if (!name || !email || !password || !confirm) {
        showMessage("Please fill in all fields.");
        return;
    }
    if (!isValidEmail(email)) {
        showMessage("Please enter a valid email.");
        return;
    }
    if (password.length < 6) {
        showMessage("Password must be at least 6 characters.");
        return;
    }
    if (password !== confirm) {
        showMessage("Passwords do not match.");
        return;
    }

    const result = registerUser({ name, email, password });
    if (!result.ok) {
        showMessage(result.message);
        return;
    }

    window.location.href = "shop.html";
});
