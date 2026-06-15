import type { Itinerary } from '@/lib/types/itinerary'

export function itineraryStructuredData(itinerary: Itinerary, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: `${itinerary.dates.durationDays}-day ${itinerary.destination.primaryCity} itinerary`,
    description: itinerary.summary,
    url,
    touristType: itinerary.preferences.vibeTags,
    itinerary: itinerary.days.map((day) => ({
      '@type': 'ItemList',
      name: `Day ${day.dayNumber}: ${day.title}`,
      description: day.narrative,
      itemListElement: day.activities.map((activity, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': activityToSchemaType(activity.type),
          name: activity.title,
          description: activity.description,
          address: activity.location?.address,
        },
      })),
    })),
  }
}

function activityToSchemaType(type: string): string {
  const map: Record<string, string> = {
    restaurant: 'Restaurant',
    cafe: 'CafeOrCoffeeShop',
    bar: 'BarOrPub',
    museum: 'Museum',
    gallery: 'ArtGallery',
    shopping: 'ShoppingCenter',
    outdoor: 'TouristAttraction',
    experience: 'TouristAttraction',
  }
  return map[type] || 'TouristAttraction'
}
