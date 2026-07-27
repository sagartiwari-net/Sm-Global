import { featurePhoneFrame } from '../data'

const LEFT_FEATURES = ['Healthy', 'Veg Mode', 'Plan a Party', 'Gift Cards']
const RIGHT_FEATURES = ['Gourmet', 'Offers', 'Food on Train', 'Collections']

function FeatureShowcase({ features }) {
  const byTitle = Object.fromEntries(features.map((f) => [f.title, f]))
  const center = byTitle['Schedule your order']
  const left = LEFT_FEATURES.map((title) => byTitle[title]).filter(Boolean)
  const right = RIGHT_FEATURES.map((title) => byTitle[title]).filter(Boolean)

  if (!center) return null

  const formatTitle = (title) => {
    if (title === 'Plan a Party') return 'Plan\na Party'
    if (title === 'Food on Train') return 'Food on\nTrain'
    if (title === 'Gift Cards') return 'Gift Cards'
    return title
  }

  return (
    <section className="feature-showcase">
      <div className="container">
        <div className="feature-showcase__intro">
          <h2>
            What&rsquo;s waiting for you
            <br />
            on the app?
          </h2>
          <p>Our app is packed with features that enable you to experience food delivery like never before</p>
        </div>

        <div className="feature-showcase__stage">
          <div className="feature-side">
            {left.map((item, index) => (
              <article key={item.title} className={`feature-card ${index % 2 ? 'feature-card--offset' : ''}`}>
                <img src={item.image} alt="" aria-hidden="true" />
                <h3>{formatTitle(item.title)}</h3>
              </article>
            ))}
          </div>

          <div className="feature-phone">
            <img src={featurePhoneFrame} alt="" className="feature-phone__frame" aria-hidden="true" />
            <div className="feature-phone__screen">
              <img src={center.image} alt="" />
              <h3>
                Schedule
                <br />
                your order
              </h3>
            </div>
          </div>

          <div className="feature-side">
            {right.map((item, index) => (
              <article key={item.title} className={`feature-card ${index % 2 === 0 ? 'feature-card--offset' : ''}`}>
                <img src={item.image} alt="" aria-hidden="true" />
                <h3>{formatTitle(item.title)}</h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureShowcase
