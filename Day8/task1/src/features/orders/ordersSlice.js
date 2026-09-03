import { createSlice } from '@reduxjs/toolkit'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: load('smmmynta_orders', []),
  },
  reducers: {
    placeOrder(state, action) {
      state.list.unshift(action.payload)
    },
  },
})

export const { placeOrder } = ordersSlice.actions
export default ordersSlice.reducer

export const selectOrders = (state) => state.orders.list
export const selectOrderById = (id) => (state) =>
  state.orders.list.find((o) => o.id === id)
