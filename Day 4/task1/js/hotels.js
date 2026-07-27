/* ============================================
   redBus - Hotels page (mock list + booking)
   ============================================ */

const HOTEL_NAMES = [
    "Grand Plaza", "Royal Orchid", "The Taj Comfort", "Sunrise Residency",
    "Blue Diamond Inn", "Green Valley Resort", "City Central Hotel", "Lake View Suites",
    "Heritage Palace", "Skyline Towers", "Comfort Stay", "The Grand Regency",
];
const AREAS = ["City Center", "Near Bus Stand", "Airport Road", "Beach Side", "Mall Road", "Downtown"];
const HOTEL_AMENITIES = [
    { id: "wifi", label: "Free WiFi", icon: "bi-wifi" },
    { id: "pool", label: "Swimming Pool", icon: "bi-water" },
    { id: "gym", label: "Gym", icon: "bi-heart-pulse" },
    { id: "restaurant", label: "Restaurant", icon: "bi-cup-hot" },
    { id: "parking", label: "Free Parking", icon: "bi-p-square" },
    { id: "ac", label: "AC Rooms", icon: "bi-snow" },
];
const ROOM_ADDON = { Standard: 0, Deluxe: 800, Suite: 2000 };

const hstate = { query: {}, hotels: [], nights: 1, selected: null };

