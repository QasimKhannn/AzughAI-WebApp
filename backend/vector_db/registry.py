from django.conf import settings
from .client import create_collection
import logging


class CollectionRegistry:
    """Registry for managing vector database collections"""
    _collections = {}

    @classmethod
    def register_collection(cls, app_name, collection_name, dimension=728,
                            metric_type="COSINE", index_type="HNSW", params=None, fields=None):
        """Register a collection with the registry"""
        full_name = f"{app_name}_{collection_name}"

        if full_name not in cls._collections:
            # Create the collection in Milvus
            create_collection(
                collection_name=full_name,
                dimension=dimension,
                metric_type=metric_type,
                index_type=index_type,
                params=params,
                fields=fields
            )

            # Store the configuration
            cls._collections[full_name] = {
                'app_name': app_name,
                'collection_name': collection_name,
                'dimension': dimension,
                'metric_type': metric_type,
                'fields': fields
            }

        return full_name

    @classmethod
    def get_collection_name(cls, app_name, collection_name):
        """Get the full collection name"""
        return f"{app_name}_{collection_name}"

    @classmethod
    def initialize_collections(cls):
        """Initialize collections from settings if provided"""
        vector_collections = getattr(settings, 'VECTOR_COLLECTIONS', {})
        logging.info("Initializing collections")

        for app_name, collections in vector_collections.items():
            logging.warning(f"Initializing collections for app: {app_name}")
            for coll_config in collections:
                cls.register_collection(
                    app_name=app_name,
                    collection_name=coll_config['name'],
                    dimension=coll_config.get('dimension', 728),
                    metric_type=coll_config.get('metric_type', 'COSINE'),
                    index_type=coll_config.get('index_type', 'HNSW'),
                    params=coll_config.get('index_params', None),
                    fields=coll_config.get('fields', None)
                )
