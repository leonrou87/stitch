import Anthropic from '@anthropic-ai/sdk'

export const tools: Anthropic.Tool[] = [
  {
    name: 'search_flights',
    description: 'Search for flight options between two cities on given dates. Returns price estimates and affiliate booking URLs.',
    input_schema: {
      type: 'object',
      properties: {
        origin: { type: 'string', description: 'IATA code or city name for departure' },
        destination: { type: 'string', description: 'IATA code or city name for arrival' },
        departDate: { type: 'string', description: 'ISO date string for outbound' },
        returnDate: { type: 'string', description: 'ISO date string for return; omit for one-way' },
        adults: { type: 'number', description: 'Number of adult passengers' },
        children: { type: 'number', description: 'Number of child passengers' },
        maxResults: { type: 'number', description: 'Max results to return (default 5)' },
      },
      required: ['origin', 'destination', 'departDate', 'adults'],
    },
  },

  {
    name: 'search_hotels',
    description: 'Search hotels in a destination for given dates and guest count. Returns options grouped by neighborhood with affiliate booking URLs.',
    input_schema: {
      type: 'object',
      properties: {
        destination: { type: 'string', description: 'City name' },
        checkIn: { type: 'string', description: 'ISO date' },
        checkOut: { type: 'string', description: 'ISO date' },
        adults: { type: 'number' },
        children: { type: 'number' },
        rooms: { type: 'number' },
        budgetTier: { type: 'string', enum: ['shoestring', 'budget', 'mid', 'comfortable', 'luxury'] },
        preferredNeighborhoods: { type: 'array', items: { type: 'string' } },
        maxResults: { type: 'number' },
      },
      required: ['destination', 'checkIn', 'checkOut', 'adults'],
    },
  },

  {
    name: 'search_activities',
    description: 'Search bookable activities, tours, and experiences in a destination matching given interests.',
    input_schema: {
      type: 'object',
      properties: {
        destination: { type: 'string' },
        interests: { type: 'array', items: { type: 'string' } },
        dateRange: {
          type: 'object',
          properties: {
            start: { type: 'string' },
            end: { type: 'string' },
          },
        },
        travelersCount: { type: 'number' },
        maxResults: { type: 'number' },
      },
      required: ['destination'],
    },
  },

  {
    name: 'search_restaurants',
    description: 'Find restaurants in a destination matching cuisine, price, and dietary preferences. Includes OpenTable reservation links where available.',
    input_schema: {
      type: 'object',
      properties: {
        destination: { type: 'string' },
        neighborhood: { type: 'string' },
        cuisinePreferences: { type: 'array', items: { type: 'string' } },
        priceRange: { type: 'string', enum: ['$', '$$', '$$$', '$$$$'] },
        dietaryRestrictions: { type: 'array', items: { type: 'string' } },
        maxResults: { type: 'number' },
      },
      required: ['destination'],
    },
  },

  {
    name: 'search_transport',
    description: 'Find ground transport options (trains, buses, ferries) between two locations.',
    input_schema: {
      type: 'object',
      properties: {
        origin: { type: 'string' },
        destination: { type: 'string' },
        mode: { type: 'string', enum: ['train', 'bus', 'ferry', 'car', 'any'] },
        date: { type: 'string' },
      },
      required: ['origin', 'destination'],
    },
  },

  {
    name: 'get_destination_overview',
    description: 'Get cached overview metadata for a city — neighborhoods, best season, practical info. Use this before planning to ground your output in real local knowledge.',
    input_schema: {
      type: 'object',
      properties: {
        city: { type: 'string' },
      },
      required: ['city'],
    },
  },

  {
    name: 'get_weather_forecast',
    description: 'Get expected weather for a destination on given dates. Returns typical climate plus actual forecast if within 16 days.',
    input_schema: {
      type: 'object',
      properties: {
        city: { type: 'string' },
        dates: { type: 'array', items: { type: 'string' } },
      },
      required: ['city', 'dates'],
    },
  },
]
