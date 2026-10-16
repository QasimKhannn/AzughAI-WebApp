import { X } from "lucide-react";
import { useChatStore } from "../../store/agentStore";
import { useCanvasStore, CanvasCategory } from "../../store/canvasStore";
import { Product } from "@/features/products/types";

// Hanger SVG icon for empty state
const HangerIcon = () => (
  <svg
    width="331"
    height="285"
    viewBox="0 0 331 285"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.365 206.14L131.202 142.315C141.623 136.144 153.447 132.948 165.459 133.054C177.472 132.948 189.295 136.144 199.717 142.315L309.553 206.14C317.344 210.661 323.464 217.721 326.956 226.217C330.448 234.712 331.114 244.163 328.851 253.092C326.588 262.02 321.523 269.922 314.448 275.56C307.374 281.199 298.689 284.256 289.753 284.254H41.1656C32.2294 284.256 23.5446 281.199 16.4701 275.56C9.39562 269.922 4.33052 262.02 2.06734 253.092C-0.195842 244.163 0.470579 234.712 3.96233 226.217C7.45408 217.721 13.5742 210.661 21.365 206.14Z"
      stroke="#6F766E"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M128.848 36.7545C128.848 16.8717 145.226 0.75 165.448 0.75C185.669 0.75 202.048 16.8717 202.048 36.7545C202.048 50.3625 194.362 62.1939 183.052 68.3175C174.104 73.1559 165.448 81.2073 165.448 91.659V133.05"
      stroke="#6F766E"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

interface ProductCardProps {
  product: Product;
  onRemove?: (id: string) => void;
}

const ProductCard = ({ product, onRemove }: ProductCardProps) => {
  const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
  const imageUrl = primaryImage?.image || primaryImage?.original_url;

  return (
    <div className="relative border border-gray-200 flex items-center justify-center p-2   min-w-[118px] h-[118px] shrink-0 bg-white rounded-md group transition-all duration-200 hover:shadow-md">
      {/* Remove button */}
      <button
        onClick={() => onRemove?.(product.id)}
        className="absolute top-1 right-1 w-5 h-5 bg-gray-900 text-white flex items-center justify-center z-10 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
        aria-label="Remove item"
      >
        <X className="w-3 h-3" />
      </button>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={product.description}
          className="max-w-full max-h-full object-contain"
        />
      )}
    </div>
  );
};

interface CategoryRowProps {
  title: string;
  products: Product[];
  category: CanvasCategory;
  onRemoveProduct?: (id: string, category: CanvasCategory) => void;
}

const CategoryRow = ({
  title,
  products,
  category,
  onRemoveProduct,
}: CategoryRowProps) => (
  <div className="space-y-3 animate-in fade-in duration-300">
    <div className="flex items-center justify-between">
      <h3 className="text-base text-gray-900 font-medium">{title}</h3>
      <span className="text-sm text-gray-500">{products.length} {products.length === 1 ? 'item' : 'items'}</span>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onRemove={(id) => onRemoveProduct?.(id, category)}
        />
      ))}
    </div>
  </div>
);

// Empty state component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6">
    <HangerIcon />
    <h2 className="text-[30px] font-medium text-gray-900 mt-8 leading-tight">
      Start curating your collection
    </h2>
    <p className="text-base text-gray-500 mt-2 max-w-md">
      Interact with items in the chat to organize them here. Dislike, mark as owned, add to wishlist, or cart.
    </p>
  </div>
);

export default function DesktopChatCanvas() {
  const { isCanvasOpen, setIsCanvasOpen } = useChatStore();
  const { 
    dislikedItems, 
    ownedItems, 
    wishlistItems, 
    cartItems,
    removeItemFromCategory 
  } = useCanvasStore();

  const handleRemoveProduct = (productId: string, category: CanvasCategory) => {
    removeItemFromCategory(productId, category);
  };

  const hasAnyItems = 
    dislikedItems.length > 0 || 
    ownedItems.length > 0 || 
    wishlistItems.length > 0 || 
    cartItems.length > 0;

  if (!isCanvasOpen) return null;

  return (
    <div className="bg-white rounded-xl shadow-[0px_1px_22px_0px_rgba(74,72,49,0.15)] h-full w-full aspect-[1/1] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h1 className="text-2xl font-medium text-gray-900">Your Collection</h1>
        <button
          onClick={() => setIsCanvasOpen(false)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          aria-label="Close canvas"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {hasAnyItems ? (
          <div className="px-6 py-4 space-y-6">
            {dislikedItems.length > 0 && (
              <CategoryRow
                title="Disliked"
                products={dislikedItems.map(item => item.product)}
                category="dislike"
                onRemoveProduct={handleRemoveProduct}
              />
            )}
            {ownedItems.length > 0 && (
              <CategoryRow
                title="I Own It"
                products={ownedItems.map(item => item.product)}
                category="own"
                onRemoveProduct={handleRemoveProduct}
              />
            )}
            {wishlistItems.length > 0 && (
              <CategoryRow
                title="Wishlist"
                products={wishlistItems.map(item => item.product)}
                category="wishlist"
                onRemoveProduct={handleRemoveProduct}
              />
            )}
            {cartItems.length > 0 && (
              <CategoryRow
                title="Cart"
                products={cartItems.map(item => item.product)}
                category="add_to_cart"
                onRemoveProduct={handleRemoveProduct}
              />
            )}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
