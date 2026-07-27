/* ============================================
   redBus - Search Results (mock data)
   Generates a deterministic bus list per route,
   with filters + sorting. No backend needed.
   ============================================ */

const OPERATORS = [
    "VRL Travels", "SRS Travels", "Orange Travels", "Kaveri Travels",
    "National Travels", "Intercity SmartBus", "Parveen Travels", "Sharma Transports",
    "Neeta Tours", "Greenline Travels", "Zingbus", "IntrCity", "Chartered Bus",
    "Kallada Travels", "Morning Star", "Royal Cruiser",
];

const BUS_TYPES = [
    { name: "AC Sleeper (2+1)", ac: true, sleeper: true },
    { name: "Non-AC Sleeper (2+1)", ac: false, sleeper: true },
    { name: "AC Seater / Sleeper", ac: true, sleeper: true },
    { name: "Volvo AC Multi-Axle", ac: true, sleeper: false },
    { name: "Non-AC Seater (2+2)", ac: false, sleeper: false },
    { name: "Bharat Benz AC Sleeper", ac: true, sleeper: true },
];

const AMENITIES = [
    { id: "wifi", label: "WiFi", icon: "bi-wifi" },
    { id: "charging", label: "Charging Point", icon: "bi-plug" },
    { id: "water", label: "Water Bottle", icon: "bi-droplet" },
    { id: "blanket", label: "Blanket", icon: "bi-thermometer-snow" },
    { id: "tv", label: "TV", icon: "bi-tv" },
    { id: "tracking", label: "Live Tracking", icon: "bi-geo-alt" },
];

/* ---------- Train data ---------- */
const TRAIN_NAMES = [
    ["Rajdhani Express", "12951"], ["Shatabdi Express", "12009"],
    ["Duronto Express", "12259"], ["Garib Rath", "12203"],
    ["Tejas Express", "22119"], ["Vande Bharat", "22435"],
    ["Sampark Kranti", "12649"], ["Humsafar Express", "22913"],
    ["Jan Shatabdi", "12051"], ["Superfast Express", "12621"],
];
const TRAIN_CLASSES = [
    { code: "SL", name: "Sleeper" },
    { code: "3A", name: "AC 3 Tier" },
    { code: "2A", name: "AC 2 Tier" },
    { code: "1A", name: "AC First Class" },
    { code: "CC", name: "Chair Car" },
];

const state = {
    all: [],
    filtered: [],
    sort: "departure",
    filters: { types: [], time: [], priceMax: 3000, minRating: 0, primoOnly: false },
    query: {},
    mode: "bus",
};

/* ---------- Seeded pseudo-random (deterministic per route) ---------- */
function makeRng(seedStr) {
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
        seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
    }
    return function rng() {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
    };
}

function pad(n) {
    return String(n).padStart(2, "0");
}

function minsToTime(mins) {
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return `${pad(h)}:${pad(m)}`;
}

function timeBucket(mins) {
    const h = Math.floor(mins / 60) % 24;
    if (h >= 6 && h < 12) return "morning";
    if (h >= 12 && h < 18) return "afternoon";
    if (h >= 18 && h < 24) return "evening";
    return "night";
}

/* ---------- Generate mock buses ---------- */
function generateBuses(from, to, dateStr) {
    const rng = makeRng(`${from}-${to}-${dateStr}`);
    const count = 8 + Math.floor(rng() * 8); // 8-15 buses
    const buses = [];
    const usedOps = [...OPERATORS].sort(() => rng() - 0.5);

    for (let i = 0; i < count; i++) {
        const type = BUS_TYPES[Math.floor(rng() * BUS_TYPES.length)];
        const depMins = 300 + Math.floor(rng() * 1080); // 05:00 - 23:00
        const durationMins = 240 + Math.floor(rng() * 720); // 4h - 16h
        const arrMins = depMins + durationMins;

        const basePrice = type.ac ? 700 : 400;
        const price = basePrice + Math.floor(rng() * 1400);
        const rating = (3.4 + rng() * 1.6).toFixed(1);
        const seatsLeft = 1 + Math.floor(rng() * 40);
        const primo = rng() > 0.65;

        const amen = AMENITIES.filter(() => rng() > 0.45);
        if (!amen.length) amen.push(AMENITIES[1]);

        buses.push({
            id: `BUS-${i + 1}`,
            operator: usedOps[i % usedOps.length],
            type: type.name,
            ac: type.ac,
            sleeper: type.sleeper,
            depMins,
            arrMins,
            durationMins,
            depTime: minsToTime(depMins),
            arrTime: minsToTime(arrMins),
            price,
            rating: Number(rating),
            reviews: 50 + Math.floor(rng() * 2000),
            seatsLeft,
            primo,
            amenities: amen,
            timeBucket: timeBucket(depMins),
        });
    }
    return buses;
}

