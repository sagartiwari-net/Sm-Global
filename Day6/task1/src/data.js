import { getAllCollectionRestaurants } from './data/collectionsData'
/** Static catalog — edit `src/data/collections.json` to add/remove rail cards */
import collectionsJson from './data/collections.json'

export const collections = collectionsJson

/* ========== Official zomato.com landing assets ========== */
export const heroContent = {
  logo: 'https://b.zmtcdn.com/web_assets/8313a97515fcb0447d2d77c276532a511583262271.png',
  background: 'https://b.zmtcdn.com/data/o2_assets/52c985ee025e442b74fb4c91cbe20ced1743099385.png',
  video: 'https://b.zmtcdn.com/data/file_assets/2627bbed9d6c068e50d2aadcca11ddbb1743095810.mp4',
  orderLink: 'https://zomato.onelink.me/xqzv/2c9wu3p8',
  storeLinks: [
    {
      name: 'Download on the App Store',
      url: 'https://link.zomato.com/xqzv/iwz6g6kg',
      badge: 'https://b.zmtcdn.com/data/o2_assets/aad864bd17860b27634fe621001c32db1739350431.png',
    },
    {
      name: 'Get it on Google Play',
      url: 'https://link.zomato.com/xqzv/xigpfha6',
      badge: 'https://b.zmtcdn.com/data/o2_assets/df6464de32f4a09262cee301f65aaa661739351256.png',
    },
  ],
  downloadStoreLinks: [
    {
      name: 'Download on the App Store',
      url: 'https://link.zomato.com/xqzv/iwz6g6kg',
      badge: 'https://b.zmtcdn.com/data/o2_assets/aad864bd17860b27634fe621001c32db1739350431.png',
    },
    {
      name: 'Get it on Google Play',
      url: 'https://link.zomato.com/xqzv/xigpfha6',
      badge: 'https://b.zmtcdn.com/data/o2_assets/df6464de32f4a09262cee301f65aaa661739351256.png',
    },
  ],
}

export const storyContent = {
  subheading:
    'For over a decade, we’ve enabled our customers to discover new tastes, delivered right to their doorstep',
  curve: 'https://b.zmtcdn.com/data/o2_assets/901001826baf04838b1bf505176ff0b11742453501.png',
  foods: [
    {
      src: 'https://b.zmtcdn.com/data/o2_assets/110a09a9d81f0e5305041c1b507d0f391743058910.png',
      className: 'story-food story-food--burger',
    },
    {
      src: 'https://b.zmtcdn.com/data/o2_assets/b4f62434088b0ddfa9b370991f58ca601743060218.png',
      className: 'story-food story-food--momo',
    },
    {
      src: 'https://b.zmtcdn.com/data/o2_assets/316495f4ba2a9c9d9aa97fed9fe61cf71743059024.png',
      className: 'story-food story-food--pizza',
    },
    {
      src: 'https://b.zmtcdn.com/data/o2_assets/70b50e1a48a82437bfa2bed925b862701742892555.png',
      className: 'story-food story-food--leaf',
    },
    {
      src: 'https://b.zmtcdn.com/data/o2_assets/9ef1cc6ecf1d92798507ffad71e9492d1742892584.png',
      className: 'story-food story-food--tomato-a',
    },
    {
      src: 'https://b.zmtcdn.com/data/o2_assets/9ef1cc6ecf1d92798507ffad71e9492d1742892584.png',
      className: 'story-food story-food--tomato-b',
    },
  ],
}

export const goldDecor = {
  logo: 'https://b.zmtcdn.com/data/o2_assets/5f94743e20e3f668953fda8b0e56f2f71742996005.png',
  coins: [
    'https://b.zmtcdn.com/data/o2_assets/e7a502b732de9cd0d5ceca82306137ca1743059837.png',
    'https://b.zmtcdn.com/data/o2_assets/ef5bc22bc703882ccb11a5b75ad6704b1743059783.png',
    'https://b.zmtcdn.com/data/o2_assets/3658cc04dba86e5dfa2d99f070e1fc171743059861.png',
  ],
}

export const featurePhoneFrame =
  'https://b.zmtcdn.com/data/o2_assets/3f7e2757e62fd22592b879bd56b666011742294630.png'

