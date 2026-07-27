import { useAppDispatch } from '../hooks/useAppDispatch'
import { setLocation } from '../features/search/searchSlice'

function PopularLocalities({ items }) {
  const dispatch = useAppDispatch()

  const handleSelect = (name) => {
    dispatch(setLocation(name))
    document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="section container">
      <div className="section__head section__head--stacked">
        <div>
          <h2>Popular localities in and around Delhi NCR</h2>
        </div>
      </div>

      <div className="localities-grid">
        {items.map((item) => (
          <button key={item.name} type="button" className="locality-card" onClick={() => handleSelect(item.name)}>
            <div>
              <strong>{item.name}</strong>
              <p>{item.places}</p>
            </div>
            <span aria-hidden="true">›</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default PopularLocalities
