from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    patient = "patient"
    doctor = "doctor"
    nurse = "nurse"
    hospital_admin = "hospital_admin"
    super_admin = "super_admin"

class UserStatus(str, Enum):
    active = "active"
    suspended = "suspended"
    pending = "pending"

class UserDoc(BaseModel):
    uid: str = Field(..., description="Firebase authentication UID")
    email: EmailStr
    name: str
    role: UserRole = UserRole.patient
    status: UserStatus = UserStatus.active
    profile_completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PatientProfileDoc(BaseModel):
    uid: str = Field(..., description="Firebase UID reference")
    blood_group: Optional[str] = None
    allergies: List[str] = []
    chronic_conditions: List[str] = []
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    height: Optional[float] = None # cm
    weight: Optional[float] = None # kg
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class DoctorProfileDoc(BaseModel):
    uid: str = Field(..., description="Firebase UID reference")
    specialty: str
    license_number: str
    hospital_id: Optional[str] = None # Reference to Hospital
    is_verified: bool = False
    availability: List[str] = [] # E.g. ["Monday 09:00-17:00"]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
