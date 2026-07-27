import { createSlice, nanoid } from '@reduxjs/toolkit'
import { ORDER_STEPS } from '../../data'

const ORDERS_KEY = 'zomato_orders'

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []
  } catch {
    return []
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

const initialState = {
  list: readOrders(),
  activeOrderId: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: {
      reducer: (state, action) => {
        state.list.unshift(action.payload)
        state.activeOrderId = action.payload.id
        saveOrders(state.list)
      },
      prepare: ({ restaurantId, restaurantName, items, total, address, user }) => ({
        payload: {
          id: nanoid(8),
          restaurantId,
          restaurantName,
          items,
          total,
          address,
          user,
          statusIndex: 0,
          status: ORDER_STEPS[0].id,
          createdAt: new Date().toISOString(),
        },
      }),
    },
    advanceOrderStatus: (state, action) => {
      const order = state.list.find((o) => o.id === action.payload)
      if (!order) return
      if (order.statusIndex >= ORDER_STEPS.length - 1) return
      order.statusIndex += 1
      order.status = ORDER_STEPS[order.statusIndex].id
      saveOrders(state.list)
    },
    setActiveOrder: (state, action) => {
      state.activeOrderId = action.payload
    },
  },
})

export const { placeOrder, advanceOrderStatus, setActiveOrder } = ordersSlice.actions

export const selectActiveOrder = (state) =>
  state.orders.list.find((o) => o.id === state.orders.activeOrderId) || state.orders.list[0] || null

export default ordersSlice.reducer
