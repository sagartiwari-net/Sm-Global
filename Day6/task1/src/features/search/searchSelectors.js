import { createSelector } from '@reduxjs/toolkit'
import { deliveryRestaurants } from '../../data'

export const selectLocation = (state) => state.search.location
export const selectQuery = (state) => state.search.query

export const selectFilteredRestaurants = createSelector(
  [selectLocation, selectQuery],
  (location, query) => {
    const normalizedQuery = query.trim().toLowerCase()

    return deliveryRestaurants.filter((item) => {
      const matchesLocation = location === 'All' || item.area.includes(location)
      const searchBlob = [item.name, item.cuisine, item.dish, item.area].join(' ').toLowerCase()
      const matchesQuery = !normalizedQuery || searchBlob.includes(normalizedQuery)
      return matchesLocation && matchesQuery
    })
  },
)