export const downloadPhone =
  'https://b.zmtcdn.com/data/o2_assets/3f7e2757e62fd22592b879bd56b666011742294630.png'

export const downloadQr =
  'https://b.zmtcdn.com/data/o2_assets/98cc4eba0a6f59e728e5223a70fd39551742471514.png'

export const eternalLogo =
  'https://b.zmtcdn.com/data/o2_assets/45f24a780ec544a02267ccd0da16ce231767592736.png'

export const brandLogo =
  'https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png'

export const footerLogo = brandLogo

export const DEFAULT_LOCATION =
  'Ywca, Ashoka Rd, Hanuman Road Area, Connaught Place, New Delhi'

export const diningTabs = [
  {
    id: 'dining',
    label: 'Dining Out',
    image: 'https://b.zmtcdn.com/data/o2_assets/30fa0a844f3ba82073e5f78c65c18b371616149662.png',
  },
  {
    id: 'delivery',
    label: 'Delivery',
    image: 'https://b.zmtcdn.com/data/o2_assets/246bbd71fbba420d5996452be3024d351616150055.png',
  },
  {
    id: 'nightlife',
    label: 'Nightlife',
    image: 'https://b.zmtcdn.com/data/o2_assets/01040767e4943c398e38e3592bb1ba8a1616150142.png',
  },
]

export const diningFilters = [
  'Filters',
  'Offers',
  'Rating: 4.5+',
  'Pet friendly',
  'Outdoor seating',
  'Serves Alcohol',
  'Open Now',
]

const diningMenu = (prefix) => [
  { id: `${prefix}-1`, name: 'Chef Special Platter', price: 599, veg: false },
  { id: `${prefix}-2`, name: 'Signature Veg Bowl', price: 349, veg: true },
  { id: `${prefix}-3`, name: 'House Mocktail', price: 249, veg: true },
  { id: `${prefix}-4`, name: 'Dessert of the Day', price: 299, veg: true },
]

