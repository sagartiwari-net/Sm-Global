import { goldDecor } from '../data'

function GoldBenefits({ items }) {
  return (
    <section className="gold-section">
      <div className="gold-section__curve gold-section__curve--top" aria-hidden="true" />
      <img src={goldDecor.coins[0]} alt="" className="gold-coin gold-coin--tl" aria-hidden="true" />
      <img src={goldDecor.coins[1]} alt="" className="gold-coin gold-coin--tr" aria-hidden="true" />
      <img src={goldDecor.coins[2]} alt="" className="gold-coin gold-coin--bc" aria-hidden="true" />

      <div className="gold-section__inner container">
        <img src={goldDecor.logo} alt="zomato GOLD" className="gold-logo" />
        <p className="gold-tagline">India&rsquo;s Top Savings Program for Food Lovers</p>
        <div className="gold-label">★ GOLD BENEFITS ★</div>

        <div className="gold-benefits">
          {items.map((item) => (
            <article key={item.title} className="gold-benefit-card">
              <img src={item.image} alt="" aria-hidden="true" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="gold-section__curve gold-section__curve--bottom" aria-hidden="true" />
    </section>
  )
}

export default GoldBenefits
