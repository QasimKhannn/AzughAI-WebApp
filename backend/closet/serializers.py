from common.serializers import DynamicFieldsModelSerializer
from rest_framework import serializers
from .models import ClosetItem, ClosetItemImage
from products.serializers import ProductSerializer


class ClosetItemImageSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = ClosetItemImage
        fields = "__all__"


class ClosetItemSerializer(DynamicFieldsModelSerializer):
    images = ClosetItemImageSerializer(many=True, read_only=True)
    product = ProductSerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = ClosetItem
        fields = "__all__"


class ClosetItemCreateSerializer(DynamicFieldsModelSerializer):
    """Serializer for creating closet items without nested images."""
    class Meta:
        model = ClosetItem
        fields = ['product', 'custom_name', 'custom_description', 'brand', 'color', 'size', 'season']
        extra_kwargs = {
            'product': {'required': False, 'allow_null': True},
            'custom_name': {'required': False, 'allow_null': True},
            'custom_description': {'required': False, 'allow_null': True},
            'brand': {'required': False, 'allow_null': True},
            'color': {'required': False, 'allow_null': True},
            'size': {'required': False, 'allow_null': True},
            'season': {'required': False, 'allow_null': True},
        }


# Serializers for new endpoints

class ClosetItemSearchRequestSerializer(serializers.Serializer):
    """Serializer for search products request - accepts multiple image files."""
    images = serializers.ListField(
        child=serializers.ImageField(),
        allow_empty=False,
        min_length=1,
        help_text="List of image files to search for similar products"
    )


class ProductWithScoreSerializer(ProductSerializer):
    """Serializer for product with similarity score."""
    similarity_score = serializers.FloatField(read_only=True, help_text="Similarity score from vector search")


class ClosetItemSearchResponseSerializer(serializers.Serializer):
    """Serializer for search products response."""
    products = ProductWithScoreSerializer(many=True, help_text="List of similar products with scores")


class ClosetItemWithProductSerializer(serializers.Serializer):
    """Serializer for creating closet item with product match."""
    product_id = serializers.IntegerField(required=True, help_text="ID of the matched product")
    images = serializers.ListField(
        child=serializers.ImageField(),
        allow_empty=False,
        min_length=1,
        help_text="List of user-uploaded images for the closet item"
    )


class ClosetItemFieldsGeneratorRequestSerializer(serializers.Serializer):
    """Serializer for generating closet item fields from images."""
    images = serializers.ListField(
        child=serializers.ImageField(),
        allow_empty=False,
        min_length=1,
        help_text="List of image files to analyze and generate fields"
    )


class ClosetItemFieldsGeneratorResponseSerializer(serializers.Serializer):
    """Serializer for generated closet item fields."""
    custom_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    custom_description = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    brand = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    color = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    size = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    season = serializers.CharField(required=False, allow_null=True, allow_blank=True)


class ClosetItemCustomSerializer(serializers.Serializer):
    """Serializer for creating custom closet item without product match."""
    custom_name = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    custom_description = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    brand = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    color = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    size = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    season = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    images = serializers.ListField(
        child=serializers.ImageField(),
        allow_empty=False,
        min_length=1,
        help_text="List of user-uploaded images for the closet item"
    )
