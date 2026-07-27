import { Link } from 'react-router-dom'
import { useAppSelector } from '../hooks/useAppSelector'
import HeroSection from '../components/HeroSection'
import StoryShowcase from '../components/StoryShowcase'
import FeatureShowcase from '../components/FeatureShowcase'
import GoldBenefits from '../components/GoldBenefits'
import BrandShowcase from '../components/BrandShowcase'
import DownloadBanner from '../components/DownloadBanner'
import Footer from '../components/Footer'
import MobileAppBar from '../components/MobileAppBar'
import { appFeatures, ecosystemBrands, footerColumns, goldBenefits, stats } from '../data'

function HomePage() {
  const user = useAppSelector((state) => state.auth.user)

  return (
    <div className="page-shell page-shell--landing">
      <div className="landing-util-nav">
        <Link to="/ncr/restaurants">Order Food</Link>
        {user ? (
          <>
            <Link to="/ncr/restaurants">Restaurants</Link>
            <Link to="/orders">My Orders</Link>
            <span className="landing-util-nav__user">Hi, {user.name.split(' ')[0]}</span>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>

      <HeroSection />
      <StoryShowcase stats={stats} />
      <FeatureShowcase features={appFeatures} />
      <GoldBenefits items={goldBenefits} />
      <BrandShowcase brands={ecosystemBrands} />
      <DownloadBanner />
      <Footer columns={footerColumns} />
      <MobileAppBar />
    </div>
  )
}

export default HomePage
