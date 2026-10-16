from pydantic import BaseModel
from typing import List, Optional, Dict
from enum import Enum


class Message(BaseModel):
    class MSGType(Enum):
        TEXT = "text"
        TOOL_CALL = "tool_call"
        META = "meta_prompt"
        
    class Sender(Enum):
        USER = "user"
        AGENT = "agent"
    id: str
    thread_id: Optional[str] = None
    sender: Sender
    msg_type: MSGType = MSGType.TEXT
    content: str
    
class ConversationKeywords(BaseModel):
    city: str
    gender: str
    age_group: str
    lifestyle_1: str
    lifestyle_2: str
    style_1: str
    style_2: str
    fit_1: str
    fit_2: str
    budget: str