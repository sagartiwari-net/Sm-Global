import { Link } from 'react-router-dom'

const shopLinks = [
  { label: 'Men', to: '/shop/men' },
  { label: 'Women', to: '/shop/women' },
  { label: 'Kids', to: '/shop/kids' },
  { label: 'Home', to: '/shop/home' },
  { label: 'Beauty', to: '/shop/beauty' },
  { label: 'Genz', to: '/shop/genz' },
]

const policies = [
  'Contact Us',
  'FAQ',
  'T&C',
  'Terms Of Use',
  'Track Orders',
  'Shipping',
  'Cancellation',
  'Privacy policy',
]

const popular = [
  'Makeup',
  'Dresses For Girls',
  'T-Shirts',
  'Sandals',
  'Headphones',
  'Blazers For Men',
  'Handbags',
  'Sport Shoes',
  'Watches',
  'Jeans',
  'Saree',
  'Nike Shoes',
]

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-smm-border bg-smm-footer px-4 pb-10 pt-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex flex-wrap gap-8 lg:gap-10">
          <div className="w-[140px]">
            <p className="mb-3 text-xs font-bold uppercase text-smm-text">Online Shopping</p>
            {shopLinks.map((l) => (
              <Link key={l.to} to={l.to} className="mb-1.5 block text-[15px] text-smm-muted hover:text-smm-text">
                {l.label}
              </Link>
            ))}
            <p className="mb-3 mt-5 text-xs font-bold uppercase text-smm-text">Useful Links</p>
            {['Blog', 'Careers', 'Site Map', 'Corporate Information'].map((t) => (
              <a key={t} href="#" className="mb-1.5 block text-[15px] text-smm-muted">
                {t}
              </a>
            ))}
          </div>

          <div className="w-[160px]">
            <p className="mb-3 text-xs font-bold uppercase text-smm-text">Customer Policies</p>
            {policies.map((t) => (
              <a key={t} href="#" className="mb-1.5 block text-[15px] text-smm-muted">
                {t}
              </a>
            ))}
          </div>

          <div className="min-w-[220px] flex-1">
            <p className="mb-3 text-xs font-bold uppercase text-smm-text">Experience SmmMynta App on Mobile</p>
            <div className="mb-5 flex flex-wrap gap-2">
              <a href="#" className="inline-block rounded bg-black px-3 py-2 text-xs font-semibold text-white">
                GET IT ON Google Play
              </a>
              <a href="#" className="inline-block rounded bg-black px-3 py-2 text-xs font-semibold text-white">
                Download on the App Store
              </a>
            </div>
            <p className="mb-2 text-xs font-bold uppercase text-smm-text">Keep in Touch</p>
            <div className="flex gap-4 text-smm-muted">
              <a href="#">Fb</a>
              <a href="#">Tw</a>
              <a href="#">Yt</a>
              <a href="#">Ig</a>
            </div>
          </div>

          <div className="w-[250px] space-y-5 text-[14px] text-smm-muted">
            <div>
              <strong className="text-smm-text">100% ORIGINAL</strong> guarantee for all products at smmmynta.com
            </div>
            <div>
              <strong className="text-smm-text">Return within 14days</strong> of receiving your order
            </div>
          </div>
        </div>

        <hr className="my-6 border-smm-border" />
        <p className="mb-2 text-xs font-bold uppercase text-smm-text">Popular Searches</p>
        <p className="text-[15px] leading-7 text-smm-muted">
          {popular.map((p, i) => (
            <span key={p}>
              <Link to="/shop/all" className="hover:text-smm-text">
                {p}
              </Link>
              {i < popular.length - 1 ? ' | ' : ''}
            </span>
          ))}
        </p>

        <div className="mt-8 flex flex-wrap items-start justify-between gap-4 text-[14px] text-smm-muted">
          <p>
            In case of any concern, <Link to="/" className="font-bold text-[#526cd0]">Contact Us</Link>
          </p>
          <p className="text-[#94969f]">© {new Date().getFullYear()} www.smmmynta.com. All rights reserved.</p>
          <p className="text-[#94969f]">An SMM Global project</p>
        </div>

        <address className="mt-8 not-italic">
          <p className="mb-2 font-bold text-smm-text">Registered Office Address</p>
          <div className="flex flex-wrap gap-8 text-[15px] leading-5 text-[#94969f]">
            <div>
              Buildings Alyssa,<br />
              Begonia and Clover situated in Embassy Tech Village,<br />
              Outer Ring Road,<br />
              Devarabeesanahalli Village,<br />
              Bengaluru – 560103, India
            </div>
            <div>
              <p>CIN: U72300KA2007PTC041799</p>
              <p>
                Telephone:{' '}
                <a href="tel:08040011450" className="font-bold text-[#526cd0]">
                  080‑40011450
                </a>
              </p>
            </div>
          </div>
        </address>

        <div className="mt-8 border-t border-smm-border pt-6 text-[14px] leading-[18px] text-[#94969f]">
          <h1 className="mb-2 text-sm font-bold uppercase text-[#535766]">
            Online shopping made easy at SmmMynta
          </h1>
          <p>
            If you would like to experience the best of online shopping for men, women and kids in India,
            you are at the right place. SmmMynta is the ultimate destination for fashion and lifestyle.
          </p>
        </div>
      </div>
    </footer>
  )
}
