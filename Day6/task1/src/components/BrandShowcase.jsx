import { eternalLogo } from '../data'
import { Link } from 'react-router-dom'

function BrandShowcase({ brands }) {
  return (
    <section className="brand-showcase">
      <div className="container">
        <div className="brand-showcase__header">
          <img src={eternalLogo} alt="eternal" className="eternal-logo" />
          <div className="eternal-divider">
            <span />
            <p>POWERING INDIA&rsquo;S CHANGING LIFESTYLES</p>
            <span />
          </div>
        </div>

        <div className="brand-grid">
          {brands.map((brand) => {
            const isInternal = brand.link.startsWith('/')
            const Tag = isInternal ? Link : 'a'
            const props = isInternal
              ? { to: brand.link }
              : { href: brand.link, target: '_blank', rel: 'noreferrer' }

            return (
              <article key={brand.title} className={`brand-card ${brand.accent}`}>
                <img src={brand.image} alt={brand.title} />
                <h3>{brand.title}</h3>
                <p>{brand.description}</p>
                <Tag {...props} className="brand-card__link">
                  Check it out <span aria-hidden="true">›</span>
                </Tag>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default BrandShowcase
