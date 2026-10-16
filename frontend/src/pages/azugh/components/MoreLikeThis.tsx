import React from "react";
import ImageIcon from '../../../components/icons/ImageIcon';

type MoreLikeThisProps = {
    showHeart?: boolean;
    onHeartClick?: (id: number) => void;
    isWishlisted?: (id: number) => boolean;
};

const MoreLikeThis: React.FC<MoreLikeThisProps> = ({
    showHeart = true,
    onHeartClick,
    isWishlisted = () => false,
}) => (
    <div className="w-full mt-2">
        <div className="text-gray-900 mb-2 pl-1 font-manrope">More like this:</div>
        <div
            className="overflow-x-auto pb-2"
            style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none"
            }}
        >
            <style>
                {`
                .more-like-this-scroll::-webkit-scrollbar {
                    display: none;
                }
                `}
            </style>
            <div className="flex more-like-this-scroll w-full rounded-lg"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((id, idx, arr) => (
                    <div
                        key={idx}
                        className={`relative flex flex-col min-w-[240px] max-w-[240px] bg-white border-t border-black border-b overflow-hidden shadow-sm
                            ${idx !== 0 ? "border-l border-black" : ""}
                            ${idx === arr.length - 1 ? "" : "border-r border-black"}
                        `}
                        style={{ flex: "0 0 auto" }}
                    >
                        {showHeart && (
                            <div className="absolute top-2 right-2 z-50">
                                <div
                                    className="bg-white p-1 flex items-center justify-center rounded-full transition-colors"
                                    style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" }}
                                    onClick={e => {
                                        e.stopPropagation();
                                        onHeartClick?.(id);
                                    }}
                                >
                                    <ImageIcon
                                        name={isWishlisted(id) ? "heart-filled.svg" : "heart.svg"}
                                        alt="Wishlist"
                                        width={24}
                                        height={24}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <img
                                src="/assets/dummy-img.png"
                                alt="Similar item"
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <div className="flex h-[30%] flex-col justify-between px-2 space-y-1 bg-white">
                            <p className="font-medium text-base text-gray-900 truncate">Dress Name</p>
                            <p className="text-xs text-[#4F4F4F] truncate">Brand Name</p>
                            <p className="font-semibold text-[#4F4F4F] text-base">$99</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default MoreLikeThis;