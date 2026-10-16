import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import ImageIcon from './icons/ImageIcon';
import { Button } from './ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price?: number;
  image: string;
  onCartClick?: (id: string) => void;
  onHeartClick?: (id: string) => void;
  showHeart?: boolean;
  showSelect?: boolean;
  showPrice?: boolean;
  showCart?: boolean;
  isWishlisted?: boolean;
  className?: string;
  badge?: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean; // <-- add this
  onSelectClick?: () => void; // <-- add this
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  brand,
  price,
  image,
  onCartClick,
  onHeartClick,
  showHeart = false,
  showSelect = false,
  showPrice = true,
  showCart = true,
  isWishlisted = false,
  className = "",
  badge,
  onClick,
  isSelected = false,
  onSelectClick
}) => {
  return (
    <div
      className={`relative bg-white flex flex-col ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      {/* Heart icon overlay */}
      {showHeart && (
        <div className="absolute top-0 right-0 z-10">
          <div
            className={`bg-white p-1 flex items-center justify-center transition-colors`}
            style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)" }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              onHeartClick?.(id);
            }}
          >
            <ImageIcon name={isWishlisted ? "heart-filled.svg" : "heart.svg"} alt="Wishlist" width={20} height={20} />
          </div>
        </div>
      )}

      {/* Image Box - fixed aspect ratio, increased size, always object-cover */}
      <div className="relative w-full aspect-[4/5] min-h-[330px] border-b border-black overflow-hidden bg-white">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300"
        />
        {/* Badge in bottom right */}
        {badge && (
          <div className="absolute bottom-2 right-2 z-20">
            {badge}
          </div>
        )}
      </div>


      {/* Content Box - fixed height */}
      <div className="p-2 sm:p-3 md:p-4 flex justify-between items-center min-h-[100px] max-h-[120px]">
        <div className="flex-1 flex flex-col gap-1">
          <h3 className="text-black font-manrope font-medium text-md sm:text-sm md:text-base line-clamp-1">{name}</h3>
          <p className="text-black/70 font-manrope text-sm sm:text-sm line-clamp-1">{brand}</p>
          {showPrice && price && (
            <p className="text-black font-manrope font-medium text-md sm:text-sm">${price}</p>
          )}
        </div>
        {showCart && (
          <div className="ml-2">
            <ImageIcon name="cart.svg" alt="Add to cart" width={22} height={22} className="mr-3 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onCartClick?.(id);
              }} />
          </div>
        )}
        {showSelect && (
          <div className="ml-2 mt-5">
            <Button
              variant={isSelected ? "default" : "outline"}
              className={`!h-6 !py-0 !px-2 min-w-[90px] w-full text-xs lowercase font-manrope rounded-full
              ${isSelected ? "!bg-[#4F4F4F] !text-white" : ""}
            `}
              onClick={(e) => {
                e.stopPropagation();
                onSelectClick?.();
              }}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
