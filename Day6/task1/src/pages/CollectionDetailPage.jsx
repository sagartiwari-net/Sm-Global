import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { footerColumns } from '../data'
import { getCollectionBySlug, getMoreCollections } from '../data/collectionsData'

function ratingClass(rating) {
  const n = Number(rating)
  if (!n || Number.isNaN(n)) return 'is-muted'
  if (n >= 4.5) return 'is-excellent'
  if (n >= 4) return 'is-great'
  if (n >= 3.5) return 'is-good'
  return 'is-ok'
}

function CollectionDetailPage() {
  const { slug } = useParams()
  const collection = getCollectionBySlug(slug)
  const more = getMoreCollections(slug)

  if (!collection) {
    return (
      <div className="page-shell">
        <Navbar variant="solid" />
        <div className="container empty-page">
          <h1>Collection not found</h1>
          <Link to="/ncr/restaurants">Back to restaurants</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell page-shell--ncr">
      <Navbar variant="solid" showSearch />

      <div className="container ncr-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/ncr/restaurants">Delhi NCR</Link>
        <span>/</span>
        <Link to="/ncr/restaurants#collections">Collections</Link>
        <span>/</span>
        <strong>{collection.title}</strong>
      </div>

      <section className="collection-hero">
        <div className="collection-hero__media">
          <img src={collection.heroImage} alt={collection.title} />
          <div className="collection-hero__shade" />
          <div className="collection-hero__copy">
            <p className="collection-hero__eyebrow">ZOMATO COLLECTIONS</p>
            <h1>{collection.title}</h1>
            <p className="collection-hero__desc">{collection.description}</p>
            <p className="collection-hero__places">{collection.placesLabel}</p>
          </div>
          <div className="collection-hero__actions">
            <button type="button" className="collection-hero__save">
              <span aria-hidden>+</span> Save Collection
            </button>
            <button type="button" className="collection-hero__share" aria-label="Share">
              ↗
            </button>
          </div>
        </div>
      </section>

      <section className="section container collection-places">
        <div className="collection-places__grid">
          {collection.restaurants.map((item) => (
            <article key={item.id} className="collection-place-card">
              <Link to={`/ncr/${item.slug}/info`} className="collection-place-card__media">
                <img src={item.image} alt={item.name} />
                {item.offer ? (
                  <div className="collection-place-card__offer">
                    <img
                      src="https://b.zmtcdn.com/data/o2_assets/c0e0fe766225fb9cdb3245a9915571201716296953.png"
                      alt=""
                    />
                    <span>{item.offer}</span>
                  </div>
                ) : null}
              </Link>
              <div className="collection-place-card__body">
                <Link to={`/ncr/${item.slug}/info`} className="collection-place-card__name">
                  {item.name}
                </Link>
                <div className="collection-place-card__rating-row">
                  <span className={`collection-place-card__rating ${ratingClass(item.rating)}`}>
                    {item.rating} ★
                  </span>
                  <span className="collection-place-card__dining">DINING</span>
                </div>
                <p className="collection-place-card__cuisine">{item.cuisine}</p>
                <p className="collection-place-card__area">{item.area}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section container collection-more">
        <h2>More Collections</h2>
        <div className="collection-more__grid">
          {more.map((item) => (
            <Link key={item.slug} to={`/ncr/${item.slug}`} className="collection-card">
              <img src={item.image} alt={item.title} />
              <div className="collection-card__overlay">
                <h3>{item.title}</h3>
                <p>{item.places} ›</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer columns={footerColumns} />
    </div>
  )
}

export default CollectionDetailPage
