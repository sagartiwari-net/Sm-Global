import { loginUser, registerUser, redirectIfLoggedIn } from "./auth.js";
import { isValidEmail, applyTheme, getTheme } from "./utils.js";

if (redirectIfLoggedIn()) {
    // redirected
} else {
    applyTheme(getTheme());

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const loginError = document.getElementById("loginError");
    const registerError = document.getElementById("registerError");
    const tabs = document.querySelectorAll(".auth-tab");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            const isLogin = tab.dataset.tab === "login";
            loginForm.classList.toggle("hidden", !isLogin);
            registerForm.classList.toggle("hidden", isLogin);
            loginError.classList.add("hidden");
            registerError.classList.add("hidden");
        });
    });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        loginError.classList.add("hidden");

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const result = loginUser({ email, password });
        if (!result.ok) {
            loginError.textContent = result.message;
            loginError.classList.remove("hidden");
            return;
        }
        window.location.href = "dashboard.html";
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        registerError.classList.add("hidden");

        const name = document.getElementById("regName").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;

        if (!name.trim()) {
            registerError.textContent = "Name is required.";
            registerError.classList.remove("hidden");
            return;
        }
        if (!isValidEmail(email)) {
            registerError.textContent = "Enter a valid email.";
            registerError.classList.remove("hidden");
            return;
        }
        if (password.length < 4) {
            registerError.textContent = "Password must be at least 4 characters.";
            registerError.classList.remove("hidden");
            return;
        }

        const result = registerUser({ name, email, password });
        if (!result.ok) {
            registerError.textContent = result.message;
            registerError.classList.remove("hidden");
            return;
        }
        window.location.href = "dashboard.html";
    });
}
