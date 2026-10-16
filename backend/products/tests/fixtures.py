import pytest
from products.models import Shop, Category


@pytest.fixture
def setup_shops(db):
    shops = ["asos", "revolve", "urban outfitters", "farfetch"]
    for shop_name in shops:
        Shop.objects.create(
            name=shop_name, base_url=f"https://{shop_name}.com")


@pytest.fixture
def setup_categories(db, setup_shops):
    categories = [
        {"shop": "asos",
         "name": "jeans",
         "url": "https://www.asos.com/men/jeans/cat/?cid=4208#nlid=mw|clothing|shop+by+product|jeans",
         "parent_path": ("men", "clothing")},
        {"shop": "revolve",
         "name": "denim",
         "url": "https://www.revolve.com/mens/denim/br/95085c/?navsrc=subClothing",
         "parent_path": ("men", "clothing")},
        {"shop": "urban outfitters",
         "name": "jeans",
         "url": "https://www.urbanoutfitters.com/mens-jeans",
         "parent_path": ("men",)},
        {"shop": "farfetch",
         "name": "denim",
         "url": "https://www.farfetch.com/uk/shopping/men/denim-2/items.aspx",
         "parent_path": ("men", "clothing")},
    ]
    for category in categories:
        shop = Shop.objects.get(name=category["shop"])
        # compose parents path category
        parent_category = None
        for parent_name in category["parent_path"]:
            if parent_category is None:
                parent_category = Category.objects.create(name=parent_name, shop=shop)
            else:
                parent_category = Category.objects.create(name=parent_name, parent=parent_category, shop=shop)
        # create category
        Category.objects.create(
            name=category["name"], shop=shop, parent=parent_category, url=category["url"])
