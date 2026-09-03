import { HiOutlineFilter } from 'react-icons/hi'
import { SORT_OPTIONS } from '../utils/productHelpers'

export default function SortBar({
  sort,
  onSortChange,
  totalItems,
  title,
  onOpenFilters,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-smm-border bg-white px-3 py-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          className="inline-flex items-center gap-1 border border-smm-border px-3 py-1.5 text-xs font-bold uppercase lg:hidden"
        >
          <HiOutlineFilter size={14} />
          Filters
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold capitalize sm:text-lg">
            {title}{' '}
            <span className="font-normal text-smm-muted">- {totalItems} items</span>
          </h1>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <span className="hidden text-smm-muted sm:inline">Sort by :</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-smm-border bg-white px-2 py-1.5 text-sm font-semibold outline-none focus:border-smm-pink"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
