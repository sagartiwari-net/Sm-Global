# Day 5 – Task 1: Netflix Homepage Clone

A responsive Netflix India clone built with **HTML5** and **Tailwind CSS**, including the full user flow: landing page → sign up / login → profile selection → browse (main Netflix UI).

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Netflix India landing page (hero, trending, FAQ, footer) |
| `login.html` | Sign in page with dark cinematic background |
| `signup.html` | 3-step membership signup (password → plan → payment) |
| `profiles.html` | "Who's watching?" profile picker |
| `browse.html` | Main Netflix browser UI after login |

## How to Run

1. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge).
2. No build step required — Tailwind CSS is loaded via CDN.

Or use a local server:

```bash
cd "Day 5/task1"
python3 -m http.server 8080
# Visit http://localhost:8080
```

## User Flow

1. **Landing** (`index.html`) → Click **Get Started** or **Sign In**
2. **Sign Up** (`signup.html`) → Enter email + password → Choose plan → Start membership
3. **Login** (`login.html`) → Enter credentials → Redirects to profiles
4. **Profiles** (`profiles.html`) → Select a profile → Opens browse page
5. **Browse** (`browse.html`) → Full Netflix-style home with hero banner & movie rows

## Demo Account

For quick testing without signing up:

- **Email:** `demo@netflix.com`
- **Password:** `demo123`

## Tech Stack

- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript (localStorage for auth/session)

## Features

- Responsive navbar with Netflix logo, language dropdown, Sign In button
- Full-screen hero with background image and dark overlay
- Email input + Get Started CTA
- Trending Now, More Reasons to Join, FAQ accordion
- Login & signup pages matching Netflix UI
- Profile selection screen
- Browse page with scrollable movie rows, hero banner, search & profile menu
- Mobile, tablet, and desktop breakpoints

## Project Structure

```
Day 5/task1/
├── index.html          # Landing page
├── login.html          # Sign in
├── signup.html         # Sign up flow
├── profiles.html       # Profile picker
├── browse.html         # Main Netflix UI
├── css/
│   └── custom.css      # Supplemental styles
├── js/
│   ├── auth.js         # Auth & session logic
│   └── browse.js       # Browse page rendering
└── README.md
```

## Note

This is an educational clone for learning purposes. All branding belongs to Netflix. Movie posters are sourced from TMDB public image URLs.
