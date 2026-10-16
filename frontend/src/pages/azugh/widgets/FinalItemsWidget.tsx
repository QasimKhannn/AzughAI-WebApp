import React, { useState, useEffect } from "react";
import PeekCarousel from "../components/PeekCarousel";
import { useAzughContext } from "@/context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { useCart } from '@/features/cart/hooks/CartContext';
import { ACTION_BUTTONS_CONFIG, ITEMS_OPTIONS } from "@/data/AzughChatData";

type FinalItem = {
    image: string | string[];
    dressName: string;
    brandName: string;
    price: number;
};

type FinalItemsWidgetProps = {
    className?: string;
    onItemClick?: (itemIdx: number) => void;
};

const FEEDBACKS: Record<string, string> = {
    dislike: "Removed from recommendations",
    own: "Added to your wardrobe",
    wishlist: "Added to your wishlist",
    cart: "Added to your cart",
};

const FinalItemsWidget: React.FC<FinalItemsWidgetProps> = ({
    className,
    onItemClick,
}) => {
    const { finalItems, removedItems, setRemovedItems, setCurrentItem } = useAzughContext();
    const [items, setItems] = useState<FinalItem[]>(finalItems);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        setItems(finalItems);
        setCurrent(0);
    }, [finalItems]);

    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [owned, setOwned] = useState<Set<string>>(new Set());
    const [cart, setCart] = useState<Set<string>>(new Set());
    const [loadingIdx, setLoadingIdx] = useState<number | null>(null);

    // Animation/removal state
    const [removingIdx, setRemovingIdx] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{ idx: number; type: string } | null>(null);

    function getReplacementItem(existing: FinalItem[]): FinalItem | null {
        const usedNames = new Set(existing.map(i => i.dressName));
        for (const opt of ITEMS_OPTIONS) {
            if (!usedNames.has(opt.label) && !removedItems.has(opt.label)) {
                return {
                    image: opt.images || opt.icon || "/assets/dummy-img.png",
                    dressName: opt.label,
                    brandName: opt?.brand || "Unknown Brand",
                    price: opt?.price || Math.floor(Math.random() * 100) + 20, // Random price between 20 and 120
                };
            }
        }
        return null;
    }


    // Animate out, then replace with new item (for Dislike)
    const handleDislike = (idx: number) => {
        setRemovingIdx(idx);
        setFeedback(null);
        setTimeout(() => {
            const dislikedName = items[idx].dressName;
            setRemovedItems((prev: Set<string>) => new Set(prev).add(dislikedName));
            setItems(prev => {
                const replacement = getReplacementItem(prev);
                let newItems;
                if (replacement) {
                    newItems = [...prev];
                    newItems[idx] = replacement;
                    // Update current item in context if we're replacing the current item
                    if (idx === current) {
                        setCurrentItem(replacement);
                    }
                } else {
                    newItems = prev.filter((_, i) => i !== idx);
                    // Adjust current index if the current item was removed
                    if (current >= newItems.length) {
                        const newCurrentIdx = Math.max(0, newItems.length - 1);
                        setCurrent(newCurrentIdx);
                        if (newItems[newCurrentIdx]) {
                            setCurrentItem(newItems[newCurrentIdx]);
                        }
                    } else if (idx === current && newItems[current]) {
                        setCurrentItem(newItems[current]);
                    }
                }
                return newItems;
            });
            setRemovingIdx(null);
            setFeedback({ idx, type: "dislike" });
            toast("Removed from recommendations", { position: "top-center", duration: 1400 });
            setTimeout(() => setFeedback(null), 1200);
        }, 500); // Animation duration
    };

    // Animate out, then remove (for Own, Wishlist, Cart)
    function handleRemoveWithFeedback(
        idx: number,
        type: string,
        setSet: React.Dispatch<React.SetStateAction<Set<string>>>
    ) {
        setRemovingIdx(idx);
        setFeedback(null);
        setTimeout(() => {
            setSet(prev => new Set(prev).add(items[idx].dressName));
            // For "own", also add to removedItems
            if (type === "own") setRemovedItems(prev => new Set(prev).add(items[idx].dressName));
            setItems(prev => {
                const newItems = prev.filter((_, i) => i !== idx);
                return newItems;
            });
            setRemovingIdx(null);
            setFeedback({ idx, type });
            if (type === "own") toast("Added to your wardrobe", { position: "top-center", duration: 1400 });
            if (type === "wishlist") toast("Added to your wishlist", { position: "top-center", duration: 1400 });
            if (type === "cart") toast("Added to your cart", { position: "top-center", duration: 1400 });
            setTimeout(() => setFeedback(null), 1200);
        }, 500);
    }

    const handleOwn = (idx: number) => handleRemoveWithFeedback(idx, "own", setOwned);
    const handleWishlist = (idx: number) => handleRemoveWithFeedback(idx, "wishlist", setWishlist);
    const { addToCart: addToCartContext } = useCart();

    const handleAddToCart = (idx: number) => {
        const item = items[idx];
        if (item) {
            addToCartContext({
                id: `final-${idx}-${Date.now()}`,
                name: item.dressName,
                brand: item.brandName,
                price: item.price,
                image: Array.isArray(item.image) ? item.image[0] : item.image,
                images: Array.isArray(item.image) ? item.image : [item.image],
            });
            
            // Remove from recommendations
            setItems(prev => prev.filter((_, i) => i !== idx));
        }
    };

    const handleItemClick = (itemIdx: number) => {
        // Update current item in context when clicking
        if (items[itemIdx]) {
            setCurrentItem(items[itemIdx]);
            onItemClick?.(itemIdx);
        }
    };

    // Use ACTION_BUTTONS_CONFIG for actionButtons
    const actionButtons = ACTION_BUTTONS_CONFIG({
        current,
        items,
        owned,
        wishlist,
        cart,
        handleDislike,
        handleOwn,
        handleWishlist,
        handleAddToCart,
    });

    if (!items || items.length === 0) return null;

    return (
        <div className={`w-full mt-0 ${className || ""} max-w-screen`} >
            <PeekCarousel
                items={items}
                current={current}
                setCurrent={setCurrent}
                cardWidth={260}
                height={320}
                renderItem={(item, idx, isActive) => (
                    <div
                        onClick={() => handleItemClick(idx)}
                        className={clsx(
                            "h-full transition-all duration-500",
                            removingIdx === idx ? "opacity-0 scale-y-75 pointer-events-none" : "opacity-100 scale-y-100"
                        )}
                        style={{
                            height: removingIdx === idx ? 0 : undefined,
                            transitionProperty: "opacity, transform, height",
                        }}
                    >
                        <div className="shadow-lg border-[1.5px] border-gray-200 overflow-hidden flex flex-col select-none w-full h-full">
                            <div className="w-full bg-gray-100 flex items-center justify-center h-[250px] min-h-[250px] max-h-[250px]">
                                {loadingIdx === idx ? (
                                    <Skeleton className="w-full h-[250px] rounded bg-gray-300/70" />
                                ) : (
                                    <img
                                        src={Array.isArray(item.image) ? item.image[0] : item.image}
                                        alt={item.dressName}
                                        className="object-contain w-full max-h-[250px]"
                                    />
                                )}
                            </div>
                            <div className="flex flex-row items-center text-white justify-between px-4 py-2.5 gap-2 bg-transparent border-t border-gray-200 h-16 min-h-16 max-h-16">
                                <div className="flex flex-col items-start">
                                    <div className="font-light text-lg">
                                        {loadingIdx === idx ? <Skeleton className="w-24 h-5 bg-gray-300/70" /> : item.dressName}
                                    </div>
                                    <div className="text-sm font-extralight">
                                        {loadingIdx === idx ? <Skeleton className="w-16 h-4 bg-gray-300/70" /> : item.brandName}
                                    </div>
                                </div>
                                <div className="font-light text-xl ">
                                    {loadingIdx === idx ? <Skeleton className="w-10 h-6 bg-gray-300/70" /> : `€${item.price}`}
                                </div>
                            </div>
                        </div>
                        {feedback && feedback.idx === idx && (
                            <div className="flex items-center justify-center mt-2 transition-all duration-300">
                                <CheckCircle className="text-green-500 mr-2" size={20} />
                                <span className="text-green-600 text-sm font-medium">{FEEDBACKS[feedback.type]}</span>
                            </div>
                        )}
                    </div>
                )}
            />
            {/* ...existing indicator code... */}
            <div className="flex justify-center items-center w-full mt-3 mb-1">
                <div className="flex space-x-2.5 items-center">
                    {items.map((_, idx) => (
                        <Button
                            variant="ghost"
                            key={idx}
                            type="button"
                            className="my-3 focus:outline-none h-0 p-0 bg-none border-none cursor-pointer"
                            onClick={() => setCurrent(idx)}
                            aria-label={`Go to item ${idx + 1}`}
                        >
                            <span
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${current === idx ? "bg-[#AA9C64]" : "bg-gray-300"} inline-block`}
                            />
                        </Button>
                    ))}
                </div>
            </div>
            {/* Action buttons for active item, shown below indicators */}
            <div className="flex justify-center items-center space-x-8 mt-4 mb-2">
                {actionButtons.map(btn => (
                    <div className={btn.wrapperClass} key={btn.key}>
                        <Button
                            className={btn.className}
                            onClick={btn.onClick}
                            aria-label={btn.label}
                            type="button"
                            variant="ghost"
                            disabled={btn.disabled}
                        >
                            {btn.icon}
                        </Button>
                        <span className={btn.spanClass}>{btn.label}</span>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default FinalItemsWidget;
