from transformers import AutoModel, AutoProcessor
import numpy as np
import torch
from PIL import Image
import re


class ProductEmbedder:

    def __init__(self,
                 model: AutoModel,
                 processor: AutoProcessor
                 ):
        """
        Initialize the ProductEmbedder with a model and a processor.

        Args:
            model (AutoModel): model to use for embedding
            processor (AutoProcessor): processor to use for embedding
        """
        self.model = model
        self.processor = processor
        # find max length of the model
        self.MAX_LENGTH = self.processor.tokenizer.model_max_length

    def __call__(self,
                 product: dict,
                 text_weight: float = 0.3,
                 primary_image_weight: float = 0.5,
                 secondary_images_weight: float = 0.2
                 ) -> np.ndarray:
        """
        Embeds a product using a linear combination of text and image embeddings.

        Args:
            product (dict): A dictionary containing product details. Expected keys include:
                - "description" (str): Short description of the product.
                - "color" (str): Color of the product.
                - "category" (dict): A dictionary with "name" (str) and "parent" (str) keys.
                - "item_type" (str): Type of the product (e.g., jeans, shirt).
                - "shop" (dict): A dictionary with "name" (str) key for the shop name.
                - "brand" (dict): A dictionary with "name" (str) key for the brand name.
                - "price" (str): Price of the product.
                - "currency" (str): Currency of the price.
                - "about" (str): Composition or material details of the product.
                - "details" (list): List of additional details about the product.
                - "images" (list): List of dictionaries with "image" (str) key for image paths.
            text_weight (float, optional): The weight of the text embedding. Defaults to 0.3.
            primary_image_weight (float, optional): The weight of the primary image embedding. Defaults to 0.5.
            secondary_images_weight (float, optional): The weight of the secondary image embeddings. Defaults to 0.2.

        Returns:
            np.ndarray: The embedded product.
        """
        assert text_weight + primary_image_weight + secondary_images_weight == 1.0, "Weights must sum to 1.0"
        assert product.get("images") is not None and len(product["images"]) > 0, "Product must have at least one image"
        # embed the product description
        description = self.compose_product_descriptions(product)
        description_embedding = self.embed_text(description)
        # embed the product images
        product_images = [img["image"] for img in product["images"]]
        # check if image path starts with / and if so add . to the beginning
        product_images = [f".{img}" if img.startswith("/") else f"./{img}" for img in product_images]
        images_embeddings = self.batch_embed_image(product_images)
        # combine the embeddings into an embedding matrix, with embedding vectors as rows
        # Stack it with images_embeddings
        embeddings = np.vstack([description_embedding, images_embeddings]) 
        # compose the weights array 
        number_secondary_images = len(images_embeddings) - 1
        if number_secondary_images > 0:
            secondary_images_weights = [secondary_images_weight / number_secondary_images] * number_secondary_images
        else:
            secondary_images_weights = []
            # add the weight to the text and primary image
            text_weight = text_weight + secondary_images_weight * text_weight / (text_weight + primary_image_weight)
            primary_image_weight = primary_image_weight + secondary_images_weight * primary_image_weight / (text_weight + primary_image_weight)
        weights = [text_weight, primary_image_weight] + secondary_images_weights
        # if no second
        weights = np.array(weights)
        # calculate linear combination
        linear_combination = np.dot(weights, embeddings)
        return linear_combination
         

    def embed_text(self, text: str) -> np.ndarray:
        """
        Embeds a text using the model.

        Args:
            text (str): Text to embed.

        Returns:
            np.ndarray: The embedded text.
        """
        inputs = self.processor(text=text,
                                return_tensors="pt",
                                padding="max_length",
                                max_length=self.MAX_LENGTH,
                                truncation=True)
        # Get text embeddings
        with torch.no_grad():
            text_features = self.model.get_text_features(**inputs)

        # The text_features tensor is your text embedding
        text_embedding = text_features.detach().cpu().numpy()
        return text_embedding
    
    def batch_embed_text(self, texts: list) -> np.ndarray:
        """
        Embeds a list of texts using the model.

        Args:
            texts (list): List of texts to embed.

        Returns:
            np.ndarray: The embedded texts.
        """
        inputs = self.processor(text=texts,
                                return_tensors="pt",
                                padding="max_length",
                                max_length=self.MAX_LENGTH,
                                truncation=True)
        # Get text embeddings
        with torch.no_grad():
            text_features = self.model.get_text_features(**inputs)

        # The text_features tensor is your text embedding
        text_embedding = text_features.detach().cpu().numpy()
        return text_embedding

    def embed_image(self, image_path: str) -> np.ndarray:
        """
        Embeds an image using the model.

        Args:
            image_path (str): Path to the image to embed.
            
        Returns:
            np.ndarray: The embedded image.
        """
        image = Image.open(image_path).convert("RGB")
        inputs = self.processor(images=image, return_tensors="pt")
        with torch.no_grad():
            image_features = self.model.get_image_features(**inputs)

        # The image_features tensor is your image embedding
        image_embedding = image_features.detach().cpu().numpy()
        return image_embedding
    
    def batch_embed_image(self, image_paths: list) -> np.ndarray:
        """
        Embeds a list of images using the model.

        Args:
            image_paths (list): List of paths to the images to embed.

        Returns:
            np.ndarray: The embedded images.
        """
        images = [Image.open(img_path).convert("RGB") for img_path in image_paths]
        inputs = self.processor(images=images, return_tensors="pt")
        with torch.no_grad():
            image_features = self.model.get_image_features(**inputs)

        # The image_features tensor is your image embedding
        image_embedding = image_features.detach().cpu().numpy()
        return image_embedding

    def compose_product_descriptions(self,
                                     product: dict) -> str:
        """
        Composes a detailed product description based on the provided product attributes.

        Args:
            product (dict): A dictionary containing product details. Expected keys include:
                - "description" (str): Short description of the product.
                - "color" (str): Color of the product.
                - "category" (dict): A dictionary with "name" (str) and "parent" (str) keys.
                - "item_type" (str): Type of the product (e.g., jeans, shirt).
                - "shop" (dict): A dictionary with "name" (str) key for the shop name.
                - "brand" (dict): A dictionary with "name" (str) key for the brand name.
                - "price" (str): Price of the product.
                - "currency" (str): Currency of the price.
                - "about" (str): Composition or material details of the product.
                - "details" (list): List of additional details about the product.

        Returns:
            str: A composed product description string.
        """
        def retrieve_attribute(key, default): return product.get(
            key) if product.get(key) is not None else default
        description = retrieve_attribute("description", "")
        color = retrieve_attribute("color", "unknown").lower()
        # only use product category and gender, exclude the subcategory as clothing, shoes, etc
        category = product["category"]["name"].lower()
        gender = product["category"]["parent"].split("-")[1].strip().lower()
        item_type = retrieve_attribute("item_type", category).lower()
        shop = product["shop"]["name"].lower()
        brand = product["brand"]["name"]
        price = product["price"]
        currency = product["currency"]
        composition = retrieve_attribute("about", "unknown")
        # remove all single or combination of \n, replace them with commas
        composition = re.sub(r"\n+", ", ", composition).lower()
        details = retrieve_attribute("details", [])
        # attach the details sentences separated by . and space
        details = ". ".join(details)
        # now compose the description
        first_sentence = f"{description}, a {gender}'s {item_type} in {color}. "
        second_sentence = f"Sold by {shop}, this {item_type} is from the {brand} brand and priced at {currency} {price}. "
        third_sentence = f"Made from {composition}. "
        fourth_sentence = f"Additional details: {details}."
        full_description = first_sentence + \
            second_sentence + third_sentence + fourth_sentence
        return full_description
    

    def get_embeddings_dimension(self) -> int:
        """
        Determines the embedding dimension of the model.
        
        Returns:
            int: The embedding dimension.
        """
        # Dynamically determine embedding dimension with a test run
        test_text = "test"
        inputs = self.processor(
            test_text, return_tensors="pt", padding="max_length", truncation=True)
        with torch.no_grad():
            text_features = self.model.get_text_features(**inputs)
        self.DIMENSION = text_features.shape[-1]
        return self.DIMENSION