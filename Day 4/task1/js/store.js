/* ============================================
   redBus - Shared Store (localStorage)
   Handles: user auth (lightweight), bookings,
   auth modal, and navbar auth area.
   Exposed globally as window.RB
   ============================================ */
(function () {
    const KEYS = {
        user: "rb_user",
        bookings: "rb_bookings",
        pending: "rb_pending", // selected item awaiting booking
    };

    /* ---------- storage helpers ---------- */
    function read(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch {
            return fallback;
        }
    }
    function write(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }

    /* ---------- user ---------- */
    function getUser() {
        return read(KEYS.user, null);
    }
    function setUser(user) {
        write(KEYS.user, user);
        renderAuthNav();
    }
    function logout() {
        localStorage.removeItem(KEYS.user);
        renderAuthNav();
        location.href = "index.html";
    }

    /* ---------- bookings ---------- */
    function getBookings() {
        const user = getUser();
        const all = read(KEYS.bookings, []);
        if (!user) return [];
        return all.filter((b) => b.userEmail === user.email);
    }
    function addBooking(booking) {
        const user = getUser();
        const all = read(KEYS.bookings, []);
        const record = {
            id: "RB" + Date.now().toString().slice(-8),
            userEmail: user ? user.email : "guest",
            status: "confirmed",
            createdAt: new Date().toISOString(),
            ...booking,
        };
        all.push(record);
        write(KEYS.bookings, all);
        return record;
    }
    function cancelBooking(id) {
        const all = read(KEYS.bookings, []);
        const idx = all.findIndex((b) => b.id === id);
        if (idx > -1) {
            all[idx].status = "cancelled";
            write(KEYS.bookings, all);
        }
    }
    function getBookingById(id) {
        return read(KEYS.bookings, []).find((b) => b.id === id) || null;
    }

    /* ---------- pending selection ---------- */
    function setPending(item) {
        write(KEYS.pending, item);
    }
    function getPending() {
        return read(KEYS.pending, null);
    }
    function clearPending() {
        localStorage.removeItem(KEYS.pending);
    }

    /* ---------- toast ---------- */
    function toast(message) {
        let el = document.getElementById("appToast");
        if (!el) {
            const wrap = document.createElement("div");
            wrap.className = "toast-container position-fixed bottom-0 end-0 p-3";
            wrap.innerHTML = `
                <div id="appToast" class="toast align-items-center text-bg-dark border-0" role="alert">
                    <div class="d-flex">
                        <div class="toast-body" id="toastMsg"></div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                    </div>
                </div>`;
            document.body.appendChild(wrap);
            el = document.getElementById("appToast");
        }
        document.getElementById("toastMsg").textContent = message;
        bootstrap.Toast.getOrCreateInstance(el, { delay: 2600 }).show();
    }

    /* ---------- auth modal ---------- */
    function ensureAuthModal() {
        if (document.getElementById("authModal")) return;
        const div = document.createElement("div");
        div.innerHTML = `
        <div class="modal fade" id="authModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content auth-modal">
              <div class="modal-header border-0">
                <h5 class="modal-title fw-bold"><i class="bi bi-person-circle text-danger"></i> Sign In / Register</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <p class="text-muted small">Sign in to book tickets and view your bookings. (Demo — stored locally.)</p>
                <form id="authForm">
                  <div class="mb-3">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-control" id="authName" required placeholder="Your name">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="authEmail" required placeholder="you@email.com">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Mobile</label>
                    <input type="tel" class="form-control" id="authPhone" pattern="[0-9]{10}" required placeholder="10-digit mobile">
                  </div>
                  <button type="submit" class="btn btn-search w-100">Continue</button>
                </form>
              </div>
            </div>
          </div>
        </div>`;
        document.body.appendChild(div.firstElementChild);

        document.getElementById("authForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("authName").value.trim();
            const email = document.getElementById("authEmail").value.trim().toLowerCase();
            const phone = document.getElementById("authPhone").value.trim();
            if (!name || !email || phone.length !== 10) {
                toast("Please fill all fields correctly");
                return;
            }
            setUser({ name, email, phone });
            bootstrap.Modal.getInstance(document.getElementById("authModal"))?.hide();
            toast(`Welcome, ${name}!`);
            if (typeof window._afterLogin === "function") {
                const cb = window._afterLogin;
                window._afterLogin = null;
                cb();
            }
        });
    }

    function openAuth(afterLogin) {
        ensureAuthModal();
        window._afterLogin = afterLogin || null;
        const user = getUser();
        if (user) {
            document.getElementById("authName").value = user.name;
            document.getElementById("authEmail").value = user.email;
            document.getElementById("authPhone").value = user.phone || "";
        }
        bootstrap.Modal.getOrCreateInstance(document.getElementById("authModal")).show();
    }

    /* returns user, or opens modal and returns null */
    function requireAuth(afterLogin) {
        const user = getUser();
        if (user) return user;
        openAuth(afterLogin);
        return null;
    }

    /* ---------- navbar auth area ---------- */
    function renderAuthNav() {
        const containers = document.querySelectorAll("[data-auth-nav]");
        const user = getUser();
        containers.forEach((c) => {
            if (user) {
                const count = getBookings().filter((b) => b.status === "confirmed").length;
                c.innerHTML = `
                    <div class="dropdown">
                        <button class="btn btn-outline-light btn-sm px-3 dropdown-toggle" data-bs-toggle="dropdown">
                            <i class="bi bi-person-circle"></i> ${escapeHtml(user.name.split(" ")[0])}
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><span class="dropdown-item-text small text-muted">${escapeHtml(user.email)}</span></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="account.html"><i class="bi bi-ticket-perforated"></i> My Bookings <span class="badge bg-danger ms-1">${count}</span></a></li>
                            <li><button class="dropdown-item" type="button" data-logout><i class="bi bi-box-arrow-right"></i> Logout</button></li>
                        </ul>
                    </div>`;
            } else {
                c.innerHTML = `
                    <button class="btn btn-outline-light btn-sm px-3" type="button" data-signin>
                        <i class="bi bi-person-circle"></i> Sign In
                    </button>`;
            }
        });

        document.querySelectorAll("[data-signin]").forEach((b) => (b.onclick = () => openAuth()));
        document.querySelectorAll("[data-logout]").forEach((b) => (b.onclick = () => logout()));
    }

    /* ---------- utils ---------- */
    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = String(text ?? "");
        return div.innerHTML;
    }
    function formatDate(dateStr, opts) {
        try {
            return new Date(dateStr).toLocaleDateString("en-IN", opts || {
                weekday: "short", day: "numeric", month: "short", year: "numeric",
            });
        } catch {
            return dateStr;
        }
    }
    function rupee(n) {
        return "₹" + Number(n).toLocaleString("en-IN");
    }

    /* expose */
    window.RB = {
        getUser, setUser, logout,
        getBookings, addBooking, cancelBooking, getBookingById,
        setPending, getPending, clearPending,
        openAuth, requireAuth, renderAuthNav, ensureAuthModal,
        toast, escapeHtml, formatDate, rupee,
    };

    document.addEventListener("DOMContentLoaded", () => {
        ensureAuthModal();
        renderAuthNav();
    });
})();
