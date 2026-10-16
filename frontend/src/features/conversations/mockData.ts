import { Thread } from "@/features/agent/types";

export const ITEMS_OPTIONS = [
    {
        label: "Volume Kaftan",
        brand: "NA-KD",
        value: "dress",
        icon: "/assets/dresses.svg",
        price: 65.95,
        badgeType: "mustHave",
        images: [
            "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/ruffle_volume_kaftan_1100-011540-0002_social.jpg",
            "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/ruffle_volume_kaftan_1100-011540-0002_campaign.jpg",
            "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/ruffle_volume_kaftan-1100-011540-0002_0013.jpg",
            "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/ruffle_volume_kaftan-1100-011540-0002_0010.jpg"
        ]
    },
    {
        label: "Kimono wrap",
        brand: "ASOS DESIGN",
        value: "dress",
        icon: "/assets/dresses.svg",
        price: 64.99,
        badgeType: "maybeLater",
        images: [
            "https://images.asos-media.com/products/asos-design-wickel-midikleid-in-dunkelbraun-im-kimono-stil/207875660-1-darkbrown?$n_1280w$&wid=1125&fit=constrain",
            "https://images.asos-media.com/products/asos-design-wickel-midikleid-in-dunkelbraun-im-kimono-stil/207875660-2?$n_1280w$&wid=1125&fit=constrain",
            "https://images.asos-media.com/products/asos-design-wickel-midikleid-in-dunkelbraun-im-kimono-stil/207875660-3?$n_1280w$&wid=1125&fit=constrain"
        ]
    },
    {
        label: "ABAYA",
        brand: "Elara",
        value: "dress",
        icon: "/assets/dresses.svg",
        price: 40.49,
        badgeType: "giftIdea",
        images: [
            "https://img01.ztat.net/article/spp-media-p1/831ea40bb89a4fd9ba82a5a397a5bc26/d825e82a914148a897e563820189a3f3.jpg?imwidth=1800",
            "https://img01.ztat.net/article/spp-media-p1/f62969795e1a4c66b03cac9057a3e6d1/3a3c2cb3cb4d4c869cb04daf7c1f802d.jpg?imwidth=1800",
            "https://img01.ztat.net/article/spp-media-p1/0811e2e3a2cc4c2680b472dae56859ee/040fd85a18f5414c840c996d0a137be6.jpg?imwidth=1800",
            "https://img01.ztat.net/article/spp-media-p1/ba2e439f637a4467bb8800e0334f167c/dab5a07eee48454d91c9366bbef71695.jpg?imwidth=1800"
        ]
    },
    {
        label: "Satin dress",
        brand: "Mango",
        value: "dress",
        badgeType: "maybeLater",
        icon: "/assets/dresses.svg",
        price: 79.99,
        images: [
            "https://shop.mango.com/assets/rcs/pics/static/T1/fotos/S/17021126_80.jpg?imwidth=960&imdensity=1&ts=1747847159439",
            "https://shop.mango.com/assets/rcs/pics/static/T1/fotos/outfit/S/17021126_80-99999999_01.jpg?imwidth=960&imdensity=1&ts=1747137934780",
            "https://shop.mango.com/assets/rcs/pics/static/T1/fotos/S/17021126_80_R.jpg?imwidth=960&imdensity=1&ts=1747137934780",
            "https://img01.ztat.net/article/spp-media-p1/ba2e439f637a4467bb8800e0334f167c/dab5a07eee48454d91c9366bbef71695.jpg?imwidth=1800https://shop.mango.com/assets/rcs/pics/static/T1/fotos/S/17021126_80_B.jpg?imwidth=640&imdensity=1&ts=1742913313126"
        ]
    },
    {
        label: "Midi Shirt",
        brand: "NA-KD",
        value: "dress",
        badgeType: "mustHave",
        icon: "/assets/dresses.svg",
        price: 55.95,
        images: [
            "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/cotton_maxi_shirt_dress-1100-011093-0005_3600.jpg",
            "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/cotton_maxi_shirt_dress-1100-011093-0005_3536.jpg",
            "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/cotton_maxi_shirt_dress-1100-011093-0005_3579.jpg",
            "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/cotton_maxi_shirt_dress-1100-011093-0005_19564_flatlay.jpg"
        ]
    },
    {
        label: "Tops",
        value: "tops",
        badgeType: "mustHave",
        icon: "/assets/tops.svg",
        images: [
            "/assets/dummy-img.png",
            "/assets/dummy-img.png",
        ]
    },
    {
        label: "Shoes",
        value: "shoes",
        badgeType: "mustHave",
        icon: "/assets/shoes.svg",
        images: [
            "/assets/dummy-img.png",
            "/assets/dummy-img.png",
        ]
    },
    {
        label: "Bottoms",
        value: "bottoms",
        badgeType: "mustHave",
        icon: "/assets/bottoms.svg",
        images: [
            "/assets/dummy-img.png",
            "/assets/dummy-img.png",
        ]
    },
    {
        label: "Outerwear",
        value: "outerwear",
        badgeType: "mustHave",
        icon: "/assets/outerwear.svg",
        images: [
            "/assets/dummy-img.png",
            "/assets/dummy-img.png",
        ]
    },
    {
        label: "Accessories",
        value: "accessories",
        badgeType: "mustHave",
        icon: "/assets/accessories.svg",
        images: [
            "/assets/dummy-img.png",
            "/assets/dummy-img.png",
        ]
    },
    {
        label: "Dresses",
        value: "dresses",
        icon: "/assets/dresses.svg",
        images: [
            "/assets/dummy-img.png",
            "/assets/dummy-img.png",
        ]
    },
    {
        label: "Swimwear",
        value: "swimwear",
        icon: "/assets/swimwear.svg",
        images: [
            "/assets/dummy-img.png",
            "/assets/dummy-img.png",
        ]
    },
    {
        label: "Activewear",
        value: "activewear",
        icon: "/assets/activewear.svg",
        images: [
            "/assets/dummy-img.png",
            "/assets/dummy-img.png",
        ]
    },
    {
        label: "Loungewear",
        value: "loungewear",
        icon: "/assets/loungewear.svg",
        images: [
            "/assets/dummy-img.png",
            "/assets/dummy-img.png",
        ]
    },
    {
        label: "Bags",
        value: "bags",
        icon: "/assets/bags.svg",
        images: [
            "/assets/dummy-img.png",
            "/assets/dummy-img.png",
        ]
    },
    {
        label: "Formalwear",
        value: "formalwear",
        icon: "/assets/formalwear.svg",
        images: [
            "/assets/dummy-img.png",
            "/assets/dummy-img.png",
        ]
    }
];