function rng(seedStr) {
    let s = 0;
    for (let i = 0; i < seedStr.length; i++) s = (s * 31 + seedStr.charCodeAt(i)) >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

function readQuery() {
    const p = new URLSearchParams(location.search);
    const today = new Date().toISOString().split("T")[0];
    const tmw = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    return {
        city: p.get("city") || "Goa",
        checkin: p.get("checkin") || today,
        checkout: p.get("checkout") || tmw,
    };
}

function nightsBetween(a, b) {
    const diff = (new Date(b) - new Date(a)) / 86400000;
    return Math.max(1, Math.round(diff));
}

function generateHotels(city, seed) {
    const r = rng(`hotel-${city}-${seed}`);
    const count = 6 + Math.floor(r() * 5);
    const names = [...HOTEL_NAMES].sort(() => r() - 0.5);
    const hotels = [];
    for (let i = 0; i < count; i++) {
        const stars = 3 + Math.floor(r() * 3);
        const price = 1200 + Math.floor(r() * 6000);
        const amen = HOTEL_AMENITIES.filter(() => r() > 0.4);
        if (amen.length < 2) amen.push(HOTEL_AMENITIES[0], HOTEL_AMENITIES[5]);
        hotels.push({
            id: `HTL-${i + 1}`,
            name: `${names[i % names.length]} ${city}`,
            area: `${AREAS[Math.floor(r() * AREAS.length)]}, ${city}`,
            stars,
            rating: Number((3.5 + r() * 1.5).toFixed(1)),
            reviews: 80 + Math.floor(r() * 2500),
            price,
            oldPrice: price + 500 + Math.floor(r() * 1500),
            amenities: amen,
        });
    }
    return hotels;
}

function starIcons(n) {
    return Array.from({ length: 5 }, (_, i) => `<i class="bi bi-star${i < n ? "-fill" : ""}"></i>`).join("");
}

function renderHotels() {
    const el = document.getElementById("hotelList");
    document.getElementById("hotelHeading").textContent = `Hotels in ${hstate.query.city}`;
    document.getElementById("hotelMeta").textContent =
        `${hstate.hotels.length} hotels · ${RB.formatDate(hstate.query.checkin, { day: "numeric", month: "short" })} → ${RB.formatDate(hstate.query.checkout, { day: "numeric", month: "short" })} · ${hstate.nights} night(s)`;

    el.innerHTML = hstate.hotels.map(hotelCard).join("");
    el.querySelectorAll("[data-book]").forEach((b) =>
        b.addEventListener("click", () => openBookModal(b.dataset.book))
    );
}

function hotelCard(h) {
    const amen = h.amenities.slice(0, 4)
        .map((a) => `<span class="h-amenity"><i class="bi ${a.icon}"></i> ${a.label}</span>`)
        .join("");
    return `
    <div class="col-md-6 col-lg-4">
        <div class="hotel-card h-100">
            <div class="hotel-thumb">
                <i class="bi bi-building"></i>
                <span class="hotel-stars">${starIcons(h.stars)}</span>
            </div>
            <div class="hotel-body">
                <h5 class="hotel-name">${RB.escapeHtml(h.name)}</h5>
                <p class="hotel-area"><i class="bi bi-geo-alt"></i> ${RB.escapeHtml(h.area)}</p>
                <span class="rating-badge rating-high"><i class="bi bi-star-fill"></i> ${h.rating}</span>
                <span class="reviews-count">${h.reviews.toLocaleString("en-IN")} reviews</span>
                <div class="h-amenities">${amen}</div>
                <div class="hotel-foot">
                    <div>
                        <span class="old-price">${RB.rupee(h.oldPrice)}</span>
                        <span class="price">${RB.rupee(h.price)}</span>
                        <span class="per-night">/ night</span>
                    </div>
                    <button class="btn btn-search btn-sm" data-book="${h.id}">Book</button>
                </div>
            </div>
        </div>
    </div>`;
}

/* ---------- Booking modal ---------- */
let hotelModal;
function openBookModal(hotelId) {
    const go = () => reallyOpen(hotelId);
    const user = RB.requireAuth(go);
    if (user) go();
}

function reallyOpen(hotelId) {
    const hotel = hstate.hotels.find((h) => h.id === hotelId);
    if (!hotel) return;
    hstate.selected = hotel;

    document.getElementById("hbTitle").textContent = hotel.name;
    document.getElementById("hbSummary").innerHTML = `
        <div class="d-flex justify-content-between small text-muted">
            <span><i class="bi bi-geo-alt"></i> ${RB.escapeHtml(hotel.area)}</span>
            <span>${hstate.nights} night(s)</span>
        </div>
        <div class="small text-muted">${RB.formatDate(hstate.query.checkin)} → ${RB.formatDate(hstate.query.checkout)}</div>`;

    ["hbRooms", "hbGuests", "hbRoomType"].forEach((id) =>
        document.getElementById(id).addEventListener("change", updateHotelTotal)
    );
    updateHotelTotal();

    hotelModal = bootstrap.Modal.getOrCreateInstance(document.getElementById("hotelBookModal"));
    hotelModal.show();
}

function updateHotelTotal() {
    const rooms = Number(document.getElementById("hbRooms").value);
    const roomType = document.getElementById("hbRoomType").value;
    const perNight = hstate.selected.price + ROOM_ADDON[roomType];
    const total = perNight * rooms * hstate.nights;
    document.getElementById("hbTotal").textContent = RB.rupee(total);
    hstate._total = total;
}

function confirmHotel() {
    const h = hstate.selected;
    const rooms = document.getElementById("hbRooms").value;
    const guests = document.getElementById("hbGuests").value;
    const roomType = document.getElementById("hbRoomType").value;

    const record = RB.addBooking({
        type: "hotel",
        hotelName: h.name,
        area: h.area,
        city: hstate.query.city,
        checkin: hstate.query.checkin,
        checkout: hstate.query.checkout,
        nights: hstate.nights,
        rooms, guests, roomType,
        rating: h.rating,
        fare: { total: hstate._total },
    });

    hotelModal?.hide();
    window.location.href = `account.html?new=${record.id}`;
}

/* ---------- Modify form ---------- */
function setupModify() {
    const q = hstate.query;
    document.getElementById("hCity").value = q.city;
    document.getElementById("hCheckin").value = q.checkin;
    document.getElementById("hCheckout").value = q.checkout;
    document.getElementById("hCheckin").min = new Date().toISOString().split("T")[0];

    document.getElementById("hotelModifyForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const city = document.getElementById("hCity").value.trim();
        const checkin = document.getElementById("hCheckin").value;
        const checkout = document.getElementById("hCheckout").value;
        if (!city || !checkin || !checkout) {
            RB.toast("Please fill all fields");
            return;
        }
        if (checkout <= checkin) {
            RB.toast("Check-out must be after check-in");
            return;
        }
        location.href = `hotels.html?${new URLSearchParams({ city, checkin, checkout })}`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    hstate.query = readQuery();
    hstate.nights = nightsBetween(hstate.query.checkin, hstate.query.checkout);
    hstate.hotels = generateHotels(hstate.query.city, hstate.query.checkin);

    document.title = `Hotels in ${hstate.query.city} | redBus`;
    setupModify();
    renderHotels();
    document.getElementById("hbConfirm").addEventListener("click", confirmHotel);
});
