import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearBag, selectBagTotal, updateQty, removeFromBag } from '../features/bag/bagSlice'
import { placeOrder } from '../features/orders/ordersSlice'
import { addAddress } from '../features/auth/authSlice'
import { closeBag, openLogin } from '../features/ui/uiSlice'

const PAYMENTS = [
  { id: 'cod', label: 'Cash on Delivery (Cash/UPI)' },
  { id: 'upi', label: 'UPI (PhonePe / GPay / Paytm)' },
  { id: 'card', label: 'Credit / Debit Card' },
]

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const items = useSelector((s) => s.bag.items)
  const user = useSelector((s) => s.auth.user)
  const addresses = useSelector((s) => s.auth.addresses)
  const total = useSelector(selectBagTotal)
  const delivery = total >= 799 ? 0 : 79
  const grandTotal = total + delivery

  const [selectedAddrId, setSelectedAddrId] = useState(addresses[0]?.id || '')
  const [payment, setPayment] = useState('cod')
  const [error, setError] = useState('')
  const [showNew, setShowNew] = useState(!addresses.length)
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    locality: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
    type: 'Home',
  })

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddrId) || addresses[0],
    [addresses, selectedAddrId],
  )

  if (!items.length) {
    return (
      <main className="mx-auto max-w-[720px] px-4 py-16 text-center">
        <p className="text-lg font-bold">Your bag is empty</p>
        <Link to="/shop/all" className="mt-4 inline-block bg-smm-pink px-5 py-2.5 text-sm font-bold text-white">
          CONTINUE SHOPPING
        </Link>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-[520px] px-4 py-16 text-center">
        <p className="text-lg font-bold">Login to place order</p>
        <button
          type="button"
          onClick={() => dispatch(openLogin())}
          className="mt-5 bg-smm-pink px-6 py-2.5 text-sm font-bold text-white"
        >
          LOGIN / SIGNUP
        </button>
      </main>
    )
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    setError('')
    let address = selectedAddress
    if (showNew || !address) {
      if (!form.name || !form.phone || !form.address || !form.pincode) {
        setError('Please fill all address fields')
        return
      }
      const id = `addr_${Date.now()}`
      dispatch(addAddress({ ...form, id }))
      address = { ...form, id }
    }

    const order = {
      id: `SMM${Date.now().toString().slice(-8)}`,
      placedAt: new Date().toISOString(),
      status: 'Confirmed',
      payment,
      paymentLabel: PAYMENTS.find((p) => p.id === payment)?.label || payment,
      address,
      items: items.map((i) => ({
        id: i.id,
        brand: i.brand,
        name: i.name,
        price: i.price,
        size: i.size,
        qty: i.qty,
        image: i.image || i.fallback,
      })),
      totals: { total: grandTotal, delivery, items: total },
    }

    dispatch(placeOrder(order))
    dispatch(clearBag())
    dispatch(closeBag())
    navigate(`/orders/${order.id}`, { replace: true })
  }

  return (
    <main className="min-h-[70vh] bg-smm-bg">
      <div className="border-b border-smm-border bg-white px-4 py-4">
        <div className="mx-auto max-w-[1080px]">
          <h1 className="text-lg font-bold tracking-wide">CHECKOUT</h1>
        </div>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="mx-auto grid max-w-[1080px] gap-4 px-3 py-5 md:grid-cols-[1fr_340px] md:px-4"
      >
        <div className="space-y-4">
          <section className="bg-white p-4 md:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-wide">DELIVERY ADDRESS</h2>
              {addresses.length > 0 && (
                <button type="button" onClick={() => setShowNew((v) => !v)} className="text-xs font-bold text-smm-pink">
                  {showNew ? 'SELECT SAVED' : '+ ADD NEW'}
                </button>
              )}
            </div>
            {!showNew && addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label key={addr.id} className={`flex cursor-pointer gap-3 border p-3 ${selectedAddrId === addr.id ? 'border-smm-pink bg-[#fff4f4]' : 'border-smm-border'}`}>
                    <input type="radio" name="address" checked={selectedAddrId === addr.id} onChange={() => setSelectedAddrId(addr.id)} className="mt-1 accent-smm-pink" />
                    <div className="text-sm">
                      <p className="font-bold">{addr.name}</p>
                      <p className="mt-1 text-smm-muted">
                        {addr.address}{addr.locality ? `, ${addr.locality}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-smm-muted">Mobile: {addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {[['name', 'Full Name'], ['phone', 'Mobile'], ['address', 'Address'], ['locality', 'Locality'], ['city', 'City'], ['state', 'State'], ['pincode', 'Pincode']].map(([key, label]) => (
                  <label key={key} className={`block text-xs font-semibold ${key === 'address' || key === 'locality' ? 'sm:col-span-2' : ''}`}>
                    {label}
                    <input
                      value={form[key]}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="mt-1 w-full border border-smm-border px-3 py-2.5 text-sm outline-none focus:border-smm-pink"
                      required={showNew || !addresses.length}
                    />
                  </label>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white p-4 md:p-5">
            <h2 className="mb-3 text-sm font-bold tracking-wide">BAG ITEMS ({items.length})</h2>
            <ul className="divide-y divide-smm-border">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-3">
                  <img src={item.image || item.fallback} alt="" className="h-20 w-16 object-cover" />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-bold">{item.brand}</p>
                    <p className="truncate text-smm-muted">{item.name}</p>
                    {item.size && <p className="text-xs text-smm-muted">Size: {item.size}</p>}
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" className="border px-2" onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))}>−</button>
                      <span className="text-xs font-bold">{item.qty}</span>
                      <button type="button" className="border px-2" onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}>+</button>
                      <button type="button" onClick={() => dispatch(removeFromBag(item.id))} className="ml-2 text-xs font-semibold text-smm-pink">REMOVE</button>
                    </div>
                  </div>
                  <p className="font-bold">₹{item.price * item.qty}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white p-4 md:p-5">
            <h2 className="mb-3 text-sm font-bold tracking-wide">PAYMENT METHOD</h2>
            <div className="space-y-2">
              {PAYMENTS.map((p) => (
                <label key={p.id} className={`flex cursor-pointer items-center gap-3 border p-3 text-sm ${payment === p.id ? 'border-smm-pink bg-[#fff4f4]' : 'border-smm-border'}`}>
                  <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} className="accent-smm-pink" />
                  {p.label}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit bg-white p-4 md:sticky md:top-24 md:p-5">
          <h2 className="text-sm font-bold tracking-wide text-smm-muted">PRICE DETAILS</h2>
          <dl className="mt-3 space-y-2 border-b border-dashed border-smm-border pb-3 text-sm">
            <div className="flex justify-between"><dt>Total MRP</dt><dd>₹{total}</dd></div>
            <div className="flex justify-between"><dt>Convenience Fee</dt><dd>{delivery === 0 ? <span className="text-green-700">FREE</span> : `₹${delivery}`}</dd></div>
          </dl>
          <div className="mt-3 flex justify-between text-base font-bold">
            <span>Total Amount</span>
            <span>₹{grandTotal}</span>
          </div>
          {error && <p className="mt-3 text-xs font-semibold text-smm-pink">{error}</p>}
          <button type="submit" className="mt-4 w-full bg-smm-pink py-3.5 text-sm font-bold tracking-wide text-white hover:bg-smm-pink-dark">
            PLACE ORDER
          </button>
        </aside>
      </form>
    </main>
  )
}
