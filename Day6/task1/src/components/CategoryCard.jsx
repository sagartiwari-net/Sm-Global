function CategoryCard({ title, subtitle, image }) {
  return (
    <article className="category-card">
      <img src={image} alt={title} />
      <div className="category-card__body">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </article>
  )
}

export default CategoryCard
