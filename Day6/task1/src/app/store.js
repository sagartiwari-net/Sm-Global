import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import ordersReducer from '../features/orders/ordersSlice'
import searchReducer from '../features/search/searchSlice'
import uiReducer from '../features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    cart: cartReducer,
    orders: ordersReducer,
    ui: uiReducer,
  },
})
