export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  images?: string[];
  quantity: number;
  category?: string;
  originalPrice?: number;
  size?: string;
  color?: string;
  link?: string;
}

export interface CartItemProps {
  item: CartItem;
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
  onClick?: () => void;
}

export interface CheckoutProps {
  cartItems: CartItem[];
  cartTotal: number;
  onClearCart: () => void;
  onCheckout: () => void;
}

export interface EmptyCartProps {
  onBrowseCatalogue?: () => void;
}

export interface CartProps {
  className?: string;
}
