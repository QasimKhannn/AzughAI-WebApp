from common.serializers import DynamicFieldsModelSerializer
from rest_framework import serializers
from .models import *

class CategorySerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        
class CategoriesScrapingJobSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = CategoriesScrapingJob
        fields = "__all__"
        
class ProductImageSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = ProductImage
        fields = "__all__"
    
class BrandSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Brand
        fields = "__all__"

class CategorySerializer(DynamicFieldsModelSerializer):
    parent = serializers.StringRelatedField()
    class Meta:
        model = Category
        fields = "__all__"
    
class ShopSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Shop
        fields = "__all__"
        
class ProductSerializer(DynamicFieldsModelSerializer):
    images = ProductImageSerializer(many=True)
    category = CategorySerializer()
    brand = BrandSerializer()
    shop = ShopSerializer()
    class Meta:
        model = Product
        fields = "__all__"
        
    