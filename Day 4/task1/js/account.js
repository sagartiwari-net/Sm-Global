/* ============================================
   redBus - Account / My Bookings
   ============================================ */

let currentFilter = "all";
let newBookingId = null;

function init() {
    const params = new URLSearchParams(location.search);
    newBookingId = params.get("new");

    renderProfile();
    setupFilters();
    renderBookings();

    if (newBookingId) {
        setTimeout(() => {
            RB.toast("Booking confirmed! 🎉");
            openDetail(newBookingId);
        }, 400);
    }
}

function renderProfile() {
    const box = document.getElementById("profileBox");
    const user = RB.getUser();

    if (!user) {
        box.innerHTML = `
            <div class="profile-card text-center">
                <i class="bi bi-person-circle display-4 text-danger"></i>
                <h4 class="mt-2 mb-1">You're not signed in</h4>
                <p class="text-muted">Sign in to view and manage your bookings.</p>
                <button class="btn btn-search" data-signin>Sign In</button>
            </div>`;
        RB.renderAuthNav();
        return;
    }

    const bookings = RB.getBookings();
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const spent = bookings
        .filter((b) => b.status === "confirmed")
        .reduce((s, b) => s + (b.fare?.total || 0), 0);

    box.innerHTML = `
        <div class="profile-card">
            <div class="profile-avatar">${RB.escapeHtml(user.name.charAt(0).toUpperCase())}</div>
            <div class="profile-info">
                <h4 class="mb-0">${RB.escapeHtml(user.name)}</h4>
                <p class="mb-0 text-muted"><i class="bi bi-envelope"></i> ${RB.escapeHtml(user.email)} · <i class="bi bi-phone"></i> ${RB.escapeHtml(user.phone || "-")}</p>
            </div>
            <div class="profile-stats">
                <div class="p-stat"><span>${confirmed}</span><small>Active Bookings</small></div>
                <div class="p-stat"><span>${RB.rupee(spent)}</span><small>Total Spent</small></div>
            </div>
        </div>`;
}

function setupFilters() {
    document.querySelectorAll("#filterTabs .nav-link").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("#filterTabs .nav-link").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderBookings();
        });
    });
}

function renderBookings() {
    const listEl = document.getElementById("bookingList");
    const empty = document.getElementById("emptyBookings");
    const meta = document.getElementById("bookingMeta");
    const user = RB.getUser();

    if (!user) {
        listEl.innerHTML = "";
        empty.classList.add("d-none");
        meta.textContent = "";
        return;
    }

    let bookings = RB.getBookings().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (currentFilter !== "all") bookings = bookings.filter((b) => b.type === currentFilter);

    meta.textContent = `${bookings.length} booking(s)`;

    if (!bookings.length) {
        listEl.innerHTML = "";
        empty.classList.remove("d-none");
        return;
    }
    empty.classList.add("d-none");
    listEl.innerHTML = bookings.map(bookingCard).join("");

    listEl.querySelectorAll("[data-detail]").forEach((b) =>
        b.addEventListener("click", () => openDetail(b.dataset.detail))
    );
    listEl.querySelectorAll("[data-cancel]").forEach((b) =>
        b.addEventListener("click", (e) => {
            e.stopPropagation();
            cancelBooking(b.dataset.cancel);
        })
    );
}

function typeMeta(type) {
    return {
        bus: { icon: "bi-bus-front", label: "Bus" },
        train: { icon: "bi-train-front", label: "Train" },
        hotel: { icon: "bi-building", label: "Hotel" },
    }[type] || { icon: "bi-ticket", label: "Trip" };
}

function bookingCard(b) {
    const tm = typeMeta(b.type);
    const cancelled = b.status === "cancelled";
    const isNew = b.id === newBookingId;

    let title, sub, route;
    if (b.type === "hotel") {
        title = b.hotelName;
        sub = `${b.roomType} · ${b.rooms} room(s) · ${b.guests} guest(s)`;
        route = `${RB.formatDate(b.checkin, { day: "numeric", month: "short" })} → ${RB.formatDate(b.checkout, { day: "numeric", month: "short" })} · ${b.nights} night(s)`;
    } else {
        title = b.type === "train" ? b.trainName : b.operator;
        sub = b.type === "train" ? `${b.travelClass} · ${b.seats.length} seat(s)` : `${b.busType} · ${b.seats.length} seat(s)`;
        route = `${b.from} → ${b.to} · ${RB.formatDate(b.date, { day: "numeric", month: "short", year: "numeric" })}`;
    }

    return `
    <article class="booking-item ${cancelled ? "cancelled" : ""} ${isNew ? "highlight" : ""}">
        <div class="bi-type-icon"><i class="bi ${tm.icon}"></i></div>
        <div class="bi-main">
            <div class="d-flex align-items-center gap-2 flex-wrap">
                <h5 class="mb-0">${RB.escapeHtml(title)}</h5>
                <span class="status-badge ${cancelled ? "st-cancelled" : "st-confirmed"}">${cancelled ? "Cancelled" : "Confirmed"}</span>
            </div>
            <p class="bi-sub mb-1">${RB.escapeHtml(sub)}</p>
            <p class="bi-route mb-0"><i class="bi bi-geo-alt-fill text-danger"></i> ${RB.escapeHtml(route)}</p>
            <p class="bi-id mb-0">Booking ID: <strong>${b.id}</strong></p>
        </div>
        <div class="bi-side">
            <span class="bi-fare">${RB.rupee(b.fare?.total || 0)}</span>
            <div class="d-flex gap-2 mt-2">
                <button class="btn btn-outline-danger btn-sm" data-detail="${b.id}">Details</button>
                ${cancelled ? "" : `<button class="btn btn-light btn-sm border" data-cancel="${b.id}">Cancel</button>`}
            </div>
        </div>
    </article>`;
}

