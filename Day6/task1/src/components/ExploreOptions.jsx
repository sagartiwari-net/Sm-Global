function ExploreOptions({ groups }) {
  return (
    <section className="section section--soft">
      <div className="container">
        <div className="section__head section__head--stacked">
          <div>
            <h2>Explore options near me</h2>
          </div>
        </div>

        <div className="explore-list">
          {groups.map((group, index) => (
            <details key={group.title} className="explore-item" open={index === 0}>
              <summary>{group.title}</summary>
              <p>{group.items.join(' • ')}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExploreOptions
