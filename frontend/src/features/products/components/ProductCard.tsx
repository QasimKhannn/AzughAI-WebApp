import { cn } from "@/lib/utils";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  className?: string;
}

export function ProductCard({ product, onClick, className }: ProductCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full border border-white overflow-hidden cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Image Container */}
    <div className="relative w-full flex-1 aspect-square overflow-hidden border-b border-white">
      <img
        src={product.images[0].image || product.images[0].original_url}
        alt={product.description}
        className="absolute inset-0 w-full h-full object-contain object-center"
      />
    </div>

      {/* Brand Info */}
      <div className="w-full px-5 py-2">
        <div className="flex items-center justify-between gap-2">
          {/* Name & Brand */}
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-lg text-white truncate font-light">
              {product.description}
            </p>
            <p className="text-base text-white font-light">
              {product.brand.name}
            </p>
          </div>

          {/* Price */}
          <p className="text-lg text-white font-light shrink-0">
            ${product.price}
          </p>
        </div>
      </div>
    </div>
  );
}
