import { configureStore } from '@reduxjs/toolkit'
import bagReducer from '../features/bag/bagSlice'
import wishlistReducer from '../features/wishlist/wishlistSlice'
import authReducer from '../features/auth/authSlice'
import uiReducer from '../features/ui/uiSlice'
import ordersReducer from '../features/orders/ordersSlice'

export const store = configureStore({
  reducer: {
    bag: bagReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    ui: uiReducer,
    orders: ordersReducer,
  },
})

store.subscribe(() => {
  const state = store.getState()
  try {
    localStorage.setItem('smmmynta_user', JSON.stringify(state.auth.user))
    localStorage.setItem('smmmynta_addresses', JSON.stringify(state.auth.addresses))
    localStorage.setItem('smmmynta_wishlist', JSON.stringify(state.wishlist.items))
    localStorage.setItem('smmmynta_orders', JSON.stringify(state.orders.list))
  } catch {
    /* ignore */
  }
})
