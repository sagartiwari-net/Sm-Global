/**
 * Apexline website chatbot
 * Answers only about this website: greetings, about, services, contact, gallery, pages.
 */

(function () {
  const SITE = {
    name: 'Apexline',
    tagline: 'Build clearer digital experiences with Apexline',
    about:
      'Apexline is a digital studio that designs and ships responsive websites, product landing pages, and brand systems. It started as an SMM Global learning project and is a complete Express.js multi-page demo with routing, static files, forms, and custom errors.',
    mission:
      'Make web foundations easy to understand: servers, routes, assets, and UX that feels intentional on every screen size.',
    process:
      'We clarify the goal, sketch the page map, ship a responsive UI, then harden the edges — validation, logging, and a proper 404.',
    stack: 'Node.js, Express.js, HTML5, CSS3, JavaScript (ES6), dotenv, nodemon, and morgan.',
    contact: {
      email: 'hello@apexline.demo',
      hours: 'Monday to Friday, 10:00–18:00 IST',
      response: 'Usually within 1 business day',
      page: '/contact',
    },
    pages: [
      { name: 'Home', path: '/', desc: 'Overview of Apexline and what we focus on.' },
      { name: 'About', path: '/about', desc: 'Mission, process, and studio story.' },
      { name: 'Services', path: '/services', desc: 'Full list of what we deliver.' },
      { name: 'Gallery', path: '/gallery', desc: 'Selected visual concepts and layouts.' },
      { name: 'Contact', path: '/contact', desc: 'Send a message through our validated form.' },
    ],
    services: [
      {
        id: 'websites',
        title: 'Multi-page websites',
        keywords: ['website', 'websites', 'multi-page', 'multipage', 'landing', 'site'],
        description:
          'We build multi-page websites with Home, About, Services, Contact, and Gallery — shared navigation and responsive layout for desktop, tablet, and mobile.',
      },
      {
        id: 'express',
        title: 'Express servers',
        keywords: ['express', 'server', 'nodejs', 'node', 'routing', 'api', 'backend'],
        description:
          'Clean Express.js servers with routing, static middleware, form handling, logging, and environment config (.env).',
      },
      {
        id: 'ui',
        title: 'UI polish',
        keywords: ['ui', 'ux', 'design', 'polish', 'animation', 'responsive', 'mobile'],
        description:
          'Motion, hierarchy, and mobile-first UI patterns that keep the experience cohesive and conversion-ready.',
      },
      {
        id: 'errors',
        title: 'Error handling',
        keywords: ['error', '404', 'validation', 'qa'],
        description:
          'Custom 404 pages and form validation feedback so broken paths and invalid inputs never feel abandoned.',
      },
      {
        id: 'content',
        title: 'Content structure',
        keywords: ['seo', 'content', 'meta', 'html', 'structure'],
        description:
          'Semantic HTML, meta tags, and readable copy structure for each page to support clarity and SEO basics.',
      },
      {
        id: 'launch',
        title: 'Launch support',
        keywords: ['launch', 'deploy', 'render', 'railway', 'readme', 'go live', 'hosting'],
        description:
          'README, npm scripts, and deploy-ready structure for hosts like Render or Railway.',
      },
    ],
  }

  const QUICK_REPLIES = [
    'What services do you offer?',
    'Tell me about Apexline',
    'How can I contact you?',
    'Show gallery info',
    'What pages are on this site?',
  ]

  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^\w\s@./-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function includesAny(text, words) {
    return words.some((w) => text.includes(w))
  }

  function hasWord(text, words) {
    const tokens = new Set(text.split(' '))
    return words.some((w) => {
      if (w.includes(' ')) return text.includes(w)
      return tokens.has(w)
    })
  }

  function serviceListReply() {
    const lines = SITE.services.map((s, i) => `${i + 1}. ${s.title} — ${s.description}`)
    return (
      `Apexline offers these services:\n\n${lines.join('\n\n')}\n\n` +
      `Want details on one service? Ask like “Tell me about Express servers” or “What is UI polish?”\n` +
      `Full list: /services`
    )
  }

  function findService(text) {
    let best = null
    let bestScore = 0
    for (const service of SITE.services) {
      let score = 0
      for (const key of service.keywords) {
        if (text.includes(key)) score += key.length > 4 ? 2 : 1
      }
      if (text.includes(normalize(service.title))) score += 3
      if (score > bestScore) {
        bestScore = score
        best = service
      }
    }
    return bestScore > 0 ? best : null
  }

  function getReply(rawInput) {
    const text = normalize(rawInput)

    if (!text) {
      return 'Please type a question about Apexline — for example services, about us, or contact details.'
    }

    // Greetings
    if (
      hasWord(text, [
        'hi',
        'hello',
        'hey',
        'namaste',
        'namaskar',
        'hola',
        'yo',
      ]) ||
      includesAny(text, ['good morning', 'good afternoon', 'good evening'])
    ) {
      if (text.split(' ').length <= 5) {
        return (
          `Hello! Welcome to ${SITE.name} support.\n\n` +
          `I can help with:\n• About us\n• Services & descriptions\n• Contact details\n• Gallery & site pages\n\n` +
          `What would you like to know?`
        )
      }
    }

    // Thanks / bye
    if (includesAny(text, ['thank', 'thanks', 'thx', 'shukriya', 'bye', 'goodbye'])) {
      return `You're welcome! If you need anything else about ${SITE.name}, just ask. Have a great day!`
    }

    // Contact
    if (
      includesAny(text, [
        'contact',
        'email',
        'phone',
        'call',
        'reach',
        'hours',
        'timing',
        'address',
        'message',
        'get in touch',
      ])
    ) {
      return (
        `Here’s how to reach ${SITE.name}:\n\n` +
        `• Email: ${SITE.contact.email}\n` +
        `• Hours: ${SITE.contact.hours}\n` +
        `• Typical response: ${SITE.contact.response}\n` +
        `• Contact form: ${SITE.contact.page}\n\n` +
        `On the Contact page you can send your name, email, and message. The form is validated on the server.`
      )
    }

    // About
    if (
      includesAny(text, [
        'about',
        'who are you',
        'who is',
        'company',
        'studio',
        'mission',
        'process',
        'story',
        'apexline',
        'what is this',
        'website about',
      ])
    ) {
      if (includesAny(text, ['mission'])) {
        return `Our mission: ${SITE.mission}\n\nMore on the About page: /about`
      }
      if (includesAny(text, ['process', 'how you work', 'how do you work'])) {
        return `How we work: ${SITE.process}\n\nMore: /about`
      }
      return (
        `About ${SITE.name}:\n\n${SITE.about}\n\n` +
        `Mission: ${SITE.mission}\n\n` +
        `Process: ${SITE.process}\n\n` +
        `Tech stack used on this site: ${SITE.stack}\n\n` +
        `Read more: /about`
      )
    }

    // Gallery
    if (includesAny(text, ['gallery', 'images', 'portfolio', 'visual', 'photos'])) {
      return (
        `The Gallery page shows selected visual concepts and layouts (brand panels, orbit study, wave field, UI blocks, and more).\n\n` +
        `Images are served as static files through Express.\n\n` +
        `Open gallery: /gallery`
      )
    }

    // Pages / navigation
    if (
      includesAny(text, [
        'pages',
        'page',
        'navigation',
        'menu',
        'routes',
        'sitemap',
        'where can i',
        'links',
      ])
    ) {
      const list = SITE.pages.map((p) => `• ${p.name} (${p.path}) — ${p.desc}`).join('\n')
      return `This website has these pages:\n\n${list}\n\nUse the top navigation to move between them.`
    }

    // Pricing
    if (includesAny(text, ['price', 'pricing', 'cost', 'charge', 'fee', 'quote', 'budget'])) {
      return (
        `${SITE.name} does not list fixed public prices on the site.\n\n` +
        `For a quote, go to /contact or email ${SITE.contact.email} with your project brief.`
      )
    }

    // Tech / how site built
    if (
      includesAny(text, [
        'tech',
        'technology',
        'stack',
        'built with',
        'node',
        'express',
        'framework',
      ])
    ) {
      return (
        `This ${SITE.name} website is built with: ${SITE.stack}\n\n` +
        `It demonstrates Express routing, static assets (CSS/JS/images), a contact form with validation, logging, and a custom 404 page.`
      )
    }

    // Specific service
    const matchedService = findService(text)
    if (
      matchedService &&
      includesAny(text, [
        'service',
        'services',
        'offer',
        'provide',
        'detail',
        'describe',
        'what is',
        'tell me',
        'about',
        ...matchedService.keywords,
      ])
    ) {
      // If user only asked for services list
      if (
        includesAny(text, ['services', 'service', 'offer', 'provide', 'what do you']) &&
        !matchedService.keywords.some((k) => text.includes(k) && k !== 'service' && k !== 'services')
      ) {
        // fall through unless they mentioned a specific service keyword beyond generic
      } else if (matchedService.keywords.some((k) => text.includes(k))) {
        return (
          `**${matchedService.title}**\n\n${matchedService.description}\n\n` +
          `See all services: /services\nContact us: /contact`
        )
      }
    }

    // Services list
    if (
      includesAny(text, [
        'services',
        'service',
        'offer',
        'offers',
        'provide',
        'what do you do',
        'packages',
        'deliver',
      ])
    ) {
      const specific = findService(text)
      if (specific && specific.keywords.some((k) => text.includes(k) && !['service', 'services'].includes(k))) {
        return (
          `**${specific.title}**\n\n${specific.description}\n\n` +
          `All services: /services`
        )
      }
      return serviceListReply()
    }

    // Help
    if (includesAny(text, ['help', 'support', 'assist', 'options'])) {
      return (
        `I can answer questions about this ${SITE.name} website only:\n\n` +
        `• Greetings\n• About us / mission / process\n• Services & each service description\n• Contact email, hours, form\n• Gallery\n• Site pages & navigation\n\n` +
        `Try: “What services do you offer?” or “How can I contact you?”`
      )
    }

    // Off-topic / unknown — stay on website context
    return (
      `I can only help with information about the ${SITE.name} website.\n\n` +
      `Try asking about:\n• About us\n• Services\n• Contact details\n• Gallery\n• Site pages\n\n` +
      `Example: “Tell me about Apexline” or “What is launch support?”`
    )
  }

  function createWidget() {
    if (document.getElementById('apex-chat')) return

    const root = document.createElement('div')
    root.id = 'apex-chat'
    root.innerHTML = `
      <button type="button" class="chat-launcher" aria-label="Open Apexline chat support" aria-expanded="false">
        <span class="chat-launcher-icon">💬</span>
        <span class="chat-launcher-text">Chat</span>
      </button>
      <section class="chat-panel" aria-label="Apexline chat support" aria-hidden="true">
        <header class="chat-header">
          <div>
            <p class="chat-title">Apexline Support</p>
            <p class="chat-subtitle">Ask about this website</p>
          </div>
          <button type="button" class="chat-close" aria-label="Close chat">×</button>
        </header>
        <div class="chat-messages" role="log" aria-live="polite"></div>
        <div class="chat-quick"></div>
        <form class="chat-form">
          <input type="text" class="chat-input" placeholder="Ask about services, about, contact..." autocomplete="off" />
          <button type="submit" class="chat-send">Send</button>
        </form>
      </section>
    `
    document.body.appendChild(root)

    const panel = root.querySelector('.chat-panel')
    const launcher = root.querySelector('.chat-launcher')
    const closer = root.querySelector('.chat-close')
    const messages = root.querySelector('.chat-messages')
    const form = root.querySelector('.chat-form')
    const input = root.querySelector('.chat-input')
    const quick = root.querySelector('.chat-quick')

    function isOpen() {
      return panel.classList.contains('is-open')
    }

    function addMessage(text, who) {
      const bubble = document.createElement('div')
      bubble.className = `chat-bubble chat-${who}`
      bubble.textContent = text
      messages.appendChild(bubble)
      messages.scrollTop = messages.scrollHeight
    }

    function botReply(text) {
      addMessage(text, 'bot')
    }

    function openChat() {
      panel.classList.add('is-open')
      panel.setAttribute('aria-hidden', 'false')
      launcher.setAttribute('aria-expanded', 'true')
      input.focus()
    }

    function closeChat(event) {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }
      panel.classList.remove('is-open')
      panel.setAttribute('aria-hidden', 'true')
      launcher.setAttribute('aria-expanded', 'false')
    }

    QUICK_REPLIES.forEach((label) => {
      const chip = document.createElement('button')
      chip.type = 'button'
      chip.className = 'chat-chip'
      chip.textContent = label
      chip.addEventListener('click', () => {
        addMessage(label, 'user')
        botReply(getReply(label))
      })
      quick.appendChild(chip)
    })

    launcher.addEventListener('click', () => {
      if (isOpen()) closeChat()
      else openChat()
    })
    closer.addEventListener('click', closeChat)

    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const value = input.value.trim()
      if (!value) return
      addMessage(value, 'user')
      input.value = ''
      window.setTimeout(() => botReply(getReply(value)), 250)
    })

    botReply(
      `Hi! I’m the ${SITE.name} website assistant.\nI can answer questions about our services, about us, contact details, gallery, and site pages.`,
    )
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget)
  } else {
    createWidget()
  }
})()
