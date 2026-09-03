import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineUser, HiOutlineHeart, HiOutlineShoppingBag, HiOutlineSearch, HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import { navCategories, studioNav } from '../data/nav'
import MegaMenu from './MegaMenu'
import { openBag, openLogin } from '../features/ui/uiSlice'
import { selectBagCount } from '../features/bag/bagSlice'
import { selectWishlistCount } from '../features/wishlist/wishlistSlice'
import { logout } from '../features/auth/authSlice'

export default function Header() {
  const [activeNav, setActiveNav] = useState(null)
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const bagCount = useSelector(selectBagCount)
  const wishlistCount = useSelector(selectWishlistCount)
  const user = useSelector((s) => s.auth.user)

  useEffect(() => {
    const onDoc = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const onSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/shop/all?q=${encodeURIComponent(q)}` : '/shop/all')
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <div className="hidden border-b border-smm-border bg-white px-6 text-right text-[11px] font-semibold text-[#526cd0] lg:block">
        <div className="mx-auto flex max-w-[1400px] justify-end gap-5 py-2">
          <Link to="/studio">SmmMynta Insider <span className="ml-1 inline-block -skew-x-12 bg-smm-pink px-1.5 py-0.5 text-[9px] text-white">New</span></Link>
          <span className="text-smm-border">|</span>
          <a href="#">Gift Card</a>
          <span className="text-smm-border">|</span>
          <Link
            to={user ? '/profile/orders' : '/shop/all'}
            onClick={(e) => {
              if (!user) {
                e.preventDefault()
                dispatch(openLogin())
              }
            }}
          >
            Track Orders
          </Link>
          <span className="text-smm-border">|</span>
          <a href="#">Contact Us</a>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-3 lg:h-20 lg:gap-4 lg:px-6">
        <button
          type="button"
          className="p-2 text-smm-text lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
        </button>

        <Link
          to="/"
          className="shrink-0 text-[18px] font-bold tracking-tight text-smm-pink sm:text-[20px]"
          onClick={() => setMobileOpen(false)}
          aria-label="SmmMynta Home"
        >
          Smm<span className="text-smm-text">Mynta</span>
        </Link>

        <nav
          className="relative ml-2 hidden h-full flex-1 items-stretch lg:flex"
          onMouseLeave={() => setActiveNav(null)}
        >
          {navCategories.map((cat) => (
            <div
              key={cat.id}
              className="relative flex items-center"
              onMouseEnter={() => setActiveNav(cat.id)}
            >
              <Link
                to={cat.href}
                className="px-[17px] text-[14px] font-bold uppercase tracking-[0.3px] text-smm-text"
                style={{
                  borderBottom: activeNav === cat.id ? `4px solid ${cat.color}` : '4px solid transparent',
                  paddingBottom: 28,
                  paddingTop: 28,
                }}
              >
                {cat.label}
              </Link>
            </div>
          ))}
          <div
            className="relative flex items-center"
            onMouseEnter={() => setActiveNav('studio')}
          >
            <Link
              to={studioNav.href}
              className="px-[17px] text-[14px] font-bold uppercase tracking-[0.3px] text-smm-text"
              style={{
                borderBottom: activeNav === 'studio' ? `4px solid ${studioNav.color}` : '4px solid transparent',
                paddingBottom: 28,
                paddingTop: 28,
              }}
            >
              {studioNav.label}
              <sup className="ml-1 text-[10px] font-semibold lowercase text-smm-pink">new</sup>
            </Link>
          </div>

          {activeNav && activeNav !== 'studio' && (
            <MegaMenu
              category={navCategories.find((c) => c.id === activeNav)}
              onClose={() => setActiveNav(null)}
            />
          )}
          {activeNav === 'studio' && (
            <div className="absolute left-1/2 top-full z-50 w-[545px] -translate-x-1/2 animate-slide-down bg-white p-6 text-center shadow-lg">
              <p className="mb-2 text-xl font-bold tracking-tight text-smm-pink">
                Smm<span className="text-smm-text">Mynta</span>{' '}
                <span className="text-sm font-semibold text-smm-muted">Studio</span>
              </p>
              <p className="mb-4 text-[16px] text-smm-gray">Your daily inspiration for everything fashion</p>
              <img
                src="https://constant.myntassets.com/web/assets/img/sudio-nav-banner.png"
                alt="Studio banner"
                className="mb-4 w-full"
              />
              <Link
                to="/studio"
                onClick={() => setActiveNav(null)}
                className="inline-flex items-center gap-2 rounded border border-smm-border px-5 py-2.5 text-sm font-semibold"
              >
                EXPLORE STUDIO →
              </Link>
            </div>
          )}
        </nav>

        <form onSubmit={onSearch} className="relative ml-auto hidden min-w-[200px] flex-1 max-w-[400px] lg:block">
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-smm-muted" aria-label="Search">
            <HiOutlineSearch size={18} />
          </button>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full rounded-md border-0 bg-smm-bg py-2.5 pl-10 pr-3 text-sm text-smm-gray outline-none focus:bg-white focus:ring-1 focus:ring-smm-border"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 lg:ml-2 lg:gap-0">
          <div className="relative hidden lg:block" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                if (!user) dispatch(openLogin())
                else setProfileOpen((v) => !v)
              }}
              className={`flex flex-col items-center px-3 py-1 text-[12px] font-bold ${
                profileOpen ? 'border-b-2 border-smm-pink' : ''
              }`}
            >
              <HiOutlineUser size={20} />
              <span>{user ? user.name.split(' ')[0] : 'Profile'}</span>
            </button>
            {user && profileOpen && (
              <div className="absolute right-0 top-full z-50 w-56 border border-smm-border bg-white py-2 shadow-lg">
                <div className="border-b border-smm-border px-4 py-3">
                  <p className="text-sm font-bold">Hello {user.name.split(' ')[0]}</p>
                  <p className="text-xs text-smm-muted">{user.phone}</p>
                </div>
                <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-smm-bg">Profile</Link>
                <Link to="/profile/orders" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-smm-bg">Orders</Link>
                <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-smm-bg">Wishlist</Link>
                <Link to="/profile/addresses" onClick={() => setProfileOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-smm-bg">Addresses</Link>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false)
                    dispatch(logout())
                    navigate('/')
                  }}
                  className="block w-full border-t border-smm-border px-4 py-2.5 text-left text-sm font-semibold text-smm-pink hover:bg-smm-bg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
          <Link to="/wishlist" className="relative flex flex-col items-center px-2 py-1 text-[12px] font-bold lg:px-3">
            <HiOutlineHeart size={20} />
            <span className="hidden lg:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-smm-pink px-1 text-[11px] text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => dispatch(openBag())}
            className="relative flex flex-col items-center px-2 py-1 text-[12px] font-bold lg:px-3"
          >
            <HiOutlineShoppingBag size={20} />
            <span className="hidden lg:inline">Bag</span>
            {bagCount > 0 && (
              <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-smm-pink px-1 text-[11px] text-white lg:right-1">
                {bagCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={onSearch} className="border-t border-smm-border px-3 py-2 lg:hidden">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-smm-muted" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full rounded border border-smm-border bg-smm-bg py-2 pl-9 pr-3 text-sm outline-none"
          />
        </div>
      </form>

      {mobileOpen && (
        <div className="absolute inset-x-0 top-full max-h-[80vh] overflow-y-auto border-b border-smm-border bg-white shadow-lg lg:hidden">
          {navCategories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.href}
              onClick={() => setMobileOpen(false)}
              className="block border-b border-smm-border px-5 py-3.5 text-[15px] font-bold uppercase"
              style={{ color: cat.color }}
            >
              {cat.label}
            </Link>
          ))}
          <Link
            to="/studio"
            onClick={() => setMobileOpen(false)}
            className="block px-5 py-3.5 text-[15px] font-bold uppercase text-smm-pink"
          >
            Studio <sup className="lowercase">new</sup>
          </Link>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="block border-t border-smm-border px-5 py-3.5 text-[15px] font-semibold">
                Hi, {user.name} — Profile
              </Link>
              <Link to="/profile/orders" onClick={() => setMobileOpen(false)} className="block px-5 py-3.5 text-[15px] font-semibold">Orders</Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  dispatch(logout())
                  navigate('/')
                }}
                className="block w-full px-5 py-3.5 text-left text-[15px] font-semibold text-smm-pink"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                dispatch(openLogin())
              }}
              className="block w-full border-t border-smm-border px-5 py-3.5 text-left text-[15px] font-semibold"
            >
              Login / Signup
            </button>
          )}
        </div>
      )}

      {activeNav && (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 top-[calc(4rem+1px)] z-40 bg-black/30 lg:top-[calc(5rem+33px)]"
          aria-hidden
        />
      )}
    </header>
  )
}
