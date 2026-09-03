const img = (path) =>
  `https://assets.myntassets.com/w_980,c_limit,fl_progressive,dpr_2.0/${path}`

const card = (path) =>
  `https://assets.myntassets.com/w_326,c_limit,fl_progressive,dpr_2.0/${path}`

export const heroBanners = [
  {
    id: 'deal-top',
    src: img('assets/images/2026/JULY/29/FdNsyl0S_93bfd8fd90cf42ea93d3af01a8f98b16.jpg'),
    href: '/shop/deals',
    alt: 'Deal of the Day',
  },
]

export const genderSplit = [
  {
    id: 'women',
    src: 'https://assets.myntassets.com/w_490,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/fLb1qvfW_37d8800f55ff484c95c78fe37d713c70.jpg',
    href: '/shop/women',
    alt: 'Shop Women',
  },
  {
    id: 'men',
    src: 'https://assets.myntassets.com/w_490,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/8F2GPndn_f89100c42ff447a4996e9d25e24e0d8b.jpg',
    href: '/shop/men',
    alt: 'Shop Men',
  },
]

export const brandStrip = [
  {
    id: 'b1',
    src: card('assets/images/2026/JULY/29/h35rdBqe_7a64973507874f649093597096fb4c8d.jpg'),
    href: '/shop/jewellery',
  },
  {
    id: 'b2',
    src: card('assets/images/2026/JULY/29/GWjXU3fw_127776389fd34e7791fd5b8ad2235902.jpg'),
    href: '/shop/handbags',
  },
  {
    id: 'b3',
    src: card('assets/images/2026/JULY/29/Hogfau4L_22423b5bc7cc40f59ab57012c51abfab.jpg'),
    href: '/shop/men',
  },
]

export const rtfBanner = {
  src: img('assets/images/2026/JULY/29/qQk64CSe_0badb829925c48d69c9d4a979319657e.gif'),
  href: '/shop/deals',
  alt: 'Right To Fashion',
}

export const sectionHeaders = [
  {
    id: 'h1',
    src: img('assets/images/2026/JULY/29/F88kuxOn_9b0b8ba15d8b49cda27b4ea3ee3e8596.jpg'),
    href: '/shop/deals',
  },
  {
    id: 'h2',
    src: img('assets/images/2026/JULY/29/wErbnEWV_041a6666b72249f3873f57ea65765c03.jpg'),
    href: '/shop/deals',
  },
  {
    id: 'h3',
    src: img('assets/images/2026/JULY/29/z6CJxe6m_3681d9946ee74d4f8a2955d9b0304f62.jpg'),
    href: '/shop/deals',
  },
]

export const categoryCarousels = [
  {
    id: 'c1',
    title: 'MEDAL-WORTHY BRANDS TO BAG',
    items: [
      {
        src: 'https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2026/MARCH/31/Z2T9wwKw_4367b718f6dd49a9bbcf13a82d10023c.png',
        href: '/shop/men',
        label: 'Innerwear',
      },
      {
        src: 'https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2026/MARCH/31/IZKiqaTw_29ce952866c54c01a7dff3aaddd4eced.png',
        href: '/shop/men',
        label: 'Blazers & Suits',
      },
      {
        src: 'https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2026/MARCH/31/XCiXRCwo_68ee68de961d478cb9b9200c601327d2.png',
        href: '/shop/kids',
        label: 'Kids Dresses',
      },
      {
        src: 'https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2026/MARCH/31/rweina11_bc32159f767d4e52be29179c6cdda12d.png',
        href: '/shop/men',
        label: 'T-Shirts',
      },
      {
        src: 'https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2026/MARCH/31/t97SUoi2_3156785b75d74b2ab8d613657fc4178c.png',
        href: '/shop/men',
        label: 'Shirts',
      },
    ],
  },
  {
    id: 'c2',
    title: 'GRAND GLOBAL BRANDS',
    items: [
      {
        src: 'https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2026/MARCH/31/jnSTGEEd_1ac8527ebccd43b2a376c618d34eb97a.png',
        href: '/shop/women',
        label: 'Dresses',
      },
      {
        src: 'https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2026/MARCH/31/uV0bHhEe_a240f50902a6463fbebe7af0ee8ded56.png',
        href: '/shop/women',
        label: 'Tops',
      },
      {
        src: 'https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2026/MARCH/31/m5Nfq0Mc_26946571e55c4d8281520574fb1b3626.png',
        href: '/shop/women',
        label: 'Shirts',
      },
      {
        src: 'https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2026/MARCH/31/MNQ4pimP_92491d8a62494a3bbbde843ce0bdd287.png',
        href: '/shop/women',
        label: 'Jeans',
      },
      {
        src: 'https://assets.myntassets.com/w_196,c_limit,fl_progressive,dpr_2.0/assets/images/2026/MARCH/31/R5i7MPri_15bb9f8900d84b28b5fd9d1e9e12c6a2.png',
        href: '/shop/women',
        label: 'Trousers',
      },
    ],
  },
]

export const shopByCategory = [
  {
    src: 'https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/pWGW97O1_d6db3ad1097e41e9a504277028dfa846.jpg',
    href: '/shop/women',
    label: 'Ethnic Wear',
  },
  {
    src: 'https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/K2JsaNEm_521c57e4d3834976be73d4fb1a194d12.jpg',
    href: '/shop/men',
    label: 'Casual Wear',
  },
  {
    src: 'https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/E38zJ6LH_53cd9237976e4d1b9c367fdc413a8a61.jpg',
    href: '/shop/men',
    label: 'Sports Wear',
  },
  {
    src: 'https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/YMr7uZGW_ca19ab44827e4500858172b8e1dbed24.jpg',
    href: '/shop/women',
    label: 'Active Wear',
  },
  {
    src: 'https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/pdZSYS8m_ada73b34a95546ffbcbb39991f0f7e1b.jpg',
    href: '/shop/women',
    label: 'Western Wear',
  },
  {
    src: 'https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/HvyZYyXS_ba62781af36a4f8bac20c6a5565f0068.jpg',
    href: '/shop/men',
    label: 'Sport Apparel',
  },
]

export const moreCategories = [
  {
    src: 'https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/XxfRj3qs_bb9446ece1064526b2fd465c177b710d.jpg',
    href: '/shop/women',
    label: 'Loungewear',
  },
  {
    src: 'https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/I15U0ley_d3477ad1185549b5bf77f8b85965225f.jpg',
    href: '/shop/men',
    label: 'Innerwear',
  },
  {
    src: 'https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/SZA74V1D_a423866fa01c46d589b7cf452a752224.jpg',
    href: '/shop/women',
    label: 'Lingerie',
  },
  {
    src: 'https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/pi4I6KG4_4aefa6912bed4c72966a91cb99db8274.jpg',
    href: '/shop/beauty',
    label: 'Watches',
  },
  {
    src: 'https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/ay1CUS01_ab960a841fc74c85b28c667cdf304ff7.jpg',
    href: '/shop/beauty',
    label: 'Beauty Appliances',
  },
  {
    src: 'https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2026/JULY/29/J8H2y0dI_bc6b3528789d4cdbac2fe22596e6c5c2.jpg',
    href: '/shop/men',
    label: 'Grooming',
  },
]

export const appBanner = {
  src: img('assets/images/2026/JULY/29/79uqF8Ew_680ad63c49f14b7498d152ccf696aa6d.jpg'),
  href: '#',
  alt: 'Download SmmMynta App',
}
