// Curated bundles: ready-made themed trips for people who don't want to assemble from
// scratch. Each is a hand-picked, coherent set of catalog places with a clear theme. Pick
// one and you get a full stitched itinerary in one tap; or open it in the builder to tweak.
// These are the streamlined front door — the catalog browser is the power-user path.
export interface Bundle {
  id: string
  citySlug: string
  title: string
  theme: string // short label, e.g. "Food first"
  tagline: string
  durationDays: number
  pace: 'slow' | 'moderate' | 'packed'
  heroQuery: string
  placeIds: string[]
}

export const bundles: Bundle[] = [
  // Tokyo
  { id: 'tokyo-foodie', citySlug: 'tokyo', title: 'Tokyo, eaten well', theme: 'Food first', tagline: 'Three days built around standout meals, counter coffee, and one classic cocktail bar.', durationDays: 3, pace: 'moderate', heroQuery: 'tokyo ramen food night', placeIds: ['tk-tsukiji', 'tk-mameya', 'tk-afuri', 'tk-uoshin', 'tk-highfive', 'tk-nonbei'] },
  { id: 'tokyo-first', citySlug: 'tokyo', title: 'Tokyo for first-timers', theme: 'Greatest hits', tagline: 'The four-day version that hits the essentials without the tour-bus feeling.', durationDays: 4, pace: 'moderate', heroQuery: 'tokyo shibuya crossing skyline', placeIds: ['tk-meiji', 'tk-shibuyasky', 'tk-tsukiji', 'tk-teamlab', 'tk-nezu', 'tk-uoshin', 'tk-yanaka'] },
  { id: 'tokyo-dark', citySlug: 'tokyo', title: 'Tokyo after dark', theme: 'Nightlife', tagline: 'A long weekend of rooftop views, tiny bars, and late food.', durationDays: 3, pace: 'moderate', heroQuery: 'tokyo neon golden gai night', placeIds: ['tk-shibuyasky', 'tk-uoshin', 'tk-nonbei', 'tk-highfive', 'tk-goldengai', 'tk-shimokita'] },

  // Lisbon
  { id: 'lisbon-slow', citySlug: 'lisbon', title: 'Lisbon, slow', theme: 'Slow weekend', tagline: 'Trams, miradouros, and long lunches — three unhurried days.', durationDays: 3, pace: 'slow', heroQuery: 'lisbon tram alfama hills', placeIds: ['lx-belem', 'lx-jeronimos', 'lx-tram28', 'lx-senhora', 'lx-cevicheria', 'lx-park'] },
  { id: 'lisbon-food', citySlug: 'lisbon', title: 'Lisbon, eaten well', theme: 'Food first', tagline: 'Tarts, seafood, ceviche, and a market or two over four days.', durationDays: 4, pace: 'moderate', heroQuery: 'lisbon seafood pastel de nata', placeIds: ['lx-belem', 'lx-timeout', 'lx-ramiro', 'lx-cevicheria', 'lx-feira', 'lx-park'] },
  { id: 'lisbon-first', citySlug: 'lisbon', title: 'Lisbon greatest hits', theme: 'Greatest hits', tagline: 'Belém, the trams, the viewpoints, and the design district in three days.', durationDays: 3, pace: 'moderate', heroQuery: 'lisbon yellow tram belem tower', placeIds: ['lx-belem', 'lx-jeronimos', 'lx-tram28', 'lx-lxfactory', 'lx-senhora', 'lx-maat'] },

  // Barcelona
  { id: 'bcn-first', citySlug: 'barcelona', title: 'Barcelona for first-timers', theme: 'Greatest hits', tagline: 'Gaudí, the Gothic Quarter, the market, and a proper tapas dinner.', durationDays: 4, pace: 'moderate', heroQuery: 'barcelona sagrada familia gothic', placeIds: ['bcn-sagrada', 'bcn-guell', 'bcn-gothic', 'bcn-boqueria', 'bcn-picasso', 'bcn-pla'] },
  { id: 'bcn-tapas', citySlug: 'barcelona', title: 'Barcelona tapas crawl', theme: 'Food first', tagline: 'Three days of markets, vermut, montaditos, and the beach to walk it off.', durationDays: 3, pace: 'moderate', heroQuery: 'barcelona tapas vermut market', placeIds: ['bcn-boqueria', 'bcn-nomad', 'bcn-xampanyet', 'bcn-quimet', 'bcn-pla', 'bcn-barceloneta'] },
  { id: 'bcn-gaudi', citySlug: 'barcelona', title: 'Gaudí & the city', theme: 'Architecture', tagline: 'The modernista landmarks plus the best sunset hill in town.', durationDays: 3, pace: 'moderate', heroQuery: 'barcelona gaudi park guell mosaic', placeIds: ['bcn-sagrada', 'bcn-guell', 'bcn-picasso', 'bcn-gothic', 'bcn-bunkers'] },

  // Paris
  { id: 'paris-first', citySlug: 'paris', title: 'Paris for first-timers', theme: 'Greatest hits', tagline: 'The big museums and Montmartre, paced so you actually enjoy them.', durationDays: 4, pace: 'moderate', heroQuery: 'paris eiffel haussmann morning', placeIds: ['par-orsay', 'par-saintechapelle', 'par-louvre', 'par-montmartre', 'par-comptoir', 'par-enfants'] },
  { id: 'paris-food', citySlug: 'paris', title: 'Paris, eaten well', theme: 'Food first', tagline: 'Bakeries, a market lunch, galettes, a bistro, and a hidden cocktail bar.', durationDays: 3, pace: 'moderate', heroQuery: 'paris bakery cafe croissant', placeIds: ['par-painidees', 'par-enfants', 'par-breizh', 'par-comptoir', 'par-candelaria', 'par-canal'] },
  { id: 'paris-slow', citySlug: 'paris', title: 'Paris, slow', theme: 'Slow weekend', tagline: 'Canal walks, a cemetery-park, bakeries, and Montmartre with no rush.', durationDays: 3, pace: 'slow', heroQuery: 'paris canal saint martin', placeIds: ['par-canal', 'par-painidees', 'par-lachaise', 'par-enfants', 'par-montmartre'] },

  // Mexico City
  { id: 'cdmx-food', citySlug: 'mexico-city', title: 'Mexico City, eaten well', theme: 'Food first', tagline: 'Tostadas, late tacos, a great cocktail bar, and churros to close.', durationDays: 3, pace: 'moderate', heroQuery: 'mexico city tacos roma food', placeIds: ['cdmx-lardo', 'cdmx-contramar', 'cdmx-califa', 'cdmx-limantour', 'cdmx-elmoro', 'cdmx-roma'] },
  { id: 'cdmx-first', citySlug: 'mexico-city', title: 'CDMX greatest hits', theme: 'Greatest hits', tagline: 'Anthropology, Frida, Coyoacán, and a day trip to the pyramids.', durationDays: 4, pace: 'moderate', heroQuery: 'mexico city teotihuacan pyramid', placeIds: ['cdmx-antropologia', 'cdmx-frida', 'cdmx-coyoacan', 'cdmx-contramar', 'cdmx-teotihuacan', 'cdmx-roma'] },
  { id: 'cdmx-splurge', citySlug: 'mexico-city', title: 'Mexico City, the big nights', theme: 'Splurge', tagline: 'The destination tasting menu, the world-class bar, and the long lunch.', durationDays: 3, pace: 'slow', heroQuery: 'mexico city fine dining roma', placeIds: ['cdmx-pujol', 'cdmx-limantour', 'cdmx-contramar', 'cdmx-elmoro', 'cdmx-roma'] },

  // New York
  { id: 'nyc-first', citySlug: 'new-york-city', title: 'New York greatest hits', theme: 'Greatest hits', tagline: 'The Met, the High Line, the bridge, the park — and a perfect slice.', durationDays: 4, pace: 'packed', heroQuery: 'new york manhattan skyline bridge', placeIds: ['nyc-met', 'nyc-highline', 'nyc-brooklynbridge', 'nyc-centralpark', 'nyc-katz', 'nyc-joes'] },
  { id: 'nyc-food', citySlug: 'new-york-city', title: 'New York, eaten well', theme: 'Food first', tagline: 'Pastrami, appetizing, pizza, pasta, a food hall, and a phone-booth bar.', durationDays: 3, pace: 'moderate', heroQuery: 'new york deli pizza food', placeIds: ['nyc-katz', 'nyc-russ', 'nyc-joes', 'nyc-chelseamkt', 'nyc-lilia', 'nyc-pdt'] },
  { id: 'nyc-weekend', citySlug: 'new-york-city', title: 'A New York long weekend', theme: 'Long weekend', tagline: 'Art, a market, the High Line, and a Brooklyn night out in three days.', durationDays: 3, pace: 'moderate', heroQuery: 'new york brooklyn williamsburg', placeIds: ['nyc-highline', 'nyc-chelseamkt', 'nyc-moma', 'nyc-smorgasburg', 'nyc-brooklynbridge', 'nyc-pdt'] },
]

export const bundlesForCity = (citySlug: string) => bundles.filter((b) => b.citySlug === citySlug)
export const bundleById = (id: string) => bundles.find((b) => b.id === id)
export const bundleHref = (b: Bundle, go = false) =>
  `/build/${b.citySlug}?add=${b.placeIds.join(',')}${go ? '&go=1' : ''}`
