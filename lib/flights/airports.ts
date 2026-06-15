// Minimal airport gazetteer for the deterministic estimator. Maps IATA + common city
// names to coordinates and the primary airport. Extend freely; a real flight API would
// replace the estimate, not this lookup.
export interface Airport { code: string; city: string; lat: number; lng: number; country: string }

export const AIRPORTS: Airport[] = [
  { code: 'HND', city: 'Tokyo', lat: 35.553, lng: 139.781, country: 'Japan' },
  { code: 'NRT', city: 'Tokyo Narita', lat: 35.772, lng: 140.392, country: 'Japan' },
  { code: 'LIS', city: 'Lisbon', lat: 38.774, lng: -9.134, country: 'Portugal' },
  { code: 'BCN', city: 'Barcelona', lat: 41.297, lng: 2.078, country: 'Spain' },
  { code: 'CDG', city: 'Paris', lat: 49.010, lng: 2.547, country: 'France' },
  { code: 'MEX', city: 'Mexico City', lat: 19.436, lng: -99.072, country: 'Mexico' },
  { code: 'JFK', city: 'New York', lat: 40.641, lng: -73.778, country: 'United States' },
  { code: 'EWR', city: 'Newark', lat: 40.689, lng: -74.174, country: 'United States' },
  { code: 'SFO', city: 'San Francisco', lat: 37.621, lng: -122.379, country: 'United States' },
  { code: 'LAX', city: 'Los Angeles', lat: 33.942, lng: -118.408, country: 'United States' },
  { code: 'ORD', city: 'Chicago', lat: 41.978, lng: -87.904, country: 'United States' },
  { code: 'LHR', city: 'London', lat: 51.470, lng: -0.454, country: 'United Kingdom' },
  { code: 'AMS', city: 'Amsterdam', lat: 52.310, lng: 4.768, country: 'Netherlands' },
  { code: 'FRA', city: 'Frankfurt', lat: 50.037, lng: 8.562, country: 'Germany' },
  { code: 'DXB', city: 'Dubai', lat: 25.253, lng: 55.365, country: 'UAE' },
  { code: 'SIN', city: 'Singapore', lat: 1.364, lng: 103.991, country: 'Singapore' },
  { code: 'SYD', city: 'Sydney', lat: -33.939, lng: 151.175, country: 'Australia' },
  { code: 'YYZ', city: 'Toronto', lat: 43.677, lng: -79.624, country: 'Canada' },
  { code: 'GRU', city: 'São Paulo', lat: -23.435, lng: -46.473, country: 'Brazil' },
  { code: 'BOS', city: 'Boston', lat: 42.366, lng: -71.020, country: 'United States' },
]

// Primary destination airport per catalog city.
export const CITY_AIRPORT: Record<string, string> = {
  tokyo: 'HND', lisbon: 'LIS', barcelona: 'BCN', paris: 'CDG',
  'mexico-city': 'MEX', 'new-york-city': 'JFK',
}

export function findAirport(query: string): Airport | undefined {
  const q = query.trim().toUpperCase()
  const byCode = AIRPORTS.find((a) => a.code === q)
  if (byCode) return byCode
  const lower = query.trim().toLowerCase()
  return AIRPORTS.find((a) => a.city.toLowerCase().includes(lower))
}
