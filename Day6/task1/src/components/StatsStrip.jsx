function StatsStrip({ stats }) {
  return (
    <section id="stats" className="stats-section" aria-label="Zomato statistics">
      <div className="container">
        <div className="stats-strip">
          {stats.map((item) => (
            <article key={item.label} className="stat-card">
              <div>
                <h3>{item.value}</h3>
                <p>{item.label}</p>
              </div>
              <img src={item.image} alt="" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsStrip
