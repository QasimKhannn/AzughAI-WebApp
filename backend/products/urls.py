from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    path('scrape-categories/', views.scrape_categories, name='scrape_categories'),
    path('scrape-products/', views.scrape_shop_products, name='scrape_products'),
    path('download-images/', views.download_shop_category_images, name='download_images'),
    path('products-sample/', views.get_products_sample, name='products_sample'),
    path('embed-products/', views.get_embedding, name='embed_products'),
]