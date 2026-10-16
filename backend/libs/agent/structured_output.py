import base64
from .models import *
from .prompts import *
from langchain_core.output_parsers import JsonOutputParser
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain_core.messages import HumanMessage
from typing import Dict, List, Optional


class Create:
    def __init__(self,
                 model_name: str = "gpt-4.1",
                 temperature: float = 0.7
                 ):
        self.model_name = model_name
        self.temperature = temperature
        self.llm = ChatOpenAI(model=self.model_name,
                              temperature=self.temperature)
        self.json_parser = JsonOutputParser()

    def extract_onboarding_keywords(self, summary: str) -> ConversationKeywords:
        """
        Extract onboarding keywords from the generated style summary.

        Args:
            summary: The generated style summary text

        Returns:
            ConversationKeywords object with extracted keywords
        """
        # Use a lower temperature for more consistent keyword extraction
        keyword_llm = ChatOpenAI(
            model=self.model_name,
            temperature=0.2,
            max_tokens=500
        )

        prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(
                GENERATE_ONBOARDING_KEYWORDS_PROMPT),
            HumanMessagePromptTemplate.from_template(
                GENERATE_ONBOARDING_KEYWORDS_USER_PROMPT)
        ])
        chain = prompt | keyword_llm | self.json_parser

        try:
            response = chain.invoke({"summary": summary})
            keywords = ConversationKeywords(**response)
            return keywords
        except Exception as e:
            print(f"Error extracting keywords: {e}")
            # Return default keywords if extraction fails
            return ConversationKeywords(
                city="unknown",
                gender="unknown",
                age_group="unknown",
                lifestyle_1="unknown",
                lifestyle_2="unknown",
                style_1="unknown",
                style_2="unknown",
                fit_1="unknown",
                fit_2="unknown",
                budget="unknown"
            )

    # Keep old method name for backward compatibility
    def extract_onboarding_keywaords(self, conversation_summary: str) -> ConversationKeywords:
        """
        Deprecated: Use extract_onboarding_keywords instead.
        Extract onboarding keywords from the conversation messages.
        """
        return self.extract_onboarding_keywords(conversation_summary)

    def generate_closet_item_fields(self, images: List[str]) -> Dict:
        """
        Generate closet item fields from images using AI vision model.

        Args:
            images: List of image file paths to analyze

        Returns:
            Dict with fields: custom_name, custom_description, brand, color, size, season
        """
        # Use a vision-capable model (gpt-4o or gpt-4-vision-preview)
        vision_model = "gpt-4o"  # Use gpt-4o for vision capabilities
        vision_llm = ChatOpenAI(
            model=vision_model,
            temperature=0.3,  # Lower temperature for more consistent extraction
            max_tokens=1000
        )

        # Encode images as base64
        image_contents = []
        for image_path in images:
            try:
                with open(image_path, "rb") as image_file:
                    image_data = image_file.read()
                    base64_image = base64.b64encode(image_data).decode('utf-8')
                    # Determine MIME type from file extension
                    if image_path.lower().endswith('.png'):
                        mime_type = "image/png"
                    elif image_path.lower().endswith('.jpg') or image_path.lower().endswith('.jpeg'):
                        mime_type = "image/jpeg"
                    else:
                        mime_type = "image/jpeg"  # Default
                    
                    image_contents.append({
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime_type};base64,{base64_image}"
                        }
                    })
            except Exception as e:
                print(f"Error encoding image {image_path}: {e}")
                continue

        if not image_contents:
            # Return default values if no images could be processed
            return {
                "custom_name": None,
                "custom_description": None,
                "brand": None,
                "color": None,
                "size": None,
                "season": None
            }

        # Create message with images and text prompt using LangChain format
        from langchain_core.messages import SystemMessage
        
        system_message = SystemMessage(content=GENERATE_CLOSET_ITEM_FIELDS_PROMPT)
        
        # Create human message with text and images
        human_content = [{"type": "text", "text": GENERATE_CLOSET_ITEM_FIELDS_USER_PROMPT}] + image_contents
        human_message = HumanMessage(content=human_content)

        try:
            # Use invoke with messages
            response = vision_llm.invoke([system_message, human_message])
            
            # Extract JSON from response
            response_text = response.content if hasattr(response, 'content') else str(response)
            
            # Try to parse as JSON (might need to extract JSON from markdown code blocks)
            import json
            import re
            
            # Try to find JSON in the response (might be wrapped in code blocks)
            json_match = re.search(r'\{[^{}]*\}', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                parsed_response = json.loads(json_str)
            else:
                # Try parsing the whole response
                parsed_response = json.loads(response_text)
            
            # Validate and return the response
            return {
                "custom_name": parsed_response.get("custom_name"),
                "custom_description": parsed_response.get("custom_description"),
                "brand": parsed_response.get("brand"),
                "color": parsed_response.get("color"),
                "size": parsed_response.get("size"),
                "season": parsed_response.get("season")
            }
            
        except Exception as e:
            print(f"Error generating closet item fields: {e}")
            # Return default values if generation fails
            return {
                "custom_name": None,
                "custom_description": None,
                "brand": None,
                "color": None,
                "size": None,
                "season": None
            }
