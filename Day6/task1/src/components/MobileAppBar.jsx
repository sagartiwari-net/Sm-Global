import { useEffect } from 'react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { setShowMobileBar } from '../features/ui/uiSlice'
import { heroContent } from '../data'

function MobileAppBar() {
  const dispatch = useAppDispatch()
  const showMobileBar = useAppSelector((state) => state.ui.showMobileBar)

  useEffect(() => {
    const onScroll = () => {
      dispatch(setShowMobileBar(window.scrollY > window.innerHeight * 0.45))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [dispatch])

  return (
    <div className={`mobile-app-bar ${showMobileBar ? 'is-visible' : ''}`}>
      <div className="mobile-app-bar__inner">
        <div className="mobile-app-bar__brand">
          <img
            src="https://b.zmtcdn.com/images/square_zomato_logo_new.svg"
            alt=""
            aria-hidden="true"
          />
          <p>
            Online ordering and
            <br />
            much more on the app
          </p>
        </div>
        <a href={heroContent.orderLink} target="_blank" rel="noreferrer" className="mobile-app-bar__cta">
          Order on app
        </a>
      </div>
    </div>
  )
}

export default MobileAppBar
