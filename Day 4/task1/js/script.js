/* ============================================
   redBus Landing Page - Interactions
   Vanilla JS (Bootstrap 5 bundle already loaded)
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
    setupNavbarScroll();
    setupBackToTop();
    setupSearchForm();
    setupTrainForm();
    setupHotelForm();
    setupSwap();
    setupQuickDates();
    setupCopyCodes();
    setupNewsletter();
    setupStatsCounter();
    setupReveal();
    setMinDate();
});

/* Toast helper */
function showToast(message) {
    const toastEl = document.getElementById("appToast");
    const msgEl = document.getElementById("toastMsg");
    if (!toastEl || !msgEl) return;
    msgEl.textContent = message;
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2600 });
    toast.show();
}

/* Navbar background on scroll */
function setupNavbarScroll() {
    const nav = document.getElementById("mainNav");
    if (!nav) return;
    const onScroll = () => {
        nav.classList.toggle("scrolled", window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
}

/* Back to top button */
function setupBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;
    window.addEventListener(
        "scroll",
        () => btn.classList.toggle("show", window.scrollY > 400),
        { passive: true }
    );
    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* Set date inputs min to today */
function setMinDate() {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tmw = tomorrow.toISOString().split("T")[0];

    ["journeyDate", "trainDate", "hotelCheckin"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.min = today;
            el.value = today;
        }
    });
    const checkout = document.getElementById("hotelCheckout");
    if (checkout) {
        checkout.min = tmw;
        checkout.value = tmw;
    }
    // keep checkout after checkin
    const checkin = document.getElementById("hotelCheckin");
    checkin?.addEventListener("change", () => {
        const next = new Date(checkin.value);
        next.setDate(next.getDate() + 1);
        checkout.min = next.toISOString().split("T")[0];
        if (checkout.value <= checkin.value) checkout.value = checkout.min;
    });
}

/* Train search → results.html?mode=train */
function setupTrainForm() {
    const form = document.getElementById("trainSearchForm");
    if (!form) return;
    const swap = document.getElementById("trainSwapBtn");
    swap?.addEventListener("click", () => {
        const a = document.getElementById("trainFrom");
        const b = document.getElementById("trainTo");
        [a.value, b.value] = [b.value, a.value];
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const from = document.getElementById("trainFrom");
        const to = document.getElementById("trainTo");
        const date = document.getElementById("trainDate").value;

        if (from.value.trim() && to.value.trim() &&
            from.value.trim().toLowerCase() === to.value.trim().toLowerCase()) {
            to.setCustomValidity("Source and destination cannot be the same");
        } else {
            to.setCustomValidity("");
        }
        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }
        const params = new URLSearchParams({
            mode: "train", from: from.value.trim(), to: to.value.trim(), date,
        });
        showToast(`Searching trains: ${from.value} → ${to.value}...`);
        setTimeout(() => (window.location.href = `results.html?${params}`), 500);
    });
}

/* Hotel search → hotels.html */
function setupHotelForm() {
    const form = document.getElementById("hotelSearchForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const city = document.getElementById("hotelCity");
        const checkin = document.getElementById("hotelCheckin").value;
        const checkout = document.getElementById("hotelCheckout").value;

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }
        if (checkout <= checkin) {
            showToast("Check-out must be after check-in");
            return;
        }
        const params = new URLSearchParams({ city: city.value.trim(), checkin, checkout });
        showToast(`Finding hotels in ${city.value}...`);
        setTimeout(() => (window.location.href = `hotels.html?${params}`), 500);
    });
}

/* Bus search form validation */
function setupSearchForm() {
    const form = document.getElementById("busSearchForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const from = document.getElementById("fromCity");
        const to = document.getElementById("toCity");

        if (
            from.value.trim() &&
            to.value.trim() &&
            from.value.trim().toLowerCase() === to.value.trim().toLowerCase()
        ) {
            to.setCustomValidity("Source and destination cannot be the same");
        } else {
            to.setCustomValidity("");
        }

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            if (to.validationMessage) showToast(to.validationMessage);
            return;
        }

        const women = document.getElementById("womenBooking").checked;
        const date = document.getElementById("journeyDate").value;

        const params = new URLSearchParams({
            from: from.value.trim(),
            to: to.value.trim(),
            date,
            women: women ? "1" : "0",
        });

        showToast(`Searching buses: ${from.value} → ${to.value}...`);
        form.classList.remove("was-validated");

        setTimeout(() => {
            window.location.href = `results.html?${params.toString()}`;
        }, 500);
    });
}

/* Swap From/To cities */
function setupSwap() {
    const swapBtn = document.getElementById("swapBtn");
    if (!swapBtn) return;
    swapBtn.addEventListener("click", () => {
        const from = document.getElementById("fromCity");
        const to = document.getElementById("toCity");
        [from.value, to.value] = [to.value, from.value];
    });
}

/* Quick date buttons (Today / Tomorrow) */
function setupQuickDates() {
    const buttons = document.querySelectorAll(".btn-quick");
    const dateInput = document.getElementById("journeyDate");
    if (!dateInput) return;

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const offset = Number(btn.dataset.day || 0);
            const d = new Date();
            d.setDate(d.getDate() + offset);
            dateInput.value = d.toISOString().split("T")[0];

            buttons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });
}

/* Copy coupon codes */
function setupCopyCodes() {
    document.querySelectorAll(".copy-code").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const code = btn.dataset.code;
            try {
                await navigator.clipboard.writeText(code);
                showToast(`Coupon "${code}" copied!`);
            } catch {
                showToast(`Coupon code: ${code}`);
            }
            const original = btn.innerHTML;
            btn.innerHTML = 'Copied <i class="bi bi-check2"></i>';
            setTimeout(() => (btn.innerHTML = original), 1600);
        });
    });
}

/* Newsletter form */
function setupNewsletter() {
    const form = document.getElementById("newsletterForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        showToast("Subscribed! Watch out for exclusive deals.");
        form.reset();
    });
}

/* Animated stats counter */
function setupStatsCounter() {
    const nums = document.querySelectorAll(".stat-num");
    if (!nums.length) return;

    const animate = (el) => {
        const target = Number(el.dataset.target || 0);
        const duration = 1600;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            el.textContent = value.toLocaleString("en-IN") + (progress === 1 ? "+" : "");
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    nums.forEach((n) => observer.observe(n));
}

/* Reveal sections on scroll */
function setupReveal() {
    const targets = document.querySelectorAll(
        ".offer-card, .route-card, .feature-card, .testimonial-card, .section-head"
    );
    targets.forEach((t) => t.classList.add("reveal"));

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    targets.forEach((t) => observer.observe(t));
}