/* ---------- Generate mock trains ---------- */
function generateTrains(from, to, dateStr) {
    const rng = makeRng(`train-${from}-${to}-${dateStr}`);
    const count = 6 + Math.floor(rng() * 5);
    const trains = [];
    const names = [...TRAIN_NAMES].sort(() => rng() - 0.5);

    for (let i = 0; i < count; i++) {
        const [name, number] = names[i % names.length];
        const depMins = 240 + Math.floor(rng() * 1140);
        const durationMins = 300 + Math.floor(rng() * 900);
        const arrMins = depMins + durationMins;

        const classes = TRAIN_CLASSES.filter(() => rng() > 0.4);
        if (!classes.length) classes.push(TRAIN_CLASSES[0]);
        const classInfo = classes.map((c) => {
            const base = { SL: 350, CC: 550, "3A": 900, "2A": 1400, "1A": 2400 }[c.code];
            return {
                code: c.code, name: c.name,
                price: base + Math.floor(rng() * 300),
                seatsLeft: Math.floor(rng() * 60),
            };
        });
        const minPrice = Math.min(...classInfo.map((c) => c.price));
        const totalSeats = classInfo.reduce((s, c) => s + c.seatsLeft, 0);

        trains.push({
            id: `TRN-${i + 1}`,
            operator: `${name} (${number})`,
            trainName: name,
            trainNumber: number,
            depMins, arrMins, durationMins,
            depTime: minsToTime(depMins),
            arrTime: minsToTime(arrMins),
            price: minPrice,
            classes: classInfo,
            rating: Number((3.6 + rng() * 1.3).toFixed(1)),
            reviews: 100 + Math.floor(rng() * 3000),
            seatsLeft: totalSeats,
            timeBucket: timeBucket(depMins),
            ac: true, sleeper: true, primo: false,
        });
    }
    return trains;
}

/* ---------- URL params ---------- */
function readQuery() {
    const p = new URLSearchParams(window.location.search);
    return {
        mode: p.get("mode") === "train" ? "train" : "bus",
        from: p.get("from") || "Delhi",
        to: p.get("to") || "Mumbai",
        date: p.get("date") || new Date().toISOString().split("T")[0],
        women: p.get("women") === "1",
    };
}

function formatDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            weekday: "short", day: "numeric", month: "short", year: "numeric",
        });
    } catch {
        return dateStr;
    }
}

