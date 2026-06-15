// 30 hand-curated destinations (content pack §1). Source of truth for /guide pages and the orchestrator's get_destination_overview tool.
export interface Neighborhood { name: string; vibe: string; bestFor: string[] }
export interface Practical { currency: string; language: string; plugType: string; voltage: string; emergencyNumber: string; tipping: string }
export interface BestTime { months: string[]; notes: string; avoid?: string }
export interface Destination { slug: string; city: string; country: string; countryCode: string; lat: number; lng: number; heroImageQuery: string; overviewMarkdown: string; bestTimeToVisit: BestTime; topNeighborhoods: Neighborhood[]; practical: Practical }

export const destinations: Destination[] = [
  {
    "slug": "tokyo",
    "city": "Tokyo",
    "country": "Japan",
    "countryCode": "JP",
    "lat": 35.6762,
    "lng": 139.6503,
    "heroImageQuery": "tokyo neon shibuya night",
    "overviewMarkdown": "Tokyo is less a single city than a constellation of districts, each with its own personality. The shock of arrival — the density, the order, the food everywhere — fades into rhythm by day two. Most first-time visitors over-pack their schedules; the best trips here move slowly between neighborhoods and leave room for accidental discoveries.",
    "bestTimeToVisit": {
      "months": [
        "Mar",
        "Apr",
        "May",
        "Oct",
        "Nov"
      ],
      "notes": "Late March to early April for cherry blossoms (book hotels months ahead). October and November for clear weather and autumn foliage in Kyoto if pairing.",
      "avoid": "Mid-June to mid-July rainy season; August is hot and humid."
    },
    "topNeighborhoods": [
      {
        "name": "Shibuya",
        "vibe": "central, energetic, late-night",
        "bestFor": [
          "first-timers",
          "nightlife",
          "shopping"
        ]
      },
      {
        "name": "Shinjuku",
        "vibe": "skyscrapers, izakayas, transit hub",
        "bestFor": [
          "business travelers",
          "bar hopping"
        ]
      },
      {
        "name": "Asakusa",
        "vibe": "traditional, riverside, temples",
        "bestFor": [
          "history",
          "budget"
        ]
      },
      {
        "name": "Ginza",
        "vibe": "upscale, polished, refined dining",
        "bestFor": [
          "luxury",
          "shopping"
        ]
      },
      {
        "name": "Yanaka",
        "vibe": "old Tokyo, low-rise, quiet",
        "bestFor": [
          "slow travel",
          "photography"
        ]
      },
      {
        "name": "Daikanyama / Naka-Meguro",
        "vibe": "stylish, residential, design-forward",
        "bestFor": [
          "repeat visitors",
          "coffee",
          "boutiques"
        ]
      }
    ],
    "practical": {
      "currency": "Japanese Yen (JPY)",
      "language": "Japanese",
      "plugType": "A / B",
      "voltage": "100V",
      "emergencyNumber": "110 (police), 119 (fire/medical)",
      "tipping": "Not customary and can be considered rude. Service is included."
    }
  },
  {
    "slug": "kyoto",
    "city": "Kyoto",
    "country": "Japan",
    "countryCode": "JP",
    "lat": 35.0116,
    "lng": 135.7681,
    "heroImageQuery": "kyoto bamboo grove arashiyama",
    "overviewMarkdown": "Kyoto rewards travelers who slow down. The famous sites — Fushimi Inari, Kinkaku-ji, Arashiyama bamboo — are flooded with day-trippers from 9 AM to 4 PM and serene before and after. The best Kyoto days start at 6 AM at a temple and end in a small kaiseki restaurant in a wooden house.",
    "bestTimeToVisit": {
      "months": [
        "Mar",
        "Apr",
        "Nov"
      ],
      "notes": "Cherry blossom (late March-early April) and autumn foliage (mid-late November) are peak. Both require hotel bookings 4-6 months ahead.",
      "avoid": "Mid-July to August (hot, humid, busy with summer festivals which is good or bad)"
    },
    "topNeighborhoods": [
      {
        "name": "Gion / Higashiyama",
        "vibe": "historic, geisha district, walkable",
        "bestFor": [
          "first-timers",
          "tradition"
        ]
      },
      {
        "name": "Arashiyama",
        "vibe": "bamboo grove, riverside, day-trip favorite",
        "bestFor": [
          "scenery",
          "early-morning visits"
        ]
      },
      {
        "name": "Pontocho",
        "vibe": "narrow alley, riverside dining",
        "bestFor": [
          "dinner"
        ]
      },
      {
        "name": "Nishiki Market area",
        "vibe": "downtown, shopping, casual eating",
        "bestFor": [
          "food sampling"
        ]
      }
    ],
    "practical": {
      "currency": "Japanese Yen (JPY)",
      "language": "Japanese",
      "plugType": "A / B",
      "voltage": "100V",
      "emergencyNumber": "110 / 119",
      "tipping": "Not customary"
    }
  },
  {
    "slug": "paris",
    "city": "Paris",
    "country": "France",
    "countryCode": "FR",
    "lat": 48.8566,
    "lng": 2.3522,
    "heroImageQuery": "paris haussmann buildings morning",
    "overviewMarkdown": "Paris is built around its arrondissements like rings of a tree. First-time visitors anchor in the 1st-7th; repeat visitors discover the 10th, 11th, and 20th. The city is genuinely walkable — if you're spending more than €15/day on Métro tickets, you're not seeing it properly.",
    "bestTimeToVisit": {
      "months": [
        "Apr",
        "May",
        "Jun",
        "Sep",
        "Oct"
      ],
      "notes": "Late spring and early fall have the best weather and lighter crowds. Many Parisians leave in August, so some restaurants close.",
      "avoid": "Mid-July and August can be hot and many local spots are shut. December has charm but short, gray days."
    },
    "topNeighborhoods": [
      {
        "name": "Le Marais (3rd / 4th)",
        "vibe": "medieval streets, boutiques, gay quarter, food",
        "bestFor": [
          "first-timers",
          "shopping",
          "food"
        ]
      },
      {
        "name": "Saint-Germain-des-Prés (6th)",
        "vibe": "literary, classic Paris, bookstores, cafés",
        "bestFor": [
          "luxury",
          "couples"
        ]
      },
      {
        "name": "Canal Saint-Martin (10th)",
        "vibe": "local, hip, picnic-by-the-canal",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Belleville / Ménilmontant (20th)",
        "vibe": "multicultural, artists, cheap good food",
        "bestFor": [
          "nightlife",
          "budget"
        ]
      },
      {
        "name": "Montmartre (18th)",
        "vibe": "hilly, touristy at top, charming below",
        "bestFor": [
          "scenery"
        ]
      }
    ],
    "practical": {
      "currency": "Euro (EUR)",
      "language": "French",
      "plugType": "C / E",
      "voltage": "230V",
      "emergencyNumber": "112",
      "tipping": "Service compris is included. Round up or leave a couple of euros for good service."
    }
  },
  {
    "slug": "rome",
    "city": "Rome",
    "country": "Italy",
    "countryCode": "IT",
    "lat": 41.9028,
    "lng": 12.4964,
    "heroImageQuery": "rome trastevere golden hour",
    "overviewMarkdown": "Rome is a city where you trip over 2,000 years of history while looking for lunch. The historic center is dense — most first-time visitors try to do too much and burn out. Better to anchor in one neighborhood, walk everywhere within it, and accept that you can't see it all.",
    "bestTimeToVisit": {
      "months": [
        "Apr",
        "May",
        "Sep",
        "Oct"
      ],
      "notes": "Spring and fall have ideal weather. October is especially good — warm days, light crowds.",
      "avoid": "August (hot, locals gone, many restaurants closed). July is also crowded and hot."
    },
    "topNeighborhoods": [
      {
        "name": "Trastevere",
        "vibe": "cobblestone, lively, food-heavy",
        "bestFor": [
          "dinner",
          "evening walks"
        ]
      },
      {
        "name": "Centro Storico",
        "vibe": "Pantheon, Piazza Navona, dense and walkable",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Monti",
        "vibe": "boho, vintage shops, walkable to Forum",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Testaccio",
        "vibe": "local, food market, classic Roman dining",
        "bestFor": [
          "food deep-dive"
        ]
      }
    ],
    "practical": {
      "currency": "Euro (EUR)",
      "language": "Italian",
      "plugType": "C / F / L",
      "voltage": "230V",
      "emergencyNumber": "112",
      "tipping": "Coperto charge (€2-5/person) is standard at most restaurants. Tipping beyond that is optional."
    }
  },
  {
    "slug": "barcelona",
    "city": "Barcelona",
    "country": "Spain",
    "countryCode": "ES",
    "lat": 41.3851,
    "lng": 2.1734,
    "heroImageQuery": "barcelona gothic quarter narrow street",
    "overviewMarkdown": "Barcelona divides into the medieval old city (Gothic Quarter, El Born) and the orderly grid of Eixample (Gaudí country). The beach is a 15-minute walk from the center — rare among European capitals. Lunch is the big meal; dinner doesn't start until 9 PM.",
    "bestTimeToVisit": {
      "months": [
        "Apr",
        "May",
        "Jun",
        "Sep",
        "Oct"
      ],
      "notes": "Spring and fall. June is excellent — beach weather without August heat.",
      "avoid": "July and August are hot and crowded with tourists."
    },
    "topNeighborhoods": [
      {
        "name": "El Born",
        "vibe": "medieval, boutiques, tapas crawl heaven",
        "bestFor": [
          "food",
          "shopping"
        ]
      },
      {
        "name": "Gothic Quarter",
        "vibe": "old, atmospheric, central but touristy",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Eixample",
        "vibe": "Gaudí, wide boulevards, upscale",
        "bestFor": [
          "architecture lovers"
        ]
      },
      {
        "name": "Gràcia",
        "vibe": "village feel, plazas, local",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Barceloneta",
        "vibe": "beach, seafood, can feel touristy",
        "bestFor": [
          "beach days"
        ]
      }
    ],
    "practical": {
      "currency": "Euro (EUR)",
      "language": "Spanish / Catalan",
      "plugType": "C / F",
      "voltage": "230V",
      "emergencyNumber": "112",
      "tipping": "Not expected but rounding up is appreciated."
    }
  },
  {
    "slug": "lisbon",
    "city": "Lisbon",
    "country": "Portugal",
    "countryCode": "PT",
    "lat": 38.7223,
    "lng": -9.1393,
    "heroImageQuery": "lisbon yellow tram alfama hills",
    "overviewMarkdown": "Lisbon is a city of hills, tiled facades, and slow afternoons. It still feels like good value relative to other European capitals, though prices have climbed. The light is famous for good reason — golden through most of the day, and at sunset it does something to the river.",
    "bestTimeToVisit": {
      "months": [
        "Apr",
        "May",
        "Jun",
        "Sep",
        "Oct"
      ],
      "notes": "Spring and fall. June has long days and warm nights without the August crush.",
      "avoid": "Mid-July through August can be hot and crowded."
    },
    "topNeighborhoods": [
      {
        "name": "Alfama",
        "vibe": "old, hilly, fado, the postcard Lisbon",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Chiado / Bairro Alto",
        "vibe": "central, shops by day, bars by night",
        "bestFor": [
          "nightlife"
        ]
      },
      {
        "name": "Príncipe Real",
        "vibe": "stylish, garden, design boutiques",
        "bestFor": [
          "dinner",
          "shopping"
        ]
      },
      {
        "name": "LX Factory",
        "vibe": "converted industrial, weekend markets",
        "bestFor": [
          "younger travelers"
        ]
      }
    ],
    "practical": {
      "currency": "Euro (EUR)",
      "language": "Portuguese",
      "plugType": "C / F",
      "voltage": "230V",
      "emergencyNumber": "112",
      "tipping": "Round up or leave 5-10% for good service."
    }
  },
  {
    "slug": "london",
    "city": "London",
    "country": "United Kingdom",
    "countryCode": "GB",
    "lat": 51.5074,
    "lng": -0.1278,
    "heroImageQuery": "london red bus tower bridge dusk",
    "overviewMarkdown": "London rewards depth over breadth. The city is enormous; even residents discover new pockets. The Tube is the great equalizer — every neighborhood is 15-30 minutes from every other one. Pubs are still where the city's soul lives.",
    "bestTimeToVisit": {
      "months": [
        "May",
        "Jun",
        "Sep"
      ],
      "notes": "May and June are long days and mild weather. September is back-to-school crisp and underrated.",
      "avoid": "January-February are wet and gray. December can be magical but cold and short on daylight."
    },
    "topNeighborhoods": [
      {
        "name": "Shoreditch / Hackney",
        "vibe": "creative, food, nightlife",
        "bestFor": [
          "food",
          "art"
        ]
      },
      {
        "name": "Marylebone",
        "vibe": "village in the city, walkable, upscale",
        "bestFor": [
          "dinner",
          "boutiques"
        ]
      },
      {
        "name": "South Bank",
        "vibe": "river walk, theaters, museums",
        "bestFor": [
          "culture"
        ]
      },
      {
        "name": "Notting Hill",
        "vibe": "pastel houses, antique market",
        "bestFor": [
          "weekends"
        ]
      },
      {
        "name": "Borough / Bermondsey",
        "vibe": "food market, riverside, breweries",
        "bestFor": [
          "food"
        ]
      }
    ],
    "practical": {
      "currency": "Pound Sterling (GBP)",
      "language": "English",
      "plugType": "G",
      "voltage": "230V",
      "emergencyNumber": "999 or 112",
      "tipping": "10-12.5% standard at restaurants; check if service charge is included."
    }
  },
  {
    "slug": "amsterdam",
    "city": "Amsterdam",
    "country": "Netherlands",
    "countryCode": "NL",
    "lat": 52.3676,
    "lng": 4.9041,
    "heroImageQuery": "amsterdam canal bicycle bridge",
    "overviewMarkdown": "Amsterdam is compact enough to walk across in an hour, and biking is the way locals move. The canal belt is a UNESCO site for good reason. Stay away from the Red Light District at night unless that's specifically what you want — the rest of the city is far more interesting.",
    "bestTimeToVisit": {
      "months": [
        "Apr",
        "May",
        "Jun",
        "Sep"
      ],
      "notes": "Spring (especially mid-April for tulips at Keukenhof) and early summer. September has fewer crowds and decent weather.",
      "avoid": "November-February can be gray and wet."
    },
    "topNeighborhoods": [
      {
        "name": "Jordaan",
        "vibe": "canals, narrow streets, brown cafés",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "De Pijp",
        "vibe": "former working-class, now hip, market",
        "bestFor": [
          "food"
        ]
      },
      {
        "name": "Oost",
        "vibe": "residential, parks, multicultural",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Noord (across IJ)",
        "vibe": "post-industrial, cool, ferry-accessed",
        "bestFor": [
          "art",
          "younger travelers"
        ]
      }
    ],
    "practical": {
      "currency": "Euro (EUR)",
      "language": "Dutch (everyone speaks English)",
      "plugType": "C / F",
      "voltage": "230V",
      "emergencyNumber": "112",
      "tipping": "Round up or 5-10% for good service."
    }
  },
  {
    "slug": "berlin",
    "city": "Berlin",
    "country": "Germany",
    "countryCode": "DE",
    "lat": 52.52,
    "lng": 13.405,
    "heroImageQuery": "berlin brandenburg gate",
    "overviewMarkdown": "Berlin is a city that takes longer to love than most. It's not classically pretty, but the energy, the history, and the depth of culture reward time spent. The east-west divide still shapes its character. Nightlife runs to dawn and beyond.",
    "bestTimeToVisit": {
      "months": [
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep"
      ],
      "notes": "Berlin is best in summer when the parks and beer gardens come alive. May and September are also great.",
      "avoid": "Winters are gray and long."
    },
    "topNeighborhoods": [
      {
        "name": "Mitte",
        "vibe": "central, museums, Brandenburg Gate",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Kreuzberg",
        "vibe": "Turkish + alternative, food, canals",
        "bestFor": [
          "food",
          "nightlife"
        ]
      },
      {
        "name": "Neukölln",
        "vibe": "young, international, hip",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Prenzlauer Berg",
        "vibe": "gentrified, family-friendly, cafés",
        "bestFor": [
          "families"
        ]
      },
      {
        "name": "Friedrichshain",
        "vibe": "raw, clubs, East Side Gallery",
        "bestFor": [
          "clubbing"
        ]
      }
    ],
    "practical": {
      "currency": "Euro (EUR)",
      "language": "German",
      "plugType": "C / F",
      "voltage": "230V",
      "emergencyNumber": "112",
      "tipping": "Round up or 5-10%. Tell the server the total when paying, don't leave cash on table."
    }
  },
  {
    "slug": "reykjavik",
    "city": "Reykjavik",
    "country": "Iceland",
    "countryCode": "IS",
    "lat": 64.1466,
    "lng": -21.9426,
    "heroImageQuery": "reykjavik iceland aurora northern lights",
    "overviewMarkdown": "Reykjavik is more a base than a destination — the magic of Iceland is what's outside the city. Two days in town, then rent a car and go. Even in summer, pack layers; the weather changes every hour.",
    "bestTimeToVisit": {
      "months": [
        "Jun",
        "Jul",
        "Aug",
        "Sep"
      ],
      "notes": "Summer has midnight sun and accessible roads. September starts northern lights season and has lighter crowds.",
      "avoid": "December-February are dark and many roads close, though northern lights are best then. Pick your trade-off."
    },
    "topNeighborhoods": [
      {
        "name": "Downtown 101",
        "vibe": "tiny, walkable, all bars and shops",
        "bestFor": [
          "nightlife",
          "first night"
        ]
      },
      {
        "name": "Grandi",
        "vibe": "harbor, breweries, food halls",
        "bestFor": [
          "food"
        ]
      }
    ],
    "practical": {
      "currency": "Icelandic Króna (ISK) — cards everywhere",
      "language": "Icelandic (English universal)",
      "plugType": "C / F",
      "voltage": "230V",
      "emergencyNumber": "112",
      "tipping": "Not expected anywhere."
    }
  },
  {
    "slug": "prague",
    "city": "Prague",
    "country": "Czech Republic",
    "countryCode": "CZ",
    "lat": 50.0755,
    "lng": 14.4378,
    "heroImageQuery": "prague old town square towers",
    "overviewMarkdown": "Prague survived World War II largely intact, which is why the medieval core looks like a fairytale. The Old Town is touristy but worth a morning. Beer is excellent and cheap.",
    "bestTimeToVisit": {
      "months": [
        "Apr",
        "May",
        "Sep",
        "Oct"
      ],
      "notes": "Spring and fall. May has the best weather and lighter crowds than peak summer.",
      "avoid": "December markets are charming but very crowded; July-August are packed."
    },
    "topNeighborhoods": [
      {
        "name": "Old Town (Staré Město)",
        "vibe": "central, the postcard",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Lesser Town (Malá Strana)",
        "vibe": "baroque, below the castle",
        "bestFor": [
          "evening walks"
        ]
      },
      {
        "name": "Vinohrady",
        "vibe": "residential, parks, cafés",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Karlín",
        "vibe": "post-industrial, new restaurants",
        "bestFor": [
          "food"
        ]
      }
    ],
    "practical": {
      "currency": "Czech Koruna (CZK)",
      "language": "Czech",
      "plugType": "C / E",
      "voltage": "230V",
      "emergencyNumber": "112",
      "tipping": "Round up to nearest 10s or leave 10%."
    }
  },
  {
    "slug": "copenhagen",
    "city": "Copenhagen",
    "country": "Denmark",
    "countryCode": "DK",
    "lat": 55.6761,
    "lng": 12.5683,
    "heroImageQuery": "copenhagen nyhavn colorful houses harbor",
    "overviewMarkdown": "Copenhagen is design civilization. The city is flat, bike-first, and runs on hygge and excellent food. It's expensive, but the quality is uniformly high.",
    "bestTimeToVisit": {
      "months": [
        "May",
        "Jun",
        "Jul",
        "Aug"
      ],
      "notes": "Summer has long days and outdoor everything. June has the best balance of weather and crowds.",
      "avoid": "November-February: short days, often gray."
    },
    "topNeighborhoods": [
      {
        "name": "Indre By",
        "vibe": "central, walking streets, Nyhavn",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Vesterbro",
        "vibe": "former gritty, now coolest",
        "bestFor": [
          "food",
          "nightlife"
        ]
      },
      {
        "name": "Nørrebro",
        "vibe": "multicultural, food markets",
        "bestFor": [
          "budget",
          "food"
        ]
      },
      {
        "name": "Christianshavn",
        "vibe": "canals, houseboats",
        "bestFor": [
          "repeat visitors"
        ]
      }
    ],
    "practical": {
      "currency": "Danish Krone (DKK)",
      "language": "Danish (English universal)",
      "plugType": "C / E / F / K",
      "voltage": "230V",
      "emergencyNumber": "112",
      "tipping": "Not expected; service included."
    }
  },
  {
    "slug": "vienna",
    "city": "Vienna",
    "country": "Austria",
    "countryCode": "AT",
    "lat": 48.2082,
    "lng": 16.3738,
    "heroImageQuery": "vienna opera house imperial",
    "overviewMarkdown": "Vienna is imperial in scale and slow in pace. Coffee house culture is real and worth sitting inside for hours. Public transport is exemplary and cheap. Skip the tourist Mozart concerts.",
    "bestTimeToVisit": {
      "months": [
        "Apr",
        "May",
        "Sep",
        "Oct"
      ],
      "notes": "Spring and fall. December markets are excellent if you like crowds and cold.",
      "avoid": "August can be hot; many locals are on holiday."
    },
    "topNeighborhoods": [
      {
        "name": "Innere Stadt (1st)",
        "vibe": "central, palaces, walkable",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Neubau (7th)",
        "vibe": "design shops, cafés",
        "bestFor": [
          "shopping"
        ]
      },
      {
        "name": "Leopoldstadt (2nd)",
        "vibe": "across canal, Jewish heritage, park",
        "bestFor": [
          "repeat visitors"
        ]
      }
    ],
    "practical": {
      "currency": "Euro (EUR)",
      "language": "German",
      "plugType": "C / F",
      "voltage": "230V",
      "emergencyNumber": "112",
      "tipping": "Round up; 5-10% for good service. Tell server the total."
    }
  },
  {
    "slug": "dublin",
    "city": "Dublin",
    "country": "Ireland",
    "countryCode": "IE",
    "lat": 53.3498,
    "lng": -6.2603,
    "heroImageQuery": "dublin temple bar pub",
    "overviewMarkdown": "Dublin is a small capital that rewards conversation. The pub is the cultural unit. Temple Bar is touristy; the real pubs are everywhere else. Don't try to do too much — the joy is in lingering.",
    "bestTimeToVisit": {
      "months": [
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep"
      ],
      "notes": "Summer has long days and the best chance of dry weather. Bring a rain jacket regardless.",
      "avoid": "Winter is dark and wet."
    },
    "topNeighborhoods": [
      {
        "name": "Trinity / South Georgian",
        "vibe": "central, university, museums",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Stoneybatter",
        "vibe": "village in the city, pubs",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Portobello / Rathmines",
        "vibe": "canal-side, residential, cafés",
        "bestFor": [
          "younger travelers"
        ]
      }
    ],
    "practical": {
      "currency": "Euro (EUR)",
      "language": "English (Irish on signs)",
      "plugType": "G",
      "voltage": "230V",
      "emergencyNumber": "112 or 999",
      "tipping": "10% in restaurants; not expected in pubs."
    }
  },
  {
    "slug": "istanbul",
    "city": "Istanbul",
    "country": "Turkey",
    "countryCode": "TR",
    "lat": 41.0082,
    "lng": 28.9784,
    "heroImageQuery": "istanbul hagia sophia bosphorus",
    "overviewMarkdown": "Istanbul straddles two continents and two thousand years. The historic peninsula has the marquee sights; the European side north of the Golden Horn is where the city actually lives. Ferry rides are not optional.",
    "bestTimeToVisit": {
      "months": [
        "Apr",
        "May",
        "Sep",
        "Oct"
      ],
      "notes": "Spring and fall. Late April and September are ideal.",
      "avoid": "July-August are hot and crowded."
    },
    "topNeighborhoods": [
      {
        "name": "Sultanahmet",
        "vibe": "historic peninsula, Hagia Sophia, Blue Mosque",
        "bestFor": [
          "first-timers",
          "history"
        ]
      },
      {
        "name": "Beyoğlu / Karaköy",
        "vibe": "European side, restaurants, design",
        "bestFor": [
          "food",
          "nightlife"
        ]
      },
      {
        "name": "Kadıköy (Asian side)",
        "vibe": "local, market, fewer tourists",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Beşiktaş / Ortaköy",
        "vibe": "Bosphorus-side, casual",
        "bestFor": [
          "weekends"
        ]
      }
    ],
    "practical": {
      "currency": "Turkish Lira (TRY)",
      "language": "Turkish",
      "plugType": "C / F",
      "voltage": "230V",
      "emergencyNumber": "112",
      "tipping": "5-10% in restaurants; round up taxis."
    }
  },
  {
    "slug": "dubai",
    "city": "Dubai",
    "country": "United Arab Emirates",
    "countryCode": "AE",
    "lat": 25.2048,
    "lng": 55.2708,
    "heroImageQuery": "dubai marina skyline night",
    "overviewMarkdown": "Dubai is sleek, hot, and unapologetically built. You either find its scale exhilarating or sterile. Either way: drink water, dress for the indoor cold, and don't try to walk anywhere not directly between metro stops.",
    "bestTimeToVisit": {
      "months": [
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar"
      ],
      "notes": "Winter months are pleasantly warm. November and March are sweet spots.",
      "avoid": "May-September are brutally hot; outdoor activities become impossible."
    },
    "topNeighborhoods": [
      {
        "name": "Downtown / DIFC",
        "vibe": "Burj Khalifa, dining, central",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Dubai Marina / JBR",
        "vibe": "beach, towers, restaurants",
        "bestFor": [
          "beach"
        ]
      },
      {
        "name": "Al Fahidi / Bur Dubai",
        "vibe": "old Dubai, souks, abra crossings",
        "bestFor": [
          "culture"
        ]
      },
      {
        "name": "Jumeirah",
        "vibe": "residential beach, more relaxed",
        "bestFor": [
          "families"
        ]
      }
    ],
    "practical": {
      "currency": "UAE Dirham (AED)",
      "language": "Arabic; English universal",
      "plugType": "G",
      "voltage": "230V",
      "emergencyNumber": "999 (police), 998 (medical)",
      "tipping": "10% standard; many places include service."
    }
  },
  {
    "slug": "marrakech",
    "city": "Marrakech",
    "country": "Morocco",
    "countryCode": "MA",
    "lat": 31.6295,
    "lng": -7.9811,
    "heroImageQuery": "marrakech medina lanterns souk",
    "overviewMarkdown": "Marrakech is sensory overload by design. The medina is a labyrinth; getting lost is the experience. Riads (traditional courtyard houses) are essential to the trip — pick yours carefully. Bargaining is expected at souks.",
    "bestTimeToVisit": {
      "months": [
        "Mar",
        "Apr",
        "May",
        "Oct",
        "Nov"
      ],
      "notes": "Spring and fall. April and October are ideal.",
      "avoid": "June-August are extremely hot. December-January can be surprisingly cold at night."
    },
    "topNeighborhoods": [
      {
        "name": "Medina",
        "vibe": "old walled city, riads, souks",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Gueliz / Ville Nouvelle",
        "vibe": "modern, cafés, art galleries",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Hivernage",
        "vibe": "luxury hotels, restaurants",
        "bestFor": [
          "luxury"
        ]
      }
    ],
    "practical": {
      "currency": "Moroccan Dirham (MAD)",
      "language": "Arabic / French / Berber",
      "plugType": "C / E",
      "voltage": "220V",
      "emergencyNumber": "190 (police), 150 (ambulance)",
      "tipping": "10-15% in restaurants; small tips for porters and guides."
    }
  },
  {
    "slug": "cape-town",
    "city": "Cape Town",
    "country": "South Africa",
    "countryCode": "ZA",
    "lat": -33.9249,
    "lng": 18.4241,
    "heroImageQuery": "cape town table mountain ocean",
    "overviewMarkdown": "Cape Town has one of the most spectacular settings of any city. Table Mountain is non-negotiable; go early for the cable car. The wine country (Stellenbosch, Franschhoek) is 45 minutes east. Safety varies by neighborhood — research before you go.",
    "bestTimeToVisit": {
      "months": [
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar"
      ],
      "notes": "Southern hemisphere summer. February and March have the best weather and lighter winds than peak Dec-Jan.",
      "avoid": "June-August are winter, often wet."
    },
    "topNeighborhoods": [
      {
        "name": "V&A Waterfront",
        "vibe": "tourist-central, safe, shops",
        "bestFor": [
          "first-timers",
          "families"
        ]
      },
      {
        "name": "Sea Point / Green Point",
        "vibe": "coastal, promenade, restaurants",
        "bestFor": [
          "mid-range"
        ]
      },
      {
        "name": "Camps Bay",
        "vibe": "beach, sundowners",
        "bestFor": [
          "beach days"
        ]
      },
      {
        "name": "Bo-Kaap",
        "vibe": "colorful houses, history",
        "bestFor": [
          "photography"
        ]
      },
      {
        "name": "Woodstock / Salt River",
        "vibe": "art, design, weekend markets",
        "bestFor": [
          "repeat visitors"
        ]
      }
    ],
    "practical": {
      "currency": "South African Rand (ZAR)",
      "language": "English / Afrikaans / isiXhosa",
      "plugType": "M (large 3-pin) / N",
      "voltage": "230V",
      "emergencyNumber": "10111 (police), 10177 (ambulance)",
      "tipping": "10-15% in restaurants; tip car guards a few rand."
    }
  },
  {
    "slug": "bangkok",
    "city": "Bangkok",
    "country": "Thailand",
    "countryCode": "TH",
    "lat": 13.7563,
    "lng": 100.5018,
    "heroImageQuery": "bangkok night street food temple",
    "overviewMarkdown": "Bangkok is loud, hot, delicious, and exhausting in the best way. The street food is among the best in the world. The river divides old (temples, palace) from new (skybar towers). Don't expect to walk far — heat plus traffic — use BTS, metro, river boats, and tuk-tuks.",
    "bestTimeToVisit": {
      "months": [
        "Nov",
        "Dec",
        "Jan",
        "Feb"
      ],
      "notes": "Cool dry season. Even then it's hot — just less so.",
      "avoid": "March-May are blistering. June-October is wet season with daily storms."
    },
    "topNeighborhoods": [
      {
        "name": "Sukhumvit (Asok / Phrom Phong / Thonglor)",
        "vibe": "modern, expat-friendly, restaurants",
        "bestFor": [
          "first-timers",
          "food"
        ]
      },
      {
        "name": "Silom / Sathorn",
        "vibe": "business, river-adjacent",
        "bestFor": [
          "business travelers"
        ]
      },
      {
        "name": "Old City (Rattanakosin)",
        "vibe": "temples, palace, traditional",
        "bestFor": [
          "history"
        ]
      },
      {
        "name": "Ari",
        "vibe": "local, cafés, design",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Chinatown (Yaowarat)",
        "vibe": "intense, food, night markets",
        "bestFor": [
          "food adventures"
        ]
      }
    ],
    "practical": {
      "currency": "Thai Baht (THB)",
      "language": "Thai",
      "plugType": "A / B / C",
      "voltage": "220V",
      "emergencyNumber": "191 (police), 1669 (ambulance), 1155 (tourist police)",
      "tipping": "Round up; 10% at sit-down restaurants if service isn't included."
    }
  },
  {
    "slug": "singapore",
    "city": "Singapore",
    "country": "Singapore",
    "countryCode": "SG",
    "lat": 1.3521,
    "lng": 103.8198,
    "heroImageQuery": "singapore marina bay sands gardens",
    "overviewMarkdown": "Singapore is hyper-modern, multicultural, and clean to the point of clinical. The hawker centers are where you eat — Michelin-starred meals for $4. Easy to navigate, expensive to drink, perfect first stop or layover.",
    "bestTimeToVisit": {
      "months": [
        "Feb",
        "Mar",
        "Apr",
        "Jul",
        "Aug"
      ],
      "notes": "Year-round tropical; February-April are slightly drier. Mid-year monsoon brings storms but quick passes.",
      "avoid": "November-January is wettest."
    },
    "topNeighborhoods": [
      {
        "name": "Marina Bay",
        "vibe": "iconic, central, futuristic",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Chinatown",
        "vibe": "hawker food, temples",
        "bestFor": [
          "food"
        ]
      },
      {
        "name": "Tiong Bahru",
        "vibe": "art deco, cafés, hip",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Kampong Glam",
        "vibe": "Arab quarter, indie shops, mosque",
        "bestFor": [
          "culture"
        ]
      },
      {
        "name": "Little India",
        "vibe": "sensory, food",
        "bestFor": [
          "budget",
          "food"
        ]
      }
    ],
    "practical": {
      "currency": "Singapore Dollar (SGD)",
      "language": "English / Mandarin / Malay / Tamil",
      "plugType": "G",
      "voltage": "230V",
      "emergencyNumber": "999 (police), 995 (medical)",
      "tipping": "Not expected; service charge often included."
    }
  },
  {
    "slug": "seoul",
    "city": "Seoul",
    "country": "South Korea",
    "countryCode": "KR",
    "lat": 37.5665,
    "lng": 126.978,
    "heroImageQuery": "seoul gyeongbokgung palace skyline",
    "overviewMarkdown": "Seoul is fast, layered, and runs on coffee, BBQ, and Wi-Fi everywhere. Each neighborhood has a distinct identity. K-beauty, K-fashion, and K-food are all worth your time. The subway is excellent.",
    "bestTimeToVisit": {
      "months": [
        "Apr",
        "May",
        "Sep",
        "Oct",
        "Nov"
      ],
      "notes": "Spring (cherry blossoms in early April) and fall (foliage in mid-late October) are stunning.",
      "avoid": "Summer is hot and humid with monsoon rain; winter is bitter cold but clear."
    },
    "topNeighborhoods": [
      {
        "name": "Myeongdong",
        "vibe": "shopping, central, touristy",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Hongdae",
        "vibe": "young, live music, late-night",
        "bestFor": [
          "nightlife"
        ]
      },
      {
        "name": "Gangnam / Apgujeong",
        "vibe": "upscale, plastic surgery row, K-pop",
        "bestFor": [
          "luxury"
        ]
      },
      {
        "name": "Bukchon Hanok Village area",
        "vibe": "traditional houses, alleys",
        "bestFor": [
          "culture"
        ]
      },
      {
        "name": "Itaewon / Hannam",
        "vibe": "international, restaurants, cafés",
        "bestFor": [
          "repeat visitors"
        ]
      }
    ],
    "practical": {
      "currency": "Korean Won (KRW)",
      "language": "Korean",
      "plugType": "C / F",
      "voltage": "220V",
      "emergencyNumber": "112 (police), 119 (fire/medical)",
      "tipping": "Not customary."
    }
  },
  {
    "slug": "bali-ubud",
    "city": "Ubud (Bali)",
    "country": "Indonesia",
    "countryCode": "ID",
    "lat": -8.5069,
    "lng": 115.2625,
    "heroImageQuery": "ubud bali rice terraces tegalalang",
    "overviewMarkdown": "Ubud is the cultural and spiritual heart of Bali — rice paddies, art markets, yoga retreats, and warungs. Don't expect a beach — for that go south (Canggu, Seminyak, Uluwatu). Combine Ubud with a coastal stop for a balanced trip.",
    "bestTimeToVisit": {
      "months": [
        "Apr",
        "May",
        "Jun",
        "Sep",
        "Oct"
      ],
      "notes": "Dry season is roughly May-October. Shoulder months have the best balance of weather and crowds.",
      "avoid": "December-February wet season — humid and afternoon downpours. July-August are dry but very crowded."
    },
    "topNeighborhoods": [
      {
        "name": "Central Ubud",
        "vibe": "art market, restaurants, palace",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Penestanan / Sayan",
        "vibe": "rice fields, expat villas",
        "bestFor": [
          "yoga",
          "longer stays"
        ]
      }
    ],
    "practical": {
      "currency": "Indonesian Rupiah (IDR)",
      "language": "Bahasa Indonesia / Balinese (English widely)",
      "plugType": "C / F",
      "voltage": "230V",
      "emergencyNumber": "112",
      "tipping": "10% at restaurants; round up taxis."
    }
  },
  {
    "slug": "hanoi",
    "city": "Hanoi",
    "country": "Vietnam",
    "countryCode": "VN",
    "lat": 21.0285,
    "lng": 105.8542,
    "heroImageQuery": "hanoi old quarter street food",
    "overviewMarkdown": "Hanoi is a city of small plastic stools, motorbike rivers, and impossibly good $2 meals. The Old Quarter is intense; the French Quarter is wider and calmer. Cross streets slowly and predictably.",
    "bestTimeToVisit": {
      "months": [
        "Oct",
        "Nov",
        "Mar",
        "Apr"
      ],
      "notes": "Fall (cool, dry) and spring (warming) are ideal.",
      "avoid": "June-August are hot and humid with frequent storms. January can be unexpectedly cold."
    },
    "topNeighborhoods": [
      {
        "name": "Old Quarter",
        "vibe": "narrow streets, street food, sensory",
        "bestFor": [
          "first-timers",
          "food"
        ]
      },
      {
        "name": "French Quarter / Ba Dinh",
        "vibe": "wider boulevards, government buildings",
        "bestFor": [
          "mid-range"
        ]
      },
      {
        "name": "West Lake (Tay Ho)",
        "vibe": "expat-friendly, lakeside cafés",
        "bestFor": [
          "repeat visitors"
        ]
      }
    ],
    "practical": {
      "currency": "Vietnamese Dong (VND)",
      "language": "Vietnamese",
      "plugType": "A / C / F",
      "voltage": "220V",
      "emergencyNumber": "113 (police), 115 (ambulance)",
      "tipping": "Round up; 5-10% at sit-down restaurants."
    }
  },
  {
    "slug": "mexico-city",
    "city": "Mexico City",
    "country": "Mexico",
    "countryCode": "MX",
    "lat": 19.4326,
    "lng": -99.1332,
    "heroImageQuery": "mexico city zocalo metropolitan cathedral",
    "overviewMarkdown": "Mexico City is one of the great food cities of the world right now. Roma, Condesa, and Polanco have the destination restaurants; the taquerias and tortas have the soul. Stay central — the city is huge and traffic is heavy.",
    "bestTimeToVisit": {
      "months": [
        "Mar",
        "Apr",
        "Oct",
        "Nov"
      ],
      "notes": "March-May has the best weather. October-November is also lovely. Day of the Dead in late October-early November is special.",
      "avoid": "June-September rainy season brings daily afternoon storms."
    },
    "topNeighborhoods": [
      {
        "name": "Roma Norte",
        "vibe": "tree-lined, restaurants, design",
        "bestFor": [
          "first-timers",
          "food"
        ]
      },
      {
        "name": "Condesa",
        "vibe": "art deco, parks, café culture",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Polanco",
        "vibe": "upscale, embassies, fine dining",
        "bestFor": [
          "luxury"
        ]
      },
      {
        "name": "Centro Histórico",
        "vibe": "Zócalo, museums, intense by day",
        "bestFor": [
          "history"
        ]
      },
      {
        "name": "Coyoacán",
        "vibe": "Frida Kahlo, cobblestone, slower",
        "bestFor": [
          "culture"
        ]
      }
    ],
    "practical": {
      "currency": "Mexican Peso (MXN)",
      "language": "Spanish",
      "plugType": "A / B",
      "voltage": "127V",
      "emergencyNumber": "911",
      "tipping": "10-15% at restaurants; small for porters and valets."
    }
  },
  {
    "slug": "new-york-city",
    "city": "New York City",
    "country": "United States",
    "countryCode": "US",
    "lat": 40.7128,
    "lng": -74.006,
    "heroImageQuery": "new york city manhattan skyline brooklyn bridge",
    "overviewMarkdown": "Five boroughs, five experiences. Most first-timers stay in Manhattan and cross to Brooklyn for a day; repeat visitors flip this. The subway is essential and faster than driving. The food is more international than any other US city by an enormous margin.",
    "bestTimeToVisit": {
      "months": [
        "Apr",
        "May",
        "Jun",
        "Sep",
        "Oct"
      ],
      "notes": "Spring and fall are ideal. October has beautiful weather and energy.",
      "avoid": "July-August can be brutal and humid; January-February are cold but real city without tourists."
    },
    "topNeighborhoods": [
      {
        "name": "West Village / Chelsea",
        "vibe": "central, walkable, dinner-rich",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Lower East Side / East Village",
        "vibe": "bars, late-night, characterful",
        "bestFor": [
          "nightlife"
        ]
      },
      {
        "name": "Brooklyn (Williamsburg / Cobble Hill / DUMBO)",
        "vibe": "design, food, views back to Manhattan",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "Upper East / West",
        "vibe": "museums, Central Park, classic",
        "bestFor": [
          "museums",
          "families"
        ]
      },
      {
        "name": "Harlem",
        "vibe": "history, jazz, soul food",
        "bestFor": [
          "culture"
        ]
      }
    ],
    "practical": {
      "currency": "US Dollar (USD)",
      "language": "English",
      "plugType": "A / B",
      "voltage": "120V",
      "emergencyNumber": "911",
      "tipping": "20% standard at restaurants; $1-2/drink at bars; 15-20% for taxis."
    }
  },
  {
    "slug": "new-orleans",
    "city": "New Orleans",
    "country": "United States",
    "countryCode": "US",
    "lat": 29.9511,
    "lng": -90.0715,
    "heroImageQuery": "new orleans french quarter balconies",
    "overviewMarkdown": "New Orleans is a city that runs on music, food, and water. Don't spend the whole trip in the French Quarter — the Marigny, Bywater, and Uptown are where the city actually lives. Eat too much.",
    "bestTimeToVisit": {
      "months": [
        "Feb",
        "Mar",
        "Apr",
        "Oct",
        "Nov",
        "Dec"
      ],
      "notes": "Mardi Gras (Feb/March) and Jazz Fest (late April) are peak. October-December has great weather and lighter crowds.",
      "avoid": "July-September are hot, humid, and hurricane-prone."
    },
    "topNeighborhoods": [
      {
        "name": "French Quarter",
        "vibe": "iconic, touristy, walkable",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Marigny / Bywater",
        "vibe": "creative, music, casual food",
        "bestFor": [
          "music",
          "repeat visitors"
        ]
      },
      {
        "name": "Garden District / Uptown",
        "vibe": "antebellum mansions, streetcar",
        "bestFor": [
          "walking tours"
        ]
      }
    ],
    "practical": {
      "currency": "US Dollar (USD)",
      "language": "English",
      "plugType": "A / B",
      "voltage": "120V",
      "emergencyNumber": "911",
      "tipping": "20% restaurants; $1/drink at bars."
    }
  },
  {
    "slug": "san-francisco",
    "city": "San Francisco",
    "country": "United States",
    "countryCode": "US",
    "lat": 37.7749,
    "lng": -122.4194,
    "heroImageQuery": "san francisco golden gate bridge fog",
    "overviewMarkdown": "San Francisco fits a lot into 7 miles square. Bring layers — microclimates and Karl the fog are real. The food is excellent across cuisines. Pair with Marin (Muir Woods) or the wine country for variety.",
    "bestTimeToVisit": {
      "months": [
        "Sep",
        "Oct"
      ],
      "notes": "September and October are the warmest, sunniest months. Spring is mild.",
      "avoid": "Summer often surprises with cold fog. Winter is rainy but mild."
    },
    "topNeighborhoods": [
      {
        "name": "Mission",
        "vibe": "tacos, murals, sun",
        "bestFor": [
          "food"
        ]
      },
      {
        "name": "Hayes Valley / NoPa",
        "vibe": "shops, restaurants, parks",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "North Beach",
        "vibe": "Italian, City Lights, cafés",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Castro",
        "vibe": "LGBTQ history, neighborhood",
        "bestFor": [
          "culture"
        ]
      }
    ],
    "practical": {
      "currency": "US Dollar (USD)",
      "language": "English",
      "plugType": "A / B",
      "voltage": "120V",
      "emergencyNumber": "911",
      "tipping": "20% at restaurants."
    }
  },
  {
    "slug": "buenos-aires",
    "city": "Buenos Aires",
    "country": "Argentina",
    "countryCode": "AR",
    "lat": -34.6037,
    "lng": -58.3816,
    "heroImageQuery": "buenos aires palermo caminito",
    "overviewMarkdown": "Buenos Aires has the bones of Paris and the energy of Madrid. Steak and Malbec are obligatory. Tango is touristy at La Boca and real in milongas. Dinner is at 10 PM.",
    "bestTimeToVisit": {
      "months": [
        "Mar",
        "Apr",
        "May",
        "Sep",
        "Oct",
        "Nov"
      ],
      "notes": "Southern hemisphere spring and fall. October-November and March-April are best.",
      "avoid": "Summer (Dec-Feb) is hot and humid. Winter (Jun-Aug) is mild but gray."
    },
    "topNeighborhoods": [
      {
        "name": "Palermo (Soho / Hollywood)",
        "vibe": "restaurants, boutiques, parks",
        "bestFor": [
          "first-timers",
          "food"
        ]
      },
      {
        "name": "Recoleta",
        "vibe": "elegant, museum, cemetery",
        "bestFor": [
          "culture"
        ]
      },
      {
        "name": "San Telmo",
        "vibe": "antique, Sunday market, tango",
        "bestFor": [
          "history"
        ]
      },
      {
        "name": "Puerto Madero",
        "vibe": "waterfront, modern",
        "bestFor": [
          "upscale"
        ]
      }
    ],
    "practical": {
      "currency": "Argentine Peso (ARS) — bring USD cash for blue-dollar exchange",
      "language": "Spanish (Rioplatense dialect)",
      "plugType": "C / I",
      "voltage": "220V",
      "emergencyNumber": "911",
      "tipping": "10% at restaurants; small for porters."
    }
  },
  {
    "slug": "rio-de-janeiro",
    "city": "Rio de Janeiro",
    "country": "Brazil",
    "countryCode": "BR",
    "lat": -22.9068,
    "lng": -43.1729,
    "heroImageQuery": "rio de janeiro christ redeemer beach",
    "overviewMarkdown": "Rio's setting is unmatched — mountains rising from beach to sky. The city has real safety considerations; research your neighborhoods and don't flash valuables. The beach is the public square.",
    "bestTimeToVisit": {
      "months": [
        "Apr",
        "May",
        "Jun",
        "Sep",
        "Oct",
        "Nov"
      ],
      "notes": "Fall and spring are best. Carnival (Feb/March) is iconic but extreme.",
      "avoid": "December-March are very hot and crowded; June-July have shorter days but pleasant temperatures."
    },
    "topNeighborhoods": [
      {
        "name": "Ipanema / Leblon",
        "vibe": "beach, upscale, safer",
        "bestFor": [
          "first-timers"
        ]
      },
      {
        "name": "Copacabana",
        "vibe": "iconic beach, more touristy",
        "bestFor": [
          "beach"
        ]
      },
      {
        "name": "Santa Teresa",
        "vibe": "hilltop, artistic, bohemian",
        "bestFor": [
          "culture"
        ]
      },
      {
        "name": "Lapa",
        "vibe": "nightlife, samba, gritty",
        "bestFor": [
          "nightlife"
        ]
      }
    ],
    "practical": {
      "currency": "Brazilian Real (BRL)",
      "language": "Portuguese",
      "plugType": "C / N",
      "voltage": "127V / 220V (varies)",
      "emergencyNumber": "190 (police), 192 (ambulance)",
      "tipping": "10% often included in restaurant bill; round up taxis."
    }
  },
  {
    "slug": "sydney",
    "city": "Sydney",
    "country": "Australia",
    "countryCode": "AU",
    "lat": -33.8688,
    "lng": 151.2093,
    "heroImageQuery": "sydney opera house harbor bridge",
    "overviewMarkdown": "Sydney is built around its harbor. The Opera House and Bridge are best seen from a ferry, not a postcard. The eastern beaches (Bondi, Bronte, Coogee) are connected by a famous coastal walk. The food scene punches above its weight.",
    "bestTimeToVisit": {
      "months": [
        "Sep",
        "Oct",
        "Nov",
        "Mar",
        "Apr",
        "May"
      ],
      "notes": "Spring and autumn are perfect. December-February is summer — hot, crowded, beach-perfect.",
      "avoid": "June-August is winter — mild but rainy."
    },
    "topNeighborhoods": [
      {
        "name": "Surry Hills / Paddington",
        "vibe": "restaurants, design, Victorian terraces",
        "bestFor": [
          "first-timers",
          "food"
        ]
      },
      {
        "name": "Bondi / Bronte",
        "vibe": "beach, coastal walk, brunch",
        "bestFor": [
          "beach"
        ]
      },
      {
        "name": "Newtown / Inner West",
        "vibe": "young, multicultural, alternative",
        "bestFor": [
          "repeat visitors"
        ]
      },
      {
        "name": "The Rocks / CBD",
        "vibe": "historic, harbor-side, central",
        "bestFor": [
          "sightseeing"
        ]
      }
    ],
    "practical": {
      "currency": "Australian Dollar (AUD)",
      "language": "English",
      "plugType": "I",
      "voltage": "230V",
      "emergencyNumber": "000",
      "tipping": "Not expected; 10% at higher-end restaurants for great service."
    }
  }
]

export const destinationBySlug = (slug: string) => destinations.find((d) => d.slug === slug)
export const destinationByCity = (city: string) => destinations.find((d) => d.city.toLowerCase() === city.toLowerCase() || d.slug === city.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
