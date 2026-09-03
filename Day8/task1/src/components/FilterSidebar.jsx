import { formatCategory } from '../utils/productHelpers'

const RATINGS = [4, 3, 2, 1]

export default function FilterSidebar({
  categories,
  brands,
  priceBounds,
  filters,
  onChange,
  onClear,
  mobileOpen,
  onCloseMobile,
}) {
  const toggleList = (key, value) => {
    const cur = filters[key] || []
    const next = cur.includes(value)
      ? cur.filter((v) => v !== value)
      : [...cur, value]
    onChange({ [key]: next })
  }

  const body = (
    <div className="divide-y divide-smm-border text-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-[14px] font-bold uppercase tracking-wide">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-bold text-smm-pink"
        >
          CLEAR ALL
        </button>
      </div>

      <section className="px-4 py-3">
        <h3 className="mb-2 text-[13px] font-bold uppercase">Categories</h3>
        <div className="max-h-40 space-y-2 overflow-y-auto">
          {categories.map((cat) => (
            <label key={cat} className="flex cursor-pointer items-center gap-2 text-[13px] text-smm-gray">
              <input
                type="checkbox"
                className="accent-smm-pink"
                checked={filters.categories.includes(cat)}
                onChange={() => toggleList('categories', cat)}
              />
              {formatCategory(cat)}
            </label>
          ))}
        </div>
      </section>

      <section className="px-4 py-3">
        <h3 className="mb-2 text-[13px] font-bold uppercase">Brand</h3>
        <div className="max-h-44 space-y-2 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-2 text-[13px] text-smm-gray">
              <input
                type="checkbox"
                className="accent-smm-pink"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleList('brands', brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </section>

      <section className="px-4 py-3">
        <h3 className="mb-2 text-[13px] font-bold uppercase">Price</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={filters.minPrice}
            min={priceBounds.min}
            max={filters.maxPrice}
            onChange={(e) => onChange({ minPrice: Number(e.target.value) || 0 })}
            className="border border-smm-border px-2 py-1.5 text-xs outline-none focus:border-smm-pink"
            placeholder="Min"
          />
          <input
            type="number"
            value={filters.maxPrice}
            min={filters.minPrice}
            max={priceBounds.max}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) || priceBounds.max })}
            className="border border-smm-border px-2 py-1.5 text-xs outline-none focus:border-smm-pink"
            placeholder="Max"
          />
        </div>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="mt-3 w-full accent-smm-pink"
        />
        <p className="mt-1 text-xs text-smm-muted">
          ₹{filters.minPrice} - ₹{filters.maxPrice}
        </p>
      </section>

      <section className="px-4 py-3">
        <h3 className="mb-2 text-[13px] font-bold uppercase">Rating</h3>
        <div className="space-y-2">
          {RATINGS.map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2 text-[13px] text-smm-gray">
              <input
                type="radio"
                name="rating-filter"
                className="accent-smm-pink"
                checked={filters.minRating === r}
                onChange={() => onChange({ minRating: r })}
              />
              {r}★ & above
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-smm-gray">
            <input
              type="radio"
              name="rating-filter"
              className="accent-smm-pink"
              checked={filters.minRating === 0}
              onChange={() => onChange({ minRating: 0 })}
            />
            All Ratings
          </label>
        </div>
      </section>
    </div>
  )

  return (
    <>
      <aside className="hidden w-[252px] shrink-0 self-start border border-smm-border bg-white lg:block">
        {body}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={onCloseMobile}
          />
          <aside className="absolute bottom-0 left-0 top-0 w-[min(100%,300px)] overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-smm-border px-4 py-3">
              <span className="font-bold">FILTERS</span>
              <button type="button" onClick={onCloseMobile} className="text-sm font-semibold">
                Close
              </button>
            </div>
            {body}
            <div className="sticky bottom-0 border-t border-smm-border bg-white p-3">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full bg-smm-pink py-3 text-sm font-bold text-white"
              >
                APPLY
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
