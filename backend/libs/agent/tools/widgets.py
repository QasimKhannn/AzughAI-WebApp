import json
from typing import Any

from langchain.tools import tool
from pydantic import BaseModel, Field
from langchain_core.tools import InjectedToolCallId
from langgraph.prebuilt import InjectedState
from langchain_core.messages import ToolMessage
from langgraph.types import Command
from typing_extensions import Annotated
from ..states import AgentState


class DrawSetup(BaseModel):
    """
    Draw a setup chart by provideing a list of the fundamental primitives. The primitives should be provided in the order they were drawn.
    Here is a breakdown of the available primitives:
    - "su" : stright up, this represents a straight upward line in the chart.
    - "wn" : west to north, this represents a line that goes upwards from the west to the north direction.
    - "se" : south east, this represents a line that goes upwards from the south to the east direction.
    - "hz" : horizontal, this represents a horizontal line in the chart.
    - "sd" : straight down, this represents a straight downward line in the chart.
    - "ne" : north to east, this represents a line that goes downwards from the north to the east direction.
    - "ws" : west to south, this represents a line that goes downwards from the west to the south direction.
    The primitives should be placed in a list and ordered to reflect the setup shape you want to draw.
    For esagmple, to draw a simple upward trend followed by a downward trend, you might provide the following sequence:
    ["su", "wn", "hz", "sd", "ne"]
    This sequence indicates an initial straight up movement, followed by a west to north line, then a horizontal line, and finally a straight down movement followed by a north to east line.
    """
    primitives_sequence: list[str] = Field(
        description="List of primitive codes to draw the setup chart")


