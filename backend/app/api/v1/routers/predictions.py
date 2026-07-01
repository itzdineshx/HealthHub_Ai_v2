from fastapi import APIRouter, Depends, HTTPException, status
from app.services.prediction_service import PredictionService
from app.schemas.prediction import DiabetesPredictionInput, HeartPredictionInput
from app.core.firebase import get_current_user
from typing import List, Dict, Any, Optional

router = APIRouter()
prediction_service = PredictionService()

@router.post("/diabetes")
async def evaluate_diabetes_risk(
    payload: DiabetesPredictionInput,
    current_user_uid: str = Depends(get_current_user)
):
    """
    Evaluates diabetes risk based on medical parameters using Random Forest model.
    """
    try:
        result = await prediction_service.predict_diabetes(current_user_uid, payload)
        # Convert _id to string for JSON serialization
        result["_id"] = str(result["_id"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/heart")
async def evaluate_heart_risk(
    payload: HeartPredictionInput,
    current_user_uid: str = Depends(get_current_user)
):
    """
    Evaluates heart disease risk based on clinical parameters using Logistic Regression model.
    """
    try:
        result = await prediction_service.predict_heart_disease(current_user_uid, payload)
        result["_id"] = str(result["_id"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_prediction_history(
    disease: Optional[str] = None,
    current_user_uid: str = Depends(get_current_user)
):
    """
    Retrieves previous risk assessments for the authenticated patient.
    """
    history = await prediction_service.get_user_prediction_history(current_user_uid, disease)
    for doc in history:
        doc["_id"] = str(doc["_id"])
    return history
