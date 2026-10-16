import { Clock, LayoutGrid, Shirt, Tag } from "lucide-react";

// Season cards data
export const seasonCards = [
  {
    iconName: "Winter.svg",
    season: "Winter",
    count: 10,
    bgColor: "#C7C7C7"
  },
  {
    iconName: "Spring.svg",
    season: "Spring",
    count: 11,
    bgColor: "#AA9C6466"
  },
  {
    iconName: "Summer.svg",
    season: "Summer",
    count: 5,
    bgColor: "#F2D7A2"
  },
  {
    iconName: "Autumn.svg",
    season: "Autumn",
    count: 13,
    bgColor: "#ACBBA8"
  }
];


export const overviewCards = [
  {
    icon: <LayoutGrid className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1} />,
    count: 6,
    label: "Items"
  },
  {
    icon: <Tag className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1} />,
    count: 6,
    label: "Brands"
  },
  {
    icon: <Shirt className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1} />,
    count: 6,
    label: "Categories"
  },
  {
    icon: <Clock className="w-5 h-5 md:w-8 md:h-8" strokeWidth={1} />,
    count: "2 hrs ago",
    label: "Last Updated"
  }
];

export const TYPE_OPTIONS = ['Top', 'Bottom', 'Dress', 'Outerwear', 'Accessory'];
export const COLOR_OPTIONS = ['white', 'black', 'beige', 'blue'];
export const SEASON_OPTIONS = ['winter', 'spring', 'summer', 'autumn'];
export const SIZE_OPTIONS = ['XL', 'L', 'M', 'S'];
export const BRAND_OPTIONS = ['Fendi', 'LV', 'Zara', 'H&M'];

export const COLOR_MAP: Record<string, string> = {
  white: "#fff",
  black: "#000",
  beige: "#f5f5dc",
  blue: "#3b82f6"
};

export const SEASON_ICON_MAP: Record<string, string> = {
  winter: "Winter.svg",
  spring: "Spring.svg",
  summer: "Summer.svg",
  autumn: "Autumn.svg"
};
