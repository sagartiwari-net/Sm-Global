import { Link } from 'react-router-dom'

export default function MegaMenu({ category, onClose }) {
  if (!category) return null

  return (
    <div className="absolute left-0 top-full z-50 w-[min(1110px,92vw)] animate-slide-down bg-white py-4 pl-4 pr-2 shadow-[inset_0_0_8px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-5 gap-2">
        {category.columns.map((col, idx) => (
          <div
            key={col.title}
            className={`min-h-[280px] px-4 py-1 ${idx % 2 === 1 ? 'bg-[#f5f5f6]/40' : ''}`}
          >
            <Link
              to={category.href}
              onClick={onClose}
              className="mb-1 block text-sm font-bold capitalize leading-6"
              style={{ color: category.color }}
            >
              {col.title}
            </Link>
            <ul className="space-y-0.5">
              {col.links.map((link) => (
                <li key={link}>
                  <Link
                    to={category.href}
                    onClick={onClose}
                    className="block text-sm font-normal leading-[23px] text-smm-text hover:font-bold"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