export const diningRestaurants = [
  {
    id: 19495371,
    name: 'Out Of The Box Courtyard',
    slug: 'out-of-the-box-courtyard-connaught-place-new-delhi',
    cuisine: 'Continental, North Indian, Italian, Pizza, Chinese, Asian, Fast Food, Beverages',
    dish: 'Continental Platter',
    area: 'Connaught Place, New Delhi',
    rating: 4.1,
    cost: '₹3,000 for two',
    deliveryTime: 'Dine-out',
    distance: '1.2 km',
    offer: 'Flat 20% OFF',
    promoted: true,
    image: 'https://b.zmtcdn.com/data/pictures/1/19495371/87eaef59996ca008a519054014accbaa_featured_v2.jpg',
    menu: diningMenu('oob'),
  },
  {
    id: 20863533,
    name: 'Cé La Vie Kitchen & Bar',
    slug: 'ce-la-vie-kitchen-bar-connaught-place-new-delhi',
    cuisine: 'North Indian, Mediterranean, Continental, Lebanese, Italian, Chinese, Asian, Bar Food',
    dish: 'Mediterranean Mezze',
    area: 'Connaught Place, New Delhi',
    rating: 4.2,
    cost: '₹3,300 for two',
    deliveryTime: 'Dine-out',
    distance: '1.4 km',
    offer: 'Flat 20% OFF',
    promoted: true,
    image: 'https://b.zmtcdn.com/data/pictures/3/20863533/3ad7a12bd1f6fbf993708a3a8498369f_featured_v2.jpg',
    menu: diningMenu('clv'),
  },
  {
    id: 18423151,
    name: 'The Darzi Bar & Kitchen',
    slug: 'the-darzi-bar-kitchen-connaught-place-new-delhi',
    cuisine: 'North Indian, Chinese, Asian, Italian, Mughlai, Desserts, Tea, Beverages',
    dish: 'Mughlai Feast',
    area: 'Connaught Place, New Delhi',
    rating: 4.2,
    cost: '₹4,000 for two',
    deliveryTime: 'Dine-out',
    distance: '1.4 km',
    offer: 'Flat 25% OFF',
    promoted: true,
    image: 'https://b.zmtcdn.com/data/pictures/1/18423151/e6cbcb3162c11adcf58677f1c4110d9b_featured_v2.jpg',
    menu: diningMenu('darzi'),
  },
  {
    id: 19295106,
    name: 'Connaught Club House',
    slug: 'connaught-club-house-connaught-place-new-delhi',
    cuisine: 'North Indian, Mughlai, Italian, Continental, Asian, Fast Food, Desserts',
    dish: 'Club House Special',
    area: 'Connaught Place, New Delhi',
    rating: 4.3,
    cost: '₹3,000 for two',
    deliveryTime: 'Dine-out',
    distance: '1 km',
    offer: 'Flat 10% OFF',
    promoted: true,
    image: 'https://b.zmtcdn.com/data/pictures/6/19295106/8fbf0b59a34748767bd336e4443b02e6_featured_v2.jpg',
    menu: diningMenu('cch'),
  },
  {
    id: 20243538,
    name: 'Somewhere Restaurant & Bar',
    slug: 'somewhere-restaurant-bar-connaught-place-new-delhi',
    cuisine: 'North Indian, Asian, European, Continental, Lebanese, Turkish, Mediterranean, Kebab',
    dish: 'Kebab Platter',
    area: 'Connaught Place, New Delhi',
    rating: 4.2,
    cost: '₹3,300 for two',
    deliveryTime: 'Dine-out',
    distance: '1.4 km',
    offer: 'Flat 15% OFF',
    promoted: true,
    image: 'https://b.zmtcdn.com/data/pictures/8/20243538/3224c047011af9a297160dd0605d1352_featured_v2.jpg',
    menu: diningMenu('swrb'),
  },
  {
    id: 21940089,
    name: 'Massala Singh',
    slug: 'massala-singh-connaught-place-new-delhi',
    cuisine: 'North Indian, Modern Indian, Mughlai',
    dish: 'Butter Chicken',
    area: 'Connaught Place, New Delhi',
    rating: 4.1,
    cost: '₹1,600 for two',
    deliveryTime: 'Dine-out',
    distance: '1.5 km',
    offer: 'Flat 15% OFF',
    promoted: true,
    image: 'https://b.zmtcdn.com/data/pictures/9/21940089/3f69ee731ec6cdaed2bf1a7bc97ddfea_o2_featured_v2.jpg',
    menu: diningMenu('msingh'),
  },
  {
    id: 18382360,
    name: 'Local',
    slug: 'local-connaught-place-new-delhi',
    cuisine: 'North Indian, Continental, Mexican, Italian, Oriental, Biryani, Beverages',
    dish: 'Local Special Thali',
    area: 'Connaught Place, New Delhi',
    rating: 4.2,
    cost: '₹2,600 for two',
    deliveryTime: 'Dine-out',
    distance: '1.2 km',
    offer: 'Flat 20% OFF',
    promoted: true,
    image: 'https://b.zmtcdn.com/data/pictures/0/18382360/46e428b78f369f8fa533cfe29029d0e1_featured_v2.jpg',
    menu: diningMenu('local'),
  },
  {
    id: 18454488,
    name: 'The GT Road',
    slug: 'the-gt-road-connaught-place-new-delhi',
    cuisine: 'North Indian, Mughlai, Bar Food, Desserts, Beverages',
    dish: 'GT Road Special',
    area: 'Connaught Place, New Delhi',
    rating: 4.3,
    cost: '₹2,400 for two',
    deliveryTime: 'Dine-out',
    distance: '1.5 km',
    offer: '',
    opensAt: 'Opens at 7pm',
    promoted: true,
    image: 'https://b.zmtcdn.com/data/pictures/8/18454488/4188a5acb8e537010cb899dd879160d7_featured_v2.jpg',
    menu: diningMenu('gtroad'),
  },
  {
    id: 21844770,
    name: 'Ivoryy Fusion Bar',
    slug: 'ivoryy-fusion-bar-connaught-place-new-delhi',
    cuisine: 'Cafe, Asian, Modern Indian',
    dish: 'Fusion Small Plates',
    area: 'Connaught Place, New Delhi',
    rating: 4.1,
    cost: '₹4,700 for two',
    deliveryTime: 'Dine-out',
    distance: '1.1 km',
    offer: 'Flat 30% OFF',
    promoted: true,
    image: 'https://b.zmtcdn.com/data/pictures/0/21844770/04066b907d3bb1c9fb0845d9819fb06c_featured_v2.jpg',
    menu: diningMenu('ivoryy'),
  },
]

