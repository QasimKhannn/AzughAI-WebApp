from django.conf import settings
from pymilvus import MilvusClient, DataType, FieldSchema, CollectionSchema
import logging

# Path for the embedded database file - configurable via settings
MILVUS_LITE_PATH = str(settings.MILVUS_LITE_PATH)

# Singleton pattern for client
_milvus_client = None


def get_milvus_client():
    """Get or create a Milvus client instance"""
    global _milvus_client
    if _milvus_client is None:
        logging.warning(f"Creating Milvus client with URI: {MILVUS_LITE_PATH}")
        _milvus_client = MilvusClient(MILVUS_LITE_PATH)
    else:
        logging.warning("Reusing existing Milvus client")
    return _milvus_client


def create_collection(collection_name, dimension=728, metric_type="COSINE",
                      index_type="HNSW", params=None, fields=None):
    """
    Create a collection with the specified parameters
    
    Args:
        collection_name: Name of the collection
        dimension: Dimension of the embedding vector
        metric_type: Distance metric type ("COSINE", "L2", "IP")
        index_type: Index type ("HNSW", "IVF_FLAT", etc.)
        index_params: Parameters for the index
        fields: List of additional fields in format [{"name": "field_name", "type": "data_type"}]
               where data_type is one of "INT64", "FLOAT", "VARCHAR", "BOOL", etc.
    
    """
    client = get_milvus_client()

    if not client.has_collection(collection_name):
        # Define collection schema
        base_fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True),
            FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=dimension)
        ]
        
        # Add additional fields if provided
        if fields:
            for field in fields:
                field_type = getattr(DataType, field["type"])
                field_params = {
                    "name": field["name"],
                    "dtype": field_type
                }
                
                # Add max_length for VARCHAR fields
                if field_type == DataType.VARCHAR:
                    field_params["max_length"] = field.get("max_length", 256)
                
                base_fields.append(FieldSchema(**field_params))

        # Create the collection schema
        schema = CollectionSchema(fields=base_fields)

        
        # Create the collection
        client.create_collection(
            collection_name=collection_name,
            schema=schema
        )

        # Create index with default or provided parameters
        if params is None:
            params = {"M": 8, "efConstruction": 200}
            
        # compose index field
        index_params = client.prepare_index_params()
        
        # check if local mode is enabled and set the index type accordingly
        if settings.VECTOR_DB_LOCAL_MODE == True:
            index_type = "IVF_FLAT"
            params = {
                "nlist": 64,  # Number of clusters for the index
            }


        index_params.add_index(
            field_name="embedding",
            index_type=index_type,
            metric_type=metric_type,
            params=params
        )
        # add index to collection
        client.create_index(
            collection_name=collection_name,
            index_params=index_params
        )

    return client


def insert_into_collection(collection_name, data):
    """Insert data into a collection"""
    client = get_milvus_client()
    return client.insert(collection_name=collection_name, data=data)


def search_collection(collection_name, vectors, limit=10, output_fields=None,
                      filter='', params=None):
    """Search within a collection"""
    client = get_milvus_client()

    search_params = {
        "metric_type": "COSINE",
        "params": {"ef": 64}
    }
    if params:
        search_params.update(params)

    return client.search(
        collection_name=collection_name,
        data=vectors,
        limit=limit,
        output_fields=output_fields,
        filter=filter,
        search_params=search_params
    )
