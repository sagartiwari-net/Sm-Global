import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi'
import { fetchProductById } from '../api/products'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import { addToBag } from '../features/bag/bagSlice'
import { toggleWishlist, selectIsWishlisted } from '../features/wishlist/wishlistSlice'
import { openBag } from '../features/ui/uiSlice'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const wishlisted = useSelector(selectIsWishlisted(id))
  const { products } = useProducts()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [size, setSize] = useState('')
  const [sizeError, setSizeError] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    setSize('')
    setActiveImg(0)
    fetchProductById(id)
      .then((p) => {
        if (alive) setProduct(p)
      })
      .catch((err) => {
        if (alive) {
          setError(err?.message || 'Failed to load product')
          setProduct(null)
        }
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] animate-pulse px-3 py-6 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[3/4] bg-smm-border" />
          <div className="space-y-3">
            <div className="h-6 w-1/3 bg-smm-border" />
            <div className="h-5 w-2/3 bg-smm-border" />
            <div className="h-10 w-1/2 bg-smm-border" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="mb-4 text-lg font-bold">{error || 'Product not found'}</p>
        <Link to="/shop/all" className="font-semibold text-smm-pink">
          Back to shopping
        </Link>
      </div>
    )
  }

  const gallery = product.images?.length
    ? product.images
    : [product.image || product.fallback].filter(Boolean)
  const sizes = product.sizes?.length ? product.sizes : ['Onesize']
  const needsSize = !(sizes.length === 1 && sizes[0] === 'Onesize')
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const bagPayload = () => ({
    ...product,
    size: size || sizes[0],
    image: product.image || gallery[0],
  })

  const ensureSize = () => {
    if (needsSize && !size) {
      setSizeError(true)
      return false
    }
    return true
  }

  return (
    <div className="mx-auto max-w-[1200px] px-3 py-6 sm:px-8">
      <nav className="mb-4 text-xs text-smm-muted">
        <Link to="/">Home</Link>
        <span className="mx-1">/</span>
        <Link to={`/shop/${product.category}`} className="capitalize">
          {product.category}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-smm-text">{product.brand}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden bg-smm-bg">
            <img
              src={gallery[activeImg]}
              alt={product.name}
              className="mx-auto max-h-[640px] w-full object-cover"
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-14 shrink-0 overflow-hidden border-2 ${
                    activeImg === i ? 'border-smm-pink' : 'border-smm-border'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.brand}</h1>
          <p className="mt-1 text-lg text-smm-muted">{product.name}</p>
          <div className="mt-3 inline-flex items-center gap-1 rounded border border-smm-border px-2 py-1 text-sm font-bold">
            {product.rating} ★{' '}
            <span className="font-normal text-smm-muted">
              | {product.ratingCount} Ratings
            </span>
          </div>

          <div className="mt-4 border-t border-smm-border pt-4">
            <p className="text-xl">
              <span className="font-bold">₹{product.price}</span>{' '}
              <span className="text-base text-smm-muted line-through">
                MRP ₹{product.mrp}
              </span>{' '}
              <span className="text-base font-bold text-[#ff905a]">
                ({product.discount}% OFF)
              </span>
            </p>
            <p className="mt-1 text-sm font-semibold text-[#03a685]">
              inclusive of all taxes
            </p>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold tracking-wide">SELECT SIZE</p>
              {sizeError && (
                <p className="text-xs font-semibold text-smm-pink">Please select a size</p>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSize(s)
                    setSizeError(false)
                  }}
                  className={`min-w-12 rounded-full border px-3 py-2.5 text-sm font-bold ${
                    size === s
                      ? 'border-smm-pink bg-[#fff4f4] text-smm-pink'
                      : 'border-smm-border'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (!ensureSize()) return
                dispatch(addToBag(bagPayload()))
                dispatch(openBag())
              }}
              className="min-w-[200px] flex-1 bg-smm-pink py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-smm-pink-dark"
            >
              Add to Bag
            </button>
            <button
              type="button"
              onClick={() => dispatch(toggleWishlist(product))}
              className="flex min-w-[160px] items-center justify-center gap-2 border border-smm-border py-3.5 text-sm font-bold uppercase"
            >
              {wishlisted ? <HiHeart className="text-smm-pink" /> : <HiOutlineHeart />}
              Wishlist
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!ensureSize()) return
              dispatch(addToBag(bagPayload()))
              navigate('/checkout')
            }}
            className="mt-3 w-full border border-smm-text py-3.5 text-sm font-bold uppercase"
          >
            Buy Now
          </button>

          <ul className="mt-8 space-y-2 text-sm text-smm-gray">
            <li>{product.description}</li>
            <li>100% Original Products</li>
            <li>Pay on delivery might be available</li>
            <li>Easy 14 days returns and exchanges</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold">Similar Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
