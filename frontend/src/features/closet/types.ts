
export interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  images?: string[]; // <-- Add this line
  price: number;
}

export interface ClosetProps {
  className?: string;
}

export interface ClosetItem {
    id: string;
    name: string;
    brand: string;
    category: string;
    image: string;
    images?: string[]; // <-- Add this line
    price: number;
    badgeType?: 'mustHave' | 'maybeLater' | 'giftIdea';
}
