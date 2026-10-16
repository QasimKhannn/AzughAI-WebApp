import { link } from "fs";

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
        ],
        link: "https://www.na-kd.com/en/products/ruffle-volume-kaftan-black-1100-011540-0002?srsltid=AfmBOorrz6uZKQNpeJ_cAclsEIplwOR7V4xWYz3pwHNu_x_bfP-QwmQP"
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
        ],
        link: "https://www.asos.com/de/asos-design/asos-design-wickel-midikleid-in-dunkelbraun-im-kimono-stil/prd/207875660?clr=dunkelbraun&colourWayId=221118992&cid=2633"
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
        ],
        link: "https://www.zalando.de/elara-abaya-black-el221c09h-q11.html"
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
        ],
        link: "https://shop.mango.com/de/damen/kleider-sommer/satin-kleid_17021126.html?c=80"
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
        ],
        link: "https://www.na-kd.com/en/products/cotton-maxi-shirt-dress-white-1100-011093-0005?srsltid=AfmBOorrz6uZKQNpeJ_cAclsEIplwOR7V4xWYz3pwHNu_x_bfP-QwmQP"
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
