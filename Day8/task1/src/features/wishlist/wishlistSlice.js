import { createSlice } from '@reduxjs/toolkit'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: load('smmmynta_wishlist', []),
  },
  reducers: {
    toggleWishlist(state, action) {
      const product = action.payload
      const idx = state.items.findIndex((i) => i.id === product.id)
      if (idx >= 0) state.items.splice(idx, 1)
      else state.items.push(product)
    },
  },
})

export const { toggleWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer

export const selectIsWishlisted = (id) => (state) =>
  state.wishlist.items.some((i) => String(i.id) === String(id))

export const selectWishlistCount = (state) => state.wishlist.items.length
