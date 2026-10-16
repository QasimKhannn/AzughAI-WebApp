export interface ConvoItemProps {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  stats?: string;
  onDelete?: () => void;
  onOpen?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
  closet?: any[];
  wishlist?: any[];
  cart?: any[];
  disliked?: any[];
}
