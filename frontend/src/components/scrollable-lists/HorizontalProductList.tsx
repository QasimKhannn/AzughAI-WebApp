import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import PageHeader from '@/components/PageHeader';
import { Star, Clock, Gift, ChevronRight } from "lucide-react"; // Added ChevronRight
import ProductCard from '@/components/ProductCard';
import MainModal from '@/pages/azugh/components/MainModal'; // <-- Import your modal

interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  images?: string[]; // <-- Add this line
  price: number;
  badgeType?: 'mustHave' | 'maybeLater' | 'giftIdea';
}

interface HorizontalProductListProps {
  title: string;
  items: WishlistItem[];
  onCartClick: (id: string) => void;
  onHeartClick: (id: string) => void;
  wishlistedItems: Set<string>;
  emptyState?: React.ReactNode;
  filterCount?: number;
  onFiltersClick?: () => void;
  className?: string;
  showFilters?: boolean;
  showBackButton?: boolean;
  showBadges?: boolean; // <-- Add this line
}

const MustHaveBadge = () => (
  <span className="flex items-center gap-1 bg-[#AA9C64] text-black text-xs px-2 py-1 rounded shadow">
    <Star className="w-3.5 h-3.5" /> must have
  </span>
);

const MaybeLaterBadge = () => (
  <span className="flex items-center gap-1 bg-gray-400 text-black text-xs px-2 py-1 rounded shadow">
    <Clock className="w-3.5 h-3.5" /> maybe later
  </span>
);

const GiftIdeaBadge = () => (
  <span className="flex items-center gap-1 bg-pink-600/60 text-black text-xs px-2 py-1 rounded shadow">
    <Gift className="w-3.5 h-3.5" /> gift idea
  </span>
);

const HorizontalProductList: React.FC<HorizontalProductListProps> = ({
  title,
  items,
  onCartClick,
  onHeartClick,
  wishlistedItems,
  emptyState,
  filterCount,
  onFiltersClick,
  className,
  showFilters = true,
  showBackButton = false,
  showBadges = false // <-- Add default value
}) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItemIdx, setModalItemIdx] = useState<number | null>(null);

  // For MainModal compatibility, map items to modal format
  const modalItems = items.map(item => ({
    image: (item.images && item.images.length > 0) ? item.images : [item.image], // <-- pass all images here!
    dressName: item.name,
    brandName: item.brand,
    price: item.price,
    images: (item.images && item.images.length > 0) ? item.images : [item.image] // always pass images array
  }));

  // Check scroll position to show/hide indicator
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        // Hide indicator when scrolled, show when at beginning
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        setShowScrollIndicator(scrollLeft < 10);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Check if we need to show the indicator initially
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Wishlist and cart state for modal (for demo, use local state)
  const [modalWishlist, setModalWishlist] = useState<Set<string>>(new Set());
  const [modalCart, setModalCart] = useState<Set<string>>(new Set());

  const handleWishlist = (idx: number) => {
    setModalWishlist(prev => {
      const newSet = new Set(prev);
      const name = modalItems[idx].dressName;
      if (newSet.has(name)) newSet.delete(name);
      else newSet.add(name);
      return newSet;
    });
  };

  const handleAddToCart = (idx: number) => {
    setModalCart(prev => {
      const newSet = new Set(prev);
      const name = modalItems[idx].dressName;
      if (newSet.has(name)) newSet.delete(name);
      else newSet.add(name);
      return newSet;
    });
  };

  return (
    <section className={`mb-0 hide-scrollbar ${className} relative`}>
        <PageHeader
          title={title}
          filterCount={filterCount}
          onFiltersClick={onFiltersClick}
          showFilters={showFilters}
          showBackButton={showBackButton}
        />
      {items.length === 0 && emptyState ? (
        <div className="flex justify-center">{emptyState}</div>
      ) : (
        <div className="relative">
          <div 
            ref={scrollContainerRef} 
            className="flex overflow-x-auto hide-scrollbar"
          >
            {items.map((item, idx) => {
              let badge = null;
              if (showBadges) { // <-- Only show badge if showBadges is true
                if (item.badgeType === 'mustHave') badge = <MustHaveBadge />;
                if (item.badgeType === 'maybeLater') badge = <MaybeLaterBadge />;
                if (item.badgeType === 'giftIdea') badge = <GiftIdeaBadge />;
              }

              return (
                <div key={item.id} className="min-w-[220px] max-w-[240px] flex-shrink-0">
                  <ProductCard
                    id={item.id}
                    name={item.name}
                    brand={item.brand}
                    price={item.price}
                    image={item.image}
                    onCartClick={onCartClick}
                    onHeartClick={onHeartClick}
                    showHeart={true}
                    showPrice={true}
                    showCart={true}
                    isWishlisted={wishlistedItems.has(item.id)}
                    badge={badge}
                    className="border border-black -ml-px"
                    onClick={() => {
                      setModalOpen(true);
                      setModalItemIdx(idx);
                    }}
                  />
                </div>
              );
            })}
          </div>
          
          {/* Scroll indicator */}
          {items.length > 0 && showScrollIndicator && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <div className="flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md animate-pulse">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>
      )}
      {/* MainModal integration */}
      <MainModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={modalItemIdx !== null ? modalItems[modalItemIdx] : null}
        itemIdx={modalItemIdx}
        items={modalItems}
        wishlist={modalWishlist}
        onWishlist={handleWishlist}
        cart={modalCart}
        onAddToCart={handleAddToCart}
      />
    </section>
  );
};

export default HorizontalProductList;