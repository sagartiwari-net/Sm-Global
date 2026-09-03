import { createSlice } from '@reduxjs/toolkit'

const bagSlice = createSlice({
  name: 'bag',
  initialState: {
    items: [],
  },
  reducers: {
    addToBag(state, action) {
      const product = action.payload
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) {
        existing.qty += 1
      } else {
        state.items.push({ ...product, qty: 1 })
      }
    },
    removeFromBag(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    updateQty(state, action) {
      const { id, qty } = action.payload
      const item = state.items.find((i) => i.id === id)
      if (item) {
        item.qty = Math.max(1, qty)
      }
    },
    clearBag(state) {
      state.items = []
    },
  },
})

export const { addToBag, removeFromBag, updateQty, clearBag } = bagSlice.actions
export default bagSlice.reducer

export const selectBagCount = (state) =>
  state.bag.items.reduce((sum, i) => sum + i.qty, 0)

export const selectBagTotal = (state) =>
  state.bag.items.reduce((sum, i) => sum + i.price * i.qty, 0)
