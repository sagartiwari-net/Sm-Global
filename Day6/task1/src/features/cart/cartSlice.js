import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  restaurantId: null,
  restaurantName: null,
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { restaurantId, restaurantName, item } = action.payload

      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.restaurantId = restaurantId
        state.restaurantName = restaurantName
        state.items = [{ ...item, qty: 1 }]
        return
      }

      state.restaurantId = restaurantId
      state.restaurantName = restaurantName
      const existing = state.items.find((i) => i.id === item.id)
      if (existing) {
        existing.qty += 1
      } else {
        state.items.push({ ...item, qty: 1 })
      }
    },
    increaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload)
      if (item) item.qty += 1
    },
    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload)
      if (!item) return
      if (item.qty <= 1) {
        state.items = state.items.filter((i) => i.id !== action.payload)
        if (!state.items.length) {
          state.restaurantId = null
          state.restaurantName = null
        }
      } else {
        item.qty -= 1
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload)
      if (!state.items.length) {
        state.restaurantId = null
        state.restaurantName = null
      }
    },
    clearCart: () => initialState,
  },
})

export const { addToCart, increaseQty, decreaseQty, removeFromCart, clearCart } = cartSlice.actions

export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.qty, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0)

export default cartSlice.reducer
