import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 15000,
})

const INR = 83

export function mapProduct(p) {
  const usd = Number(p.price) || 0
  const discount = Math.round(Number(p.discountPercentage) || 0)
  const price = Math.round(usd * INR)
  const mrp =
    discount > 0 ? Math.round(price / (1 - discount / 100)) : price

  return {
    id: String(p.id),
    name: p.title,
    brand: p.brand || 'Generic',
    category: p.category || 'uncategorized',
    price,
    mrp,
    discount,
    rating: Number(Number(p.rating || 0).toFixed(1)),
    ratingCount: `${Math.max(120, (p.stock || 1) * 87)}`,
    image: p.thumbnail || p.images?.[0] || '',
    fallback: p.images?.[1] || p.images?.[0] || p.thumbnail || '',
    images: p.images?.length ? p.images : [p.thumbnail].filter(Boolean),
    description: p.description || '',
    stock: p.stock ?? 0,
    sizes: guessSizes(p.category),
    material: 'As per brand',
    createdAt: p.meta?.createdAt || null,
  }
}

function guessSizes(category = '') {
  if (/shoe/i.test(category)) return ['6', '7', '8', '9', '10', '11']
  if (/watch|bag|jewellery|fragrance|beauty|skin|grocery|furniture|decoration|kitchen|phone|laptop|tablet|vehicle|motorcycle|accessory/i.test(category)) {
    return ['Onesize']
  }
  return ['S', 'M', 'L', 'XL', 'XXL']
}

export async function fetchAllProducts() {
  const { data } = await api.get('/products', { params: { limit: 0 } })
  const products = (data.products || []).map(mapProduct)
  return { products, total: data.total ?? products.length }
}

export async function fetchProductById(id) {
  const { data } = await api.get(`/products/${id}`)
  return mapProduct(data)
}
