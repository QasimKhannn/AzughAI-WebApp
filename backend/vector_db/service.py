from .client import get_milvus_client, insert_into_collection, search_collection
from .registry import CollectionRegistry

class VectorService:
    """Base class for vector services"""
    
    def __init__(self, app_name, collection_name):
        self.app_name = app_name
        self.collection_name = collection_name
        self.full_collection_name = CollectionRegistry.get_collection_name(
            app_name, collection_name
        )
        self.client = get_milvus_client()
    
    def insert(self, id_value, embedding, **fields):
        """Insert a record with embedding and additional fields"""
        data = {
            "id": id_value,
            "embedding": embedding,
            **{k: v for k, v in fields.items()}
        }
        # add other fields but first check if they are in the schema maybe later
        
        
        return insert_into_collection(
            collection_name=self.full_collection_name,
            data=data
        )
        
    def upsert(self, id_value, embedding, **fields):
        """Update or insert a record with embedding and additional fields"""
        data = {
            "id": id_value,
            "embedding": embedding,
            **{k: v for k, v in fields.items()}
        }
        return self.client.upsert(
            collection_name=self.full_collection_name,
            data=data
        )
    
    def search(self, query_vector, limit=10, output_fields=None, filter='', params=None):
        """Search for similar vectors"""
        return search_collection(
            collection_name=self.full_collection_name,
            vectors=[query_vector],
            limit=limit,
            output_fields=output_fields,
            filter=filter,
            params=params
        )
    
    def delete(self, ids: list = None, filter: str = ''):
        """Delete records by filter"""
        return self.client.delete(
            collection_name=self.full_collection_name,
            ids=ids,
            filter=filter
        )
        
    def get(self, ids: list):
        """Get a record by id"""
        return self.client.get(
            collection_name=self.full_collection_name,
            ids=ids
        )
        
    def get_summary(self):
        """Get a summary of the collection, including number of rows, total storage, and schema"""
        stats = self.client.get_collection_stats(collection_name=self.full_collection_name)
        schema = self.client.describe_collection(collection_name=self.full_collection_name)
        
        summary = {
            "row_count": stats.get("row_count", 0),
            #"total_storage": stats.get("total_storage", "Unknown"), # it is not available in the response, calculate it later on 
            "fields_schema": schema.get("fields", [])
        }
        return summary
    
    def get_all_vectorids(self):
        """Get all vector ids"""
        # use iterator
        iterator = self.client.query_iterator(
            collection_name=self.full_collection_name,
            batch_size=10,
            output_fields=["id"]
        )

        results = []

        while True:
            result = iterator.next()
            if not result:
                iterator.close()
                break
            results += result
        
        results = [r["id"] for r in results]
        return results
        
    