MOCK_WIDGET_PRODUCTS: list[dict[str, Any]] = [
    {
        "id": "1",
        "shop": {
            "id": 1,
            "name": "NA-KD",
            "base_url": "https://www.na-kd.com"
        },
        "category": {
            "id": 1,
            "name": "Dresses",
            "url": "https://www.na-kd.com/dresses",
            "shop": {
                "id": 1,
                "name": "NA-KD",
                "base_url": "https://www.na-kd.com"
            },
            "parent": None
        },
        "brand": {
            "id": 1,
            "name": "NA-KD"
        },
        "images": [
            {
                "id": "1",
                "image": None,
                "original_url": "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/ruffle_volume_kaftan_1100-011540-0002_social.jpg",
                "is_primary": True
            },
            {
                "id": "2",
                "image": None,
                "original_url": "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/ruffle_volume_kaftan_1100-011540-0002_campaign.jpg",
                "is_primary": False
            },
            {
                "id": "3",
                "image": None,
                "original_url": "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/ruffle_volume_kaftan-1100-011540-0002_0013.jpg",
                "is_primary": False
            },
            {
                "id": "4",
                "image": None,
                "original_url": "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/ruffle_volume_kaftan-1100-011540-0002_0010.jpg",
                "is_primary": False
            }
        ],
        "shop_product_id": "1100-011540-0002",
        "url": "https://www.na-kd.com/en/na-kd/ruffle-volume-kaftan",
        "item_type": "dress",
        "description": "Volume Kaftan",
        "details": [
            {"key": "Material", "value": "100% Cotton"},
            {"key": "Style", "value": "Kaftan"},
            {"key": "Fit", "value": "Oversized"}
        ],
        "about": "Elegant volume kaftan with ruffle details, perfect for summer occasions.",
        "price": "65.95",
        "currency": "EUR",
        "color": "Beige",
        "availability": {"in_stock": True, "sizes": ["XS", "S", "M", "L", "XL"]},
        "created_at": "2025-01-15T10:00:00Z",
        "updated_at": "2025-01-15T10:00:00Z",
        "is_embedded": True
    },
    {
        "id": "2",
        "shop": {
            "id": 2,
            "name": "ASOS",
            "base_url": "https://www.asos.com"
        },
        "category": {
            "id": 2,
            "name": "Midi Dresses",
            "url": "https://www.asos.com/women/dresses/midi-dresses",
            "shop": {
                "id": 2,
                "name": "ASOS",
                "base_url": "https://www.asos.com"
            },
            "parent": {
                "id": 3,
                "name": "Dresses",
                "url": "https://www.asos.com/women/dresses",
                "shop": {
                    "id": 2,
                    "name": "ASOS",
                    "base_url": "https://www.asos.com"
                },
                "parent": None
            }
        },
        "brand": {
            "id": 2,
            "name": "ASOS DESIGN"
        },
        "images": [
            {
                "id": "5",
                "image": None,
                "original_url": "https://images.asos-media.com/products/asos-design-wickel-midikleid-in-dunkelbraun-im-kimono-stil/207875660-1-darkbrown?$n_1280w$&wid=1125&fit=constrain",
                "is_primary": True
            },
            {
                "id": "6",
                "image": None,
                "original_url": "https://images.asos-media.com/products/asos-design-wickel-midikleid-in-dunkelbraun-im-kimono-stil/207875660-2?$n_1280w$&wid=1125&fit=constrain",
                "is_primary": False
            },
            {
                "id": "7",
                "image": None,
                "original_url": "https://images.asos-media.com/products/asos-design-wickel-midikleid-in-dunkelbraun-im-kimono-stil/207875660-3?$n_1280w$&wid=1125&fit=constrain",
                "is_primary": False
            }
        ],
        "shop_product_id": "207875660",
        "url": "https://www.asos.com/asos-design/asos-design-kimono-wrap-midi-dress/prd/207875660",
        "item_type": "dress",
        "description": "Kimono wrap",
        "details": [
            {"key": "Material", "value": "Polyester blend"},
            {"key": "Style", "value": "Wrap"},
            {"key": "Length", "value": "Midi"}
        ],
        "about": "Kimono-style wrap midi dress in dark brown, perfect for elegant occasions.",
        "price": "64.99",
        "currency": "EUR",
        "color": "Dark Brown",
        "availability": {"in_stock": True, "sizes": ["6", "8", "10", "12", "14", "16"]},
        "created_at": "2025-01-14T09:30:00Z",
        "updated_at": "2025-01-14T09:30:00Z",
        "is_embedded": True
    },
    {
        "id": "3",
        "shop": {
            "id": 3,
            "name": "Zalando",
            "base_url": "https://www.zalando.de"
        },
        "category": {
            "id": 4,
            "name": "Abayas",
            "url": "https://www.zalando.de/bekleidung-damen-abaya",
            "shop": {
                "id": 3,
                "name": "Zalando",
                "base_url": "https://www.zalando.de"
            },
            "parent": None
        },
        "brand": {
            "id": 3,
            "name": "Elara"
        },
        "images": [
            {
                "id": "8",
                "image": None,
                "original_url": "https://img01.ztat.net/article/spp-media-p1/831ea40bb89a4fd9ba82a5a397a5bc26/d825e82a914148a897e563820189a3f3.jpg?imwidth=1800",
                "is_primary": True
            },
            {
                "id": "9",
                "image": None,
                "original_url": "https://img01.ztat.net/article/spp-media-p1/f62969795e1a4c66b03cac9057a3e6d1/3a3c2cb3cb4d4c869cb04daf7c1f802d.jpg?imwidth=1800",
                "is_primary": False
            },
            {
                "id": "10",
                "image": None,
                "original_url": "https://img01.ztat.net/article/spp-media-p1/0811e2e3a2cc4c2680b472dae56859ee/040fd85a18f5414c840c996d0a137be6.jpg?imwidth=1800",
                "is_primary": False
            },
            {
                "id": "11",
                "image": None,
                "original_url": "https://img01.ztat.net/article/spp-media-p1/ba2e439f637a4467bb8800e0334f167c/dab5a07eee48454d91c9366bbef71695.jpg?imwidth=1800",
                "is_primary": False
            }
        ],
        "shop_product_id": "EL121C00H-Q11",
        "url": "https://www.zalando.de/elara-abaya",
        "item_type": "dress",
        "description": "ABAYA",
        "details": [
            {"key": "Material", "value": "Polyester"},
            {"key": "Style", "value": "Traditional"},
            {"key": "Occasion", "value": "Formal"}
        ],
        "about": "Traditional abaya in elegant design, suitable for formal occasions.",
        "price": "40.49",
        "currency": "EUR",
        "color": "Black",
        "availability": {"in_stock": True, "sizes": ["S", "M", "L"]},
        "created_at": "2025-01-13T14:20:00Z",
        "updated_at": "2025-01-13T14:20:00Z",
        "is_embedded": True
    },
    {
        "id": "4",
        "shop": {
            "id": 4,
            "name": "Mango",
            "base_url": "https://shop.mango.com"
        },
        "category": {
            "id": 5,
            "name": "Satin Dresses",
            "url": "https://shop.mango.com/dresses/satin",
            "shop": {
                "id": 4,
                "name": "Mango",
                "base_url": "https://shop.mango.com"
            },
            "parent": {
                "id": 6,
                "name": "Dresses",
                "url": "https://shop.mango.com/dresses",
                "shop": {
                    "id": 4,
                    "name": "Mango",
                    "base_url": "https://shop.mango.com"
                },
                "parent": None
            }
        },
        "brand": {
            "id": 4,
            "name": "Mango"
        },
        "images": [
            {
                "id": "12",
                "image": None,
                "original_url": "https://shop.mango.com/assets/rcs/pics/static/T1/fotos/S/17021126_80.jpg?imwidth=960&imdensity=1&ts=1747847159439",
                "is_primary": True
            },
            {
                "id": "13",
                "image": None,
                "original_url": "https://shop.mango.com/assets/rcs/pics/static/T1/fotos/outfit/S/17021126_80-99999999_01.jpg?imwidth=960&imdensity=1&ts=1747137934780",
                "is_primary": False
            },
            {
                "id": "14",
                "image": None,
                "original_url": "https://shop.mango.com/assets/rcs/pics/static/T1/fotos/S/17021126_80_R.jpg?imwidth=960&imdensity=1&ts=1747137934780",
                "is_primary": False
            }
        ],
        "shop_product_id": "17021126_80",
        "url": "https://shop.mango.com/satin-dress-17021126.html",
        "item_type": "dress",
        "description": "Satin dress",
        "details": [
            {"key": "Material", "value": "Satin"},
            {"key": "Style", "value": "Elegant"},
            {"key": "Fit", "value": "Regular"}
        ],
        "about": "Luxurious satin dress with elegant draping, perfect for evening events.",
        "price": "79.99",
        "currency": "EUR",
        "color": "Champagne",
        "availability": {"in_stock": True, "sizes": ["XS", "S", "M", "L", "XL"]},
        "created_at": "2025-01-12T11:45:00Z",
        "updated_at": "2025-01-12T11:45:00Z",
        "is_embedded": False
    },
    {
        "id": "5",
        "shop": {
            "id": 1,
            "name": "NA-KD",
            "base_url": "https://www.na-kd.com"
        },
        "category": {
            "id": 7,
            "name": "Maxi Dresses",
            "url": "https://www.na-kd.com/maxi-dresses",
            "shop": {
                "id": 1,
                "name": "NA-KD",
                "base_url": "https://www.na-kd.com"
            },
            "parent": {
                "id": 1,
                "name": "Dresses",
                "url": "https://www.na-kd.com/dresses",
                "shop": {
                    "id": 1,
                    "name": "NA-KD",
                    "base_url": "https://www.na-kd.com"
                },
                "parent": None
            }
        },
        "brand": {
            "id": 1,
            "name": "NA-KD"
        },
        "images": [
            {
                "id": "15",
                "image": None,
                "original_url": "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/cotton_maxi_shirt_dress-1100-011093-0005_3600.jpg",
                "is_primary": True
            },
            {
                "id": "16",
                "image": None,
                "original_url": "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/cotton_maxi_shirt_dress-1100-011093-0005_3536.jpg",
                "is_primary": False
            },
            {
                "id": "17",
                "image": None,
                "original_url": "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/cotton_maxi_shirt_dress-1100-011093-0005_3579.jpg",
                "is_primary": False
            },
            {
                "id": "18",
                "image": None,
                "original_url": "https://www.na-kd.com/cdn-cgi/image/quality=80,sharpen=0.3,width=846/globalassets/cotton_maxi_shirt_dress-1100-011093-0005_19564_flatlay.jpg",
                "is_primary": False
            }
        ],
        "shop_product_id": "1100-011093-0005",
        "url": "https://www.na-kd.com/en/na-kd/cotton-maxi-shirt-dress",
        "item_type": "dress",
        "description": "Midi Shirt",
        "details": [
            {"key": "Material", "value": "100% Cotton"},
            {"key": "Style", "value": "Shirt Dress"},
            {"key": "Length", "value": "Maxi"}
        ],
        "about": "Classic cotton maxi shirt dress with button-down front, versatile for any occasion.",
        "price": "55.95",
        "currency": "EUR",
        "color": "White",
        "availability": {"in_stock": True, "sizes": ["XS", "S", "M", "L"]},
        "created_at": "2025-01-11T16:10:00Z",
        "updated_at": "2025-01-11T16:10:00Z",
        "is_embedded": True
    }
]


