from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from django.utils import timezone
import logging
from django.core.files.storage import default_storage
from vector_db.service import VectorService
#from libs.fashp_embedder import default_embedder
from django.utils.module_loading import import_string

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')


class Shop(models.Model):
    name = models.CharField(max_length=255, unique=True)
    base_url = models.URLField()

    def __str__(self):
        return self.name


class Category(MPTTModel):
    shop = models.ForeignKey(
        Shop, on_delete=models.CASCADE, related_name="categories")
    name = models.CharField(max_length=255)
    parent = TreeForeignKey('self', on_delete=models.CASCADE,
                            null=True, blank=True, related_name='children')
    url = models.URLField(max_length=255, null=True, blank=True)

    class MPTTMeta:
        order_insertion_by = ['name']

    class Meta:
        verbose_name_plural = "Categories"
        unique_together = ('shop', 'name', 'parent')

    def __str__(self):
        if self.parent:
            return f"{self.shop.name} - {self.parent.name} - {self.name}"
        else:
            return f"{self.shop.name} - {self.name}"

    def save(self, *args, **kwargs):
        if self.parent == None:
            # make sure this element is not a duplicate
            if Category.objects.filter(shop=self.shop, name=self.name, parent=None).exists():
                print(
                    f"Category {self.name} already exists for shop {self.shop.name}")
                return

        return super(Category, self).save(*args, **kwargs)


