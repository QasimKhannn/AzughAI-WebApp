from ..models import Category, Shop, Product, Brand, ProductImage
import pandas as pd


def save_categories_table(categories_table: pd.DataFrame, shop: Shop):
    # Save the categories to the database
    new_categories_count = 0
    for _, row in categories_table.iterrows():
        # check if it has a parent category
        parent_path = row["parent"]
        if len(parent_path) == 0:
            parent = None
        elif len(parent_path) == 1:
            parent = Category.objects.get(
                name=parent_path[0], shop=shop)
        elif len(parent_path) == 2:
            parent = Category.objects.get(
                name=parent_path[1], parent__name=parent_path[0], shop=shop)
        else:
            raise ValueError("Parent category path is too long")
        # Save the category
        category, created = Category.objects.get_or_create(
            name=row["name"], shop=shop, parent=parent)
        # try to save if it doesn't exist
        if created:
            print(f"New category: {category}")
            new_categories_count += 1
            category.url = row["url"]
            category.save()
        elif category.url != row["url"]:  # update the url if it has changed
            print(
                f"Category {category} url has changed from {category.url} to {row['url']}")
            category.url = row["url"]
            category.save()
    return new_categories_count


def save_products_table(products_table: pd.DataFrame, shop: Shop, category: Category):
    # Save the products to the database
    new_products_count = 0
    for _, row in products_table.iterrows():
        # Save the brand
        brand, _ = Brand.objects.get_or_create(name=row["brand"])
        # Save the product
        product, created = Product.objects.get_or_create(
            shop=shop, category=category, brand=brand, shop_product_id=row["shop_product_id"],
            )
        # try to save if it doesn't exist
        if created:
            print(f"New product: {product}")
            # update the product fields
            product.url = row["url"]
            product.description = row["description"]
            product.details = row["details"]
            product.about = row["about"]
            product.price = row["price"]
            product.currency = row["currency"]
            product.color = row["color"]
            product.availability = row["availability"]
            product.item_type = row["type"]
            product.save()
            new_products_count += 1
        # update the shop_product_id if it has changed
        elif product.url != row["url"]:
            print(
                f"Product {product} url has changed from {product.url} to {row['url']}")
            product.url = row["url"]
            # update the product fields if they have changed
            product.description = row["description"] if product.description != row["description"] else product.description
            product.details = row["details"] if product.details != row["details"] else product.details
            product.about = row["about"] if product.about != row["about"] else product.about
            product.price = row["price"] if product.price != row["price"] else product.price
            product.currency = row["currency"] if product.currency != row["currency"] else product.currency
            product.color = row["color"] if product.color != row["color"] else product.color
            product.availability = row["availability"] if product.availability != row["availability"] else product.availability
            product.item_type = row["type"] if product.item_type != row["type"] else product.item_type
            product.save()
        # save the product images if they exist and are new
        if "media" in row and len(row["media"]) > 0:
            for i in range(len(row["media"])):
                image_url = row["media"][i]
                image, created = ProductImage.objects.get_or_create(
                    product=product, original_url=image_url)
                if created:
                    print(f"New product image: {image}")
                    # mark as primary if it's the first image
                    if i == 0:
                        image.is_primary = True
                        image.save()
    return new_products_count