const mapItem = (item: any, idx: number) => ({
  id: item.label + idx,
  name: item.label,
  brand: item.brand || "Unknown",
  price: item.price,
  image: item.images?.[0] || "/assets/dummy-img.png",
  images: item.images || [item.images?.[0] || "/assets/dummy-img.png"], // Ensure images array is preserved
});

export const mockConvoItems: Thread[] = [
    {
        id: "summer-vacation-outfits",
        title: "Summer Vacation Outfits",
        subtitle: "You discussed 8 items · 3 saved to Wishlist",
        date: "Aug 15 · 4:32 PM",
        stats: "",
        closet: [ITEMS_OPTIONS[0], ITEMS_OPTIONS[1], ITEMS_OPTIONS[2]].map(mapItem),
        wishlist: [ITEMS_OPTIONS[0], ITEMS_OPTIONS[1]].map(mapItem),
        cart: [ITEMS_OPTIONS[2]].map(mapItem),
        disliked: [ITEMS_OPTIONS[3]].map(mapItem),
    },
    {
        id: "work-wardrobe",
        title: "Professional Work Wardrobe",
        subtitle: "You discussed 6 items · 2 saved to Wishlist",
        date: "Aug 14 · 10:12 AM",
        stats: "",
        closet: [ITEMS_OPTIONS[4], ITEMS_OPTIONS[15], ITEMS_OPTIONS[5]].map(mapItem),
        wishlist: [ITEMS_OPTIONS[4], ITEMS_OPTIONS[15]].map(mapItem),
        cart: [],
        disliked: [],
    },
    {
        id: "date-night-look",
        title: "Date Night Outfit Ideas",
        subtitle: "You discussed 7 items · 4 saved to Wishlist",
        date: "Aug 10 · 7:45 PM",
        stats: "",
        closet: [ITEMS_OPTIONS[6], ITEMS_OPTIONS[7], ITEMS_OPTIONS[14]].map(mapItem),
        wishlist: [ITEMS_OPTIONS[6], ITEMS_OPTIONS[14]].map(mapItem),
        cart: [ITEMS_OPTIONS[7]].map(mapItem),
        disliked: [],
    },
    {
        id: "spring-transitional",
        title: "Spring Transitional Pieces",
        subtitle: "You discussed 5 items · 2 saved to Wishlist",
        date: "Aug 8 · 2:20 PM",
        stats: "",
        closet: [ITEMS_OPTIONS[8], ITEMS_OPTIONS[9]].map(mapItem),
        wishlist: [ITEMS_OPTIONS[8]].map(mapItem),
        cart: [],
        disliked: [ITEMS_OPTIONS[9]].map(mapItem),
    },
    {
        id: "gym-activewear",
        title: "Gym & Activewear Essentials",
        subtitle: "You discussed 4 items · 3 saved to Wishlist",
        date: "Aug 5 · 9:00 AM",
        stats: "",
        closet: [ITEMS_OPTIONS[13], ITEMS_OPTIONS[7]].map(mapItem),
        wishlist: [ITEMS_OPTIONS[13]].map(mapItem),
        cart: [],
        disliked: [],
    },
    {
        id: "weekend-casual",
        title: "Weekend Casual Styling",
        subtitle: "You discussed 6 items · 2 saved to Wishlist",
        date: "Jul 30 · 3:15 PM",
        stats: "",
        closet: [ITEMS_OPTIONS[1], ITEMS_OPTIONS[5], ITEMS_OPTIONS[10]].map(mapItem),
        wishlist: [ITEMS_OPTIONS[1], ITEMS_OPTIONS[5]].map(mapItem),
        cart: [],
        disliked: [],
    },
    {
        id: "winter-layering",
        title: "Winter Layering Guide",
        subtitle: "You discussed 8 items · 4 saved to Wishlist",
        date: "Jul 25 · 6:00 PM",
        stats: "",
        closet: [ITEMS_OPTIONS[2], ITEMS_OPTIONS[8], ITEMS_OPTIONS[5]].map(mapItem),
        wishlist: [ITEMS_OPTIONS[8], ITEMS_OPTIONS[5]].map(mapItem),
        cart: [ITEMS_OPTIONS[2]].map(mapItem),
        disliked: [],
    },
    {
        id: "wedding-guest-attire",
        title: "Wedding Guest Attire",
        subtitle: "You discussed 9 items · 5 saved to Wishlist",
        date: "Jul 20 · 11:30 AM",
        stats: "",
        closet: [ITEMS_OPTIONS[0], ITEMS_OPTIONS[3], ITEMS_OPTIONS[14]].map(mapItem),
        wishlist: [ITEMS_OPTIONS[0], ITEMS_OPTIONS[3], ITEMS_OPTIONS[14]].map(mapItem),
        cart: [],
        disliked: [],
    },
    {
        id: "capsule-wardrobe",
        title: "Building a Capsule Wardrobe",
        subtitle: "You discussed 12 items · 6 saved to Wishlist",
        date: "Jul 18 · 9:45 AM",
        stats: "",
        closet: [ITEMS_OPTIONS[4], ITEMS_OPTIONS[5], ITEMS_OPTIONS[6], ITEMS_OPTIONS[8]].map(mapItem),
        wishlist: [ITEMS_OPTIONS[4], ITEMS_OPTIONS[6], ITEMS_OPTIONS[8]].map(mapItem),
        cart: [],
        disliked: [ITEMS_OPTIONS[5]].map(mapItem),
    },
    {
        id: "beach-vacation-style",
        title: "Beach Vacation Style Guide",
        subtitle: "You discussed 7 items · 3 saved to Wishlist",
        date: "Jul 15 · 8:20 PM",
        stats: "",
        closet: [ITEMS_OPTIONS[11], ITEMS_OPTIONS[12], ITEMS_OPTIONS[9]].map(mapItem),
        wishlist: [ITEMS_OPTIONS[11], ITEMS_OPTIONS[12]].map(mapItem),
        cart: [ITEMS_OPTIONS[9]].map(mapItem),
        disliked: [],
    },
];
