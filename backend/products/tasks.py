from celery import shared_task
from libs.fashionscrapers import *
#from libs.fashp_embedder import default_embedder
from django.utils.module_loading import import_string
from .models import Shop, Category, CategoriesScrapingJob, ProductsScrapingJob, ImagesDownloadJob, ProductImage, Product
from .utils import save_categories_table, save_products_table
from django.conf import settings
import logging
from time import sleep
import requests
from django.core.files.base import ContentFile
from .serializers import ProductSerializer
from vector_db.service import VectorService

MAX_RETRIES = 3
print(f"Scraping in test mode: {settings.TEST_MODE}")


@shared_task(bind=True, max_retries=MAX_RETRIES)
def scrape_shop_categories(self, shop_name: str):
    print(shop_name)
    # Initialize the scraper
    if shop_name == "asos":
        scraper = AsosScraper()
    elif shop_name == "revolve":
        scraper = RevolveScraper()
    elif shop_name == "urban outfitters":
        scraper = UrbanOutfittersScraper()
    elif shop_name == "farfetch":
        scraper = FarfetchScraper()
    else:
        raise ValueError(f"Scraper for shop '{shop_name}' not found")
    shop = Shop.objects.get(name=shop_name)
    job = CategoriesScrapingJob.objects.create(shop=shop)
    # Scrape the categories
    try:
        categories_table = scraper.collect_categories_urls()
        new_categories_count = save_categories_table(categories_table, shop)
        job.mark_completed(len(categories_table), new_categories_count)
    except Exception as e:
        job.mark_failed([str(e)])
        self.retry(exc=e, args=[shop_name], countdown=20)
    # Log the categories instead of printing them
    # logging.info(f"Scraped categories for shop '{shop_name}': {categories['men']['clothing']}")
    return


@shared_task
def scrape_products(shop_name: str, category_name: str, parent_path: tuple = ()):
    # Ensure parent_path is a tuple
    if not isinstance(parent_path, tuple):
        parent_path = tuple(parent_path)
    print(f"Parent path: {parent_path}")
    if shop_name == "asos":
        scraper = AsosScraper(settings.CHECKPOINTS_DIR,
                              test=settings.TEST_MODE)
    elif shop_name == "revolve":
        scraper = RevolveScraper(
            settings.CHECKPOINTS_DIR, test=settings.TEST_MODE)
    elif shop_name == "urban outfitters":
        scraper = UrbanOutfittersScraper(
            settings.CHECKPOINTS_DIR, test=settings.TEST_MODE)
    elif shop_name == "farfetch":
        scraper = FarfetchScraper(
            settings.CHECKPOINTS_DIR, test=settings.TEST_MODE)
    else:
        raise ValueError(f"Scraper for shop '{shop_name}' not found")
    shop = Shop.objects.get(name=shop_name)
    # find the category
    if len(parent_path) == 0:
        category = Category.objects.get(name=category_name, shop=shop)
    elif len(parent_path) == 1:
        category = Category.objects.get(
            name=category_name, parent__name=parent_path[0], shop=shop)
    elif len(parent_path) == 2:
        category = Category.objects.get(
            name=category_name, parent__name=parent_path[1], parent__parent__name=parent_path[0], shop=shop)
    else:
        raise ValueError("Parent category path is too long")
    job = ProductsScrapingJob.objects.create(shop=shop, category=category)
    scraping_url = category.url
    # Scrape the products
    retry = 0
    products = None
    while retry < MAX_RETRIES and products is None:
        if retry == 0:
            print(f"Scraping products for category '{category_name}'")
            if shop_name == "farfetch":
                products = scraper.collect_category_products(
                    category_name, parent_path[1], parent_path[0])
            else:
                products = scraper.collect_category_products(url=scraping_url)
        elif retry == 1:
            sleep(5)
            print(
                f"Retrying to scrape products for category '{category_name}'")
            scraper.load_checkpoint()
            products = scraper.restart_from_checkpoint(skip_product=False)
        else:
            sleep(5)
            print(
                f"Retrying to scrape products for category '{category_name}' without saving the product")
            scraper.load_checkpoint()
            products = scraper.restart_from_checkpoint(skip_product=True)
        retry += 1
    if products is not None:
        print(
            f"Scraped {len(products)} products for category '{category_name}'")
        print(products[:1])
        # table and clean the products
        category_path = parent_path + (category_name,)
        tabled_products = scraper.table_products(products, category_path)
        new_products_count = save_products_table(
            tabled_products, shop, category)
        job.mark_completed(len(tabled_products), new_products_count)
    else:
        job.mark_failed(["Failed to scrape products"])
        print(f"Failed to scrape products for category '{category_name}'")
    return


@shared_task
def download_images(shop_name: str, category_name: str, parent_path: tuple = ()):
    # ensure parent_path is a tuple
    if not isinstance(parent_path, tuple):
        parent_path = tuple(parent_path)
    if shop_name == "asos":
        url_composer = compose_asos_image_resolution_url
    elif shop_name in ["revolve", "urban outfitters", "farfetch"]:
        # make dummy composer that returns the same url
        def url_composer(x): return x
    else:
        raise ValueError(f"The shop '{shop_name}' is not supported")
    shop = Shop.objects.get(name=shop_name)
    # find the category
    if len(parent_path) == 0:
        category = Category.objects.get(name=category_name, shop=shop)
    elif len(parent_path) == 1:
        category = Category.objects.get(
            name=category_name, parent__name=parent_path[0], shop=shop)
    elif len(parent_path) == 2:
        category = Category.objects.get(
            name=category_name, parent__name=parent_path[1], parent__parent__name=parent_path[0], shop=shop)
    else:
        raise ValueError("Parent category path is too long")
    job = ImagesDownloadJob.objects.create(shop=shop, category=category)
    images = ProductImage.objects.prefetch_related(
        'product').filter(product__category=category, image='')
    total_images_attempted = len(images)
    total_images_downloaded = 0
    session = requests.Session()
    for image in images:
        image_url = url_composer(image.original_url)
        filename = f"{image.product.shop_product_id}.jpg"
        response = session.get(image_url)
        if response.status_code == 200:
            image.image.save(filename, ContentFile(response.content))
            total_images_downloaded += 1
        else:
            logging.warning(f"Failed to download image '{image_url}'")
    job.mark_completed(total_images_attempted, total_images_downloaded)
    return


@shared_task(bind=True, max_retries=MAX_RETRIES)
def embed_products(self, skip_first: bool = False):
    service = VectorService("products", "product_embeddings")
    products = Product.objects.filter(is_embedded=False)
    if len(products) == 0:
        logging.info("No products to embed")
        return
    default_embedder = import_string(
                "libs.fashp_embedder.default_embedder")
    # if settings.TEST_MODE:
    #     products = products[:1]
    if skip_first:
        products = products[1:]
    for product in products:
        product_serializer = ProductSerializer(product)
        product_data = product_serializer.data
        try:
            embedding = default_embedder(product_data)
            product_id = int(product_data['id'])
            logging.info(f"Embedding for product {product_id}: {embedding.shape}")
            service.upsert(product_id, embedding)
            product.is_embedded = True
            product.save()
        except Exception as e:
            logging.error(f"Failed to embed product {product_id}: {str(e)}")
            self.retry(exc=e, args=[True], countdown=10)
    res = service.get_summary()
    logging.info(f"Summary of product embeddings: {res}")
    return
        