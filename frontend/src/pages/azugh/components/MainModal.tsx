import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModalImageCarousel from "./ModalImageCarousel";
import ModalInfoRows from "./ModalInfoRows";
import MoreLikeThis from "./MoreLikeThis";

type FinalItem = {
    image: string | string[];
    dressName: string;
    brandName: string;
    price: number;
    sizes?: string[];
    description?: string;
    fabric?: string;
};

type MainModalProps = {
    open: boolean;
    onClose: () => void;
    item: FinalItem | null;
    itemIdx: number | null;
    items: FinalItem[];
    wishlist: Set<string>;
    onWishlist: (idx: number) => void;
    cart: Set<string>;
    onAddToCart: (idx: number) => void;
};

const MainModal: React.FC<MainModalProps> = ({
    open,
    onClose,
    item,
    itemIdx,
    wishlist,
    onWishlist,
    onAddToCart,
}) => {
    // Modal image index state
    const [modalImageIdx, setModalImageIdx] = useState(0);
    const [moreLikeWishlist, setMoreLikeWishlist] = useState<Set<number>>(new Set([2, 5]));

    const handleMoreLikeHeartClick = (id: number) => {
        setMoreLikeWishlist(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    React.useEffect(() => {
        setModalImageIdx(0);
    }, [itemIdx]);

    const getModalImages = (item: FinalItem | null) => {
        if (!item) return [];
        if (Array.isArray(item.image)) return item.image;
        return [item.image];
    };

    const handleModalPrev = () => {
        setModalImageIdx((prev) => {
            const images = getModalImages(item);
            return images.length === 0 ? 0 : (prev === 0 ? images.length - 1 : prev - 1);
        });
    };
    const handleModalNext = () => {
        setModalImageIdx((prev) => {
            const images = getModalImages(item);
            return images.length === 0 ? 0 : (prev === images.length - 1 ? 0 : prev + 1);
        });
    };

    return (
        <AnimatePresence>
            {open && item && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.25 }}
                    className="fixed left-0 top-0 right-0 w-full !h-screen z-30 flex items-center justify-center bg-white overflow-hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="relative z-10 px-0 md:px-0 pb-[20vh] md:pb-[4vh] xl:pt-0 pt-2 flex flex-col items-center justify-start w-full bg-white rounded-none max-w-none overflow-y-auto !h-full !min-h-full flex-1"
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.98, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="absolute mt-4 left-4">
                            <ArrowLeft className="text-gray-800 flex p-0 m-0 cursor-pointer"
                                onClick={onClose} />
                        </div>
                        {/* Responsive two-column layout for md+ */}
                        <div className="flex flex-col md:flex-row w-full gap-0 md:mt-6 md:min-h-[82vh] md:gap-0">
                            {/* Left: Carousel */}
                            <div className="w-full h-full md:w-1/2 flex flex-col items-center">
                                {/* Mobile: Carousel */}
                                <div className="block md:hidden mt-12">
                                    <ModalImageCarousel
                                        images={getModalImages(item)}
                                        currentIdx={modalImageIdx}
                                        onPrev={handleModalPrev}
                                        onNext={handleModalNext}
                                        alt={item.dressName}
                                        isWishlisted={wishlist.has(item.dressName)}
                                        onToggleWishlist={() =>
                                            itemIdx !== null && onWishlist(itemIdx)
                                        }
                                    />
                                    {/* Carousel indicators */}
                                    <div className="flex justify-center items-center w-full mt-4 mb-1 z-10">
                                        <div className="flex space-x-1 items-center">
                                            {getModalImages(item).map((_, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${modalImageIdx === idx ? "bg-[#AA9C64]" : "bg-gray-300"} inline-block`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Desktop: Main image + thumbnails */}
                                <div className="hidden md:flex flex-row w-[70%] h-full items-center justify-center">
                                    {/* Thumbnails */}
                                    <div className="flex flex-col gap-2 md:mr-5">
                                        {getModalImages(item).map((img, idx) => (
                                            <button
                                                key={img + idx}
                                                className={`overflow-hidden w-[6.3vw] h-auto p-0 ${modalImageIdx === idx ? "border-[#AA9C64]" : "border-gray-200"}`}
                                                onClick={() => setModalImageIdx(idx)}
                                                tabIndex={0}
                                                aria-label={`Preview image ${idx + 1}`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${item.dressName} thumbnail ${idx + 1}`}
                                                    className="object-cover w-full h-auto"
                                                    draggable={false}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {/* Main preview */}
                                    <div className="flex items-center justify-center h-full w-auto">
                                        <img
                                            src={getModalImages(item)[modalImageIdx]}
                                            alt={item.dressName}
                                            className="w-[100vw] h-auto"
                                            draggable={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block h-full w-[1.5px] bg-gray-200 mx-6"/>
                            {/* Right: Title, Add to Cart, Info Rows */}
                            <div className="w-full md:w-1/2 h-full flex flex-col justify-start mt-6 md:pr-10 md:mt-0">
                               <div className="flex flex-col w-full h-full">
                                {/* Name, brand, price row */}
                                <div className="flex flex-row justify-between items-center w-full max-w-md mx-auto md:mx-0 md:max-w-none mb-2 px-2">
                                    <div>
                                        <div className="text-lg font-light">{item.dressName}</div>
                                        <div className="text-md text-gray-600">{item.brandName}</div>
                                    </div>
                                    <div className="text-xl font-light">€{item.price}</div>
                                </div>
                                {/* Add to Cart button */}
                                <div className="w-full max-w-md mx-auto md:mx-0 md:max-w-none px-4 pb-5 pt-10">
                                    <Button
                                        className="w-full h-14 inline-flex items-center justify-center
                                        rounded-full bg-[#303A2FB2] text-white
                                        font-light text-lg leading-none
                                        hover:bg-[#99884e] transition"
                                    >
                                        Add to Cart
                                    </Button>
                                </div>
                                </div>
                                {/* Info rows */}
                                <div className="w-full max-w-md mx-auto md:mx-0 md:max-w-none">
                                    <ModalInfoRows 
                                        sizes={item.sizes}
                                        description={item.description}
                                        fabric={item.fabric}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Second row: More like this */}
                        <div className="w-full mx-auto mt-4">
                            <MoreLikeThis
                                isWishlisted={id => moreLikeWishlist.has(id)}
                                onHeartClick={handleMoreLikeHeartClick}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MainModal;