export const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/zomato/' },
  { label: 'Instagram', href: 'https://www.instagram.com/zomato/' },
  { label: 'YouTube', href: 'https://www.youtube.com/zomato' },
  { label: 'Facebook', href: 'https://www.facebook.com/zomato' },
  { label: 'X', href: 'https://twitter.com/zomato' },
]

export const stats = [
  {
    value: '3,00,000+',
    label: 'restaurants',
    image: 'https://b.zmtcdn.com/data/o2_assets/d19ec60986487a77bcb026e5efc3325f1742908200.png',
  },
  {
    value: '800+',
    label: 'cities',
    image: 'https://b.zmtcdn.com/data/o2_assets/e7533c4081d6140da37b9f430cb7b8051743006192.png',
  },
  {
    value: '3 billion+',
    label: 'orders delivered',
    image: 'https://b.zmtcdn.com/data/o2_assets/713443cc5944ce4284d7e49e75e2aacf1742466222.png',
  },
]

export const appFeatures = [
  { title: 'Veg Mode', image: 'https://b.zmtcdn.com/data/o2_assets/82f145180cd6f920a8a8617dda366a0a1742455963.png' },
  { title: 'Healthy', image: 'https://b.zmtcdn.com/data/o2_assets/d0f1639403f80f8f2c19e0d538222e661742455804.png' },
  { title: 'Collections', image: 'https://b.zmtcdn.com/data/o2_assets/5e973dd10c387878009c66d625ae541a1746550690.png' },
  { title: 'Schedule your order', image: 'https://b.zmtcdn.com/data/o2_assets/cc1caf220c91be38dd94cce12b416fcd1746550226.png' },
  { title: 'Plan a Party', image: 'https://b.zmtcdn.com/data/o2_assets/5e7aab0f183b36fc12c29279f0cb55181742462245.png' },
  { title: 'Offers', image: 'https://b.zmtcdn.com/data/o2_assets/813952c961fd13588cb71867d84ea7dc1742455815.png' },
  { title: 'Food on Train', image: 'https://b.zmtcdn.com/data/o2_assets/06d090307e02772693ac06123b53459b1742455939.png' },
  { title: 'Gourmet', image: 'https://b.zmtcdn.com/data/o2_assets/6e27c9acde6045c272a28e6eb275727e1742455789.png' },
  { title: 'Gift Cards', image: 'https://b.zmtcdn.com/data/o2_assets/867f86a10503998e437963bb37c451591742455764.png' },
]

export const goldBenefits = [
  {
    title: 'Free Delivery',
    subtitle: 'At all restaurants within 7 km',
    image: 'https://b.zmtcdn.com/data/o2_assets/bc9d2a579285cbdaa101b8fe2ba68f601741779645.png',
  },
  {
    title: 'Up to 30% extra off',
    subtitle: 'At 20,000+ partner restaurants',
    image: 'https://b.zmtcdn.com/data/o2_assets/d668ed26c7d4771318d0aa03b3f905e71741779899.png',
  },
]

export const ecosystemBrands = [
  {
    title: 'zomato',
    description: 'Get the app now to start ordering your favorite dishes!',
    image: 'https://b.zmtcdn.com/data/o2_assets/d1eee2be61cf47e2332cb7c49475c0981739777714.png',
    accent: 'brand-card--rose',
    link: '/restaurants',
  },
  {
    title: 'blinkit',
    description: 'Choose from 30,000+ products & get them delivered at your doorstep',
    image: 'https://b.zmtcdn.com/data/o2_assets/071cb96db84f20eea3a39804e113bdee1739777655.png',
    accent: 'brand-card--yellow',
    link: 'https://www.blinkit.com/',
  },
  {
    title: 'district',
    description: 'The best of events, movies, dining, and everything you love!',
    image: 'https://b.zmtcdn.com/data/o2_assets/b750e7c0113f10cc6b3cec658c7229d71770799109.png',
    accent: 'brand-card--purple',
    link: 'https://www.district.in/',
  },
  {
    title: 'hyperpure',
    description: 'Offering complete supply chain solution for your restaurant',
    image: 'https://b.zmtcdn.com/data/o2_assets/9207cd0fc68c4ac55cfd3bfa00c02a351739777699.png',
    accent: 'brand-card--rose',
    link: 'https://www.hyperpure.com/',
  },
]

