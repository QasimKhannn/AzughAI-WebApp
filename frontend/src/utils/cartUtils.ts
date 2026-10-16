// Utility functions for cart management

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

export const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1): void => {
  const cart = getCart();
  const existingItem = cart.find(cartItem => cartItem.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const removeFromCart = (itemId: string): void => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== itemId);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
};

export const getCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const addToWishlist = (item: WishlistItem): void => {
  const wishlist = getWishlist();
  const exists = wishlist.find(wishlistItem => wishlistItem.id === item.id);
  
  if (!exists) {
    wishlist.push(item);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }
};

export const removeFromWishlist = (itemId: string): void => {
  const wishlist = getWishlist();
  const updatedWishlist = wishlist.filter(item => item.id !== itemId);
  localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
};

export const getWishlist = (): WishlistItem[] => {
  try {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  } catch {
    return [];
  }
};

export const isInWishlist = (itemId: string): boolean => {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === itemId);
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};
