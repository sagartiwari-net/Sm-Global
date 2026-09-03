import { Link } from 'react-router-dom'

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-12 text-center">
      <p className="mx-auto mb-4 text-2xl font-bold tracking-tight text-smm-pink">
        Smm<span className="text-smm-text">Mynta</span>{' '}
        <span className="text-base font-semibold text-smm-muted">Studio</span>
      </p>
      <h1 className="mb-2 text-3xl font-bold text-smm-text">Your daily inspiration</h1>
      <p className="mb-8 text-smm-muted">
        Explore fashion stories, celebrity looks and trending styles on SmmMynta Studio.
      </p>
      <img
        src="https://constant.myntassets.com/web/assets/img/sudio-nav-banner.png"
        alt="Studio"
        className="mx-auto mb-8 w-full max-w-lg"
      />
      <Link
        to="/shop/all"
        className="inline-block rounded border border-smm-border px-6 py-3 text-sm font-bold uppercase"
      >
        Start Shopping
      </Link>
    </div>
  )
}
