from django.contrib import admin
from .models import *


class ShopAdmin(admin.ModelAdmin):
    list_display = ('name', 'base_url')
    search_fields = ('name', 'base_url')


admin.site.register(Shop, ShopAdmin)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('shop', 'name', 'parent', 'url')
    search_fields = ('shop__name', 'name', 'parent__name', 'url')


admin.site.register(Category, CategoryAdmin)


class BrandAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


admin.site.register(Brand, BrandAdmin)


class ProductAdmin(admin.ModelAdmin):
    list_display = ('shop', 'category', 'brand', 'url', 'item_type', 'description', 'details', 'about',
                    'price', 'currency', 'color', 'availability', 'created_at', 'updated_at', 'is_embedded')
    search_fields = ('shop__name', 'category__name',
                     'brand__name', 'url', 'description', 'color')


admin.site.register(Product, ProductAdmin)


class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image', 'original_url', 'is_primary')
    search_fields = ('product__url', 'image', 'product__description')


admin.site.register(ProductImage, ProductImageAdmin)


class CategoriesScrapingJobAdmin(admin.ModelAdmin):
    list_display = ('shop', 'status', 'start_time', 'end_time',
                    'total_categories_scraped', 'total_new_categories')
    search_fields = ('shop__name', 'status')


admin.site.register(CategoriesScrapingJob, CategoriesScrapingJobAdmin)


class ProductsScrapingJobAdmin(admin.ModelAdmin):
    list_display = ('shop', 'category', 'status', 'start_time',
                    'end_time', 'total_products_scraped', 'total_new_products')
    search_fields = ('shop__name', 'category__name', 'status')


admin.site.register(ProductsScrapingJob, ProductsScrapingJobAdmin)


class ImagesDownloadJobAdmin(admin.ModelAdmin):
    list_display = ('shop', 'category', 'status', 'start_time',
                    'end_time', 'total_images_attempted', 'total_images_downloaded')
    search_fields = ('shop', 'status', 'category')


admin.site.register(ImagesDownloadJob, ImagesDownloadJobAdmin)
