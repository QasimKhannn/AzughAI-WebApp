import { useCart } from "@/features/cart/hooks/CartContext";
import { CartItem, EmptyCart, Checkout } from "@/features/cart/components";
import { CartProps } from "../types";
import { toast } from "sonner";
import { useState } from "react";
import PageLayout from '@/layout/PageLayout';
import PageHeader from '@/components/PageHeader';
import { useNavigate } from "react-router-dom";
import MainModal from '@/pages/azugh/components/MainModal';
import { useIsMobile } from "@/hooks/use-mobile";

const Cart = ({ className }: CartProps) => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItemIdx, setModalItemIdx] = useState<number | null>(null);

  // For MainModal compatibility, map cart items to modal format
  const modalItems = cartItems.map(item => ({
    image: (item.images && item.images.length > 0) ? item.images : [item.image],
    dressName: item.name,
    brandName: item.brand,
    price: item.price,
    images: (item.images && item.images.length > 0) ? item.images : [item.image]
  }));

  // Modal handlers for wishlist and cart (using local state for demo)
  const [modalWishlist, setModalWishlist] = useState<Set<string>>(new Set());
  const [modalCart, setModalCart] = useState<Set<string>>(new Set(cartItems.map(item => item.name)));

  const handleWishlist = (idx: number) => {
    setModalWishlist(prev => {
      const newSet = new Set(prev);
      const name = modalItems[idx].dressName;
      if (newSet.has(name)) newSet.delete(name);
      else newSet.add(name);
      return newSet;
    });
  };

  const handleAddToCart = (idx: number) => {
    setModalCart(prev => {
      const newSet = new Set(prev);
      const name = modalItems[idx].dressName;
      if (newSet.has(name)) newSet.delete(name);
      else newSet.add(name);
      return newSet;
    });
  };

  const handleOpenCartItem = (itemId: string) => {
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      setModalItemIdx(itemIndex);
      setModalOpen(true);
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    toast.success("Checkout functionality would be implemented here!");
  };

  const handleBrowseCatalogue = () => {
    navigate("/catalogue");
  };

  if (cartItems.length === 0) {
    return (
      <PageLayout className="bg-white">
        <div className={`w-full min-h-screen flex flex-col ${isMobile ? 'max-w-screen-xl' : 'max-w-7xl'} mx-auto ${className}`}>
          <div className="flex-1 w-full h-full overflow-y-auto px-0">
            <PageHeader
              title="Cart"
              filterCount={0}
              showFilters={false}
              className="mt-0"
            />
            <div className="px-4 pb-[20vh]">
              <EmptyCart onBrowseCatalogue={handleBrowseCatalogue} />
            </div>
          </div>
        </div>
        
        {/* MainModal integration */}
        <MainModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          item={modalItemIdx !== null ? modalItems[modalItemIdx] : null}
          itemIdx={modalItemIdx}
          items={modalItems}
          wishlist={modalWishlist}
          onWishlist={handleWishlist}
          cart={modalCart}
          onAddToCart={handleAddToCart}
        />
      </PageLayout>
    );
  }

  // Mobile layout (existing design)
  if (isMobile) {
    return (
      <PageLayout className="bg-white">
        <div className={`w-full min-h-screen flex flex-col max-w-screen-xl mx-auto ${className}`}>
          <div className="flex-1 w-full h-full overflow-y-auto px-0">
            <PageHeader
              title="Cart"
              filterCount={0}
              showFilters={false}
              className="mt-0"
            />
            
            <div className="px-4 pb-[20vh]">
              <div className="space-y-6">
                {/* Cart Items List */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={removeFromCart}
                      onClick={() => handleOpenCartItem(item.id)}
                    />
                  ))}
                </div>

                {/* Cart Summary */}
                <Checkout
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  onClearCart={clearCart}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* MainModal integration */}
        <MainModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          item={modalItemIdx !== null ? modalItems[modalItemIdx] : null}
          itemIdx={modalItemIdx}
          items={modalItems}
          wishlist={modalWishlist}
          onWishlist={handleWishlist}
          cart={modalCart}
          onAddToCart={handleAddToCart}
        />
      </PageLayout>
    );
  }

  // Desktop two-column layout
  return (
    <PageLayout className="bg-white">
      <div className={`w-full min-h-screen flex flex-col max-w-screen-xl md:max-w-full mx-auto ${className}`}>
        <div className="flex-1 w-full h-full overflow-hidden">
          <PageHeader
            title="Cart"
            filterCount={0}
            showFilters={false}
            className="mt-0 px-6"
          />
          
          <div className="flex h- md:h-[80vh] px-6 gap-8 pb-8">
            {/* Left Column - Cart Items (reduced width) */}
            <div className="flex-1 max-1/2 overflow-y-auto">
              <div className="space-y-6 pr-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={removeFromCart}
                    onClick={() => handleOpenCartItem(item.id)}
                  />
                ))}
              </div>
            </div>

            {/* Right Column - Larger Fixed Checkout */}
            <div className="w-1/3 flex-shrink-0">
              <div className="sticky top-0">
                <Checkout
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  onClearCart={clearCart}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* MainModal integration */}
      <MainModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={modalItemIdx !== null ? modalItems[modalItemIdx] : null}
        itemIdx={modalItemIdx}
        items={modalItems}
        wishlist={modalWishlist}
        onWishlist={handleWishlist}
        cart={modalCart}
        onAddToCart={handleAddToCart}
      />
    </PageLayout>
  );
};

export default Cart;