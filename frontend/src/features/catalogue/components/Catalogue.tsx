import { toast } from "sonner";
import React, { useState } from 'react';
import { ITEMS_OPTIONS } from '../mockData';
import PageLayout from '@/layout/PageLayout';
import { useCart } from '@/features/cart/hooks/CartContext';
import FilterPanel from '@/components/FilterPanel';
import HorizontalProductList from '@/components/scrollable-lists/HorizontalProductList';
import { CatalogueItem } from "../types";

const Catalogue: React.FC = () => {
  // Use existing items from ITEMS_OPTIONS for demonstration
  const [items] = useState<CatalogueItem[]>(
    ITEMS_OPTIONS.slice(0, 12).map((item, index) => ({
      id: `catalogue-${index}`,
      name: item.label,
      brand: item.brand || 'Brand',
      category: item.value,
      price: item.price || Math.floor(Math.random() * 200) + 50,
      image: Array.isArray(item.images) ? item.images[0] : (item.images || item.icon),
      images: Array.isArray(item.images) ? item.images : [item.images || item.icon], // <-- Add this line
      tags: ['fashion', 'style'], // Remove reference to item.tags since it doesn't exist
      link: (item as any).link // Cast to any to access link property
    }))
  );

  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const { addToCart } = useCart();

  const activeFilterCount = Object.values(activeFilters).filter(value =>
    Array.isArray(value) ? value.length > 0 : value !== '' && value !== 0
  ).length;

  const handleCartClick = (id: string) => {
    // Add to cart
    const item = items.find(item => item.id === id);
    if (item) {
      addToCart({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        image: item.image,
        images: item.images,
        category: item.category,
        link: (item as any).link // Cast to any to access link property
      });
    }
  };

  const handleHeartClick = (id: string) => {
    // Toggle wishlist status
    const item = items.find(item => item.id === id);
    if (item) {
      setWishlistedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
          toast.success(`${item.name} removed from wishlist!`);
        } else {
          newSet.add(id);
          toast.success(`${item.name} added to wishlist!`);
        }
        return newSet;
      });
    }
  };

  const handleApplyFilters = () => {
    // Apply filtering logic here
    console.log('Applying filters:', activeFilters);
    toast.success('Filters applied!');
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    toast.success('Filters cleared!');
  };

  return (
    <PageLayout className="bg-white">
      <div
        className="w-full pb-[20vh] md:pb-[4vh] min-h-screen max-h-screen flex flex-col max-w-screen-xl md:max-w-full mx-auto"
        style={{ overflowY: "auto" }} // <-- add this line
      >
        <div className="flex-1 flex flex-col gap-0 m-0 p-0">
          <HorizontalProductList
            title="Curated Collections"
            items={items}
            onCartClick={handleCartClick}
            onHeartClick={handleHeartClick}
            wishlistedItems={wishlistedItems}
            filterCount={activeFilterCount}
            onFiltersClick={() => setIsFilterOpen(true)}
          />
          <HorizontalProductList
            title="Because You Liked Kaftans"
            items={items}
            onCartClick={handleCartClick}
            onHeartClick={handleHeartClick}
            wishlistedItems={wishlistedItems}
            filterCount={activeFilterCount}
            onFiltersClick={() => setIsFilterOpen(true)}
          />
        </div>
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        activeFilterCount={activeFilterCount}
      />
    </PageLayout>
  );
};

export default Catalogue;