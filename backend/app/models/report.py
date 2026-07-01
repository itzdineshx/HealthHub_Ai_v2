from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DocumentFileDoc(BaseModel):
    user_id: str = Field(..., description="Firebase UID of user")
    file_name: str
    file_path: str = Field(..., description="Firebase Storage path reference")
    file_type: str # MIME type
    file_size: int # Bytes
    category: str # e.g. "Medical Record", "Lab Result", "Prescription"
    notes: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