class LookupItemsInput(BaseModel):
    """Request curated wardrobe ideas for the user."""

    search_query: str = Field(
        description="Rich description of what to look for (e.g., fabric, silhouette, occasion, vibe)."
    )
    number_items: int = Field(
        default=3,
        ge=1,
        le=5,
        description="How many mock products to showcase (1-5)."
    )
    state: Annotated[AgentState, InjectedState]
    tool_call_id: Annotated[str, InjectedToolCallId]


class OpenAestheticsInput(BaseModel):
    """Launch the Open Aesthetics style quiz widget."""
    state: Annotated[AgentState, InjectedState]
    tool_call_id: Annotated[str, InjectedToolCallId]


class UploadImagesInput(BaseModel):
    """Prompt the user to upload reference photos of themselves."""
    state: Annotated[AgentState, InjectedState]
    tool_call_id: Annotated[str, InjectedToolCallId]


class UploadClosetItemsInput(BaseModel):
    """Prompt the user to digitize items from their closet."""
    state: Annotated[AgentState, InjectedState]
    tool_call_id: Annotated[str, InjectedToolCallId]


class FinishOnboardingInput(BaseModel):
    """Prompt the user to finish the onboarding process."""
    state: Annotated[AgentState, InjectedState]
    tool_call_id: Annotated[str, InjectedToolCallId]


