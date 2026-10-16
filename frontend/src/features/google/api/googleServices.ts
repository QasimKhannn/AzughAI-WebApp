import api from '@/lib/axios';
import { PlacesApiResponse, PlaceDetailsApiResponse, PlacePrediction, LocationInfo, PlaceDetails, AddressComponent } from '../types';


class GooglePlacesService {
  /**
   * Search for places using backend proxy to Google Places Autocomplete API
   * @param query - The search query
   * @returns Promise with place predictions
   */
  static async searchPlaces(query: string): Promise<PlacePrediction[]> {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      const response = await api.get<PlacesApiResponse>('/common/google/places/autocomplete/', {
        params: { input: query }
      });
      
      if (response.data.status === 'OK') {
        return response.data.predictions;
      } else if (response.data.status === 'ZERO_RESULTS') {
        return [];
      } else {
        console.error('Google Places API error:', response.data.status);
        return this.getMockPredictions(query);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      // Return mock data as fallback
      return this.getMockPredictions(query);
    }
  }

  /**
   * Get detailed information about a place using backend proxy
   * @param placeId - The place ID from autocomplete
   * @returns Promise with location info (city and country)
   */
  static async getPlaceDetails(placeId: string): Promise<LocationInfo | null> {
    try {
      const response = await api.get<PlaceDetailsApiResponse>('/common/google/places/details/', {
        params: { place_id: placeId }
      });
      
      if (response.data.status === 'OK') {
        const place = response.data.result;
        const locationInfo = this.extractLocationInfo(place);
        return locationInfo;
      } else {
        console.error('Google Place Details API error:', response.data.status);
        return this.getMockLocationInfo(placeId);
      }
    } catch (error) {
      console.error('Error getting place details:', error);
      // Return mock data as fallback
      return this.getMockLocationInfo(placeId);
    }
  }

