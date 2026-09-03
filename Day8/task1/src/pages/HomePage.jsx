import { Link } from 'react-router-dom'
import BannerRow from '../components/BannerRow'
import CategoryCarousel from '../components/CategoryCarousel'
import ProductCard from '../components/ProductCard'
import ProductSkeleton from '../components/ProductSkeleton'
import {
  heroBanners,
  genderSplit,
  brandStrip,
  rtfBanner,
  sectionHeaders,
  categoryCarousels,
  shopByCategory,
  moreCategories,
  appBanner,
} from '../data/homeBanners'
import { useProducts } from '../hooks/useProducts'

export default function HomePage() {
  const { products, loading } = useProducts()
  const trending = products.slice(0, 6)

  return (
    <div className="pb-8">
      <div className="pt-2">
        <BannerRow items={heroBanners} />
      </div>

      <div className="mt-1">
        <BannerRow items={genderSplit} columns={2} />
      </div>

      <div className="mt-1">
        <BannerRow items={brandStrip} columns={3} />
      </div>

      <div className="mt-1">
        <BannerRow items={[rtfBanner]} />
      </div>

      <div className="mt-1">
        <BannerRow items={[sectionHeaders[0]]} />
      </div>

      {categoryCarousels.map((c) => (
        <CategoryCarousel key={c.id} title={c.title} items={c.items} />
      ))}

      <div className="mt-2">
        <BannerRow items={[sectionHeaders[1]]} />
      </div>

      <section className="mx-auto max-w-[1400px] px-2 py-4 sm:px-8 lg:px-12">
        <h2 className="mb-3 px-2 text-xl font-bold uppercase tracking-wide sm:text-2xl">
          Shop by Category
        </h2>
        <BannerRow items={shopByCategory} columns={6} className="!px-0" />
      </section>

      <section className="mx-auto max-w-[1400px] px-2 py-2 sm:px-8 lg:px-12">
        <BannerRow items={moreCategories} columns={6} className="!px-0" />
      </section>

      <div className="mt-2">
        <BannerRow items={[sectionHeaders[2]]} />
      </div>

      <section className="mx-auto max-w-[1400px] px-3 py-6 sm:px-8 lg:px-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold uppercase tracking-wide sm:text-2xl">Trending Now</h2>
          <Link to="/shop/all" className="text-sm font-semibold text-smm-pink">
            VIEW ALL
          </Link>
        </div>
        {loading ? (
          <ProductSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-4">
        <BannerRow items={[appBanner]} />
      </div>
    </div>
  )
}
