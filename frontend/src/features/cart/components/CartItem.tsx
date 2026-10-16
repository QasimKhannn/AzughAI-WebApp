import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ExternalLink } from "lucide-react";
import { CartItemProps } from "../types";

const CartItem = ({ item, onQuantityChange, onRemove, onClick }: CartItemProps) => {
  const handleQuantityDecrease = () => {
    onQuantityChange(item.id, item.quantity - 1);
  };

  const handleQuantityIncrease = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const handleItemClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleGoToItem = () => {
    if (item?.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card className="border-[0.5px] rounded-none border-black bg-white">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Product Image - Responsive sizing */}
          <div 
            className="w-20 h-24 sm:w-28 sm:h-36 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleItemClick}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover border-[0.5px] border-black"
            />
          </div>

          {/* Product Details - Column Layout */}
          <div 
            className="flex-1 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleItemClick}
          >
            <div className="flex flex-col gap-1 sm:gap-2">
              <h3 className="text-black font-medium text-base sm:text-lg truncate">
                {item.name}
              </h3>
              <p className="text-black/70 text-sm sm:text-base">
                {item.brand}
              </p>
              <p className="text-black font-medium text-sm sm:text-base">
                ${item.price} each
              </p>
            </div>
          </div>

          {/* Controls Section - Responsive layout */}
          <div className="flex flex-col items-end gap-2 sm:gap-4 min-w-[100px] sm:min-w-[140px]">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 sm:h-9 sm:w-9"
                onClick={handleQuantityDecrease}
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>

              <span className="w-6 sm:w-10 text-center text-sm sm:text-base font-medium text-black">
                {item.quantity}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 sm:h-9 sm:w-9"
                onClick={handleQuantityIncrease}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>


            {/* Total Price and Remove */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right">
                <p className="text-black font-medium text-base sm:text-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 sm:h-9 sm:w-9 text-red-600 hover:text-red-800 hover:bg-red-50"
                onClick={handleRemove}
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
                        {/* Go to Item Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoToItem}
              disabled={!item?.link}
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Go to item
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