  /**
   * Mock predictions for development when API is not accessible
   */
  private static getMockPredictions(query: string): PlacePrediction[] {
    const mockCities = [
      // Existing cities
      {
        place_id: 'mock_london',
        description: 'London, UK',
        structured_formatting: {
          main_text: 'London',
          secondary_text: 'UK'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_berlin',
        description: 'Berlin, Germany',
        structured_formatting: {
          main_text: 'Berlin',
          secondary_text: 'Germany'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_liverpool',
        description: 'Liverpool, UK',
        structured_formatting: {
          main_text: 'Liverpool',
          secondary_text: 'UK'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_paris',
        description: 'Paris, France',
        structured_formatting: {
          main_text: 'Paris',
          secondary_text: 'France'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_nyc',
        description: 'New York, NY, USA',
        structured_formatting: {
          main_text: 'New York',
          secondary_text: 'NY, USA'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_tokyo',
        description: 'Tokyo, Japan',
        structured_formatting: {
          main_text: 'Tokyo',
          secondary_text: 'Japan'
        },
        types: ['locality', 'political']
      },
      // European Capitals
      {
        place_id: 'mock_rome',
        description: 'Rome, Italy',
        structured_formatting: {
          main_text: 'Rome',
          secondary_text: 'Italy'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_madrid',
        description: 'Madrid, Spain',
        structured_formatting: {
          main_text: 'Madrid',
          secondary_text: 'Spain'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_amsterdam',
        description: 'Amsterdam, Netherlands',
        structured_formatting: {
          main_text: 'Amsterdam',
          secondary_text: 'Netherlands'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_vienna',
        description: 'Vienna, Austria',
        structured_formatting: {
          main_text: 'Vienna',
          secondary_text: 'Austria'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_brussels',
        description: 'Brussels, Belgium',
        structured_formatting: {
          main_text: 'Brussels',
          secondary_text: 'Belgium'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_zurich',
        description: 'Zurich, Switzerland',
        structured_formatting: {
          main_text: 'Zurich',
          secondary_text: 'Switzerland'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_stockholm',
        description: 'Stockholm, Sweden',
        structured_formatting: {
          main_text: 'Stockholm',
          secondary_text: 'Sweden'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_copenhagen',
        description: 'Copenhagen, Denmark',
        structured_formatting: {
          main_text: 'Copenhagen',
          secondary_text: 'Denmark'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_oslo',
        description: 'Oslo, Norway',
        structured_formatting: {
          main_text: 'Oslo',
          secondary_text: 'Norway'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_helsinki',
        description: 'Helsinki, Finland',
        structured_formatting: {
          main_text: 'Helsinki',
          secondary_text: 'Finland'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_prague',
        description: 'Prague, Czech Republic',
        structured_formatting: {
          main_text: 'Prague',
          secondary_text: 'Czech Republic'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_budapest',
        description: 'Budapest, Hungary',
        structured_formatting: {
          main_text: 'Budapest',
          secondary_text: 'Hungary'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_warsaw',
        description: 'Warsaw, Poland',
        structured_formatting: {
          main_text: 'Warsaw',
          secondary_text: 'Poland'
        },
        types: ['locality', 'political']
      },
      // American Cities
      {
        place_id: 'mock_la',
        description: 'Los Angeles, CA, USA',
        structured_formatting: {
          main_text: 'Los Angeles',
          secondary_text: 'CA, USA'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_chicago',
        description: 'Chicago, IL, USA',
        structured_formatting: {
          main_text: 'Chicago',
          secondary_text: 'IL, USA'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_miami',
        description: 'Miami, FL, USA',
        structured_formatting: {
          main_text: 'Miami',
          secondary_text: 'FL, USA'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_boston',
        description: 'Boston, MA, USA',
        structured_formatting: {
          main_text: 'Boston',
          secondary_text: 'MA, USA'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_seattle',
        description: 'Seattle, WA, USA',
        structured_formatting: {
          main_text: 'Seattle',
          secondary_text: 'WA, USA'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_san_francisco',
        description: 'San Francisco, CA, USA',
        structured_formatting: {
          main_text: 'San Francisco',
          secondary_text: 'CA, USA'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_washington_dc',
        description: 'Washington, DC, USA',
        structured_formatting: {
          main_text: 'Washington',
          secondary_text: 'DC, USA'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_atlanta',
        description: 'Atlanta, GA, USA',
        structured_formatting: {
          main_text: 'Atlanta',
          secondary_text: 'GA, USA'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_las_vegas',
        description: 'Las Vegas, NV, USA',
        structured_formatting: {
          main_text: 'Las Vegas',
          secondary_text: 'NV, USA'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_toronto',
        description: 'Toronto, ON, Canada',
        structured_formatting: {
          main_text: 'Toronto',
          secondary_text: 'ON, Canada'
        },
        types: ['locality', 'political']
      },
      // Middle Eastern Cities
      {
        place_id: 'mock_dubai',
        description: 'Dubai, UAE',
        structured_formatting: {
          main_text: 'Dubai',
          secondary_text: 'UAE'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_abu_dhabi',
        description: 'Abu Dhabi, UAE',
        structured_formatting: {
          main_text: 'Abu Dhabi',
          secondary_text: 'UAE'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_riyadh',
        description: 'Riyadh, Saudi Arabia',
        structured_formatting: {
          main_text: 'Riyadh',
          secondary_text: 'Saudi Arabia'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_doha',
        description: 'Doha, Qatar',
        structured_formatting: {
          main_text: 'Doha',
          secondary_text: 'Qatar'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_kuwait_city',
        description: 'Kuwait City, Kuwait',
        structured_formatting: {
          main_text: 'Kuwait City',
          secondary_text: 'Kuwait'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_beirut',
        description: 'Beirut, Lebanon',
        structured_formatting: {
          main_text: 'Beirut',
          secondary_text: 'Lebanon'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_amman',
        description: 'Amman, Jordan',
        structured_formatting: {
          main_text: 'Amman',
          secondary_text: 'Jordan'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_muscat',
        description: 'Muscat, Oman',
        structured_formatting: {
          main_text: 'Muscat',
          secondary_text: 'Oman'
        },
        types: ['locality', 'political']
      },
      {
        place_id: 'mock_manama',
        description: 'Manama, Bahrain',
        structured_formatting: {
          main_text: 'Manama',
          secondary_text: 'Bahrain'
        },
        types: ['locality', 'political']
      }
    ];

    return mockCities.filter(city => 
      city.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Mock location info for development
   */
  private static getMockLocationInfo(placeId: string): LocationInfo {
    const mockLocations: Record<string, LocationInfo> = {
      // Existing locations
      mock_london: {
        city: 'London',
        country: 'United Kingdom',
        fullAddress: 'London, UK',
        placeId: 'mock_london'
      },
      mock_berlin: {
        city: 'Berlin',
        country: 'Germany',
        fullAddress: 'Berlin, Germany',
        placeId: 'mock_berlin'
      },
      mock_liverpool: {
        city: 'Liverpool',
        country: 'United Kingdom',
        fullAddress: 'Liverpool, UK',
        placeId: 'mock_liverpool'
      },
      mock_paris: {
        city: 'Paris',
        country: 'France',
        fullAddress: 'Paris, France',
        placeId: 'mock_paris'
      },
      mock_nyc: {
        city: 'New York',
        country: 'United States',
        fullAddress: 'New York, NY, USA',
        placeId: 'mock_nyc'
      },
      mock_tokyo: {
        city: 'Tokyo',
        country: 'Japan',
        fullAddress: 'Tokyo, Japan',
        placeId: 'mock_tokyo'
      },
      // European Capitals
      mock_rome: {
        city: 'Rome',
        country: 'Italy',
        fullAddress: 'Rome, Italy',
        placeId: 'mock_rome'
      },
      mock_madrid: {
        city: 'Madrid',
        country: 'Spain',
        fullAddress: 'Madrid, Spain',
        placeId: 'mock_madrid'
      },
      mock_amsterdam: {
        city: 'Amsterdam',
        country: 'Netherlands',
        fullAddress: 'Amsterdam, Netherlands',
        placeId: 'mock_amsterdam'
      },
      mock_vienna: {
        city: 'Vienna',
        country: 'Austria',
        fullAddress: 'Vienna, Austria',
        placeId: 'mock_vienna'
      },
      mock_brussels: {
        city: 'Brussels',
        country: 'Belgium',
        fullAddress: 'Brussels, Belgium',
        placeId: 'mock_brussels'
      },
      mock_zurich: {
        city: 'Zurich',
        country: 'Switzerland',
        fullAddress: 'Zurich, Switzerland',
        placeId: 'mock_zurich'
      },
      mock_stockholm: {
        city: 'Stockholm',
        country: 'Sweden',
        fullAddress: 'Stockholm, Sweden',
        placeId: 'mock_stockholm'
      },
      mock_copenhagen: {
        city: 'Copenhagen',
        country: 'Denmark',
        fullAddress: 'Copenhagen, Denmark',
        placeId: 'mock_copenhagen'
      },
      mock_oslo: {
        city: 'Oslo',
        country: 'Norway',
        fullAddress: 'Oslo, Norway',
        placeId: 'mock_oslo'
      },
      mock_helsinki: {
        city: 'Helsinki',
        country: 'Finland',
        fullAddress: 'Helsinki, Finland',
        placeId: 'mock_helsinki'
      },
      mock_prague: {
        city: 'Prague',
        country: 'Czech Republic',
        fullAddress: 'Prague, Czech Republic',
        placeId: 'mock_prague'
      },
      mock_budapest: {
        city: 'Budapest',
        country: 'Hungary',
        fullAddress: 'Budapest, Hungary',
        placeId: 'mock_budapest'
      },
      mock_warsaw: {
        city: 'Warsaw',
        country: 'Poland',
        fullAddress: 'Warsaw, Poland',
        placeId: 'mock_warsaw'
      },
      // American Cities
      mock_la: {
        city: 'Los Angeles',
        country: 'United States',
        fullAddress: 'Los Angeles, CA, USA',
        placeId: 'mock_la'
      },
      mock_chicago: {
        city: 'Chicago',
        country: 'United States',
        fullAddress: 'Chicago, IL, USA',
        placeId: 'mock_chicago'
      },
      mock_miami: {
        city: 'Miami',
        country: 'United States',
        fullAddress: 'Miami, FL, USA',
        placeId: 'mock_miami'
      },
      mock_boston: {
        city: 'Boston',
        country: 'United States',
        fullAddress: 'Boston, MA, USA',
        placeId: 'mock_boston'
      },
      mock_seattle: {
        city: 'Seattle',
        country: 'United States',
        fullAddress: 'Seattle, WA, USA',
        placeId: 'mock_seattle'
      },
      mock_san_francisco: {
        city: 'San Francisco',
        country: 'United States',
        fullAddress: 'San Francisco, CA, USA',
        placeId: 'mock_san_francisco'
      },
      mock_washington_dc: {
        city: 'Washington',
        country: 'United States',
        fullAddress: 'Washington, DC, USA',
        placeId: 'mock_washington_dc'
      },
      mock_atlanta: {
        city: 'Atlanta',
        country: 'United States',
        fullAddress: 'Atlanta, GA, USA',
        placeId: 'mock_atlanta'
      },
      mock_las_vegas: {
        city: 'Las Vegas',
        country: 'United States',
        fullAddress: 'Las Vegas, NV, USA',
        placeId: 'mock_las_vegas'
      },
      mock_toronto: {
        city: 'Toronto',
        country: 'Canada',
        fullAddress: 'Toronto, ON, Canada',
        placeId: 'mock_toronto'
      },
      // Middle Eastern Cities
      mock_dubai: {
        city: 'Dubai',
        country: 'United Arab Emirates',
        fullAddress: 'Dubai, UAE',
        placeId: 'mock_dubai'
      },
      mock_abu_dhabi: {
        city: 'Abu Dhabi',
        country: 'United Arab Emirates',
        fullAddress: 'Abu Dhabi, UAE',
        placeId: 'mock_abu_dhabi'
      },
      mock_riyadh: {
        city: 'Riyadh',
        country: 'Saudi Arabia',
        fullAddress: 'Riyadh, Saudi Arabia',
        placeId: 'mock_riyadh'
      },
      mock_doha: {
        city: 'Doha',
        country: 'Qatar',
        fullAddress: 'Doha, Qatar',
        placeId: 'mock_doha'
      },
      mock_kuwait_city: {
        city: 'Kuwait City',
        country: 'Kuwait',
        fullAddress: 'Kuwait City, Kuwait',
        placeId: 'mock_kuwait_city'
      },
      mock_beirut: {
        city: 'Beirut',
        country: 'Lebanon',
        fullAddress: 'Beirut, Lebanon',
        placeId: 'mock_beirut'
      },
      mock_amman: {
        city: 'Amman',
        country: 'Jordan',
        fullAddress: 'Amman, Jordan',
        placeId: 'mock_amman'
      },
      mock_muscat: {
        city: 'Muscat',
        country: 'Oman',
        fullAddress: 'Muscat, Oman',
        placeId: 'mock_muscat'
      },
      mock_manama: {
        city: 'Manama',
        country: 'Bahrain',
        fullAddress: 'Manama, Bahrain',
        placeId: 'mock_manama'
      }
    };

    return mockLocations[placeId] || {
      city: 'Sample City',
      country: 'Sample Country',
      fullAddress: 'Sample City, Sample Country',
      placeId: placeId
    };
  }

  /**
   * Extract city and country from place details
   * @param place - Place details from Google API
   * @returns LocationInfo with city and country
   */
  private static extractLocationInfo(place: PlaceDetails): LocationInfo {
    let city = '';
    let country = '';
    console.log('Place address components:', place.address_components);

    // Extract city and country from address components
    place.address_components?.forEach((component: AddressComponent) => {
      const types = component.types;
      
      if (types.includes('locality') || types.includes('administrative_area_level_3')) {
        city = component.long_name;
      }
      
      if (types.includes('country')) {
        country = component.long_name;
      }
    });

    // Fallback: if no locality found, try administrative_area_level_1
    if (!city) {
      place.address_components?.forEach((component: AddressComponent) => {
        if (component.types.includes('administrative_area_level_2')) {
          city = component.long_name;
        }
      });
    }

    return {
      city: city || 'Unknown City',
      country: country || 'Unknown Country',
      fullAddress: place.formatted_address || '',
      placeId: place.place_id || ''
    };
  }
}

export default GooglePlacesService;
