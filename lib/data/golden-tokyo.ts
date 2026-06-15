// Golden benchmark itinerary (content pack §2). Embedded as the showcase sample and few-shot reference.
import type { Itinerary } from '@/lib/types/itinerary'

export const goldenTokyo: Itinerary = {
  "schemaVersion": 1,
  "destination": {
    "primaryCity": "Tokyo",
    "country": "Japan",
    "countryCode": "JP",
    "lat": 35.6762,
    "lng": 139.6503,
    "regionsVisited": [
      "Shibuya",
      "Asakusa",
      "Tsukiji",
      "Yanaka",
      "Daikanyama"
    ]
  },
  "dates": {
    "start": "2026-03-14",
    "end": "2026-03-18",
    "flexible": false,
    "durationDays": 4,
    "season": "Late winter — possible early cherry blossoms"
  },
  "travelers": {
    "adults": 2,
    "children": [],
    "relationship": "couple"
  },
  "preferences": {
    "vibeTags": [
      "foodie",
      "art",
      "moderate-pace"
    ],
    "budgetTotalUsd": 3000,
    "budgetTier": "comfortable",
    "pace": "moderate",
    "dietary": [],
    "accessibility": [],
    "interestsFreeform": "Love jazz bars and small galleries. Not interested in temples-as-checkbox; one or two good ones is plenty."
  },
  "summary": "A four-day Tokyo trip built around standout food, small art spaces, and unhurried neighborhood walks. Mornings move slowly with coffee and small bites; evenings linger in jazz bars and izakayas. Shibuya as the base for proximity and late-night ease.",
  "preTrip": {
    "visaNotes": "US passport holders: visa-free for stays up to 90 days.",
    "passportCheck": "Should be valid for the duration of your stay. No 6-month rule for Japan.",
    "vaccinations": [],
    "currencyNotes": "ATMs at 7-Eleven and Japan Post work with foreign cards. Carry some cash — many small spots still don't take cards. Apple Pay (Suica) is widely accepted.",
    "packingTips": [
      "Layers — March can swing from 8°C to 18°C in a single day",
      "Comfortable walking shoes (you'll do 15-20k steps per day)",
      "Pocket umbrella",
      "Plug adapter (Type A — same as US so no adapter needed for Americans)"
    ],
    "appsToInstall": [
      {
        "name": "Google Maps",
        "why": "Transit is comprehensive and reliable here, even in Japanese"
      },
      {
        "name": "GO Taxi",
        "why": "Cheaper than Uber for taxis in Tokyo"
      },
      {
        "name": "Tabelog",
        "why": "The Japanese restaurant rating site; 3.5+ is excellent, 4.0+ is rare and special"
      }
    ]
  },
  "flights": [
    {
      "optionLabel": "Best direct option",
      "outbound": {
        "from": "SFO",
        "to": "HND",
        "depart": "2026-03-14T11:00",
        "arrive": "2026-03-15T15:30",
        "carrier": "United / ANA",
        "durationHours": 11.5,
        "stops": 0,
        "cabinClass": "economy"
      },
      "return": {
        "from": "HND",
        "to": "SFO",
        "depart": "2026-03-18T17:00",
        "arrive": "2026-03-18T11:00",
        "carrier": "United / ANA",
        "durationHours": 10,
        "stops": 0,
        "cabinClass": "economy"
      },
      "estimatedPriceUsd": 1450,
      "rationale": "HND (Haneda) is much closer to central Tokyo than NRT (Narita) — 30 min to Shibuya vs 80 min. Worth a small premium.",
      "affiliateLinks": []
    }
  ],
  "stays": [
    {
      "nightRange": "Mar 14-18 (4 nights)",
      "neighborhood": "Shibuya",
      "rationale": "Central, walkable to bars and food, late-night safe, easy transit to everywhere else. Better for a 4-day trip than splitting neighborhoods.",
      "options": [
        {
          "name": "Trunk(Hotel) Cat Street",
          "tier": "boutique",
          "estimatedPriceUsdPerNight": 320,
          "rating": 4.5,
          "amenities": [
            "design-forward",
            "small restaurant",
            "central"
          ],
          "location": {
            "name": "Trunk(Hotel) Cat Street",
            "neighborhood": "Shibuya / Jingumae"
          },
          "rationale": "Small, design-led, in the quieter part of Shibuya near Omotesando. Lobby bar is a destination.",
          "affiliateLinks": []
        },
        {
          "name": "Hotel Indigo Tokyo Shibuya",
          "tier": "comfortable",
          "estimatedPriceUsdPerNight": 280,
          "rating": 4.4,
          "amenities": [
            "modern",
            "rooftop bar",
            "central"
          ],
          "location": {
            "name": "Hotel Indigo Tokyo Shibuya"
          },
          "rationale": "Reliable, modern, central. Good fall-back if Trunk is sold out.",
          "affiliateLinks": []
        },
        {
          "name": "Mustard Hotel Shibuya",
          "tier": "mid",
          "estimatedPriceUsdPerNight": 180,
          "rating": 4.2,
          "amenities": [
            "modern",
            "small rooms",
            "central"
          ],
          "location": {
            "name": "Mustard Hotel Shibuya"
          },
          "rationale": "Honest mid-range option, very central. Rooms are small (this is Tokyo) but well-designed.",
          "affiliateLinks": []
        }
      ]
    }
  ],
  "days": [
    {
      "dayNumber": 1,
      "date": "2026-03-15",
      "title": "Arrival + ease into Shibuya",
      "narrative": "Land at Haneda mid-afternoon, take the Keikyu line + JR Yamanote to Shibuya (35 min). Drop bags, shower, then a low-key first evening. Don't push — your body thinks it's 2 AM.",
      "activities": [
        {
          "time": "17:00",
          "durationMinutes": 60,
          "title": "Walk Nonbei Yokocho",
          "type": "explore",
          "description": "Tiny alley of postage-stamp bars under the train tracks. Each bar seats 6-8 people. Not for dinner — for the photograph and to feel the city. Walk through, peek into a couple, save for tomorrow.",
          "location": {
            "name": "Nonbei Yokocho",
            "address": "1-25 Shibuya, Shibuya City",
            "neighborhood": "Shibuya"
          },
          "costEstimateUsd": 0,
          "whyThis": "Sets the tone — Tokyo is built at human scale once you leave the train station hubs.",
          "bookingRequired": false,
          "affiliateLinks": []
        },
        {
          "time": "19:00",
          "durationMinutes": 120,
          "title": "Dinner: Uoshin Nogizaka",
          "type": "restaurant",
          "description": "Casual izakaya famous for live seafood and creative sake pairings. Get the bonito tataki (seared tableside) and ask the chef for whatever's best that day. Order the smaller pours of three different sakes rather than committing to one bottle.",
          "location": {
            "name": "Uoshin Nogizaka",
            "address": "Minato City, Roppongi 7-14-1",
            "neighborhood": "Roppongi"
          },
          "costEstimateUsd": 70,
          "tips": [
            "Reservations help but walk-in at 7 PM usually works for two",
            "Cash preferred"
          ],
          "whyThis": "Better and more interesting than any 'famous' Shibuya izakaya you'd find on a list.",
          "bookingRequired": true,
          "affiliateLinks": []
        },
        {
          "time": "21:30",
          "durationMinutes": 60,
          "title": "Nightcap at Bar High Five",
          "type": "bar",
          "description": "One of Tokyo's classic cocktail bars. No menu — the bartender asks what you feel like and builds it. Quiet, jacket-helpful, takes its time. Skip if you're crashing from jet lag.",
          "location": {
            "name": "Bar High Five",
            "address": "Polestar Building 4F, Ginza",
            "neighborhood": "Ginza"
          },
          "costEstimateUsd": 50,
          "tips": [
            "Reservations recommended",
            "One drink minimum per person"
          ],
          "bookingRequired": true,
          "affiliateLinks": [],
          "alternatives": [
            {
              "title": "Bar Trench (Ebisu)",
              "note": "Closer to Shibuya, more casual, similarly excellent"
            }
          ]
        }
      ]
    },
    {
      "dayNumber": 2,
      "date": "2026-03-16",
      "title": "Tsukiji, Daikanyama, Shibuya at dusk",
      "narrative": "Early breakfast at the old Tsukiji outer market, slow afternoon in Daikanyama (Tokyo's most refined neighborhood), back to Shibuya for golden-hour crossing and dinner. Around 18,000 steps.",
      "activities": [
        {
          "time": "08:00",
          "durationMinutes": 120,
          "title": "Breakfast crawl at Tsukiji Outer Market",
          "type": "restaurant",
          "description": "The inner wholesale market moved to Toyosu in 2018, but the outer market is still going. Wander the stalls, eat standing up. Standouts: tuna sashimi at Maguroya Kurogin, tamagoyaki on a stick from Yamacho, fresh oysters at Tsukiji Kitsuneya. Skip the long-line restaurants — the standing snacks are better.",
          "location": {
            "name": "Tsukiji Outer Market",
            "address": "Tsukiji 4-chome, Chuo City",
            "neighborhood": "Tsukiji"
          },
          "costEstimateUsd": 35,
          "tips": [
            "Arrive by 8 AM — many stalls close by 11",
            "Cash only at most stands",
            "Don't try to eat everything; pace yourself"
          ],
          "whyThis": "First-time visitors check 'fish market' off a list. This one is genuinely good if you arrive early.",
          "bookingRequired": false,
          "affiliateLinks": []
        },
        {
          "time": "11:00",
          "durationMinutes": 90,
          "title": "Walk: Daikanyama T-Site + Tsutaya bookstore",
          "type": "shopping",
          "description": "Tokyo's most beautiful bookstore. Three buildings connected by paths, design and architecture sections in English. Stop at the upstairs lounge for coffee. Even non-readers find it remarkable.",
          "location": {
            "name": "Daikanyama T-Site",
            "address": "17-5 Sarugakucho, Shibuya City",
            "neighborhood": "Daikanyama"
          },
          "costEstimateUsd": 8,
          "bookingRequired": false,
          "affiliateLinks": []
        },
        {
          "time": "13:00",
          "durationMinutes": 90,
          "title": "Lunch: Kawaii Monster Café or skip and walk to Naka-Meguro",
          "type": "restaurant",
          "description": "Walk 15 min down to Naka-Meguro along the river. In late March the cherry trees along the canal sometimes bloom. Lunch at Onibus Coffee for a flat white and pastries from Bricolage Bread & Co. nearby. Skip the touristy themed cafés.",
          "location": {
            "name": "Naka-Meguro canal",
            "neighborhood": "Naka-Meguro"
          },
          "costEstimateUsd": 18,
          "bookingRequired": false,
          "affiliateLinks": []
        },
        {
          "time": "15:30",
          "durationMinutes": 60,
          "title": "Art: Watari-Um Museum of Contemporary Art",
          "type": "gallery",
          "description": "Small private contemporary art museum. Programs change every few months; check what's on. Spend 45 minutes. Bookshop downstairs is excellent.",
          "location": {
            "name": "Watari-Um",
            "address": "3-7-6 Jingumae, Shibuya City",
            "neighborhood": "Aoyama"
          },
          "costEstimateUsd": 12,
          "bookingRequired": false,
          "affiliateLinks": []
        },
        {
          "time": "17:30",
          "durationMinutes": 30,
          "title": "Shibuya Crossing at golden hour",
          "type": "sightseeing",
          "description": "Go to Shibuya Sky for sunset (book ahead) or just walk through the crossing two or three times. Yes, it's the tourist thing. It's still worth it as the lights start to come on.",
          "location": {
            "name": "Shibuya Crossing",
            "neighborhood": "Shibuya"
          },
          "costEstimateUsd": 0,
          "tips": [
            "Shibuya Sky tickets sell out 1-2 weeks ahead during cherry blossom season"
          ],
          "bookingRequired": false,
          "affiliateLinks": []
        },
        {
          "time": "19:30",
          "durationMinutes": 150,
          "title": "Dinner: Sushi Tokami (Ginza)",
          "type": "restaurant",
          "description": "Michelin-starred edomae sushi without the impossible reservation gauntlet of Sukiyabashi Jiro. Counter seating, ~20 pieces of nigiri, the rice is the point. Around $120-150 per person for the dinner omakase. Worth the splurge if sushi is the trip.",
          "location": {
            "name": "Sushi Tokami",
            "address": "8-2-10 Ginza, Chuo City",
            "neighborhood": "Ginza"
          },
          "costEstimateUsd": 140,
          "tips": [
            "Reserve 1-2 months ahead",
            "Cash or card both fine"
          ],
          "bookingRequired": true,
          "affiliateLinks": [],
          "alternatives": [
            {
              "title": "Sushi Saito",
              "note": "Three Michelin stars, near-impossible to book — only if you have a hotel concierge who can pull strings"
            },
            {
              "title": "Sushi Kanesaka",
              "note": "Two stars, more accessible than Saito, around same price as Tokami"
            },
            {
              "title": "Kura Sushi or Sushiro (conveyor belt)",
              "note": "If you want fun and cheap instead — kids love it, $30 for two people"
            }
          ]
        }
      ]
    },
    {
      "dayNumber": 3,
      "date": "2026-03-17",
      "title": "Asakusa, Yanaka, jazz at night",
      "narrative": "Old Tokyo today. Asakusa for one major temple (Senso-ji), then Yanaka which feels 50 years older. Back to Shibuya for jazz at night.",
      "activities": [
        {
          "time": "08:00",
          "durationMinutes": 90,
          "title": "Senso-ji Temple — early",
          "type": "sightseeing",
          "description": "Arrive before 9 AM. By 10 it's tour buses. The temple itself is one stop on the day, not the whole day. Walk through Nakamise shopping street on the way out (touristy but charming early).",
          "location": {
            "name": "Senso-ji Temple",
            "address": "2-3-1 Asakusa, Taito City",
            "neighborhood": "Asakusa"
          },
          "costEstimateUsd": 0,
          "bookingRequired": false,
          "affiliateLinks": []
        },
        {
          "time": "10:00",
          "durationMinutes": 30,
          "title": "Coffee at Onibus Coffee Asakusa or Pelican Café",
          "type": "cafe",
          "description": "Reset before transit to Yanaka. Pelican Café (just bread + coffee, 50 years old) is a quiet local spot.",
          "location": {
            "name": "Pelican Café",
            "neighborhood": "Asakusa"
          },
          "costEstimateUsd": 6,
          "bookingRequired": false,
          "affiliateLinks": []
        },
        {
          "time": "11:00",
          "durationMinutes": 180,
          "title": "Yanaka neighborhood walk",
          "type": "explore",
          "description": "Yanaka survived WWII bombing largely intact. Wood houses, cats, small shops. Walk Yanaka Ginza shopping street (350m, lined with food stalls). Stop at SCAI The Bathhouse, a contemporary gallery inside a 200-year-old converted bathhouse. End at Yanaka Cemetery — strangely beautiful, where Tokyo's elite are buried.",
          "location": {
            "name": "Yanaka Ginza",
            "neighborhood": "Yanaka"
          },
          "costEstimateUsd": 25,
          "tips": [
            "Yanaka is most alive on weekdays mid-day",
            "Eat your way down Yanaka Ginza — menchi katsu, dango, croquettes"
          ],
          "bookingRequired": false,
          "affiliateLinks": []
        },
        {
          "time": "15:00",
          "durationMinutes": 90,
          "title": "Rest at hotel",
          "type": "rest",
          "description": "Genuinely. Tokyo days are long. Shower, change, low energy before the evening.",
          "costEstimateUsd": 0,
          "bookingRequired": false,
          "affiliateLinks": []
        },
        {
          "time": "18:00",
          "durationMinutes": 90,
          "title": "Dinner: Yakitori at Toritake or Bird Land",
          "type": "restaurant",
          "description": "Yakitori is what casual upscale Tokyo dinner looks like — small bites of grilled chicken parts, sake pairings. Bird Land in Ginza is the Michelin-starred version; Toritake is the no-frills classic. Pick by mood. Both seat ~10 people at the counter.",
          "location": {
            "name": "Bird Land Ginza",
            "address": "B1, 4-2-15 Ginza",
            "neighborhood": "Ginza"
          },
          "costEstimateUsd": 90,
          "tips": [
            "Bird Land needs reservation 2-3 weeks ahead",
            "Toritake is walk-in"
          ],
          "bookingRequired": true,
          "affiliateLinks": []
        },
        {
          "time": "21:00",
          "durationMinutes": 120,
          "title": "Jazz at JZ Brat or Cotton Club",
          "type": "show",
          "description": "Tokyo has one of the world's great jazz scenes — small, careful, listening clubs. JZ Brat in Shibuya is intimate; Cotton Club (Marunouchi) hosts international acts. Cover varies $20-60 depending on the act. Look up tonight's show ahead.",
          "location": {
            "name": "JZ Brat",
            "address": "Cerulean Tower 1F, Shibuya",
            "neighborhood": "Shibuya"
          },
          "costEstimateUsd": 50,
          "tips": [
            "Reservations strongly recommended",
            "Doors usually 7 PM for 8 PM set"
          ],
          "bookingRequired": true,
          "affiliateLinks": []
        }
      ]
    },
    {
      "dayNumber": 4,
      "date": "2026-03-18",
      "title": "Final day — Omotesando, ramen, fly out",
      "narrative": "Shorter day with afternoon departure. Omotesando in the morning, one last great meal, then airport.",
      "activities": [
        {
          "time": "09:00",
          "durationMinutes": 120,
          "title": "Omotesando architecture walk",
          "type": "explore",
          "description": "Walk the length of Omotesando Avenue. Notable buildings: Tod's (Toyo Ito), Prada Aoyama (Herzog & de Meuron), Dior (SANAA), Sunny Hills (Kengo Kuma). Stop into the Nezu Museum at the south end — beautiful garden, even better than the art.",
          "location": {
            "name": "Omotesando",
            "neighborhood": "Aoyama"
          },
          "costEstimateUsd": 12,
          "bookingRequired": false,
          "affiliateLinks": []
        },
        {
          "time": "11:30",
          "durationMinutes": 75,
          "title": "Final lunch: Afuri Ramen or Tsuta",
          "type": "restaurant",
          "description": "End on a clean note. Afuri does yuzu-shio ramen — light, citrusy, the opposite of heavy tonkotsu. Tsuta is the one-Michelin-star ramen joint (truffle-soy broth, smaller, longer lines). Both around $15.",
          "location": {
            "name": "Afuri Harajuku",
            "neighborhood": "Harajuku"
          },
          "costEstimateUsd": 15,
          "bookingRequired": false,
          "affiliateLinks": [],
          "alternatives": [
            {
              "title": "Ichiran",
              "note": "If you want the famous solo-booth tonkotsu experience — fine but overrated"
            }
          ]
        },
        {
          "time": "13:30",
          "durationMinutes": 60,
          "title": "Pack and check out",
          "type": "transport",
          "description": "Allow 60 min for the trip to HND.",
          "costEstimateUsd": 0,
          "bookingRequired": false,
          "affiliateLinks": []
        }
      ]
    }
  ],
  "restaurantsAppendix": [
    {
      "name": "Den (Jingumae)",
      "cuisine": "Innovative kaiseki",
      "neighborhood": "Jingumae",
      "priceRange": "$$$$",
      "whatToOrder": "The full tasting menu — Chef Hasegawa is genuinely playful",
      "notes": "Two Michelin stars. Book 2-3 months ahead.",
      "bookingDifficulty": "difficult",
      "affiliateLinks": []
    },
    {
      "name": "Tonki (Meguro)",
      "cuisine": "Tonkatsu",
      "neighborhood": "Meguro",
      "priceRange": "$$",
      "whatToOrder": "Hire-katsu (filet)",
      "notes": "70-year-old institution; counter seating, watch the slicing. Worth the trek.",
      "bookingDifficulty": "walk-in",
      "affiliateLinks": []
    },
    {
      "name": "Soba Yamaichi (Yanaka)",
      "cuisine": "Soba",
      "neighborhood": "Yanaka",
      "priceRange": "$$",
      "whatToOrder": "Cold zaru soba",
      "notes": "Tiny shop, hand-made soba, perfect on a warm day.",
      "bookingDifficulty": "walk-in",
      "affiliateLinks": []
    }
  ],
  "gettingAround": {
    "fromAirport": "From HND: Keikyu line direct to Shinagawa (15 min), transfer to JR Yamanote to Shibuya (20 min). Total ~$8 and 40 minutes. Taxi is ~$50 and roughly the same time depending on traffic.",
    "transitPass": "Get a Suica IC card at the airport (or Apple Pay-enabled iPhone). Tap in, tap out. Load 5000 yen for a 4-day trip.",
    "rideshare": "GO Taxi app is cheaper than Uber in Tokyo. Both work in English.",
    "walkability": "Tokyo neighborhoods are very walkable; transit between neighborhoods is fast and reliable. You'll walk 15-25k steps per day.",
    "intercityTransport": []
  },
  "practical": {
    "emergencyNumber": "110 (police), 119 (fire / medical)",
    "plugType": "A / B (same as US — no adapter needed for American travelers)",
    "voltage": "100V",
    "tipping": "Not customary. Don't leave money on the table — it's awkward.",
    "taxRefund": "Tax-free shopping available at many stores with passport; ask before buying for items over 5000 yen.",
    "commonPhrases": [
      {
        "phrase": "Sumimasen",
        "pronunciation": "soo-mee-mah-sen",
        "meaning": "Excuse me / sorry / thank you (multipurpose)"
      },
      {
        "phrase": "Arigatou gozaimasu",
        "pronunciation": "ah-ree-gah-toh go-zai-mas",
        "meaning": "Thank you (formal)"
      },
      {
        "phrase": "Eigo dekimasu ka",
        "pronunciation": "ay-go deh-kee-mas ka",
        "meaning": "Do you speak English?"
      }
    ],
    "safety": "Extremely safe by global standards. Lost wallets are returned with cash intact. Standard urban awareness still applies."
  },
  "metadata": {
    "generatedAt": "2026-06-14T12:00:00Z",
    "model": "claude-opus-4-7",
    "promptVersion": "2026.06.14"
  }
} as unknown as Itinerary
