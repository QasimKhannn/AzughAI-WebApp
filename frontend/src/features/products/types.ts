export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONValue[] | { [key: string]: JSONValue };

export interface Shop {
  id: number;
  name: string;
  base_url: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  url?: string | null;
  shop: Shop;
  parent?: Category | null;
}

export interface ProductImage {
  id: string;
  image: string | null;
  original_url: string;
  is_primary: boolean;
}

export interface Product {
  id: string;
  shop: Shop;
  category: Category;
  brand: Brand;
  images: ProductImage[];
  shop_product_id?: string | null;
  url: string;
  item_type?: string | null;
  description: string;
  details: JSONValue;
  about?: string | null;
  price?: string | null;
  currency: string;
  color?: string | null;
  availability?: JSONValue | null;
  created_at: string;
  updated_at: string;
  is_embedded: boolean;
}



export const mockProducts: Product[] = [
  {
    id: "1",
    shop: {
      id: 1,
      name: "NA-KD",
      base_url: "https://www.na-kd.com"
    },
    category: {
      id: 1,
      name: "Dresses",
      url: "https://www.na-kd.com/dresses",
      shop: {
        id: 1,
        name: "NA-KD",
        base_url: "https://www.na-kd.com"
      },
      parent: null
    },
    brand: {
      id: 1,
      name: "NA-KD"
    },
    images: [
      {
        id: "1",
        image: null,
        original_url: "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/ruffle_volume_kaftan_1100-011540-0002_social.jpg",
        is_primary: true
      },
      {
        id: "2",
        image: null,
        original_url: "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/ruffle_volume_kaftan_1100-011540-0002_campaign.jpg",
        is_primary: false
      },
      {
        id: "3",
        image: null,
        original_url: "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/ruffle_volume_kaftan-1100-011540-0002_0013.jpg",
        is_primary: false
      },
      {
        id: "4",
        image: null,
        original_url: "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/ruffle_volume_kaftan-1100-011540-0002_0010.jpg",
        is_primary: false
      }
    ],
    shop_product_id: "1100-011540-0002",
    url: "https://www.na-kd.com/en/na-kd/ruffle-volume-kaftan",
    item_type: "dress",
    description: "Volume Kaftan",
    details: [
      { key: "Material", value: "100% Cotton" },
      { key: "Style", value: "Kaftan" },
      { key: "Fit", value: "Oversized" }
    ],
    about: "Elegant volume kaftan with ruffle details, perfect for summer occasions.",
    price: "65.95",
    currency: "EUR",
    color: "Beige",
    availability: { in_stock: true, sizes: ["XS", "S", "M", "L", "XL"] },
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-01-15T10:00:00Z",
    is_embedded: true
  },
  {
    id: "2",
    shop: {
      id: 2,
      name: "ASOS",
      base_url: "https://www.asos.com"
    },
    category: {
      id: 2,
      name: "Midi Dresses",
      url: "https://www.asos.com/women/dresses/midi-dresses",
      shop: {
        id: 2,
        name: "ASOS",
        base_url: "https://www.asos.com"
      },
      parent: {
        id: 3,
        name: "Dresses",
        url: "https://www.asos.com/women/dresses",
        shop: {
          id: 2,
          name: "ASOS",
          base_url: "https://www.asos.com"
        },
        parent: null
      }
    },
    brand: {
      id: 2,
      name: "ASOS DESIGN"
    },
    images: [
      {
        id: "5",
        image: null,
        original_url: "https://images.asos-media.com/products/asos-design-wickel-midikleid-in-dunkelbraun-im-kimono-stil/207875660-1-darkbrown?$n_1280w$&wid=1125&fit=constrain",
        is_primary: true
      },
      {
        id: "6",
        image: null,
        original_url: "https://images.asos-media.com/products/asos-design-wickel-midikleid-in-dunkelbraun-im-kimono-stil/207875660-2?$n_1280w$&wid=1125&fit=constrain",
        is_primary: false
      },
      {
        id: "7",
        image: null,
        original_url: "https://images.asos-media.com/products/asos-design-wickel-midikleid-in-dunkelbraun-im-kimono-stil/207875660-3?$n_1280w$&wid=1125&fit=constrain",
        is_primary: false
      }
    ],
    shop_product_id: "207875660",
    url: "https://www.asos.com/asos-design/asos-design-kimono-wrap-midi-dress/prd/207875660",
    item_type: "dress",
    description: "Kimono wrap",
    details: [
      { key: "Material", value: "Polyester blend" },
      { key: "Style", value: "Wrap" },
      { key: "Length", value: "Midi" }
    ],
    about: "Kimono-style wrap midi dress in dark brown, perfect for elegant occasions.",
    price: "64.99",
    currency: "EUR",
    color: "Dark Brown",
    availability: { in_stock: true, sizes: ["6", "8", "10", "12", "14", "16"] },
    created_at: "2025-01-14T09:30:00Z",
    updated_at: "2025-01-14T09:30:00Z",
    is_embedded: true
  },
  {
    id: "3",
    shop: {
      id: 3,
      name: "Zalando",
      base_url: "https://www.zalando.de"
    },
    category: {
      id: 4,
      name: "Abayas",
      url: "https://www.zalando.de/bekleidung-damen-abaya",
      shop: {
        id: 3,
        name: "Zalando",
        base_url: "https://www.zalando.de"
      },
      parent: null
    },
    brand: {
      id: 3,
      name: "Elara"
    },
    images: [
      {
        id: "8",
        image: null,
        original_url: "https://img01.ztat.net/article/spp-media-p1/831ea40bb89a4fd9ba82a5a397a5bc26/d825e82a914148a897e563820189a3f3.jpg?imwidth=1800",
        is_primary: true
      },
      {
        id: "9",
        image: null,
        original_url: "https://img01.ztat.net/article/spp-media-p1/f62969795e1a4c66b03cac9057a3e6d1/3a3c2cb3cb4d4c869cb04daf7c1f802d.jpg?imwidth=1800",
        is_primary: false
      },
      {
        id: "10",
        image: null,
        original_url: "https://img01.ztat.net/article/spp-media-p1/0811e2e3a2cc4c2680b472dae56859ee/040fd85a18f5414c840c996d0a137be6.jpg?imwidth=1800",
        is_primary: false
      },
      {
        id: "11",
        image: null,
        original_url: "https://img01.ztat.net/article/spp-media-p1/ba2e439f637a4467bb8800e0334f167c/dab5a07eee48454d91c9366bbef71695.jpg?imwidth=1800",
        is_primary: false
      }
    ],
    shop_product_id: "EL121C00H-Q11",
    url: "https://www.zalando.de/elara-abaya",
    item_type: "dress",
    description: "ABAYA",
    details: [
      { key: "Material", value: "Polyester" },
      { key: "Style", value: "Traditional" },
      { key: "Occasion", value: "Formal" }
    ],
    about: "Traditional abaya in elegant design, suitable for formal occasions.",
    price: "40.49",
    currency: "EUR",
    color: "Black",
    availability: { in_stock: true, sizes: ["S", "M", "L"] },
    created_at: "2025-01-13T14:20:00Z",
    updated_at: "2025-01-13T14:20:00Z",
    is_embedded: true
  },
  {
    id: "4",
    shop: {
      id: 4,
      name: "Mango",
      base_url: "https://shop.mango.com"
    },
    category: {
      id: 5,
      name: "Satin Dresses",
      url: "https://shop.mango.com/dresses/satin",
      shop: {
        id: 4,
        name: "Mango",
        base_url: "https://shop.mango.com"
      },
      parent: {
        id: 6,
        name: "Dresses",
        url: "https://shop.mango.com/dresses",
        shop: {
          id: 4,
          name: "Mango",
          base_url: "https://shop.mango.com"
        },
        parent: null
      }
    },
    brand: {
      id: 4,
      name: "Mango"
    },
    images: [
      {
        id: "12",
        image: null,
        original_url: "https://shop.mango.com/assets/rcs/pics/static/T1/fotos/S/17021126_80.jpg?imwidth=960&imdensity=1&ts=1747847159439",
        is_primary: true
      },
      {
        id: "13",
        image: null,
        original_url: "https://shop.mango.com/assets/rcs/pics/static/T1/fotos/outfit/S/17021126_80-99999999_01.jpg?imwidth=960&imdensity=1&ts=1747137934780",
        is_primary: false
      },
      {
        id: "14",
        image: null,
        original_url: "https://shop.mango.com/assets/rcs/pics/static/T1/fotos/S/17021126_80_R.jpg?imwidth=960&imdensity=1&ts=1747137934780",
        is_primary: false
      }
    ],
    shop_product_id: "17021126_80",
    url: "https://shop.mango.com/satin-dress-17021126.html",
    item_type: "dress",
    description: "Satin dress",
    details: [
      { key: "Material", value: "Satin" },
      { key: "Style", value: "Elegant" },
      { key: "Fit", value: "Regular" }
    ],
    about: "Luxurious satin dress with elegant draping, perfect for evening events.",
    price: "79.99",
    currency: "EUR",
    color: "Champagne",
    availability: { in_stock: true, sizes: ["XS", "S", "M", "L", "XL"] },
    created_at: "2025-01-12T11:45:00Z",
    updated_at: "2025-01-12T11:45:00Z",
    is_embedded: false
  },
  {
    id: "5",
    shop: {
      id: 1,
      name: "NA-KD",
      base_url: "https://www.na-kd.com"
    },
    category: {
      id: 7,
      name: "Maxi Dresses",
      url: "https://www.na-kd.com/maxi-dresses",
      shop: {
        id: 1,
        name: "NA-KD",
        base_url: "https://www.na-kd.com"
      },
      parent: {
        id: 1,
        name: "Dresses",
        url: "https://www.na-kd.com/dresses",
        shop: {
          id: 1,
          name: "NA-KD",
          base_url: "https://www.na-kd.com"
        },
        parent: null
      }
    },
    brand: {
      id: 1,
      name: "NA-KD"
    },
    images: [
      {
        id: "15",
        image: null,
        original_url: "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/cotton_maxi_shirt_dress-1100-011093-0005_3600.jpg",
        is_primary: true
      },
      {
        id: "16",
        image: null,
        original_url: "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/cotton_maxi_shirt_dress-1100-011093-0005_3536.jpg",
        is_primary: false
      },
      {
        id: "17",
        image: null,
        original_url: "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/cotton_maxi_shirt_dress-1100-011093-0005_3579.jpg",
        is_primary: false
      },
      {
        id: "18",
        image: null,
        original_url: "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/cotton_maxi_shirt_dress-1100-011093-0005_19564_flatlay.jpg",
        is_primary: false
      }
    ],
    shop_product_id: "1100-011093-0005",
    url: "https://www.na-kd.com/en/na-kd/cotton-maxi-shirt-dress",
    item_type: "dress",
    description: "Midi Shirt",
    details: [
      { key: "Material", value: "100% Cotton" },
      { key: "Style", value: "Shirt Dress" },
      { key: "Length", value: "Maxi" }
    ],
    about: "Classic cotton maxi shirt dress with button-down front, versatile for any occasion.",
    price: "55.95",
    currency: "EUR",
    color: "White",
    availability: { in_stock: true, sizes: ["XS", "S", "M", "L"] },
    created_at: "2025-01-11T16:10:00Z",
    updated_at: "2025-01-11T16:10:00Z",
    is_embedded: true
  }
];