export const footerColumns = [
  {
    title: 'Eternal',
    links: [
      { label: 'Zomato', href: 'https://www.zomato.com/' },
      { label: 'Blinkit', href: 'https://www.blinkit.com/' },
      { label: 'District', href: 'https://www.district.in/' },
      { label: 'Hyperpure', href: 'https://www.hyperpure.com/' },
      { label: 'Feeding India', href: 'https://www.feedingindia.org/' },
      { label: 'Investor Relations', href: 'https://www.zomato.com/investor-relations' },
    ],
  },
  {
    title: 'For Restaurants',
    links: [
      { label: 'Partner With Us', href: 'https://www.zomato.com/partner-with-us/new/' },
      { label: 'Apps For You', href: 'https://zomato.onelink.me/xqzv/xsm2vxb4' },
      { label: 'Restaurant Consulting', href: 'https://www.zomato.com/restaurant-expansion-consulting-services/' },
    ],
  },
  {
    title: 'For Delivery Partners',
    links: [
      { label: 'Partner With Us', href: 'https://www.zomato.com/partner-with-us/new/' },
      { label: 'Apps For You', href: 'https://zomato.onelink.me/xqzv/xsm2vxb4' },
    ],
  },
  {
    title: 'Learn More',
    links: [
      { label: 'Privacy', href: 'https://www.zomato.com/privacy' },
      { label: 'Security', href: 'https://www.zomato.com/security' },
      { label: 'Terms of Service', href: 'https://www.zomato.com/conditions' },
      { label: 'Help & Support', href: 'https://www.zomato.com/support' },
      { label: 'Report a Fraud', href: 'https://www.zomato.com/report-fraud' },
      { label: 'Blog', href: 'https://www.zomato.com/blog' },
    ],
  },
]

