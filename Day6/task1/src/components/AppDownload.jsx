import { useState } from 'react'

function AppDownload() {
  const [mode, setMode] = useState('email')
  const [value, setValue] = useState('')
  const [note, setNote] = useState('')

  const handleShare = (e) => {
    e.preventDefault()
    if (!value.trim()) {
      setNote('Please enter a valid email or phone number')
      return
    }
    setNote(`App link shared to your ${mode}`)
    setValue('')
  }

  return (
    <section id="app" className="app-download">
      <div className="container app-download__inner">
        <div className="app-download__illustration" aria-hidden="true">
          <div className="phone-mockup">
            <span>zomato</span>
            <p>India&apos;s #1 food delivery app</p>
          </div>
        </div>

        <div className="app-download__content">
          <h2>Get the Zomato app</h2>
          <p>We will send you a link, open it on your phone to download the app.</p>

          <div className="app-download__toggle">
            <label>
              <input
                type="radio"
                name="share"
                checked={mode === 'email'}
                onChange={() => setMode('email')}
              />{' '}
              Email
            </label>
            <label>
              <input
                type="radio"
                name="share"
                checked={mode === 'phone'}
                onChange={() => setMode('phone')}
              />{' '}
              Phone
            </label>
          </div>

          <form className="app-download__form" onSubmit={handleShare}>
            <input
              type={mode === 'email' ? 'email' : 'tel'}
              placeholder={mode === 'email' ? 'Email' : 'Phone'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label={mode === 'email' ? 'Email' : 'Phone'}
            />
            <button type="submit">Share App Link</button>
          </form>
          {note ? <p className="app-download__note">{note}</p> : null}

          <p className="app-download__note">Download app from</p>
          <div className="store-badges">
            <a href="https://play.google.com" target="_blank" rel="noreferrer">
              Get it on Google Play
            </a>
            <a href="https://www.apple.com/app-store/" target="_blank" rel="noreferrer">
              Download on the App Store
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AppDownload
