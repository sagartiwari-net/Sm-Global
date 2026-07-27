import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  location: 'All',
  query: '',
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload
    },
    setQuery: (state, action) => {
      state.query = action.payload
    },
    resetSearch: () => initialState,
  },
})

export const { setLocation, setQuery, resetSearch } = searchSlice.actions
export default searchSlice.reducer