def _get_user_reference(state: AgentState | None) -> str:
    if state and state.get("user_name"):
        return state["user_name"]
    return "the user"


def _build_widget_message(tool_name: str, payload: dict[str, Any], tool_call_id: str | None) -> ToolMessage:
    return ToolMessage(
        content=json.dumps(payload),
        tool_call_id=tool_call_id,
        name=tool_name,
    )


@tool(args_schema=DrawSetup)
def draw_setup(
    primitives_sequence: list[str],
    state: Annotated[AgentState, InjectedState] = None,
    tool_call_id: Annotated[str, InjectedToolCallId] = None
) -> Command:
    """
    Draw a setup chart using fundamental primitives
    """
    # Validate primitives
    valid_primitives = ["su", "wn", "se", "hz", "sd", "ne", "ws"]
    invalid_primitives = [
        p for p in primitives_sequence if p not in valid_primitives]

    if invalid_primitives:
        content = f"Invalid primitives found: {invalid_primitives}. Valid primitives are: {valid_primitives}"
    else:
        # Process the primitives sequence to create the chart
        content = f"""
        Setup chart drawn successfully with the following sequence:
        {' -> '.join(primitives_sequence)}
        
        Chart primitives breakdown:
        {chr(10).join([f"- {p}: {get_primitive_description(p)}" for p in primitives_sequence])}
        """

    tool_message = ToolMessage(
        content=content,
        tool_call_id=tool_call_id,
        name="draw_setup",
    )

    return Command(update={
        "messages": [tool_message],
    })