function durationLabel(mins) {
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

/* ---------- Toast ---------- */
function showToast(message) {
    const el = document.getElementById("appToast");
    const msg = document.getElementById("toastMsg");
    if (!el || !msg) return;
    msg.textContent = message;
    bootstrap.Toast.getOrCreateInstance(el, { delay: 2400 }).show();
}

/* ---------- Filters panel ---------- */
function buildFilterPanel() {
    const maxPrice = Math.max(...state.all.map((b) => b.price), 1000);
    return `
        <div class="filter-block">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="filter-heading mb-0"><i class="bi bi-funnel-fill"></i> Filters</h6>
                <button class="btn btn-link btn-sm p-0 clear-link" type="button" data-clear>Clear all</button>
            </div>
        </div>

        <div class="filter-block">
            <label class="form-check filter-check">
                <input class="form-check-input" type="checkbox" data-filter="primo">
                <span><i class="bi bi-award-fill text-warning"></i> Primo buses only</span>
            </label>
        </div>

        <div class="filter-block">
            <h6 class="filter-heading">Bus Type</h6>
            <label class="form-check filter-check"><input class="form-check-input" type="checkbox" data-type="ac"><span>AC</span></label>
            <label class="form-check filter-check"><input class="form-check-input" type="checkbox" data-type="nonac"><span>Non-AC</span></label>
            <label class="form-check filter-check"><input class="form-check-input" type="checkbox" data-type="sleeper"><span>Sleeper</span></label>
            <label class="form-check filter-check"><input class="form-check-input" type="checkbox" data-type="seater"><span>Seater</span></label>
        </div>

        <div class="filter-block">
            <h6 class="filter-heading">Departure Time</h6>
            <label class="form-check filter-check"><input class="form-check-input" type="checkbox" data-time="morning"><span><i class="bi bi-sunrise"></i> Before 12 PM</span></label>
            <label class="form-check filter-check"><input class="form-check-input" type="checkbox" data-time="afternoon"><span><i class="bi bi-sun"></i> 12 PM - 6 PM</span></label>
            <label class="form-check filter-check"><input class="form-check-input" type="checkbox" data-time="evening"><span><i class="bi bi-sunset"></i> 6 PM - 12 AM</span></label>
            <label class="form-check filter-check"><input class="form-check-input" type="checkbox" data-time="night"><span><i class="bi bi-moon-stars"></i> After 12 AM</span></label>
        </div>

        <div class="filter-block">
            <h6 class="filter-heading">Max Price: <span class="text-danger" data-price-label>₹${maxPrice}</span></h6>
            <input type="range" class="form-range" min="300" max="${maxPrice}" value="${maxPrice}" step="50" data-filter="price">
        </div>

        <div class="filter-block">
            <h6 class="filter-heading">Minimum Rating</h6>
            <div class="btn-group w-100" role="group">
                <button class="btn btn-outline-danger btn-sm" data-rating="0">Any</button>
                <button class="btn btn-outline-danger btn-sm" data-rating="3.5">3.5+</button>
                <button class="btn btn-outline-danger btn-sm" data-rating="4">4+</button>
                <button class="btn btn-outline-danger btn-sm" data-rating="4.5">4.5+</button>
            </div>
        </div>
    `;
}

function bindFilterPanel(panel) {
    // Bus type
    panel.querySelectorAll("[data-type]").forEach((cb) => {
        cb.addEventListener("change", () => {
            const val = cb.dataset.type;
            syncCheckbox("type", val, cb.checked);
            applyFilters();
        });
    });
    // Time
    panel.querySelectorAll("[data-time]").forEach((cb) => {
        cb.addEventListener("change", () => {
            const val = cb.dataset.time;
            toggleArray(state.filters.time, val, cb.checked);
            syncCheckbox("time", val, cb.checked);
            applyFilters();
        });
    });
    // Primo
    const primo = panel.querySelector('[data-filter="primo"]');
    primo?.addEventListener("change", () => {
        state.filters.primoOnly = primo.checked;
        document.querySelectorAll('[data-filter="primo"]').forEach((el) => (el.checked = primo.checked));
        applyFilters();
    });
    // Price
    const price = panel.querySelector('[data-filter="price"]');
    price?.addEventListener("input", () => {
        state.filters.priceMax = Number(price.value);
        document.querySelectorAll("[data-price-label]").forEach((el) => (el.textContent = `₹${price.value}`));
        document.querySelectorAll('[data-filter="price"]').forEach((el) => (el.value = price.value));
        applyFilters();
    });
    // Rating
    panel.querySelectorAll("[data-rating]").forEach((btn) => {
        btn.addEventListener("click", () => {
            state.filters.minRating = Number(btn.dataset.rating);
            document.querySelectorAll("[data-rating]").forEach((b) => b.classList.remove("active"));
            document.querySelectorAll(`[data-rating="${btn.dataset.rating}"]`).forEach((b) => b.classList.add("active"));
            applyFilters();
        });
    });
    // Clear
    panel.querySelector("[data-clear]")?.addEventListener("click", clearFilters);
}

// Keep type filters (ac/nonac/sleeper/seater) in a set
function syncCheckbox(group, val, checked) {
    if (group === "type") {
        toggleArray(state.filters.types, val, checked);
    }
    document.querySelectorAll(`[data-${group}="${val}"]`).forEach((el) => {
        if (el.type === "checkbox") el.checked = checked;
    });
}

function toggleArray(arr, val, add) {
    const idx = arr.indexOf(val);
    if (add && idx === -1) arr.push(val);
    if (!add && idx > -1) arr.splice(idx, 1);
}

/* ---------- Apply filters + sort ---------- */
function applyFilters() {
    let list = [...state.all];
    const f = state.filters;

    if (f.primoOnly) list = list.filter((b) => b.primo);

    if (f.types.length) {
        list = list.filter((b) => {
            return f.types.some((t) => {
                if (t === "ac") return b.ac;
                if (t === "nonac") return !b.ac;
                if (t === "sleeper") return b.sleeper;
                if (t === "seater") return !b.sleeper;
                return false;
            });
        });
    }

    if (f.time.length) {
        list = list.filter((b) => f.time.includes(b.timeBucket));
    }

    list = list.filter((b) => b.price <= f.priceMax);
    if (f.minRating) list = list.filter((b) => b.rating >= f.minRating);

    state.filtered = sortList(list, state.sort);
    renderBuses();
}

function sortList(list, sort) {
    const arr = [...list];
    switch (sort) {
        case "price": return arr.sort((a, b) => a.price - b.price);
        case "duration": return arr.sort((a, b) => a.durationMins - b.durationMins);
        case "rating": return arr.sort((a, b) => b.rating - a.rating);
        case "seats": return arr.sort((a, b) => b.seatsLeft - a.seatsLeft);
        default: return arr.sort((a, b) => a.depMins - b.depMins);
    }
}

/* ---------- Render ---------- */
function renderBuses() {
    const listEl = document.getElementById("busList");
    const noRes = document.getElementById("noResults");
    const meta = document.getElementById("resultsMeta");

    meta.textContent = `${state.filtered.length} of ${state.all.length} buses · ${formatDate(state.query.date)}`;

    if (!state.filtered.length) {
        listEl.innerHTML = "";
        noRes.classList.remove("d-none");
        return;
    }
    noRes.classList.add("d-none");

    const renderer = state.mode === "train" ? trainCard : busCard;
    listEl.innerHTML = state.filtered.map(renderer).join("");

    listEl.querySelectorAll("[data-view]").forEach((btn) => {
        btn.addEventListener("click", () => startBooking(btn.dataset.view, btn.dataset.class));
    });
}

/* ---------- Start booking: stash selection, require auth ---------- */
function startBooking(itemId, classCode) {
    const item = state.all.find((b) => b.id === itemId);
    if (!item) return;

    const pending = {
        type: state.mode,
        from: state.query.from,
        to: state.query.to,
        date: state.query.date,
        operator: item.operator,
        depTime: item.depTime,
        arrTime: item.arrTime,
        durationMins: item.durationMins,
        rating: item.rating,
    };

    if (state.mode === "train") {
        const cls = item.classes.find((c) => c.code === classCode) || item.classes[0];
        pending.travelClass = `${cls.name} (${cls.code})`;
        pending.price = cls.price;
        pending.trainName = item.trainName;
        pending.trainNumber = item.trainNumber;
    } else {
        pending.busType = item.type;
        pending.price = item.price;
        pending.seatsLeft = item.seatsLeft;
    }

    RB.setPending(pending);

    const go = () => (window.location.href = "booking.html");
    const user = RB.requireAuth(go);
    if (user) go();
}

function ratingClass(r) {
    if (r >= 4.5) return "rating-high";
    if (r >= 4) return "rating-mid";
    return "rating-low";
}

function busCard(bus) {
    const amen = bus.amenities
        .map((a) => `<span class="amenity" title="${a.label}"><i class="bi ${a.icon}"></i></span>`)
        .join("");
    const seatWarn = bus.seatsLeft <= 5 ? "seats-low" : "";

    return `
        <article class="bus-card">
            <div class="bus-card-main">
                <div class="bus-info">
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                        <h5 class="bus-operator mb-0">${bus.operator}</h5>
                        ${bus.primo ? '<span class="primo-badge"><i class="bi bi-award-fill"></i> Primo</span>' : ""}
                    </div>
                    <p class="bus-type">${bus.type}</p>
                    <div class="amenities">${amen}</div>
                </div>

                <div class="bus-timing">
                    <div class="time-block">
                        <span class="time">${bus.depTime}</span>
                        <span class="time-label">Departure</span>
                    </div>
                    <div class="duration">
                        <span class="dur-line"></span>
                        <span class="dur-text"><i class="bi bi-clock"></i> ${durationLabel(bus.durationMins)}</span>
                    </div>
                    <div class="time-block text-end">
                        <span class="time">${bus.arrTime}</span>
                        <span class="time-label">Arrival</span>
                    </div>
                </div>

                <div class="bus-meta">
                    <span class="rating-badge ${ratingClass(bus.rating)}">
                        <i class="bi bi-star-fill"></i> ${bus.rating}
                    </span>
                    <span class="reviews-count">${bus.reviews.toLocaleString("en-IN")} ratings</span>
                </div>

                <div class="bus-price">
                    <span class="price-label">Starts from</span>
                    <span class="price">₹${bus.price.toLocaleString("en-IN")}</span>
                    <span class="seats ${seatWarn}">${bus.seatsLeft} seats left</span>
                    <button class="btn btn-search btn-sm mt-2" data-view="${bus.id}">View Seats</button>
                </div>
            </div>
        </article>
    `;
}

/* ---------- Train card ---------- */
function trainCard(train) {
    const classChips = train.classes
        .map(
            (c) => `
        <button class="class-chip" data-view="${train.id}" data-class="${c.code}" title="${c.name}">
            <span class="cc-code">${c.code}</span>
            <span class="cc-price">₹${c.price.toLocaleString("en-IN")}</span>
            <span class="cc-seats ${c.seatsLeft <= 5 ? "text-danger" : ""}">${c.seatsLeft > 0 ? c.seatsLeft + " left" : "WL"}</span>
        </button>`
        )
        .join("");

    return `
        <article class="bus-card train-card">
            <div class="bus-card-main train-main">
                <div class="bus-info">
                    <h5 class="bus-operator mb-0"><i class="bi bi-train-front text-danger"></i> ${train.trainName}</h5>
                    <p class="bus-type">#${train.trainNumber} · Runs on selected date</p>
                    <span class="rating-badge ${ratingClass(train.rating)}"><i class="bi bi-star-fill"></i> ${train.rating}</span>
                </div>
                <div class="bus-timing">
                    <div class="time-block">
                        <span class="time">${train.depTime}</span>
                        <span class="time-label">${state.query.from}</span>
                    </div>
                    <div class="duration">
                        <span class="dur-line"></span>
                        <span class="dur-text"><i class="bi bi-clock"></i> ${durationLabel(train.durationMins)}</span>
                    </div>
                    <div class="time-block text-end">
                        <span class="time">${train.arrTime}</span>
                        <span class="time-label">${state.query.to}</span>
                    </div>
                </div>
                <div class="train-classes">${classChips}</div>
            </div>
        </article>
    `;
}

/* ---------- Sort bar ---------- */
function setupSortBar() {
    document.querySelectorAll(".btn-sort").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".btn-sort").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            state.sort = btn.dataset.sort;
            applyFilters();
        });
    });
}

