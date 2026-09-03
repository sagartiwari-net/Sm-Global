import { useCallback, useEffect, useState } from 'react'
import { fetchAllProducts } from '../api/products'

let cache = null

export function useProducts() {
  const [products, setProducts] = useState(cache?.products || [])
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllProducts()
      cache = data
      setProducts(data.products)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load products. Please try again.',
      )
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (cache) {
      setProducts(cache.products)
      setLoading(false)
      return
    }
    load()
  }, [load])

  return { products, loading, error, refetch: load }
}
