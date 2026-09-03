import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    bagOpen: false,
    loginOpen: false,
  },
  reducers: {
    openBag(state) {
      state.bagOpen = true
    },
    closeBag(state) {
      state.bagOpen = false
    },
    openLogin(state) {
      state.loginOpen = true
    },
    closeLogin(state) {
      state.loginOpen = false
    },
  },
})

export const { openBag, closeBag, openLogin, closeLogin } = uiSlice.actions
export default uiSlice.reducer
