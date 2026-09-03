import { createSlice } from '@reduxjs/toolkit'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: load('smmmynta_user', null),
    addresses: load('smmmynta_addresses', []),
  },
  reducers: {
    login(state, action) {
      const user = action.payload
      state.user = user
      if (!state.addresses.length) {
        state.addresses = [
          {
            id: `addr_${Date.now()}`,
            name: user.name,
            phone: user.phone,
            address: '12th Cross, Indiranagar',
            locality: 'Near Metro Station',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
            type: 'Home',
          },
        ]
      }
    },
    logout(state) {
      state.user = null
    },
    updateProfile(state, action) {
      if (!state.user) return
      state.user = { ...state.user, ...action.payload }
    },
    addAddress(state, action) {
      state.addresses.push({
        id: `addr_${Date.now()}`,
        type: 'Home',
        ...action.payload,
      })
    },
    removeAddress(state, action) {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload)
    },
  },
})

export const { login, logout, updateProfile, addAddress, removeAddress } = authSlice.actions
export default authSlice.reducer
