import { useQuery, useMutation } from "@tanstack/react-query";
import GooglePlacesService from "../api/googleServices";
import { LocationInfo } from "../types";

/**
 * Hook to search for places with debouncing handled by the component
 */
export const useSearchPlaces = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['places', 'search', query],
    queryFn: () => GooglePlacesService.searchPlaces(query),
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

/**
 * Hook to get place details by place_id
 */
export const useGetPlaceDetails = () => {
  return useMutation({
    mutationKey: ['places', 'details'],
    mutationFn: (placeId: string) => GooglePlacesService.getPlaceDetails(placeId),
  });
};
