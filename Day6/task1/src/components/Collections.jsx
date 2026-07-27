import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function Collections({ items }) {
  const railRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateArrows = useCallback(() => {
    const el = railRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 4)
    setCanNext(maxScroll > 4 && el.scrollLeft < maxScroll - 4)
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el) return

    updateArrows()

    const onResize = () => updateArrows()
    window.addEventListener('resize', onResize)

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateArrows) : null
    ro?.observe(el)

    return () => {
      window.removeEventListener('resize', onResize)
      ro?.disconnect()
    }
  }, [items, updateArrows])

  const scrollByCards = (direction) => {
    const el = railRef.current
    if (!el) return
    const card = el.querySelector('.collection-card')
    const gap = 16
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8
    el.scrollBy({ left: direction * step * 2, behavior: 'smooth' })
  }

  return (
    <section id="collections" className="section container ncr-collections">
      <div className="section__head">
        <div>
          <h2>Collections</h2>
          <p>
            Explore curated lists of top restaurants, cafes, pubs, and bars in Delhi NCR, based on
            trends
          </p>
        </div>
        <Link to="/ncr/secret-speakeasy-bars">All collections in Delhi NCR ›</Link>
      </div>

      <div className="collections-carousel">
        {canPrev ? (
          <button
            type="button"
            className="collections-carousel__btn collections-carousel__btn--prev"
            aria-label="Previous collections"
            onClick={() => scrollByCards(-1)}
          >
            ‹
          </button>
        ) : null}

        <div
          ref={railRef}
          className="collections-rail"
          onScroll={updateArrows}
        >
          {items.map((item) => (
            <Link
              key={item.slug || item.title}
              to={`/ncr/${item.slug}`}
              className="collection-card"
            >
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="collection-card__overlay">
                <h3>{item.title}</h3>
                <p>{item.places} ›</p>
              </div>
            </Link>
          ))}
        </div>

        {canNext ? (
          <button
            type="button"
            className="collections-carousel__btn collections-carousel__btn--next"
            aria-label="Next collections"
            onClick={() => scrollByCards(1)}
          >
            ›
          </button>
        ) : null}
      </div>
    </section>
  )
}

export default Collections
