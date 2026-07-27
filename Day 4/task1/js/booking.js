/* ============================================
   redBus - Booking page (seat map + passengers)
   Reads pending selection from RB store,
   creates a confirmed booking on payment.
   ============================================ */

const MAX_SEATS = 6;
const TAX_RATE = 0.05;

const booking = {
    pending: null,
    seats: [],       // selected seat labels
    bookedSet: new Set(), // pre-booked (unavailable) seats
    seatPrice: 0,
};

/* seeded rng for consistent seat layout */
function rng(seedStr) {
    let s = 0;
    for (let i = 0; i < seedStr.length; i++) s = (s * 31 + seedStr.charCodeAt(i)) >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

function seatLabels() {
    // 2 decks feel: rows A-J, columns 1-4 (aisle between 2 and 3)
    const rows = "ABCDEFGHIJ".split("");
    const labels = [];
    rows.forEach((r) => {
        for (let c = 1; c <= 4; c++) labels.push(`${r}${c}`);
    });
    return labels;
}

function init() {
    booking.pending = RB.getPending();
    const user = RB.getUser();

    if (!booking.pending) {
        document.querySelector(".booking-main .container").innerHTML = `
            <div class="booking-card text-center py-5">
                <i class="bi bi-exclamation-circle display-4 text-danger"></i>
                <h4 class="mt-3">No trip selected</h4>
                <p class="text-muted">Please search and choose a bus or train first.</p>
                <a href="index.html" class="btn btn-search">Go to Search</a>
            </div>`;
        return;
    }

    if (!user) {
        RB.requireAuth(() => location.reload());
        return;
    }

    booking.seatPrice = booking.pending.price;

    renderSummary();
    renderLegend();
    setupSeats();
    setupPoints();
    prefillContact(user);
    renderPassengers();
    renderFare();

    document.getElementById("payBtn").addEventListener("click", confirmBooking);
}

function renderSummary() {
    const p = booking.pending;
    const isTrain = p.type === "train";
    const title = isTrain ? p.trainName : p.operator;
    const sub = isTrain ? `#${p.trainNumber} · ${p.travelClass}` : p.busType;

    document.getElementById("journeySummary").innerHTML = `
        <div class="js-left">
            <span class="js-badge">${isTrain ? '<i class="bi bi-train-front"></i> Train' : '<i class="bi bi-bus-front"></i> Bus'}</span>
            <h4 class="mb-0">${RB.escapeHtml(title)}</h4>
            <p class="text-muted mb-0 small">${RB.escapeHtml(sub)}</p>
        </div>
        <div class="js-route">
            <div class="text-center">
                <div class="js-time">${p.depTime}</div>
                <div class="small text-muted">${RB.escapeHtml(p.from)}</div>
            </div>
            <i class="bi bi-arrow-right mx-2"></i>
            <div class="text-center">
                <div class="js-time">${p.arrTime}</div>
                <div class="small text-muted">${RB.escapeHtml(p.to)}</div>
            </div>
        </div>
        <div class="js-date text-lg-end">
            <i class="bi bi-calendar-event text-danger"></i> ${RB.formatDate(p.date)}
        </div>`;
}

function renderLegend() {
    document.getElementById("seatLegend").innerHTML = `
        <span class="legend-item"><span class="seat-demo available"></span> Available</span>
        <span class="legend-item"><span class="seat-demo selected"></span> Selected</span>
        <span class="legend-item"><span class="seat-demo booked"></span> Booked</span>
        <span class="legend-item ms-auto small text-muted">Price / seat: <strong>${RB.rupee(booking.seatPrice)}</strong></span>`;
}

function setupSeats() {
    const p = booking.pending;
    const r = rng(`${p.operator}-${p.date}-${p.from}`);
    const labels = seatLabels();

    // ~35% pre-booked
    labels.forEach((l) => {
        if (r() < 0.35) booking.bookedSet.add(l);
    });

    const map = document.getElementById("seatMap");
    map.innerHTML = `
        <div class="deck-label"><i class="bi bi-steering-wheel"></i> Front</div>
        <div class="seat-grid">
            ${labels.map(seatCell).join("")}
        </div>`;

    map.querySelectorAll(".seat.available").forEach((el) => {
        el.addEventListener("click", () => toggleSeat(el));
    });
}

function seatCell(label) {
    const booked = booking.bookedSet.has(label);
    const col = Number(label[1]);
    const aisle = col === 2 ? "seat-aisle" : "";
    return `<button type="button" class="seat ${booked ? "booked" : "available"} ${aisle}" data-seat="${label}" ${booked ? "disabled" : ""}>
        <i class="bi bi-person-fill"></i><span>${label}</span>
    </button>`;
}

function toggleSeat(el) {
    const label = el.dataset.seat;
    const idx = booking.seats.indexOf(label);
    if (idx > -1) {
        booking.seats.splice(idx, 1);
        el.classList.remove("selected");
    } else {
        if (booking.seats.length >= MAX_SEATS) {
            RB.toast(`You can select up to ${MAX_SEATS} seats`);
            return;
        }
        booking.seats.push(label);
        el.classList.add("selected");
    }
    renderPassengers();
    renderFare();
}

function setupPoints() {
    const p = booking.pending;
    const boarding = [`${p.from} Central`, `${p.from} Bus Stand`, `${p.from} Highway Point`, `${p.from} Airport Road`];
    const dropping = [`${p.to} Central`, `${p.to} Bus Stand`, `${p.to} Ring Road`, `${p.to} Main Market`];
    const bSel = document.getElementById("boardingPoint");
    const dSel = document.getElementById("droppingPoint");
    bSel.innerHTML = boarding.map((x) => `<option>${x} · ${p.depTime}</option>`).join("");
    dSel.innerHTML = dropping.map((x) => `<option>${x} · ${p.arrTime}</option>`).join("");
}

function prefillContact(user) {
    document.getElementById("contactEmail").value = user.email || "";
    document.getElementById("contactPhone").value = user.phone || "";
}

function renderPassengers() {
    const wrap = document.getElementById("passengerForms");
    if (!booking.seats.length) {
        wrap.innerHTML = `<p class="text-muted mb-0">Please select at least one seat to add passengers.</p>`;
        return;
    }
    wrap.innerHTML = booking.seats
        .map(
            (seat, i) => `
        <div class="passenger-row">
            <div class="seat-tag">${seat}</div>
            <div class="row g-2 flex-grow-1">
                <div class="col-md-5">
                    <input type="text" class="form-control" placeholder="Full name" data-p-name="${i}" required>
                </div>
                <div class="col-6 col-md-3">
                    <input type="number" class="form-control" placeholder="Age" min="1" max="120" data-p-age="${i}" required>
                </div>
                <div class="col-6 col-md-4">
                    <select class="form-select" data-p-gender="${i}">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
        </div>`
        )
        .join("");
}

function renderFare() {
    const n = booking.seats.length;
    const base = n * booking.seatPrice;
    const tax = Math.round(base * TAX_RATE);
    const total = base + tax;

    const breakup = document.getElementById("fareBreakup");
    if (!n) {
        breakup.innerHTML = `<p class="text-muted mb-0">Select seats to see fare.</p>`;
    } else {
        breakup.innerHTML = `
            <div class="d-flex justify-content-between mb-1"><span>Seats (${n} × ${RB.rupee(booking.seatPrice)})</span><span>${RB.rupee(base)}</span></div>
            <div class="d-flex justify-content-between mb-1"><span>Taxes &amp; fees (5%)</span><span>${RB.rupee(tax)}</span></div>
            <div class="d-flex justify-content-between text-success small"><span>Seats: ${booking.seats.join(", ")}</span></div>`;
    }
    document.getElementById("fareTotal").textContent = RB.rupee(total);
    document.getElementById("payBtn").disabled = n === 0;
    booking._total = total;
    booking._base = base;
    booking._tax = tax;
}

function confirmBooking() {
    if (!booking.seats.length) return;

    // validate passengers
    const passengers = [];
    for (let i = 0; i < booking.seats.length; i++) {
        const name = document.querySelector(`[data-p-name="${i}"]`).value.trim();
        const age = document.querySelector(`[data-p-age="${i}"]`).value.trim();
        const gender = document.querySelector(`[data-p-gender="${i}"]`).value;
        if (!name || !age) {
            RB.toast(`Enter details for seat ${booking.seats[i]}`);
            return;
        }
        passengers.push({ name, age, gender, seat: booking.seats[i] });
    }

    const email = document.getElementById("contactEmail").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    if (!email || phone.length !== 10) {
        RB.toast("Enter valid contact email and 10-digit mobile");
        return;
    }

    const p = booking.pending;
    const record = RB.addBooking({
        type: p.type,
        operator: p.operator,
        trainName: p.trainName || null,
        trainNumber: p.trainNumber || null,
        travelClass: p.travelClass || null,
        busType: p.busType || null,
        from: p.from,
        to: p.to,
        date: p.date,
        depTime: p.depTime,
        arrTime: p.arrTime,
        boarding: document.getElementById("boardingPoint").value,
        dropping: document.getElementById("droppingPoint").value,
        seats: booking.seats.slice(),
        passengers,
        contact: { email, phone },
        fare: { base: booking._base, tax: booking._tax, total: booking._total },
    });

    RB.clearPending();
    // go to account with highlight
    window.location.href = `account.html?new=${record.id}`;
}

document.addEventListener("DOMContentLoaded", init);
