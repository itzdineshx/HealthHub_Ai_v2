from pydantic import BaseModel, Field
from typing import List, Dict, Any
from datetime import datetime

class ChatMessage(BaseModel):
    sender: str # "user" or "ai"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ConversationDoc(BaseModel):
    user_id: str = Field(..., description="Firebase UID of the patient")
    messages: List[ChatMessage] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
