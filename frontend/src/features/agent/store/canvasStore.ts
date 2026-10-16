import { create } from 'zustand';
import { Product } from '@/features/products/types';

export type CanvasCategory = 'dislike' | 'own' | 'wishlist' | 'add_to_cart';

export interface CanvasItem {
  product: Product;
  addedAt: number;
  category: CanvasCategory;
}

interface CanvasStore {
  // Items organized by category
  dislikedItems: CanvasItem[];
  ownedItems: CanvasItem[];
  wishlistItems: CanvasItem[];
  cartItems: CanvasItem[];

  // Actions
  addItemToCategory: (product: Product, category: CanvasCategory) => void;
  removeItemFromCategory: (productId: string, category: CanvasCategory) => void;
  clearCategory: (category: CanvasCategory) => void;
  clearAll: () => void;
  
  // Utility
  isItemInCategory: (productId: string, category: CanvasCategory) => boolean;
  getItemsByCategory: (category: CanvasCategory) => CanvasItem[];
  getAllItems: () => CanvasItem[];
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  dislikedItems: [],
  ownedItems: [],
  wishlistItems: [],
  cartItems: [],

  addItemToCategory: (product: Product, category: CanvasCategory) => {
    const newItem: CanvasItem = {
      product,
      addedAt: Date.now(),
      category,
    };

    set((state) => {
      // Check if item already exists in this category
      const categoryKey = getCategoryKey(category);
      const items = state[categoryKey];
      const exists = items.some((item) => item.product.id === product.id);
      
      if (exists) {
        return state; // Don't add duplicates
      }

      return {
        [categoryKey]: [...items, newItem],
      };
    });
  },

  removeItemFromCategory: (productId: string, category: CanvasCategory) => {
    set((state) => {
      const categoryKey = getCategoryKey(category);
      const items = state[categoryKey];
      
      return {
        [categoryKey]: items.filter((item) => item.product.id !== productId),
      };
    });
  },

  clearCategory: (category: CanvasCategory) => {
    set({
      [getCategoryKey(category)]: [],
    });
  },

  clearAll: () => {
    set({
      dislikedItems: [],
      ownedItems: [],
      wishlistItems: [],
      cartItems: [],
    });
  },

  isItemInCategory: (productId: string, category: CanvasCategory) => {
    const state = get();
    const categoryKey = getCategoryKey(category);
    const items = state[categoryKey];
    return items.some((item) => item.product.id === productId);
  },

  getItemsByCategory: (category: CanvasCategory) => {
    const state = get();
    const categoryKey = getCategoryKey(category);
    return state[categoryKey];
  },

  getAllItems: () => {
    const state = get();
    return [
      ...state.dislikedItems,
      ...state.ownedItems,
      ...state.wishlistItems,
      ...state.cartItems,
    ];
  },
}));

// Helper function to map category to state key
function getCategoryKey(category: CanvasCategory): keyof Pick<CanvasStore, 'dislikedItems' | 'ownedItems' | 'wishlistItems' | 'cartItems'> {
  switch (category) {
    case 'dislike':
      return 'dislikedItems';
    case 'own':
      return 'ownedItems';
    case 'wishlist':
      return 'wishlistItems';
    case 'add_to_cart':
      return 'cartItems';
  }
}
