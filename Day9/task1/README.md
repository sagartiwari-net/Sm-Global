# Apexline — Day 9 Task 1

Multi-page website built with **Node.js** and **Express.js** for the SMM Global training assignment.

## Project Overview

**Apexline** is a responsive studio website that demonstrates:

- Express server setup on a custom port
- Dynamic routing for multiple pages
- Static file serving (CSS / JS / images)
- Shared navigation across pages
- Custom **404 Not Found** page
- Bonus: Express Router, dotenv, morgan logging, contact form validation, nodemon

## Features

| Feature | Status |
|---------|--------|
| Home / About / Services / Contact | ✅ |
| Gallery (optional) | ✅ |
| Common navbar | ✅ |
| Static middleware | ✅ |
| Custom 404 | ✅ |
| Responsive UI | ✅ |
| Contact form + validation | ✅ Bonus |
| Logging middleware | ✅ Bonus |
| Environment variables | ✅ Bonus |
| Express Router | ✅ Bonus |
| Website chatbot (trained on site content) | ✅ Bonus |

## Folder Structure

```text
Day9/task1/
├── public/
│   ├── css/style.css
│   ├── images/
│   └── js/
│       ├── main.js
│       └── chatbot.js
├── views/
│   ├── home.html
│   ├── about.html
│   ├── services.html
│   ├── contact.html
│   ├── gallery.html
│   └── 404.html
├── routes/pages.js
├── middleware/
│   ├── logger.js
│   └── validateContact.js
├── server.js
├── package.json
├── .env.example
└── README.md
```

## Installation Steps

```bash
cd Day9/task1
npm install
cp .env.example .env   # optional — defaults already work
npm run dev            # nodemon (development)
# or
npm start              # production
```

Open **http://localhost:3009**

## Technologies Used

- Node.js
- Express.js
- HTML5 / CSS3 / JavaScript (ES6)
- dotenv
- morgan
- nodemon

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Home |
| GET | `/about` | About |
| GET | `/services` | Services |
| GET | `/contact` | Contact form |
| POST | `/contact` | Submit message (validated) |
| GET | `/gallery` | Gallery |
| * | anything else | Custom 404 |

## Screenshots

Add screenshots after running locally:

```md
![Home](./screenshots/home.png)
![404](./screenshots/404.png)
```

## GitHub Repository Link

_Add after push:_ `https://github.com/<your-username>/<repo>`

## Live Project URL

Deploy on **Render** or **Railway**:

1. Push this folder to GitHub
2. Create a new Web Service
3. Root directory: `Day9/task1`
4. Build: `npm install`
5. Start: `npm start`
6. Set env `PORT` if the host requires it (Express already uses `process.env.PORT`)

_Add live URL here after deploy._

## License

Educational use — SMM Global Day 9 Task 1.
