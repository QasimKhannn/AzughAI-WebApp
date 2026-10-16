from django.apps import AppConfig
import os

class VectorDBConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vector_db'
    
    _initialized = False  # Add a flag to prevent multiple initializations
    
    def ready(self):
        # Prevent initialization during subprocesses (e.g., Django's autoreloader)
        if os.environ.get('RUN_MAIN') != 'true':
            return
        print("Initializing collections from app")
        if not self._initialized:
            from .registry import CollectionRegistry
            CollectionRegistry.initialize_collections()
            self._initialized = True