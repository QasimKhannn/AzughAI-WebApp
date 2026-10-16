import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  brand: string;
  price?: number;
  image: string;
}

interface ProductGridProps {
  products: Product[];
  gridCols?: string;
  onCartClick?: (id: string) => void;
  onHeartClick?: (id: string) => void;
  onProductClick?: (index: number) => void; // <-- Add this prop
  showHeart?: boolean;
  showPrice?: boolean;
  showCart?: boolean;
  wishlistedItems?: Set<string>;
  emptyState?: React.ReactNode;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4", // <-- Only 4 columns for md and above
  onCartClick,
  onHeartClick,
  onProductClick, // <-- Add this
  showHeart = false,
  showPrice = true,
  showCart = true,
  wishlistedItems, // Remove = new Set() default
  emptyState
}) => {
  return (
    <div className="pb-[10vh] md:pb-0">
      <div className={`grid ${gridCols}`}>
        {products.length === 0 && emptyState ? (
          <div className="col-span-full">
            {emptyState}
          </div>
        ) : (
          products.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              brand={product.brand}
              price={product.price}
              image={product.image}
              onCartClick={onCartClick}
              onHeartClick={onHeartClick}
              onClick={() => onProductClick?.(index)} // <-- Add this click handler
              showHeart={showHeart}
              showPrice={showPrice}
              showCart={showCart}
              isWishlisted={wishlistedItems?.has(product.id) ?? false} // Safe check
              className="border border-black -mt-px -ml-px"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;