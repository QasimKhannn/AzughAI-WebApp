export interface WishlistItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  images?: string[]; // <-- add this
  price: number;
  badgeType?: 'mustHave' | 'maybeLater' | 'giftIdea';
}

export interface WishlistProps {
  className?: string;
}
