import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { footerColumns, restaurants } from '../data'
import { getRestaurantProfile } from '../data/restaurantProfile'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { addToCart, decreaseQty, selectCartCount } from '../features/cart/cartSlice'

const TABS = [
  { id: 'info', label: 'Overview' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'photos', label: 'Photos' },
  { id: 'menu', label: 'Menu' },
  { id: 'book', label: 'Book a Table' },
  { id: 'order', label: 'Order Online' },
]

function findRestaurant(id, slug) {
  if (slug) return restaurants.find((r) => r.slug === slug)
  if (id) return restaurants.find((r) => String(r.id) === String(id))
  return null
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="#108145" aria-hidden>
      <path d="M14.75 8.3125L9.25 13.8125C9.125 13.9375 8.9375 14.0625 8.75 14.0625C8.5625 14.0625 8.375 14 8.1875 13.8125L5.1875 10.8125C4.875 10.5 4.875 10.0625 5.1875 9.75C5.5 9.4375 5.9375 9.4375 6.25 9.75L8.75 12.1875L13.6875 7.25C14 6.9375 14.4375 6.9375 14.75 7.25C15.0625 7.5625 15.0625 8 14.75 8.3125ZM17.0625 2.9375C13.125 -1 6.8125 -1 2.9375 2.9375C-0.9375 6.8125 -0.9375 13.1875 2.9375 17.0625C6.875 21 13.1875 21 17.125 17.0625C21.0625 13.125 21 6.8125 17.0625 2.9375Z" />
    </svg>
  )
}

function StarIcon({ color = '#fff' }) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill={color} aria-hidden>
      <path d="M6.76 6.8l-6.38 0.96c-0.22 0.040-0.38 0.22-0.38 0.44 0 0.12 0.040 0.24 0.12 0.32v0l4.64 4.76-1.1 6.66c0 0.020 0 0.040 0 0.080 0 0.24 0.2 0.44 0.44 0.44 0.1 0 0.16-0.020 0.24-0.060v0l5.7-3.12 5.68 3.12c0.060 0.040 0.14 0.060 0.22 0.060 0.24 0 0.44-0.2 0.44-0.44 0-0.040 0-0.060 0-0.080v0l-1.1-6.66 4.64-4.76c0.080-0.080 0.12-0.2 0.12-0.32 0-0.22-0.16-0.4-0.36-0.44h-0.020l-6.38-0.96-2.96-6.18c-0.060-0.12-0.18-0.2-0.32-0.2s-0.26 0.080-0.32 0.2v0z" />
    </svg>
  )
}