class Brand(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)

    # No global uniqueness constraint
    shop_product_id = models.CharField(max_length=255, null=True)

    url = models.URLField(unique=True)
    item_type = models.CharField(max_length=255, null=True)
    description = models.CharField(max_length=255)
    details = models.JSONField(default=list)  # Added details attribute
    about = models.TextField(null=True, blank=True)
    price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default="EUR")
    color = models.CharField(max_length=100, null=True, blank=True)
    availability = models.JSONField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_embedded = models.BooleanField(default=False)

    class Meta:
        # Ensures uniqueness within each shop
        unique_together = ('shop', 'shop_product_id')

    def __str__(self):
        return f"{self.shop.name} - {self.brand.name} {self.category.name} - {self.color}"

    def save(self, *args, **kwargs):
        # check if product has been updated, if so, update the embedding
        if self.pk and self.is_embedded:
            old_instance = Product.objects.get(pk=self.pk)
            if any(
                getattr(old_instance, field) != getattr(self, field)
                for field in ['shop', 'category', 'brand', 'description', 'details', 'about', 'color', 'price', 'currency']
            ):
                # update the emebedding
                logging.warning(
                    f"Product {self.id} updated, embedding will be updated")
                service = VectorService("products", "product_embeddings")
                # first serialize the product
                ProductSerializer = import_string(
                    "products.serializers.ProductSerializer")
                product_serializer = ProductSerializer(self)
                product_data = product_serializer.data
                default_embedder = import_string(
                    "libs.fashp_embedder.default_embedder")
                try:
                    embedding = default_embedder(product_data)
                    product_id = int(product_data['id'])
                    logging.warning(
                        f"Embedding for product {product_id}: {embedding.shape}")
                    service.upsert(product_id, embedding)
                except Exception as e:
                    logging.error(
                        f"Failed to embed product {self.pk}: {str(e)}")
                    self.is_embedded = False

        return super(Product, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # delete the embedding
        service = VectorService("products", "product_embeddings")
        logging.warning(f"Deleting embedding for product {self.id}")
        deleted = service.delete(self.pk)
        logging.warning(f"Deleted {deleted} embeddings")
        return super(Product, self).delete(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(
        upload_to='products/images/', null=True, blank=True)
    original_url = models.URLField()
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.product.shop.name} - {self.product.brand.name} {self.product.category.name} - {self.product.color}"

    def delete_image(self,):
        # check if image still stored in the file system
        if self.image:
            # delete from file system
            if default_storage.exists(self.image.path):
                default_storage.delete(self.image.path)
                logging.info(f"Image {self.image.path} deleted")
            else:
                logging.info(f"Image {self.image.path} not found")
        else:
            logging.info(f"Image {self.image} not found")

    def delete(self, *args, **kwargs):
        # delete image from file system
        self.delete_image()
        # update the primary image if necessary
        if self.is_primary == True:
            first_image = ProductImage.objects.filter(
                product=self.product, is_primary=False).exclude(pk=self.pk).first()
            if first_image:
                first_image.is_primary = True
                first_image.save()
            else:
                logging.info(
                    "No primary image found to replace the deleted one")
        # if products has been emebedded, set is_embedded to False
        if self.product.is_embedded:
            self.product.is_embedded = False
            self.product.save()
            logging.warning(
                f"Product {self.product.id} embedding reset")
        return super(ProductImage, self).delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        # check if the image is different from the original
        if self.pk:
            old_instance = ProductImage.objects.get(pk=self.pk)
            if self.image:
                if old_instance and old_instance.image:
                    old_image_name = old_instance.image.name.split("/")[-1]
                    new_image_name = self.image.name.split("/")[-1]
                    if old_image_name != new_image_name:
                        # delete the old image
                        old_instance.delete_image()
                        logging.info(
                            f"Image {old_instance.image} updated with {self.image}")
                        # reset embedding
                        if self.product.is_embedded:
                            self.product.is_embedded = False
                            self.product.save()
                            logging.warning(
                                f"Product {self.product.id} embedding reset")
                    else:
                        self.image = old_instance.image
                        logging.info("Image is the same as the original")
                else:
                    logging.info("No old image found")
            # if setting to primary, unset all other images
            if self.is_primary == True and old_instance and old_instance.is_primary != self.is_primary:
                ProductImage.objects.filter(product=self.product, is_primary=True).exclude(
                    pk=self.pk).update(is_primary=False)
                # reset embedding
                if self.product.is_embedded:
                    self.product.is_embedded = False
                    self.product.save()
                    logging.warning(
                        f"Product {self.product.id} embedding reset")
            elif self.is_primary == False and old_instance and old_instance.is_primary != self.is_primary:
                # set the first image as primary
                first_image = ProductImage.objects.filter(
                    product=self.product).exclude(pk=self.pk).first()
                if first_image is not None:
                    first_image.is_primary = True
                    first_image.save()
                    logging.info(f"Primary image set to {first_image.image}")
                    # reset embedding
                    if self.product.is_embedded:
                        self.product.is_embedded = False
                        self.product.save()
                        logging.warning(
                            f"Product {self.product.id} embedding reset")
                else:
                    logging.info("Must have at least one primary image")
                    self.is_primary = True
        else:
            # the primary image is set in the scraper script
            logging.info("New image")
        return super(ProductImage, self).save(*args, **kwargs)


class CategoriesScrapingJob(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("running", "Running"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    shop = models.ForeignKey(
        Shop, on_delete=models.CASCADE, related_name="categories_scraping_jobs")

    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default="pending")

    total_categories_scraped = models.IntegerField(default=0)
    total_new_categories = models.IntegerField(default=0)
    error_log = models.JSONField(null=True, blank=True)  # Store errors if any

    def mark_completed(self, total_scraped, total_new):
        self.total_categories_scraped = total_scraped
        self.total_new_categories = total_new
        self.status = "completed"
        self.end_time = timezone.now()
        self.save()

    def mark_failed(self, errors):
        self.status = "failed"
        self.error_log = errors
        self.end_time = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.shop.name} - Categories Scraping ({self.status}) - {self.start_time}"


class ProductsScrapingJob(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("running", "Running"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    shop = models.ForeignKey(
        Shop, on_delete=models.CASCADE, related_name="products_scraping_jobs")
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, null=True, blank=True, related_name="scraping_jobs")

    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default="pending")

    total_products_scraped = models.IntegerField(default=0)
    total_new_products = models.IntegerField(default=0)
    error_log = models.JSONField(null=True, blank=True)  # Store errors if any

    def mark_completed(self, total_scraped, total_new):
        self.total_products_scraped = total_scraped
        self.total_new_products = total_new
        self.status = "completed"
        self.end_time = timezone.now()
        self.save()

    def mark_failed(self, errors):
        self.status = "failed"
        self.error_log = errors
        self.end_time = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.shop.name} - {self.category.name if self.category else 'All'} ({self.status}) - {self.start_time}"


class ImagesDownloadJob(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("running", "Running"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    shop = models.ForeignKey(
        Shop, on_delete=models.CASCADE, related_name="images_download_jobs")
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, null=True, blank=True, related_name="images_download_jobs")

    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default="pending")

    total_images_attempted = models.IntegerField(default=0)
    total_images_downloaded = models.IntegerField(default=0)
    error_log = models.JSONField(null=True, blank=True)  # Store errors if any

    def mark_completed(self, total_attempted, total_downloaded):
        self.total_images_attempted = total_attempted
        self.total_images_downloaded = total_downloaded
        self.status = "completed"
        self.end_time = timezone.now()
        self.save()

    def mark_failed(self, errors):
        self.status = "failed"
        self.error_log = errors
        self.end_time = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.shop.name} - {self.category.name} ({self.status}) - {self.start_time}"
