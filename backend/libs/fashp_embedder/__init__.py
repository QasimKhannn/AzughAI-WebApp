# Download once and save locally
from transformers import AutoModel, AutoProcessor
import os
import logging

# Avoid loading the model and processor in the auto-reloader process
if os.environ.get('RUN_MAIN') == 'true':
    # download once and save locally if not already downloaded
    package_dir = os.path.dirname(os.path.abspath(__file__))
    local_model_path = os.path.join(package_dir, "models", "fashionSigLIP")
    local_processor_path = os.path.join(package_dir, "models", "fashionSigLIP_processor")

    # Create models directory if it doesn't exist
    os.makedirs(os.path.join(package_dir, "models"), exist_ok=True)

    # check if the model is already downloaded
    if not os.path.exists(local_model_path):
        logging.warning("Downloading the model for the first time. This might take a few minutes.")
        # Download and save (run this once)
        model = AutoModel.from_pretrained(
            'Marqo/marqo-fashionSigLIP', trust_remote_code=True)
        model.save_pretrained(local_model_path)
    else:
        logging.warning("Loading the model from the local cache.")
        model = AutoModel.from_pretrained(local_model_path, trust_remote_code=True)

    # check if the processor is already downloaded
    if not os.path.exists(local_processor_path):
        logging.warning("Downloading the processor for the first time. This might take a few minutes.")
        # Download and save (run this once)
        processor = AutoProcessor.from_pretrained(
            'Marqo/marqo-fashionSigLIP', trust_remote_code=True)
        processor.save_pretrained(local_processor_path)
    else:
        logging.warning("Loading the processor from the local cache.")
        processor = AutoProcessor.from_pretrained(
            local_processor_path, trust_remote_code=True)
        
    # Import after defining model and processor
    from .products_embedder import ProductEmbedder

    # Provide a pre-configured instance for convenience
    default_embedder = ProductEmbedder(model=model, processor=processor)

    # Export what users of your package should access
    __all__ = ['ProductEmbedder', 'default_embedder']