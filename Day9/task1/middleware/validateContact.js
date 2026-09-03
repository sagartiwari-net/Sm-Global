/**
 * Contact form validation middleware
 * Ensures name, email, and message meet basic requirements.
 */
function validateContact(req, res, next) {
  const name = String(req.body.name || '').trim()
  const email = String(req.body.email || '').trim()
  const message = String(req.body.message || '').trim()

  const errors = []

  if (name.length < 2) {
    errors.push('Name must be at least 2 characters.')
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) {
    errors.push('Please enter a valid email address.')
  }

  if (message.length < 10) {
    errors.push('Message must be at least 10 characters.')
  }

  if (errors.length) {
    return res.redirect(
      `/contact?error=${encodeURIComponent(errors.join(' '))}`,
    )
  }

  // Attach cleaned values for the route handler
  req.contact = { name, email, message }
  next()
}

module.exports = { validateContact }
