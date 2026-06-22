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

  // Rome
  { id: 'rome-first', citySlug: 'rome', title: 'Rome for first-timers', theme: 'Greatest hits', tagline: 'The Colosseum, the Forum, the Pantheon, and the Vatican, paced to survive.', durationDays: 4, pace: 'moderate', heroQuery: 'rome colosseum ancient ruins', placeIds: ['rome-colosseum', 'rome-forum', 'rome-pantheon', 'rome-vatican', 'rome-trevi', 'rome-armando'] },
  { id: 'rome-food', citySlug: 'rome', title: 'Rome, eaten well', theme: 'Food first', tagline: 'Carbonara, a trattoria, a market, gelato, and a rooftop aperitivo.', durationDays: 3, pace: 'moderate', heroQuery: 'rome pasta carbonara trattoria', placeIds: ['rome-campo', 'rome-armando', 'rome-roscioli', 'rome-giolitti', 'rome-terrazza', 'rome-trastevere'] },
  { id: 'rome-art', citySlug: 'rome', title: 'Rome, art & ruins', theme: 'Art & history', tagline: 'Bernini, the Vatican, ancient stones, and Trastevere by night.', durationDays: 3, pace: 'moderate', heroQuery: 'rome bernini sculpture vatican', placeIds: ['rome-vatican', 'rome-borghese', 'rome-pantheon', 'rome-forum', 'rome-trastevere'] },

  // Kyoto
  { id: 'kyoto-first', citySlug: 'kyoto', title: 'Kyoto for first-timers', theme: 'Greatest hits', tagline: 'The torii gates, the bamboo, the gold pavilion, and Gion at dusk.', durationDays: 4, pace: 'moderate', heroQuery: 'kyoto fushimi inari torii gates', placeIds: ['kyo-fushimi', 'kyo-arashiyama', 'kyo-kinkakuji', 'kyo-kiyomizu', 'kyo-gion', 'kyo-nishiki'] },
  { id: 'kyoto-slow', citySlug: 'kyoto', title: 'Kyoto, slow', theme: 'Slow weekend', tagline: 'Zen gardens, the Philosopher’s Path, coffee, and a riverside dinner.', durationDays: 3, pace: 'slow', heroQuery: 'kyoto temple garden moss', placeIds: ['kyo-nanzenji', 'kyo-weekenders', 'kyo-nijo', 'kyo-omen', 'kyo-pontocho'] },
  { id: 'kyoto-food', citySlug: 'kyoto', title: 'Kyoto, eaten well', theme: 'Food first', tagline: 'Market snacks, handmade udon, the sake quarter, and a Pontocho night.', durationDays: 3, pace: 'moderate', heroQuery: 'kyoto nishiki market food', placeIds: ['kyo-nishiki', 'kyo-omen', 'kyo-weekenders', 'kyo-sake', 'kyo-pontocho'] },

  // London
  { id: 'london-first', citySlug: 'london', title: 'London for first-timers', theme: 'Greatest hits', tagline: 'The big free museums, St Paul’s, Westminster, and a curry-house classic.', durationDays: 4, pace: 'moderate', heroQuery: 'london westminster big ben thames', placeIds: ['lon-britishmuseum', 'lon-westminster', 'lon-stpauls', 'lon-tate', 'lon-dishoom', 'lon-hyde'] },
  { id: 'london-food', citySlug: 'london', title: 'London, eaten well', theme: 'Food first', tagline: 'A market lunch, nose-to-tail dinner, good coffee, and a great martini.', durationDays: 3, pace: 'moderate', heroQuery: 'london borough market food', placeIds: ['lon-borough', 'lon-monmouth', 'lon-dishoom', 'lon-stjohn', 'lon-coal', 'lon-columbia'] },
  { id: 'london-weekend', citySlug: 'london', title: 'A London long weekend', theme: 'Long weekend', tagline: 'Modern art on the river, the South Bank, markets, and the canal-side new build.', durationDays: 3, pace: 'moderate', heroQuery: 'london south bank river skyline', placeIds: ['lon-tate', 'lon-westminster', 'lon-borough', 'lon-coalstores', 'lon-columbia', 'lon-coal'] },

  // Amsterdam
  { id: 'amsterdam-first', citySlug: 'amsterdam', title: 'Amsterdam for first-timers', theme: 'Greatest hits', tagline: 'The big two museums, Anne Frank, the canals, and a boat at dusk.', durationDays: 3, pace: 'moderate', heroQuery: 'amsterdam canal houses bicycle', placeIds: ['ams-rijks', 'ams-vangogh', 'ams-anne', 'ams-jordaan', 'ams-canalcruise', 'ams-winkel'] },
  { id: 'amsterdam-art', citySlug: 'amsterdam', title: 'Amsterdam, art & canals', theme: 'Art & city', tagline: 'Rembrandt, Van Gogh, photography, and the prettiest canal walk.', durationDays: 3, pace: 'slow', heroQuery: 'amsterdam rijksmuseum night watch', placeIds: ['ams-rijks', 'ams-vangogh', 'ams-foam', 'ams-jordaan', 'ams-vondelpark'] },
  { id: 'amsterdam-local', citySlug: 'amsterdam', title: 'Amsterdam off the postcard', theme: 'Local side', tagline: 'A food hall, the park, Noord’s shipyard, apple pie, and a brown café.', durationDays: 3, pace: 'moderate', heroQuery: 'amsterdam noord ndsm street art', placeIds: ['ams-noord', 'ams-debijenkorf', 'ams-vondelpark', 'ams-winkel', 'ams-cafechris', 'ams-debakkerswinkel'] },

  // Istanbul
  { id: 'istanbul-first', citySlug: 'istanbul', title: 'Istanbul for first-timers', theme: 'Greatest hits', tagline: 'Hagia Sophia, the Blue Mosque, Topkapi, the bazaar, and a Bosphorus ferry.', durationDays: 4, pace: 'moderate', heroQuery: 'istanbul hagia sophia bosphorus', placeIds: ['ist-hagiasophia', 'ist-bluemosque', 'ist-topkapi', 'ist-grandbazaar', 'ist-bosphorus', 'ist-basilica'] },
  { id: 'istanbul-food', citySlug: 'istanbul', title: 'Istanbul, eaten well', theme: 'Food first', tagline: 'The spice market, Anatolian home cooking, a meyhane night, and good coffee.', durationDays: 3, pace: 'moderate', heroQuery: 'istanbul meze meyhane spread', placeIds: ['ist-spicebazaar', 'ist-ciya', 'ist-karakoylokantasi', 'ist-karabatak', 'ist-bosphorus'] },
  { id: 'istanbul-twosides', citySlug: 'istanbul', title: 'Istanbul, two sides', theme: 'Old & new', tagline: 'The historic peninsula, the ferry across, modern Beyoğlu, and a rooftop view.', durationDays: 3, pace: 'moderate', heroQuery: 'istanbul galata tower beyoglu', placeIds: ['ist-hagiasophia', 'ist-grandbazaar', 'ist-bosphorus', 'ist-istiklal', 'ist-mikla', 'ist-ciya'] },

  // Bangkok
  { id: 'bangkok-first', citySlug: 'bangkok', title: 'Bangkok for first-timers', theme: 'Greatest hits', tagline: 'The palace, the temples, a weekend market, and a rooftop sunset.', durationDays: 3, pace: 'moderate', heroQuery: 'bangkok grand palace temple gold', placeIds: ['bkk-grandpalace', 'bkk-watpho', 'bkk-watarun', 'bkk-chatuchak', 'bkk-rooftop', 'bkk-thipsamai'] },
  { id: 'bangkok-food', citySlug: 'bangkok', title: 'Bangkok, eaten well', theme: 'Food first', tagline: 'Star-stall crab omelette, the pad thai classic, Chinatown, and a night market.', durationDays: 3, pace: 'packed', heroQuery: 'bangkok street food chinatown night', placeIds: ['bkk-thipsamai', 'bkk-jayfai', 'bkk-yaowarat', 'bkk-jodd', 'bkk-err', 'bkk-rooftop'] },
  { id: 'bangkok-slow', citySlug: 'bangkok', title: 'Bangkok, a calmer take', theme: 'Slower side', tagline: 'A teak-house oasis, the green river loop, a quiet temple, and a riverside view.', durationDays: 3, pace: 'slow', heroQuery: 'bangkok jim thompson house garden', placeIds: ['bkk-jimthompson', 'bkk-bangkrachao', 'bkk-watpho', 'bkk-watarun', 'bkk-err'] },

  // Seoul
  { id: 'seoul-first', citySlug: 'seoul', title: 'Seoul for first-timers', theme: 'Greatest hits', tagline: 'The palaces, the hanok village, the market, and the tower at night.', durationDays: 4, pace: 'moderate', heroQuery: 'seoul gyeongbokgung palace guard', placeIds: ['seo-gyeongbok', 'seo-bukchon', 'seo-changdeok', 'seo-gwangjang', 'seo-namsan', 'seo-tosokchon'] },
  { id: 'seoul-food', citySlug: 'seoul', title: 'Seoul, eaten well', theme: 'Food first', tagline: 'Market street food, ginseng soup, a BBQ dinner, coffee, and a late night.', durationDays: 3, pace: 'moderate', heroQuery: 'seoul korean bbq grill table', placeIds: ['seo-gwangjang', 'seo-tosokchon', 'seo-bbq', 'seo-anthracite', 'seo-hongdae', 'seo-ikseon'] },
  { id: 'seoul-modern', citySlug: 'seoul', title: 'Seoul, old meets new', theme: 'Old & new', tagline: 'A palace, a hanok-cafe lane, a Hadid landmark, a stream walk, and the tower.', durationDays: 3, pace: 'moderate', heroQuery: 'seoul ddp dongdaemun design plaza', placeIds: ['seo-gyeongbok', 'seo-ikseon', 'seo-dongdaemun', 'seo-cheonggye', 'seo-namsan', 'seo-anthracite'] },

  // Copenhagen
  { id: 'copenhagen-first', citySlug: 'copenhagen', title: 'Copenhagen for first-timers', theme: 'Greatest hits', tagline: 'Nyhavn, a canal boat, the food market, Tivoli, and a royal garden.', durationDays: 3, pace: 'moderate', heroQuery: 'copenhagen nyhavn colorful harbor', placeIds: ['cph-nyhavn', 'cph-nyhavnbridge', 'cph-torvehallerne', 'cph-rosenborg', 'cph-tivoli', 'cph-coffeecollective'] },
  { id: 'copenhagen-food', citySlug: 'copenhagen', title: 'Copenhagen, eaten well', theme: 'Food first', tagline: 'Smørrebrød, harbor street food, a serious roaster, and a great burger.', durationDays: 3, pace: 'moderate', heroQuery: 'copenhagen smorrebrod food market', placeIds: ['cph-torvehallerne', 'cph-reffen', 'cph-coffeecollective', 'cph-jagger', 'cph-noma', 'cph-nyhavn'] },
  { id: 'copenhagen-design', citySlug: 'copenhagen', title: 'Copenhagen, design & water', theme: 'Design & outdoors', tagline: 'A coastal art museum, Christiania, the harbor by kayak, and a canal loop.', durationDays: 3, pace: 'slow', heroQuery: 'copenhagen louisiana museum sculpture', placeIds: ['cph-louisiana', 'cph-christiania', 'cph-kayak', 'cph-nyhavnbridge', 'cph-rosenborg'] },
]

export const bundlesForCity = (citySlug: string) => bundles.filter((b) => b.citySlug === citySlug)
export const bundleById = (id: string) => bundles.find((b) => b.id === id)

// Open a curated trip in the wizard, pre-filled. `step` controls where you land:
// 'review' (default) to adjust dates and book straight away, 'do' to tweak the picks first.
export const bundleHref = (b: Bundle, step: 'review' | 'do' = 'review') =>
  `/build/${b.citySlug}?add=${b.placeIds.join(',')}&days=${b.durationDays}&pace=${b.pace}&step=${step}`
