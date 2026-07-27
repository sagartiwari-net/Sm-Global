import SearchBar from './SearchBar'

function SearchSection({ locations }) {
  return (
    <section id="search" className="search-section">
      <div className="container search-section__inner">
        <h2>Find the best food &amp; drinks in Delhi NCR</h2>
        <SearchBar locations={locations} />
      </div>
    </section>
  )
}

export default SearchSection
