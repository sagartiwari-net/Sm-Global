import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiCheckCircle } from 'react-icons/fi'
import { selectOrderById } from '../features/orders/ordersSlice'

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const order = useSelector(selectOrderById(id))
  const user = useSelector((s) => s.auth.user)

  if (!order) {
    return (
      <main className="mx-auto max-w-[640px] px-4 py-16 text-center">
        <p className="text-lg font-bold">Order not found</p>
        <Link to="/profile/orders" className="mt-4 inline-block text-sm font-bold text-smm-pink">
          View all orders
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-[70vh] bg-smm-bg">
      <div className="border-b border-smm-border bg-white px-4 py-4">
        <div className="mx-auto flex max-w-[800px] items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Order #{order.id}</h1>
            <p className="text-xs text-smm-muted">
              {new Date(order.placedAt).toLocaleString('en-IN')}
            </p>
          </div>
          <button type="button" onClick={() => navigate(-1)} className="text-sm font-semibold text-smm-pink">
            Back
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[800px] space-y-4 px-3 py-5 md:px-4">
        <section className="bg-white p-5 text-center">
          <FiCheckCircle className="mx-auto text-green-600" size={40} />
          <p className="mt-2 text-lg font-bold text-green-700">Order placed successfully</p>
          <p className="mt-1 text-sm text-smm-muted">
            {user?.name ? `Thanks, ${user.name}! ` : ''}Status: {order.status}
          </p>
        </section>

        <section className="bg-white p-5 text-sm">
          <h2 className="mb-2 font-bold tracking-wide">DELIVERY ADDRESS</h2>
          <p className="font-bold">{order.address.name}</p>
          <p className="mt-1 text-smm-muted">
            {order.address.address}
            {order.address.locality ? `, ${order.address.locality}` : ''}, {order.address.city},{' '}
            {order.address.state} - {order.address.pincode}
          </p>
          <p className="mt-2">Payment: {order.paymentLabel}</p>
        </section>

        <section className="bg-white p-5">
          <h2 className="mb-3 text-sm font-bold tracking-wide">ITEMS</h2>
          <ul className="divide-y divide-smm-border">
            {order.items.map((item) => (
              <li key={`${item.id}-${item.size}`} className="flex gap-3 py-3 text-sm">
                <img src={item.image} alt="" className="h-16 w-12 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{item.brand}</p>
                  <p className="truncate text-smm-muted">{item.name}</p>
                  <p className="text-xs text-smm-muted">
                    {item.size ? `Size: ${item.size} · ` : ''}Qty: {item.qty}
                  </p>
                </div>
                <p className="font-bold">₹{item.price * item.qty}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-smm-border pt-3 text-sm font-bold">
            <span>Total Paid</span>
            <span>₹{order.totals.total}</span>
          </div>
        </section>

        <div className="flex gap-3">
          <Link to="/profile/orders" className="bg-smm-pink px-5 py-2.5 text-sm font-bold text-white">
            MY ORDERS
          </Link>
          <Link to="/" className="border border-smm-border px-5 py-2.5 text-sm font-bold">
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </main>
  )
}
