export const PAGE_SIZE = 12

export const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Customer Rating' },
  { id: 'newest', label: 'Newest' },
]

/** Map SmmMynta-style nav routes → DummyJSON categories */
export const NAV_CATEGORY_MAP = {
  men: ['mens-shirts', 'mens-shoes', 'mens-watches'],
  women: [
    'tops',
    'womens-dresses',
    'womens-shoes',
    'womens-bags',
    'womens-jewellery',
    'womens-watches',
  ],
  kids: ['tops'],
  home: ['furniture', 'home-decoration', 'kitchen-accessories'],
  beauty: ['beauty', 'fragrances', 'skin-care'],
  genz: ['sunglasses', 'tops', 'mens-shirts'],
  jewellery: ['womens-jewellery'],
  handbags: ['womens-bags'],
  deals: null,
  all: null,
}

export function matchesNavCategory(product, navCategory) {
  if (!navCategory || navCategory === 'all') return true
  if (navCategory === 'deals') return product.discount >= 15
  const mapped = NAV_CATEGORY_MAP[navCategory]
  if (!mapped) {
    return (
      product.category === navCategory ||
      product.category?.includes(navCategory)
    )
  }
  return mapped.includes(product.category)
}

export function getUniqueBrands(products) {
  return [...new Set(products.map((p) => p.brand).filter(Boolean))].sort()
}

export function getUniqueCategories(products) {
  return [...new Set(products.map((p) => p.category).filter(Boolean))].sort()
}

export function getPriceBounds(products) {
  if (!products.length) return { min: 0, max: 50000 }
  const prices = products.map((p) => p.price)
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  }
}

export function formatCategory(slug) {
  return String(slug || '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function filterAndSortProducts(products, filters) {
  const {
    search = '',
    navCategory = 'all',
    categories = [],
    brands = [],
    minPrice,
    maxPrice,
    minRating = 0,
    sort = 'recommended',
  } = filters

  let list = products.filter((p) => matchesNavCategory(p, navCategory))

  const q = search.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    )
  }

  if (categories.length) {
    list = list.filter((p) => categories.includes(p.category))
  }
  if (brands.length) {
    list = list.filter((p) => brands.includes(p.brand))
  }
  if (typeof minPrice === 'number') {
    list = list.filter((p) => p.price >= minPrice)
  }
  if (typeof maxPrice === 'number') {
    list = list.filter((p) => p.price <= maxPrice)
  }
  if (minRating > 0) {
    list = list.filter((p) => p.rating >= minRating)
  }

  switch (sort) {
    case 'price-asc':
      list = [...list].sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      list = [...list].sort((a, b) => b.price - a.price)
      break
    case 'rating':
      list = [...list].sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      list = [...list].sort((a, b) => Number(b.id) - Number(a.id))
      break
    default:
      list = [...list].sort(
        (a, b) => b.rating - a.rating || b.discount - a.discount,
      )
  }

  return list
}

export function paginate(list, page, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize) || 1)
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    items: list.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    totalItems: list.length,
  }
}
