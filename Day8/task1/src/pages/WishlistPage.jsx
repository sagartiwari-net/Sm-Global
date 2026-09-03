import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard'

export default function WishlistPage() {
  const items = useSelector((s) => s.wishlist.items)

  return (
    <div className="mx-auto max-w-[1400px] px-3 py-6 sm:px-8 lg:px-12">
      <h1 className="mb-6 text-2xl font-bold">
        My Wishlist <span className="text-base font-normal text-smm-muted">{items.length} items</span>
      </h1>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="mb-2 text-lg font-bold">Your wishlist is empty</p>
          <p className="mb-6 text-sm text-smm-muted">Save items you love for later.</p>
          <Link
            to="/shop/all"
            className="inline-block border border-smm-pink px-6 py-2.5 text-sm font-bold uppercase text-smm-pink"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
