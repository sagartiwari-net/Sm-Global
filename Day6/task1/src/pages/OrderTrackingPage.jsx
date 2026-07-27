import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ORDER_STEPS } from '../data'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { advanceOrderStatus, setActiveOrder } from '../features/orders/ordersSlice'

function OrderTrackingPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const order = useAppSelector((state) => state.orders.list.find((o) => o.id === id))

  useEffect(() => {
    if (id) dispatch(setActiveOrder(id))
  }, [dispatch, id])

  useEffect(() => {
    if (!order || order.status === 'delivered') return undefined

    const timer = setInterval(() => {
      dispatch(advanceOrderStatus(order.id))
    }, 4000)

    return () => clearInterval(timer)
  }, [dispatch, order])

  if (!order) {
    return (
      <div className="page-shell">
        <Navbar variant="solid" />
        <div className="container empty-page">
          <h1>Order not found</h1>
          <Link to="/">Go home</Link>
        </div>
      </div>
    )
  }

  const current = ORDER_STEPS[order.statusIndex]

  return (
    <div className="page-shell">
      <Navbar variant="solid" />
      <section className="section container tracking-page">
        <div className="tracking-card">
          <p className="tracking-label">Order #{order.id}</p>
          <h1>{current.label}</h1>
          <p className="tracking-desc">{current.description}</p>
          <p className="tracking-resto">
            From <strong>{order.restaurantName}</strong>
          </p>

          <ol className="tracking-steps">
            {ORDER_STEPS.map((step, index) => {
              const done = index <= order.statusIndex
              const active = index === order.statusIndex
              return (
                <li key={step.id} className={`tracking-step ${done ? 'is-done' : ''} ${active ? 'is-active' : ''}`}>
                  <span className="tracking-dot" aria-hidden="true" />
                  <div>
                    <strong>{step.label}</strong>
                    <p>{step.description}</p>
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="tracking-summary">
            <h2>Order summary</h2>
            {order.items.map((item) => (
              <div key={item.id} className="bill-row">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
            <div className="bill-row bill-row--total">
              <span>Paid</span>
              <span>₹{order.total}</span>
            </div>
            <p className="tracking-address">
              Delivering to: <strong>{order.address}</strong>
            </p>
          </div>

          {order.status === 'delivered' ? (
            <Link to="/" className="btn-primary">
              Order again
            </Link>
          ) : (
            <p className="tracking-wait">Please wait — your order status updates automatically…</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default OrderTrackingPage
