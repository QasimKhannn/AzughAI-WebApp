import { toast } from "sonner";
import { useState } from 'react';
import { Heart } from "lucide-react";
import { ITEMS_OPTIONS } from '../mockData';
import PageLayout from '@/layout/PageLayout';
import { Button } from "@/components/ui/button";
import { useCart } from '@/features/cart/hooks/CartContext';
import FilterPanel from '@/components/FilterPanel';
import { WishlistItem, WishlistProps } from "../types"; 
import HorizontalProductList from '@/components/scrollable-lists/HorizontalProductList';

const Wishlist = ({ className }: WishlistProps) => {
  const [items, setItems] = useState<WishlistItem[]>(
    ITEMS_OPTIONS.slice(2, 10).map((item, index) => ({
      id: String(index + 2), // Use index+2 to match ITEMS_OPTIONS.slice(2, 10)
      name: item.label,
      brand: item.brand || 'Brand',
      category: item.value,
      image: Array.isArray(item.images) ? item.images[0] : (item.images || item.icon),
      images: Array.isArray(item.images) ? item.images : [item.images || item.icon], // <-- add this
      price: item.price || Math.floor(Math.random() * 200) + 50,
      badgeType: item.badgeType as 'mustHave' | 'maybeLater' | 'giftIdea'
    }))
  );

  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(
    new Set(items.map(item => item.id))
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});

  const activeFilterCount = Object.values(activeFilters).filter(value =>
    Array.isArray(value) ? value.length > 0 : value !== '' && value !== 0
  ).length;

  const handleApplyFilters = () => {
    console.log('Applying filters:', activeFilters);
    toast.success('Filters applied!');
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    toast.success('Filters cleared!');
  };

  const { addToCart } = useCart();

  const handleCartClick = (id: string) => {
    // Add to cart and remove from wishlist
    const item = items.find(item => item.id === id);
    if (item) {
      addToCart({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        image: item.image,
        images: item.images,
        category: item.category
      });

      // Remove from wishlist
      setItems(prev => prev.filter(item => item.id !== id));
      setWishlistedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleRemoveFromWishlist = (id: string) => {
    // Remove from wishlist
    const item = items.find(item => item.id === id);
    if (item) {
      setItems(prev => prev.filter(item => item.id !== id));
      setWishlistedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      // Show success message
      toast.success(`${item.name} removed from wishlist!`);
    }
  };

  const emptyState = (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <Heart className="w-16 h-16 text-black/20 mb-4" />
      <h3 className="text-lg font-medium text-black mb-2">Your wishlist is empty</h3>
      <p className="text-black/60 text-sm mb-6">Save items you love to easily find them later</p>
      <Button
        className="bg-black hover:bg-black/90 text-white"
        onClick={() => (window.location.href = "/catalogue")}
      >
        Browse Catalogue
      </Button>
    </div>
  );

  return (
    <PageLayout className="bg-white">
      <div
        className={`w-full pb-[20vh] md:pb-[4vh] min-h-screen max-h-screen flex flex-col max-w-screen-xl md:max-w-full mx-auto ${className}`}
        style={{ overflowY: "auto" }}
      >
        <div className="flex-1 flex flex-col gap-0 m-0 p-0">
          <HorizontalProductList
            title="wishlist"
            items={items} // <-- all items
            onCartClick={handleCartClick}
            onHeartClick={handleRemoveFromWishlist}
            wishlistedItems={new Set(items.map(item => item.id))}
            emptyState={emptyState}
            filterCount={activeFilterCount}
            onFiltersClick={() => setIsFilterOpen(true)}
            showBadges
          />
          <HorizontalProductList
            title="sales"
            items={items} // <-- all items
            onCartClick={handleCartClick}
            onHeartClick={handleRemoveFromWishlist}
            wishlistedItems={new Set(items.map(item => item.id))}
            emptyState={emptyState}
            filterCount={activeFilterCount}
            onFiltersClick={() => setIsFilterOpen(true)}
            showBadges
          />
          <HorizontalProductList
            title="finishing soon"
            items={items} // <-- all items
            onCartClick={handleCartClick}
            onHeartClick={handleRemoveFromWishlist}
            wishlistedItems={new Set(items.map(item => item.id))}
            emptyState={emptyState}
            filterCount={activeFilterCount}
            onFiltersClick={() => setIsFilterOpen(true)}
            showBadges
          />
          <HorizontalProductList
            title="out of stock"
            items={items} // <-- all items
            onCartClick={handleCartClick}
            onHeartClick={handleRemoveFromWishlist}
            wishlistedItems={new Set(items.map(item => item.id))}
            emptyState={emptyState}
            filterCount={activeFilterCount}
            onFiltersClick={() => setIsFilterOpen(true)}
            showBadges
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

export default Wishlist;

