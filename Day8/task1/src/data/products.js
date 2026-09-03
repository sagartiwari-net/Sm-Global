export const products = [
  {
    id: 'p1',
    brand: 'Roadster',
    name: 'Men Solid Round Neck Cotton T-shirt',
    category: 'men',
    price: 399,
    mrp: 799,
    discount: 50,
    rating: 4.2,
    ratingCount: '28.4k',
    image:
      'https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/2472860/2024/1/17/c5c4f7f9-9f3e-4b5a-9c8f-1a2b3c4d5e6f1705480000000-Roadster-Men-Tshirts-1.jpg',
    fallback:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=520&fit=crop',
  },
  {
    id: 'p2',
    brand: 'HERE&NOW',
    name: 'Women Floral Print A-Line Dress',
    category: 'women',
    price: 799,
    mrp: 1999,
    discount: 60,
    rating: 4.1,
    ratingCount: '12.1k',
    image: '',
    fallback:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=520&fit=crop',
  },
  {
    id: 'p3',
    brand: 'HRX by Hrithik Roshan',
    name: 'Men Rapid Dry Running Shoes',
    category: 'men',
    price: 1499,
    mrp: 2999,
    discount: 50,
    rating: 4.3,
    ratingCount: '8.9k',
    image: '',
    fallback:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=520&fit=crop',
  },
  {
    id: 'p4',
    brand: 'Anouk',
    name: 'Women Embroidered Straight Kurta',
    category: 'women',
    price: 649,
    mrp: 1299,
    discount: 50,
    rating: 4.0,
    ratingCount: '15.2k',
    image: '',
    fallback:
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=520&fit=crop',
  },
  {
    id: 'p5',
    brand: 'Puma',
    name: 'Men Solid Mid-Rise Joggers',
    category: 'men',
    price: 1199,
    mrp: 2499,
    discount: 52,
    rating: 4.4,
    ratingCount: '6.7k',
    image: '',
    fallback:
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=520&fit=crop',
  },
  {
    id: 'p6',
    brand: 'Tokyo Talkies',
    name: 'Women High-Rise Skinny Fit Jeans',
    category: 'women',
    price: 899,
    mrp: 1799,
    discount: 50,
    rating: 3.9,
    ratingCount: '22.3k',
    image: '',
    fallback:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=520&fit=crop',
  },
  {
    id: 'p7',
    brand: 'US Polo Assn',
    name: 'Men Checked Casual Shirt',
    category: 'men',
    price: 1099,
    mrp: 2199,
    discount: 50,
    rating: 4.2,
    ratingCount: '9.1k',
    image: '',
    fallback:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=520&fit=crop',
  },
  {
    id: 'p8',
    brand: 'DressBerry',
    name: 'Women Solid Handbag',
    category: 'women',
    price: 899,
    mrp: 2499,
    discount: 64,
    rating: 4.1,
    ratingCount: '4.5k',
    image: '',
    fallback:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=520&fit=crop',
  },
  {
    id: 'p9',
    brand: 'H&M',
    name: 'Boys Printed Cotton T-shirt',
    category: 'kids',
    price: 499,
    mrp: 799,
    discount: 37,
    rating: 4.5,
    ratingCount: '3.2k',
    image: '',
    fallback:
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=520&fit=crop',
  },
  {
    id: 'p10',
    brand: 'Maybelline',
    name: 'New York Super Stay Matte Lipstick',
    category: 'beauty',
    price: 549,
    mrp: 699,
    discount: 21,
    rating: 4.3,
    ratingCount: '41k',
    image: '',
    fallback:
      'https://images.unsplash.com/photo-1586495777744-4413f2103256?w=400&h=520&fit=crop',
  },
  {
    id: 'p11',
    brand: 'Nike',
    name: 'Men Dri-FIT Training T-shirt',
    category: 'men',
    price: 1595,
    mrp: 1995,
    discount: 20,
    rating: 4.6,
    ratingCount: '11.8k',
    image: '',
    fallback:
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=520&fit=crop',
  },
  {
    id: 'p12',
    brand: 'ONLY',
    name: 'Women Solid Blazer',
    category: 'women',
    price: 1799,
    mrp: 3999,
    discount: 55,
    rating: 4.0,
    ratingCount: '2.9k',
    image: '',
    fallback:
      'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=520&fit=crop',
  },
]

export function getProductById(id) {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category) {
  if (!category || category === 'all' || category === 'deals') return products
  return products.filter((p) => p.category === category)
}
