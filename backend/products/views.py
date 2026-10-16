from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .tasks import scrape_shop_categories, scrape_products, download_images, embed_products
from .models import Product
from .serializers import ProductSerializer
from vector_db.service import VectorService

# Create your views here.
@api_view(['POST'])
def scrape_categories(request):
    shop_name = request.data.get("shop_name")
    if not shop_name:
        return Response({"error": "shop_name is required"}, status=400)
    scrape_shop_categories.apply((shop_name,), countdown=10)
    return Response({"message": "Categories scraping job started"})

@api_view(['POST'])
def scrape_shop_products(request):
    shop_name = request.data.get("shop_name")
    category_name = request.data.get("category_name")
    parent_path = request.data.get("parent_path", [])
    # make the parent path a tuple
    parent_path = tuple(parent_path)
    if not shop_name or not category_name:
        return Response({"error": "shop_name and category_name are required"}, status=400)
    #print(f"Parent path: {parent_path}")
    #scrape_products.apply_async((shop_name, category_name, parent_path), countdown=10)
    scrape_products.apply(("asos", "jeans", ("men", "clothing")))
    scrape_products.apply(("urban outfitters", "jeans", ("men",)))
    scrape_products.apply(("revolve", "denim", ("men", "clothing")))
    #scrape_products.apply(("farfetch", "denim", ("men", "clothing")))
    return Response({"message": "Products scraping job started"})

@api_view(['POST'])
def download_shop_category_images(request):
    shop_name = request.data.get("shop_name")
    category_name = request.data.get("category_name")
    parent_path = request.data.get("parent_path", [])
    # make the parent path a tuple
    # parent_path = tuple(parent_path)
    # if not shop_name or not category_name:
    #     return Response({"error": "shop_name and category_name are required"}, status=400)
    #print(f"Parent path: {parent_path}")
    #download_images.apply_async((shop_name, category_name, parent_path), countdown=10)
    download_images.apply(("asos", "jeans", ("men", "clothing")))
    download_images.apply(("urban outfitters", "jeans", ("men",)))
    download_images.apply(("revolve", "denim", ("men", "clothing")))
    #download_images.apply(("farfetch", "denim", ("men", "clothing")))
    return Response({"message": "Images download job started"})

@api_view(['GET'])
def get_products_sample(request):
    products = Product.objects.select_related('category', 'brand').all()
    data = ProductSerializer(products, many=True).data
    response_data = {"count": len(data), 
                     "products": data}
    return Response(response_data)

@api_view(['GET'])
def get_embedding(request):
    # embed products into the vector database
    embed_products.apply()
    service = VectorService("products", "product_embeddings")
    # get summary of db
    res = service.get_summary()
    response_data = {"summary": res}
    # insert into the vector database
    
    
    return Response(response_data)