/* ---------- Clear filters ---------- */
function clearFilters() {
    state.filters = { types: [], time: [], priceMax: 999999, minRating: 0, primoOnly: false };
    renderFilterPanels();
    // reset price max to actual max
    const maxPrice = Math.max(...state.all.map((b) => b.price), 1000);
    state.filters.priceMax = maxPrice;
    applyFilters();
}

/* ---------- Modify search bar ---------- */
function setupModifyForm() {
    const q = state.query;
    document.getElementById("fromCity").value = q.from;
    document.getElementById("toCity").value = q.to;
    const dateInput = document.getElementById("journeyDate");
    dateInput.value = q.date;
    dateInput.min = new Date().toISOString().split("T")[0];

    document.getElementById("modifyForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const from = document.getElementById("fromCity").value.trim();
        const to = document.getElementById("toCity").value.trim();
        const date = dateInput.value;
        if (!from || !to || !date) {
            showToast("Please fill all fields");
            return;
        }
        if (from.toLowerCase() === to.toLowerCase()) {
            showToast("Source and destination cannot be same");
            return;
        }
        const params = new URLSearchParams({ mode: state.mode, from, to, date, women: q.women ? "1" : "0" });
        window.location.href = `results.html?${params.toString()}`;
    });
}

/* ---------- Filter panels (desktop + mobile) ---------- */
function renderFilterPanels() {
    const html = buildFilterPanel();
    ["filterPanelDesktop", "filterPanelMobile"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = html;
            bindFilterPanel(el);
            el.querySelector('[data-rating="0"]')?.classList.add("active");
        }
    });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
    state.query = readQuery();
    state.mode = state.query.mode;

    const label = state.mode === "train" ? "Trains" : "Buses";
    document.getElementById("routeHeading").textContent = `${state.query.from} → ${state.query.to}`;
    document.title = `${state.query.from} to ${state.query.to} ${label} | redBus`;

    if (state.mode === "train") {
        state.all = generateTrains(state.query.from, state.query.to, state.query.date);
        // hide bus-only "seats" sort
        document.querySelector('[data-sort="seats"]')?.classList.add("d-none");
    } else {
        state.all = generateBuses(state.query.from, state.query.to, state.query.date);
    }

    state.filters.priceMax = Math.max(...state.all.map((b) => b.price), 1000);

    setupModifyForm();
    renderFilterPanels();
    setupSortBar();
    applyFilters();

    document.getElementById("clearFiltersBtn")?.addEventListener("click", clearFilters);

    if (state.mode === "bus" && state.query.women) {
        showToast("Showing buses with women booking preference");
    }
});
