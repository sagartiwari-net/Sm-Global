export function toSlug(name) {
  return String(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const diningMenu = (prefix) => [
  { id: `${prefix}-1`, name: 'Chef Special Platter', price: 599, veg: false },
  { id: `${prefix}-2`, name: 'Signature Veg Bowl', price: 349, veg: true },
  { id: `${prefix}-3`, name: 'House Mocktail', price: 249, veg: true },
  { id: `${prefix}-4`, name: 'Dessert of the Day', price: 299, veg: true },
]

function place({
  id,
  name,
  cuisine,
  area,
  rating,
  image,
  offer = '',
  cost = '₹2,500 for two',
}) {
  const slug = `${toSlug(name)}-${toSlug(area.split(',')[0])}`
  return {
    id,
    name,
    slug,
    cuisine,
    dish: cuisine.split(',')[0].trim(),
    area,
    rating,
    cost,
    deliveryTime: 'Dine-out',
    distance: '',
    offer,
    promoted: false,
    image:
      image ||
      'https://b.zmtcdn.com/images/res_avatar_476_320_1x_new.png?output-format=webp',
    menu: diningMenu(`c${id}`),
  }
}

const speakeasyPlaces = [
  place({
    id: 21185999,
    name: 'Thanks & Beyond',
    cuisine: 'Lebanese, Italian',
    area: 'Nehru Place, New Delhi',
    rating: 3.9,
  }),
  place({
    id: 300716,
    name: 'Cocktails & Dreams, Speakeasy',
    cuisine: 'Finger Food, Tibetan, Thai, Beverages',
    area: 'Sector 15, Gurgaon',
    rating: 4.9,
    image:
      'https://b.zmtcdn.com/data/pictures/6/300716/6bb12e0f332eb411bc45861a838c77fc.jpg?output-format=webp',
  }),
  place({
    id: 20914563,
    name: 'CALA - Curated Kitchen & Bar',
    cuisine: 'Pasta, Pizza',
    area: 'Shahpur Jat, New Delhi',
    rating: 4.1,
    image:
      'https://b.zmtcdn.com/data/pictures/3/20914563/7bb4b935150d91d4b6b27a612c8a9eae.jpg?output-format=webp',
  }),
  place({
    id: 305890,
    name: 'The Backyard',
    cuisine: 'Chinese, Mexican, Pizza, Continental, Italian, Japanese',
    area: 'Punjabi Bagh, New Delhi',
    rating: 4.1,
    offer: 'Flat 10% OFF',
    image:
      'https://b.zmtcdn.com/data/pictures/0/305890/400b2e67a3f0b398eab78d8997e25591.jpg?output-format=webp',
  }),
  place({
    id: 22287568,
    name: 'Barbet & Pals',
    cuisine: 'Modern Indian, Bar Food',
    area: 'Greater Kailash 2 (GK2), New Delhi',
    rating: 4.3,
  }),
  place({
    id: 21898898,
    name: 'Echoes',
    cuisine: 'Pizza, Coffee, Momos, Burger, Pasta, Shake, Chinese',
    area: 'Sector 5, Dwarka, New Delhi',
    rating: 4.5,
    offer: 'Flat 10% OFF',
  }),
  place({
    id: 18765048,
    name: 'Sidecar',
    cuisine: 'Asian, Mediterranean, Coffee, Beverages',
    area: 'Greater Kailash 2 (GK2), New Delhi',
    rating: 4.5,
    image:
      'https://b.zmtcdn.com/data/pictures/8/18765048/1de82baa37a2f4a577a79eec9e427972.jpg?output-format=webp',
  }),
  place({
    id: 19679037,
    name: 'Lair',
    cuisine: 'Asian, Thai',
    area: 'Vasant Vihar, New Delhi',
    rating: 4.5,
    image:
      'https://b.zmtcdn.com/data/pictures/7/19679037/da6aa494a394cd033113b1fd55f6459c.jpeg?output-format=webp',
  }),
  place({
    id: 301085,
    name: 'PCO',
    cuisine: 'Italian, Fast Food, Continental',
    area: 'Vasant Vihar, New Delhi',
    rating: 4.8,
    image:
      'https://b.zmtcdn.com/data/pictures/5/301085/97c0a61e09f83526a3a1ee64c2e32396.jpg?output-format=webp',
  }),
  place({
    id: 20951901,
    name: "The Green Room By Mia's",
    cuisine: 'Continental',
    area: 'Greater Kailash 2 (GK2), New Delhi',
    rating: 4.4,
    image:
      'https://b.zmtcdn.com/data/pictures/1/20951901/8ae2ff35b8d8edf011ccbdc64153dc79.jpg?output-format=webp',
  }),
  place({
    id: 22476992,
    name: 'AABBCC',
    cuisine: 'Bar Food, Continental',
    area: 'Vasant Vihar, New Delhi',
    rating: 4.5,
  }),
  place({
    id: 20933911,
    name: 'Genre',
    cuisine: 'European, Coffee, Cafe, Salad, Sandwich, Desserts, Beverages',
    area: 'Defence Colony, New Delhi',
    rating: 4.4,
    image:
      'https://b.zmtcdn.com/data/pictures/1/20933911/9d79442daf5a879af1f868a85e6f4dd7.jpg?output-format=webp',
  }),
  place({
    id: 21531870,
    name: 'Asper',
    cuisine: 'European, Middle Eastern, Continental',
    area: 'Sector 26, Gurgaon',
    rating: 4.9,
    offer: 'Flat 10% OFF',
    image:
      'https://b.zmtcdn.com/data/pictures/0/21531870/ad95cd6b50bd72e06cca927c3d996e19.jpg?output-format=webp',
  }),
  place({
    id: 22305217,
    name: 'Mr Button',
    cuisine: 'European, Asian, Italian, Modern Indian',
    area: 'Greater Kailash 3 (GK3), New Delhi',
    rating: 4.3,
  }),
  place({
    id: 311220,
    name: 'The Secret Garden At Music & Mountains',
    cuisine: 'Italian, Continental, Burger, Desserts',
    area: 'Greater Kailash 1 (GK1), New Delhi',
    rating: 4.7,
    offer: 'Flat 10% OFF',
    image:
      'https://b.zmtcdn.com/data/pictures/0/311220/779e59b6ed70f2284391e72e22c69609.jpg?output-format=webp',
  }),
  place({
    id: 22544566,
    name: 'Together',
    cuisine: 'Bar Food, Continental',
    area: 'Vasant Vihar, New Delhi',
    rating: 3.9,
  }),
  place({
    id: 22203492,
    name: 'Cafe Delhi Heights Ikigai',
    cuisine: 'Chinese, Pizza, Cafe',
    area: 'R K Puram, New Delhi',
    rating: 4.4,
  }),
  place({
    id: 22488011,
    name: 'The Dressing Room',
    cuisine: 'Bar Food',
    area: 'Vasant Vihar, New Delhi',
    rating: 3.7,
  }),
  place({
    id: 20753515,
    name: 'Harp By Maruchi',
    cuisine: 'Asian, Chinese, Sushi, Bar Food, Desserts',
    area: 'Lado Sarai, New Delhi',
    rating: 0,
    image:
      'https://b.zmtcdn.com/data/pictures/5/20753515/36fb49fc1d4bb85e45c27272a3e882e7.jpg?output-format=webp',
  }),
  place({
    id: 20626087,
    name: "Hoots'",
    cuisine: 'Bar Food',
    area: 'Vasant Vihar, New Delhi',
    rating: 4.1,
    image:
      'https://b.zmtcdn.com/data/pictures/7/20626087/f7011707572619fd2b6806473b96beb6.jpg?output-format=webp',
  }),
  place({
    id: 22458593,
    name: 'Painkiller',
    cuisine: 'Thai',
    area: 'Hauz Khas, New Delhi',
    rating: 4.3,
  }),
  place({
    id: 21487528,
    name: 'Somewhere Nowhere',
    cuisine: 'Bar Food',
    area: 'Greater Kailash 2 (GK2), New Delhi',
    rating: 3.6,
  }),
  place({
    id: 21792014,
    name: 'Shokupan - The Sandwich Shop',
    cuisine: 'Sandwich, Japanese',
    area: 'Vasant Vihar, New Delhi',
    rating: 3.6,
    image:
      'https://b.zmtcdn.com/data/pictures/4/21792014/2cd3c4b4fb291a964a8d6fe19e4d4c94_o2_featured_v2.jpg?output-format=webp',
  }),
  place({
    id: 22098718,
    name: 'Refuge',
    cuisine: 'Coffee, Bar Food, Asian',
    area: 'Greater Kailash 2 (GK2), New Delhi',
    rating: 4.5,
  }),
]

/** Collection pages keyed by URL slug (e.g. /ncr/secret-speakeasy-bars) */
export const collectionDetails = {
  'insta-worthy': {
    slug: 'insta-worthy',
    title: 'Insta-worthy spots',
    placesLabel: '99 Places',
    description:
      'Picture-perfect cafes, rooftops and restaurants made for your next feed — curated for Delhi NCR.',
    heroImage:
      'https://b.zmtcdn.com/data/collections/5cbe9bc87c9da2c6954772540d2e5db5_1730709895.png',
    restaurants: speakeasyPlaces.slice(0, 8).map((r, i) => ({
      ...r,
      id: 71000 + i,
      slug: `insta-${r.slug}`,
      menu: diningMenu(`iw${i}`),
    })),
  },
  'omakase-bars': {
    slug: 'omakase-bars',
    title: 'Omakase bars',
    placesLabel: '10 Places',
    description:
      'Chef-led omakase counters and intimate sushi bars where the menu is a curated experience.',
    heroImage:
      'https://b.zmtcdn.com/data/collections/29a1053b9dc17770c25e849df32b7a8f_1752236513.png',
    restaurants: speakeasyPlaces.slice(2, 10).map((r, i) => ({
      ...r,
      id: 72000 + i,
      slug: `oma-${r.slug}`,
      menu: diningMenu(`oma${i}`),
    })),
  },
  'secret-speakeasy-bars': {
    slug: 'secret-speakeasy-bars',
    title: 'Secret speakeasy bars',
    placesLabel: '24 Places',
    description:
      'Discover our curated list of speakeasies! From secret entrances to vintage cocktails, offering dim lit ambience and unique vibe with a modern twist.',
    heroImage:
      'https://b.zmtcdn.com/data/collections/db88ca761013058b5aea267c3b7b6ab1_1741170544.png',
    restaurants: speakeasyPlaces,
  },
  'great-cafes': {
    slug: 'great-cafes',
    title: 'Must visit cafes',
    placesLabel: '60 Places',
    description:
      'Coffee, brunch and cosy corners — the best cafes across Delhi NCR worth a visit.',
    heroImage:
      'https://b.zmtcdn.com/data/collections/92bf1f87ad0a90b94007e79b13eb592c_1727266460.png',
    restaurants: speakeasyPlaces.slice(5, 13).map((r, i) => ({
      ...r,
      id: 73000 + i,
      slug: `cafe-${r.slug}`,
      menu: diningMenu(`cf${i}`),
    })),
  },
  'iconic-restaurants': {
    slug: 'iconic-restaurants',
    title: 'Iconic restaurants',
    placesLabel: '54 Places',
    description:
      'Timeless favourites and landmark restaurants that define dining in Delhi NCR.',
    heroImage:
      'https://b.zmtcdn.com/data/collections/5188e2b754e6b8cfc7622bb94a798f55_1746185735.png',
    restaurants: speakeasyPlaces.slice(1, 9).map((r, i) => ({
      ...r,
      id: 74000 + i,
      slug: `icon-${r.slug}`,
      menu: diningMenu(`ic${i}`),
    })),
  },
  'chef-tasting-menu': {
    slug: 'chef-tasting-menu',
    title: "Chef's Tasting Menus",
    placesLabel: '11 Places',
    description:
      'Multi-course tasting journeys from chefs who turn dinner into a story.',
    heroImage:
      'https://b.zmtcdn.com/data/collections/046e954e15a95a6eec29a6bf0c17175c_1732697144.png',
    restaurants: speakeasyPlaces.slice(8, 16).map((r, i) => ({
      ...r,
      id: 75000 + i,
      slug: `chef-${r.slug}`,
      menu: diningMenu(`ch${i}`),
    })),
  },
  'pizza-time': {
    slug: 'pizza-time',
    title: 'Fancy pizza finds',
    placesLabel: '40 Places',
    description:
      'Wood-fired, thin crust and gourmet pies — Delhi NCR’s standout pizza spots.',
    heroImage:
      'https://b.zmtcdn.com/data/collections/68113c6bddb038ac936a1f63bcf5262e_1705558396.png',
    restaurants: speakeasyPlaces.slice(3, 11).map((r, i) => ({
      ...r,
      id: 76000 + i,
      slug: `piz-${r.slug}`,
      menu: diningMenu(`pz${i}`),
    })),
  },
}

export function getCollectionBySlug(slug) {
  return collectionDetails[slug] || null
}

export function getAllCollectionRestaurants() {
  const seen = new Set()
  const list = []
  Object.values(collectionDetails).forEach((col) => {
    col.restaurants.forEach((r) => {
      if (!seen.has(r.id)) {
        seen.add(r.id)
        list.push(r)
      }
    })
  })
  return list
}

export function getMoreCollections(excludeSlug) {
  return Object.values(collectionDetails)
    .filter((c) => c.slug !== excludeSlug)
    .map((c) => ({
      title: c.title,
      places: c.placesLabel,
      slug: c.slug,
      image: c.heroImage,
    }))
}
