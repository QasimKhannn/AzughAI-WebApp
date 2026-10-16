from django.urls import path
from . import views

app_name = 'closet'

urlpatterns = [
    # Closet items
    path('items/', views.ClosetItemsView.as_view(), name='closet_items'),
    path('items/<str:item_id>/', views.ClosetItemView.as_view(), name='closet_item_detail'),
    
    # Closet item images
    path('items/<str:item_id>/images/', views.ClosetItemImagesView.as_view(), name='closet_item_images'),
    path('items/<str:item_id>/images/<str:image_id>/', views.ClosetItemImageView.as_view(), name='closet_item_image_detail'),
    
    # New endpoints for upload flows
    path('search-products/', views.SearchSimilarProductsView.as_view(), name='search_products'),
    path('items/with-product/', views.CreateClosetItemWithProductView.as_view(), name='create_with_product'),
    path('generate-fields/', views.GenerateClosetItemFieldsView.as_view(), name='generate_fields'),
    path('items/custom/', views.CreateCustomClosetItemView.as_view(), name='create_custom'),
]
