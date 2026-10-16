import { toast } from "sonner";
import { useState } from 'react';
import PageLayout from '@/layout/PageLayout';
import { useNavigate } from "react-router-dom";
import PageHeader from '@/components/PageHeader';
import FilterPanel from '@/components/FilterPanel';
import { ITEMS_OPTIONS } from '@/data/AzughChatData';
import { Camera } from 'lucide-react';
import HorizontalProductList from '@/components/scrollable-lists/HorizontalProductList';
import { ClosetProps, ClothingItem } from "../types";
import ImageIcon from "@/components/icons/ImageIcon";
import { Button } from "@/components/ui/button";
import { overviewCards, seasonCards } from "../data";

const Closet = ({ className }: ClosetProps) => {
  // Use existing items from ITEMS_OPTIONS for demonstration
  const [items] = useState<ClothingItem[]>(
    ITEMS_OPTIONS.slice(0, 8).map((item, index) => ({
      id: `closet-${index}`,
      name: item.label,
      brand: item.brand || 'Brand',
      category: item.value,
      image: Array.isArray(item.images) ? item.images[0] : (item.images || item.icon),
      images: Array.isArray(item.images) ? item.images : [item.images || item.icon], // <-- Add this line
      price: item.price || Math.floor(Math.random() * 200) + 50
    }))
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({});
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(
    new Set(items.map(item => item.id))
  );
  const navigate = useNavigate();

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

  const handleCartClick = (id: string) => {
    console.log('Cart clicked for item:', id);
    // Add cart logic here
  };

  const handleHeartClick = (id: string) => {
    setWishlistedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <PageLayout className="bg-white">
      <div className={`w-full min-h-screen flex flex-col max-w-screen-xl md:max-w-full mx-auto ${className}`}>
        <div className="flex-1 w-full h-full overflow-y-auto px-0">
          <PageHeader
            title="Closet"
            filterCount={activeFilterCount}
            showFilters={false}
            className="mt-0"
          />
          {/* Overview Cards Section */}
          <div className="grid w-full grid-cols-4 space-x-2 mb-2 px-2 md:grid-cols-2 md:gap-8 md:space-x-0 lg:grid-cols-4 md:px-4">
            {overviewCards.map((card, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-1 pt-2 bg-[#AA9C6466] md:p-6 ">
                <div className="text-black mb-1 md:mb-3">
                  {card.icon}
                </div>
                {card.label === "Last Updated" && typeof card.count === "string" && card.count.includes("hrs") ? (
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-[12px] font-semibold text-black font-manrope md:text-lg">
                      {card.count.split(" ")[0]}
                    </span>
                    <span className="text-[12px] text-black font-manrope md:text-lg">
                      {card.count.replace(/^\d+\s*/, "")}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs font-semibold text-black font-manrope md:text-lg">
                    {card.count}
                  </div>
                )}
                <div className="text-xs text-black font-manrope text-center md:text-lg">
                  {card.label}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center px-3 mb-4 mt-4">
            <Button
              className="w-[50%] md:w-auto flex justify-between mr-auto ml-auto py-1 font-light rounded-full bg-[#303A2FB2] hover:bg-[#303A2FB2] text-white text-md transition"
              onClick={() => navigate('/closet/upload-item')}
              type="button"
            >
              <Camera
                style={{ width: 18, height: 18 }}
              />
              Upload New Item
            </Button>
          </div>

          {/* Recently Added Section */}
          <HorizontalProductList
            title="Recently Added"
            items={items.slice(0, 6)} // Show more items in horizontal scroll
            onCartClick={handleCartClick}
            onHeartClick={handleHeartClick}
            wishlistedItems={wishlistedItems}
            filterCount={activeFilterCount}
            onFiltersClick={() => setIsFilterOpen(true)}
            className="mb-2 border-t border-black"
            showFilters={true}
          />

          {/* your closet by season Section */}
          <div className="px-3 pb-[20vh] md:pb-[4vh] md:px-4">
            <h2 className="text-xl font-light text-black mb-4 md:text-2xl">your closet by season</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {seasonCards.map((season, index) => (
                <div
                  key={index}
                  className={`p-4 flex items-center space-x-3 cursor-pointer md:p-6 md:h-20`}
                  style={{ backgroundColor: season.bgColor }}
                  onClick={() => navigate(`/closet/${season.season.toLowerCase()}`)}
                >
                  <div className="text-black">
                    <ImageIcon name={season.iconName} alt={season.season} width={24} height={24} className="md:w-8 md:h-8" />
                  </div>
                  <div>
                    <div className="text-black lowercase font-manrope md:text-lg">
                      {season.season} ({season.count})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

export default Closet;
