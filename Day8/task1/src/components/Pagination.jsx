import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, current, current - 1, current + 1])
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p))
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p))
  return [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = buildPages(page, totalPages)

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="inline-flex items-center gap-1 border border-smm-border px-3 py-2 text-sm font-semibold disabled:opacity-40"
      >
        <HiChevronLeft /> Previous
      </button>
      {pages.map((p, idx) => {
        const showEllipsis = idx > 0 && p - pages[idx - 1] > 1
        return (
          <span key={p} className="contents">
            {showEllipsis && <span className="px-1 text-smm-muted">…</span>}
            <button
              type="button"
              onClick={() => onChange(p)}
              className={`min-w-9 px-3 py-2 text-sm font-semibold ${
                p === page
                  ? 'bg-smm-pink text-white'
                  : 'border border-smm-border hover:border-smm-pink'
              }`}
            >
              {p}
            </button>
          </span>
        )
      })}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="inline-flex items-center gap-1 border border-smm-border px-3 py-2 text-sm font-semibold disabled:opacity-40"
      >
        Next <HiChevronRight />
      </button>
    </nav>
  )
}
