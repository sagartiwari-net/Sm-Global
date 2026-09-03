import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

export default function CategoryCarousel({ title, items }) {
  const scroller = useRef(null)

  const scroll = (dir) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <section className="mx-auto max-w-[1400px] px-2 py-4 sm:px-8 lg:px-12">
      {title && (
        <h2 className="mb-3 px-2 text-xl font-bold uppercase tracking-wide text-smm-text sm:text-2xl">
          {title}
        </h2>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md lg:flex"
          aria-label="Previous"
        >
          <HiChevronLeft size={22} />
        </button>
        <div
          ref={scroller}
          className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth px-1 pb-2"
        >
          {items.map((item, i) => (
            <Link
              key={item.src + i}
              to={item.href || '#'}
              className="w-[140px] shrink-0 sm:w-[180px] lg:w-[196px]"
            >
              <img
                src={item.src}
                alt={item.label || 'Category'}
                className="w-full object-cover"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md lg:flex"
          aria-label="Next"
        >
          <HiChevronRight size={22} />
        </button>
      </div>
    </section>
  )
}
