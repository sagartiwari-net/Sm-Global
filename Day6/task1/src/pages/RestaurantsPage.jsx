import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Collections from '../components/Collections'
import Footer from '../components/Footer'
import { useAppSelector } from '../hooks/useAppSelector'
import { selectFilteredRestaurants, selectQuery } from '../features/search/searchSelectors'
import {
  collections,
  diningFilters,
  diningRestaurants,
  diningTabs,
  footerColumns,
} from '../data'

function RestaurantsPage() {
  const [activeTab, setActiveTab] = useState('dining')
  const [activeFilter, setActiveFilter] = useState('')
  const filtered = useAppSelector(selectFilteredRestaurants)
  const query = useAppSelector(selectQuery)

  const diningList = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return diningRestaurants.filter((item) => {
      if (!normalized) return true
      const blob = [item.name, item.cuisine, item.dish, item.area].join(' ').toLowerCase()
      return blob.includes(normalized)
    })
  }, [query])

  const list = activeTab === 'delivery' ? filtered : diningList

  return (
    <div className="page-shell page-shell--ncr">
      <Navbar variant="solid" showSearch />

      <div className="container ncr-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>India</span>
        <span>/</span>
        <strong>Delhi NCR Restaurants</strong>
      </div>

      <div className="ncr-tabs-wrap">
        <div className="container ncr-tabs" role="tablist" aria-label="Browse mode">
          {diningTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`ncr-tab${activeTab === tab.id ? ' is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="ncr-tab__icon">
                <img src={tab.image} alt="" />
              </span>
              <span className="ncr-tab__label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'dining' ? <Collections items={collections} /> : null}

      <div className="ncr-filters-wrap">
        <div className="container ncr-filters">
          {diningFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`ncr-filter${activeFilter === filter ? ' is-active' : ''}`}
              onClick={() => setActiveFilter((prev) => (prev === filter ? '' : filter))}
            >
              {filter === 'Filters' ? '☰ Filters' : filter}
            </button>
          ))}
        </div>
      </div>

      <section id="restaurants" className="section container ncr-listing">
        <h1>
          {activeTab === 'delivery' ? 'Delivery Restaurants in Delhi NCR' : 'Restaurants in Delhi NCR'}
        </h1>

        <div className="ncr-grid">
          {list.length ? (
            list.map((item) => (
              <Link
                key={item.id}
                to={item.slug ? `/ncr/${item.slug}/info` : `/restaurant/${item.id}`}
                className="ncr-card"
              >
                <div className="ncr-card__media">
                  {item.promoted ? <span className="ncr-card__badge">Promoted</span> : null}
                  <img src={item.image} alt={item.name} />
                  {item.offer ? (
                    <div className="ncr-card__offer">
                      <img
                        src="https://b.zmtcdn.com/data/o2_assets/c0e0fe766225fb9cdb3245a9915571201716296953.png"
                        alt=""
                      />
                      <span>{item.offer}</span>
                    </div>
                  ) : null}
                </div>
                <div className="ncr-card__body">
                  <div className="ncr-card__top">
                    <h3>{item.name}</h3>
                    <span>{item.rating} ★</span>
                  </div>
                  <div className="ncr-card__line">
                    <p>{item.cuisine}</p>
                    <small>{item.cost}</small>
                  </div>
                  <div className="ncr-card__line">
                    <p>{item.area}</p>
                    <small>{item.distance || item.deliveryTime}</small>
                  </div>
                  {item.opensAt ? <p className="ncr-card__closed">{item.opensAt}</p> : null}
                </div>
              </Link>
            ))
          ) : (
            <div className="empty-state">
              <h3>No results found</h3>
              <p>Try another dish, cuisine, or location.</p>
            </div>
          )}
        </div>
      </section>

      <Footer columns={footerColumns} />
    </div>
  )
}

export default RestaurantsPage