function RestaurantPage() {
  const { id, slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const base = findRestaurant(id, slug)
  const profile = useMemo(() => getRestaurantProfile(base), [base])
  const cart = useAppSelector((state) => state.cart)
  const cartCount = useAppSelector(selectCartCount)
  const user = useAppSelector((state) => state.auth.user)
  const [tab, setTab] = useState('info')

  if (!profile) {
    return (
      <div className="page-shell">
        <Navbar variant="solid" />
        <div className="container empty-page">
          <h1>Restaurant not found</h1>
          <Link to="/ncr/restaurants">Back to restaurants</Link>
        </div>
      </div>
    )
  }

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${profile.lat},${profile.lng}`
  const similar = restaurants
    .filter((r) => r.id !== profile.id && r.area?.includes(profile.area?.split(',')[0] || ''))
    .slice(0, 4)

  const qtyFor = (itemId) => {
    if (cart.restaurantId !== profile.id) return 0
    return cart.items.find((i) => i.id === itemId)?.qty || 0
  }

  const handleAdd = (item) => {
    if (!user) {
      navigate('/login')
      return
    }
    dispatch(
      addToCart({
        restaurantId: profile.id,
        restaurantName: profile.name,
        item,
      }),
    )
  }

  const [mainPhoto, ...sidePhotos] = profile.photos
  const gallerySides = sidePhotos.slice(0, 3)

  return (
    <div className="page-shell page-shell--ncr">
      <Navbar variant="solid" showSearch />

      <div className="container ncr-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/ncr/restaurants">Delhi NCR</Link>
        <span>/</span>
        <span>{profile.area?.split(',')[0] || 'Restaurants'}</span>
        <span>/</span>
        <strong>{profile.name}</strong>
      </div>

      <section className="rp-header container">
        <div className="rp-header__top">
          <div className="rp-header__left">
            <h1>{profile.name}</h1>
            <p className="rp-header__cuisine">
              {profile.cuisines.map((c, i) => (
                <span key={c}>
                  {i > 0 ? ', ' : ''}
                  <span className="rp-header__cuisine-link">{c}</span>
                </span>
              ))}
            </p>
            <p className="rp-header__address">{profile.address}</p>

            <div className="rp-header__status-row">
              <div className={`rp-open-pill${profile.openNow ? '' : ' is-closed'}`}>
                <span className="rp-open-pill__label">
                  {profile.openNow ? 'Open now' : profile.opensAt || 'Closed'}
                </span>
                {profile.openNow ? (
                  <span className="rp-open-pill__time">- {profile.timing}</span>
                ) : null}
              </div>
              <span className="rp-header__sep">|</span>
              <span className="rp-header__cost">{profile.cost}</span>
              {profile.phones[0] ? (
                <>
                  <span className="rp-header__sep">|</span>
                  <a className="rp-header__phone" href={`tel:${profile.phones[0]}`}>
                    {profile.phones[0]}
                  </a>
                  {profile.phones.length > 1 ? (
                    <span className="rp-header__more-phones">+{profile.phones.length - 1} more</span>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>

          <div className="rp-header__ratings">
            <div className="rp-rating">
              <div className="rp-rating__badge">
                <span>{profile.rating}</span>
                <StarIcon />
              </div>
              <div className="rp-rating__meta">
                <strong>{profile.diningReviews}</strong>
                <span>Dining Ratings</span>
              </div>
            </div>
            <div className="rp-rating">
              <div className="rp-rating__badge rp-rating__badge--delivery">
                <span>{profile.deliveryRating}</span>
                <StarIcon color={profile.deliveryRating === '-' ? '#3AB757' : '#fff'} />
              </div>
              <div className="rp-rating__meta">
                <strong>{profile.deliveryReviews}</strong>
                <span>Delivery Ratings</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rp-actions">
          <a className="rp-action" href={mapsUrl} target="_blank" rel="noreferrer">
            Direction
          </a>
          <button
            type="button"
            className="rp-action"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
          >
            Share
          </button>
          <button type="button" className="rp-action" onClick={() => setTab('reviews')}>
            Reviews
          </button>
          <button type="button" className="rp-action" onClick={() => setTab('book')}>
            Book a table
          </button>
        </div>
      </section>

      <section className="rp-gallery container" aria-label="Restaurant photos">
        <div className="rp-gallery__main">
          <img src={mainPhoto} alt={profile.name} />
        </div>
        <div className="rp-gallery__col">
          <div className="rp-gallery__tile">
            <img src={gallerySides[0] || mainPhoto} alt="" loading="lazy" />
          </div>
          <div className="rp-gallery__tile">
            <img src={gallerySides[1] || mainPhoto} alt="" loading="lazy" />
          </div>
        </div>
        <button
          type="button"
          className="rp-gallery__tile rp-gallery__more"
          onClick={() => setTab('photos')}
        >
          <img src={gallerySides[2] || mainPhoto} alt="" loading="lazy" />
          <span>View Gallery</span>
        </button>
      </section>

      <div className="resto-tabs-wrap">
        <div className="container resto-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`resto-tab${tab === t.id ? ' is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <section className="section container rp-body">
        <div className="rp-body__main">
          {tab === 'info' ? (
            <div className="rp-overview">
              <article className="rp-card">
                <h2>Dining Offers</h2>
                <p className="rp-card__hint">Tap on any offer to know more</p>
                <div className="rp-offers">
                  {profile.offers.map((offer) => (
                    <div
                      key={offer.heading + offer.title}
                      className={`rp-offer${offer.highlighted ? ' is-highlighted' : ''}`}
                    >
                      <h3>{offer.heading}</h3>
                      <strong>{offer.title}</strong>
                      <p>{offer.subtitle}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rp-card">
                <div className="rp-card__head">
                  <h2>Menu</h2>
                  <button type="button" className="rp-link-btn" onClick={() => setTab('menu')}>
                    See all menus ›
                  </button>
                </div>
                <h3 className="rp-cuisines-title">Cuisines</h3>
                <div className="rp-cuisine-pills">
                  {profile.cuisines.map((c) => (
                    <span key={c} className="rp-cuisine-pill">
                      ✦ {c} ✦
                    </span>
                  ))}
                </div>
                <button type="button" className="btn-primary rp-order-cta" onClick={() => setTab('order')}>
                  Order Online
                </button>
              </article>

              <article className="rp-card">
                <h2>People Say This Place Is Known For</h2>
                <p className="rp-known">{profile.knownFor}</p>
                <h2>Average Cost</h2>
                <p className="rp-cost-detail">{profile.costDetail}</p>
                <p className="rp-muted">Exclusive of applicable taxes and charges, if any</p>
                <p className="rp-muted">Digital payments accepted</p>
              </article>

              <article className="rp-card">
                <h2>More Info</h2>
                <div className="rp-highlights">
                  {profile.highlights.map((h) => (
                    <div key={h} className="rp-highlight">
                      <CheckIcon />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </article>

              {similar.length ? (
                <article className="rp-card">
                  <h2>Similar restaurants</h2>
                  <div className="rp-similar">
                    {similar.map((r) => (
                      <Link
                        key={r.id}
                        to={r.slug ? `/ncr/${r.slug}/info` : `/restaurant/${r.id}`}
                        className="rp-similar__card"
                      >
                        <img src={r.image} alt={r.name} loading="lazy" />
                        <h3>{r.name}</h3>
                        <p>{r.rating} ★ · {r.area}</p>
                      </Link>
                    ))}
                  </div>
                </article>
              ) : null}

              <article className="rp-card">
                <h2>Featured In</h2>
                <div className="rp-featured">
                  {profile.featuredCollections.map((c) => (
                    <Link key={c.slug} to={`/ncr/${c.slug}`} className="rp-featured__card">
                      <img src={c.image} alt={c.title} loading="lazy" />
                      <div className="rp-featured__overlay">
                        <p>{c.title}</p>
                        <span>{c.places} ›</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </article>

              <article className="rp-card">
                <h2>Review Highlights</h2>
                <div className="rp-review-tags">
                  {profile.reviewHighlights.map((t) => (
                    <button key={t} type="button" className="rp-review-tag" onClick={() => setTab('reviews')}>
                      {t}
                    </button>
                  ))}
                </div>
              </article>

              <article className="rp-card rp-report">
                <p className="rp-report__eyebrow">HELP US MAKE ZOMATO BETTER</p>
                <h2>Report an error in this listing</h2>
                <p className="rp-muted">Help us make Zomato more updated and relevant for everyone</p>
                <button type="button" className="rp-link-btn">
                  Report now ›
                </button>
              </article>
            </div>
          ) : null}

          {tab === 'order' || tab === 'menu' ? (
            <>
              <div className="section__head">
                <h2>{tab === 'menu' ? 'Menu' : 'Order Online'}</h2>
                {cartCount > 0 ? (
                  <Link to="/cart" className="menu-cart-link">
                    View cart ({cartCount})
                  </Link>
                ) : null}
              </div>
              <div className="menu-list">
                {profile.menu.map((item) => {
                  const qty = qtyFor(item.id)
                  return (
                    <article key={item.id} className="menu-item">
                      <div>
                        <span className={`menu-item__tag ${item.veg ? 'is-veg' : 'is-nonveg'}`}>
                          {item.veg ? 'VEG' : 'NON-VEG'}
                        </span>
                        <h3>{item.name}</h3>
                        <p>₹{item.price}</p>
                      </div>
                      {qty === 0 ? (
                        <button type="button" className="menu-item__add" onClick={() => handleAdd(item)}>
                          ADD
                        </button>
                      ) : (
                        <div className="qty-control">
                          <button type="button" onClick={() => dispatch(decreaseQty(item.id))}>
                            −
                          </button>
                          <span>{qty}</span>
                          <button type="button" onClick={() => handleAdd(item)}>
                            +
                          </button>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </>
          ) : null}

          {tab === 'reviews' ? (
            <div className="resto-placeholder">
              <h2>Reviews</h2>
              <p>Guest reviews for {profile.name} will appear here.</p>
              <div className="rp-review-tags">
                {profile.reviewHighlights.map((t) => (
                  <span key={t} className="rp-review-tag">
                    {t}
                  </span>
                ))}
              </div>
              <p className="resto-placeholder__rating">Average dining rating: {profile.rating} ★</p>
            </div>
          ) : null}

          {tab === 'photos' ? (
            <div className="resto-photos">
              <h2>Photos</h2>
              <div className="resto-photos__grid">
                {profile.photos.map((src, i) => (
                  <img key={src + i} src={src} alt={`${profile.name} ${i + 1}`} loading="lazy" />
                ))}
              </div>
            </div>
          ) : null}

          {tab === 'book' ? (
            <div className="resto-placeholder">
              <h2>Book a Table</h2>
              <p>Reserve a table at {profile.name}. Walk-ins also welcome during open hours.</p>
              <p className="resto-placeholder__rating">{profile.timing}</p>
              <button type="button" className="btn-primary">
                Request booking
              </button>
            </div>
          ) : null}
        </div>

        <aside className="rp-sidebar">
          <article className="rp-card rp-direction">
            <h2>Direction</h2>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="rp-direction__map">
              <img
                src={`https://maps.zomato.com/php/staticmap?center=${profile.lat},${profile.lng}&maptype=zomato&markers=${profile.lat},${profile.lng},pin_res32&sensor=false&scale=2&zoom=16&language=en&size=400x240`}
                alt="Map"
              />
            </a>
            <p>{profile.address}</p>
            <div className="rp-actions rp-actions--compact">
              <button
                type="button"
                className="rp-action"
                onClick={() => navigator.clipboard?.writeText(profile.address)}
              >
                Copy
              </button>
              <a className="rp-action" href={mapsUrl} target="_blank" rel="noreferrer">
                Direction
              </a>
            </div>
          </article>
        </aside>
      </section>

      <Footer columns={footerColumns} />
    </div>
  )
}

export default RestaurantPage
