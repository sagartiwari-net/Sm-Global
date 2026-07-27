import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { logout } from '../features/auth/authSlice'
import { selectCartCount } from '../features/cart/cartSlice'
import SearchBar from './SearchBar'
import { brandLogo, DEFAULT_AVATAR } from '../data'

function Navbar({ variant = 'landing', showSearch = false }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const cartCount = useAppSelector(selectCartCount)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return undefined
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    const onEsc = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [menuOpen])

  const handleLogout = () => {
    setMenuOpen(false)
    dispatch(logout())
    navigate('/')
  }

  const firstName = user?.name?.split(' ')[0] || 'User'
  const avatar = user?.avatar || DEFAULT_AVATAR

  return (
    <header className={`navbar navbar--${variant}${showSearch ? ' navbar--search' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand-logo" aria-label="Zomato home">
          <img src={brandLogo} alt="zomato" />
        </Link>

        {showSearch ? <SearchBar /> : <span className="navbar__spacer" aria-hidden="true" />}

        <nav className="navbar__links" aria-label="Primary navigation">
          {!showSearch ? <Link to="/ncr/restaurants">Order Food</Link> : null}
          {user ? (
            <>
              <Link to="/orders">My Orders</Link>
              <Link to="/cart">Cart{cartCount > 0 ? ` (${cartCount})` : ''}</Link>

              <div className="nav-user" ref={menuRef}>
                <button
                  type="button"
                  className="nav-user__trigger"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  <span
                    className="nav-user__avatar"
                    style={{ backgroundImage: `url(${avatar})` }}
                    aria-hidden
                  />
                  <span className="nav-user__name">{firstName}</span>
                  <svg
                    className={`nav-user__chevron${menuOpen ? ' is-open' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M4.48 7.38c0.28-0.28 0.76-0.28 1.060 0l4.46 4.48 4.48-4.48c0.28-0.28 0.76-0.28 1.060 0s0.28 0.78 0 1.060l-5 5c-0.3 0.3-0.78 0.3-1.060 0l-5-5c-0.3-0.28-0.3-0.76 0-1.060z" />
                  </svg>
                </button>

                {menuOpen ? (
                  <div className="nav-user__menu" role="menu">
                    <Link
                      role="menuitem"
                      to="/profile/reviews"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      role="menuitem"
                      to="/profile/reviews"
                      onClick={() => setMenuOpen(false)}
                    >
                      Reviews
                    </Link>
                    <Link
                      role="menuitem"
                      to="/profile/settings"
                      onClick={() => setMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button type="button" role="menuitem" onClick={handleLogout}>
                      Log out
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
