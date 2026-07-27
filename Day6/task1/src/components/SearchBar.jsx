import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { setLocation, setQuery } from '../features/search/searchSlice'
import { selectLocation, selectQuery } from '../features/search/searchSelectors'
import { localities } from '../data'

function SearchBar() {
  const dispatch = useAppDispatch()
  const location = useAppSelector(selectLocation)
  const query = useAppSelector(selectQuery)

  return (
    <div className="search-panel">
      <div className="search-panel__location">
        <span className="search-icon search-icon--location" aria-hidden="true">
          ●
        </span>
        <select
          value={location}
          onChange={(e) => dispatch(setLocation(e.target.value))}
          aria-label="Select location"
        >
          <option value="All">Delhi NCR</option>
          {localities.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="search-panel__divider" aria-hidden="true"></div>

      <div className="search-panel__input">
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          placeholder="Search for restaurant, cuisine or a dish"
          aria-label="Search restaurants, cuisines or dishes"
        />
      </div>
    </div>
  )
}

export default SearchBar
