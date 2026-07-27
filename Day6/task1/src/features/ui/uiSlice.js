import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showMobileBar: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setShowMobileBar: (state, action) => {
      state.showMobileBar = action.payload
    },
  },
})

export const { setShowMobileBar } = uiSlice.actions
export default uiSlice.reducer
