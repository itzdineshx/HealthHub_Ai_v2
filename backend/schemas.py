from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime, date

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type, _handler):
        from pydantic_core import core_schema
        return core_schema.str_schema()

# Auth schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str = "patient"
    
class UserCreate(UserBase):
    uid: str # Firebase UID

class UserResponse(UserBase):
    id: PyObjectId = Field(alias="_id")
    profile_completed: bool
    created_at: datetime
    
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

# Health record schemas
class HealthRecordBase(BaseModel):
    record_type: str
    value: float
    unit: str
    notes: Optional[str] = None

class HealthRecordCreate(HealthRecordBase):
    user_id: str

class HealthRecordResponse(HealthRecordBase):
    id: PyObjectId = Field(alias="_id")
    user_id: str
    recorded_at: datetime
    
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

# Risk Assessment Schemas
class RiskReportResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    patient_id: str
    date: datetime
    risk_level: str
    details: str
    
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class DoctorAdviceResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    patient_id: str
    doctor_id: str
    advice: str
    created_at: datetime
    
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)
