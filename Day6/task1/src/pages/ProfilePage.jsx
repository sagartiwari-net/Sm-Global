import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAppSelector } from '../hooks/useAppSelector'
import { DEFAULT_AVATAR, DEFAULT_COVER, footerColumns } from '../data'
import { profileNav, sampleReviews } from '../data/profileData'

const sectionTitles = {
  reviews: 'Reviews',
  photos: 'Photos',
  followers: 'Followers',
  'rec-viewed': 'Recently Viewed',
  addresses: 'My addresses',
  managecards: 'Manage Cards',
  bookings: 'Your Bookings',
  settings: 'Settings',
}

function ReviewCard({ review }) {
  return (
    <article className="profile-review">
      <div className="profile-review__top">
        <Link to={review.restaurantUrl} className="profile-review__res">
          <img src={review.restaurantThumb} alt="" className="profile-review__thumb" />
          <div>
            <p className="profile-review__name">{review.restaurantName}</p>
            <span className="profile-review__area">{review.restaurantArea}</span>
          </div>
        </Link>
      </div>

      <div className="profile-review__meta">
        <span className="profile-review__rating">
          {review.rating} <span aria-hidden>★</span>
        </span>
        <div className="profile-review__type">
          <span>{review.ratingType}</span>
        </div>
        <p className="profile-review__date">{review.date}</p>
      </div>

      {review.text ? <p className="profile-review__text">{review.text}</p> : null}

      <p className="profile-review__votes">
        {review.helpful} Votes for helpful, {review.comments} Comments
      </p>

      <div className="profile-review__actions">
        <button type="button">Helpful</button>
        <button type="button">Comment</button>
        <button type="button">Share</button>
      </div>
    </article>
  )
}

function ProfileContent({ section, user }) {
  if (section === 'reviews') {
    return (
      <>
        <h1 className="profile-main__title">Reviews</h1>
        {sampleReviews.length ? (
          sampleReviews.map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <div className="profile-empty">
            <h3>You haven&apos;t written any reviews yet.</h3>
            <p>Your ratings and reviews go a long way towards helping people decide where to eat.</p>
          </div>
        )}
      </>
    )
  }

  if (section === 'settings') {
    return (
      <>
        <h1 className="profile-main__title">Settings</h1>
        <div className="profile-settings">
          <div className="profile-settings__row">
            <div>
              <h3>Name</h3>
              <p>{user.name}</p>
            </div>
          </div>
          <div className="profile-settings__row">
            <div>
              <h3>Email</h3>
              <p>{user.email}</p>
            </div>
          </div>
          <div className="profile-settings__row">
            <div>
              <h3>Phone</h3>
              <p>{user.phone || '—'}</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  const title = sectionTitles[section] || 'Profile'
  return (
    <>
      <h1 className="profile-main__title">{title}</h1>
      <div className="profile-empty">
        <h3>Nothing here yet</h3>
        <p>This section will show your {title.toLowerCase()} activity.</p>
      </div>
    </>
  )
}

function ProfilePage() {
  const { section = 'reviews' } = useParams()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const active = sectionTitles[section] ? section : 'reviews'
  if (active !== section) {
    return <Navigate to="/profile/reviews" replace />
  }

  const avatar = user.avatar || DEFAULT_AVATAR
  const cover = user.cover || DEFAULT_COVER
  const reviewsCount = sampleReviews.length
  const photosCount = 0
  const followersCount = 0

  return (
    <div className="page-shell profile-page">
      <Navbar variant="solid" showSearch />

      <section
        className="profile-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.13) 22.25%, rgba(0,0,0,0.5) 55.5%), url(${cover})`,
        }}
      >
        <div className="container profile-hero__inner">
          <div className="profile-hero__left">
            <img src={avatar} alt="" className="profile-hero__avatar" />
            <div className="profile-hero__name">{user.name}</div>
          </div>

          <div className="profile-hero__right">
            <button
              type="button"
              className="profile-hero__edit"
              onClick={() => navigate('/profile/settings')}
            >
              <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M16.66 11.9c-0.522 0.011-0.94 0.437-0.94 0.96v3.32c0 1.049-0.851 1.9-1.9 1.9h-10c-1.049 0-1.9-0.851-1.9-1.9v-10c0-1.049 0.851-1.9 1.9-1.9h3.32c0.467-0.070 0.822-0.469 0.822-0.95s-0.354-0.88-0.817-0.949h-3.32c-2.103 0-3.809 1.699-3.82 3.799v10.001c0 2.11 1.71 3.82 3.82 3.82h10c2.101-0.011 3.8-1.717 3.8-3.82v-3.32c0-0.53-0.43-0.96-0.96-0.96zM18.96 1.040c-0.648-0.647-1.542-1.047-2.53-1.047s-1.882 0.4-2.53 1.047l-6.9 6.92c-0.072 0.074-0.132 0.16-0.178 0.254v0.14l-1.54 5.18c-0.027 0.084-0.042 0.18-0.042 0.28 0 0.265 0.108 0.506 0.282 0.68s0.413 0.28 0.678 0.28h0.13l5.18-1.5h0.14c0.1-0.048 0.186-0.108 0.26-0.18l6.92-7c0.647-0.648 1.047-1.542 1.047-2.53s-0.4-1.882-1.047-2.53z" />
              </svg>
              Edit profile
            </button>

            <div className="profile-hero__stats">
              <button type="button" onClick={() => navigate('/profile/reviews')}>
                {reviewsCount} <span>Reviews</span>
              </button>
              <button type="button" onClick={() => navigate('/profile/photos')}>
                {photosCount} <span>Photos</span>
              </button>
              <button type="button" onClick={() => navigate('/profile/followers')}>
                {followersCount} <span>Followers</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="container profile-layout">
        <aside className="profile-sidebar">
          {profileNav.map((group) => (
            <div key={group.title} className="profile-side-card">
              <h4 className="profile-side-card__title">{group.title}</h4>
              <ul className="profile-side-card__list">
                {group.items.map((item) => (
                  <li key={item.id} className="profile-side-card__item">
                    {active === item.id ? (
                      <span className="profile-side-card__active-bar" aria-hidden />
                    ) : null}
                    <Link
                      to={item.path}
                      className={`profile-side-card__link${active === item.id ? ' is-active' : ''}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="profile-side-card">
            <h4 className="profile-side-card__title">Zomato profile widget</h4>
            <p className="profile-side-card__hint">Showcase your Zomato profile on your blog.</p>
            <button type="button" className="profile-widget-btn">
              Get this widget →
            </button>
          </div>
        </aside>

        <main className="profile-main">
          <ProfileContent section={active} user={user} />
        </main>
      </div>

      <Footer columns={footerColumns} />
    </div>
  )
}

export default ProfilePage
