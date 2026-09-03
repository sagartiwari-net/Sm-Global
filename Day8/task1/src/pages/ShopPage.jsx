import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import FilterSidebar from '../components/FilterSidebar'
import SortBar from '../components/SortBar'
import Pagination from '../components/Pagination'
import ProductSkeleton from '../components/ProductSkeleton'
import { useProducts } from '../hooks/useProducts'
import { useDebounce } from '../hooks/useDebounce'
import {
  PAGE_SIZE,
  filterAndSortProducts,
  getPriceBounds,
  getUniqueBrands,
  getUniqueCategories,
  paginate,
} from '../utils/productHelpers'

const titles = {
  men: 'Men',
  women: 'Women',
  kids: 'Kids',
  home: 'Home',
  beauty: 'Beauty',
  genz: 'Genz',
  all: 'All Products',
  deals: 'Deal of the Day',
  jewellery: 'Jewellery',
  handbags: 'Handbags',
}

export default function ShopPage() {
  const { category = 'all' } = useParams()
  const [params] = useSearchParams()
  const urlQuery = params.get('q') || ''

  const { products, loading, error, refetch } = useProducts()
  const [search, setSearch] = useState(urlQuery)
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    minPrice: 0,
    maxPrice: 50000,
    minRating: 0,
    sort: 'recommended',
  })
  const [page, setPage] = useState(1)
  const [mobileFilters, setMobileFilters] = useState(false)
  const [priceReady, setPriceReady] = useState(false)

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    setSearch(urlQuery)
    setPage(1)
  }, [urlQuery, category])

  const priceBounds = useMemo(() => getPriceBounds(products), [products])

  useEffect(() => {
    if (!products.length || priceReady) return
    setFilters((f) => ({
      ...f,
      minPrice: priceBounds.min,
      maxPrice: priceBounds.max,
    }))
    setPriceReady(true)
  }, [products, priceBounds, priceReady])

  const scoped = useMemo(
    () =>
      filterAndSortProducts(products, {
        ...filters,
        search: debouncedSearch,
        navCategory: category,
      }),
    [products, filters, debouncedSearch, category],
  )

  // For filter options, use products already matching nav category (ignore other filters except nav)
  const navScoped = useMemo(
    () =>
      filterAndSortProducts(products, {
        navCategory: category,
        search: '',
        categories: [],
        brands: [],
        minPrice: priceBounds.min,
        maxPrice: priceBounds.max,
        minRating: 0,
        sort: 'recommended',
      }),
    [products, category, priceBounds],
  )

  const filterBrands = useMemo(() => getUniqueBrands(navScoped), [navScoped])
  const filterCategories = useMemo(() => getUniqueCategories(navScoped), [navScoped])

  const { items, page: safePage, totalPages, totalItems } = useMemo(
    () => paginate(scoped, page, PAGE_SIZE),
    [scoped, page],
  )

  useEffect(() => {
    if (safePage !== page) setPage(safePage)
  }, [safePage, page])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page, category])

  const updateFilters = (patch) => {
    setFilters((f) => ({ ...f, ...patch }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      minPrice: priceBounds.min,
      maxPrice: priceBounds.max,
      minRating: 0,
      sort: 'recommended',
    })
    setSearch('')
    setPage(1)
  }

  const title = titles[category] || category

  return (
    <div className="min-h-[70vh] bg-white">
      <div className="border-b border-smm-border bg-smm-bg px-3 py-2 text-xs text-smm-muted sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1400px]">
          <Link to="/" className="hover:text-smm-pink">
            Home
          </Link>
          <span className="mx-1">/</span>
          <span className="font-semibold capitalize text-smm-text">{title}</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] gap-0 lg:gap-0">
        <FilterSidebar
          categories={filterCategories}
          brands={filterBrands}
          priceBounds={priceBounds}
          filters={filters}
          onChange={updateFilters}
          onClear={clearFilters}
          mobileOpen={mobileFilters}
          onCloseMobile={() => setMobileFilters(false)}
        />

        <div className="min-w-0 flex-1 border-l border-smm-border">
          <SortBar
            sort={filters.sort}
            onSortChange={(sort) => updateFilters({ sort })}
            totalItems={totalItems}
            title={title}
            onOpenFilters={() => setMobileFilters(true)}
          />

          <div className="border-b border-smm-border px-3 py-2 sm:px-4 lg:hidden">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by product name"
              className="w-full border border-smm-border bg-smm-bg px-3 py-2 text-sm outline-none focus:border-smm-pink"
            />
          </div>

          <div className="hidden border-b border-smm-border px-4 py-2 lg:block">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by product name / brand"
              className="w-full max-w-md border border-smm-border bg-smm-bg px-3 py-2 text-sm outline-none focus:border-smm-pink focus:bg-white"
            />
          </div>

          <div className="p-3 sm:p-4">
            {error && (
              <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <p className="font-semibold">Could not load products</p>
                <p className="mt-1">{error}</p>
                <button
                  type="button"
                  onClick={refetch}
                  className="mt-2 bg-smm-pink px-4 py-1.5 text-xs font-bold text-white"
                >
                  RETRY
                </button>
              </div>
            )}

            {loading ? (
              <ProductSkeleton />
            ) : items.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-lg font-bold">No products found</p>
                <p className="mt-1 text-sm text-smm-muted">
                  Try changing filters or search.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 border border-smm-pink px-4 py-2 text-sm font-bold text-smm-pink"
                >
                  CLEAR FILTERS
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
