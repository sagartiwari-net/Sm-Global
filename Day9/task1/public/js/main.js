/**
 * Apexline client script
 * - Mobile nav toggle
 * - Active link highlight
 * - Contact query alerts (success / error)
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle')
  const links = document.querySelector('.nav-links')

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open')
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
    })
  }

  // Highlight current page in the nav
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  document.querySelectorAll('.nav-links a').forEach((anchor) => {
    const href = anchor.getAttribute('href')
    if (href === path || (path === '/' && href === '/')) {
      anchor.classList.add('active')
    }
  })

  // Contact page feedback from query string
  const params = new URLSearchParams(window.location.search)
  const alertBox = document.querySelector('[data-contact-alert]')
  if (alertBox) {
    if (params.get('success') === '1') {
      alertBox.className = 'alert alert-success'
      alertBox.textContent = 'Thanks! Your message was received. We will get back to you soon.'
      alertBox.hidden = false
    } else if (params.get('error')) {
      alertBox.className = 'alert alert-error'
      alertBox.textContent = params.get('error')
      alertBox.hidden = false
    }
  }
})
