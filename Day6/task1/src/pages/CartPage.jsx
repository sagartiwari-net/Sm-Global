import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import {
  clearCart,
  decreaseQty,
  increaseQty,
  removeFromCart,
  selectCartTotal,
} from '../features/cart/cartSlice'
import { placeOrder } from '../features/orders/ordersSlice'

function CartPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)
  const cart = useAppSelector((state) => state.cart)
  const total = useAppSelector(selectCartTotal)
  const [address, setAddress] = useState('House 12, Connaught Place, New Delhi')

  if (!user) {
    return (
      <div className="page-shell">
        <Navbar variant="solid" />
        <div className="container empty-page">
          <h1>Please log in to view your cart</h1>
          <Link to="/login" className="btn-primary">
            Log in
          </Link>
        </div>
      </div>
    )
  }

  if (!cart.items.length) {
    return (
      <div className="page-shell">
        <Navbar variant="solid" />
        <div className="container empty-page">
          <h1>Your cart is empty</h1>
          <p>Browse restaurants and add your favourite dishes.</p>
          <Link to="/restaurants" className="btn-primary">
            Browse restaurants
          </Link>
        </div>
      </div>
    )
  }

  const deliveryFee = total > 499 ? 0 : 40
  const taxes = Math.round(total * 0.05)
  const grandTotal = total + deliveryFee + taxes

  const handleCheckout = (e) => {
    e.preventDefault()
    const orderAction = dispatch(
      placeOrder({
        restaurantId: cart.restaurantId,
        restaurantName: cart.restaurantName,
        items: cart.items,
        total: grandTotal,
        address: address.trim(),
        user: { name: user.name, email: user.email, phone: user.phone },
      }),
    )
    dispatch(clearCart())
    navigate(`/order/${orderAction.payload.id}`)
  }

  return (
    <div className="page-shell">
      <Navbar variant="solid" />
      <section className="section container cart-layout">
        <div>
          <h1>Your cart</h1>
          <p className="cart-resto">{cart.restaurantName}</p>

          <div className="cart-list">
            {cart.items.map((item) => (
              <article key={item.id} className="cart-item">
                <div>
                  <h3>{item.name}</h3>
                  <p>₹{item.price}</p>
                </div>
                <div className="cart-item__actions">
                  <div className="qty-control">
                    <button type="button" onClick={() => dispatch(decreaseQty(item.id))}>
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button type="button" onClick={() => dispatch(increaseQty(item.id))}>
                      +
                    </button>
                  </div>
                  <button type="button" className="link-btn" onClick={() => dispatch(removeFromCart(item.id))}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="cart-summary">
          <h2>Delivery details</h2>
          <form onSubmit={handleCheckout}>
            <label>
              Delivery address
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={3}
              />
            </label>

            <div className="bill-row">
              <span>Item total</span>
              <span>₹{total}</span>
            </div>
            <div className="bill-row">
              <span>Delivery fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            <div className="bill-row">
              <span>Taxes</span>
              <span>₹{taxes}</span>
            </div>
            <div className="bill-row bill-row--total">
              <span>To pay</span>
              <span>₹{grandTotal}</span>
            </div>

            <button type="submit" className="auth-submit">
              Place order
            </button>
          </form>
        </aside>
      </section>
    </div>
  )
}

export default CartPage
