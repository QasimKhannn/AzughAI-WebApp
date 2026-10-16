import { useState, useRef, useEffect, useCallback } from "react";
import { WidgetProps } from "@/features/agent/types";
import { Product } from "@/features/products/types";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ThumbsDown,
  Plus,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvasStore, CanvasCategory } from "@/features/agent/store/canvasStore";
import { useChatStore } from "@/features/agent/store/agentStore";
import MainModal from "@/pages/azugh/components/MainModal";

interface ItemsWidgetArgs {
  items: Product[];
}

interface ActionButton {
  icon: React.ReactNode;
  label: string;
  action: string;
}

export default function ItemsWidget({
  arguments: args,
  messageId,
  onInteraction,
}: WidgetProps) {
  const { items } = args as unknown as ItemsWidgetArgs;
  console.log('ItemsWidget received items:', items);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animatingAction, setAnimatingAction] = useState<string | null>(null);
  //const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItemIdx, setModalItemIdx] = useState<number | null>(null);
  
  // Wishlist and cart state for modal
  const [modalWishlist, setModalWishlist] = useState<Set<string>>(new Set());
  const [modalCart, setModalCart] = useState<Set<string>>(new Set());
  
  const { addItemToCategory } = useCanvasStore();
  const { setIsCanvasOpen } = useChatStore();

  // Convert Product to FinalItem format for MainModal
  const convertProductToFinalItem = (product: Product) => {
    const images = product.images.map(img => img.image || img.original_url);
    const price = product.price ? parseFloat(product.price) : 0;
    
    // Extract sizes from availability
    let sizes: string[] | undefined;
    if (product.availability && typeof product.availability === 'object' && 'sizes' in product.availability) {
      const availabilitySizes = (product.availability as any).sizes;
      if (Array.isArray(availabilitySizes)) {
        sizes = availabilitySizes;
      }
    }
    
    // Extract fabric/material from details
    let fabric: string | undefined;
    if (product.details && Array.isArray(product.details)) {
      const materialDetail = product.details.find((detail: any) => {
        if (detail && typeof detail === 'object' && !Array.isArray(detail)) {
          const key = detail.key;
          return key === 'Material' || key === 'Fabric' || key === 'material' || key === 'fabric';
        }
        return false;
      });
      if (materialDetail && typeof materialDetail === 'object' && 'value' in materialDetail) {
        const value = materialDetail.value;
        if (value !== null && value !== undefined) {
          fabric = String(value);
        }
      }
    }
    
    return {
      image: images.length > 1 ? images : images[0],
      dressName: product.description,
      brandName: product.brand.name,
      price: price,
      sizes: sizes,
      description: product.about || undefined,
      fabric: fabric,
    };
  };

  // Convert all items to modal format
  const modalItems = items.map(convertProductToFinalItem);

  // Modal handlers
  const handleProductClick = () => {
    setModalItemIdx(currentIndex);
    setModalOpen(true);
  };

  const handleModalWishlist = (idx: number) => {
    setModalWishlist(prev => {
      const newSet = new Set(prev);
      const name = modalItems[idx].dressName;
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  const handleModalAddToCart = (idx: number) => {
    setModalCart(prev => {
      const newSet = new Set(prev);
      const name = modalItems[idx].dressName;
      if (newSet.has(name)) {
        newSet.delete(name);
      } else {
        newSet.add(name);
      }
      return newSet;
    });
  };

  // if no items, return null
  if (!items || items.length === 0) {
    return null;
  }

  const hasMultipleItems = items.length > 1;
  const currentProduct = items[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  // Update modal when currentIndex changes (if modal is open)
  useEffect(() => {
    if (modalOpen) {
      setModalItemIdx(currentIndex);
    }
  }, [currentIndex, modalOpen]);

//   // Handle scroll to update current index on mobile
//   const handleScroll = useCallback(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const scrollLeft = container.scrollLeft;
//     const cardWidth = container.offsetWidth * 0.65; // 65% card width + gap
//     const newIndex = Math.round(scrollLeft / cardWidth);

//     if (newIndex !== currentIndex && newIndex >= 0 && newIndex < items.length) {
//       setCurrentIndex(newIndex);
//     }
//   }, [currentIndex, items.length]);

//   // Scroll to current index when it changes (for desktop arrows)
//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const cardWidth = container.offsetWidth * 0.65;
//     container.scrollTo({
//       left: currentIndex * cardWidth,
//       behavior: "smooth",
//     });
//   }, [currentIndex]);

  const handleAction = (action: string) => {
    // Map action to category
    const categoryMap: Record<string, CanvasCategory> = {
      dislike: 'dislike',
      own: 'own',
      wishlist: 'wishlist',
      add_to_cart: 'add_to_cart',
    };

    const category = categoryMap[action];
    
    if (category && currentProduct) {
      // Add animation effect
      setAnimatingAction(action);
      
      // Add item to canvas store
      addItemToCategory(currentProduct, category);
      
      // Open canvas to show the item was added
      setIsCanvasOpen(true);
      
      // Reset animation after a short delay
      setTimeout(() => {
        setAnimatingAction(null);
      }, 600);
    }

    // Still call the interaction handler for any additional logic
    onInteraction?.({
      type: action,
      messageId,
      productId: currentProduct.id,
    });
  };

  const actionButtons: ActionButton[] = [
    {
      icon: <ThumbsDown strokeWidth={1.5} />,
      label: "Dislike",
      action: "dislike",
    },
    {
      icon: <Plus strokeWidth={1.5} />,
      label: "I own it",
      action: "own",
    },
    {
      icon: <Heart strokeWidth={1.5} />,
      label: "Wishlist",
      action: "wishlist",
    },
    {
      icon: <ShoppingCart strokeWidth={1.5} />,
      label: "Add to cart",
      action: "add_to_cart",
    },
  ];

  if (!currentProduct) return null;

  return (
    <div className="flex flex-col items-center gap-6 lg:gap-8 w-full">
      {/* Product Card with Navigation */}
      <div className="flex relative items-center justify-center gap-12 w-full">
        {/* Left Arrow - Hidden on mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          disabled={!hasMultipleItems}
          className="absolute left-0 z-2 lg:flex lg:static"
        >
          <ArrowLeft
            style={{ width: "28px", height: "28px" }}
            strokeWidth={1.5}
          />
        </Button>

        {/* Swipable Carousel Container */}
        {/* <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className={cn(
            "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:hidden",
            "w-full",
            "px-[17.5%]" // Padding to center first/last cards
          )}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {items.map((product, index) => (
            <div
              key={product.id}
              className="flex-shrink-0 snap-center"
            >
              <ProductCard product={product} className="w-full" />
            </div>
          ))}
        </div> */}

        <div
          className="w-[80%] lg:w-[60%]"
        >
          <ProductCard 
            product={currentProduct} 
            className="w-full" 
            onClick={handleProductClick}
          />
        </div>

        {/* Right Arrow - Hidden on mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={!hasMultipleItems}
          className="absolute right-0 z-2 lg:flex lg:static"
        >
          <ArrowRight
            style={{ width: "28px", height: "28px" }}
            strokeWidth={1.5}
          />
        </Button>
      </div>

      {/* Carousel Indicator Dots - Only show on mobile when multiple items */}
      {hasMultipleItems && (
        <div className="flex items-center justify-center gap-2 h-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "rounded-full transition-all duration-200",
                index === currentIndex
                  ? "w-2 h-2 bg-white"
                  : "w-1.5 h-1.5 bg-white/50"
              )}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-8 lg:gap-11 px-6 lg:px-10">
        {actionButtons.map((btn) => (
          <div
            key={btn.action}
            className="flex flex-col items-center gap-2 w-10"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleAction(btn.action)}
              className={cn(
                "rounded-full size-10 border-white text-white hover:bg-white transition-all duration-300",
                animatingAction === btn.action && "scale-110 bg-white text-gray-900"
              )}
            >
              {btn.icon}
            </Button>
            <span className="text-sm leading-[1.3] text-white text-center whitespace-nowrap font-light">
              {btn.label}
            </span>
          </div>
        ))}
      </div>

      {/* MainModal */}
      <MainModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={modalItemIdx !== null ? modalItems[modalItemIdx] : null}
        itemIdx={modalItemIdx}
        items={modalItems}
        wishlist={modalWishlist}
        onWishlist={handleModalWishlist}
        cart={modalCart}
        onAddToCart={handleModalAddToCart}
      />
    </div>
  );
}
