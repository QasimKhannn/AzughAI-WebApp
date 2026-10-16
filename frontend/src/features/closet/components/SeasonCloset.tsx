import { useState } from 'react';
import { ITEMS_OPTIONS } from '../mockData';
import PageLayout from '@/layout/PageLayout';
import { useParams } from 'react-router-dom';
import FilterPanel from '@/components/FilterPanel'; // adjust path if needed
import HorizontalProductList from '@/components/scrollable-lists/HorizontalProductList';
import { ClosetItem } from '../types';

const SeasonCloset = () => {
    const { season } = useParams();
    // Capitalize first letter for display
    const seasonName =
        season && typeof season === "string"
            ? season.charAt(0).toUpperCase() + season.slice(1).toLowerCase()
            : "Winter";
    // For now, use all items for both lists
    const [items] = useState<ClosetItem[]>(
        ITEMS_OPTIONS.slice(0, 8).map((item, index) => ({
            id: `closet-${index}`,
            name: item.label,
            brand: item.brand || 'Brand',
            category: item.value,
            image: Array.isArray(item.images) ? item.images[0] : (item.images || item.icon),
            images: Array.isArray(item.images) ? item.images : [item.images || item.icon], // <-- Add this line
            price: item.price || Math.floor(Math.random() * 200) + 50,
            badgeType: item.badgeType as 'mustHave' | 'maybeLater' | 'giftIdea'
        }))
    );
    const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(
        new Set(items.map(item => item.id))
    );

    // Add filter state
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<any>({});

    const activeFilterCount = Object.values(activeFilters).filter(value =>
        Array.isArray(value) ? value.length > 0 : value !== '' && value !== 0
    ).length;

    const handleCartClick = (id: string) => {
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
            <div className={`w-full min-h-screen flex flex-col max-w-screen-xl md:max-w-full mx-auto`}>
                <div className="flex-1 pb-[20vh] md:pb-[4vh] overflow-y-auto px-0">
                    <HorizontalProductList
                        title={`${seasonName} Closet`}
                        items={items}
                        onCartClick={handleCartClick}
                        onHeartClick={handleHeartClick}
                        wishlistedItems={wishlistedItems}
                        className="mb-4"
                        onFiltersClick={() => setIsFilterOpen(true)}
                        filterCount={activeFilterCount}
                        showFilters={true}
                        showBackButton
                    />
                    <HorizontalProductList
                        title="Favourites"
                        items={items}
                        onCartClick={handleCartClick}
                        onHeartClick={handleHeartClick}
                        wishlistedItems={wishlistedItems}
                        className="mb-4"
                        showFilters={false}
                    />
                </div>
            </div>
            <FilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={() => setIsFilterOpen(false)}
                onClearFilters={() => setActiveFilters({})}
                activeFilterCount={activeFilterCount}
            />
        </PageLayout>
    );
};

export default SeasonCloset;