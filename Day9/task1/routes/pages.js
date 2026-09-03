const path = require('path')
const express = require('express')
const { validateContact } = require('../middleware/validateContact')

const router = express.Router()
const viewsDir = path.join(__dirname, '..', 'views')

/** Helper: send an HTML view from /views */
function sendView(res, fileName) {
  res.sendFile(path.join(viewsDir, fileName))
}

router.get('/', (req, res) => sendView(res, 'home.html'))
router.get('/about', (req, res) => sendView(res, 'about.html'))
router.get('/services', (req, res) => sendView(res, 'services.html'))
router.get('/contact', (req, res) => sendView(res, 'contact.html'))
router.get('/gallery', (req, res) => sendView(res, 'gallery.html'))

/**
 * Contact form POST
 * Validates input, logs the message, then redirects with success flag.
 * (No real email service — educational demo only.)
 */
router.post('/contact', validateContact, (req, res) => {
  const { name, email, message } = req.contact
  console.log('📩 New contact message:', { name, email, message })
  res.redirect('/contact?success=1')
})

module.exports = router
