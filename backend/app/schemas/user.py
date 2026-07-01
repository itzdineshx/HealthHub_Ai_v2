from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    uid: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    profile_completed: Optional[bool] = None

class UserResponse(UserBase):
    uid: str
    role: str
    status: str
    profile_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True

class PatientProfileUpdate(BaseModel):
    blood_group: Optional[str] = None
    allergies: Optional[List[str]] = None
    chronic_conditions: Optional[List[str]] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None

class PatientProfileResponse(BaseModel):
    uid: str
    blood_group: Optional[str]
    allergies: List[str]
    chronic_conditions: List[str]
    emergency_contact_name: Optional[str]
    emergency_contact_phone: Optional[str]
    date_of_birth: Optional[str]
    gender: Optional[str]
    height: Optional[float]
    weight: Optional[float]
    
    class Config:
        from_attributes = True
