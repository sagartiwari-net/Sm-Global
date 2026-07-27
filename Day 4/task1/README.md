# redBus Landing Page + Booking App 🚌

A responsive, modern **RedBus-inspired website** built with **Bootstrap 5**, HTML5, CSS3, and vanilla JavaScript. Created for **Day 4 – Task 1**.

Beyond a landing page, it now includes a **fully working booking flow** (bus, train, and hotel) with a **My Bookings account** — all powered by mock data and `localStorage`, no backend needed.

> Inspired by the official [redBus website](https://www.redbus.in/). This is a demo project for learning purposes only.

---

## 🔄 How it works (booking flow)

```
index.html   → search Bus / Train / Hotel
   │
   ├─ Bus/Train → results.html  (list + filters + sorting)
   │                 │  choose → booking.html
   │                 │            (seat map → passengers → fare → pay)
   │                 ▼
   │              account.html  ← booking saved (localStorage)
   │
   └─ Hotel    → hotels.html   (list → book modal)
                     ▼
                  account.html  ← booking saved
```

- **Sign In** is required to book (lightweight — name/email/phone stored locally).
- Bookings appear in **My Bookings** where you can view details or cancel.

---

## ✨ Features

- **Responsive Navbar** – transparent on top, turns solid on scroll, collapses into a hamburger menu on mobile, with scrollspy active-link highlighting.
- **Hero Section** – full-screen banner with gradient overlay and an interactive **bus ticket search form** (From, To, Date, Search) plus Bus/Train/Hotel tabs.
  - City **swap** button, **Today/Tomorrow** quick-date picks, "Booking for women" toggle, and form validation.
- **Animated Stats** – count-up numbers (users, operators, routes, years) that animate on scroll.
- **Trending Offers** – coupon cards with one-click **Copy Code** to clipboard.
- **Popular Routes** – grid of hover-animated route cards with starting prices.
- **Why Choose Us** – 8 service feature cards with animated icons.
- **App Download** – gradient section with store buttons, QR box, and a floating phone mockup.
- **Testimonials** – Bootstrap **carousel** with customer reviews and star ratings.
- **FAQ** – Bootstrap **accordion** with common booking questions.
- **Newsletter CTA** + **professional footer** with social links, quick links, and route chips.
- **Extras** – back-to-top button, toast notifications, scroll-reveal animations, reduced-motion support.
- **Fully responsive** across desktop, tablet, and mobile.

### 🎫 Working booking app (mock data + localStorage)

- **Bus search results** (`results.html`) – filters (AC/Non-AC, sleeper/seater, departure time, price, rating, Primo) + sorting (departure, price, duration, rating, seats).
- **Train search results** – trains with class-wise pricing (SL, 3A, 2A, 1A, CC).
- **Seat selection** (`booking.html`) – interactive seat map, boarding/dropping points, passenger details per seat, contact info, live fare summary with tax.
- **Hotel search** (`hotels.html`) – hotel list with rooms/guests/room-type selection and booking modal.
- **Sign in / Register** – lightweight auth stored in `localStorage`.
- **My Bookings account** (`account.html`) – profile, filter by type (bus/train/hotel), view full ticket details, and cancel bookings.

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3** (custom theme + animations)
- **Bootstrap 5.3** (via CDN)
- **Bootstrap Icons 1.11** (via CDN)
- **JavaScript (ES6+)** – no dependencies
- **Google Fonts** – Poppins

---

## 📁 Folder Structure

```
task1/
├── index.html         # Landing page + Bus/Train/Hotel search
├── results.html       # Bus/Train results (filters + sorting)
├── booking.html       # Seat selection + passenger details
├── hotels.html        # Hotel list + booking
├── account.html       # My Bookings (profile, view, cancel)
├── css/
│   └── style.css
├── js/
│   ├── store.js       # Shared: auth + bookings (localStorage)
│   ├── script.js      # Landing page interactions
│   ├── results.js     # Bus/Train mock data + filter/sort
│   ├── booking.js     # Seat map + booking creation
│   ├── hotels.js      # Hotel mock data + booking
│   └── account.js     # Bookings list + cancel
└── README.md
```

> **Data note:** All buses, trains, and hotels are generated as realistic **mock data** (seeded random, so the same route always shows the same results). Bookings and the signed-in user are stored in the browser's `localStorage`. No backend or real API is used.

---

## 🚀 Getting Started

No build step required — it's a static site.

1. **Clone / download** this folder.
2. Open `index.html` in any modern browser.

> Tip: For the best experience, use the **Live Server** VS Code extension (right-click `index.html` → "Open with Live Server").

Bootstrap and icons load from a CDN, so an internet connection is needed on first load.

---

## 🌐 Deployment

Deploy the folder to any static host:

- **GitHub Pages** – push to a repo, then Settings → Pages → deploy from `main` branch.
- **Netlify** – drag & drop the `task1` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
- **Vercel** – `vercel` CLI or import the repo at [vercel.com](https://vercel.com).

---

## 📱 Responsiveness

Tested layouts for:

- **Desktop** (≥ 992px) – full multi-column grids
- **Tablet** (768px–991px) – adjusted columns, solid navbar
- **Mobile** (< 768px) – stacked layout, hamburger menu, scroll-friendly hero

---

## 📄 License

For educational/demo use only. "redBus" name, logo, and brand belong to their respective owner (MakeMyTrip). No copyright infringement intended.
