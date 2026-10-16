"""
Closet API Views for managing user closet items.
"""
import os
import tempfile
import logging
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage

from common.views import APIViewTokenRefresh
from .models import ClosetItem, ClosetItemImage
from .serializers import (
    ClosetItemSerializer,
    ClosetItemImageSerializer,
    ClosetItemCreateSerializer,
    ClosetItemSearchRequestSerializer,
    ClosetItemSearchResponseSerializer,
    ClosetItemWithProductSerializer,
    ClosetItemFieldsGeneratorRequestSerializer,
    ClosetItemFieldsGeneratorResponseSerializer,
    ClosetItemCustomSerializer,
)
from products.models import Product
from products.serializers import ProductSerializer
from vector_db.service import VectorService
from libs.agent.structured_output import Create

logger = logging.getLogger(__name__)


class ClosetItemsView(APIViewTokenRefresh):
    """
    API endpoint to manage closet items for the authenticated user.
    GET: List all closet items for the authenticated user.
    POST: Create a new closet item.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: ClosetItemSerializer(many=True)},
        description="Get the list of closet items for the authenticated user"
    )
    def get(self, request):
        """
        Get the list of closet items for the authenticated user.
        """
        closet_items = ClosetItem.objects.filter(user=request.user)
        serializer = ClosetItemSerializer(closet_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=ClosetItemCreateSerializer,
        responses={201: ClosetItemSerializer},
        description="Create a new closet item for the authenticated user"
    )
    def post(self, request):
        """
        Create a new closet item for the authenticated user.
        """
        serializer = ClosetItemCreateSerializer(data=request.data)
        if serializer.is_valid():
            closet_item = serializer.save(user=request.user)
            response_serializer = ClosetItemSerializer(closet_item)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClosetItemView(APIViewTokenRefresh):
    """
    API endpoint to manage a specific closet item.
    GET: Get closet item details.
    PUT/PATCH: Update closet item.
    DELETE: Delete closet item.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: ClosetItemSerializer},
        description="Get details of a specific closet item"
    )
    def get(self, request, item_id):
        """
        Get details of a specific closet item.
        """
        closet_item = get_object_or_404(
            ClosetItem,
            id=item_id,
            user=request.user
        )
        serializer = ClosetItemSerializer(closet_item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=ClosetItemCreateSerializer,
        responses={200: ClosetItemSerializer},
        description="Update a closet item"
    )
    def put(self, request, item_id):
        """
        Update a closet item.
        """
        closet_item = get_object_or_404(
            ClosetItem,
            id=item_id,
            user=request.user
        )
        serializer = ClosetItemCreateSerializer(closet_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            response_serializer = ClosetItemSerializer(closet_item)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=ClosetItemCreateSerializer,
        responses={200: ClosetItemSerializer},
        description="Partially update a closet item"
    )
    def patch(self, request, item_id):
        """
        Partially update a closet item.
        """
        closet_item = get_object_or_404(
            ClosetItem,
            id=item_id,
            user=request.user
        )
        serializer = ClosetItemCreateSerializer(closet_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response_serializer = ClosetItemSerializer(closet_item)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        responses={204: None},
        description="Delete a closet item"
    )
    def delete(self, request, item_id):
        """
        Delete a closet item.
        """
        closet_item = get_object_or_404(
            ClosetItem,
            id=item_id,
            user=request.user
        )
        closet_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ClosetItemImagesView(APIViewTokenRefresh):
    """
    API endpoint to manage images for a closet item.
    GET: List all images for a closet item.
    POST: Add a new image to a closet item.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: ClosetItemImageSerializer(many=True)},
        description="Get all images for a closet item"
    )
    def get(self, request, item_id):
        """
        Get all images for a closet item.
        """
        closet_item = get_object_or_404(
            ClosetItem,
            id=item_id,
            user=request.user
        )
        images = ClosetItemImage.objects.filter(closet_item=closet_item)
        serializer = ClosetItemImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=ClosetItemImageSerializer,
        responses={201: ClosetItemImageSerializer},
        description="Add a new image to a closet item"
    )
    def post(self, request, item_id):
        """
        Add a new image to a closet item.
        """
        closet_item = get_object_or_404(
            ClosetItem,
            id=item_id,
            user=request.user
        )
        serializer = ClosetItemImageSerializer(data=request.data)
        if serializer.is_valid():
            image = serializer.save(closet_item=closet_item)
            return Response(
                ClosetItemImageSerializer(image).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClosetItemImageView(APIViewTokenRefresh):
    """
    API endpoint to manage a specific closet item image.
    GET: Get image details.
    PUT/PATCH: Update image.
    DELETE: Delete image.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: ClosetItemImageSerializer},
        description="Get details of a specific closet item image"
    )
    def get(self, request, item_id, image_id):
        """
        Get details of a specific closet item image.
        """
        closet_item = get_object_or_404(
            ClosetItem,
            id=item_id,
            user=request.user
        )
        image = get_object_or_404(
            ClosetItemImage,
            id=image_id,
            closet_item=closet_item
        )
        serializer = ClosetItemImageSerializer(image)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=ClosetItemImageSerializer,
        responses={200: ClosetItemImageSerializer},
        description="Update a closet item image"
    )
    def put(self, request, item_id, image_id):
        """
        Update a closet item image.
        """
        closet_item = get_object_or_404(
            ClosetItem,
            id=item_id,
            user=request.user
        )
        image = get_object_or_404(
            ClosetItemImage,
            id=image_id,
            closet_item=closet_item
        )
        serializer = ClosetItemImageSerializer(image, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=ClosetItemImageSerializer,
        responses={200: ClosetItemImageSerializer},
        description="Partially update a closet item image"
    )
    def patch(self, request, item_id, image_id):
        """
        Partially update a closet item image.
        """
        closet_item = get_object_or_404(
            ClosetItem,
            id=item_id,
            user=request.user
        )
        image = get_object_or_404(
            ClosetItemImage,
            id=image_id,
            closet_item=closet_item
        )
        serializer = ClosetItemImageSerializer(image, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        responses={204: None},
        description="Delete a closet item image"
    )
    def delete(self, request, item_id, image_id):
        """
        Delete a closet item image.
        """
        closet_item = get_object_or_404(
            ClosetItem,
            id=item_id,
            user=request.user
        )
        image = get_object_or_404(
            ClosetItemImage,
            id=image_id,
            closet_item=closet_item
        )
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SearchSimilarProductsView(APIViewTokenRefresh):
    """
    API endpoint to search for similar products using vector search.
    POST: Upload images, embed them, and search for similar products in vector DB.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=ClosetItemSearchRequestSerializer,
        responses={200: ClosetItemSearchResponseSerializer},
        description="Search for similar products using uploaded images"
    )
    def post(self, request):
        """
        Search for similar products using vector search.
        """
        serializer = ClosetItemSearchRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        images = request.FILES.getlist('images')
        if not images:
            return Response(
                {"error": "At least one image is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        temp_image_paths = []
        from libs.fashp_embedder import default_embedder
        
        try:
            # Save images temporarily and create product dict structure for embedding
            image_dicts = []
            
            for image in images:
                # Save to temporary location
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
                temp_file.write(image.read())
                temp_file.close()
                temp_image_paths.append(temp_file.name)
                
                # ProductEmbedder modifies paths: "/path" -> "./path", "path" -> "./path"
                # Since Image.open can handle absolute paths, we'll pass absolute path
                # and ProductEmbedder will convert it, but we need to ensure it works
                # Actually, ProductEmbedder's embed_image uses Image.open which handles absolute paths
                # So we pass the absolute path - ProductEmbedder will prepend "./" but Image.open should still work
                # Let's pass it as-is and see if it works, otherwise we may need to adjust
                image_path = temp_file.name
                image_dicts.append({"image": image_path})

            # Create minimal product dict for embedding
            # ProductEmbedder requires certain fields, but we can use empty/default values for user uploads
            product_dict = {
                "images": image_dicts,
                "description": "",  # Empty for user uploads
                "color": "",
                "category": {"name": "clothing", "parent": "clothing-unisex"},  # Default category
                "item_type": "",
                "shop": {"name": "user_upload"},
                "brand": {"name": ""},
                "price": "",
                "currency": "EUR",
                "about": "",
                "details": [],
            }

            # Generate embedding using ProductEmbedder
            embedding = default_embedder(product_dict)
            
            # Flatten embedding if needed (ProductEmbedder returns 2D array)
            if len(embedding.shape) > 1:
                embedding = embedding.flatten()
            
            # Search vector DB for similar products
            vector_service = VectorService("products", "product_embeddings")
            search_results = vector_service.search(
                query_vector=embedding.tolist(),
                limit=10,
                output_fields=["id"]
            )

            # Extract product IDs and similarity scores from search results
            # Milvus search returns: [[{id: X, distance: Y}, ...]] for each query vector
            product_ids = []
            product_scores = {}
            
            if search_results and len(search_results) > 0:
                # Get first query result (we only sent one vector)
                query_result = search_results[0] if isinstance(search_results, list) else search_results
                
                if query_result:
                    for hit in query_result:
                        product_id = hit.get('id')
                        # For cosine similarity, distance is 1 - similarity
                        # So similarity = 1 - distance
                        distance = hit.get('distance', 1.0)
                        similarity_score = max(0, 1 - distance)  # Ensure non-negative
                        product_ids.append(product_id)
                        product_scores[product_id] = similarity_score

            # Fetch products from database
            products = Product.objects.filter(id__in=product_ids).select_related('brand', 'category', 'shop')
            
            # Sort products by similarity score (highest first)
            products_list = list(products)
            products_list.sort(key=lambda p: product_scores.get(p.id, 0), reverse=True)
            
            # Add similarity scores to products
            products_with_scores = []
            for product in products_list:
                product_data = ProductSerializer(product).data
                product_data['similarity_score'] = product_scores.get(product.id, 0)
                products_with_scores.append(product_data)

            # Clean up temporary files
            for temp_path in temp_image_paths:
                try:
                    if os.path.exists(temp_path):
                        os.unlink(temp_path)
                except Exception as e:
                    logger.warning(f"Failed to delete temporary file {temp_path}: {e}")

            response_data = {"products": products_with_scores}
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in product search: {str(e)}", exc_info=True)
            # Clean up temporary files on error
            for temp_path in temp_image_paths:
                try:
                    if os.path.exists(temp_path):
                        os.unlink(temp_path)
                except Exception:
                    pass
            return Response(
                {"error": f"Failed to search for products: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CreateClosetItemWithProductView(APIViewTokenRefresh):
    """
    API endpoint to create a closet item linked to a product.
    POST: Create closet item with product FK and user-uploaded images.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=ClosetItemWithProductSerializer,
        responses={201: ClosetItemSerializer},
        description="Create a closet item linked to a product with user images"
    )
    def post(self, request):
        """
        Create a closet item linked to a product with user-uploaded images.
        """
        serializer = ClosetItemWithProductSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        product_id = serializer.validated_data['product_id']
        images = request.FILES.getlist('images')

        # Verify product exists
        product = get_object_or_404(Product, id=product_id)

        try:
            # Create closet item with product FK
            closet_item = ClosetItem.objects.create(
                user=request.user,
                product=product
            )

            # Save all user images
            for idx, image in enumerate(images):
                ClosetItemImage.objects.create(
                    closet_item=closet_item,
                    image=image,
                    is_primary=(idx == 0)  # First image is primary
                )

            response_serializer = ClosetItemSerializer(closet_item)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error creating closet item with product: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Failed to create closet item: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GenerateClosetItemFieldsView(APIViewTokenRefresh):
    """
    API endpoint to generate closet item fields using AI.
    POST: Analyze uploaded images and generate structured fields.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=ClosetItemFieldsGeneratorRequestSerializer,
        responses={200: ClosetItemFieldsGeneratorResponseSerializer},
        description="Generate closet item fields from images using AI"
    )
    def post(self, request):
        """
        Generate closet item fields from uploaded images using AI.
        """
        serializer = ClosetItemFieldsGeneratorRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        images = request.FILES.getlist('images')
        if not images:
            return Response(
                {"error": "At least one image is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        temp_image_paths = []
        try:
            # Save images temporarily for AI processing
            for image in images:
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
                temp_file.write(image.read())
                temp_file.close()
                temp_image_paths.append(temp_file.name)

            # Use Create class to generate fields
            structured_output = Create()
            generated_fields = structured_output.generate_closet_item_fields(temp_image_paths)

            # Clean up temporary files
            for temp_path in temp_image_paths:
                try:
                    if os.path.exists(temp_path):
                        os.unlink(temp_path)
                except Exception as e:
                    logger.warning(f"Failed to delete temporary file {temp_path}: {e}")

            response_serializer = ClosetItemFieldsGeneratorResponseSerializer(generated_fields)
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error generating closet item fields: {str(e)}", exc_info=True)
            # Clean up temporary files on error
            for temp_path in temp_image_paths:
                try:
                    if os.path.exists(temp_path):
                        os.unlink(temp_path)
                except Exception:
                    pass
            return Response(
                {"error": f"Failed to generate fields: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CreateCustomClosetItemView(APIViewTokenRefresh):
    """
    API endpoint to create a custom closet item without product match.
    POST: Create closet item with custom fields and user-uploaded images.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=ClosetItemCustomSerializer,
        responses={201: ClosetItemSerializer},
        description="Create a custom closet item with generated/edited fields and images"
    )
    def post(self, request):
        """
        Create a custom closet item with custom fields and user-uploaded images.
        """
        serializer = ClosetItemCustomSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        images = request.FILES.getlist('images')
        if not images:
            return Response(
                {"error": "At least one image is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Create closet item with custom fields (no product FK)
            closet_item = ClosetItem.objects.create(
                user=request.user,
                product=None,
                custom_name=serializer.validated_data.get('custom_name'),
                custom_description=serializer.validated_data.get('custom_description'),
                brand=serializer.validated_data.get('brand'),
                color=serializer.validated_data.get('color'),
                size=serializer.validated_data.get('size'),
                season=serializer.validated_data.get('season'),
            )

            # Save all user images
            for idx, image in enumerate(images):
                ClosetItemImage.objects.create(
                    closet_item=closet_item,
                    image=image,
                    is_primary=(idx == 0)  # First image is primary
                )

            response_serializer = ClosetItemSerializer(closet_item)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error creating custom closet item: {str(e)}", exc_info=True)
            return Response(
                {"error": f"Failed to create closet item: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
