import { Link } from 'react-router-dom'

export default function BannerRow({ items, columns = 1, className = '' }) {
  const cols =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 3
        ? 'grid-cols-1 sm:grid-cols-3'
        : columns === 5
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
          : columns === 6
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
            : 'grid-cols-1'

  return (
    <div className={`mx-auto grid max-w-[1400px] gap-0 px-0 sm:px-8 lg:px-12 ${cols} ${className}`}>
      {items.map((item, i) => (
        <Link key={item.id || item.src || i} to={item.href || '#'} className="block overflow-hidden">
          <img
            src={item.src}
            alt={item.alt || item.label || 'Banner'}
            className="w-full cursor-pointer object-cover transition-opacity hover:opacity-95"
            loading="lazy"
          />
        </Link>
      ))}
    </div>
  )
}
