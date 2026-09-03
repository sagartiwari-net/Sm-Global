import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiHeart, FiLogOut, FiMapPin, FiPackage, FiUser } from 'react-icons/fi'
import { logout, addAddress, removeAddress, updateProfile } from '../features/auth/authSlice'
import { selectOrders } from '../features/orders/ordersSlice'
import { openLogin } from '../features/ui/uiSlice'

const TABS = [
  { id: 'overview', label: 'Overview', icon: FiUser },
  { id: 'orders', label: 'Orders', icon: FiPackage },
  { id: 'addresses', label: 'Addresses', icon: FiMapPin },
]

export default function ProfilePage() {
  const { section = 'overview' } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const addresses = useSelector((s) => s.auth.addresses)
  const orders = useSelector(selectOrders)
  const wishlistCount = useSelector((s) => s.wishlist.items.length)
  const [editName, setEditName] = useState(user?.name || '')
  const [showAddrForm, setShowAddrForm] = useState(false)
  const [addrForm, setAddrForm] = useState({
    name: '',
    phone: '',
    address: '',
    locality: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
    type: 'Home',
  })

  if (!user) {
    return (
      <main className="mx-auto max-w-[480px] px-4 py-16 text-center">
        <p className="text-lg font-bold">Login to view your profile</p>
        <button type="button" onClick={() => dispatch(openLogin())} className="mt-4 bg-smm-pink px-6 py-2.5 text-sm font-bold text-white">
          LOGIN / SIGNUP
        </button>
      </main>
    )
  }

  const active = TABS.some((t) => t.id === section) ? section : 'overview'
  if (section && section !== 'overview' && !TABS.some((t) => t.id === section)) {
    return <Navigate to="/profile" replace />
  }

  return (
    <main className="min-h-[70vh] bg-smm-bg">
      <div className="border-b border-smm-border bg-white">
        <div className="mx-auto max-w-[1080px] px-4 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-smm-muted">Account</p>
          <h1 className="mt-1 text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-smm-muted">{user.phone}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1080px] gap-4 px-3 py-5 md:grid-cols-[240px_1fr] md:px-4">
        <aside className="h-fit bg-white">
          <nav className="flex overflow-x-auto md:flex-col">
            {TABS.map(({ id, label, icon: Icon }) => (
              <Link
                key={id}
                to={id === 'overview' ? '/profile' : `/profile/${id}`}
                className={`flex shrink-0 items-center gap-2 px-4 py-3.5 text-sm font-semibold ${
                  active === id ? 'border-b-2 border-smm-pink text-smm-pink md:border-b-0 md:border-l-4 md:bg-[#fff4f4]' : 'text-smm-gray hover:bg-smm-bg'
                }`}
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
            <Link to="/wishlist" className="flex shrink-0 items-center gap-2 px-4 py-3.5 text-sm font-semibold text-smm-gray hover:bg-smm-bg">
              <FiHeart size={16} /> Wishlist ({wishlistCount})
            </Link>
            <button
              type="button"
              onClick={() => {
                dispatch(logout())
                navigate('/')
              }}
              className="flex w-full shrink-0 items-center gap-2 px-4 py-3.5 text-left text-sm font-semibold text-smm-gray hover:bg-smm-bg"
            >
              <FiLogOut size={16} /> Logout
            </button>
          </nav>
        </aside>

        <section className="bg-white p-4 md:p-6">
          {active === 'overview' && (
            <div>
              <h2 className="text-base font-bold">Profile Details</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (editName.trim()) dispatch(updateProfile({ name: editName.trim() }))
                }}
                className="mt-4 max-w-md space-y-3"
              >
                <label className="block text-xs font-semibold">
                  Full Name
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 w-full border border-smm-border px-3 py-2.5 text-sm outline-none focus:border-smm-pink" />
                </label>
                <label className="block text-xs font-semibold">
                  Mobile Number
                  <input value={user.phone} disabled className="mt-1 w-full border border-smm-border bg-smm-bg px-3 py-2.5 text-sm text-smm-muted" />
                </label>
                <button type="submit" className="bg-smm-pink px-5 py-2.5 text-sm font-bold text-white">SAVE DETAILS</button>
              </form>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Link to="/profile/orders" className="border border-smm-border p-4 hover:border-smm-pink">
                  <p className="text-xs uppercase text-smm-muted">Orders</p>
                  <p className="mt-1 text-xl font-bold">{orders.length}</p>
                </Link>
                <Link to="/profile/addresses" className="border border-smm-border p-4 hover:border-smm-pink">
                  <p className="text-xs uppercase text-smm-muted">Addresses</p>
                  <p className="mt-1 text-xl font-bold">{addresses.length}</p>
                </Link>
                <Link to="/wishlist" className="border border-smm-border p-4 hover:border-smm-pink">
                  <p className="text-xs uppercase text-smm-muted">Wishlist</p>
                  <p className="mt-1 text-xl font-bold">{wishlistCount}</p>
                </Link>
              </div>
            </div>
          )}

          {active === 'orders' && (
            <div>
              <h2 className="text-base font-bold">All Orders</h2>
              {!orders.length ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-smm-muted">You haven&apos;t placed any orders yet.</p>
                  <Link to="/shop/all" className="mt-4 inline-block bg-smm-pink px-5 py-2.5 text-sm font-bold text-white">START SHOPPING</Link>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-smm-border">
                  {orders.map((order) => (
                    <li key={order.id}>
                      <Link to={`/orders/${order.id}`} className="flex items-center justify-between gap-3 py-4 text-sm">
                        <div>
                          <p className="font-bold">Order #{order.id}</p>
                          <p className="text-smm-muted">
                            {new Date(order.placedAt).toLocaleDateString('en-IN')} · {order.items.length} item(s)
                          </p>
                          <p className="mt-1 text-xs font-semibold text-green-700">{order.status}</p>
                        </div>
                        <p className="font-bold">₹{order.totals.total}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {active === 'addresses' && (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold">Saved Addresses</h2>
                <button
                  type="button"
                  onClick={() => {
                    setAddrForm((f) => ({ ...f, name: user.name, phone: user.phone }))
                    setShowAddrForm((v) => !v)
                  }}
                  className="text-xs font-bold text-smm-pink"
                >
                  {showAddrForm ? 'CANCEL' : '+ ADD NEW ADDRESS'}
                </button>
              </div>
              {showAddrForm && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    dispatch(addAddress({ ...addrForm, name: addrForm.name || user.name, phone: addrForm.phone || user.phone }))
                    setShowAddrForm(false)
                  }}
                  className="mt-4 grid gap-3 border border-smm-border p-4 sm:grid-cols-2"
                >
                  {[['name', 'Name'], ['phone', 'Phone'], ['address', 'Address'], ['locality', 'Locality'], ['city', 'City'], ['state', 'State'], ['pincode', 'Pincode']].map(([key, label]) => (
                    <label key={key} className={`block text-xs font-semibold ${key === 'address' ? 'sm:col-span-2' : ''}`}>
                      {label}
                      <input required value={addrForm[key]} onChange={(e) => setAddrForm((f) => ({ ...f, [key]: e.target.value }))} className="mt-1 w-full border border-smm-border px-3 py-2 text-sm outline-none focus:border-smm-pink" />
                    </label>
                  ))}
                  <button type="submit" className="bg-smm-pink px-4 py-2.5 text-sm font-bold text-white sm:col-span-2">SAVE ADDRESS</button>
                </form>
              )}
              <ul className="mt-4 space-y-3">
                {addresses.map((addr) => (
                  <li key={addr.id} className="border border-smm-border p-4 text-sm">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="font-bold">{addr.name}</p>
                        <p className="mt-1 text-smm-muted">
                          {addr.address}{addr.locality ? `, ${addr.locality}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-smm-muted">Mobile: {addr.phone}</p>
                      </div>
                      <button type="button" onClick={() => dispatch(removeAddress(addr.id))} className="text-xs font-semibold text-smm-muted hover:text-smm-pink">REMOVE</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