/* ========== Order flow (extra functional app) ========== */
export const deliveryRestaurants = [
  {
    id: 1,
    name: 'Biryani Blues',
    cuisine: 'Biryani, North Indian',
    dish: 'Hyderabadi Chicken Biryani',
    area: 'Connaught Place',
    rating: 4.4,
    cost: '₹600 for two',
    deliveryTime: '30-35 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d29a?auto=format&fit=crop&w=900&q=80',
    menu: [
      { id: 'bb1', name: 'Hyderabadi Chicken Biryani', price: 320, veg: false },
      { id: 'bb2', name: 'Veg Dum Biryani', price: 250, veg: true },
      { id: 'bb3', name: 'Chicken 65', price: 280, veg: false },
      { id: 'bb4', name: 'Mirchi Ka Salan', price: 90, veg: true },
    ],
  },
  {
    id: 2,
    name: 'Pizza Hub',
    cuisine: 'Pizza, Italian',
    dish: 'Farmhouse Pizza',
    area: 'Saket',
    rating: 4.2,
    cost: '₹900 for two',
    deliveryTime: '25-30 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
    menu: [
      { id: 'ph1', name: 'Farmhouse Pizza', price: 399, veg: true },
      { id: 'ph2', name: 'Pepperoni Pizza', price: 449, veg: false },
      { id: 'ph3', name: 'Garlic Bread', price: 149, veg: true },
      { id: 'ph4', name: 'Pasta Arrabbiata', price: 279, veg: true },
    ],
  },
  {
    id: 3,
    name: 'Burger Point',
    cuisine: 'Burgers, Fast Food',
    dish: 'Loaded Veg Burger',
    area: 'Sector 18, Noida',
    rating: 4.1,
    cost: '₹500 for two',
    deliveryTime: '20-25 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80',
    menu: [
      { id: 'bp1', name: 'Loaded Veg Burger', price: 179, veg: true },
      { id: 'bp2', name: 'Chicken Burger', price: 219, veg: false },
      { id: 'bp3', name: 'French Fries', price: 99, veg: true },
      { id: 'bp4', name: 'Chocolate Shake', price: 149, veg: true },
    ],
  },
  {
    id: 4,
    name: 'Dosa Plaza',
    cuisine: 'South Indian',
    dish: 'Masala Dosa',
    area: 'Karol Bagh',
    rating: 4.5,
    cost: '₹450 for two',
    deliveryTime: '25-30 min',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80',
    menu: [
      { id: 'dp1', name: 'Masala Dosa', price: 140, veg: true },
      { id: 'dp2', name: 'Cheese Dosa', price: 180, veg: true },
      { id: 'dp3', name: 'Idli Sambar', price: 100, veg: true },
      { id: 'dp4', name: 'Filter Coffee', price: 60, veg: true },
    ],
  },
  {
    id: 5,
    name: 'Momo Station',
    cuisine: 'Tibetan, Chinese',
    dish: 'Steamed Chicken Momos',
    area: 'Majnu ka Tila',
    rating: 4.3,
    cost: '₹550 for two',
    deliveryTime: '35-40 min',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=900&q=80',
    menu: [
      { id: 'ms1', name: 'Steamed Chicken Momos', price: 160, veg: false },
      { id: 'ms2', name: 'Veg Steam Momos', price: 130, veg: true },
      { id: 'ms3', name: 'Fried Momos', price: 180, veg: false },
      { id: 'ms4', name: 'Thukpa', price: 190, veg: false },
    ],
  },
  {
    id: 6,
    name: 'Sweet House',
    cuisine: 'Desserts, Bakery',
    dish: 'Chocolate Truffle Cake',
    area: 'Rajouri Garden',
    rating: 4.0,
    cost: '₹400 for two',
    deliveryTime: '30-35 min',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80',
    menu: [
      { id: 'sh1', name: 'Chocolate Truffle Cake', price: 350, veg: true },
      { id: 'sh2', name: 'Red Velvet Slice', price: 180, veg: true },
      { id: 'sh3', name: 'Brownie with Ice Cream', price: 220, veg: true },
      { id: 'sh4', name: 'Cold Coffee', price: 120, veg: true },
    ],
  },
]

export const restaurants = [
  ...diningRestaurants,
  ...deliveryRestaurants,
  ...getAllCollectionRestaurants(),
]

export const localities = [
  { name: 'Connaught Place', places: '289 places' },
  { name: 'Sector 29, Gurgaon', places: '174 places' },
  { name: 'Saket', places: '382 places' },
  { name: 'Rajouri Garden', places: '211 places' },
  { name: 'Karol Bagh', places: '156 places' },
  { name: 'Cyber Hub, Gurgaon', places: '126 places' },
  { name: 'Dwarka', places: '208 places' },
  { name: 'Hauz Khas', places: '194 places' },
  { name: 'Sector 18, Noida', places: '230 places' },
]

export const ORDER_STEPS = [
  { id: 'placed', label: 'Order placed', description: 'We have received your order' },
  { id: 'accepted', label: 'Restaurant accepted', description: 'Your food is being prepared' },
  { id: 'picked', label: 'Picked up', description: 'Delivery partner is on the way' },
  { id: 'delivered', label: 'Delivered', description: 'Enjoy your meal!' },
]

export const DEMO_USER = {
  email: 'demo@zomato.com',
  password: 'demo123',
  name: 'Sagar Tiwari',
  phone: '9555045411',
  avatar:
    'https://b.zmtcdn.com/data/user_profile_pictures/176/20b40015008f0e63b4ed39ad27e82176.jpg?fit=around%7C400%3A400&crop=400%3A400%3B%2A%2C%2A',
  cover:
    'https://b.zmtcdn.com/data/cover_images/8510f46eaa3dc1ad7bf761c6d5ac73bd1548143173.jpeg?output-format=webp',
}

export const DEFAULT_AVATAR =
  'https://b.zmtcdn.com/images/placeholder_200.png?output-format=webp'

export const DEFAULT_COVER =
  'https://b.zmtcdn.com/data/cover_images/8510f46eaa3dc1ad7bf761c6d5ac73bd1548143173.jpeg?output-format=webp'
