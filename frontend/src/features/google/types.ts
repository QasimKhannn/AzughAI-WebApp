export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

export interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  address_components: AddressComponent[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface LocationInfo {
  city: string;
  country: string;
  fullAddress: string;
  placeId: string;
}

export interface PlacesApiResponse {
  predictions: PlacePrediction[];
  status: string;
}

export interface PlaceDetailsApiResponse {
  result: PlaceDetails;
  status: string;
}
