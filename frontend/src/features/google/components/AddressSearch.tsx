import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { PlacePrediction, LocationInfo } from '@/features/google/types';
import { useSearchPlaces, useGetPlaceDetails } from '@/features/google/hooks/useGooglePlaces';
import { cn } from '@/lib/utils';

interface AddressSearchProps {
  onLocationSelect: (location: LocationInfo) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  initialLocation?: LocationInfo | null;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  onLocationSelect,
  placeholder = "Search for your city...",
  className,
  disabled = false,
  initialLocation = null,
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [confirmingSelection, setConfirmingSelection] = useState(false);
  const [isSelectionLocked, setIsSelectionLocked] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    if (confirmingSelection) {
      setConfirmingSelection(false);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, confirmingSelection]);

  useEffect(() => {
    if (isSelectionLocked) {
      setDebouncedQuery('');
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query, isSelectionLocked]);

  // Use React Query for search
  const { data: predictions = [], isLoading } = useSearchPlaces(
    debouncedQuery,
    debouncedQuery.length >= 2 && !isSelectionLocked
  );
  const { mutate: getPlaceDetails, isPending: isLoadingDetails } = useGetPlaceDetails();

  // Update dropdown visibility based on predictions
  useEffect(() => {
    if (isSelectionLocked) {
      setShowDropdown(false);
      setSelectedIndex(-1);
      return;
    }
    setShowDropdown(predictions.length > 0);
    setSelectedIndex(-1);
  }, [predictions, isSelectionLocked]);

  // Prefill initial location
  useEffect(() => {
    if (!initialLocation) return;
    const resolvedLabel = initialLocation.fullAddress || `${initialLocation.city}, ${initialLocation.country}`;
    setQuery(resolvedLabel);
    setIsSelectionLocked(true);
    setDebouncedQuery('');
    setShowDropdown(false);
    setSelectedIndex(-1);
  }, [initialLocation]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSelectionLocked) setIsSelectionLocked(false);
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < predictions.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : predictions.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < predictions.length) {
          handleLocationSelect(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleLocationSelect = (prediction: PlacePrediction) => {
    setQuery(prediction.description);
    setIsSelectionLocked(true);
    setDebouncedQuery('');
    setShowDropdown(false);
    setSelectedIndex(-1);
    
    getPlaceDetails(prediction.place_id, {
      onSuccess: (locationInfo) => {
        if (locationInfo) {
          onLocationSelect(locationInfo);
        }
      },
      onError: (error) => {
        console.error('Error getting location details:', error);
      }
    });
  };

  const handleInputFocus = () => {
    if (predictions.length > 0 && !isSelectionLocked) {
      setShowDropdown(true);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 z-10 transform -translate-y-1/2 text-white w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled || isLoadingDetails}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white bg-transparent backdrop-blur-sm focus:outline-none focus:ring-1 !focus:ring-[#DED8D4] !text-white font-light !placeholder-[#F0EDEB80] selection:bg-white selection:text-black caret-white tracking-[0.02em] font-manrope disabled:opacity-50"
        />
        {(isLoading || isLoadingDetails) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && predictions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-4 md:left-[calc(50%-14rem)] mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-[9999] overflow-y-auto max-h-[300px] w-[calc(100vw-2rem)] max-w-md"
            style={{
              top: inputRef.current ? inputRef.current.getBoundingClientRect().bottom + window.scrollY + 4 : 'auto'
            }}
          >
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.place_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors flex items-center gap-3",
                  selectedIndex === index ? "bg-gray-100" : "hover:bg-gray-50"
                )}
                onClick={() => handleLocationSelect(prediction)}
              >
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {prediction.structured_formatting.main_text}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {prediction.structured_formatting.secondary_text}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddressSearch;
