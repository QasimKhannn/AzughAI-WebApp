import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FilterOption {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'label';
  options?: string[];
  value?: any;
  min?: number;
  max?: number;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Record<string, any>) => void;
  onClearFilters: () => void;
  activeFilterCount?: number;
}

const defaultFilters: FilterOption[] = [
  {
    id: 'color',
    label: 'Color',
    type: 'checkbox',
    options: [
      'White', 'Black', 'Beige', 'Blue', 'Red', 'Green', 'Yellow', 
      'Purple', 'Orange', 'Pink', 'Brown', 'Gray', 'Teal', 'Olive'
    ],
    value: [],
  },
  {
    id: 'brand',
    label: 'Brand',
    type: 'checkbox',
    options: [
      'armani exchange', 'adidas', 'balenciaga', 'burberry', 'gucci', 'prada', 
      'versace', 'nike', 'zara', 'uniqlo', 'h&m', 'lacoste', 'tommy hilfiger',
      'gap', 'levi\'s', 'calvin klein', 'ralph lauren'
    ],
    value: [],
  },
  {
    id: 'price',
    label: 'Price',
    type: 'range',
    min: 0,
    max: 1000,
    value: { min: 0, max: 1000 },
  },
  {
    id: 'clothingType',
    label: 'Clothing Type',
    type: 'label',
    options: [
      'tops', 'bottoms', 'shoes', 'outerwear', 'dresses', 'accessories', 
      'underwear', 'swimwear', 'activewear', 'formalwear'
    ],
    value: [],
  },
  // Add more filter definitions here as needed
];

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  activeFilterCount = 0
}) => {
  const isMobile = useIsMobile();

  // Local state for filters
  const [filters, setFilters] = useState<FilterOption[]>(defaultFilters);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  // Add CSS for range slider
  const sliderStyles = `
    input[type='range'] {
      pointer-events: none; /* Disable pointer events on the entire slider */
    }
    
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: black;
      cursor: pointer;
      position: relative;
      margin-top: -8px;
      border: 2px solid white;
      box-shadow: 0 0 2px rgba(0,0,0,0.3);
      pointer-events: auto; /* Enable pointer events only on the thumb */
    }
    
    input[type='range']::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: black;
      cursor: pointer;
      position: relative;
      border: 2px solid white;
      box-shadow: 0 0 2px rgba(0,0,0,0.3);
      pointer-events: auto; /* Enable pointer events only on the thumb */
    }
    
    /* Make track transparent to use our custom track */
    input[type='range']::-webkit-slider-runnable-track {
      height: 2px;
      background: transparent;
      pointer-events: none;
    }
    
    input[type='range']::-moz-range-track {
      height: 2px;
      background: transparent;
      pointer-events: none;
    }

    /* Special handling for Firefox */
    @-moz-document url-prefix() {
      input[type='range'] {
        height: 20px;
        pointer-events: none;
      }
      
      input[type='range']::-moz-range-thumb {
        pointer-events: auto;
      }
    }
  `;

  const handleExpand = (filterId: string) => {
    setExpanded(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  };

  // Handle filter value change
  const handleFilterChange = (filterId: string, value: any) => {
    setFilters((prev) =>
      prev.map((f) =>
        f.id === filterId ? { ...f, value } : f
      )
    );
  };

  // Count active filters
  const getActiveFilterCount = () => {
    return filters.reduce((acc, filter) => {
      if (Array.isArray(filter.value)) {
        return acc + (filter.value.length > 0 ? 1 : 0);
      }
      return acc + (filter.value ? 1 : 0);
    }, 0);
  };

  // Handle clear all
  const handleClearFilters = () => {
    setFilters(defaultFilters.map(f => ({ ...f, value: f.type === 'checkbox' ? [] : '' })));
    onClearFilters();
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    const filterValues: Record<string, any> = {};
    filters.forEach(f => {
      filterValues[f.id] = f.value;
    });
    onApplyFilters(filterValues);
    onClose();
  };

  // Remove a single selected filter value
  const handleRemoveSelected = (filterId: string, valueToRemove: string) => {
    setFilters((prev) =>
      prev.map((f) =>
        f.id === filterId
          ? {
              ...f,
              value: Array.isArray(f.value)
                ? f.value.filter((v: string) => v !== valueToRemove)
                : ''
            }
          : f
      )
    );
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{sliderStyles}</style>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            className={
              isMobile
                ? "fixed lowercase bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl"
                : "fixed top-12 right-0 h-[calc(100vh-3rem)] w-full max-w-md z-50 bg-white"
            }
            style={
              isMobile
                ? { height: '70vh' }
                : { width: '400px', height: '100vh', top: '0' }
            }
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <Card className="h-full border-none rounded-t-2xl overflow-hidden bg-white">
              <CardContent className="h-full p-0 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1 flex items-center justify-center gap-2">
                    <h2 className="text-md font-manrope font-semibold text-black capitalize">Filters</h2>
                    {getActiveFilterCount() > 0 && (
                      <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-manrope">
                        Filters ({getActiveFilterCount()})
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 text-black hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Thin divider line */}
                {/* <div className="border-t border-gray-400" /> */}
                {/* Filter Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
                  {filters.map((filter) => (
                    <div key={filter.id} className="flex flex-row items-start gap-6">
                      <h3 className="text-black text-sm capitalize tracking-wide min-w-[110px] font-manrope">
                        {filter.label}
                      </h3>
                      {/* Color Filters */}
                      {filter.type === 'checkbox' && filter.id === 'color' && filter.options && (
                        <div className="flex flex-col flex-wrap gap-4 items-start flex-1">
                          {(expanded['color'] ? filter.options : filter.options.slice(0, 4)).map((option) => {
                            // Map color names to actual color values (tailwind or hex)
                            const colorMap: Record<string, string> = {
                              White: 'bg-[#EDEDED]',
                              Black: 'bg-[#000000]',
                              Beige: 'bg-[#FEEBCC]',
                              Blue: 'bg-[#CCE7FE]',
                              Red: 'bg-[#FFCCC9]',
                              Green: 'bg-[#CCFFE4]',
                              Yellow: 'bg-[#FFFCCC]',
                              Purple: 'bg-[#E5CCFF]',
                              Orange: 'bg-[#FFDCCC]',
                              Pink: 'bg-[#FFCCF3]',
                              Brown: 'bg-[#D9C3A9]',
                              Gray: 'bg-[#CCCCCC]',
                              Teal: 'bg-[#CCF2F2]',
                              Olive: 'bg-[#D1D9A9]'
                            };
                            const colorClass = colorMap[option] || 'bg-gray-300';
                            const isSelected = filter.value?.includes(option);
                            return (
                              <label
                                key={option}
                                className={`flex items-center gap-2 cursor-pointer ${
                                  isSelected ? 'bg-gray-100 border border-black rounded px-1' : ''
                                }`}
                              >
                                <span
                                  className={`w-4 h-4 rounded-sm flex items-center justify-center ${colorClass} border border-[#E5E7EB] ${isSelected ? 'ring-2 ring-black' : ''}`}
                                  style={{ boxSizing: 'border-box', borderWidth: 1 }}
                                >
                                  <input
                                    type="checkbox"
                                    className="opacity-0 absolute w-4 h-4"
                                    onChange={(e) => {
                                      const currentValues = filter.value || [];
                                      const newValues = e.target.checked
                                        ? [...currentValues, option]
                                        : currentValues.filter((v: string) => v !== option);
                                      handleFilterChange(filter.id, newValues);
                                    }}
                                    checked={filter.value?.includes(option) || false}
                                    tabIndex={-1}
                                    style={{ position: 'absolute', pointerEvents: 'none' }}
                                  />
                                  {filter.value?.includes(option) && (
                                    <span className="w-2 h-2 bg-black rounded-sm block" />
                                  )}
                                </span>
                                <span className="text-black text-sm font-manrope">{option}</span>
                              </label>
                            );
                          })}
                          {filter.options && filter.options.length > 4 && (
                            <button
                              type="button"
                              className="text-sm font-light text-[#4F4F4F] font-manrope"
                              onClick={() => handleExpand('color')}
                            >
                              {expanded['color'] ? 'Show less' : 'View more'}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Brand Filters */}
                      {filter.type === 'checkbox' && filter.id === 'brand' && filter.options && (
                        <div className="flex flex-col flex-wrap gap-2 items-start flex-1 transition-all duration-300">
                          {(expanded['brand'] ? filter.options : filter.options.slice(0, 4)).map((option) => {
                            const isSelected = filter.value?.includes(option);
                            return (
                              <span
                                key={option}
                                className={`py-1 cursor-pointer text-black text-sm select-none font-manrope bg-white ${
                                  isSelected ? 'bg-gray-100 border border-black rounded px-1' : ''
                                }`}
                                style={{
                                  border: isSelected ? '1px solid #000' : 'none',
                                  background: isSelected ? '#f3f4f6' : 'none',
                                  color: '#000'
                                }}
                                onClick={() => {
                                  const currentValues = filter.value || [];
                                  const isSelected = currentValues.includes(option);
                                  const newValues = isSelected
                                    ? currentValues.filter((v: string) => v !== option)
                                    : [...currentValues, option];
                                  handleFilterChange(filter.id, newValues);
                                }}
                              >
                                {option}
                              </span>
                            );
                          })}
                          {filter.options && filter.options.length > 4 && (
                            <button
                              type="button"
                              className="text-sm font-light font-manrope text-[#4F4F4F]"
                              onClick={() => handleExpand('brand')}
                            >
                              {expanded['brand'] ? 'Show less' : 'View more'}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Price Range Slider */}
                      {filter.type === 'range' && filter.id === 'price' && (
                        <div className="flex flex-col gap-4 items-start flex-1">
                          {/* Single slider with two thumbs */}
                          <div className="w-full relative h-6">
                            {/* Black slider track */}
                            <div className="absolute w-full top-1/2 h-[2px] bg-black -translate-y-1/2 rounded-full"></div>
                            
                            {/* Min thumb - higher z-index to be on top when overlapping */}
                            <input
                              type="range"
                              min={filter.min || 0}
                              max={filter.max || 1000}
                              value={filter.value?.min || filter.min || 0}
                              onChange={(e) => {
                                const newMin = parseInt(e.target.value);
                                const currentMax = filter.value?.max || filter.max || 1000;
                                // Ensure min doesn't exceed max
                                const validMin = Math.min(newMin, currentMax);
                                handleFilterChange(filter.id, { 
                                  min: validMin, 
                                  max: currentMax
                                });
                              }}
                              className="absolute w-full top-1/2 -translate-y-1/2 pointer-events-auto appearance-none bg-transparent h-1"
                              style={{ zIndex: 30 }}
                            />
                            
                            {/* Max thumb - lower z-index */}
                            <input
                              type="range"
                              min={filter.min || 0}
                              max={filter.max || 1000}
                              value={filter.value?.max || filter.max || 1000}
                              onChange={(e) => {
                                const newMax = parseInt(e.target.value);
                                const currentMin = filter.value?.min || filter.min || 0;
                                // Ensure max doesn't go below min
                                const validMax = Math.max(newMax, currentMin);
                                handleFilterChange(filter.id, { 
                                  min: currentMin, 
                                  max: validMax
                                });
                              }}
                              className="absolute w-full top-1/2 -translate-y-1/2 pointer-events-auto appearance-none bg-transparent h-1"
                              style={{ zIndex: 20 }}
                            />
                          </div>
                          <div className="flex gap-2 w-full text-sm text-black font-manrope">
                            <span>${filter.value?.min || 0}</span>
                            <span>-</span>
                            <span>${filter.value?.max || filter.max || 1000}</span>
                          </div>
                        </div>
                      )}

                      {/* Clothing Type Filters */}
                      {filter.type === 'label' && filter.id === 'clothingType' && filter.options && (
                        <div className="flex flex-col flex-wrap gap-2 items-start flex-1">
                          {(expanded['clothingType'] ? filter.options : filter.options.slice(0, 4)).map((option) => {
                            const isSelected = filter.value?.includes(option);
                            return (
                              <span
                                key={option}
                                className={`flex items-center justify-between py-1 cursor-pointer text-black text-sm select-none min-w-[90px] font-manrope ${
                                  isSelected ? 'bg-gray-100 border border-black rounded px-1' : 'bg-white hover:bg-gray-100'
                                }`}
                                style={{
                                  border: isSelected ? '1px solid #000' : 'none',
                                  background: isSelected ? '#f3f4f6' : 'none',
                                  color: '#000'
                                }}
                                onClick={() => {
                                  const currentValues = filter.value || [];
                                  const isSelected = currentValues.includes(option);
                                  const newValues = isSelected
                                    ? currentValues.filter((v: string) => v !== option)
                                    : [...currentValues, option];
                                  handleFilterChange(filter.id, newValues);
                                }}
                              >
                                <span className="flex gap-2 items-center">
                                  {option}
                                  {option === 'tops' && (
                                    <img src="/assets/tops.svg" alt="tops" className="w-4 h-4" />
                                  )}
                                  {option === 'bottoms' && (
                                    <img src="/assets/bottomsfilt.svg" alt="bottoms" className="w-4 h-4" />
                                  )}
                                  {option === 'shoes' && (
                                    <img src="/assets/shoes.svg" alt="shoes" className="w-4 h-4" />
                                  )}
                                  {option === 'outerwear' && (
                                    <img src="/assets/outerwearfilt.svg" alt="outerwear" className="w-4 h-4" />
                                  )}
                                </span>
                              </span>
                            );
                          })}
                          {filter.options && filter.options.length > 4 && (
                            <button
                              type="button"
                              className="text-sm font-light font-manrope text-[#4F4F4F]"
                              onClick={() => handleExpand('clothingType')}
                            >
                              {expanded['clothingType'] ? 'Show less' : 'View more'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="p-4 space-y-3 bg-white">
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-[#303A2FB2] hover:bg-black/90 text-white rounded-[15rem]"
                      onClick={handleApplyFilters}
                    >
                      Show 1 Item
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;
