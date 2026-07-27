import { Link } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import { selectFilteredRestaurants, selectLocation, selectQuery } from '../features/search/searchSelectors'

function RestaurantGrid() {
  const items = useAppSelector(selectFilteredRestaurants)
  const query = useAppSelector(selectQuery)
  const location = useAppSelector(selectLocation)

  return (
    <section id="restaurants" className="section container">
      <div className="section__head section__head--stacked">
        <div>
          <h2>Best food outlets around you</h2>
          <p>
            {items.length} restaurant results for <strong>{query || 'all cuisines'}</strong>
            {location !== 'All' ? ` in ${location}` : ' across Delhi NCR'}.
          </p>
        </div>
      </div>

      <div className="restaurants-grid">
        {items.length ? (
          items.map((item) => (
            <Link
              key={item.id}
              to={item.slug ? `/ncr/${item.slug}/info` : `/restaurant/${item.id}`}
              className="restaurant-card"
            >
              <img src={item.image} alt={item.name} />
              <div className="restaurant-card__body">
                <div className="restaurant-card__top">
                  <h3>{item.name}</h3>
                  <span>{item.rating} ★</span>
                </div>
                <div className="restaurant-card__line">
                  <p>{item.cuisine}</p>
                  <small>{item.cost}</small>
                </div>
                <div className="restaurant-card__line">
                  <p>{item.dish}</p>
                  <small>{item.area}</small>
                </div>
                <p className="restaurant-card__eta">{item.deliveryTime}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-state">
            <h3>No results found</h3>
            <p>Try another dish, cuisine, or location to see more restaurants.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default RestaurantGrid
