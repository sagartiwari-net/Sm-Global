import profiles from './restaurantProfiles.json'
import collections from './collections.json'

/**
 * Merge list-card restaurant data with optional rich profile from JSON.
 * Restaurants without a profile still get a full Zomato-style layout via defaults.
 */
export function getRestaurantProfile(restaurant) {
  if (!restaurant) return null

  const extra = profiles[restaurant.slug] || profiles[String(restaurant.id)] || {}
  const cuisines = String(restaurant.cuisine || '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)

  const photos = extra.photos?.length
    ? extra.photos
    : [restaurant.image, restaurant.image, restaurant.image, restaurant.image].filter(Boolean)

  const offers =
    extra.offers ||
    (restaurant.offer
      ? [
          {
            heading: 'INSTANT OFFER',
            title: restaurant.offer,
            subtitle: 'on bill payments',
            highlighted: true,
          },
          {
            heading: 'SURPRISE',
            title: 'Get a scratch card',
            subtitle: 'after every transaction',
            highlighted: false,
          },
        ]
      : [
          {
            heading: 'INSTANT OFFER',
            title: 'Flat 15% OFF',
            subtitle: 'on bill payments',
            highlighted: true,
          },
        ])

  return {
    ...restaurant,
    address: extra.address || restaurant.area || '',
    timing: extra.timing || '11am – 11pm (Today)',
    openNow: extra.openNow ?? !restaurant.opensAt,
    phones: extra.phones || [],
    diningReviews: extra.diningReviews || '1.2K',
    deliveryRating: extra.deliveryRating ?? Math.max(3.8, Number(restaurant.rating) - 0.2).toFixed(1),
    deliveryReviews: extra.deliveryReviews || '240',
    costDetail: extra.costDetail || `${restaurant.cost} (approx.)`,
    knownFor: extra.knownFor || restaurant.dish || 'Great Food, Ambience',
    lat: extra.lat ?? 28.6139,
    lng: extra.lng ?? 77.209,
    photos,
    offers,
    highlights: extra.highlights || [
      'Lunch',
      'Dinner',
      'Indoor seating',
      'Takeaway available',
      'Family friendly',
    ],
    reviewHighlights: extra.reviewHighlights || ['Great Food', 'Ambience', 'Service'],
    featuredCollections: extra.featuredCollections || collections.slice(0, 4),
    cuisines,
  }
}
