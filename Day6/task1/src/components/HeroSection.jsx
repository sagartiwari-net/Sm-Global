import { heroContent } from '../data'

function HeroSection() {
  const scrollToContent = () => {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" aria-label="Zomato app download">
      <div className="hero__media" aria-hidden="true">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster={heroContent.background}
        >
          <source src={heroContent.video} type="video/mp4" />
        </video>
        <img src={heroContent.background} alt="" className="hero__fallback" />
      </div>
      <div className="hero__overlay" aria-hidden="true" />

      <div className="hero__content">
        <img src={heroContent.logo} alt="zomato" className="hero__logo" />
        <h1 className="hero__heading">
          India&rsquo;s #1
          <br />
          food delivery app
        </h1>
        <p className="hero__subheading">
          Experience fast &amp; easy online ordering
          <br />
          on the Zomato app
        </p>

        <div className="hero__stores">
          {heroContent.storeLinks.map((store) => (
            <a
              key={store.name}
              href={store.url}
              target="_blank"
              rel="noreferrer"
              className="hero__store-link"
              aria-label={store.name}
            >
              <img src={store.badge} alt={store.name} />
            </a>
          ))}
        </div>
      </div>

      <button type="button" className="hero__scroll" onClick={scrollToContent}>
        <span>Scroll down</span>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
        </svg>
      </button>
    </section>
  )
}

export default HeroSection
