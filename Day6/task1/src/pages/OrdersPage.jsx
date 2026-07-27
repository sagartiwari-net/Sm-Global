import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { ORDER_STEPS } from '../data'
import { useAppSelector } from '../hooks/useAppSelector'

function OrdersPage() {
  const user = useAppSelector((state) => state.auth.user)
  const orders = useAppSelector((state) => state.orders.list)

  if (!user) {
    return (
      <div className="page-shell">
        <Navbar variant="solid" />
        <div className="container empty-page">
          <h1>Please log in to see your orders</h1>
          <Link to="/login" className="btn-primary">
            Log in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <Navbar variant="solid" />
      <section className="section container">
        <h1>My Orders</h1>
        {!orders.length ? (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>Order from a restaurant to see tracking here.</p>
            <Link to="/restaurants">Browse restaurants</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <Link key={order.id} to={`/order/${order.id}`} className="order-card">
                <div>
                  <h3>{order.restaurantName}</h3>
                  <p>
                    {ORDER_STEPS[order.statusIndex]?.label} • ₹{order.total}
                  </p>
                  <small>{new Date(order.createdAt).toLocaleString()}</small>
                </div>
                <span>Track ›</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default OrdersPage
