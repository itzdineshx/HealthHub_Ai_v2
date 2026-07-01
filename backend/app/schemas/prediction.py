from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime

class DiabetesPredictionInput(BaseModel):
    glucose: float = Field(..., description="Plasma glucose concentration")
    bmi: float = Field(..., description="Body mass index (weight in kg/(height in m)^2)")
    age: float = Field(..., description="Age in years")
    diabetes_pedigree: float = Field(..., alias="diabetes_pedigree_function", description="Diabetes pedigree function score")

class HeartPredictionInput(BaseModel):
    age: float = Field(..., description="Age in years")
    sex: int = Field(..., description="Sex (1 = male, 0 = female)")
    chest_pain_type: int = Field(..., alias="cp", description="Chest pain type (0, 1, 2, 3)")
    resting_bp: float = Field(..., alias="trestbps", description="Resting blood pressure (mmHg)")
    max_heart_rate: float = Field(..., alias="thalach", description="Maximum heart rate achieved (bpm)")
    exercise_angina: int = Field(..., alias="exang", description="Exercise induced angina (1 = yes, 0 = no)")

class PredictionDoc(BaseModel):
    user_id: str
    disease_name: str
    risk_score: float # Probability as percentage 0-100
    factors: Dict[str, Any]
    recommendations: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
