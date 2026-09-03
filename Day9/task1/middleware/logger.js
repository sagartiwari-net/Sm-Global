/**
 * Request logger middleware
 * Logs method, URL, and response time for every request.
 */
function requestLogger(req, res, next) {
  const started = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - started
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`)
  })
  next()
}

module.exports = { requestLogger }
