/**
 * Apexline — Express multi-page server (Day 9 Task 1)
 * Serves HTML views, static assets, and a custom 404 page.
 */

require('dotenv').config()

const path = require('path')
const express = require('express')
const morgan = require('morgan')
const pageRoutes = require('./routes/pages')
const { requestLogger } = require('./middleware/logger')

const app = express()
const PORT = process.env.PORT || 3009
const SITE_NAME = process.env.SITE_NAME || 'Apexline'

// --- View / static paths ---
const publicDir = path.join(__dirname, 'public')
const viewsDir = path.join(__dirname, 'views')

// --- Middleware ---
app.use(morgan('dev')) // HTTP request logging (bonus)
app.use(requestLogger) // Custom logger (bonus)
app.use(express.urlencoded({ extended: true })) // Parse contact form bodies
app.use(express.json())

// Serve CSS, JS, and images from /public
app.use(express.static(publicDir))

// Make site name available to templates via locals (for future expansion)
app.locals.siteName = SITE_NAME

// --- Routes (Express Router) ---
app.use('/', pageRoutes)

// --- Custom 404 for any unmatched route ---
app.use((req, res) => {
  res.status(404).sendFile(path.join(viewsDir, '404.html'))
})

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).send('Something went wrong. Please try again later.')
})

app.listen(PORT, () => {
  console.log(`✅ ${SITE_NAME} running at http://localhost:${PORT}`)
})