@tool(args_schema=LookupItemsInput)
def lookup_items(
    search_query: str,
    number_items: int = 3,
    state: Annotated[AgentState, InjectedState] = None,
    tool_call_id: Annotated[str, InjectedToolCallId] = None
) -> Command:
    """Surface mock wardrobe options that match the described brief."""

    returned_items = MOCK_WIDGET_PRODUCTS[:number_items]
    if not returned_items:
        returned_items = MOCK_WIDGET_PRODUCTS[:1]

    user_ref = _get_user_reference(state)
    summary = (
        f"Show {user_ref} {len(returned_items)} option(s) inspired by '{search_query}'. "
        "Highlight why each piece answers their brief."
    )

    payload = {
        "widget": "lookup_items",
        "search_query": search_query,
        "requested_items": number_items,
        "returned_items": len(returned_items),
        "items": returned_items,
        "summary": summary,
        "source": "mock_catalog_placeholder"
    }

    tool_message = _build_widget_message("lookup_items", payload, tool_call_id)
    return Command(update={"messages": [tool_message]})


@tool(args_schema=OpenAestheticsInput)
def open_aesthetics(
    state: Annotated[AgentState, InjectedState] = None,
    tool_call_id: Annotated[str, InjectedToolCallId] = None
) -> Command:
    """Invite the user to complete the Open Aesthetics quiz."""

    user_ref = _get_user_reference(state)
    payload = {
        "widget": "open_aesthetics",
        "status": "ready",
        "summary": f"Prompted {user_ref} to run the Open Aesthetics quiz.",
        "instructions": "Do not type anything else after, the widget will handle the interaction."
    }

    tool_message = _build_widget_message(
        "open_aesthetics", payload, tool_call_id)
    return Command(update={"messages": [tool_message]})


@tool(args_schema=UploadImagesInput)
def upload_images(
    state: Annotated[AgentState, InjectedState] = None,
    tool_call_id: Annotated[str, InjectedToolCallId] = None
) -> Command:
    """Ask the user to share personal reference photos."""

    user_ref = _get_user_reference(state)
    payload = {
        "widget": "upload_images",
        "status": "awaiting_uploads",
        "summary": f"Opened the personal image uploader for {user_ref}.",
        "instructions": "Do not type anything else after, the widget will handle the interaction."
    }

    tool_message = _build_widget_message(
        "upload_images", payload, tool_call_id)
    return Command(update={"messages": [tool_message]})


@tool(args_schema=UploadClosetItemsInput)
def upload_closet_items(
    state: Annotated[AgentState, InjectedState] = None,
    tool_call_id: Annotated[str, InjectedToolCallId] = None
) -> Command:
    """Invite the user to digitize their closet items."""

    user_ref = _get_user_reference(state)
    payload = {
        "widget": "upload_closet_items",
        "status": "awaiting_uploads",
        "summary": f"Opened the closet uploader for {user_ref}.",
        "instructions": "Do not type anything else after, the widget will handle the interaction."
    }

    tool_message = _build_widget_message(
        "upload_closet_items", payload, tool_call_id)
    return Command(update={"messages": [tool_message]})


@tool(args_schema=FinishOnboardingInput)
def finish_onboarding(
    state: Annotated[AgentState, InjectedState] = None,
    tool_call_id: Annotated[str, InjectedToolCallId] = None
) -> Command:
    """Prompt the user to finish the onboarding process."""

    user_ref = _get_user_reference(state)
    payload = {
        "widget": "finish_onboarding",
        "status": "awaiting_completion",
        "summary": f"Prompted {user_ref} to finish the onboarding process.",
        "instructions": "Do not type anything else after, the widget will handle the interaction."
    }

    tool_message = _build_widget_message(
        "finish_onboarding", payload, tool_call_id)
    return Command(update={"messages": [tool_message]})


def get_primitive_description(primitive: str) -> str:
    """Get description for a primitive"""
    descriptions = {
        "su": "straight up movement",
        "wn": "west to north upward line",
        "se": "south east upward line",
        "hz": "horizontal line",
        "sd": "straight down movement",
        "ne": "north to east downward line",
        "ws": "west to south downward line"
    }
    return descriptions.get(primitive, "unknown primitive")


WIDGET_TOOLS = [
    "draw_setup",
    "lookup_items",
    "open_aesthetics",
    "upload_images",
    "upload_closet_items",
    "finish_onboarding"
]