function cancelBooking(id) {
    if (!confirm("Cancel this booking? This cannot be undone.")) return;
    RB.cancelBooking(id);
    RB.toast("Booking cancelled");
    renderProfile();
    renderBookings();
    RB.renderAuthNav();
}

function openDetail(id) {
    const b = RB.getBookingById(id);
    if (!b) return;
    const tm = typeMeta(b.type);
    const cancelled = b.status === "cancelled";

    let body;
    if (b.type === "hotel") {
        body = `
            <div class="row g-2 detail-grid">
                <div class="col-6"><small>Hotel</small><p>${RB.escapeHtml(b.hotelName)}</p></div>
                <div class="col-6"><small>Location</small><p>${RB.escapeHtml(b.area || b.city)}</p></div>
                <div class="col-6"><small>Check-in</small><p>${RB.formatDate(b.checkin)}</p></div>
                <div class="col-6"><small>Check-out</small><p>${RB.formatDate(b.checkout)}</p></div>
                <div class="col-4"><small>Nights</small><p>${b.nights}</p></div>
                <div class="col-4"><small>Rooms</small><p>${b.rooms}</p></div>
                <div class="col-4"><small>Guests</small><p>${b.guests}</p></div>
                <div class="col-6"><small>Room Type</small><p>${RB.escapeHtml(b.roomType)}</p></div>
            </div>`;
    } else {
        const pax = (b.passengers || [])
            .map((p) => `<tr><td>${RB.escapeHtml(p.name)}</td><td>${p.age}</td><td>${p.gender}</td><td>${p.seat}</td></tr>`)
            .join("");
        body = `
            <div class="row g-2 detail-grid">
                <div class="col-6"><small>${b.type === "train" ? "Train" : "Operator"}</small><p>${RB.escapeHtml(b.type === "train" ? b.trainName : b.operator)}</p></div>
                <div class="col-6"><small>${b.type === "train" ? "Class" : "Bus Type"}</small><p>${RB.escapeHtml(b.travelClass || b.busType)}</p></div>
                <div class="col-6"><small>From</small><p>${RB.escapeHtml(b.from)} · ${b.depTime}</p></div>
                <div class="col-6"><small>To</small><p>${RB.escapeHtml(b.to)} · ${b.arrTime}</p></div>
                <div class="col-6"><small>Date</small><p>${RB.formatDate(b.date)}</p></div>
                <div class="col-6"><small>Seats</small><p>${b.seats.join(", ")}</p></div>
                <div class="col-6"><small>Boarding</small><p>${RB.escapeHtml(b.boarding || "-")}</p></div>
                <div class="col-6"><small>Dropping</small><p>${RB.escapeHtml(b.dropping || "-")}</p></div>
            </div>
            <h6 class="mt-3">Passengers</h6>
            <table class="table table-sm detail-table">
                <thead><tr><th>Name</th><th>Age</th><th>Gender</th><th>Seat</th></tr></thead>
                <tbody>${pax}</tbody>
            </table>`;
    }

    document.getElementById("detailContent").innerHTML = `
        <div class="modal-header border-0">
            <h5 class="modal-title fw-bold"><i class="bi ${tm.icon} text-danger"></i> ${tm.label} Ticket
                <span class="status-badge ${cancelled ? "st-cancelled" : "st-confirmed"} ms-2">${cancelled ? "Cancelled" : "Confirmed"}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <div class="ticket-head">
                <span>Booking ID: <strong>${b.id}</strong></span>
                <span>Booked on ${RB.formatDate(b.createdAt)}</span>
            </div>
            ${body}
            <div class="fare-box mt-3">
                ${b.fare?.base ? `<div class="d-flex justify-content-between"><span>Base fare</span><span>${RB.rupee(b.fare.base)}</span></div>` : ""}
                ${b.fare?.tax ? `<div class="d-flex justify-content-between"><span>Taxes &amp; fees</span><span>${RB.rupee(b.fare.tax)}</span></div>` : ""}
                <div class="d-flex justify-content-between fare-total"><span>Total Paid</span><span>${RB.rupee(b.fare?.total || 0)}</span></div>
            </div>
        </div>
        <div class="modal-footer border-0">
            ${cancelled ? "" : `<button class="btn btn-light border" id="modalCancel">Cancel Booking</button>`}
            <button class="btn btn-search" data-bs-dismiss="modal">Done</button>
        </div>`;

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("detailModal"));
    modal.show();

    document.getElementById("modalCancel")?.addEventListener("click", () => {
        modal.hide();
        cancelBooking(b.id);
    });
}

document.addEventListener("DOMContentLoaded", init);
