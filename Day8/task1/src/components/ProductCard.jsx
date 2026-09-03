import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi'
import { toggleWishlist, selectIsWishlisted } from '../features/wishlist/wishlistSlice'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const wishlisted = useSelector(selectIsWishlisted(product.id))
  const img = product.image || product.fallback || product.thumbnail

  return (
    <article className="group relative flex flex-col">
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden bg-smm-bg">
        <img
          src={img}
          alt={product.name}
          className="aspect-[3/4] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
          onError={(e) => {
            if (product.fallback && e.currentTarget.src !== product.fallback) {
              e.currentTarget.src = product.fallback
            }
          }}
        />
        <span className="absolute bottom-2 left-2 rounded bg-white/90 px-1.5 py-0.5 text-[11px] font-bold">
          {product.rating} ★ | {product.ratingCount}
        </span>
      </Link>

      <button
        type="button"
        onClick={() => dispatch(toggleWishlist(product))}
        className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 shadow"
        aria-label="Wishlist"
      >
        {wishlisted ? (
          <HiHeart className="text-smm-pink" size={18} />
        ) : (
          <HiOutlineHeart size={18} />
        )}
      </button>

      <Link to={`/product/${product.id}`} className="px-1 pt-2">
        <h3 className="truncate text-sm font-bold text-smm-text">{product.brand}</h3>
        <p className="truncate text-[13px] text-smm-muted">{product.name}</p>
        <p className="mt-1 text-sm">
          <span className="font-bold">₹{product.price}</span>{' '}
          <span className="text-xs text-smm-muted line-through">₹{product.mrp}</span>{' '}
          <span className="text-xs font-semibold text-[#ff905a]">({product.discount}% OFF)</span>
        </p>
      </Link>

      <Link
        to={`/product/${product.id}`}
        className="mt-2 block w-full border border-smm-border py-1.5 text-center text-xs font-bold uppercase tracking-wide text-smm-text hover:border-smm-pink hover:text-smm-pink"
      >
        View Product
      </Link>
    </article>
  )
}
