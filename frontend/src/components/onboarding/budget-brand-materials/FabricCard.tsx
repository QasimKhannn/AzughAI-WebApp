import React from "react";

const FabricCard: React.FC<{
    item: { label: string; image: string };
    idx: number;
    isLiked: boolean;
}> = ({ item, idx, isLiked }) => {
    const cardNum = (idx + 1).toString().padStart(2, "0");
    
    return (
        <div
            className="relative w-full h-full bg-white shadow-lg overflow-hidden transition-all border-2 flex flex-col"
            style={{
                borderColor: isLiked ? "#4E2B25" : "transparent",
                background: "#fff"
            }}
        >
            {/* Text row */}
            <div className="flex w-full items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 pb-1 z-20 relative flex-shrink-0">
                <span className="text-black text-sm sm:text-[16px] font-light">
                    ({item.label.toLowerCase()})
                </span>
                <span className="text-black text-sm sm:text-[16px] font-light ml-2 sm:ml-4">{cardNum}</span>
            </div>
            
            {/* Image row */}
            <div className="relative flex-1 w-full min-h-0 flex items-center justify-center px-2 sm:px-4 pb-2">
                <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover"
                    style={{ maxHeight: "100%" }}
                />
                <div className="absolute inset-0 bg-white/10 pointer-events-none" />
                
                {/* Like indicator */}
                {isLiked && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#4E2B25] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FabricCard;
