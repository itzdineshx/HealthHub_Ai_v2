import os
import joblib
import pandas as pd
from app.repositories.base_repo import BaseRepository
from app.services.timeline_service import TimelineService
from app.schemas.prediction import DiabetesPredictionInput, HeartPredictionInput, PredictionDoc
from typing import Dict, Any, List, Optional

class PredictionService:
    def __init__(self):
        self.repo = BaseRepository("predictions")
        self.timeline_service = TimelineService()
        
        # Load models
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Paths to models
        # Note: The original names in list-files are:
        # tuned_models/diabetes_rf_model.joblib
        # tuned_models/heart_logreg_model.joblib
        self.diabetes_model_path = os.path.join(base_dir, "..", "..", "tuned_models", "diabetes_rf_model.joblib")
        self.heart_model_path = os.path.join(base_dir, "..", "..", "tuned_models", "heart_logreg_model.joblib")

        self.diabetes_model = None
        self.heart_model = None
        
        # Safe loading
        try:
            if os.path.exists(self.diabetes_model_path):
                self.diabetes_model = joblib.load(self.diabetes_model_path)
            if os.path.exists(self.heart_model_path):
                self.heart_model = joblib.load(self.heart_model_path)
        except Exception as e:
            print(f"Error loading prediction models: {str(e)}")

    async def predict_diabetes(self, user_id: str, input_data: DiabetesPredictionInput) -> Dict[str, Any]:
        """
        Uses diabetes Random Forest model to predict risk probability.
        """
        if not self.diabetes_model:
            raise ValueError("Diabetes ML model is not loaded/available on backend")

        # Prep feature dataframe
        # Features order must match exactly: Glucose, BMI, Age, DiabetesPedigreeFunction
        data_df = pd.DataFrame([{
            "Glucose": input_data.glucose,
            "BMI": input_data.bmi,
            "Age": input_data.age,
            "DiabetesPedigreeFunction": input_data.diabetes_pedigree
        }])

        # Run inference
        prob = self.diabetes_model.predict_proba(data_df)[0][1] # Probability of class 1 (diabetes)
        risk_score = round(prob * 100, 2)
        
        # Calculate risk level and guidelines
        if risk_score > 70:
            risk_level = "High"
            recommendations = [
                "Schedule a fasting blood glucose and HbA1c test with a clinic.",
                "Reduce refined carbohydrate and sugar intake immediately.",
                "Engage in 30 minutes of moderate aerobic exercise daily.",
                "Consult with an endocrinologist."
            ]
        elif risk_score > 35:
            risk_level = "Moderate"
            recommendations = [
                "Monitor blood sugar levels weekly.",
                "Adopt a high-fiber, low-glycemic index diet.",
                "Aim for a active physical routine (at least 150 mins per week).",
                "Review lifestyle habits with a health coach."
            ]
        else:
            risk_level = "Low"
            recommendations = [
                "Maintain your current healthy balanced diet.",
                "Keep a consistent workout routine.",
                "Schedule routine check-ups annually."
            ]

        # Save to database
        factors = {
            "glucose": input_data.glucose,
            "bmi": input_data.bmi,
            "age": input_data.age,
            "diabetes_pedigree": input_data.diabetes_pedigree
        }
        
        doc = PredictionDoc(
            user_id=user_id,
            disease_name="diabetes",
            risk_score=risk_score,
            factors=factors,
            recommendations=recommendations
        )
        
        db_doc = await self.repo.create(doc.model_dump())
        
        # Log to timeline
        await self.timeline_service.log_event(
            user_id=user_id,
            event_type="prediction_completed",
            title="Diabetes Assessment Completed",
            description=f"Risk evaluated as {risk_level} ({risk_score}% probability).",
            metadata={"prediction_id": str(db_doc["_id"]), "risk_level": risk_level}
        )
        
        return db_doc

    async def predict_heart_disease(self, user_id: str, input_data: HeartPredictionInput) -> Dict[str, Any]:
        """
        Uses heart Logistic Regression model to predict risk probability.
        """
        if not self.heart_model:
            raise ValueError("Heart Disease ML model is not loaded/available on backend")

        # Features order must match exactly: age, sex, cp, trestbps, thalach, exang
        data_df = pd.DataFrame([{
            "age": input_data.age,
            "sex": input_data.sex,
            "cp": input_data.chest_pain_type,
            "trestbps": input_data.resting_bp,
            "thalach": input_data.max_heart_rate,
            "exang": input_data.exercise_angina
        }])

        prob = self.heart_model.predict_proba(data_df)[0][1]
        risk_score = round(prob * 100, 2)
        
        if risk_score > 70:
            risk_level = "High"
            recommendations = [
                "Contact a cardiologist immediately for a comprehensive cardiac evaluation.",
                "Rest from strenuous physical labor until cleared by a doctor.",
                "Avoid high-sodium meals and heavy mental/physical strain.",
                "Ensure emergency contacts are accessible."
            ]
        elif risk_score > 35:
            risk_level = "Moderate"
            recommendations = [
                "Schedule a routine lipid profile and ECG.",
                "Adopt a heart-healthy diet (low saturated fats, high Mediterranean-style greens).",
                "Engage in light cardio workouts like walking under professional supervision.",
                "Limit caffeine and check blood pressure daily."
            ]
        else:
            risk_level = "Low"
            recommendations = [
                "Continue standard cardiovascular conditioning workouts.",
                "Maintain a diet rich in unsaturated fats, nuts, and fresh fish.",
                "Monitor resting heart rate metrics using connected devices."
            ]

        factors = {
            "age": input_data.age,
            "sex": input_data.sex,
            "chest_pain_type": input_data.chest_pain_type,
            "resting_bp": input_data.resting_bp,
            "max_heart_rate": input_data.max_heart_rate,
            "exercise_angina": input_data.exercise_angina
        }
        
        doc = PredictionDoc(
            user_id=user_id,
            disease_name="heart-disease",
            risk_score=risk_score,
            factors=factors,
            recommendations=recommendations
        )
        
        db_doc = await self.repo.create(doc.model_dump())
        
        # Log to timeline
        await self.timeline_service.log_event(
            user_id=user_id,
            event_type="prediction_completed",
            title="Cardiovascular Assessment Completed",
            description=f"Heart disease risk evaluated as {risk_level} ({risk_score}% probability).",
            metadata={"prediction_id": str(db_doc["_id"]), "risk_level": risk_level}
        )
        
        return db_doc
        
    async def get_user_prediction_history(self, user_id: str, disease_name: Optional[str] = None) -> List[Dict[str, Any]]:
        query = {"user_id": user_id}
        if disease_name:
            query["disease_name"] = disease_name
        return await self.repo.find(filter_query=query, sort_by="created_at", sort_desc=True)
