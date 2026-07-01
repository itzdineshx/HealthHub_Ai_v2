from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime

class TimelineEventDoc(BaseModel):
    user_id: str = Field(..., description="Firebase UID of the patient")
    event_type: str = Field(..., description="Type of event e.g. appointment_booked, report_uploaded, record_added")
    title: str
    description: str
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Contextual key-values for details")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
